"use client";

import { Plus, Sparkles } from "lucide-react";
import type { ProgressionCard } from "@/components/studio/ProgressionCards";
import { cn } from "@/lib/utils/cn";

interface Props {
  cards: ProgressionCard[];
  editIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onIdeas: () => void;
}

export function MobileProgression({
  cards,
  editIndex,
  onSelect,
  onAdd,
  onIdeas,
}: Props) {
  return (
    <section className="px-4 pt-3 sm:px-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">
            Progression
          </span>
          <span className="font-mono text-[10px] text-text-muted">
            {cards.length} {cards.length === 1 ? "bar" : "bars"}
          </span>
        </div>
        <button
          type="button"
          onClick={onIdeas}
          className="flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-accent active:bg-accent/10"
        >
          <Sparkles className="size-3.5" />
          Ideas
        </button>
      </div>

      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5">
        {cards.map((card, index) => {
          const active = index === editIndex;
          return (
            <button
              key={`${card.label}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={active}
              className={cn(
                "relative flex h-[68px] min-w-[92px] snap-start flex-col justify-between overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors sm:min-w-28",
                active
                  ? "border-accent bg-accent/[0.1]"
                  : "border-line-soft bg-bg-raised active:bg-bg-higher",
              )}
            >
              <span
                className={cn(
                  "text-[9px] font-semibold uppercase tracking-[0.12em]",
                  active ? "text-accent" : "text-text-dim",
                )}
              >
                {index + 1} · {card.numeral}
              </span>
              <span
                className={cn(
                  "truncate font-display text-xl font-semibold leading-none",
                  active ? "text-accent" : "text-text",
                )}
              >
                {card.label}
              </span>
              {active ? (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onAdd}
          aria-label="Add another bar"
          className="flex h-[68px] w-12 shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-line text-text-muted active:border-accent active:text-accent"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </section>
  );
}
