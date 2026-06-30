"use client";

import { Button } from "@/components/ui/Button";
import { CHORD_EXTS, type ChordExt } from "@/lib/music/chord";

interface Props {
  /** Global chord colour applied to every chord by default. */
  value: ChordExt;
  onChange: (ext: ChordExt) => void;
  /** Colour override on the currently-selected chord (undefined = follow global). */
  stepExt?: ChordExt;
  onStepExt: (ext: ChordExt | undefined) => void;
}

/** Keyboard-only control: turn diatonic triads into 7ths/9ths globally, with an
 *  optional override for the chord being edited. */
export function ChordColor({ value, onChange, stepExt, onStepExt }: Props) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">Chord color</h2>
      <div className="rounded-2xl border border-border bg-bg-raised p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-text-muted">All chords</span>
          <div className="flex gap-2">
            {CHORD_EXTS.map((e) => (
              <Button
                key={e.id}
                size="sm"
                variant={e.id === value ? "primary" : "secondary"}
                onClick={() => onChange(e.id)}
              >
                {e.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-xs font-medium text-text-muted">This chord</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={stepExt === undefined ? "primary" : "secondary"}
              onClick={() => onStepExt(undefined)}
            >
              Auto
            </Button>
            {CHORD_EXTS.map((e) => (
              <Button
                key={e.id}
                size="sm"
                variant={e.id === stepExt ? "primary" : "secondary"}
                onClick={() => onStepExt(e.id)}
              >
                {e.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
