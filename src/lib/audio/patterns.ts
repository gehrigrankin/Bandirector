// The dynamic pattern system. A loop part is a programmable step pattern, not a
// fixed preset:
//   • Melodic instruments  → a single 16-step row of hits + an articulation
//     (how the chord is voiced on each hit: strum / block / arp / root / octave).
//   • Drums                → one 16-step row per voice (kick/snare/hat/…).
// Presets just seed the grid; everything is then editable. renderPattern() turns
// a pattern + the current chord into the bar's note events.

import type { BarEvent } from "@/lib/audio/engine";
import type { StyleFamily } from "@/lib/audio/instruments";
import {
  leftHandGuide,
  leftHandRoot,
  leftHandStab,
  leftHandWalk,
  rightHandVoicing,
  type Voicing,
} from "@/lib/music/voicing";

export const STEP_COUNT = 16; // sixteenth-note grid
export const BEAT_STEPS = 4; // steps per beat (4/4)

export interface PatternArgs {
  /** Chord tones as MIDI numbers, root position (root first). */
  chordNotes: number[];
  rootMidi: number;
  barSeconds: number;
  octave: number;
  /** Root pitch-class (0–11) and interval set — used by the keyboard comp
   *  engine to build register-separated two-hand voicings. */
  rootPc: number;
  intervals: number[];
}

// ─── Articulation (how a melodic hit voices the chord) ───────────────────────

export type Articulation = "strum" | "block" | "arp" | "root" | "octave";

export const ARTICULATIONS: { id: Articulation; label: string }[] = [
  { id: "strum", label: "Strum" },
  { id: "block", label: "Block" },
  { id: "arp", label: "Arp" },
  { id: "root", label: "Root" },
  { id: "octave", label: "Octave" },
];

// ─── Keyboard comping (left-hand texture + right-hand pattern + voicing) ─────
// Keyboard instruments comp with two hands in separate registers rather than a
// single articulated row. The texture/pattern names compile down to the same
// step-trigger events the sequencer already consumes (see renderComp).

export type LeftHandTexture = "bass" | "octaves" | "shell" | "stride" | "walking";

export const LEFT_HAND_TEXTURES: { id: LeftHandTexture; label: string }[] = [
  { id: "bass", label: "Bass" },
  { id: "octaves", label: "Octaves" },
  { id: "shell", label: "Shell" },
  { id: "stride", label: "Stride" },
  { id: "walking", label: "Walking" },
];

export type RightHandPattern =
  | "block"
  | "broken"
  | "arpeggio"
  | "comp"
  | "charleston"
  | "neosoul";

export const RIGHT_HAND_PATTERNS: { id: RightHandPattern; label: string }[] = [
  { id: "block", label: "Block" },
  { id: "broken", label: "Broken" },
  { id: "arpeggio", label: "Arpeggio" },
  { id: "comp", label: "Comp" },
  { id: "charleston", label: "Charleston" },
  { id: "neosoul", label: "Neo-soul" },
];

// ─── Drums ───────────────────────────────────────────────────────────────────

export type DrumVoice = "kick" | "snare" | "hihat" | "openhat" | "clap";

export const DRUM_VOICES: { id: DrumVoice; label: string }[] = [
  { id: "kick", label: "Kick" },
  { id: "snare", label: "Snare" },
  { id: "hihat", label: "Hat" },
  { id: "openhat", label: "Open" },
  { id: "clap", label: "Clap" },
];

const DRUM_VOICE_IDS = DRUM_VOICES.map((v) => v.id);

const DRUM_VELOCITY: Record<DrumVoice, number> = {
  kick: 112,
  snare: 108,
  hihat: 80,
  openhat: 78,
  clap: 104,
};

// ─── Pattern shapes ──────────────────────────────────────────────────────────

export interface MelodicPattern {
  kind: "melodic";
  hits: boolean[]; // length STEP_COUNT
  articulation: Articulation;
}

export interface DrumPattern {
  kind: "drums";
  rows: Record<DrumVoice, boolean[]>; // each length STEP_COUNT
}

