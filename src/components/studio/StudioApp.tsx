"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getEngine, type ScheduledTrack } from "@/lib/audio/engine";
import { getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import { defaultStyleId, getStyle } from "@/lib/audio/patterns";
import { chordToMidi } from "@/lib/music/chord";
import type { ChordStep, Selection, Track } from "@/components/studio/types";
import { InstrumentPicker } from "@/components/studio/InstrumentPicker";
import { ProgressionBar } from "@/components/studio/ProgressionBar";
import { ChordGrid } from "@/components/studio/ChordGrid";
import { StylePicker } from "@/components/studio/StylePicker";
import { FeelControls } from "@/components/studio/FeelControls";
import { LoopPad } from "@/components/studio/LoopPad";
import { TrackRack } from "@/components/studio/TrackRack";
import { TransportBar } from "@/components/studio/TransportBar";

const PREVIEW_VOLUME = 0.85;

/** Turn a track into the bar-event closure the scheduler runs. Every track
 *  follows the shared progression: `barIndex` selects the current chord, so
 *  all layers change together. */
function buildScheduled(t: Track, progression: ChordStep[]): ScheduledTrack {
  const def = getInstrument(t.instrumentId);
  const style = getStyle(def.family, t.styleId);
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
      return style.generate({ chordNotes, rootMidi, barSeconds, octave: t.octave });
    },
  };
}

/** Default style + octave when switching to a new instrument. */
function instrumentDefaults(id: InstrumentId): { styleId: string; octave: number } {
  const def = getInstrument(id);
  return { styleId: defaultStyleId(def.family), octave: def.octave };
}

export function StudioApp() {
  const engine = useMemo(() => getEngine(), []);

  const [bpm, setBpm] = useState(100);
  const [masterVolume, setMasterVolume] = useState(0.9);
  const [swing, setSwing] = useState(0);
  const [humanize, setHumanize] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Live snapshot the scheduler reads each bar: the transient preview of the
  // current selection, followed by every locked layer — all over the
  // shared progression.
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

  // Keep the running transport in step with BPM / master volume changes.
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

  // ── Progression editing ──
  const setStep = useCallback(
    (patch: Partial<ChordStep>) => {
      setProgression((p) =>
        p.map((s, i) => (i === editIndex ? { ...s, ...patch } : s)),
      );
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
      { id, ...selection, volume: 0.85, muted: false, solo: false },
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
            <h2 className="mb-2 text-sm font-semibold text-text-muted">
              Progression
            </h2>
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
          <StylePicker
            instrumentId={selection.instrumentId}
            styleId={selection.styleId}
            onSelect={(styleId) => setSelection((s) => ({ ...s, styleId }))}
          />
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
