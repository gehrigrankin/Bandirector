import {
  chordIntervals,
  isMinor,
  parseChord,
  qualityIdFromToken,
} from "@/lib/music/chord";

export interface GuitarVoicing {
  // strings from low to high (E A D G B E); -1 = mute, 0 = open, n = fret
  frets: number[];
  // 0-indexed barres (from fret)
  baseFret: number;
  fingers?: number[];
}

const OPEN_MAJOR: Record<string, GuitarVoicing> = {
  C: { frets: [-1, 3, 2, 0, 1, 0], baseFret: 1 },
  D: { frets: [-1, -1, 0, 2, 3, 2], baseFret: 1 },
  E: { frets: [0, 2, 2, 1, 0, 0], baseFret: 1 },
  F: { frets: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  G: { frets: [3, 2, 0, 0, 0, 3], baseFret: 1 },
  A: { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1 },
  B: { frets: [-1, 2, 4, 4, 4, 2], baseFret: 1 },
};

const OPEN_MINOR: Record<string, GuitarVoicing> = {
  Am: { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1 },
  Bm: { frets: [-1, 2, 4, 4, 3, 2], baseFret: 1 },
  Cm: { frets: [-1, 3, 5, 5, 4, 3], baseFret: 1 },
  Dm: { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1 },
  Em: { frets: [0, 2, 2, 0, 0, 0], baseFret: 1 },
  Fm: { frets: [1, 3, 3, 1, 1, 1], baseFret: 1 },
  Gm: { frets: [3, 5, 5, 3, 3, 3], baseFret: 1 },
};

export function guitarVoicing(chord: string): GuitarVoicing | null {
  const parsed = parseChord(chord);
  if (!parsed) return null;
  const minor = isMinor(parsed.quality);
  const key = minor ? `${parsed.root}m` : parsed.root;
  return (minor ? OPEN_MINOR : OPEN_MAJOR)[key] ?? null;
}

// Piano: semitone offsets from root for the chord voicing. Reuses the canonical
// quality intervals so the diagram and the Songwriter Studio stay in sync.
export function pianoTriadOffsets(chord: string): number[] {
  const parsed = parseChord(chord);
  if (!parsed) return [0, 4, 7];
  return chordIntervals(qualityIdFromToken(parsed.quality));
}
