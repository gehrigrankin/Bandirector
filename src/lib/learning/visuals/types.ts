/**
 * Interactive visual specs for lesson pages. Pure data — rendered by the
 * components in src/components/learn/visuals/, which also make them sound.
 */

/** A guitar chord box. Strings are ordered low E → high E. */
export interface GuitarChordVisual {
  type: "guitar-chord";
  /** e.g. "E major" or "Am7" */
  label: string;
  /** Fret per string, low E → high E. null = muted, 0 = open. Relative to baseFret. */
  frets: (number | null)[];
  /** Optional fingering per string (1=index … 4=pinky), same order. */
  fingers?: (number | null)[];
  /** First fret of the diagram window (default 1). Use for barre shapes up the neck. */
  baseFret?: number;
}

/** A horizontal fretboard with marked notes (scale boxes, note maps). */
export interface FretboardVisual {
  type: "fretboard";
  label: string;
  /** string: 6 = low E … 1 = high E. fret: 0 = open. */
  notes: { string: number; fret: number; label?: string; root?: boolean }[];
  /** First fret shown (default 0 = include the nut). */
  startFret?: number;
  /** How many frets to show (default 5). */
  fretCount?: number;
}

/** A piano keyboard with highlighted keys. Every key is clickable/playable. */
export interface PianoVisual {
  type: "piano";
  label: string;
  /** Highlighted notes in scientific pitch: "C4", "F#4", "Bb3". */
  notes: string[];
  /** Which highlighted notes are roots — drawn stronger. */
  roots?: string[];
  /** Keyboard range (defaults chosen from `notes` if omitted). */
  startOctave?: number;
  octaves?: number;
}

/** One step of a playable sequence — a note, interval, or full chord. */
export interface SequenceStep {
  /** Notes sounded together, scientific pitch. One note = melody step. */
  notes: string[];
  /** Chip label, e.g. "C", "ii: Dm7", "W", "1". */
  label?: string;
  /** Length in beats (default 1). */
  beats?: number;
}

/** A play-button sequence: scales, progressions, cadences, ear examples. */
export interface SequenceVisual {
  type: "sequence";
  label: string;
  instrument: "piano" | "guitar";
  /** Default 90. */
  bpm?: number;
  steps: SequenceStep[];
}

export type Visual =
  | GuitarChordVisual
  | FretboardVisual
  | PianoVisual
  | SequenceVisual;
