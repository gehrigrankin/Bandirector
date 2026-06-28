// Style generators: given a chord (as MIDI notes) and the bar length, each
// returns the note events for one bar. Strum / drum shapes reuse the feel
// arrays from the jam app (src/lib/music/patterns.ts) so the two parts of
// Bandirector share a musical vocabulary. A STYLES registry maps each
// instrument family to its allowed styles.

import type { BarEvent } from "@/lib/audio/engine";
import type { StyleFamily } from "@/lib/audio/instruments";
import { STRUM_PATTERNS } from "@/lib/music/patterns";

export interface PatternArgs {
  /** Chord tones as MIDI numbers, root position (root first). */
  chordNotes: number[];
  rootMidi: number;
  barSeconds: number;
  octave: number;
}

export type StyleGenerator = (args: PatternArgs) => BarEvent[];

export interface StyleDef {
  id: string;
  label: string;
  generate: StyleGenerator;
}

const STAGGER = 0.022; // seconds between strings in a strum (relaxed, human)

function at(notes: number[], i: number): number {
  return notes[((i % notes.length) + notes.length) % notes.length];
}

// ─── Strum / fingerstyle (guitars) ──────────────────────────────────────────

function strumGenerator(
  strokes: ReadonlyArray<"D" | "U" | "-">,
): StyleGenerator {
  return ({ chordNotes, barSeconds }) => {
    const slot = barSeconds / 8;
    const voicing = [chordNotes[0] - 12, ...chordNotes, chordNotes[0] + 12];
    const events: BarEvent[] = [];
    strokes.forEach((stroke, i) => {
      if (stroke === "-") return;
      const t = i * slot;
      const order = stroke === "D" ? voicing : [...voicing].reverse();
      const velocity = stroke === "D" ? 98 : 74;
      order.forEach((note, n) => {
        events.push({
          note,
          time: t + n * STAGGER,
          duration: slot * 2,
          velocity,
        });
      });
    });
    return events;
  };
}

// Travis-style: thumb alternates root / fifth on the beats, fingers fill the
// off-beats with the upper chord tones.
const travisGenerator: StyleGenerator = ({ chordNotes, rootMidi, barSeconds }) => {
  const slot = barSeconds / 8;
  const fifth = rootMidi + 7;
  const upper = chordNotes.slice(1);
  const events: BarEvent[] = [];
  for (let i = 0; i < 8; i++) {
    const t = i * slot;
    if (i % 2 === 0) {
      const bass = i % 4 === 0 ? rootMidi : fifth;
      events.push({ note: bass, time: t, duration: slot * 2, velocity: 90 });
    } else {
      events.push({
        note: at(upper, (i - 1) / 2) + 12,
        time: t,
        duration: slot * 1.5,
        velocity: 74,
      });
    }
  }
  return events;
};

const arpUpGenerator: StyleGenerator = ({ chordNotes, barSeconds }) => {
  const slot = barSeconds / 8;
  const ladder = [...chordNotes, ...chordNotes.map((n) => n + 12)];
  return Array.from({ length: 8 }, (_, i) => ({
    note: at(ladder, i),
    time: i * slot,
    duration: slot * 1.4,
    velocity: 78,
  }));
};

// p-i-m-a: thumb on the root, then the top three voices, repeating.
const pimaGenerator: StyleGenerator = ({ chordNotes, rootMidi, barSeconds }) => {
  const slot = barSeconds / 8;
  const top = [
    rootMidi,
    at(chordNotes, 1) + 12,
    at(chordNotes, 2) + 12,
    chordNotes[0] + 12,
  ];
  return Array.from({ length: 8 }, (_, i) => ({
    note: at(top, i),
    time: i * slot,
    duration: slot * 1.6,
    velocity: i % 4 === 0 ? 92 : 76,
  }));
};

const pluckGenerator: StyleGenerator = ({ chordNotes, rootMidi, barSeconds }) => {
  const half = barSeconds / 2;
  const top = chordNotes[chordNotes.length - 1] + 12;
  return [
    { note: rootMidi, time: 0, duration: half, velocity: 86 },
    { note: top, time: STAGGER, duration: half, velocity: 78 },
    { note: rootMidi, time: half, duration: half, velocity: 80 },
    { note: top, time: half + STAGGER, duration: half, velocity: 74 },
  ];
};

// ─── Bass ────────────────────────────────────────────────────────────────────

