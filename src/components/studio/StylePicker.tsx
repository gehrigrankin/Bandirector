"use client";

import { Button } from "@/components/ui/Button";
import { getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import { getStyles } from "@/lib/audio/patterns";

interface Props {
  instrumentId: InstrumentId;
  styleId: string;
  onSelect: (id: string) => void;
}

export function StylePicker({ instrumentId, styleId, onSelect }: Props) {
  const family = getInstrument(instrumentId).family;
  const styles = getStyles(family);
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Style</h2>
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {styles.map((s) => (
          <Button
            key={s.id}
            size="md"
            variant={s.id === styleId ? "primary" : "secondary"}
            className="shrink-0 snap-start"
            onClick={() => onSelect(s.id)}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
