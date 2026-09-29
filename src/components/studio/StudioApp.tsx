"use client";

// The Create page: a GarageBand-style song sketchpad. Sections across the top,
// one row per instrument, click blocks to decide who plays where; the
// inspector under the grid edits whatever is selected (a section's chords, an
// instrument's groove in one section, a track's sound, or the song itself).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getEngine, type ScheduledTrack } from "@/lib/audio/engine";
import { DEFAULT_DRUM_KIT, getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import { STEP_COUNT, defaultPattern, type Pattern } from "@/lib/audio/patterns";
import type { ChordExt, Mode } from "@/lib/music/chord";
import {
  barsForProgression,
  colourSection,
  createSection,
  createSong,
  createTrack,
  duplicateSection,
  forkClipPattern,
  MAX_SECTIONS,
  MAX_TRACKS,
  moveSection,
  nextSectionName,
  removeSection,
  reorderSection,
  resolveTransportBar,
  SECTION_KINDS,
  setClip,
  unforkClipPattern,
  type ChordStep,
  type Section,
  type SectionKind,
  type Song,
  type Track,
  type Transport as TransportState,
} from "@/lib/song/model";
import { buildScheduledTracks } from "@/lib/song/render";
import {
  createProject,
  currentProject,
  deleteProject,
  listProjects,
  openProject,
  parseProjectFile,
  projectFileName,
  saveProject,
  serializeProject,
  type ProjectMeta,
} from "@/lib/song/library";
import { midiFileName, songToMidi } from "@/lib/song/midi";
import { Arrangement, type PlayheadPosition } from "@/components/studio/Arrangement";
import { Transport } from "@/components/studio/Transport";
import { SectionInspector } from "@/components/studio/SectionInspector";
import { ClipInspector } from "@/components/studio/ClipInspector";
import { TrackInspector } from "@/components/studio/TrackInspector";
import { SongInspector } from "@/components/studio/SongInspector";
import type { Selection } from "@/components/studio/shared";

type LoopMode = "song" | "section";

export function StudioApp() {
  const engine = useMemo(() => getEngine(), []);

  const [song, setSong] = useState<Song | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [selection, setSelection] = useState<Selection>({ kind: "song" });
  const [loopMode, setLoopMode] = useState<LoopMode>("song");
  const [anchorId, setAnchorId] = useState<string | null>(null); // section to loop
  const [playFromId, setPlayFromId] = useState<string | null>(null); // where a whole-song play starts
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStep, setPlayStep] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<"saving" | "saved" | "error">("saved");

  // The scheduler reads these on every bar, so edits land without restarting.
  const songRef = useRef<Song | null>(null);
  const transportRef = useRef<TransportState>({ loop: "song", sectionId: null });
  const scheduledRef = useRef<ScheduledTrack[]>([]);

  // Restore after mount so server and client render the same empty shell.
  const show = useCallback((id: string, loaded: Song) => {
    setProjectId(id);
    setSong(loaded);
    const first = loaded.sections[0]?.id ?? null;
    setSelection(first ? { kind: "section", sectionId: first } : { kind: "song" });
    setAnchorId(first);
    setPlayFromId(first);
  }, []);

  useEffect(() => {
    const project = currentProject() ?? createProject(createSong());
    show(project.id, project.song);
    setProjects(listProjects());
  }, [show]);

  const read = useCallback(
    () => ({ song: songRef.current!, transport: transportRef.current }),
    [],
  );
  useEffect(() => {
    songRef.current = song;
    if (song) scheduledRef.current = buildScheduledTracks(read);
  }, [song, read]);

  const transport = useMemo<TransportState>(
    () => ({ loop: loopMode, sectionId: loopMode === "section" ? anchorId : playFromId }),
    [loopMode, anchorId, playFromId],
  );
  useEffect(() => {
    transportRef.current = transport;
  }, [transport]);

  // Keep the running engine in step with song-level settings.
  const bpm = song?.bpm;
  const swing = song?.swing;
  const humanize = song?.humanize;
  useEffect(() => {
    if (bpm != null) engine.setBpm(bpm);
    if (swing != null) engine.setSwing(swing);
    if (humanize != null) engine.setHumanize(humanize);
  }, [engine, bpm, swing, humanize]);
  useEffect(() => () => engine.stop(), [engine]);

  // Autosave (debounced so sequencer taps don't hammer localStorage).
  useEffect(() => {
    if (!song || !projectId) return;
    setSaveState("saving");
    const t = window.setTimeout(() => {
      setSaveState(saveProject(projectId, song) ? "saved" : "error");
      setProjects(listProjects());
    }, 400);
    return () => window.clearTimeout(t);
  }, [song, projectId]);

  // Step playhead for the pattern editor, off the audio clock.
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

  const getPlayhead = useCallback((): PlayheadPosition | null => {
    const ph = engine.getPlayhead();
    const s = songRef.current;
    if (!ph || !s) return null;
    const pos = resolveTransportBar(s, transportRef.current, ph.barIndex);
    return pos ? { songBar: pos.songBar, phase: ph.phase, sectionId: pos.section.id } : null;
  }, [engine]);

  // ── Transport ──
  const start = useCallback(
    async (t: TransportState) => {
      const s = songRef.current;
      if (!s) return;
      transportRef.current = t;
      await engine.resume();
      engine.setBpm(s.bpm);
      engine.setSwing(s.swing);
      engine.setHumanize(s.humanize);
      engine.stop();
      engine.start(() => scheduledRef.current);
      setIsPlaying(true);
    },
    [engine],
  );

  const handlePlay = useCallback(() => {
    const s = songRef.current;
    if (!s) return;
    const first = s.sections[0]?.id ?? null;
    if (loopMode === "song") setPlayFromId(first);
    void start({ loop: loopMode, sectionId: loopMode === "section" ? (anchorId ?? first) : first });
  }, [loopMode, anchorId, start]);

  const handleStop = useCallback(() => {
    engine.stop();
    setIsPlaying(false);
  }, [engine]);

  const changeLoopMode = (mode: LoopMode) => {
    setLoopMode(mode);
    if (!isPlaying) return;
    const first = songRef.current?.sections[0]?.id ?? null;
    void start({ loop: mode, sectionId: mode === "section" ? (anchorId ?? first) : playFromId ?? first });
  };

  const loopSection = (id: string) => {
    setAnchorId(id);
    setLoopMode("section");
    void start({ loop: "section", sectionId: id });
  };

  const playFrom = (id: string) => {
    setPlayFromId(id);
    setLoopMode("song");
    void start({ loop: "song", sectionId: id });
  };

  // ── Editing ──
  const update = useCallback((fn: (s: Song) => Song) => {
    setSong((s) => (s ? fn(s) : s));
  }, []);

  const select = useCallback((sel: Selection) => {
    setSelection(sel);
    if (sel.kind === "section" || sel.kind === "clip") setAnchorId(sel.sectionId);
  }, []);

  const updateSection = (id: string, patch: Partial<Section>) =>
    update((s) => ({ ...s, sections: s.sections.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const setSectionKind = (id: string, kind: SectionKind) =>
    update((s) => {
      const section = s.sections.find((x) => x.id === id);
      if (!section) return s;
      const oldLabel = SECTION_KINDS.find((k) => k.id === section.kind)?.label ?? "";
      const auto = section.name === oldLabel || new RegExp(`^${oldLabel} \\d+$`).test(section.name);
      const others = s.sections.filter((x) => x.id !== id);
      const name = auto ? nextSectionName(others, kind) : section.name;
      return { ...s, sections: s.sections.map((x) => (x.id === id ? { ...x, kind, name } : x)) };
    });

  const setProgression = (id: string, chords: ChordStep[], fromTemplate = false) =>
    update((s) => ({
      ...s,
      sections: s.sections.map((x) =>
        x.id === id
          ? {
              ...x,
              progression: chords,
              bars: fromTemplate
                ? barsForProgression(chords.length, x.bars)
                : Math.max(x.bars, chords.length),
            }
          : x,
      ),
    }));

  const colour = (id: string, ext: ChordExt) =>
    update((s) => ({
      ...s,
      sections: s.sections.map((x) => (x.id === id ? colourSection(x, s.tonic, s.mode, ext) : x)),
    }));

  const addSection = (kind: SectionKind) => {
    if (!song || song.sections.length >= MAX_SECTIONS) return;
    // A new Chorus copies the existing chorus's chords; otherwise the last section's.
    const twin = [...song.sections].reverse().find((x) => x.kind === kind);
    const source = twin ?? song.sections[song.sections.length - 1];
    const section = createSection(song.sections, kind, source?.progression ?? []);
    update((s) => ({ ...s, sections: [...s.sections, section] }));
    select({ kind: "section", sectionId: section.id });
  };

  const duplicate = (id: string) => {
    if (!song) return;
    const next = duplicateSection(song, id);
    if (next === song) return;
    const index = next.sections.findIndex((x) => x.id === id);
    update(() => next);
    select({ kind: "section", sectionId: next.sections[index + 1].id });
  };

  const remove = (id: string) => {
    if (!song) return;
    const next = removeSection(song, id);
    if (next === song) return;
    const fallback = next.sections[0].id;
    update(() => next);
    setSelection({ kind: "section", sectionId: fallback });
    setAnchorId((a) => (a === id ? fallback : a));
    setPlayFromId((p) => (p === id ? fallback : p));
  };

  const updateTrack = useCallback(
    (id: string, fn: (t: Track) => Track) =>
      update((s) => ({ ...s, tracks: s.tracks.map((t) => (t.id === id ? fn(t) : t)) })),
    [update],
  );

  const clipOn = useCallback(
    (trackId: string, sectionId: string, on: boolean) =>
      updateTrack(trackId, (t) => setClip(t, sectionId, { on })),
    [updateTrack],
  );

  const addTrack = (instrumentId: InstrumentId) => {
    if (!song || song.tracks.length >= MAX_TRACKS) return;
    const track = createTrack(instrumentId);
    update((s) => ({ ...s, tracks: [...s.tracks, track] }));
    setSelection({ kind: "track", trackId: track.id });
  };

  const removeTrack = (id: string) => {
    update((s) => ({ ...s, tracks: s.tracks.filter((t) => t.id !== id) }));
    setSelection({ kind: "song" });
  };

  const changeInstrument = (trackId: string, instrumentId: InstrumentId) =>
    updateTrack(trackId, (t) => {
      const def = getInstrument(instrumentId);
      if (getInstrument(t.instrumentId).family === def.family) {
        return { ...t, instrumentId, octave: def.octave };
      }
      // A different family means a different kind of pattern: reset the
      // grooves but keep where the track plays.
      const clips = Object.fromEntries(
        Object.entries(t.clips).map(([k, c]) => [k, { on: c.on }]),
      );
      return {
        ...t,
        instrumentId,
        kit: def.isDrums ? DEFAULT_DRUM_KIT : undefined,
        octave: def.octave,
        pattern: defaultPattern(def.family),
        clips,
      };
    });

  const setClipPattern = (trackId: string, sectionId: string, pattern: Pattern) =>
    updateTrack(trackId, (t) =>
      t.clips[sectionId]?.pattern ? setClip(t, sectionId, { pattern }) : { ...t, pattern },
    );

  const setClipCustom = (trackId: string, sectionId: string, custom: boolean) =>
    updateTrack(trackId, (t) =>
      custom ? forkClipPattern(t, sectionId) : unforkClipPattern(t, sectionId),
    );

  const exportMidi = () => {
    if (!song) return;
    const bytes = songToMidi(song);
    const blob = new Blob([bytes as unknown as BlobPart], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = midiFileName(song);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const download = (text: string, name: string, type: string) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /** Flush the open song to its project before switching away from it. */
  const flush = () => {
    if (song && projectId) saveProject(projectId, song);
  };

  const switchTo = (id: string, loaded: Song) => {
    handleStop();
    flush();
    show(id, loaded);
    saveProject(id, loaded); // marks it as the open project right away
    setProjects(listProjects());
  };

  const newSong = () => {
    flush();
    const project = createProject(createSong());
    switchTo(project.id, project.song);
  };

  const openSong = (id: string) => {
    if (id === projectId) return;
    const project = openProject(id);
    if (project) switchTo(project.id, project.song);
  };

  const duplicateSong = () => {
    if (!song) return;
    flush();
    const copy = createProject({ ...song, title: `${song.title || "Untitled song"} copy` });
    switchTo(copy.id, copy.song);
  };

  const deleteSong = () => {
    if (!song || !projectId) return;
    if (!window.confirm(`Delete "${song.title || "Untitled song"}"? This can't be undone.`)) return;
    handleStop();
    deleteProject(projectId);
    const next = currentProject() ?? createProject(createSong());
    show(next.id, next.song);
    setProjects(listProjects());
  };

  const exportFile = () => {
    if (!song) return;
    download(serializeProject(song), projectFileName(song), "application/json");
  };

  const importFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const loaded = parseProjectFile(await file.text());
      if (!loaded) {
        window.alert("That file isn't a Bandirector song.");
        return;
      }
      flush();
      const project = createProject(loaded);
      switchTo(project.id, project.song);
    };
    input.click();
  };

  // Space plays/stops; Delete takes the selected block out of its section.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        if (isPlaying) handleStop();
        else handlePlay();
      } else if ((e.key === "Backspace" || e.key === "Delete") && selection.kind === "clip") {
        e.preventDefault();
        clipOn(selection.trackId, selection.sectionId, false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, handlePlay, handleStop, selection, clipOn]);

  if (!song) return <div className="flex-1" aria-busy="true" />;

  // ── Inspector ──
  const sectionOf = (id: string) => song.sections.find((x) => x.id === id);
  const trackOf = (id: string) => song.tracks.find((x) => x.id === id);
  const liveInstrument: InstrumentId =
    song.tracks.find((t) => !getInstrument(t.instrumentId).isDrums)?.instrumentId ?? "piano";

  let inspector: React.ReactNode = null;
  if (selection.kind === "section") {
    const section = sectionOf(selection.sectionId);
    if (section) {
      inspector = (
        <SectionInspector
          song={song}
          section={section}
          index={song.sections.indexOf(section)}
          liveInstrument={liveInstrument}
          isLooping={isPlaying && loopMode === "section" && anchorId === section.id}
          onChange={(patch) => updateSection(section.id, patch)}
          onKind={(kind) => setSectionKind(section.id, kind)}
          onProgression={(chords) => setProgression(section.id, chords)}
          onTemplate={(chords) => setProgression(section.id, chords, true)}
          onColour={(ext) => colour(section.id, ext)}
          onLoop={() => loopSection(section.id)}
          onPlayFrom={() => playFrom(section.id)}
          onDuplicate={() => duplicate(section.id)}
          onMove={(delta) => update((s) => moveSection(s, section.id, delta))}
          onRemove={() => remove(section.id)}
        />
      );
    }
  } else if (selection.kind === "clip") {
    const track = trackOf(selection.trackId);
    const section = sectionOf(selection.sectionId);
    if (track && section) {
      inspector = (
        <ClipInspector
          track={track}
          section={section}
          playStep={playStep}
          onOn={(on) => clipOn(track.id, section.id, on)}
          onCustom={(custom) => setClipCustom(track.id, section.id, custom)}
          onPattern={(p) => setClipPattern(track.id, section.id, p)}
        />
      );
    }
  } else if (selection.kind === "track") {
    const track = trackOf(selection.trackId);
    if (track) {
      inspector = (
        <TrackInspector
          song={song}
          track={track}
          playStep={playStep}
          onChange={(patch) => updateTrack(track.id, (t) => ({ ...t, ...patch }))}
          onInstrument={(id) => changeInstrument(track.id, id)}
          onPattern={(p) => updateTrack(track.id, (t) => ({ ...t, pattern: p }))}
          onClipOn={(sectionId, on) => clipOn(track.id, sectionId, on)}
          onRemove={() => removeTrack(track.id)}
        />
      );
    }
  }
  if (!inspector) {
    inspector = (
      <SongInspector
        song={song}
        onChange={(patch) => update((s) => ({ ...s, ...patch }))}
        onExportMidi={exportMidi}
        onNewSong={newSong}
      />
    );
  }

  const loopSectionName = anchorId ? (sectionOf(anchorId)?.name ?? null) : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto xl:overflow-hidden">
      <Transport
        song={song}
        isPlaying={isPlaying}
        loopMode={loopMode}
        loopSectionName={loopSectionName}
        songSelected={selection.kind === "song"}
        saveState={saveState}
        onPlay={handlePlay}
        onStop={handleStop}
        onBpm={(v) => update((s) => ({ ...s, bpm: v }))}
        onKey={(tonic: string, mode: Mode) => update((s) => ({ ...s, tonic, mode }))}
        onLoopMode={changeLoopMode}
        onSelectSong={() => setSelection({ kind: "song" })}
        onExportMidi={exportMidi}
        projects={projects}
        currentProjectId={projectId}
        onOpenProject={openSong}
        onNewSong={newSong}
        onDuplicateSong={duplicateSong}
        onDeleteSong={deleteSong}
        onExportFile={exportFile}
        onImportFile={importFile}
      />

      <Arrangement
        song={song}
        selection={selection}
        isPlaying={isPlaying}
        getPlayhead={getPlayhead}
        onSelect={select}
        onClipOn={clipOn}
        onAddSection={addSection}
        onAddTrack={addTrack}
        onMute={(id, muted) => updateTrack(id, (t) => ({ ...t, muted }))}
        onSolo={(id, solo) => updateTrack(id, (t) => ({ ...t, solo }))}
        onReorderSection={(id, to) => update((s) => reorderSection(s, id, to))}
      />

      <section
        aria-label="Inspector"
        className="scrollbar-thin shrink-0 border-t border-line-soft bg-bg-card pb-[calc(4.25rem+env(safe-area-inset-bottom))] xl:h-[42vh] xl:max-h-[460px] xl:min-h-[300px] xl:overflow-y-auto xl:pb-0"
      >
        <div className="p-4">{inspector}</div>
      </section>
    </div>
  );
}