const bassRoot: StyleGenerator = ({ rootMidi, barSeconds }) => {
  const q = barSeconds / 4;
  return Array.from({ length: 4 }, (_, i) => ({
    note: rootMidi,
    time: i * q,
    duration: q * 0.9,
    velocity: i === 0 ? 104 : 92,
  }));
};

const bassRootFifth: StyleGenerator = ({ rootMidi, barSeconds }) => {
  const q = barSeconds / 4;
  const fifth = rootMidi + 7;
  return [rootMidi, fifth, rootMidi, fifth].map((note, i) => ({
    note,
    time: i * q,
    duration: q * 0.9,
    velocity: i % 2 === 0 ? 102 : 90,
  }));
};

const bassWalking: StyleGenerator = ({ chordNotes, rootMidi, barSeconds }) => {
  const q = barSeconds / 4;
  const third = at(chordNotes, 1);
  const fifth = rootMidi + 7;
  const walk = [rootMidi, third, fifth, rootMidi + 12];
  return walk.map((note, i) => ({
    note,
    time: i * q,
    duration: q * 0.9,
    velocity: i === 0 ? 102 : 88,
  }));
};

const bassOctave: StyleGenerator = ({ rootMidi, barSeconds }) => {
  const e = barSeconds / 8;
  return Array.from({ length: 8 }, (_, i) => ({
    note: i % 2 === 0 ? rootMidi : rootMidi + 12,
    time: i * e,
    duration: e * 0.9,
    velocity: i % 2 === 0 ? 98 : 86,
  }));
};

// ─── Keys (piano / EP / organ) ───────────────────────────────────────────────

const keysBlock: StyleGenerator = ({ chordNotes, barSeconds }) =>
  chordNotes.map((note) => ({
    note,
    time: 0,
    duration: barSeconds * 0.98,
    velocity: 88,
  }));

const keysArpeggio: StyleGenerator = ({ chordNotes, barSeconds }) => {
  const e = barSeconds / 8;
  const ladder = [...chordNotes, ...chordNotes.map((n) => n + 12)];
  return Array.from({ length: 8 }, (_, i) => ({
    note: at(ladder, i),
    time: i * e,
    duration: e * 1.4,
    velocity: 80,
  }));
};

// Alberti / broken chord: low–high–mid–high.
const keysBroken: StyleGenerator = ({ chordNotes, barSeconds }) => {
  const e = barSeconds / 8;
  const order = [0, 2, 1, 2];
  return Array.from({ length: 8 }, (_, i) => ({
    note: at(chordNotes, order[i % order.length]),
    time: i * e,
    duration: e * 1.2,
    velocity: i % 4 === 0 ? 86 : 74,
  }));
};

const keysSustained: StyleGenerator = ({ chordNotes, barSeconds }) =>
  chordNotes.map((note) => ({
    note,
    time: 0,
    duration: barSeconds,
    velocity: 70,
  }));

// ─── Pads / strings / winds (sustaining voices) ──────────────────────────────

const sustainHold: StyleGenerator = ({ chordNotes, barSeconds }) =>
  chordNotes.map((note) => ({
    note,
    time: 0,
    duration: barSeconds,
    velocity: 72,
  }));

const sustainSwell: StyleGenerator = ({ chordNotes, barSeconds }) =>
  chordNotes.map((note, i) => ({
    note,
    time: 0.02 * i,
    duration: barSeconds,
    velocity: 58,
  }));

const sustainStabs: StyleGenerator = ({ chordNotes, barSeconds }) => {
  const half = barSeconds / 2;
  const events: BarEvent[] = [];
  for (const start of [0, half]) {
    for (const note of chordNotes) {
      events.push({ note, time: start, duration: half * 0.4, velocity: 88 });
    }
  }
  return events;
};

const sustainLine: StyleGenerator = ({ chordNotes, barSeconds }) => {
  const q = barSeconds / 4;
  const ladder = [...chordNotes, chordNotes[0] + 12];
  return Array.from({ length: 4 }, (_, i) => ({
    note: at(ladder, i),
    time: i * q,
    duration: q * 1.1,
    velocity: 76,
  }));
};

// ─── Drums ───────────────────────────────────────────────────────────────────

type DrumGrid = ReadonlyArray<ReadonlyArray<string>>; // 8 eighth-note slots

