"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database, Instrument, PlaybackState } from "@/lib/types/database";
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
import { AppRail } from "@/components/ui/AppNav";
import { usePlaybackSync } from "@/lib/hooks/usePlaybackSync";
import { instrumentLabel, stylesFor } from "@/lib/instruments";
import { getInitials } from "@/lib/utils/initials";
import { Copy } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

  function copyInvite() {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  function styleLabel(instrument?: string | null, style?: string | null) {
    if (!instrument) return "";
    return (
      stylesFor(instrument).find((s) => s.value === style)?.label ?? style ?? ""
    );
  }

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
          instrument: instrument as Instrument,
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
      .update({ instrument: instrument as Instrument, style })
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
    <div className="flex h-dvh overflow-hidden bg-bg text-text">
      <AppRail />
      <div className="flex min-w-0 flex-1 flex-col safe-top">
        {/* top bar */}
        <header className="flex flex-shrink-0 items-center gap-3 border-b border-line-soft px-4 py-3 md:gap-4">
          <Link
            href="/"
            aria-label="Home"
            className="text-text-dim hover:text-text md:hidden"
          >
            ←
          </Link>
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
              Jam Together
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="font-mono text-[15px] font-semibold tracking-[0.25em] text-jam">
                {room.code}
              </span>
              <button
                type="button"
                onClick={copyInvite}
                aria-label="Copy invite link"
                className="text-text-dim hover:text-jam"
              >
                <Copy className="size-[13px]" strokeWidth={1.8} />
              </button>
            </div>
          </div>
          <span className="hidden rounded-full border border-jam/20 bg-jam/[0.06] px-3 py-1 text-[11px] text-jam sm:inline">
            ● Live · {participants.length} in the room
          </span>
          <span className="rounded-full border border-jam/20 bg-jam/[0.06] px-2.5 py-1 text-[10px] text-jam sm:hidden">
            ● {participants.length} live
          </span>
          <div className="ml-auto">
            {me ? (
              <InstrumentSwitcher
                instrument={me.instrument ?? "acoustic_guitar"}
                style={me.style ?? "rhythm"}
                onChange={handleInstrumentChange}
              />
            ) : null}
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* stage column */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <SongStage
              song={song}
              playback={playback}
              instrument={me?.instrument ?? "acoustic_guitar"}
              style={me?.style ?? "rhythm"}
              audioRef={audioRef}
            />
          </div>

          {/* band panel (desktop) */}
          <aside className="hidden w-72 shrink-0 flex-col gap-3 overflow-y-auto border-l border-line-soft p-4 lg:flex">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim">
              Band · {participants.length}
            </div>
            <div className="flex flex-col gap-1.5">
              {participants.map((p) => {
                const isMe = p.participant_id === participantId;
                return (
                  <div
                    key={p.participant_id}
                    className={
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 " +
                      (isMe
                        ? "border-jam/25 bg-jam/[0.06]"
                        : "border-line-soft")
                    }
                  >
                    <div
                      className={
                        "flex size-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold " +
                        (isMe
                          ? "bg-[#173330] text-jam"
                          : "bg-bg-higher text-text-soft")
                      }
                    >
                      {getInitials(p.display_name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold">
                        {p.display_name}
                        {isMe ? (
                          <span className="ml-1.5 text-[10px] font-semibold text-jam">
                            YOU{isHost ? " · HOST" : ""}
                          </span>
                        ) : null}
                      </div>
                      <div className="truncate text-[11px] text-text-muted">
                        {instrumentLabel(p.instrument)}
                        {styleLabel(p.instrument, p.style)
                          ? ` · ${styleLabel(p.instrument, p.style)}`
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-auto rounded-2xl border border-line bg-bg-raised p-3.5 text-center">
              <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                Invite with code
              </div>
              <div className="my-2 font-mono text-[26px] font-semibold tracking-[0.2em] text-jam">
                {room.code}
              </div>
              <button
                type="button"
                onClick={copyInvite}
                className="flex h-9 w-full items-center justify-center rounded-[10px] border border-jam/30 text-xs font-semibold text-jam transition-colors hover:bg-jam/10"
              >
                {copied ? "Copied!" : "Copy invite link"}
              </button>
            </div>
          </aside>
        </div>

        {/* participants (mobile / tablet) */}
        <div className="border-t border-line-soft bg-[#0d0d11] px-4 py-2.5 lg:hidden">
          <ParticipantList
            participants={participants}
            currentPid={participantId}
          />
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
      </div>
    </div>
  );
}
