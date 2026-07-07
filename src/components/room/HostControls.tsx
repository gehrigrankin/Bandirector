"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Pause, SkipBack, ListMusic, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database, PlaybackState } from "@/lib/types/database";
import { usePlaybackClock } from "@/lib/hooks/usePlaybackClock";
import { Button } from "@/components/ui/Button";
import { formatTime } from "@/lib/utils/time";

type Song = Database["public"]["Tables"]["songs"]["Row"];
type Room = Database["public"]["Tables"]["rooms"]["Row"];

interface Props {
  room: Room;
  song: Song | null;
  playback: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (positionMs: number) => void;
  userId: string;
}

export function HostControls({
  room,
  song,
  playback,
  onPlay,
  onPause,
  onSeek,
  userId,
}: Props) {
  const positionMs = usePlaybackClock(playback);
  const [open, setOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("songs")
        .select("*")
        .eq("status", "ready")
        .order("created_at", { ascending: false })
        .limit(50);
      setSongs(data ?? []);
    })();
  }, [open, userId]);

  async function pickSong(songId: string) {
    const supabase = createClient();
    await supabase
      .from("rooms")
      .update({
        current_song_id: songId,
        playback_state: {
          playing: false,
          position_ms: 0,
          updated_at: new Date().toISOString(),
        },
      })
      .eq("id", room.id);
    setOpen(false);
  }

  return (
    <div className="border-t border-line-soft bg-[#0d0d11]/90 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
        <Button
          size="md"
          variant="secondary"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <ListMusic className="size-4" />
          {song ? "Change song" : "Pick song"}
        </Button>

        {song ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => onSeek(0)}
              className="rounded-full border border-line p-2 text-text-muted hover:bg-bg-higher"
              aria-label="Restart"
            >
              <SkipBack className="size-4" />
            </button>
            {playback.playing ? (
              <button
                type="button"
                onClick={onPause}
                className="rounded-full bg-jam p-3 text-black shadow-glow-jam hover:bg-jam-soft"
                aria-label="Pause"
              >
                <Pause className="size-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onPlay}
                className="rounded-full bg-jam p-3 text-black shadow-glow-jam hover:bg-jam-soft"
                aria-label="Play"
              >
                <Play className="size-5" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{song.title}</div>
              <div className="text-xs text-text-muted">
                {song.artist} ·{" "}
                <span className="font-mono">{formatTime(positionMs)}</span>
              </div>
            </div>
            <Link href={`/songs/${song.id}/edit`} aria-label="Edit chords">
              <Button size="sm" variant="ghost">
                <Pencil className="size-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 text-sm text-text-muted">
            Pick a song to start jamming.
          </div>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-end bg-black/70">
          <div className="mx-auto w-full max-w-2xl rounded-t-2xl border border-line-soft bg-bg-raised p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pick a song</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-text-muted"
              >
                Close
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {songs.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-muted">
                  No songs yet.{" "}
                  <Link href="/songs/upload" className="text-jam">
                    Upload one
                  </Link>
                  .
                </p>
              ) : (
                <ul className="divide-y divide-line-soft">
                  {songs.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => pickSong(s.id)}
                        className="flex w-full items-center justify-between px-2 py-3 text-left hover:bg-bg-higher"
                      >
                        <div>
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-text-muted">
                            {s.artist}
                            {s.key ? ` · ${s.key}` : ""}
                            {s.bpm ? ` · ${Math.round(Number(s.bpm))} BPM` : ""}
                          </div>
                        </div>
                        <Play className="size-4 text-jam" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-3 border-t border-line-soft pt-3 text-center">
              <Link href="/songs/upload" className="text-sm text-jam">
                Upload a new song
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
