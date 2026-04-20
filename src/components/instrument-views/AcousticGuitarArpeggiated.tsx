"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { GuitarDiagram } from "@/components/music/GuitarDiagram";
import { NextChord } from "@/components/music/NextChord";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { UnverifiedBadge } from "@/components/music/UnverifiedBadge";
import { cn } from "@/lib/utils/cn";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

const SEQUENCE = ["5", "4", "3", "2", "3", "4", "3", "2"] as const;

export function AcousticGuitarArpeggiated({ song, positionMs, chordAt }: Props) {
  const bps = (Number(song.bpm) || 120) / 60;
  const idx = Math.floor((positionMs / 1000) * bps * 2) % SEQUENCE.length;

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Arpeggiated · {song.key ?? "?"}
        </div>
        <UnverifiedBadge chord={chordAt.current} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div
          className="text-center font-bold leading-none"
          style={{ fontSize: "clamp(5rem, 16vw, 10rem)" }}
        >
          {chordAt.current?.chord ?? "—"}
        </div>
        <NextChord next={chordAt.next} />

        {chordAt.current ? (
          <GuitarDiagram chord={chordAt.current.chord} size={140} />
        ) : null}

        <div className="rounded-xl border border-border bg-bg-raised p-3">
          <div className="mb-2 text-center text-xs uppercase tracking-wider text-text-muted">
            String sequence
          </div>
          <div className="flex gap-2">
            {SEQUENCE.map((s, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-semibold",
                  i === idx
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-border bg-bg text-text",
                )}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-raised p-4">
        <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} />
      </div>
    </div>
  );
}
