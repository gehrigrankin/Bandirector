export interface ParsedChord {
  root: string;
  quality: string;
  bass?: string;
}

const NOTE_MAP: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export function parseChord(chord: string): ParsedChord | null {
  const match = chord.match(
    /^([A-G][b#]?)(maj7|maj|min7|min|m7|m|7|sus2|sus4|sus|dim|aug|add9|9|11|13)?(?:\/([A-G][b#]?))?$/,
  );
  if (!match) return { root: chord.replace(/\s/g, ""), quality: "" };
  return {
    root: match[1],
    quality: match[2] ?? "",
    bass: match[3],
  };
}

export function noteToSemitone(note: string): number | null {
  const n = NOTE_MAP[note];
  return typeof n === "number" ? n : null;
}

export function isMinor(quality: string): boolean {
  return /^m(?!aj)/.test(quality) || quality === "min" || quality === "min7";
}

export function rootOf(chord: string): string {
  return parseChord(chord)?.root ?? chord.charAt(0);
}

// ─── Chord qualities ────────────────────────────────────────────────────────
// The canonical roster of qualities the Songwriter Studio can build from any
// root. `symbol` is appended to the root to render the chord name (A, Am, Am7…).
// `intervals` are semitone offsets from the root.

export interface Quality {
  id: string;
  label: string;
  symbol: string;
  intervals: number[];
}

export const QUALITIES: Quality[] = [
  { id: "maj", label: "Major", symbol: "", intervals: [0, 4, 7] },
  { id: "min", label: "Minor", symbol: "m", intervals: [0, 3, 7] },
  { id: "7", label: "Dominant 7", symbol: "7", intervals: [0, 4, 7, 10] },
  { id: "maj7", label: "Major 7", symbol: "maj7", intervals: [0, 4, 7, 11] },
  { id: "m7", label: "Minor 7", symbol: "m7", intervals: [0, 3, 7, 10] },
  { id: "sus2", label: "Sus2", symbol: "sus2", intervals: [0, 2, 7] },
  { id: "sus4", label: "Sus4", symbol: "sus4", intervals: [0, 5, 7] },
  { id: "add9", label: "Add9", symbol: "add9", intervals: [0, 4, 7, 14] },
  { id: "6", label: "Major 6", symbol: "6", intervals: [0, 4, 7, 9] },
  { id: "m6", label: "Minor 6", symbol: "m6", intervals: [0, 3, 7, 9] },
  { id: "9", label: "Dominant 9", symbol: "9", intervals: [0, 4, 7, 10, 14] },
  { id: "dim", label: "Diminished", symbol: "dim", intervals: [0, 3, 6] },
  { id: "aug", label: "Augmented", symbol: "aug", intervals: [0, 4, 8] },
];

const QUALITY_BY_ID: Record<string, Quality> = Object.fromEntries(
  QUALITIES.map((q) => [q.id, q]),
);

/** Map a quality token parsed out of a chord string to a canonical quality id. */
export function qualityIdFromToken(token: string): string {
  switch (token) {
    case "":
    case "maj":
      return "maj";
    case "m":
    case "min":
      return "min";
    case "m7":
    case "min7":
      return "m7";
    case "maj7":
      return "maj7";
    case "sus":
    case "sus4":
      return "sus4";
    case "sus2":
      return "sus2";
    case "add9":
      return "add9";
    case "6":
      return "6";
    case "9":
      return "9";
    case "dim":
      return "dim";
    case "aug":
      return "aug";
    case "7":
      return "7";
    default:
      return "maj";
  }
}

/** Semitone offsets from the root for a quality id (defaults to a major triad). */
export function chordIntervals(qualityId: string): number[] {
  return (QUALITY_BY_ID[qualityId] ?? QUALITY_BY_ID.maj).intervals;
}

/** Render a chord name from a root note and quality id, e.g. ("A", "m7") → "Am7". */
export function chordSymbol(root: string, qualityId: string): string {
  return `${root}${(QUALITY_BY_ID[qualityId] ?? QUALITY_BY_ID.maj).symbol}`;
}

/**
 * MIDI note numbers for a chord. `octave` is the octave of the root using
 * scientific pitch notation (C4 = 60). Returns one note per chord interval.
 */
export function chordToMidi(
  root: string,
  qualityId: string,
  octave: number,
): number[] {
  const semitone = noteToSemitone(root) ?? 0;
  const rootMidi = (octave + 1) * 12 + semitone;
  return chordIntervals(qualityId).map((i) => rootMidi + i);
}

// ─── Keys & diatonic chords ──────────────────────────────────────────────────

export type Mode = "major" | "minor";

const PITCH_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Scale degrees (semitones from the tonic) and the triad quality + Roman
// numeral each degree gets in major and natural-minor keys.
const SCALE = {
  major: {
    steps: [0, 2, 4, 5, 7, 9, 11],
    qualities: ["maj", "min", "min", "maj", "maj", "min", "dim"],
    numerals: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
  },
  minor: {
    steps: [0, 2, 3, 5, 7, 8, 10],
    qualities: ["min", "dim", "maj", "min", "min", "maj", "maj"],
    numerals: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
  },
} as const;

export interface DiatonicChord {
  numeral: string;
  root: string;
  quality: string; // quality id
}

/** The seven diatonic chords (triads) of a key, in scale order. */
export function diatonicChords(tonic: string, mode: Mode): DiatonicChord[] {
  const t = noteToSemitone(tonic) ?? 0;
  const s = SCALE[mode];
  return s.steps.map((step, i) => ({
    numeral: s.numerals[i],
    root: PITCH_NAMES[(t + step) % 12],
    quality: s.qualities[i],
  }));
}

/** True when a chord belongs to the given key. */
export function isInKey(
  root: string,
  quality: string,
  tonic: string,
  mode: Mode,
): boolean {
  const r = noteToSemitone(root);
  return diatonicChords(tonic, mode).some(
    (c) => noteToSemitone(c.root) === r && c.quality === quality,
  );
}

// Common progressions as scale degrees (1 = tonic). Mapped onto the current
// key's diatonic chords, so they adapt to major/minor automatically.
export interface ProgressionTemplate {
  id: string;
  label: string;
  degrees: number[];
}

export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  { id: "pop", label: "I–V–vi–IV", degrees: [1, 5, 6, 4] },
  { id: "classic", label: "I–IV–V", degrees: [1, 4, 5] },
  { id: "fifties", label: "I–vi–IV–V", degrees: [1, 6, 4, 5] },
  { id: "sad", label: "vi–IV–I–V", degrees: [6, 4, 1, 5] },
  { id: "jazz", label: "ii–V–I", degrees: [2, 5, 1] },
  { id: "canon", label: "I–V–vi–iii–IV", degrees: [1, 5, 6, 3, 4] },
  { id: "blues", label: "12-Bar Blues", degrees: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5] },
];

/** Turn a template's scale degrees into concrete chords for a key. */
export function progressionFromDegrees(
  tonic: string,
  mode: Mode,
  degrees: number[],
): DiatonicChord[] {
  const diatonic = diatonicChords(tonic, mode);
  return degrees.map((d) => diatonic[(((d - 1) % 7) + 7) % 7]);
}
