// Recognize the chord being held on a MIDI keyboard, in the Studio's own
// chord vocabulary (root + quality id from QUALITIES), so a played chord can
// drop straight into the progression.

import { QUALITIES } from "@/lib/music/chord";

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

// Several qualities share a pitch-class set once inverted (C6 = Am7, sus2 is a
// rotated sus4). Order breaks those ties among equally-plausible roots.
const DETECTION_ORDER = [
  "maj",
  "min",
  "7",
  "m7",
  "maj7",
  "sus4",
  "sus2",
  "dim",
  "aug",
  "m7b5",
  "6",
  "m6",
  "add9",
  "9",
  "maj9",
  "m9",
];

interface Candidate {
  id: string;
  rank: number;
  pcs: Set<number>;
}

const CANDIDATES: Candidate[] = DETECTION_ORDER.flatMap((id, rank) => {
  const q = QUALITIES.find((x) => x.id === id);
  return q
    ? [{ id, rank, pcs: new Set(q.intervals.map((i) => ((i % 12) + 12) % 12)) }]
    : [];
});

function setsEqual(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

export interface DetectedChord {
  root: string;
  quality: string; // quality id
  symbolNotes: number; // how many distinct pitch classes matched
}

/**
 * Match the held notes against every quality from every candidate root.
 * The root the bass is playing wins; among equal roots the DETECTION_ORDER
 * decides. Needs at least three distinct pitch classes.
 */
export function detectChord(midiNotes: number[]): DetectedChord | null {
  if (midiNotes.length === 0) return null;
  const pcs = new Set(midiNotes.map((n) => ((n % 12) + 12) % 12));
  if (pcs.size < 3) return null;
  const bassPc = ((Math.min(...midiNotes) % 12) + 12) % 12;

  let best: { root: number; id: string; score: number } | null = null;
  for (const root of pcs) {
    const relative = new Set([...pcs].map((pc) => (pc - root + 12) % 12));
    for (const c of CANDIDATES) {
      if (!setsEqual(relative, c.pcs)) continue;
      const score = (root === bassPc ? 0 : 100) + c.rank;
      if (!best || score < best.score) best = { root, id: c.id, score };
    }
  }

  return best
    ? { root: PITCH_NAMES[best.root], quality: best.id, symbolNotes: pcs.size }
    : null;
}
