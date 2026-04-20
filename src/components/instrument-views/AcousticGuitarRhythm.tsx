"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { GuitarDiagram } from "@/components/music/GuitarDiagram";
import { NextChord } from "@/components/music/NextChord";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { UnverifiedBadge } from "@/components/music/UnverifiedBadge";
import { STRUM_PATTERNS } from "@/lib/music/patterns";
import { cn } from "@/lib/utils/cn";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

export function AcousticGuitarRhythm({ song, positionMs, chordAt }: Props) {
  const feel = song.feel ?? song.analysis_json?.feel ?? "rock";
  const pattern = STRUM_PATTERNS[feel];

  const beatsPerSecond = (Number(song.bpm) || 120) / 60;
  const beatWithinBar =
    ((positionMs / 1000) * beatsPerSecond * 2) % pattern.strokes.length;

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          {song.key ?? "?"} · {song.bpm ? `${Math.round(Number(song.bpm))} BPM` : "?"} ·{" "}
          <span className="uppercase">{feel}</span>
        </div>
        <UnverifiedBadge chord={chordAt.current} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div
          className={cn(
            "text-center font-bold leading-none transition-all",
            chordAt.current?.verified ? "text-accent" : "text-text",
          )}
          style={{ fontSize: "clamp(6rem, 20vw, 12rem)" }}
        >
          {chordAt.current?.chord ?? "—"}
        </div>

        <NextChord next={chordAt.next} />

        <div className="mt-2 rounded-2xl border border-border bg-bg-raised p-4">
          <div className="mb-2 text-center text-xs uppercase tracking-wider text-text-muted">
            {pattern.label}
          </div>
          <div className="flex gap-2">
            {pattern.strokes.map((s, i) => {
              const active = Math.floor(beatWithinBar) === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex h-10 w-8 items-center justify-center rounded-md border text-sm font-semibold",
                    s === "-" && "opacity-30",
                    active
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border bg-bg text-text",
                  )}
                >
                  {s === "D" ? "↓" : s === "U" ? "↑" : "·"}
                </div>
              );
            })}
          </div>
        </div>

        {chordAt.current ? (
          <GuitarDiagram chord={chordAt.current.chord} size={120} />
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-bg-raised p-4">
        <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} />
      </div>
    </div>
  );
}
