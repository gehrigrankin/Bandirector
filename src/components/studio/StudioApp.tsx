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
import { chordToMidi } from "@/lib/music/chord";
import type { ChordStep, Selection, Track } from "@/components/studio/types";
import { InstrumentPicker } from "@/components/studio/InstrumentPicker";
import { ProgressionBar } from "@/components/studio/ProgressionBar";
import { ChordGrid } from "@/components/studio/ChordGrid";
import { StepSequencer } from "@/components/studio/StepSequencer";
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

export function StudioApp() {
  const engine = useMemo(() => getEngine(), []);

  const [bpm, setBpm] = useState(100);
  const [masterVolume, setMasterVolume] = useState(0.9);
  const [swing, setSwing] = useState(0);
  const [humanize, setHumanize] = useState(0.5);
  const [noteLength, setNoteLength] = useState(1);
  const [reverb, setReverb] = useState(0.2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStep, setPlayStep] = useState<number | null>(null);

  // The loop's chord changes (one bar per step), shared by every layer.
  const [progression, setProgression] = useState<ChordStep[]>([
    { root: "C", quality: "maj" },
  ]);
  const [editIndex, setEditIndex] = useState(0);

  const [selection, setSelection] = useState<Selection>(() => ({
    instrumentId: "acoustic_guitar",
    ...instrumentDefaults("acoustic_guitar"),
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
  useEffect(() => {
    engine.setNoteLength(noteLength);
  }, [engine, noteLength]);
  useEffect(() => {
    engine.setReverb(reverb);
  }, [engine, reverb]);
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
    engine.setNoteLength(noteLength);
    engine.setReverb(reverb);
    engine.start(() => scheduledRef.current);
    setIsPlaying(true);
  }, [engine, bpm, masterVolume, swing, humanize, noteLength, reverb]);

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

          <section>
            <h2 className="mb-2 text-sm font-semibold text-text-muted">Progression</h2>
            <ProgressionBar
              progression={progression}
              editIndex={editIndex}
              onSelect={setEditIndex}
              onAdd={addStep}
              onRemove={removeStep}
            />
          </section>

          <ChordGrid
            root={step.root}
            quality={step.quality}
            onRoot={(root) => setStep({ root })}
            onQuality={(quality) => setStep({ quality })}
          />
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
          <FeelControls
            swing={swing}
            humanize={humanize}
            noteLength={noteLength}
            reverb={reverb}
            onSwing={setSwing}
            onHumanize={setHumanize}
            onNoteLength={setNoteLength}
            onReverb={setReverb}
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
