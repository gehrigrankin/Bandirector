"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { Mode } from "@/lib/music/chord";
import { ROOTS } from "@/components/studio/types";

interface Props {
  tonic: string;
  mode: Mode;
  onTonic: (t: string) => void;
  onMode: (m: Mode) => void;
}

export function KeyBar({ tonic, mode, onTonic, onMode }: Props) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Key</h2>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {ROOTS.map((r) => (
            <Button
              key={r}
              size="md"
              variant={r === tonic ? "primary" : "secondary"}
              className="w-12 shrink-0 snap-start px-0"
              onClick={() => onTonic(r)}
            >
              {r}
            </Button>
          ))}
        </div>
        <div className="flex shrink-0 overflow-hidden rounded-xl border border-border">
          {(["major", "minor"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMode(m)}
              className={cn(
                "h-11 px-4 text-sm font-semibold capitalize transition-colors",
                m === mode ? "bg-accent text-black" : "bg-bg-raised text-text-muted",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
