"use client";

import { cn } from "@/lib/utils/cn";
import {
  chordSymbol,
  diatonicChords,
  noteToSemitone,
  type Mode,
} from "@/lib/music/chord";

interface Props {
  tonic: string;
  mode: Mode;
  current: { root: string; quality: string };
  onPick: (root: string, quality: string) => void;
}

export function DiatonicChords({ tonic, mode, current, onPick }: Props) {
  const chords = diatonicChords(tonic, mode);
  const curRoot = noteToSemitone(current.root);
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">
        Chords in key
      </h2>
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {chords.map((c, i) => {
          const active =
            noteToSemitone(c.root) === curRoot && c.quality === current.quality;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(c.root, c.quality)}
              className={cn(
                "flex h-14 min-w-16 shrink-0 snap-start flex-col items-center justify-center rounded-xl border px-3 transition-colors",
                active
                  ? "border-accent bg-accent text-black"
                  : "border-border bg-bg-raised text-text hover:bg-bg-higher",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-black/70" : "text-text-dim",
                )}
              >
                {c.numeral}
              </span>
              <span className="text-base font-semibold leading-tight">
                {chordSymbol(c.root, c.quality)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
