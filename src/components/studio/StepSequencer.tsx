"use client";

import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import {
  ARTICULATIONS,
  BEAT_STEPS,
  DRUM_VOICES,
  LEFT_HAND_TEXTURES,
  RIGHT_HAND_PATTERNS,
  STEP_COUNT,
  presetsFor,
  type Articulation,
  type LeftHandTexture,
  type Pattern,
  type RightHandPattern,
  type DrumVoice,
} from "@/lib/audio/patterns";
import { VOICINGS, type Voicing } from "@/lib/music/voicing";

interface Props {
  instrumentId: InstrumentId;
  pattern: Pattern;
  playStep: number | null;
  onToggleStep: (index: number) => void;
  onToggleDrum: (voice: DrumVoice, index: number) => void;
  onArticulation: (a: Articulation) => void;
  onPreset: (presetId: string) => void;
  onClear: () => void;
  onLeftHand: (v: LeftHandTexture) => void;
  onRightHand: (v: RightHandPattern) => void;
  onVoicing: (v: Voicing) => void;
}

/** A labelled row of mutually-exclusive option chips. */
function OptionRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-text-muted">{label}</span>
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {options.map((o) => (
          <Button
            key={o.id}
            size="md"
            variant={o.id === value ? "primary" : "secondary"}
            className="shrink-0 snap-start"
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/** A row of 16 toggle cells, beat-grouped, horizontally scrollable. */
function StepCells({
  steps,
  playStep,
  onToggle,
  tone = "accent",
}: {
  steps: boolean[];
  playStep: number | null;
  onToggle: (i: number) => void;
  tone?: "accent" | "soft";
}) {
  return (
    <div className="flex gap-1">
      {steps.map((on, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Step ${i + 1}`}
          aria-pressed={on}
          onClick={() => onToggle(i)}
          className={cn(
            "h-11 w-9 shrink-0 rounded-md border transition-colors",
            i % BEAT_STEPS === 0 ? "ml-1.5 first:ml-0" : "",
            on
              ? tone === "accent"
                ? "border-accent bg-accent"
                : "border-accent-soft bg-accent-soft"
              : i % BEAT_STEPS === 0
                ? "border-border bg-bg-higher"
                : "border-border bg-bg-raised",
            i === playStep ? "ring-2 ring-inset ring-text" : "",
          )}
        />
      ))}
    </div>
  );
}

export function StepSequencer({
  instrumentId,
  pattern,
  playStep,
  onToggleStep,
  onToggleDrum,
  onArticulation,
  onPreset,
  onClear,
  onLeftHand,
  onRightHand,
  onVoicing,
}: Props) {
  const family = getInstrument(instrumentId).family;
  const presets = presetsFor(family);

  // Keyboard comping: two hands in separate registers + a voicing, not a grid.
  if (pattern.kind === "comp") {
    return (
      <section>
        <h2 className="mb-2 text-sm font-semibold text-text-muted">Pattern</h2>
        <div className="space-y-3 rounded-xl border border-border bg-bg-raised p-3">
          <OptionRow
            label="Left hand"
            options={LEFT_HAND_TEXTURES}
            value={pattern.leftHand}
            onChange={onLeftHand}
          />
          <OptionRow
            label="Right hand"
            options={RIGHT_HAND_PATTERNS}
            value={pattern.rightHand}
            onChange={onRightHand}
          />
          <OptionRow
            label="Voicing"
            options={VOICINGS}
            value={pattern.voicing}
            onChange={onVoicing}
          />
        </div>
        <p className="mt-1 text-xs text-text-dim">
          Left hand holds the bass; the right hand comps a voicing above it.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted">Pattern</h2>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 px-2 text-text-muted"
          onClick={onClear}
        >
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>

      {/* Presets seed the grid */}
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {presets.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant="secondary"
            className="shrink-0 snap-start"
            onClick={() => onPreset(p.id)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {/* Articulation (melodic only) */}
      {pattern.kind === "melodic" && (
        <div className="-mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
          {ARTICULATIONS.map((a) => (
            <Button
              key={a.id}
              size="md"
              variant={a.id === pattern.articulation ? "primary" : "secondary"}
              className="shrink-0 snap-start"
              onClick={() => onArticulation(a.id)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      )}

      {/* The grid */}
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-bg-raised p-3">
        {pattern.kind === "melodic" ? (
          <div className="min-w-max">
            <StepCells steps={pattern.hits} playStep={playStep} onToggle={onToggleStep} />
          </div>
        ) : (
          <div className="min-w-max space-y-1.5">
            {DRUM_VOICES.map((v) => (
              <div key={v.id} className="flex items-center gap-2">
                <span className="sticky left-0 z-10 w-10 shrink-0 bg-bg-raised pr-1 text-right text-xs font-medium text-text-muted">
                  {v.label}
                </span>
                <StepCells
                  steps={pattern.rows[v.id]}
                  playStep={playStep}
                  onToggle={(i) => onToggleDrum(v.id, i)}
                  tone={v.id === "kick" || v.id === "snare" ? "accent" : "soft"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-text-dim">
        Tap steps to build your own {pattern.kind === "drums" ? "beat" : "groove"}. Each
        row is one bar ({STEP_COUNT} sixteenths).
      </p>
    </section>
  );
}
