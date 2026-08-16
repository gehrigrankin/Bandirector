"use client";

import { cn } from "@/lib/utils/cn";
import {
  chordSymbol,
  diatonicChords,
  extendQuality,
  noteToSemitone,
  type ChordExt,
  type Mode,
} from "@/lib/music/chord";

interface Props {
  tonic: string;
  mode: Mode;
  /** Active chord colour — diatonic names render as 7ths/9ths to match. */
  ext: ChordExt;
  current: { root: string; quality: string };
  onPick: (root: string, quality: string) => void;
  layout?: "row" | "grid";
  title?: string;
}

export function DiatonicChords({
  tonic,
  mode,
  ext,
  current,
  onPick,
  layout = "row",
  title = "Chords in key",
}: Props) {
  const chords = diatonicChords(tonic, mode);
  const curRoot = noteToSemitone(current.root);
  return (
    <section>
      <h2 className="mb-2.5 font-display text-base font-semibold text-text">
        {title}
      </h2>
      <div
        className={cn(
          layout === "grid"
            ? "grid grid-cols-4 gap-2 sm:grid-cols-7"
            : "-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1",
        )}
      >
        {chords.map((c, i) => {
          const active =
            noteToSemitone(c.root) === curRoot && c.quality === current.quality;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(c.root, c.quality)}
              aria-pressed={active}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-xl border px-2 transition-colors",
                layout === "row" && "min-w-16 shrink-0 snap-start px-3",
                active
                  ? "border-accent bg-accent text-black"
                  : "border-line bg-bg-raised text-text hover:bg-bg-higher",
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
              <span className="font-display text-base font-semibold leading-tight">
                {chordSymbol(c.root, extendQuality(c.root, c.quality, tonic, mode, ext))}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
