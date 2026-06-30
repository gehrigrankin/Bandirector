"use client";

import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ChordStep } from "@/components/studio/types";

interface Props {
  progression: ChordStep[];
  /** Display labels per step, already resolved for the active chord colour. */
  labels: string[];
  editIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ProgressionBar({
  progression,
  labels,
  editIndex,
  onSelect,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="-mx-4 flex snap-x items-stretch gap-2 overflow-x-auto px-4 pb-1">
      {progression.map((step, i) => {
        const active = i === editIndex;
        return (
          <div
            key={i}
            className={cn(
              "relative flex shrink-0 snap-start items-center rounded-xl border",
              active
                ? "border-accent bg-accent text-black"
                : "border-border bg-bg-raised text-text",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(i)}
              className="h-11 min-w-14 pl-3 pr-2 text-base font-semibold"
            >
              {labels[i] ?? `${step.root}`}
            </button>
            {progression.length > 1 && (
              <button
                type="button"
                aria-label={`Remove chord ${i + 1}`}
                onClick={() => onRemove(i)}
                className={cn(
                  "flex h-11 w-7 items-center justify-center rounded-r-xl",
                  active ? "text-black/70 hover:text-black" : "text-text-dim hover:text-text",
                )}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        aria-label="Add chord"
        onClick={onAdd}
        className="flex h-11 w-11 shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-border text-text-muted hover:text-text"
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
