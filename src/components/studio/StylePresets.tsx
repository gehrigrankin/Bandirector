"use client";

import { Disc3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  onApply: (style: "jazz" | "neosoul") => void;
  layout?: "row" | "grid";
}

const STYLES: { id: "jazz" | "neosoul"; label: string }[] = [
  { id: "jazz", label: "Jazz" },
  { id: "neosoul", label: "Neo-soul / R&B" },
];

/** One-tap genre bundles: each sets chord colour, voicing, both hands, feel and
 *  tempo together on a keyboard part. */
export function StylePresets({ onApply, layout = "row" }: Props) {
  if (layout === "grid") {
    return (
      <section>
        <div className="mb-2.5 flex items-center gap-2">
          <Disc3 className="size-4 text-accent" />
          <div>
            <h2 className="font-display text-base font-semibold text-text">
              Set the vibe
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              Changes the instrument, feel, tempo, and chord color together.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onApply(style.id)}
              className="min-h-12 rounded-xl border border-line bg-bg-raised px-3 py-2 text-sm font-semibold text-text active:border-accent active:bg-accent/10"
            >
              {style.label}
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="-mx-4 flex snap-x items-center gap-2 overflow-x-auto px-4 pb-1">
      <span className="flex shrink-0 items-center gap-1 text-xs text-text-dim">
        <Disc3 className="size-3.5" />
        Style
      </span>
      {STYLES.map((s) => (
        <Button
          key={s.id}
          size="sm"
          variant="secondary"
          className="shrink-0 snap-start"
          onClick={() => onApply(s.id)}
        >
          {s.label}
        </Button>
      ))}
    </div>
  );
}
