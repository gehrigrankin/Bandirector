"use client";

import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/studio/Slider";

interface Props {
  swing: number; // 0..0.7
  humanize: number; // 0..1
  onSwing: (v: number) => void;
  onHumanize: (v: number) => void;
}

// Named feel presets along the eighth-note swing axis.
const FEELS: { id: string; label: string; value: number }[] = [
  { id: "straight", label: "Straight", value: 0 },
  { id: "laidback", label: "Laid-back", value: 0.28 },
  { id: "swing", label: "Swing", value: 0.5 },
];

function swingLabel(swing: number): string {
  const named = FEELS.find((f) => Math.abs(f.value - swing) < 0.015);
  if (named) return named.label;
  return swing < 0.02 ? "Straight" : `${Math.round((swing / 0.7) * 100)}%`;
}

export function FeelControls({ swing, humanize, onSwing, onHumanize }: Props) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Feel</h2>
      <div className="mb-2 flex gap-2">
        {FEELS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={Math.abs(f.value - swing) < 0.015 ? "primary" : "secondary"}
            className="flex-1"
            onClick={() => onSwing(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-x-4 gap-y-1 rounded-2xl border border-border bg-bg-raised p-4 sm:grid-cols-2">
        <Slider
          label="Swing"
          value={swing}
          display={swingLabel(swing)}
          min={0}
          max={0.7}
          onChange={onSwing}
        />
        <Slider
          label="Humanize"
          value={humanize}
          display={
            humanize < 0.02 ? "Tight" : humanize > 0.85 ? "Loose" : `${Math.round(humanize * 100)}%`
          }
          min={0}
          max={1}
          onChange={onHumanize}
        />
      </div>
    </section>
  );
}
