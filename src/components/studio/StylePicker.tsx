"use client";

import { styleLabel } from "@/lib/audio/patterns";
import { Pill } from "./Pill";

interface StylePickerProps {
  styleIds: string[];
  value: string;
  onChange: (id: string) => void;
}

export function StylePicker({ styleIds, value, onChange }: StylePickerProps) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Playing style
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {styleIds.map((id) => (
          <Pill key={id} active={id === value} onClick={() => onChange(id)}>
            {styleLabel(id)}
          </Pill>
        ))}
      </div>
    </section>
  );
}
