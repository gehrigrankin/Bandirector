/**
 * Playing-style generators. Each style turns a chord (MIDI notes, low → high)
 * into one bar of timed events. The engine tiles these across the loop and
 * feeds them to smplr's Sequencer.
 *
 * Pitched styles emit `PitchedNote[]` (one entry per sounded note). Drum styles
 * emit `DrumHit[]` with an abstract voice the engine maps to the kit's samples.
 */
import { STRUM_PATTERNS } from "@/lib/music/patterns";

export interface GenContext {
  /** Chord notes as MIDI numbers, low → high. */
  chord: number[];
  /** Ticks per quarter note. */
  ppq: number;
  /** Beats per bar. */
  beatsPerBar: number;
}

export interface PitchedNote {
  note: number;
  /** Position in ticks from the bar start. */
  at: number;
  /** Duration in ticks. */
  duration: number;
  /** MIDI velocity 0–127. */
  velocity: number;
}

export type DrumVoice = "kick" | "snare" | "hat";

export interface DrumHit {
  voice: DrumVoice;
  at: number;
  velocity: number;
}

export interface StyleDef {
  id: string;
  label: string;
  kind: "pitched" | "drum";
  pitched?: (ctx: GenContext) => PitchedNote[];
  drum?: (ctx: GenContext) => DrumHit[];
}

// --- helpers ---------------------------------------------------------------

const top = (chord: number[]) => chord[chord.length - 1] ?? 60;
const root = (chord: number[]) => chord[0] ?? 48;
const at = (ctx: GenContext, beat: number) => Math.round(beat * ctx.ppq);

/** A downward/upward strum: notes staggered slightly in time like a real stroke. */
function strum(
  chord: number[],
  startTick: number,
  up: boolean,
  dur: number,
  velocity: number,
): PitchedNote[] {
  const order = up ? [...chord].reverse() : [...chord];
  const spread = 14; // ticks between adjacent strings
  return order.map((note, i) => ({
    note,
    at: startTick + i * spread,
    duration: dur,
    velocity,
  }));
}

/** Reusable strum-pattern generator over the 8 eighth-note slots of a bar. */
function strumPattern(strokes: ("D" | "U" | "-")[]) {
  return (ctx: GenContext): PitchedNote[] => {
    if (!ctx.chord.length) return [];
    const eighth = ctx.ppq / 2;
    const notes: PitchedNote[] = [];
    strokes.forEach((stroke, i) => {
      if (stroke === "-") return;
      notes.push(
        ...strum(
          ctx.chord,
          Math.round(i * eighth),
          stroke === "U",
          Math.round(eighth * 1.6),
          stroke === "D" ? 102 : 78,
        ),
      );
    });
    return notes;
  };
}

/** Arpeggio over the chord following a sequence of chord-tone indices. */
function arpeggio(seq: number[], step: number, velocity = 88) {
  return (ctx: GenContext): PitchedNote[] => {
    const { chord } = ctx;
    if (!chord.length) return [];
    const dur = Math.round(ctx.ppq / step) - 4;
    return seq.map((idx, i) => ({
      note: chord[idx % chord.length],
      at: at(ctx, i / step),
      duration: Math.max(dur, 60),
      velocity,
    }));
  };
}

/** Sustain the whole chord for the full bar. */
function pad(velocity: number) {
  return (ctx: GenContext): PitchedNote[] => {
    if (!ctx.chord.length) return [];
    const bar = ctx.beatsPerBar * ctx.ppq;
    return ctx.chord.map((note) => ({ note, at: 0, duration: bar, velocity }));
  };
}

// --- pitched styles --------------------------------------------------------

