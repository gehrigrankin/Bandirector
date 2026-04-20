"use client";

import type { ChordHit } from "@/lib/types/database";

export function UnverifiedBadge({ chord }: { chord: ChordHit | null }) {
  if (!chord || chord.verified) return null;
  return (
    <span
      className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-dim"
      title="This chord was guessed by the analyzer. Edit to verify it."
    >
      ML guess
    </span>
  );
}
