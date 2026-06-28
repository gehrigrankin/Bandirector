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

// ---------------------------------------------------------------------------
// Chord qualities & MIDI generation (used by the Songwriter Studio)
// ---------------------------------------------------------------------------

export interface ChordQuality {
  id: string;
  label: string;
  /** Suffix appended to the root for display, e.g. "m7" → "Am7". */
  symbol: string;
  /** Semitone offsets from the root. */
  intervals: number[];
}

/** The 12 chromatic roots, sharp-spelled. */
export const ROOTS = [
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
] as const;

/** Chord qualities offered per root in the studio (A → Am, Am7, Asus2, …). */
export const QUALITIES: ChordQuality[] = [
  { id: "maj", label: "Major", symbol: "", intervals: [0, 4, 7] },
  { id: "min", label: "Minor", symbol: "m", intervals: [0, 3, 7] },
  { id: "7", label: "Dominant 7", symbol: "7", intervals: [0, 4, 7, 10] },
  { id: "maj7", label: "Major 7", symbol: "maj7", intervals: [0, 4, 7, 11] },
  { id: "m7", label: "Minor 7", symbol: "m7", intervals: [0, 3, 7, 10] },
  { id: "sus2", label: "Sus2", symbol: "sus2", intervals: [0, 2, 7] },
  { id: "sus4", label: "Sus4", symbol: "sus4", intervals: [0, 5, 7] },
  { id: "add9", label: "Add9", symbol: "add9", intervals: [0, 4, 7, 14] },
  { id: "6", label: "Sixth", symbol: "6", intervals: [0, 4, 7, 9] },
  { id: "m6", label: "Minor 6", symbol: "m6", intervals: [0, 3, 7, 9] },
  { id: "9", label: "Ninth", symbol: "9", intervals: [0, 4, 7, 10, 14] },
  { id: "dim", label: "Diminished", symbol: "dim", intervals: [0, 3, 6] },
  { id: "aug", label: "Augmented", symbol: "aug", intervals: [0, 4, 8] },
];

export function chordQuality(qualityId: string): ChordQuality {
  return QUALITIES.find((q) => q.id === qualityId) ?? QUALITIES[0];
}

export function chordIntervals(qualityId: string): number[] {
  return chordQuality(qualityId).intervals;
}

/** Display symbol for a chord, e.g. ("A", "m7") → "Am7". */
export function chordSymbol(root: string, qualityId: string): string {
  return `${root}${chordQuality(qualityId).symbol}`;
}

/**
 * MIDI note numbers for a chord voicing, low → high.
 * `octave` is the scientific-pitch octave of the root (MIDI 60 = C4).
 */
export function chordToMidi(
  root: string,
  qualityId: string,
  octave: number,
): number[] {
  const semitone = noteToSemitone(root);
  if (semitone === null) return [];
  const base = semitone + (octave + 1) * 12;
  return chordIntervals(qualityId).map((i) => base + i);
}