const STYLE_LIST: StyleDef[] = [
  { id: "rhythm1", label: "Rhythm 1", kind: "pitched", pitched: strumPattern(STRUM_PATTERNS.folk.strokes) },
  { id: "rhythm2", label: "Rhythm 2", kind: "pitched", pitched: strumPattern(STRUM_PATTERNS.pop.strokes) },
  { id: "rhythm3", label: "Rhythm 3", kind: "pitched", pitched: strumPattern(STRUM_PATTERNS.rock.strokes) },

  // Fingerstyle: index sequences across 8 eighth notes (step = 2 per beat)
  { id: "fingerstyle1", label: "Fingerstyle 1", kind: "pitched", pitched: arpeggio([0, 2, 1, 2, 0, 2, 1, 2], 2, 84) },
  { id: "fingerstyle2", label: "Fingerstyle 2", kind: "pitched", pitched: arpeggio([0, 1, 2, 3, 3, 2, 1, 0], 2, 84) },
  { id: "fingerstyle3", label: "Fingerstyle 3", kind: "pitched", pitched: arpeggio([0, 2, 3, 2, 1, 2, 3, 2], 2, 84) },

  {
    id: "pluck",
    label: "Pluck",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const q = ctx.ppq;
      const dur = Math.round(q * 0.9);
      return [
        { note: root(ctx.chord), at: at(ctx, 0), duration: dur, velocity: 96 },
        { note: top(ctx.chord), at: at(ctx, 1), duration: dur, velocity: 80 },
        { note: root(ctx.chord), at: at(ctx, 2), duration: dur, velocity: 96 },
        { note: top(ctx.chord), at: at(ctx, 3), duration: dur, velocity: 80 },
      ];
    },
  },

  // 16th-note arpeggio up (electric / winds)
  { id: "arp", label: "Arpeggio", kind: "pitched", pitched: arpeggio([0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], 4, 86) },

  {
    id: "power",
    label: "Power chords",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const r = root(ctx.chord);
      const fifth = r + 7;
      const eighth = ctx.ppq / 2;
      const notes: PitchedNote[] = [];
      for (let i = 0; i < ctx.beatsPerBar * 2; i++) {
        notes.push(
          { note: r, at: Math.round(i * eighth), duration: Math.round(eighth), velocity: 100 },
          { note: fifth, at: Math.round(i * eighth) + 6, duration: Math.round(eighth), velocity: 96 },
        );
      }
      return notes;
    },
  },

  // Bass
  {
    id: "bassRoot",
    label: "Root notes",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const r = root(ctx.chord);
      return Array.from({ length: ctx.beatsPerBar }, (_, i) => ({
        note: r,
        at: at(ctx, i),
        duration: Math.round(ctx.ppq * 0.9),
        velocity: 100,
      }));
    },
  },
  {
    id: "bassRootFifth",
    label: "Root–fifth",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const r = root(ctx.chord);
      const seq = [r, r + 7, r, r + 7];
      return seq.map((note, i) => ({
        note,
        at: at(ctx, i),
        duration: Math.round(ctx.ppq * 0.9),
        velocity: 98,
      }));
    },
  },
  {
    id: "bassWalk",
    label: "Walking",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const r = root(ctx.chord);
      const third = ctx.chord[1] ?? r + 4;
      const fifth = ctx.chord[2] ?? r + 7;
      const seq = [r, third, fifth, r + 10];
      return seq.map((note, i) => ({
        note,
        at: at(ctx, i),
        duration: Math.round(ctx.ppq * 0.9),
        velocity: 96,
      }));
    },
  },
  {
    id: "bassOctave",
    label: "Octaves",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const r = root(ctx.chord);
      const eighth = ctx.ppq / 2;
      return Array.from({ length: ctx.beatsPerBar * 2 }, (_, i) => ({
        note: i % 2 === 0 ? r : r + 12,
        at: Math.round(i * eighth),
        duration: Math.round(eighth * 0.9),
        velocity: i % 2 === 0 ? 100 : 84,
      }));
    },
  },

  // Keys
  {
    id: "keysBlock",
    label: "Block chords",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const half = Math.round((ctx.beatsPerBar / 2) * ctx.ppq);
      const hit = (start: number, vel: number) =>
        ctx.chord.map((note) => ({ note, at: start, duration: half, velocity: vel }));
      return [...hit(0, 92), ...hit(half, 84)];
    },
  },
  { id: "keysArp", label: "Arpeggio", kind: "pitched", pitched: arpeggio([0, 1, 2, 3, 0, 1, 2, 3], 2, 86) },
  {
    id: "keysBroken",
    label: "Broken (Alberti)",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const lo = ctx.chord[0];
      const mid = ctx.chord[1] ?? lo + 4;
      const hi = ctx.chord[2] ?? lo + 7;
      const seq = [lo, hi, mid, hi, lo, hi, mid, hi];
      const eighth = ctx.ppq / 2;
      return seq.map((note, i) => ({
        note,
        at: Math.round(i * eighth),
        duration: Math.round(eighth * 0.95),
        velocity: 82,
      }));
    },
  },
  { id: "keysSustain", label: "Sustain", kind: "pitched", pitched: pad(80) },

  // Pads / winds / strings
  { id: "sustain", label: "Sustain", kind: "pitched", pitched: pad(82) },
  { id: "swell", label: "Swell", kind: "pitched", pitched: pad(64) },
  {
    id: "stabs",
    label: "Stabs",
    kind: "pitched",
    pitched: (ctx) => {
      if (!ctx.chord.length) return [];
      const dur = Math.round(ctx.ppq * 0.4);
      const notes: PitchedNote[] = [];
      for (let i = 0; i < ctx.beatsPerBar; i++) {
        notes.push(
          ...ctx.chord.map((note) => ({ note, at: at(ctx, i), duration: dur, velocity: 96 })),
        );
      }
      return notes;
    },
  },

  // Drums
  { id: "drumRock", label: "Rock", kind: "drum", drum: drumKit([0, 2], [1, 3], 8) },
  { id: "drumPop", label: "Pop", kind: "drum", drum: drumKit([0, 2.5], [1, 3], 8) },
  { id: "drumFunk", label: "Funk", kind: "drum", drum: drumKit([0, 1.5, 2.75], [1, 3], 16) },
  { id: "drumFolk", label: "Folk", kind: "drum", drum: drumKit([0], [2], 8, 64) },
  { id: "drumBallad", label: "Ballad", kind: "drum", drum: drumKit([0], [2], 4, 60) },
  { id: "drumLatin", label: "Latin", kind: "drum", drum: drumKit([0, 1.5, 2], [1.5, 3], 8) },
];

/** Build a drum-kit generator from kick beats, snare beats, and hat subdivision. */
function drumKit(
  kickBeats: number[],
  snareBeats: number[],
  hatDiv: number,
  hatVel = 72,
) {
  return (ctx: GenContext): DrumHit[] => {
    const hits: DrumHit[] = [];
    for (const b of kickBeats) hits.push({ voice: "kick", at: at(ctx, b), velocity: 112 });
    for (const b of snareBeats) hits.push({ voice: "snare", at: at(ctx, b), velocity: 104 });
    const span = ctx.beatsPerBar; // beats per bar
    for (let i = 0; i < hatDiv; i++) {
      hits.push({ voice: "hat", at: at(ctx, (i / hatDiv) * span), velocity: hatVel });
    }
    return hits;
  };
}

export const STYLES: Record<string, StyleDef> = Object.fromEntries(
  STYLE_LIST.map((s) => [s.id, s]),
);

export function styleLabel(id: string): string {
  return STYLES[id]?.label ?? id;
}