/** A two-handed keyboard comp: a left-hand texture, a right-hand pattern, and
 *  the voicing the right hand uses. Renders to step events in renderComp. */
export interface CompPattern {
  kind: "comp";
  leftHand: LeftHandTexture;
  rightHand: RightHandPattern;
  voicing: Voicing;
}

export type Pattern = MelodicPattern | DrumPattern | CompPattern;

function emptyRow(): boolean[] {
  return Array.from({ length: STEP_COUNT }, () => false);
}

function row(...steps: number[]): boolean[] {
  const r = emptyRow();
  for (const s of steps) if (s >= 0 && s < STEP_COUNT) r[s] = true;
  return r;
}

function melodic(articulation: Articulation, ...steps: number[]): MelodicPattern {
  return { kind: "melodic", articulation, hits: row(...steps) };
}

function drumKit(spec: Partial<Record<DrumVoice, number[]>>): DrumPattern {
  const rows = {} as Record<DrumVoice, boolean[]>;
  for (const v of DRUM_VOICE_IDS) rows[v] = row(...(spec[v] ?? []));
  return { kind: "drums", rows };
}

/** An empty pattern of the same kind (Clear button), keeping articulation.
 *  Comp patterns have nothing to clear, so they're returned unchanged. */
export function emptyPatternLike(p: Pattern): Pattern {
  if (p.kind === "comp") return clonePattern(p);
  return p.kind === "drums"
    ? {
        kind: "drums",
        rows: Object.fromEntries(
          DRUM_VOICE_IDS.map((v) => [v, emptyRow()]),
        ) as Record<DrumVoice, boolean[]>,
      }
    : { kind: "melodic", articulation: p.articulation, hits: emptyRow() };
}

/** Deep copy so editing a track's pattern never mutates a shared preset. */
export function clonePattern(p: Pattern): Pattern {
  if (p.kind === "comp") return { ...p };
  return p.kind === "drums"
    ? {
        kind: "drums",
        rows: Object.fromEntries(
          DRUM_VOICE_IDS.map((v) => [v, [...p.rows[v]]]),
        ) as Record<DrumVoice, boolean[]>,
      }
    : { kind: "melodic", articulation: p.articulation, hits: [...p.hits] };
}

// ─── Rendering ───────────────────────────────────────────────────────────────

const STRUM_SPREAD = 0.022; // seconds between strings in a strummed hit

function renderMelodic(p: MelodicPattern, a: PatternArgs): BarEvent[] {
  const { chordNotes, rootMidi, barSeconds } = a;
  const stepDur = barSeconds / STEP_COUNT;
  const dur = stepDur * 1.8;
  const ladder = [...chordNotes, ...chordNotes.map((n) => n + 12)];
  const events: BarEvent[] = [];
  let arp = 0;
  p.hits.forEach((on, i) => {
    if (!on) return;
    const t = i * stepDur;
    switch (p.articulation) {
      case "block":
        for (const n of chordNotes)
          events.push({ note: n, time: t, duration: dur, velocity: 88 });
        break;
      case "strum": {
        const voicing = [chordNotes[0] - 12, ...chordNotes];
        voicing.forEach((n, k) =>
          events.push({ note: n, time: t + k * STRUM_SPREAD, duration: dur, velocity: 92 }),
        );
        break;
      }
      case "arp":
        events.push({ note: ladder[arp % ladder.length], time: t, duration: dur, velocity: 86 });
        arp++;
        break;
      case "root":
        events.push({ note: rootMidi, time: t, duration: dur, velocity: 98 });
        break;
      case "octave":
        events.push({ note: rootMidi, time: t, duration: dur, velocity: 98 });
        events.push({ note: rootMidi + 12, time: t + 0.008, duration: dur, velocity: 84 });
        break;
    }
  });
  return events;
}

function renderDrums(p: DrumPattern, a: PatternArgs): BarEvent[] {
  const stepDur = a.barSeconds / STEP_COUNT;
  const events: BarEvent[] = [];
  for (const voice of DRUM_VOICE_IDS) {
    p.rows[voice].forEach((on, i) => {
      if (on)
        events.push({
          note: voice,
          time: i * stepDur,
          duration: stepDur,
          velocity: DRUM_VELOCITY[voice],
        });
    });
  }
  return events;
}

