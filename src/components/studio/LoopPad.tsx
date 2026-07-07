"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getInstrument } from "@/lib/audio/instruments";
import { patternSummary } from "@/lib/audio/patterns";
import type { Selection } from "@/components/studio/types";

interface Props {
  selection: Selection;
  /** Progression chord names joined for display (resolved for chord colour). */
  chords: string;
  barCount: number;
  isPlaying: boolean;
  onLock: () => void;
}

export function LoopPad({ selection, chords, barCount, isPlaying, onLock }: Props) {
  const def = getInstrument(selection.instrumentId);
  return (
    <section className="rounded-2xl border border-border bg-bg-raised p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-display text-2xl font-semibold tracking-tight">
            {chords}
          </div>
          <div className="mt-1 truncate text-sm text-text-muted">
            {def.label} · {patternSummary(selection.pattern)} ·{" "}
            {barCount === 1 ? "1 bar" : `${barCount} bars`}
          </div>
        </div>
        <Button size="lg" className="shrink-0" onClick={onLock}>
          <Lock className="size-5" />
          Lock loop
        </Button>
      </div>
      <p className="mt-3 text-xs text-text-dim">
        {isPlaying
          ? "Previewing live — edit the progression, pattern or instrument to hear it. Lock to layer this part over the changes."
          : "Press Play to preview the loop, then Lock to stack this instrument over the progression."}
      </p>
    </section>
  );
}
