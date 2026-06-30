"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PROGRESSION_TEMPLATES, type ChordExt } from "@/lib/music/chord";

interface Props {
  onApply: (degrees: number[], ext?: ChordExt) => void;
}

export function Suggestions({ onApply }: Props) {
  return (
    <div className="-mx-4 flex snap-x items-center gap-2 overflow-x-auto px-4 pb-1">
      <span className="flex shrink-0 items-center gap-1 text-xs text-text-dim">
        <Sparkles className="size-3.5" />
        Try
      </span>
      {PROGRESSION_TEMPLATES.map((t) => (
        <Button
          key={t.id}
          size="sm"
          variant="secondary"
          className="shrink-0 snap-start"
          onClick={() => onApply(t.degrees, t.ext)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
