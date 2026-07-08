"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, SkipBack, Volume2 } from "lucide-react";
import { getEngine, type ScheduledTrack } from "@/lib/audio/engine";
import {
  getInstrument,
  INSTRUMENTS,
  type InstrumentId,
} from "@/lib/audio/instruments";
import {
  STEP_COUNT,
  clonePattern,
  defaultPattern,
  emptyPatternLike,
  presetsFor,
  renderPattern,
  type Articulation,
  type CompPattern,
  type DrumVoice,
  type LeftHandTexture,
  type Pattern,
  type RightHandPattern,
} from "@/lib/audio/patterns";
import {
  chordIntervals,
  chordNoteNames,
  chordSymbol,
  chordToMidi,
  diatonicChords,
  extendQuality,
  noteToSemitone,
  progressionFromDegrees,
  type ChordExt,
  type Mode,
} from "@/lib/music/chord";
import type { Voicing } from "@/lib/music/voicing";
import type { ChordStep, Selection, Track } from "@/components/studio/types";
import { patternSummary } from "@/lib/audio/patterns";
import { InstrumentPicker } from "@/components/studio/InstrumentPicker";
import { KeySelect } from "@/components/studio/KeySelect";
import { Suggestions } from "@/components/studio/Suggestions";
import { StylePresets } from "@/components/studio/StylePresets";
import { DiatonicChords } from "@/components/studio/DiatonicChords";
import { ChordGrid } from "@/components/studio/ChordGrid";
import { StepSequencer } from "@/components/studio/StepSequencer";
import { Slider, lengthLabel, reverbLabel } from "@/components/studio/Slider";
import {
  ProgressionCards,
  type ProgressionCard,
} from "@/components/studio/ProgressionCards";
import { GrooveCards, type GrooveOption } from "@/components/studio/GrooveCards";
import { HandsKeyboard } from "@/components/studio/HandsKeyboard";
import { TransportBar } from "@/components/studio/TransportBar";
import { Lock, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PREVIEW_VOLUME = 0.85;

// ── Groove card metadata ─────────────────────────────────────────────────────
// Keyboard right-hand grooves shown as visual cards (id → copy + rhythm glyph).
const RH_GROOVE_ORDER = [
  "neosoul",
  "block",
  "arpeggio",
  "charleston",
  "comp",
  "broken",
] as const;
const RH_GROOVE_META: Record<string, { name: string; desc: string; glyph: number[] }> = {
  neosoul: { name: "Neo-soul", desc: "Lush offbeat comp", glyph: [1, 0.1, 0.1, 0.8, 0.1, 1, 0.1, 0.6] },
  block: { name: "Block", desc: "Chords on the beat", glyph: [1, 0.1, 1, 0.1, 1, 0.1, 1, 0.1] },
  arpeggio: { name: "Arpeggio", desc: "Flowing single notes", glyph: [0.5, 0.7, 0.9, 1, 0.5, 0.7, 0.9, 1] },
  charleston: { name: "Charleston", desc: "Jazz push on the &", glyph: [1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.1] },
  comp: { name: "Comp", desc: "Steady mid-bar hits", glyph: [1, 0.1, 0.1, 0.7, 0.1, 0.1, 1, 0.1] },
  broken: { name: "Broken", desc: "Gently rolled chords", glyph: [0.6, 0.9, 0.4, 0.9, 0.6, 0.9, 0.4, 0.9] },
};

// Short descriptions for melodic / drum presets.
const PRESET_DESC: Record<string, string> = {
  down8: "Steady eighth strums",
  pop: "Syncopated pop feel",
  quarters: "One per beat",
  arp: "Rolled single notes",
  ballad: "Slow held chords",
  root4: "Root on every beat",
  root8: "Driving eighth roots",
  oct: "Root + octave",
  sync: "Off-beat pushes",
  block4: "Chords on the beat",
  offbeat: "Off-beat stabs",
  pad: "One sustained chord",
  hold: "One long swell",
  stabs: "Short accents",
  swell: "Gentle rises",
  rock: "Kick 1&3, snare 2&4",
  funk: "Ghosted, busy kick",
  halftime: "Wide, heavy backbeat",
  fourfloor: "Kick every beat",
  latin: "Syncopated clave",
};

/** 8-step glyph from a melodic/drum pattern's density. */
function glyphFromPattern(p: Pattern): number[] {
  const out: number[] = [];
  if (p.kind === "melodic") {
    for (let i = 0; i < 8; i++) out.push(p.hits[i * 2] || p.hits[i * 2 + 1] ? 1 : 0.1);
  } else if (p.kind === "drums") {
    const rows = Object.values(p.rows);
    for (let i = 0; i < 8; i++) {
      const on = rows.reduce((n, r) => n + (r[i * 2] || r[i * 2 + 1] ? 1 : 0), 0);
      out.push(Math.min(1, 0.1 + on * 0.3));
    }
  }
  return out;
}

function samePattern(a: Pattern, b: Pattern): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "melodic" && b.kind === "melodic")
    return a.articulation === b.articulation && a.hits.join("") === b.hits.join("");
  if (a.kind === "drums" && b.kind === "drums")
    return Object.keys(a.rows).every(
      (k) => a.rows[k as DrumVoice].join("") === b.rows[k as DrumVoice].join(""),
    );
  return false;
}

