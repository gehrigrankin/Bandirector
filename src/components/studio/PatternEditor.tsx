"use client";

// A controlled wrapper around the step sequencer: give it a pattern and get a
// new pattern back. Keyboard instruments can flip between the two-hand comp
// engine and the plain step grid.

import { cn } from "@/lib/utils/cn";
import { getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import {
  clonePattern,
  defaultComp,
  emptyPatternLike,
  presetsFor,
  type CompPattern,
  type DrumVoice,
  type Pattern,
} from "@/lib/audio/patterns";
import { StepSequencer } from "@/components/studio/StepSequencer";

interface Props {
  instrumentId: InstrumentId;
  pattern: Pattern;
  playStep: number | null;
  onChange: (pattern: Pattern) => void;
}

export function PatternEditor({ instrumentId, pattern, playStep, onChange }: Props) {
  const def = getInstrument(instrumentId);
  const keyboard = def.family === "keys";

  const setComp = (patch: Partial<Omit<CompPattern, "kind">>) => {
    if (pattern.kind === "comp") onChange({ ...pattern, ...patch });
  };

  return (
    <div className="flex flex-col gap-3">
      {keyboard ? (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted">Play as</span>
          <div className="flex overflow-hidden rounded-full border border-line">
            {[
              ["comp", "Two hands"],
              ["melodic", "Step grid"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  if (id === pattern.kind) return;
                  onChange(
                    id === "comp" ? defaultComp() : clonePattern(presetsFor("keys")[0].pattern),
                  );
                }}
                className={cn(
                  "min-h-9 px-3 text-[11px] font-semibold",
                  pattern.kind === id ? "bg-accent text-black" : "text-text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <StepSequencer
        instrumentId={instrumentId}
        pattern={pattern}
        playStep={playStep}
        onToggleStep={(i) => {
          if (pattern.kind !== "melodic") return;
          onChange({ ...pattern, hits: pattern.hits.map((on, k) => (k === i ? !on : on)) });
        }}
        onToggleDrum={(voice: DrumVoice, i) => {
          if (pattern.kind !== "drums") return;
          const row = pattern.rows[voice].map((on, k) => (k === i ? !on : on));
          onChange({ ...pattern, rows: { ...pattern.rows, [voice]: row } });
        }}
        onArticulation={(a) => {
          if (pattern.kind === "melodic") onChange({ ...pattern, articulation: a });
        }}
        onPreset={(presetId) => {
          const preset = presetsFor(def.family).find((p) => p.id === presetId);
          if (preset) onChange(clonePattern(preset.pattern));
        }}
        onClear={() => onChange(emptyPatternLike(pattern))}
        onLeftHand={(v) => setComp({ leftHand: v })}
        onRightHand={(v) => setComp({ rightHand: v })}
        onVoicing={(v) => setComp({ voicing: v })}
      />
    </div>
  );
}
