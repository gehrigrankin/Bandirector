"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { chordSymbol } from "@/lib/music/chord";
import { getInstrument } from "@/lib/audio/instruments";
import { getStyle } from "@/lib/audio/patterns";
import type { Selection } from "@/components/studio/types";

interface Props {
  selection: Selection;
  isPlaying: boolean;
  onLock: () => void;
}

export function LoopPad({ selection, isPlaying, onLock }: Props) {
  const def = getInstrument(selection.instrumentId);
  const style = getStyle(def.family, selection.styleId);
  return (
    <section className="rounded-2xl border border-border bg-bg-raised p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-4xl font-bold tracking-tight">
            {def.isDrums ? def.label : chordSymbol(selection.root, selection.quality)}
          </div>
          <div className="mt-1 truncate text-sm text-text-muted">
            {def.label} · {style.label}
          </div>
        </div>
        <Button size="lg" className="shrink-0" onClick={onLock}>
          <Lock className="size-5" />
          Lock loop
        </Button>
      </div>
      <p className="mt-3 text-xs text-text-dim">
        {isPlaying
          ? "Previewing live — change root, quality, style or instrument to hear it. Lock to layer it under the others."
          : "Press Play to preview this loop, then Lock to stack it with more parts."}
      </p>
    </section>
  );
}