function drumGenerator(grid: DrumGrid): StyleGenerator {
  return ({ barSeconds }) => {
    const e = barSeconds / 8;
    const events: BarEvent[] = [];
    grid.forEach((hits, i) => {
      for (const drum of hits) {
        const velocity = drum === "kick" || drum === "snare" ? 110 : 78;
        events.push({ note: drum, time: i * e, duration: e, velocity });
      }
    });
    return events;
  };
}

const DRUM_GRIDS: Record<string, DrumGrid> = {
  rock: [
    ["kick", "hihat"],
    ["hihat"],
    ["snare", "hihat"],
    ["hihat"],
    ["kick", "hihat"],
    ["hihat"],
    ["snare", "hihat"],
    ["hihat"],
  ],
  pop: [
    ["kick", "hihat"],
    ["hihat"],
    ["snare", "hihat"],
    ["kick", "hihat"],
    ["hihat"],
    ["hihat"],
    ["snare", "hihat"],
    ["hihat"],
  ],
  funk: [
    ["kick", "hihat"],
    ["hihat"],
    ["snare", "hihat"],
    ["kick", "hihat"],
    ["kick", "hihat"],
    ["hihat"],
    ["snare", "hihat"],
    ["hihat"],
  ],
  folk: [
    ["kick", "hihat"],
    [],
    ["snare", "hihat"],
    [],
    ["kick", "hihat"],
    [],
    ["snare", "hihat"],
    [],
  ],
  ballad: [
    ["kick"],
    [],
    ["hihat"],
    [],
    ["snare"],
    [],
    ["hihat"],
    [],
  ],
  latin: [
    ["kick", "hihat"],
    ["hihat"],
    ["hihat"],
    ["kick", "snare", "hihat"],
    ["hihat"],
    ["kick", "hihat"],
    ["snare", "hihat"],
    ["hihat"],
  ],
};

// ─── Registry ────────────────────────────────────────────────────────────────

export const STYLES: Record<StyleFamily, StyleDef[]> = {
  strum: [
    { id: "rhythm1", label: "Rhythm 1", generate: strumGenerator(STRUM_PATTERNS.folk.strokes) },
    { id: "rhythm2", label: "Rhythm 2", generate: strumGenerator(STRUM_PATTERNS.pop.strokes) },
    { id: "rhythm3", label: "Rhythm 3", generate: strumGenerator(STRUM_PATTERNS.rock.strokes) },
    { id: "finger1", label: "Fingerstyle 1", generate: travisGenerator },
    { id: "finger2", label: "Fingerstyle 2", generate: arpUpGenerator },
    { id: "finger3", label: "Fingerstyle 3", generate: pimaGenerator },
    { id: "pluck", label: "Pluck", generate: pluckGenerator },
  ],
  bass: [
    { id: "root", label: "Root", generate: bassRoot },
    { id: "root5", label: "Root–Fifth", generate: bassRootFifth },
    { id: "walking", label: "Walking", generate: bassWalking },
    { id: "octave", label: "Octave", generate: bassOctave },
  ],
  keys: [
    { id: "block", label: "Block", generate: keysBlock },
    { id: "arpeggio", label: "Arpeggio", generate: keysArpeggio },
    { id: "broken", label: "Broken", generate: keysBroken },
    { id: "sustained", label: "Sustained", generate: keysSustained },
  ],
  sustain: [
    { id: "sustained", label: "Sustained", generate: sustainHold },
    { id: "swell", label: "Swell", generate: sustainSwell },
    { id: "stabs", label: "Stabs", generate: sustainStabs },
    { id: "line", label: "Line", generate: sustainLine },
  ],
  drums: [
    { id: "rock", label: "Rock", generate: drumGenerator(DRUM_GRIDS.rock) },
    { id: "pop", label: "Pop", generate: drumGenerator(DRUM_GRIDS.pop) },
    { id: "funk", label: "Funk", generate: drumGenerator(DRUM_GRIDS.funk) },
    { id: "folk", label: "Folk", generate: drumGenerator(DRUM_GRIDS.folk) },
    { id: "ballad", label: "Ballad", generate: drumGenerator(DRUM_GRIDS.ballad) },
    { id: "latin", label: "Latin", generate: drumGenerator(DRUM_GRIDS.latin) },
  ],
};

export function getStyles(family: StyleFamily): StyleDef[] {
  return STYLES[family];
}

export function getStyle(family: StyleFamily, id: string): StyleDef {
  const list = STYLES[family];
  return list.find((s) => s.id === id) ?? list[0];
}

export function defaultStyleId(family: StyleFamily): string {
  return STYLES[family][0].id;
}