const EIGHTH_STEPS = [0, 2, 4, 6, 8, 10, 12, 14];

function renderComp(p: CompPattern, a: PatternArgs): BarEvent[] {
  const { rootPc, intervals, barSeconds } = a;
  const stepDur = barSeconds / STEP_COUNT;
  const events: BarEvent[] = [];
  const hit = (note: number, step: number, duration: number, velocity: number) =>
    events.push({ note, time: step * stepDur, duration, velocity });

  // ── Left hand (bass register) ──
  const root = leftHandRoot(rootPc);
  const beatDur = stepDur * 3.4;
  switch (p.leftHand) {
    case "bass":
      [0, 8].forEach((s) => hit(root, s, beatDur, 96));
      break;
    case "octaves":
      [0, 8].forEach((s) => {
        hit(root, s, beatDur, 96);
        hit(root + 12, s, beatDur, 82);
      });
      break;
    case "shell": {
      const held = barSeconds * 0.5;
      hit(root, 0, held, 96);
      leftHandGuide(rootPc, intervals).forEach((g) => hit(g, 0, held, 76));
      hit(root, 8, beatDur, 92);
      break;
    }
    case "stride": {
      [0, 8].forEach((s) => hit(root, s, beatDur, 96));
      const stab = leftHandStab(rootPc, intervals);
      [4, 12].forEach((s) => stab.forEach((n) => hit(n, s, stepDur * 1.6, 76)));
      break;
    }
    case "walking": {
      const line = leftHandWalk(rootPc, intervals);
      [0, 4, 8, 12].forEach((s, i) => hit(line[i], s, stepDur * 3.4, 92));
      break;
    }
  }

  // ── Right hand (voicing register) ──
  const voicing = rightHandVoicing(rootPc, intervals, p.voicing);
  if (voicing.length > 0) {
    const lo = voicing[0];
    const hi = voicing[voicing.length - 1];
    const mid = voicing[Math.min(1, voicing.length - 1)];
    const chordDur = stepDur * 3;
    const chord = (step: number, duration: number, velocity: number) =>
      voicing.forEach((n) => hit(n, step, duration, velocity));
    const single = (seq: number[]) =>
      EIGHTH_STEPS.forEach((s, i) => hit(seq[i], s, stepDur * 1.6, 80));

    switch (p.rightHand) {
      case "block":
        [0, 4, 8, 12].forEach((s) => chord(s, chordDur, 84));
        break;
      case "comp":
        [0, 6, 12].forEach((s) => chord(s, chordDur, 84));
        break;
      case "charleston":
        [0, 6].forEach((s) => chord(s, chordDur, 84));
        break;
      case "neosoul":
        [0, 6, 12].forEach((s) => chord(s, chordDur, 84));
        chord(14, stepDur * 2, 76); // anticipation pushing into the next bar
        break;
      case "broken":
        single([lo, hi, mid, hi, lo, hi, mid, hi]);
        break;
      case "arpeggio":
        single([lo, mid, hi, hi, lo, mid, hi, hi]);
        break;
    }
  }

  return events;
}

export function renderPattern(p: Pattern, a: PatternArgs): BarEvent[] {
  if (p.kind === "drums") return renderDrums(p, a);
  if (p.kind === "comp") return renderComp(p, a);
  return renderMelodic(p, a);
}

// ─── Presets (starting points, fully editable after) ─────────────────────────

export interface Preset {
  id: string;
  label: string;
  pattern: Pattern;
}

const EIGHTHS = [0, 2, 4, 6, 8, 10, 12, 14];
const QUARTERS = [0, 4, 8, 12];

