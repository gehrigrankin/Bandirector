"use client";

import { Plus, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ChordExt } from "@/lib/music/chord";

export interface ProgressionCard {
  label: string;
  numeral: string;
  notes: string[];
  ext?: ChordExt;
}

interface Props {
  cards: ProgressionCard[];
  editIndex: number;
  onSelect: (i: number) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onCycleColor: () => void;
}

const COLOR_LABEL: Record<string, string> = {
  triad: "Triad",
  "7th": "7th",
  "9th": "9th",
};

export function ProgressionCards({
  cards,
  editIndex,
  onSelect,
  onAdd,
  onRemove,
  onCycleColor,
}: Props) {
  return (
    <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1">
      {cards.length === 0 ? (
        <div className="flex min-w-[220px] flex-col justify-center rounded-2xl border border-dashed border-[#2e2e38] px-4 py-3">
          <div className="font-display text-lg font-semibold text-text-soft">
            No chords yet
          </div>
          <div className="mt-0.5 text-[11.5px] leading-snug text-text-muted">
            Tap a chord below (or +) to start your progression — build it into
            whatever you want.
          </div>
        </div>
      ) : null}
      {cards.map((c, i) => {
        const active = i === editIndex;
        return (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(i)}
            className={cn(
              "relative flex min-w-[168px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border px-4 py-3 transition-colors",
              active
                ? "border-accent bg-accent/[0.08]"
                : "border-line bg-bg-raised hover:bg-bg-higher",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.08em]",
                  active ? "text-accent/85" : "text-text-dim",
                )}
              >
                {c.numeral} · BAR {i + 1}
              </span>
              <div className="flex items-center gap-1.5">
                {active ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCycleColor();
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-accent/40 px-1.5 py-0.5 text-[10px] font-medium text-accent"
                  >
                    {c.ext ? COLOR_LABEL[c.ext] : "Auto"}
                    <ChevronDown className="size-2.5" strokeWidth={2.5} />
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-label={`Remove chord ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(i);
                  }}
                  className={cn(
                    "hover:text-text",
                    active ? "text-accent/70" : "text-text-dim",
                  )}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
            <div
              className={cn(
                "mt-1 font-display text-[32px] font-semibold leading-none",
                active ? "text-accent" : "text-text",
              )}
            >
              {c.label}
            </div>
            <div className="mt-2 font-mono text-[10.5px] text-text-dim">
              {c.notes.join(" · ")}
            </div>
            {active ? (
              <div className="absolute inset-x-0 bottom-0 h-[3px] w-2/5 bg-accent" />
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        aria-label="Add chord"
        onClick={onAdd}
        className="flex w-14 shrink-0 items-center justify-center rounded-2xl border border-dashed border-[#2e2e38] text-text-dim hover:text-text"
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
