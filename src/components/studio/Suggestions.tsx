"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PROGRESSION_TEMPLATES, type ChordExt } from "@/lib/music/chord";
import { cn } from "@/lib/utils/cn";

interface Props {
  onApply: (degrees: number[], ext?: ChordExt) => void;
  layout?: "row" | "grid";
  title?: string;
  description?: string;
}

const FEATURED_COUNT = 6;

export function Suggestions({
  onApply,
  layout = "row",
  title = "Start with a progression",
  description = "Pick a shape, then make it yours.",
}: Props) {
  const [expanded, setExpanded] = useState(false);

  if (layout === "grid") {
    const templates = expanded
      ? PROGRESSION_TEMPLATES
      : PROGRESSION_TEMPLATES.slice(0, FEATURED_COUNT);

    return (
      <section>
        <div className="mb-2.5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-text">
              {title}
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              {description}
            </p>
          </div>
          <Sparkles className="mb-1 size-4 shrink-0 text-accent" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onApply(template.degrees, template.ext)}
              className="flex min-h-12 items-center justify-center rounded-xl border border-line bg-bg-raised px-2.5 py-2 text-center font-display text-sm font-semibold text-text active:border-accent active:bg-accent/10"
            >
              {template.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2.5 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-accent"
        >
          {expanded ? "Show essentials" : "More progressions"}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
      </section>
    );
  }

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
