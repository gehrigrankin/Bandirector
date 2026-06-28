"use client";

import { instrumentsByGroup } from "@/lib/audio/instruments";
import { Pill } from "./Pill";

interface InstrumentPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export function InstrumentPicker({ value, onChange }: InstrumentPickerProps) {
  const groups = instrumentsByGroup();
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Instrument
      </h2>
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.group}>
            <p className="mb-1.5 text-xs text-text-dim">{group.group}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((inst) => (
                <Pill
                  key={inst.id}
                  active={inst.id === value}
                  onClick={() => onChange(inst.id)}
                >
                  {inst.label}
                </Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
