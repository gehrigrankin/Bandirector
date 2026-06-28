import type { InstrumentId } from "@/lib/audio/instruments";

/** The current edit buffer in the studio — what the LoopPad previews. */
export interface Selection {
  instrumentId: InstrumentId;
  root: string;
  quality: string; // quality id
  styleId: string;
  octave: number;
}

/** A locked loop in the track rack. */
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
