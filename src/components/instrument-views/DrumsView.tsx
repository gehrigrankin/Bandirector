"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { DRUM_PATTERNS } from "@/lib/music/patterns";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { cn } from "@/lib/utils/cn";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

const PATTERN_GRID: Record<string, ("K" | "S" | "H" | "-")[]> = {
  rock: ["K", "H", "S", "H", "K", "H", "S", "H"],
  pop: ["K", "H", "S", "H", "K", "H", "S", "H"],
  folk: ["K", "-", "S", "-", "K", "-", "S", "-"],
  blues: ["K", "-", "S", "-", "K", "-", "S", "-"],
  funk: ["K", "H", "S", "H", "H", "S", "K", "H"],
  country: ["K", "S", "K", "S", "K", "S", "K", "S"],
  ballad: ["K", "-", "-", "-", "S", "-", "-", "-"],
  reggae: ["-", "-", "K", "-", "-", "-", "S", "-"],
  latin: ["K", "-", "K", "S", "-", "K", "K", "S"],
};

export function DrumsView({ song, positionMs, chordAt }: Props) {
  const feel = song.feel ?? song.analysis_json?.feel ?? "rock";
  const grid = PATTERN_GRID[feel] ?? PATTERN_GRID.rock;
  const label = DRUM_PATTERNS[feel];
  const bpm = Number(song.bpm) || 120;
  const slot = Math.floor((positionMs / 1000) * (bpm / 60) * 2) % grid.length;

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Drums · {Math.round(bpm)} BPM · <span className="uppercase">{feel}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="rounded-2xl border border-border bg-bg-raised p-6 text-center">
          <div className="text-xs uppercase tracking-wider text-accent">{feel}</div>
          <div className="mt-2 text-base">{label}</div>
        </div>

        <div className="flex gap-1">
          {grid.map((slot_, i) => (
            <div
              key={i}
              className={cn(
                "flex h-14 w-10 flex-col items-center justify-center rounded-md border",
                i === slot
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-border bg-bg text-text",
              )}
            >
              <span className="text-[10px] uppercase text-text-muted">
                {i + 1}
              </span>
              <span className="text-sm font-bold">{slot_ === "-" ? "·" : slot_}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-dim">
          K = kick · S = snare · H = hats · · = rest
        </p>

        {chordAt.current ? (
          <div className="text-xs text-text-muted">
            Current chord: <span className="font-semibold">{chordAt.current.chord}</span>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-bg-raised p-4">
        <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} />
      </div>
    </div>
  );
}
