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
