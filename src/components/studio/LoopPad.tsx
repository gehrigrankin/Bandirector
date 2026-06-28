"use client";

import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LoopPadProps {
  summary: string;
  isPlaying: boolean;
  loading: boolean;
  onLock: () => void;
}

/**
 * The live preview of the current selection. While the transport runs this loop
 * is always audible; "Lock" copies it into the track rack so it keeps playing
 * while you build the next layer.
 */
export function LoopPad({ summary, isPlaying, loading, onLock }: LoopPadProps) {
  return (
    <section className="rounded-2xl border border-border bg-bg-raised p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-text-dim">
            Now previewing
          </p>
          <p className="truncate text-base font-semibold">{summary}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {loading ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="size-3 animate-spin" /> loading sounds…
              </span>
            ) : isPlaying ? (
              "Looping — tweak chord or style to hear it change"
            ) : (
              "Press play to hear it loop"
            )}
          </p>
        </div>
        <Button onClick={onLock} className="shrink-0" size="md">
          <Lock className="size-4" /> Lock loop
        </Button>
      </div>
    </section>
  );
}
