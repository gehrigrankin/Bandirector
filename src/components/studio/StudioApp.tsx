"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getEngine,
  type ScheduledTrack,
} from "@/lib/audio/engine";
import { getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import {
  defaultStyleId,
  getStyle,
} from "@/lib/audio/patterns";
import { chordToMidi } from "@/lib/music/chord";
import type { Selection, Track } from "@/components/studio/types";
import { InstrumentPicker } from "@/components/studio/InstrumentPicker";
import { ChordGrid } from "@/components/studio/ChordGrid";
import { StylePicker } from "@/components/studio/StylePicker";
import { LoopPad } from "@/components/studio/LoopPad";
import { TrackRack } from "@/components/studio/TrackRack";
import { TransportBar } from "@/components/studio/TransportBar";

const PREVIEW_VOLUME = 0.85;

/** Turn a track / selection into the bar-event closure the scheduler runs. */
function buildScheduled(
  t: Track,
): ScheduledTrack {
  const def = getInstrument(t.instrumentId);
  const style = getStyle(def.family, t.styleId);
  return {
    id: t.id,
    instrumentId: t.instrumentId,
    volume: t.volume,
    muted: t.muted,
    solo: t.solo,
    getBarEvents: (barSeconds) => {
      const chordNotes = def.isDrums
        ? []
        : chordToMidi(t.root, t.quality, t.octave);
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
  const [isPlaying, setIsPlaying] = useState(false);

  const [selection, setSelection] = useState<Selection>(() => ({
    instrumentId: "acoustic_guitar",
    root: "C",
    quality: "maj",
    ...instrumentDefaults("acoustic_guitar"),
  }));
  const [tracks, setTracks] = useState<Track[]>([]);
  const nextId = useRef(1);

  // Live snapshot the scheduler reads each bar: the transient preview of the
  // current selection, followed by every locked loop.
  const scheduled = useMemo<ScheduledTrack[]>(() => {
    const preview = buildScheduled({
      id: "preview",
      ...selection,
      volume: PREVIEW_VOLUME,
      muted: false,
      solo: false,
    });
    return [preview, ...tracks.map(buildScheduled)];
  }, [selection, tracks]);

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
  useEffect(() => () => engine.stop(), [engine]);

  const handlePlay = useCallback(async () => {
    await engine.resume();
    engine.setBpm(bpm);
    engine.setMasterVolume(masterVolume);
    engine.start(() => scheduledRef.current);
    setIsPlaying(true);
  }, [engine, bpm, masterVolume]);

  const handleStop = useCallback(() => {
    engine.stop();
    setIsPlaying(false);
  }, [engine]);

  const selectInstrument = useCallback((id: InstrumentId) => {
    setSelection((s) => ({ ...s, instrumentId: id, ...instrumentDefaults(id) }));
  }, []);

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
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 pb-44 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <InstrumentPicker value={selection.instrumentId} onSelect={selectInstrument} />
          <ChordGrid
            root={selection.root}
            quality={selection.quality}
            onRoot={(root) => setSelection((s) => ({ ...s, root }))}
            onQuality={(quality) => setSelection((s) => ({ ...s, quality }))}
          />
          <StylePicker
            instrumentId={selection.instrumentId}
            styleId={selection.styleId}
            onSelect={(styleId) => setSelection((s) => ({ ...s, styleId }))}
          />
          <LoopPad selection={selection} isPlaying={isPlaying} onLock={lock} />
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
