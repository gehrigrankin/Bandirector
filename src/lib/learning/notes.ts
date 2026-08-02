/** Note-name and guitar-geometry helpers for the lesson visuals. */

const PITCH: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** "C4" | "F#3" | "Bb5" → MIDI number (C4 = 60), or null if unparseable. */
export function noteToMidi(name: string): number | null {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name.trim());
  if (!m) return null;
  let semis = PITCH[m[1]];
  if (m[2] === "#") semis += 1;
  if (m[2] === "b") semis -= 1;
  return (parseInt(m[3], 10) + 1) * 12 + semis;
}

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function midiToNoteName(midi: number): string {
  return `${SHARP_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

/** Standard tuning, low E → high E, as MIDI numbers. */
export const GUITAR_TUNING = [40, 45, 50, 55, 59, 64];

/**
 * MIDI notes of a chord-box shape. `frets` is low E → high E (null = muted,
 * 0 = open); when baseFret > 1 fretted values are relative to the window.
 */
export function chordShapeMidi(
  frets: (number | null)[],
  baseFret = 1,
): number[] {
  const out: number[] = [];
  frets.forEach((f, i) => {
    if (f === null || i > 5) return;
    const abs = f === 0 ? 0 : baseFret > 1 ? baseFret - 1 + f : f;
    out.push(GUITAR_TUNING[i] + abs);
  });
  return out;
}

/** MIDI of a fretboard position. `string`: 6 = low E … 1 = high E. */
export function fretPositionMidi(string: number, fret: number): number {
  return GUITAR_TUNING[6 - string] + fret;
}
