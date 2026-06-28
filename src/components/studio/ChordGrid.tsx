"use client";

import { Button } from "@/components/ui/Button";
import { QUALITIES, chordSymbol } from "@/lib/music/chord";
import { ROOTS } from "@/components/studio/types";

interface Props {
  root: string;
  quality: string;
  onRoot: (root: string) => void;
  onQuality: (quality: string) => void;
}

export function ChordGrid({ root, quality, onRoot, onQuality }: Props) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Chord</h2>
      <div className="grid grid-cols-6 gap-2">
        {ROOTS.map((r) => (
          <Button
            key={r}
            size="md"
            variant={r === root ? "primary" : "secondary"}
            className="w-full"
            onClick={() => onRoot(r)}
          >
            {r}
          </Button>
        ))}
      </div>
      <div className="-mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {QUALITIES.map((q) => (
          <Button
            key={q.id}
            size="md"
            variant={q.id === quality ? "primary" : "secondary"}
            className="shrink-0 snap-start"
            onClick={() => onQuality(q.id)}
          >
            {chordSymbol(root, q.id)}
          </Button>
        ))}
      </div>
    </section>
  );
}
