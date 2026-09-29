"use client";

// One instrument row: which sound it is, where in the song it plays, how it
// sits in the mix, and the default groove it uses in every section.

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DRUM_KITS, getInstrument, INSTRUMENTS, type DrumKitId, type InstrumentId } from "@/lib/audio/instruments";
import type { Pattern } from "@/lib/audio/patterns";
import { isPlaying, type Song, type Track } from "@/lib/song/model";
import { PatternEditor } from "@/components/studio/PatternEditor";
import { Slider, lengthLabel, reverbLabel } from "@/components/studio/Slider";
import { LABEL, SECTION_COLORS } from "@/components/studio/shared";

interface Props {
  song: Song;
  track: Track;
  playStep: number | null;
  onChange: (patch: Partial<Track>) => void;
  onInstrument: (id: InstrumentId) => void;
  onPattern: (pattern: Pattern) => void;
  onClipOn: (sectionId: string, on: boolean) => void;
  onRemove: () => void;
}

export function TrackInspector({
  song,
  track,
  playStep,
  onChange,
  onInstrument,
  onPattern,
  onClipOn,
  onRemove,
}: Props) {
  const def = getInstrument(track.instrumentId);
  const customCount = Object.values(track.clips).filter((c) => c.pattern).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <div className={LABEL}>Instrument</div>
          <select
            aria-label="Instrument"
            value={track.instrumentId}
            onChange={(e) => onInstrument(e.target.value as InstrumentId)}
            className="mt-0.5 h-9 rounded-lg border border-line bg-bg-input px-2 font-display text-[14px] font-bold text-text outline-none focus:border-accent"
          >
            {INSTRUMENTS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        {def.isDrums ? (
          <div>
            <div className={LABEL}>Kit</div>
            <select
              aria-label="Drum kit"
              value={track.kit ?? "LM-2"}
              onChange={(e) => onChange({ kit: e.target.value as DrumKitId })}
              className="mt-0.5 h-9 rounded-lg border border-line bg-bg-input px-2 text-[13px] font-semibold text-text outline-none focus:border-accent"
            >
              {DRUM_KITS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label} — {k.hint}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {!def.isDrums ? (
          <div className="flex h-9 items-center self-end rounded-lg border border-line">
            <button
              type="button"
              aria-label="Octave down"
              onClick={() => onChange({ octave: Math.max(0, track.octave - 1) })}
              className="h-full w-8 text-text-muted hover:text-text"
            >
              −
            </button>
            <span className="w-16 text-center text-[11.5px] font-semibold">Oct {track.octave}</span>
            <button
              type="button"
              aria-label="Octave up"
              onClick={() => onChange({ octave: Math.min(8, track.octave + 1) })}
              className="h-full w-8 text-text-muted hover:text-text"
            >
              +
            </button>
          </div>
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto inline-flex h-9 items-center gap-1.5 self-end rounded-lg border border-line px-3 text-[12px] font-semibold text-text-muted hover:border-danger/40 hover:text-danger"
        >
          <Trash2 className="size-3.5" /> Remove
        </button>
      </div>

      <div>
        <div className={LABEL}>Plays in</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {song.sections.map((s) => {
            const on = isPlaying(track, s.id);
            const color = SECTION_COLORS[s.kind];
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => onClipOn(s.id, !on)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[11.5px] font-semibold transition-colors",
                  on ? "border-transparent" : "border-line text-text-dim line-through hover:text-text-muted",
                )}
                style={on ? { background: color.fill, color: color.text } : undefined}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-x-5 gap-y-2 sm:grid-cols-3">
        <Slider
          label="Volume"
          value={track.volume}
          display={`${Math.round(track.volume * 100)}%`}
          min={0}
          max={1}
          onChange={(v) => onChange({ volume: v })}
        />
        <Slider
          label="Note length"
          value={track.noteLength}
          display={lengthLabel(track.noteLength)}
          min={0.3}
          max={2}
          onChange={(v) => onChange({ noteLength: v })}
        />
        <Slider
          label="Reverb"
          value={track.reverb}
          display={reverbLabel(track.reverb)}
          min={0}
          max={1}
          onChange={(v) => onChange({ reverb: v })}
        />
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className={LABEL}>Default groove</span>
          <span className="text-[11px] text-text-dim">
            Used in every section
            {customCount > 0
              ? ` except ${customCount} with ${customCount === 1 ? "its" : "their"} own — click a block in the grid to edit those`
              : " — click a block in the grid to give one section its own"}
            .
          </span>
        </div>
        <div className="mt-2">
          <PatternEditor
            instrumentId={track.instrumentId}
            pattern={track.pattern}
            playStep={playStep}
            onChange={onPattern}
          />
        </div>
      </div>
    </div>
  );
}
