"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database, PlaybackState } from "@/lib/types/database";
import {
  getOrCreateParticipantId,
  getStoredDisplayName,
  setStoredDisplayName,
} from "@/lib/utils/participant";
import { NameInstrumentDialog } from "@/components/room/NameInstrumentDialog";
import { ParticipantList } from "@/components/room/ParticipantList";
import { HostControls } from "@/components/room/HostControls";
import { InstrumentSwitcher } from "@/components/room/InstrumentSwitcher";
import { SongStage } from "@/components/room/SongStage";
import { usePlaybackSync } from "@/lib/hooks/usePlaybackSync";
import Link from "next/link";

type Room = Database["public"]["Tables"]["rooms"]["Row"];
type Song = Database["public"]["Tables"]["songs"]["Row"];
type Participant = Database["public"]["Tables"]["room_participants"]["Row"];

interface Props {
  room: Room;
  initialSong: Song | null;
  isHost: boolean;
  currentUserId: string | null;
}

export function RoomView({ room, initialSong, isHost, currentUserId }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [participantId, setParticipantId] = useState<string>("");
  const [me, setMe] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [song, setSong] = useState<Song | null>(initialSong);
  const [playback, setPlayback] = useState<PlaybackState>(room.playback_state);
  const [needsJoin, setNeedsJoin] = useState(true);

  const pidRef = useRef<string>("");

  useEffect(() => {
    const pid = getOrCreateParticipantId();
    setParticipantId(pid);
    pidRef.current = pid;
  }, []);

  useEffect(() => {
    if (!participantId) return;

    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("room_participants")
        .select("*")
        .eq("room_id", room.id);

      if (cancelled) return;
      setParticipants(data ?? []);

      const mine = (data ?? []).find((p) => p.participant_id === participantId);
      if (mine) {
        setMe(mine);
        setNeedsJoin(false);
      }
    })();

    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_participants",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          setParticipants((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Participant;
              if (prev.some((p) => p.participant_id === row.participant_id))
                return prev;
              return [...prev, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Participant;
              return prev.map((p) =>
                p.participant_id === row.participant_id ? row : p,
              );
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as Participant;
              return prev.filter(
                (p) => p.participant_id !== row.participant_id,
              );
            }
            return prev;
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        async (payload) => {
          const updated = payload.new as Room;
          setPlayback(updated.playback_state);
          if (updated.current_song_id !== song?.id) {
            if (!updated.current_song_id) {
              setSong(null);
            } else {
              const { data } = await supabase
                .from("songs")
                .select("*")
                .eq("id", updated.current_song_id)
                .maybeSingle();
              setSong(data ?? null);
            }
          }
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [participantId, room.id, supabase, song?.id]);

  useEffect(() => {
    if (!participantId) return;
    const handler = () => {
      navigator.sendBeacon?.(
        `/api/room/${room.id}/leave`,
        new Blob([JSON.stringify({ participantId })], {
          type: "application/json",
        }),
      );
    };
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [participantId, room.id]);

  const { audioRef, onHostPlay, onHostPause, onHostSeek } = usePlaybackSync({
    isHost,
    roomId: room.id,
    song,
    playback,
  });

  async function handleJoin(
    displayName: string,
    instrument: string,
    style: string,
  ) {
    setStoredDisplayName(displayName);
    const { data, error } = await supabase
      .from("room_participants")
      .upsert(
        {
          room_id: room.id,
          participant_id: participantId,
          display_name: displayName,
          instrument,
          style,
        },
        { onConflict: "room_id,participant_id" },
      )
      .select()
      .single();

    if (!error && data) {
      setMe(data);
      setNeedsJoin(false);
    }
  }

  async function handleInstrumentChange(instrument: string, style: string) {
    if (!me) return;
    const { data } = await supabase
      .from("room_participants")
      .update({ instrument, style })
      .eq("room_id", room.id)
      .eq("participant_id", participantId)
      .select()
      .single();
    if (data) setMe(data);
  }

  if (needsJoin) {
    return (
      <NameInstrumentDialog
        initialName={getStoredDisplayName()}
        onSubmit={handleJoin}
        roomCode={room.code}
      />
    );
  }

  return (
    <main className="relative flex min-h-dvh flex-col safe-top safe-bottom">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <Link href="/" className="text-xs text-text-dim">
            ← Home
          </Link>
          <div className="mt-0.5 text-sm text-text-muted">
            Room{" "}
            <span className="font-mono tracking-[0.3em] text-accent">
              {room.code}
            </span>
          </div>
        </div>
        {me ? (
          <InstrumentSwitcher
            instrument={me.instrument ?? "acoustic_guitar"}
            style={me.style ?? "rhythm"}
            onChange={handleInstrumentChange}
          />
        ) : null}
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <SongStage
          song={song}
          playback={playback}
          instrument={me?.instrument ?? "acoustic_guitar"}
          style={me?.style ?? "rhythm"}
          audioRef={audioRef}
        />
      </div>

      <div className="border-t border-border bg-bg-raised px-4 py-3">
        <ParticipantList participants={participants} currentPid={participantId} />
      </div>

      {isHost ? (
        <HostControls
          room={room}
          song={song}
          playback={playback}
          onPlay={onHostPlay}
          onPause={onHostPause}
          onSeek={onHostSeek}
          userId={currentUserId!}
        />
      ) : null}
    </main>
  );
}
