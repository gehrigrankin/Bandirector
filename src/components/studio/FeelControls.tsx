"use client";

interface Props {
  swing: number; // 0..0.7
  humanize: number; // 0..1
  onSwing: (v: number) => void;
  onHumanize: (v: number) => void;
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-text">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full accent-accent"
      />
    </div>
  );
}

export function FeelControls({ swing, humanize, onSwing, onHumanize }: Props) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Feel</h2>
      <div className="grid gap-x-4 gap-y-1 rounded-2xl border border-border bg-bg-raised p-4 sm:grid-cols-2">
        <Slider
          label="Swing"
          value={swing}
          display={swing < 0.02 ? "Straight" : `${Math.round((swing / 0.7) * 100)}%`}
          min={0}
          max={0.7}
          onChange={onSwing}
        />
        <Slider
          label="Humanize"
          value={humanize}
          display={
            humanize < 0.02
              ? "Tight"
              : humanize > 0.85
                ? "Loose"
                : `${Math.round(humanize * 100)}%`
          }
          min={0}
          max={1}
          onChange={onHumanize}
        />
      </div>
    </section>
  );
}
