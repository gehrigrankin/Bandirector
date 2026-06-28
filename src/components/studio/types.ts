import type { InstrumentId } from "@/lib/audio/instruments";

/** One step in the loop's chord progression (one bar). */
export interface ChordStep {
  root: string;
  quality: string; // quality id
}

/** The instrument part being auditioned in the LoopPad. The chord changes are
 *  global (the progression), so a part is just an instrument + style + octave. */
export interface Selection {
  instrumentId: InstrumentId;
  styleId: string;
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
