"use client";

import { Minus, Plus } from "lucide-react";
import { QUALITIES, ROOTS, chordSymbol } from "@/lib/music/chord";
import { cn } from "@/lib/utils/cn";
import { Pill } from "./Pill";

interface ChordGridProps {
  root: string;
  quality: string;
  octave: number;
  pitched: boolean;
  onRoot: (root: string) => void;
  onQuality: (quality: string) => void;
  onOctave: (octave: number) => void;
}

export function ChordGrid({
  root,
  quality,
  octave,
  pitched,
  onRoot,
  onQuality,
  onOctave,
}: ChordGridProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
          Chord
        </h2>
        {pitched ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-dim">Octave</span>
            <button
              type="button"
              aria-label="Lower octave"
              onClick={() => onOctave(Math.max(1, octave - 1))}
              className="grid size-9 place-items-center rounded-lg border border-border bg-bg-raised hover:bg-bg-higher"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-5 text-center font-mono text-sm">{octave}</span>
            <button
              type="button"
              aria-label="Raise octave"
              onClick={() => onOctave(Math.min(6, octave + 1))}
              className="grid size-9 place-items-center rounded-lg border border-border bg-bg-raised hover:bg-bg-higher"
            >
              <Plus className="size-4" />
            </button>
          </div>
        ) : null}
      </div>

      {pitched ? (
        <>
          {/* Roots: 6-col grid wraps cleanly on phones */}
          <div className="grid grid-cols-6 gap-2">
            {ROOTS.map((r) => (
              <Pill
                key={r}
                active={r === root}
                onClick={() => onRoot(r)}
                className="px-0"
              >
                {r}
              </Pill>
            ))}
          </div>

          {/* Quality variations: horizontally scrollable */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {QUALITIES.map((q) => (
              <Pill
                key={q.id}
                active={q.id === quality}
                onClick={() => onQuality(q.id)}
                className="snap-start"
              >
                {chordSymbol(root, q.id) || `${root}maj`}
              </Pill>
            ))}
          </div>

          <div
            className={cn(
              "mt-4 rounded-2xl border border-border bg-bg-raised py-6 text-center",
            )}
          >
            <span className="text-4xl font-bold tracking-tight">
              {chordSymbol(root, quality)}
            </span>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-bg-raised py-6 text-center text-text-muted">
          Drums don&apos;t use chords — pick a groove below.
        </div>
      )}
    </section>
  );
}
