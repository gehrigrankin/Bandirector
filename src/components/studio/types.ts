import type { InstrumentId } from "@/lib/audio/instruments";
import type { Pattern } from "@/lib/audio/patterns";

/** One step in the loop's chord progression (one bar). */
export interface ChordStep {
  root: string;
  quality: string; // quality id
}

/** The instrument part being auditioned in the LoopPad. The chord changes are
 *  global (the progression), so a part is an instrument + a programmable step
 *  pattern + octave. */
export interface Selection {
  instrumentId: InstrumentId;
  pattern: Pattern;
  octave: number;
}

/** A locked layer in the track rack — an instrument part that follows the
 *  shared progression. */
export interface Track extends Selection {
  id: string;
  volume: number; // 0..1
  muted: boolean;
  solo: boolean;
}

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
];
