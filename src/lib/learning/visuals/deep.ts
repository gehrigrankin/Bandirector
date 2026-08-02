import type { Visual } from "./types";

/**
 * Interactive visuals for The Deep (tier 4). Keyed by topic id from
 * curriculum.ts — every topic in the tier has at least one visual.
 */
export const DEEP_VISUALS: Record<string, Visual[]> = {
  "dep-modes": [
    {
      type: "sequence",
      label: "D Dorian — minor with a natural 6",
      instrument: "piano",
      bpm: 100,
      steps: [
        { notes: ["D4"], label: "1" },
        { notes: ["E4"], label: "2" },
        { notes: ["F4"], label: "b3" },
        { notes: ["G4"], label: "4" },
        { notes: ["A4"], label: "5" },
        { notes: ["B4"], label: "6 (char)" },
        { notes: ["C5"], label: "b7" },
        { notes: ["D5"], label: "1", beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "G Mixolydian — major with a b7",
      instrument: "piano",
      bpm: 100,
      steps: [
        { notes: ["G3"], label: "1" },
        { notes: ["A3"], label: "2" },
        { notes: ["B3"], label: "3" },
        { notes: ["C4"], label: "4" },
        { notes: ["D4"], label: "5" },
        { notes: ["E4"], label: "6" },
        { notes: ["F4"], label: "b7 (char)" },
        { notes: ["G4"], label: "1", beats: 2 },
      ],
    },
    {
      type: "piano",
      label: "D Dorian — all white keys, D is home",
      notes: ["D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"],
      roots: ["D4", "D5"],
    },
  ],

  "dep-secondary-dominants": [
    {
      type: "sequence",
      label: "A7 pulls to Dm7 — a secondary dominant in C",
      instrument: "piano",
      bpm: 80,
      steps: [
        { notes: ["C3", "E4", "G4"], label: "I: C", beats: 2 },
        { notes: ["A3", "C#4", "E4", "G4"], label: "V/ii: A7", beats: 2 },
        { notes: ["D3", "C4", "F4", "A4"], label: "ii: Dm7", beats: 2 },
        { notes: ["G2", "B3", "F4"], label: "V: G7", beats: 2 },
        { notes: ["C3", "E4", "G4"], label: "I: C", beats: 4 },
      ],
    },
  ],

  "dep-extensions": [
    {
      type: "piano",
      label: "Cmaj9 — the 9 (D) stacked past the 7th",
      notes: ["C3", "E4", "G4", "B4", "D5"],
      roots: ["C3"],
    },
    {
      type: "piano",
      label: "C13 — b7 below, 13 (A) on top",
      notes: ["C3", "Bb3", "E4", "A4", "D5"],
      roots: ["C3"],
    },
    {
      type: "sequence",
      label: "Hear the stack grow: Cmaj7 -> Cmaj9 -> C13",
      instrument: "piano",
      bpm: 60,
      steps: [
        { notes: ["C3", "E4", "G4", "B4"], label: "Cmaj7", beats: 2 },
        { notes: ["C3", "E4", "G4", "B4", "D5"], label: "Cmaj9", beats: 2 },
        { notes: ["C3", "Bb3", "E4", "A4", "D5"], label: "C13", beats: 4 },
      ],
    },
  ],

  "dep-transposition": [
    {
      type: "sequence",
      label: "I-vi-IV-V in C",
      instrument: "piano",
      bpm: 90,
      steps: [
        { notes: ["C3", "E3", "G3"], label: "I: C", beats: 2 },
        { notes: ["C3", "E3", "A3"], label: "vi: Am", beats: 2 },
        { notes: ["C3", "F3", "A3"], label: "IV: F", beats: 2 },
        { notes: ["B2", "D3", "G3"], label: "V: G", beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "Same progression transposed to E",
      instrument: "piano",
      bpm: 90,
      steps: [
        { notes: ["E3", "G#3", "B3"], label: "I: E", beats: 2 },
        { notes: ["E3", "G#3", "C#4"], label: "vi: C#m", beats: 2 },
        { notes: ["E3", "A3", "C#4"], label: "IV: A", beats: 2 },
        { notes: ["D#3", "F#3", "B3"], label: "V: B", beats: 2 },
      ],
    },
  ],

  "dep-ear-progressions": [
    {
      type: "sequence",
      label: "I-V-vi-IV — the pop loop",
      instrument: "piano",
      bpm: 90,
      steps: [
        { notes: ["C3", "E3", "G3"], label: "I: C", beats: 2 },
        { notes: ["B2", "D3", "G3"], label: "V: G", beats: 2 },
        { notes: ["C3", "E3", "A3"], label: "vi: Am", beats: 2 },
        { notes: ["C3", "F3", "A3"], label: "IV: F", beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "I-IV-V-I — the classic cadence, compare by ear",
      instrument: "piano",
      bpm: 90,
      steps: [
        { notes: ["C3", "E3", "G3"], label: "I: C", beats: 2 },
        { notes: ["C3", "F3", "A3"], label: "IV: F", beats: 2 },
        { notes: ["B2", "D3", "G3"], label: "V: G", beats: 2 },
        { notes: ["C3", "E3", "G3"], label: "I: C", beats: 2 },
      ],
    },
  ],

  "dep-improv": [
    {
      type: "sequence",
      label: "Target the 3rd of each chord over a ii-V-I in C",
      instrument: "piano",
      bpm: 80,
      steps: [
        { notes: ["A3"], label: "Dm7" },
        { notes: ["C4"] },
        { notes: ["E4"] },
        { notes: ["F4"], label: "target: 3rd (F)" },
        { notes: ["F4"], label: "G7" },
        { notes: ["D4"] },
        { notes: ["C4"] },
        { notes: ["B3"], label: "target: 3rd (B)" },
        { notes: ["C4"], label: "Cmaj7" },
        { notes: ["E4"], label: "target: 3rd (E)", beats: 3 },
      ],
    },
  ],

  "dep-gtr-caged": [
    {
      type: "guitar-chord",
      label: "C major — C shape (open)",
      frets: [null, 3, 2, 0, 1, 0],
      fingers: [null, 3, 2, null, 1, null],
    },
    {
      type: "guitar-chord",
      label: "C major — A shape (barre at 3)",
      frets: [null, 1, 3, 3, 3, 1],
      fingers: [null, 1, 3, 3, 3, 1],
      baseFret: 3,
    },
    {
      type: "guitar-chord",
      label: "C major — G shape (around fret 5)",
      frets: [4, 3, 1, 1, 1, 4],
      fingers: [3, 2, 1, 1, 1, 4],
      baseFret: 5,
    },
    {
      type: "guitar-chord",
      label: "C major — E shape (barre at 8)",
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 8,
    },
    {
      type: "guitar-chord",
      label: "C major — D shape (around fret 10)",
      frets: [null, null, 1, 3, 4, 3],
      fingers: [null, null, 1, 2, 4, 3],
      baseFret: 10,
    },
  ],

  "dep-gtr-scale-positions": [
    {
      type: "fretboard",
      label: "C major scale — E-shape position (frets 7-10)",
      startFret: 6,
      fretCount: 4,
      notes: [
        { string: 6, fret: 7, label: "7" },
        { string: 6, fret: 8, label: "1", root: true },
        { string: 6, fret: 10, label: "2" },
        { string: 5, fret: 7, label: "3" },
        { string: 5, fret: 8, label: "4" },
        { string: 5, fret: 10, label: "5" },
        { string: 4, fret: 7, label: "6" },
        { string: 4, fret: 9, label: "7" },
        { string: 4, fret: 10, label: "1", root: true },
        { string: 3, fret: 7, label: "2" },
        { string: 3, fret: 9, label: "3" },
        { string: 3, fret: 10, label: "4" },
        { string: 2, fret: 8, label: "5" },
        { string: 2, fret: 10, label: "6" },
        { string: 1, fret: 7, label: "7" },
        { string: 1, fret: 8, label: "1", root: true },
        { string: 1, fret: 10, label: "2" },
      ],
    },
  ],

  "dep-gtr-fingerstyle": [
    {
      type: "sequence",
      label: "Travis pattern on C — steady thumb, melody on top",
      instrument: "guitar",
      bpm: 80,
      steps: [
        { notes: ["C3"], label: "thumb", beats: 0.5 },
        { notes: ["E4"], beats: 0.5 },
        { notes: ["G3"], label: "thumb", beats: 0.5 },
        { notes: ["C4"], beats: 0.5 },
        { notes: ["C3"], label: "thumb", beats: 0.5 },
        { notes: ["E4"], beats: 0.5 },
        { notes: ["G3"], label: "thumb", beats: 0.5 },
        { notes: ["G4"], beats: 0.5 },
      ],
    },
  ],

  "dep-gtr-bending": [
    {
      type: "fretboard",
      label: "Whole-step bend targets in the A minor pentatonic box",
      startFret: 6,
      fretCount: 5,
      notes: [
        { string: 3, fret: 7, label: "start (D)" },
        { string: 3, fret: 9, label: "bend to 9th fret pitch (E)" },
        { string: 2, fret: 8, label: "start (G)" },
        { string: 2, fret: 10, label: "bend to 10th fret pitch (A)" },
      ],
    },
    {
      type: "sequence",
      label: "Hear each target: fretted note, then the pitch to bend to",
      instrument: "guitar",
      bpm: 60,
      steps: [
        { notes: ["D4"], label: "fretted (G str, fret 7)" },
        { notes: ["E4"], label: "bend target", beats: 2 },
        { notes: ["G4"], label: "fretted (B str, fret 8)" },
        { notes: ["A4"], label: "bend target", beats: 2 },
      ],
    },
  ],

  "dep-gtr-alt-picking": [
    {
      type: "sequence",
      label: "Chromatic 1-2-3-4 drill, strict down-up (16ths at 60)",
      instrument: "guitar",
      bpm: 60,
      steps: [
        { notes: ["A2"], label: "1", beats: 0.25 },
        { notes: ["A#2"], label: "2", beats: 0.25 },
        { notes: ["B2"], label: "3", beats: 0.25 },
        { notes: ["C3"], label: "4", beats: 0.25 },
        { notes: ["D3"], label: "1", beats: 0.25 },
        { notes: ["D#3"], label: "2", beats: 0.25 },
        { notes: ["E3"], label: "3", beats: 0.25 },
        { notes: ["F3"], label: "4", beats: 0.25 },
        { notes: ["G3"], label: "1", beats: 0.25 },
        { notes: ["G#3"], label: "2", beats: 0.25 },
        { notes: ["A3"], label: "3", beats: 0.25 },
        { notes: ["A#3"], label: "4", beats: 0.25 },
        { notes: ["C4"], label: "1", beats: 0.25 },
        { notes: ["C#4"], label: "2", beats: 0.25 },
        { notes: ["D4"], label: "3", beats: 0.25 },
        { notes: ["D#4"], label: "4", beats: 0.25 },
      ],
    },
  ],

  "dep-pno-shell-voicings": [
    {
      type: "piano",
      label: "Dm7 shell — root, 3, 7",
      notes: ["D3", "F3", "C4"],
      roots: ["D3"],
    },
    {
      type: "piano",
      label: "G7 shell — root, 7, 3",
      notes: ["G2", "F3", "B3"],
      roots: ["G2"],
    },
    {
      type: "piano",
      label: "Cmaj7 shell — root, 3, 7",
      notes: ["C3", "E3", "B3"],
      roots: ["C3"],
    },
    {
      type: "sequence",
      label: "Comp a ii-V-I with shells — notice the tiny hand moves",
      instrument: "piano",
      bpm: 80,
      steps: [
        { notes: ["D3", "F3", "C4"], label: "ii: Dm7", beats: 2 },
        { notes: ["G2", "F3", "B3"], label: "V: G7", beats: 2 },
        { notes: ["C3", "E3", "B3"], label: "I: Cmaj7", beats: 4 },
      ],
    },
  ],

  "dep-pno-sight-reading": [
    {
      type: "sequence",
      label: "C-position melody — read ahead, keep moving",
      instrument: "piano",
      bpm: 70,
      steps: [
        { notes: ["C4"], label: "C" },
        { notes: ["E4"], label: "E" },
        { notes: ["G4"], label: "G" },
        { notes: ["E4"], label: "E" },
        { notes: ["F4"], label: "F" },
        { notes: ["D4"], label: "D" },
        { notes: ["E4"], label: "E" },
        { notes: ["C4"], label: "C", beats: 2 },
        { notes: ["D4"], label: "D" },
        { notes: ["F4"], label: "F" },
        { notes: ["E4"], label: "E" },
        { notes: ["D4"], label: "D" },
        { notes: ["C4"], label: "C", beats: 3 },
      ],
    },
  ],

  "dep-pno-technique": [
    {
      type: "sequence",
      label: "A harmonic minor — hear the raised 7th",
      instrument: "piano",
      bpm: 90,
      steps: [
        { notes: ["A3"], label: "1" },
        { notes: ["B3"], label: "2" },
        { notes: ["C4"], label: "b3" },
        { notes: ["D4"], label: "4" },
        { notes: ["E4"], label: "5" },
        { notes: ["F4"], label: "b6" },
        { notes: ["G#4"], label: "7 (raised)" },
        { notes: ["A4"], label: "1" },
        { notes: ["G#4"], label: "7" },
        { notes: ["F4"], label: "b6" },
        { notes: ["E4"], label: "5" },
        { notes: ["D4"], label: "4" },
        { notes: ["C4"], label: "b3" },
        { notes: ["B3"], label: "2" },
        { notes: ["A3"], label: "1", beats: 2 },
      ],
    },
  ],
};