const PRESETS: Record<StyleFamily, Preset[]> = {
  strum: [
    { id: "down8", label: "8th Strums", pattern: melodic("strum", ...EIGHTHS) },
    { id: "pop", label: "Pop", pattern: melodic("strum", 0, 4, 6, 8, 12, 14) },
    { id: "quarters", label: "Quarters", pattern: melodic("strum", ...QUARTERS) },
    { id: "arp", label: "Arpeggio", pattern: melodic("arp", ...EIGHTHS) },
    { id: "ballad", label: "Ballad", pattern: melodic("block", 0, 8) },
  ],
  bass: [
    { id: "root4", label: "Roots", pattern: melodic("root", ...QUARTERS) },
    { id: "root8", label: "Driving 8ths", pattern: melodic("root", ...EIGHTHS) },
    { id: "oct", label: "Octaves", pattern: melodic("octave", ...QUARTERS) },
    { id: "sync", label: "Syncopated", pattern: melodic("root", 0, 6, 8, 11, 14) },
  ],
  keys: [
    { id: "block4", label: "Block", pattern: melodic("block", ...QUARTERS) },
    { id: "arp", label: "Arpeggio", pattern: melodic("arp", ...EIGHTHS) },
    { id: "offbeat", label: "Offbeats", pattern: melodic("block", 2, 6, 10, 14) },
    { id: "pad", label: "Sustained", pattern: melodic("block", 0) },
  ],
  sustain: [
    { id: "hold", label: "Hold", pattern: melodic("block", 0) },
    { id: "stabs", label: "Stabs", pattern: melodic("block", 0, 8) },
    { id: "arp", label: "Arpeggio", pattern: melodic("arp", ...QUARTERS) },
    { id: "swell", label: "Swell", pattern: melodic("block", 0, 8) },
  ],
  drums: [
    {
      id: "rock",
      label: "Rock",
      pattern: drumKit({ kick: [0, 8], snare: [4, 12], hihat: EIGHTHS }),
    },
    {
      id: "pop",
      label: "Pop",
      pattern: drumKit({ kick: [0, 6, 8], snare: [4, 12], hihat: EIGHTHS }),
    },
    {
      id: "funk",
      label: "Funk",
      pattern: drumKit({ kick: [0, 3, 6, 10], snare: [4, 12], hihat: EIGHTHS, openhat: [14] }),
    },
    {
      id: "halftime",
      label: "Half-time",
      pattern: drumKit({ kick: [0, 10], snare: [8], hihat: EIGHTHS }),
    },
    {
      id: "fourfloor",
      label: "4-Floor",
      pattern: drumKit({ kick: QUARTERS, snare: [4, 12], openhat: [2, 6, 10, 14] }),
    },
    {
      id: "latin",
      label: "Latin",
      pattern: drumKit({ kick: [0, 6, 8], snare: [3, 7, 10], hihat: EIGHTHS }),
    },
  ],
};

export function presetsFor(family: StyleFamily): Preset[] {
  return PRESETS[family];
}

/** The default keyboard comp: bass left hand, block right hand, plain triads. */
export function defaultComp(): CompPattern {
  return { kind: "comp", leftHand: "bass", rightHand: "block", voicing: "triad" };
}

export function defaultPattern(family: StyleFamily): Pattern {
  if (family === "keys") return defaultComp();
  return clonePattern(PRESETS[family][0].pattern);
}

/** Short human description for the LoopPad / track rack. */
export function patternSummary(p: Pattern): string {
  if (p.kind === "comp") {
    const lh = LEFT_HAND_TEXTURES.find((t) => t.id === p.leftHand)?.label ?? "";
    const rh = RIGHT_HAND_PATTERNS.find((r) => r.id === p.rightHand)?.label ?? "";
    return `${lh} · ${rh}`;
  }
  if (p.kind === "drums") {
    const hits = DRUM_VOICE_IDS.reduce(
      (n, v) => n + p.rows[v].filter(Boolean).length,
      0,
    );
    const voices = DRUM_VOICE_IDS.filter((v) => p.rows[v].some(Boolean)).length;
    return `${hits} hits · ${voices} voices`;
  }
  const count = p.hits.filter(Boolean).length;
  const art = ARTICULATIONS.find((a) => a.id === p.articulation)?.label ?? "";
  return `${art} · ${count} hits`;
}
