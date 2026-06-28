"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getEngine, type ScheduledTrack } from "@/lib/audio/engine";
import { getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import {
  STEP_COUNT,
  clonePattern,
  defaultPattern,
  emptyPatternLike,
  presetsFor,
  renderPattern,
  type Articulation,
  type DrumVoice,
  type Pattern,
} from "@/lib/audio/patterns";
import {
  chordToMidi,
  progressionFromDegrees,
  type Mode,
} from "@/lib/music/chord";
import type { ChordStep, Selection, Track } from "@/components/studio/types";
import { InstrumentPicker } from "@/components/studio/InstrumentPicker";
import { KeyBar } from "@/components/studio/KeyBar";
import { ProgressionBar } from "@/components/studio/ProgressionBar";
import { Suggestions } from "@/components/studio/Suggestions";
import { DiatonicChords } from "@/components/studio/DiatonicChords";
import { ChordGrid } from "@/components/studio/ChordGrid";
import { StepSequencer } from "@/components/studio/StepSequencer";
import { Slider, lengthLabel, reverbLabel } from "@/components/studio/Slider";
import { FeelControls } from "@/components/studio/FeelControls";
import { LoopPad } from "@/components/studio/LoopPad";
import { TrackRack } from "@/components/studio/TrackRack";
import { TransportBar } from "@/components/studio/TransportBar";

const PREVIEW_VOLUME = 0.85;

/** Turn a track into the bar-event closure the scheduler runs. Every track
 *  follows the shared progression (barIndex picks the chord) and renders its
 *  own step pattern over it. */
function buildScheduled(t: Track, progression: ChordStep[]): ScheduledTrack {
  const def = getInstrument(t.instrumentId);
  return {
    id: t.id,
    instrumentId: t.instrumentId,
    volume: t.volume,
    muted: t.muted,
    solo: t.solo,
    noteLength: t.noteLength,
    reverb: t.reverb,
    getBarEvents: (barSeconds, barIndex) => {
      const step = progression[barIndex % progression.length];
      const chordNotes = def.isDrums
        ? []
        : chordToMidi(step.root, step.quality, t.octave);
      const rootMidi = chordNotes[0] ?? 60;
      return renderPattern(t.pattern, { chordNotes, rootMidi, barSeconds, octave: t.octave });
    },
  };
}

/** Default pattern + octave when switching to a new instrument. */
function instrumentDefaults(id: InstrumentId): { pattern: Pattern; octave: number } {
  const def = getInstrument(id);
  return { pattern: defaultPattern(def.family), octave: def.octave };
}

const DEFAULT_NOTE_LENGTH = 1;
const DEFAULT_REVERB = 0.2;

export function StudioApp() {
  const engine = useMemo(() => getEngine(), []);

  const [bpm, setBpm] = useState(100);
  const [masterVolume, setMasterVolume] = useState(0.9);
  const [swing, setSwing] = useState(0);
  const [humanize, setHumanize] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStep, setPlayStep] = useState<number | null>(null);

  // The song key drives which chords are suggested.
  const [tonic, setTonic] = useState("C");
  const [mode, setMode] = useState<Mode>("major");
  const [showAllChords, setShowAllChords] = useState(false);

  // The loop's chord changes (one bar per step), shared by every layer.
  const [progression, setProgression] = useState<ChordStep[]>([
    { root: "C", quality: "maj" },
  ]);
  const [editIndex, setEditIndex] = useState(0);

  const [selection, setSelection] = useState<Selection>(() => ({
    instrumentId: "acoustic_guitar",
    ...instrumentDefaults("acoustic_guitar"),
    noteLength: DEFAULT_NOTE_LENGTH,
    reverb: DEFAULT_REVERB,
  }));
  const [tracks, setTracks] = useState<Track[]>([]);
  const nextId = useRef(1);

  const step = progression[Math.min(editIndex, progression.length - 1)];

  // Live snapshot the scheduler reads each bar.
  const scheduled = useMemo<ScheduledTrack[]>(() => {
    const preview = buildScheduled(
      { id: "preview", ...selection, volume: PREVIEW_VOLUME, muted: false, solo: false },
      progression,
    );
    return [preview, ...tracks.map((t) => buildScheduled(t, progression))];
  }, [selection, tracks, progression]);

  const scheduledRef = useRef<ScheduledTrack[]>(scheduled);
  useEffect(() => {
    scheduledRef.current = scheduled;
  }, [scheduled]);

  // Keep the running transport in step with the controls.
  useEffect(() => {
    engine.setBpm(bpm);
  }, [engine, bpm]);
  useEffect(() => {
    engine.setMasterVolume(masterVolume);
  }, [engine, masterVolume]);
  useEffect(() => {
    engine.setSwing(swing);
  }, [engine, swing]);
  useEffect(() => {
    engine.setHumanize(humanize);
  }, [engine, humanize]);
  useEffect(() => () => engine.stop(), [engine]);

  // Drive the step playhead off the audio clock (only re-render on step change).
  useEffect(() => {
    if (!isPlaying) {
      setPlayStep(null);
      return;
    }
    let raf = 0;
    let last = -1;
    const tick = () => {
      const ph = engine.getPlayhead();
      if (ph) {
        const s = Math.floor(ph.phase * STEP_COUNT) % STEP_COUNT;
        if (s !== last) {
          last = s;
          setPlayStep(s);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, engine]);

  const handlePlay = useCallback(async () => {
    await engine.resume();
    engine.setBpm(bpm);
    engine.setMasterVolume(masterVolume);
    engine.setSwing(swing);
    engine.setHumanize(humanize);
    engine.start(() => scheduledRef.current);
    setIsPlaying(true);
  }, [engine, bpm, masterVolume, swing, humanize]);

  const handleStop = useCallback(() => {
    engine.stop();
    setIsPlaying(false);
  }, [engine]);

  const selectInstrument = useCallback((id: InstrumentId) => {
    setSelection((s) => ({ ...s, instrumentId: id, ...instrumentDefaults(id) }));
  }, []);

  // ── Pattern editing ──
  const toggleStep = useCallback((index: number) => {
    setSelection((s) => {
      if (s.pattern.kind !== "melodic") return s;
      const hits = s.pattern.hits.map((on, i) => (i === index ? !on : on));
      return { ...s, pattern: { ...s.pattern, hits } };
    });
  }, []);
  const toggleDrum = useCallback((voice: DrumVoice, index: number) => {
    setSelection((s) => {
      if (s.pattern.kind !== "drums") return s;
      const row = s.pattern.rows[voice].map((on, i) => (i === index ? !on : on));
      return { ...s, pattern: { ...s.pattern, rows: { ...s.pattern.rows, [voice]: row } } };
    });
  }, []);
  const setArticulation = useCallback((a: Articulation) => {
    setSelection((s) =>
      s.pattern.kind === "melodic"
        ? { ...s, pattern: { ...s.pattern, articulation: a } }
        : s,
    );
  }, []);
  const applyPreset = useCallback((presetId: string) => {
    setSelection((s) => {
      const family = getInstrument(s.instrumentId).family;
      const preset = presetsFor(family).find((p) => p.id === presetId);
      return preset ? { ...s, pattern: clonePattern(preset.pattern) } : s;
    });
  }, []);
  const clearPattern = useCallback(() => {
    setSelection((s) => ({ ...s, pattern: emptyPatternLike(s.pattern) }));
  }, []);

  // ── Current part's sound (sustain + reverb) ──
  const setSelNoteLength = useCallback((v: number) => {
    setSelection((s) => ({ ...s, noteLength: v }));
  }, []);
  const setSelReverb = useCallback((v: number) => {
    setSelection((s) => ({ ...s, reverb: v }));
  }, []);

  // ── Progression editing ──
  const setStep = useCallback(
    (patch: Partial<ChordStep>) => {
      setProgression((p) => p.map((s, i) => (i === editIndex ? { ...s, ...patch } : s)));
    },
    [editIndex],
  );
  const addStep = useCallback(() => {
    setProgression((p) => {
      const copy = p[Math.min(editIndex, p.length - 1)] ?? { root: "C", quality: "maj" };
      const next = [...p, { ...copy }];
      setEditIndex(next.length - 1);
      return next;
    });
  }, [editIndex]);
  const removeStep = useCallback((index: number) => {
    setProgression((p) => {
      if (p.length <= 1) return p;
      const next = p.filter((_, i) => i !== index);
      setEditIndex((cur) => Math.min(cur, next.length - 1));
      return next;
    });
  }, []);
  const applyTemplate = useCallback(
    (degrees: number[]) => {
      const chords = progressionFromDegrees(tonic, mode, degrees).map((c) => ({
        root: c.root,
        quality: c.quality,
      }));
      setProgression(chords);
      setEditIndex(0);
    },
    [tonic, mode],
  );

  // ── Layers ──
  const lock = useCallback(() => {
    const id = `t${nextId.current++}`;
    setTracks((ts) => [
      ...ts,
      {
        id,
        ...selection,
        pattern: clonePattern(selection.pattern),
        volume: 0.85,
        muted: false,
        solo: false,
      },
    ]);
  }, [selection]);
  const updateTrack = useCallback((id: string, patch: Partial<Track>) => {
    setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);
  const removeTrack = useCallback((id: string) => {
    setTracks((ts) => ts.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <InstrumentPicker value={selection.instrumentId} onSelect={selectInstrument} />

          <KeyBar tonic={tonic} mode={mode} onTonic={setTonic} onMode={setMode} />

          <section>
            <h2 className="mb-2 text-sm font-semibold text-text-muted">Progression</h2>
            <ProgressionBar
              progression={progression}
              editIndex={editIndex}
              onSelect={setEditIndex}
              onAdd={addStep}
              onRemove={removeStep}
            />
            <div className="mt-2">
              <Suggestions onApply={applyTemplate} />
            </div>
          </section>

          <DiatonicChords
            tonic={tonic}
            mode={mode}
            current={step}
            onPick={(root, quality) => setStep({ root, quality })}
          />

          <section>
            <button
              type="button"
              onClick={() => setShowAllChords((v) => !v)}
              className="text-sm font-medium text-text-muted hover:text-text"
            >
              {showAllChords ? "Hide other chords" : "More chords (any key)"}
            </button>
            {showAllChords && (
              <div className="mt-3">
                <ChordGrid
                  root={step.root}
                  quality={step.quality}
                  onRoot={(root) => setStep({ root })}
                  onQuality={(quality) => setStep({ quality })}
                />
              </div>
            )}
          </section>
          <StepSequencer
            instrumentId={selection.instrumentId}
            pattern={selection.pattern}
            playStep={playStep}
            onToggleStep={toggleStep}
            onToggleDrum={toggleDrum}
            onArticulation={setArticulation}
            onPreset={applyPreset}
            onClear={clearPattern}
          />

          <section>
            <h2 className="mb-2 text-sm font-semibold text-text-muted">Sound</h2>
            <div className="grid gap-x-4 gap-y-1 rounded-2xl border border-border bg-bg-raised p-4 sm:grid-cols-2">
              <Slider
                label="Note Length"
                value={selection.noteLength}
                display={lengthLabel(selection.noteLength)}
                min={0.3}
                max={2}
                onChange={setSelNoteLength}
              />
              <Slider
                label="Reverb"
                value={selection.reverb}
                display={reverbLabel(selection.reverb)}
                min={0}
                max={1}
                onChange={setSelReverb}
              />
            </div>
            <p className="mt-1 text-xs text-text-dim">
              Applies to this part — each locked layer keeps its own.
            </p>
          </section>

          <FeelControls
            swing={swing}
            humanize={humanize}
            onSwing={setSwing}
            onHumanize={setHumanize}
          />
          <LoopPad
            selection={selection}
            progression={progression}
            isPlaying={isPlaying}
            onLock={lock}
          />
          <TrackRack
            tracks={tracks}
            onMute={(id, muted) => updateTrack(id, { muted })}
            onSolo={(id, solo) => updateTrack(id, { solo })}
            onVolume={(id, volume) => updateTrack(id, { volume })}
            onNoteLength={(id, noteLength) => updateTrack(id, { noteLength })}
            onReverb={(id, reverb) => updateTrack(id, { reverb })}
            onRemove={removeTrack}
          />
        </div>
      </div>

      <TransportBar
        isPlaying={isPlaying}
        bpm={bpm}
        masterVolume={masterVolume}
        onToggle={isPlaying ? handleStop : handlePlay}
        onBpm={setBpm}
        onMasterVolume={setMasterVolume}
      />
    </div>
  );
}
