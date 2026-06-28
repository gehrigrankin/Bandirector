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
