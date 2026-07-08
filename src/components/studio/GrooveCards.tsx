"use client";

import { cn } from "@/lib/utils/cn";

export interface GrooveOption {
  id: string;
  name: string;
  desc: string;
  /** 8 step intensities, 0–1, for the rhythm glyph. */
  glyph: number[];
}

interface Props {
  options: GrooveOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function GrooveCards({ options, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {options.map((o) => {
        const active = o.id === selectedId;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(o.id)}
            className={cn(
              "flex flex-col rounded-2xl border p-3.5 text-left transition-colors",
              active
                ? "border-accent bg-accent/[0.08]"
                : "border-line bg-bg-raised hover:bg-bg-higher",
            )}
          >
            <div
              className={cn(
                "text-[13.5px] font-semibold",
                active ? "text-accent" : "text-text",
              )}
            >
              {o.name}
            </div>
            <div className="mt-3 flex h-7 items-end gap-1">
              {o.glyph.map((v, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-[3px]",
                    active
                      ? v > 0.15
                        ? "bg-accent"
                        : "bg-accent/25"
                      : v > 0.15
                        ? "bg-[#3a3a44]"
                        : "bg-[#22222b]",
                  )}
                  style={{ height: `${Math.max(0.12, v) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-3 text-[11px] leading-snug text-text-muted">
              {o.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}
