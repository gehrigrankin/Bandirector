"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { INSTRUMENTS, type InstrumentId } from "@/lib/audio/instruments";

interface Props {
  value: InstrumentId;
  onSelect: (id: InstrumentId) => void;
  /** "row" — horizontal scroll chips (mobile); "list" — vertical list (desktop rail panel). */
  orientation?: "row" | "list";
}

export function InstrumentPicker({ value, onSelect, orientation = "row" }: Props) {
  if (orientation === "list") {
    return (
      <div className="flex flex-col gap-0.5">
        {INSTRUMENTS.map((inst) => {
          const active = inst.id === value;
          return (
            <button
              key={inst.id}
              type="button"
              onClick={() => onSelect(inst.id)}
              className={cn(
                "flex h-[38px] items-center rounded-[10px] px-2.5 text-left text-sm transition-colors",
                active
                  ? "bg-accent/[0.12] font-semibold text-accent"
                  : "text-text-soft hover:bg-bg-raised",
              )}
            >
              {inst.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Instrument</h2>
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {INSTRUMENTS.map((inst) => (
          <Button
            key={inst.id}
            size="md"
            variant={inst.id === value ? "primary" : "secondary"}
            className="shrink-0 snap-start"
            onClick={() => onSelect(inst.id)}
          >
            {inst.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
