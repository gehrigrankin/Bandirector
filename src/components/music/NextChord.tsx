"use client";

import { cn } from "@/lib/utils/cn";
import type { ChordHit } from "@/lib/types/database";

interface Props {
  next: ChordHit | null;
}

export function NextChord({ next }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 text-text-muted">
      <span className="text-xs uppercase tracking-widest">Next</span>
      <span
        className={cn(
          "rounded-lg border border-border px-3 py-1 text-xl font-semibold",
          next?.verified ? "border-accent text-accent" : "text-text",
        )}
      >
        {next?.chord ?? "—"}
      </span>
    </div>
  );
}
