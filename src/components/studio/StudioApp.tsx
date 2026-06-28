"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StudioEngine, type StudioTrack } from "@/lib/audio/engine";
import { getStudioInstrument, STUDIO_INSTRUMENTS } from "@/lib/audio/instruments";
import { styleLabel } from "@/lib/audio/patterns";
import { chordSymbol } from "@/lib/music/chord";
import { TopNav } from "@/components/ui/TopNav";
import { InstrumentPicker } from "./InstrumentPicker";
import { ChordGrid } from "./ChordGrid";
import { StylePicker } from "./StylePicker";
import { LoopPad } from "./LoopPad";
import { TrackRack } from "./TrackRack";
import { TransportBar } from "./TransportBar";

interface Selection {
  instrumentId: string;
  root: string;
  quality: string;
  styleId: string;
  octave: number;
}

const FIRST = STUDIO_INSTRUMENTS[0];

const INITIAL: Selection = {
  instrumentId: FIRST.id,
  root: "C",
  quality: "maj",
  styleId: FIRST.styleIds[0],
  octave: FIRST.octave,
};

/** Structural key — changes here require rebuilding the sequencer tracks. */
function structureKey(sel: Selection, tracks: StudioTrack[]): string {
  const t = tracks
    .map((x) => `${x.id}:${x.instrumentId}:${x.root}${x.quality}:${x.styleId}:${x.octave}`)
    .join("|");
  return `${sel.instrumentId}:${sel.root}${sel.quality}:${sel.styleId}:${sel.octave}||${t}`;
}

export function StudioApp() {
  const [selection, setSelection] = useState<Selection>(INITIAL);
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [masterVolume, setMasterVolume] = useState(0.85);
  const [loading, setLoading] = useState(false);

  const engineRef = useRef<StudioEngine | null>(null);
  const nextId = useRef(1);

  // Create the engine on mount (browser only); tear it down on unmount.
  useEffect(() => {
    const engine = new StudioEngine();
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const instrument = getStudioInstrument(selection.instrumentId);

  // The preview loop + all locked loops, in play order.
  const allTracks = useMemo<StudioTrack[]>(() => {
    const preview: StudioTrack = {
      id: "preview",
      instrumentId: selection.instrumentId,
      root: selection.root,
      quality: selection.quality,
      styleId: selection.styleId,
      octave: selection.octave,
      volume: 1,
      muted: false,
      solo: false,
    };
    return [preview, ...tracks];
  }, [selection, tracks]);

  const key = structureKey(selection, tracks);

  // Rebuild sequencer tracks whenever structure changes (loads samples first).
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    let active = true;
    setLoading(true);
    engine
      .setTracks(allTracks)
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // allTracks is derived from the same inputs as `key`; key is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const togglePlay = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (isPlaying) {
      engine.stop();
      setIsPlaying(false);
    } else {
      await engine.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleInstrument = useCallback((id: string) => {
    const def = getStudioInstrument(id);
    setSelection((prev) => ({
      ...prev,
      instrumentId: id,
      octave: def.octave,
      styleId: def.styleIds.includes(prev.styleId)
        ? prev.styleId
        : def.styleIds[0],
    }));
    engineRef.current?.preload(id);
  }, []);

  const handleBpm = useCallback((value: number) => {
    setBpm(value);
    engineRef.current?.setBpm(value);
  }, []);

  const handleMasterVolume = useCallback((value: number) => {
    setMasterVolume(value);
    engineRef.current?.setMasterVolume(value);
  }, []);

  const lockLoop = useCallback(() => {
    const id = `t${nextId.current++}`;
    setTracks((prev) => [
      ...prev,
      {
        id,
        instrumentId: selection.instrumentId,
        root: selection.root,
        quality: selection.quality,
        styleId: selection.styleId,
        octave: selection.octave,
        volume: 0.9,
        muted: false,
        solo: false,
      },
    ]);
  }, [selection]);

  const removeTrack = useCallback((id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Volume / mute / solo update the engine directly (no rebuild) and mirror state.
  const setTrackVolume = useCallback((id: string, volume: number) => {
    engineRef.current?.setTrackVolume(id, volume);
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, volume } : t)));
  }, []);

  const toggleMute = useCallback((id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const muted = !t.muted;
        engineRef.current?.setTrackMuted(id, muted);
        return { ...t, muted };
      }),
    );
  }, []);

  const toggleSolo = useCallback((id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const solo = !t.solo;
        engineRef.current?.setTrackSolo(id, solo);
        return { ...t, solo };
      }),
    );
  }, []);

  const summary =
    instrument.kind === "drum"
      ? `${instrument.label} · ${styleLabel(selection.styleId)}`
      : `${instrument.label} · ${chordSymbol(selection.root, selection.quality)} · ${styleLabel(selection.styleId)}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 pb-40 pt-4">
        <InstrumentPicker value={selection.instrumentId} onChange={handleInstrument} />

        <ChordGrid
          root={selection.root}
          quality={selection.quality}
          octave={selection.octave}
          pitched={instrument.kind === "pitched"}
          onRoot={(root) => setSelection((p) => ({ ...p, root }))}
          onQuality={(quality) => setSelection((p) => ({ ...p, quality }))}
          onOctave={(octave) => setSelection((p) => ({ ...p, octave }))}
        />

        <StylePicker
          styleIds={instrument.styleIds}
          value={selection.styleId}
          onChange={(styleId) => setSelection((p) => ({ ...p, styleId }))}
        />

        <LoopPad
          summary={summary}
          isPlaying={isPlaying}
          loading={loading}
          onLock={lockLoop}
        />

        <TrackRack
          tracks={tracks}
          onRemove={removeTrack}
          onVolume={setTrackVolume}
          onToggleMute={toggleMute}
          onToggleSolo={toggleSolo}
        />
      </main>

      <TransportBar
        isPlaying={isPlaying}
        loading={loading}
        bpm={bpm}
        masterVolume={masterVolume}
        onToggle={togglePlay}
        onBpm={handleBpm}
        onMasterVolume={handleMasterVolume}
      />
    </div>
  );
}
