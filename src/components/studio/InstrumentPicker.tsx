"use client";

import { Button } from "@/components/ui/Button";
import { INSTRUMENTS, type InstrumentId } from "@/lib/audio/instruments";

interface Props {
  value: InstrumentId;
  onSelect: (id: InstrumentId) => void;
}

export function InstrumentPicker({ value, onSelect }: Props) {
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