const EXT_CYCLE: (ChordExt | undefined)[] = [undefined, "triad", "7th", "9th"];

/** Shared harmony context the scheduler reads to resolve chord colour. */
interface RenderCtx {
  tonic: string;
  mode: Mode;
  chordQuality: ChordExt;
}

/** True for the keyboard family (Piano, Electric Piano, Organ), which gets the
 *  chord-colour / voicing / two-hand comp engine. Other families are unchanged. */
function isKeyboard(instrumentId: InstrumentId): boolean {
  return getInstrument(instrumentId).family === "keys";
}

/** The chord quality a track actually plays. Keyboards upgrade triads to the
 *  current colour level (7th/9th); other instruments keep the base quality. */
function effectiveQuality(step: ChordStep, instrumentId: InstrumentId, ctx: RenderCtx): string {
  if (!isKeyboard(instrumentId)) return step.quality;
  return extendQuality(step.root, step.quality, ctx.tonic, ctx.mode, step.ext ?? ctx.chordQuality);
}

/** Turn a track into the bar-event closure the scheduler runs. Every track
 *  follows the shared progression (barIndex picks the chord) and renders its
 *  own step pattern over it. */
function buildScheduled(t: Track, progression: ChordStep[], ctx: RenderCtx): ScheduledTrack {
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
      if (progression.length === 0) return [];
      const chord = progression[barIndex % progression.length];
      const quality = effectiveQuality(chord, t.instrumentId, ctx);
      const intervals = chordIntervals(quality);
      const rootPc = noteToSemitone(chord.root) ?? 0;
      const chordNotes = def.isDrums ? [] : chordToMidi(chord.root, quality, t.octave);
      const rootMidi = chordNotes[0] ?? 60;
      return renderPattern(t.pattern, {
        chordNotes,
        rootMidi,
        barSeconds,
        octave: t.octave,
        rootPc,
        intervals,
      });
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
  const [showCustomize, setShowCustomize] = useState(false);
  const [stepTab, setStepTab] = useState<"chords" | "groove" | "sound">(
    "chords",
  );
  // Desktop layout: "full" = all steps in view (3a), "focus" = one step at a
  // time with the progression pinned (3b).
  const [viewMode, setViewMode] = useState<"full" | "focus">("full");

  // Global keyboard chord colour: diatonic triads → 7ths → 9ths.
  const [chordQuality, setChordQuality] = useState<ChordExt>("triad");

  // The loop's chord changes (one bar per step), shared by every layer. Starts
  // empty so it's obvious the progression is yours to build.
  const [progression, setProgression] = useState<ChordStep[]>([]);
  const [editIndex, setEditIndex] = useState(0);

  const [selection, setSelection] = useState<Selection>(() => ({
    instrumentId: "acoustic_guitar",
    ...instrumentDefaults("acoustic_guitar"),
    noteLength: DEFAULT_NOTE_LENGTH,
    reverb: DEFAULT_REVERB,
  }));
  const [tracks, setTracks] = useState<Track[]>([]);
  const nextId = useRef(1);

  const hasChords = progression.length > 0;
  const step = hasChords
    ? progression[Math.min(editIndex, progression.length - 1)]
    : undefined;
  // A safe chord for UI math (voicing/note math) when the progression is empty.
  const activeStep: ChordStep = step ?? { root: "C", quality: "maj" };
  const keyboardSelected = isKeyboard(selection.instrumentId);

  // Chord names shown in the UI reflect the active colour (triad → 7th → 9th).
  const renderCtx = useMemo<RenderCtx>(
    () => ({ tonic, mode, chordQuality }),
    [tonic, mode, chordQuality],
  );
  const labelFor = useCallback(
    (s: ChordStep) =>
      chordSymbol(s.root, extendQuality(s.root, s.quality, tonic, mode, s.ext ?? chordQuality)),
    [tonic, mode, chordQuality],
  );
  const progressionLabels = useMemo(
    () => progression.map(labelFor),
    [progression, labelFor],
  );

  // Live snapshot the scheduler reads each bar.
  const scheduled = useMemo<ScheduledTrack[]>(() => {
    const preview = buildScheduled(
      { id: "preview", ...selection, volume: PREVIEW_VOLUME, muted: false, solo: false },
      progression,
      renderCtx,
    );
    return [preview, ...tracks.map((t) => buildScheduled(t, progression, renderCtx))];
  }, [selection, tracks, progression, renderCtx]);

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

  const handleRestart = useCallback(async () => {
    engine.stop();
    await handlePlay();
  }, [engine, handlePlay]);

  const feelLabel = swing < 0.05 ? "Straight" : swing < 0.35 ? "Laid-back" : "Swing";

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

  // ── Keyboard comp editing (left hand / right hand / voicing) ──
  const setComp = useCallback((patch: Partial<Omit<CompPattern, "kind">>) => {
    setSelection((s) =>
      s.pattern.kind === "comp" ? { ...s, pattern: { ...s.pattern, ...patch } } : s,
    );
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
      const next = p.filter((_, i) => i !== index);
      setEditIndex((cur) => Math.max(0, Math.min(cur, next.length - 1)));
      return next;
    });
  }, []);
  // Pick a chord from the "chords in key" palette: seed the first chord when the
  // progression is empty, otherwise replace the selected bar.
  const pickChord = useCallback(
    (root: string, quality: string) => {
      setProgression((p) => {
        if (p.length === 0) {
          setEditIndex(0);
          return [{ root, quality }];
        }
        return p.map((s, i) => (i === editIndex ? { ...s, root, quality } : s));
      });
    },
    [editIndex],
  );
  const applyTemplate = useCallback(
    (degrees: number[], ext?: ChordExt) => {
      const chords = progressionFromDegrees(tonic, mode, degrees).map((c) => ({
        root: c.root,
        quality: c.quality,
      }));
      setProgression(chords);
      setEditIndex(0);
      if (ext) setChordQuality(ext);
    },
    [tonic, mode],
  );

  // ── Genre style bundles — one tap sets colour + voicing + feel + tempo ──
  const applyStyle = useCallback((style: "jazz" | "neosoul") => {
    if (style === "jazz") {
      setBpm(120);
      setChordQuality("7th");
      setSwing(0.5);
      setSelection({
        instrumentId: "piano",
        pattern: { kind: "comp", leftHand: "walking", rightHand: "charleston", voicing: "shell" },
        octave: getInstrument("piano").octave,
        noteLength: 1,
        reverb: 0.2,
      });
    } else {
      setBpm(80);
      setChordQuality("9th");
      setSwing(0.28);
      setSelection({
        instrumentId: "electric_piano",
        pattern: { kind: "comp", leftHand: "octaves", rightHand: "neosoul", voicing: "rootless" },
        octave: getInstrument("electric_piano").octave,
        noteLength: 1.6,
        reverb: 0.45,
      });
    }
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

  // ── Derived view data ──
  const family = getInstrument(selection.instrumentId).family;
  const lockedInstruments = new Set(tracks.map((t) => t.instrumentId));
  const isComp = selection.pattern.kind === "comp";

  const progressionCards: ProgressionCard[] = progression.map((s, i) => {
    const effQ = extendQuality(s.root, s.quality, tonic, mode, s.ext ?? chordQuality);
    const dia = diatonicChords(tonic, mode).find(
      (d) =>
        noteToSemitone(d.root) === noteToSemitone(s.root) && d.quality === s.quality,
    );
    return {
      label: progressionLabels[i],
      numeral: dia?.numeral ?? "—",
      notes: chordNoteNames(s.root, effQ),
      ext: s.ext,
    };
  });

  const cycleColor = () => {
    const idx = EXT_CYCLE.findIndex((e) => e === activeStep.ext);
    setStep({ ext: EXT_CYCLE[(idx + 1) % EXT_CYCLE.length] });
  };

  const grooveOptions: GrooveOption[] = isComp
    ? RH_GROOVE_ORDER.map((id) => ({ id, ...RH_GROOVE_META[id] }))
    : presetsFor(family).map((pr) => ({
        id: pr.id,
        name: pr.label,
        desc: PRESET_DESC[pr.id] ?? "",
        glyph: glyphFromPattern(pr.pattern),
      }));
  const selectedGrooveId =
    selection.pattern.kind === "comp"
      ? selection.pattern.rightHand
      : presetsFor(family).find((pr) => samePattern(pr.pattern, selection.pattern))
          ?.id ?? null;
  const onSelectGroove = (id: string) => {
    if (selection.pattern.kind === "comp")
      setComp({ rightHand: id as RightHandPattern });
    else applyPreset(id);
  };

  const rootPc = noteToSemitone(activeStep.root) ?? 0;
  const effQuality = extendQuality(
    activeStep.root,
    activeStep.quality,
    tonic,
    mode,
    activeStep.ext ?? chordQuality,
  );
  const rhNotes = chordNoteNames(activeStep.root, effQuality);
  const chordPcs = chordIntervals(effQuality).map((i) => (rootPc + i) % 12);
  const bassPcs = [rootPc, (rootPc + 7) % 12];

  const feelValue = swing < 0.05 ? "straight" : swing < 0.35 ? "laidback" : "swing";
  const setFeel = (f: string) =>
    setSwing(f === "straight" ? 0 : f === "laidback" ? 0.28 : 0.5);

  const railLabel = "text-[10px] font-semibold uppercase tracking-[0.12em] text-text-dim";
  const stepBadge = (n: number) => (
    <span className="flex size-5 items-center justify-center rounded-full bg-bg-higher text-[10px] font-semibold text-text-dim">
      {n}
    </span>
  );

  // ── Reusable content blocks ──
  const colorSeg = (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-text-muted">Color</span>
      <div className="flex overflow-hidden rounded-full border border-line">
        {(["triad", "7th", "9th"] as ChordExt[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChordQuality(c)}
            className={cn(
              "px-3 py-1 text-[11px] font-semibold",
              chordQuality === c ? "bg-accent text-black" : "text-text-muted",
            )}
          >
            {c === "triad" ? "Triad" : c}
          </button>
        ))}
      </div>
    </div>
  );

  const tryRow = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-text-dim">Try</span>
      <Suggestions onApply={applyTemplate} />
      <StylePresets onApply={applyStyle} />
    </div>
  );

  const diatonicRow = (
    <div>
      <DiatonicChords
        tonic={tonic}
        mode={mode}
        ext={chordQuality}
        current={hasChords ? activeStep : { root: "", quality: "" }}
        onPick={pickChord}
      />
      <button
        type="button"
        onClick={() => setShowAllChords((v) => !v)}
        className="mt-1 text-[12px] font-medium text-accent hover:text-accent-soft"
      >
        {showAllChords ? "Hide other chords" : "More chords →"}
      </button>
      {showAllChords ? (
        <div className="mt-2">
          <ChordGrid
            root={activeStep.root}
            quality={activeStep.quality}
            onRoot={(root) => pickChord(root, activeStep.quality)}
            onQuality={(quality) => pickChord(activeStep.root, quality)}
          />
        </div>
      ) : null}
    </div>
  );

  const handsPanel = (
    <div className="rounded-2xl border border-line-soft bg-bg-card p-4">
      <div className={railLabel}>What your hands play</div>
      {!hasChords ? (
        <p className="mt-3 text-[11.5px] leading-relaxed text-text-muted">
          Pick a chord above to see the voicing and what each hand plays.
        </p>
      ) : isComp ? (
        <>
          <div className="mt-3">
            <HandsKeyboard bass={bassPcs} chord={chordPcs} width={320} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-[3px]" style={{ background: "#a76a24" }} />
              Left hand · {activeStep.root} octaves
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-[3px]" style={{ background: "#f5a524" }} />
              Right hand ·{" "}
              {selection.pattern.kind === "comp" ? selection.pattern.voicing : ""}
            </span>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-text-muted">
            The left hand holds the bass; the right hand comps{" "}
            {rhNotes.slice(1, 4).join("·")} above it. Updates live as you pick a
            groove.
          </p>
        </>
      ) : (
        <>
          <div className="mt-3 flex gap-1">
            {selection.pattern.kind === "melodic"
              ? selection.pattern.hits.map((on, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-9 flex-1 rounded-[4px] border",
                      on ? "border-accent bg-accent/80" : "border-line bg-[#16161d]",
                      i % 4 === 0 ? "ml-1 first:ml-0" : "",
                    )}
                  />
                ))
              : null}
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-text-muted">
            Pick a groove above, or open Customize to shape every step by hand.
          </p>
        </>
      )}
    </div>
  );

  const grooveArea = (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <GrooveCards
          options={grooveOptions}
          selectedId={selectedGrooveId}
          onSelect={onSelectGroove}
        />
        {handsPanel}
      </div>
      {showCustomize ? (
        <div className="rounded-2xl border border-line-soft bg-bg-card p-3">
          <StepSequencer
            instrumentId={selection.instrumentId}
            pattern={selection.pattern}
            playStep={playStep}
            onToggleStep={toggleStep}
            onToggleDrum={toggleDrum}
            onArticulation={setArticulation}
            onPreset={applyPreset}
            onClear={clearPattern}
            onLeftHand={(v) => setComp({ leftHand: v })}
            onRightHand={(v) => setComp({ rightHand: v })}
            onVoicing={(v) => setComp({ voicing: v })}
          />
        </div>
      ) : null}
    </div>
  );

  const customizeToggle = (
    <button
      type="button"
      onClick={() => setShowCustomize((v) => !v)}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] text-text-soft hover:bg-bg-higher"
    >
      {showCustomize ? "Hide fine-tune" : isComp ? "Customize hands" : "Customize"}
    </button>
  );

  const soundControls = (
    <div className="flex flex-col gap-3">
      <Slider
        label="Note length"
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
      <div>
        <div className="mb-1.5 text-xs text-text-muted">Feel</div>
        <div className="flex overflow-hidden rounded-full border border-line">
          {[
            ["straight", "Straight"],
            ["laidback", "Laid-back"],
            ["swing", "Swing"],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setFeel(v)}
              className={cn(
                "flex-1 px-3 py-1.5 text-[11px] font-semibold",
                feelValue === v ? "bg-accent text-black" : "text-text-muted",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <Slider
        label="Humanize"
        value={humanize}
        display={`${Math.round(humanize * 100)}%`}
        min={0}
        max={1}
        onChange={setHumanize}
      />
    </div>
  );

  const layersBlock =
    tracks.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-[#2e2e38] p-6 text-center text-[11px] leading-relaxed text-text-dim">
        No layers yet. Locked loops stack here and play together under one
        transport.
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        {tracks.map((t) => (
          <div key={t.id} className="rounded-xl border border-line bg-bg-raised p-3">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">
                  {getInstrument(t.instrumentId).label}
                </div>
                <div className="truncate text-[11px] text-text-muted">
                  {patternSummary(t.pattern)}
                </div>
              </div>
              <button
                type="button"
                aria-label="Mute"
                onClick={() => updateTrack(t.id, { muted: !t.muted })}
                className={cn(
                  "flex size-6 items-center justify-center rounded-md border text-[10px] font-bold",
                  t.muted ? "border-accent text-accent" : "border-line text-text-muted",
                )}
              >
                M
              </button>
              <button
                type="button"
                aria-label="Solo"
                onClick={() => updateTrack(t.id, { solo: !t.solo })}
                className={cn(
                  "flex size-6 items-center justify-center rounded-md text-[10px] font-bold",
                  t.solo ? "bg-accent text-black" : "border border-line text-text-muted",
                )}
              >
                S
              </button>
              <button
                type="button"
                aria-label="Remove layer"
                onClick={() => removeTrack(t.id)}
                className="text-text-dim hover:text-danger"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );

  const lockButton = (
    <button
      type="button"
      onClick={lock}
      disabled={!hasChords}
      title={hasChords ? undefined : "Add a chord to your progression first"}
      className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent text-[15px] font-semibold text-black shadow-glow-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    >
      <Lock className="size-[18px]" />
      Lock loop
    </button>
  );

  // Step tabs (shared by desktop Focus mode + mobile).
  const focusTabsEl = (
    <div className="flex gap-1.5">
      {(
        [
          ["chords", "Chords", `${tonic} ${mode === "major" ? "Maj" : "min"} · color`],
          ["groove", "Groove", isComp ? "Comp" : "Pattern"],
          [
            "sound",
            "Sound & feel",
            `${lengthLabel(selection.noteLength)} · ${reverbLabel(selection.reverb)}`,
          ],
        ] as const
      ).map(([id, label, sub]) => (
        <button
          key={id}
          type="button"
          onClick={() => setStepTab(id)}
          className={cn(
            "flex-1 rounded-xl border px-3 py-2 text-left",
            stepTab === id
              ? "border-transparent bg-accent text-black"
              : "border-line-soft bg-bg-raised hover:bg-bg-higher",
          )}
        >
          <div className="text-[12px] font-semibold">{label}</div>
          <div
            className={cn(
              "truncate text-[10px]",
              stepTab === id ? "text-black/70" : "text-text-dim",
            )}
          >
            {sub}
          </div>
        </button>
      ))}
    </div>
  );

  const focusStepContent =
    stepTab === "chords" ? (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <KeySelect tonic={tonic} mode={mode} onTonic={setTonic} onMode={setMode} />
          {colorSeg}
          {tryRow}
        </div>
        {diatonicRow}
      </div>
    ) : stepTab === "groove" ? (
      <div className="flex flex-col gap-3">
        <div className="lg:hidden">
          <InstrumentPicker
            value={selection.instrumentId}
            onSelect={selectInstrument}
          />
        </div>
        <div className="flex items-center">
          <span className="text-[12px] text-text-muted">
            {getInstrument(selection.instrumentId).label} groove
          </span>
          <div className="ml-auto">{customizeToggle}</div>
        </div>
        {grooveArea}
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {soundControls}
        <div className="lg:hidden">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim">
              Layers
            </span>
            <span className="font-mono text-[10px] text-text-muted">
              {tracks.length}
            </span>
          </div>
          {layersBlock}
        </div>
      </div>
    );

  // ── Desktop center + right, per view mode ──
  const centerFull = (
    <div className="scrollbar-thin flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto p-5">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {stepBadge(1)}
          <h2 className="text-sm font-semibold">Write the progression</h2>
          <KeySelect tonic={tonic} mode={mode} onTonic={setTonic} onMode={setMode} />
          {colorSeg}
          <div className="ml-auto">{tryRow}</div>
        </div>
        <ProgressionCards
          cards={progressionCards}
          editIndex={editIndex}
          onSelect={setEditIndex}
          onAdd={addStep}
          onRemove={removeStep}
          onCycleColor={cycleColor}
        />
        {diatonicRow}
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {stepBadge(2)}
          <h2 className="text-sm font-semibold">Choose the groove</h2>
          <span className="text-[12px] text-text-muted">
            {getInstrument(selection.instrumentId).label}
          </span>
          <div className="ml-auto">{customizeToggle}</div>
        </div>
        {grooveArea}
      </section>
    </div>
  );

  const centerFocus = (
    <div className="scrollbar-thin flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
      <ProgressionCards
        cards={progressionCards}
        editIndex={editIndex}
        onSelect={setEditIndex}
        onAdd={addStep}
        onRemove={removeStep}
        onCycleColor={cycleColor}
      />
      {focusTabsEl}
      <div className="min-h-0 flex-1">{focusStepContent}</div>
    </div>
  );

  const rightFull = (
    <aside className="scrollbar-thin flex w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-line-soft p-4">
      <div className="flex items-center gap-2">
        {stepBadge(3)}
        <h2 className="text-sm font-semibold">Shape &amp; lock</h2>
      </div>
      <div className="rounded-2xl border border-line bg-bg-raised p-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[15px] font-semibold">
            {getInstrument(selection.instrumentId).label}
          </span>
          <span className="text-[11px] text-text-muted">
            {patternSummary(selection.pattern)}
          </span>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto">
          {progressionLabels.map((lab, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setEditIndex(i)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 font-display text-[13px] font-semibold",
                i === editIndex
                  ? "bg-accent/15 text-accent"
                  : "border border-line text-text-muted",
              )}
            >
              {lab}
            </button>
          ))}
        </div>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
          {progression.length} bars · in {tonic} {mode === "major" ? "major" : "minor"}
        </div>
        <div className="mt-4">{soundControls}</div>
      </div>
      {lockButton}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim">
            Layers
          </span>
          <span className="font-mono text-[10px] text-text-muted">{tracks.length}</span>
        </div>
        {layersBlock}
      </div>
    </aside>
  );

  const rightFocus = (
    <aside className="scrollbar-thin flex w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-line-soft p-4">
      <div className="rounded-2xl border border-line bg-bg-raised p-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[15px] font-semibold">This loop</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
            {progression.length} bars · {bpm} bpm
          </span>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto">
          {progressionLabels.map((lab, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setEditIndex(i)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 font-display text-[13px] font-semibold",
                i === editIndex
                  ? "bg-accent/15 text-accent"
                  : "border border-line text-text-muted",
              )}
            >
              {lab}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-text-muted">
          Press <span className="font-semibold text-text">Play</span> to preview
          this part over your locked layers.
        </p>
      </div>
      {lockButton}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim">
            Layers
          </span>
          <span className="font-mono text-[10px] text-text-muted">{tracks.length}</span>
        </div>
        {layersBlock}
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg">
      {/* ── Desktop transport toolbar ── */}
      <div className="hidden h-16 flex-shrink-0 items-center gap-4 border-b border-line-soft px-5 lg:flex">
        <div>
          <div className={railLabel}>Songwriter Studio</div>
          <div className="mt-0.5 font-display text-base font-semibold">Untitled loop</div>
        </div>
        <div className="ml-4 flex items-center overflow-hidden rounded-full border border-line">
          {(["full", "focus"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setViewMode(m)}
              className={cn(
                "px-3 py-1 text-[11px] font-semibold capitalize",
                viewMode === m ? "bg-bg-higher text-text" : "text-text-muted",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart"
            className="flex size-9 items-center justify-center rounded-full border border-line text-text-muted hover:text-text"
          >
            <SkipBack className="size-[15px]" fill="currentColor" />
          </button>
          <button
            type="button"
            onClick={isPlaying ? handleStop : handlePlay}
            aria-label={isPlaying ? "Stop" : "Play"}
            className="flex size-[46px] items-center justify-center rounded-full bg-accent text-black shadow-glow-accent"
          >
            {isPlaying ? (
              <Square className="size-[18px]" fill="currentColor" />
            ) : (
              <Play className="size-[18px]" fill="currentColor" />
            )}
          </button>
          <button
            type="button"
            onClick={handleStop}
            aria-label="Stop"
            className="flex size-9 items-center justify-center rounded-full border border-line text-text-muted hover:text-text"
          >
            <Square className="size-[13px]" fill="currentColor" />
          </button>
        </div>
        <div className="h-7 w-px bg-line-soft" />
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[10px] tracking-[0.12em] text-text-dim">BPM</div>
            <div className="font-mono text-lg font-semibold leading-tight text-accent">{bpm}</div>
          </div>
          <input
            type="range"
            min={60}
            max={180}
            step={1}
            value={bpm}
            aria-label="Tempo (BPM)"
            onChange={(e) => setBpm(Number(e.target.value))}
            className="h-4 w-28 accent-accent"
          />
        </div>
        <div className="h-7 w-px bg-line-soft" />
        <div className="flex items-center gap-2">
          <Volume2 className="size-[18px] text-text-muted" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVolume}
            aria-label="Master volume"
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            className="h-4 w-24 accent-accent"
          />
        </div>
      </div>

      {/* ── Desktop 3-panel (3a) ── */}
      <div className="hidden min-h-0 flex-1 lg:flex">
        {/* instruments */}
        <aside className="scrollbar-thin flex w-56 shrink-0 flex-col gap-2 overflow-y-auto border-r border-line-soft p-3">
          <div className={`${railLabel} px-2`}>Instrument</div>
          <div className="flex flex-col gap-0.5">
            {getInstrumentRows({
              value: selection.instrumentId,
              locked: lockedInstruments,
              onSelect: selectInstrument,
            })}
          </div>
        </aside>

        {viewMode === "full" ? centerFull : centerFocus}
        {viewMode === "full" ? rightFull : rightFocus}
      </div>

      {/* ── Mobile / tablet: focus tabs (3b) ── */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <div className="flex flex-shrink-0 items-center gap-2 px-4 pt-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.12em] text-text-dim">
              Songwriter Studio
            </div>
            <div className="font-display text-[17px] font-semibold">Untitled loop</div>
          </div>
          <div className="ml-auto">
            <KeySelect tonic={tonic} mode={mode} onTonic={setTonic} onMode={setMode} />
          </div>
        </div>

        <div className="flex-shrink-0 px-4 pt-3">
          <ProgressionCards
            cards={progressionCards}
            editIndex={editIndex}
            onSelect={setEditIndex}
            onAdd={addStep}
            onRemove={removeStep}
            onCycleColor={cycleColor}
          />
        </div>

        {/* tabs */}
        <div className="flex-shrink-0 px-4 pt-3">{focusTabsEl}</div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
          {focusStepContent}
        </div>

        <div className="flex-shrink-0 px-4 pb-2">{lockButton}</div>
        <TransportBar
          isPlaying={isPlaying}
          bpm={bpm}
          masterVolume={masterVolume}
          onToggle={isPlaying ? handleStop : handlePlay}
          onBpm={setBpm}
          onMasterVolume={setMasterVolume}
        />
      </div>
    </div>
  );
}

// Instrument list rows with locked / editing status tags.
function getInstrumentRows({
  value,
  locked,
  onSelect,
}: {
  value: InstrumentId;
  locked: Set<InstrumentId>;
  onSelect: (id: InstrumentId) => void;
}) {
  return INSTRUMENTS.map((inst) => {
    const active = inst.id === value;
    const isLocked = locked.has(inst.id);
    return (
      <button
        key={inst.id}
        type="button"
        onClick={() => onSelect(inst.id)}
        className={cn(
          "flex h-[38px] items-center rounded-[10px] px-2.5 text-left text-sm transition-colors",
          active
            ? "bg-accent/[0.12] font-semibold text-accent"
            : "text-text-soft hover:bg-bg-raised",
        )}
      >
        {inst.label}
        {active ? (
          <span className="ml-auto text-[10px] font-medium text-accent/80">editing</span>
        ) : isLocked ? (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-ok">
            <Lock className="size-2.5" />
            locked
          </span>
        ) : null}
      </button>
    );
  });
}
