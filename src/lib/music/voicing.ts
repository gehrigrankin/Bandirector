// Two-hand keyboard voicing engine for the Songwriter Studio comping textures.
//
// Everything here is pure interval math from a chord's root pitch-class (0–11)
// and its interval set (semitones from the root, e.g. a maj7 is [0,4,7,11]).
// The two hands live in separate registers so they never cross:
//   • Left hand  → the bass register (root around C2, guide tones up to ~B3).
//   • Right hand → a rootless / shell / triad voicing packed into an ~E4–E5
//     window, sitting a clear register above the left hand.

export type Voicing = "triad" | "rootless" | "shell";

export const VOICINGS: { id: Voicing; label: string }[] = [
  { id: "triad", label: "Triad" },
  { id: "rootless", label: "Rootless" },
  { id: "shell", label: "Shell" },
];

// Right-hand window (scientific pitch, C4 = 60). E4–E5 with a little headroom.
const RH_LOW = 64; // E4
const RH_HIGH = 76; // E5
const RH_TARGET = 68; // centre the close voicing around here (G#4-ish)

// Left-hand register: keep every left-hand note strictly below the RH window.
const LH_LOW = 36; // C2
const LH_HIGH = 59; // B3

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/** Fold a note into [lo, hi] by octaves (used to keep the left hand in register). */
function fold(note: number, lo: number, hi: number): number {
  let n = note;
  while (n > hi) n -= 12;
  while (n < lo) n += 12;
  return n;
}

// ─── Right hand ──────────────────────────────────────────────────────────────

/** The 3rd and 7th of a chord as intervals above the root (the "guide tones").
 *  Triads have no 7th, so the 5th stands in. */
export function guideIntervals(intervals: number[]): number[] {
  const find = (...pcs: number[]) =>
    intervals.find((i) => pcs.includes(mod12(i)));
  const third = find(3, 4) ?? 4;
  const seventh = find(10, 11) ?? find(6, 7, 8) ?? 7;
  return [third, seventh];
}

/** Rootless colour tones as absolute pitch-classes: drop the root, and drop the
 *  perfect 5th once a 9th is present, leaving {3,7,9} (or {3,5,7} for plain 7ths). */
function rootlessPitchClasses(rootPc: number, intervals: number[]): number[] {
  const has9 = intervals.some((i) => i >= 13);
  const tones = intervals.filter((i) => {
    const pc = mod12(i);
    if (pc === 0) return false; // root
    if (has9 && pc === 7) return false; // drop the perfect 5th under a 9th
    return true;
  });
  return Array.from(new Set(tones.map((i) => mod12(rootPc + i))));
}

/**
 * Pack a set of pitch-classes into a close voicing inside the right-hand window.
 * Tries each rotation (which chord tone sits on the bottom) and scores by how
 * centred it is, penalising voicings that spill above the window or open with a
 * half-step cluster, so the result lands in ~E4–E5 and reads as the right chord.
 */
function packVoicing(pitchClasses: number[]): number[] {
  const uniq = Array.from(new Set(pitchClasses.map(mod12)));
  if (uniq.length <= 1) return uniq.map((pc) => RH_LOW + mod12(pc - RH_LOW));

  let best: number[] = [];
  let bestScore = Infinity;
  for (let r = 0; r < uniq.length; r++) {
    const order = [...uniq.slice(r), ...uniq.slice(0, r)];
    const notes = [RH_LOW + mod12(order[0] - RH_LOW)];
    for (let i = 1; i < order.length; i++) {
      let n = notes[i - 1] + mod12(order[i] - notes[i - 1]);
      if (n === notes[i - 1]) n += 12;
      notes.push(n);
    }
    const top = notes[notes.length - 1];
    const centroid = notes.reduce((a, b) => a + b, 0) / notes.length;
    let minGap = Infinity;
    for (let i = 1; i < notes.length; i++) minGap = Math.min(minGap, notes[i] - notes[i - 1]);

    let score = Math.abs(centroid - RH_TARGET);
    if (top > RH_HIGH) score += (top - RH_HIGH) * 10;
    if (minGap <= 1) score += 8;
    if (score < bestScore) {
      bestScore = score;
      best = notes;
    }
  }
  return best;
}

/** A compact root-position voicing (root included) for the "Triad" option. */
function triadVoicing(rootPc: number, intervals: number[]): number[] {
  const has9 = intervals.some((i) => i >= 13);
  // Keep it to at most four notes; under a 9th, drop the 5th to make room.
  const kept = intervals.filter((i) => !(has9 && mod12(i) === 7)).slice(0, 4);
  let rootMidi = 48 + rootPc; // anchor the root in the G3–F#4 area
  if (rootMidi < 55) rootMidi += 12;
  return kept.map((i) => rootMidi + i);
}

/** The right-hand voicing notes (ascending MIDI) for the chord and voicing mode. */
export function rightHandVoicing(
  rootPc: number,
  intervals: number[],
  voicing: Voicing,
): number[] {
  if (voicing === "triad") return triadVoicing(rootPc, intervals);
  if (voicing === "shell") {
    const pcs = guideIntervals(intervals).map((i) => mod12(rootPc + i));
    return packVoicing(pcs);
  }
  return packVoicing(rootlessPitchClasses(rootPc, intervals));
}

// ─── Left hand ───────────────────────────────────────────────────────────────

/** Root in the bass register (around C2). */
export function leftHandRoot(rootPc: number): number {
  return fold(LH_LOW + rootPc, LH_LOW, LH_HIGH);
}

/** Root + guide tones for the left-hand shell, all kept below the RH window. */
export function leftHandGuide(rootPc: number, intervals: number[]): number[] {
  return guideIntervals(intervals).map((i) =>
    fold(LH_LOW + 12 + rootPc + i, LH_LOW + 4, LH_HIGH),
  );
}

/** A mid-register chord stab (octave 3) for the stride left hand. */
export function leftHandStab(rootPc: number, intervals: number[]): number[] {
  const guide = guideIntervals(intervals);
  const fifth = intervals.find((i) => [6, 7, 8].includes(mod12(i))) ?? 7;
  const pcs = [guide[0], fifth, guide[1]];
  return pcs.map((i) => fold(LH_LOW + 12 + rootPc + i, LH_LOW + 6, LH_HIGH));
}

/** A four-note ascending chord-tone walking line over one bar. */
export function leftHandWalk(rootPc: number, intervals: number[]): number[] {
  const root = LH_LOW + rootPc;
  const third = intervals.find((i) => [3, 4].includes(mod12(i))) ?? 4;
  const fifth = intervals.find((i) => [6, 7, 8].includes(mod12(i))) ?? 7;
  const fourth = intervals.find((i) => [10, 11].includes(mod12(i))) ?? 12;
  return [0, third, fifth, fourth].map((i) => root + i);
}
