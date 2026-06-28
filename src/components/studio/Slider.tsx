"use client";

interface Props {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

export function Slider({ label, value, display, min, max, step = 0.01, onChange }: Props) {
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
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 w-full accent-accent"
      />
    </div>
  );
}

export function lengthLabel(v: number): string {
  return v < 0.55 ? "Short" : v > 1.5 ? "Long" : "Medium";
}

export function reverbLabel(v: number): string {
  return v < 0.02 ? "Dry" : `${Math.round(v * 100)}%`;
}
