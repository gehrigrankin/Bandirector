"use client";

import { Disc3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  onApply: (style: "jazz" | "neosoul") => void;
}

const STYLES: { id: "jazz" | "neosoul"; label: string }[] = [
  { id: "jazz", label: "Jazz" },
  { id: "neosoul", label: "Neo-soul / R&B" },
];

/** One-tap genre bundles: each sets chord colour, voicing, both hands, feel and
 *  tempo together on a keyboard part. */
export function StylePresets({ onApply }: Props) {
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
