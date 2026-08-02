import type { Visual } from "./types";

/**
 * Interactive visuals for the Trench tier (depth 6). Keyed by topic id from
 * curriculum.ts. Every topic in the tier has at least one visual.
 */
export const TRENCH_VISUALS: Record<string, Visual[]> = {
  "trn-counterpoint": [
    {
      type: "sequence",
      label: "First species in C - cantus firmus below, counterpoint above",
      instrument: "piano",
      bpm: 60,
      steps: [
        { notes: ["C4", "G4"], label: "P5" },
        { notes: ["D4", "B4"], label: "M6" },
        { notes: ["E4", "C5"], label: "M6" },
        { notes: ["F4", "A4"], label: "M3" },
        { notes: ["E4", "C5"], label: "M6" },
        { notes: ["D4", "B4"], label: "M6" },
        { notes: ["C4", "C5"], label: "P8", beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "Parallel 5ths - the cardinal sin (voices fuse into one)",
      instrument: "piano",
      bpm: 70,
      steps: [
        { notes: ["C4", "G4"], label: "P5" },
        { notes: ["D4", "A4"], label: "P5 (parallel)" },
        { notes: ["E4", "B4"], label: "P5 (parallel)", beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "Fixed with contrary motion into imperfect consonances",
      instrument: "piano",
      bpm: 70,
      steps: [
        { notes: ["C4", "G4"], label: "P5" },
        { notes: ["D4", "B4"], label: "M6" },
        { notes: ["E4", "C5"], label: "m6", beats: 2 },
      ],
    },
  ],

  "trn-negative-harmony": [
    {
      type: "sequence",
      label: "The original: I-IV-V-I in C major",
      instrument: "piano",
      bpm: 80,
      steps: [
        { notes: ["C4", "E4", "G4"], label: "I: C" },
        { notes: ["C4", "F4", "A4"], label: "IV: F" },
        { notes: ["B3", "D4", "G4"], label: "V: G" },
        { notes: ["C4", "E4", "G4"], label: "I: C", beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "The negative-harmony mirror: Cm-Gm-Fm-Cm (same pull, darker color)",
      instrument: "piano",
      bpm: 80,
      steps: [
        { notes: ["C4", "Eb4", "G4"], label: "mirror of I: Cm" },
        { notes: ["Bb3", "D4", "G4"], label: "mirror of IV: Gm" },
        { notes: ["C4", "F4", "Ab4"], label: "mirror of V: Fm" },
        { notes: ["C4", "Eb4", "G4"], label: "mirror of I: Cm", beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "G7 to C, then its mirror Fm6 to C - the negative dominant",
      instrument: "piano",
      bpm: 70,
      steps: [
        { notes: ["G3", "B3", "D4", "F4"], label: "V7: G7" },
        { notes: ["C4", "E4", "G4"], label: "I: C", beats: 2 },
        { notes: ["F3", "Ab3", "C4", "D4"], label: "iv6: Fm6 (mirror of G7)" },
        { notes: ["C4", "E4", "G4"], label: "I: C", beats: 2 },
      ],
    },
  ],

  "trn-microtonality": [
    {
      type: "piano",
      label: "C major triad in 12-TET - the E is 14 cents sharp vs a pure 5:4 third",
      notes: ["C4", "E4", "G4"],
      roots: ["C4"],
    },
    {
      type: "sequence",
      label: "Hold the tempered third and listen for the fast shimmer (beating)",
      instrument: "piano",
      bpm: 60,
      steps: [{ notes: ["C4", "E4"], label: "M3, held", beats: 4 }],
    },
  ],

  "trn-free-improv": [
    {
      type: "sequence",
      label: "Constraint drone: C Dorian line over an open low C",
      instrument: "piano",
      bpm: 70,
      steps: [
        { notes: ["C2", "C4"], label: "1" },
        { notes: ["C2", "Eb4"], label: "b3" },
        { notes: ["C2", "D4"], label: "2" },
        { notes: ["C2", "F4"], label: "4" },
        { notes: ["C2", "G4"], label: "5" },
        { notes: ["C2", "A4"], label: "6 (Dorian color)" },
        { notes: ["C2", "Bb4"], label: "b7" },
        { notes: ["C2", "G4"], label: "5", beats: 2 },
      ],
    },
  ],

  "trn-gtr-extended": [
    {
      type: "fretboard",
      label: "DADGAD open strings, low to high: D A D G A D",
      startFret: 0,
      fretCount: 5,
      notes: [
        { string: 6, fret: 0, label: "D", root: true },
        { string: 5, fret: 0, label: "A" },
        { string: 4, fret: 0, label: "D", root: true },
        { string: 3, fret: 0, label: "G" },
        { string: 2, fret: 0, label: "A" },
        { string: 1, fret: 0, label: "D", root: true },
      ],
    },
    {
      type: "guitar-chord",
      label: "Dsus vamp - assumes DADGAD tuning (all six open = Dsus4)",
      frets: [0, 0, 0, 2, 0, 0],
      fingers: [null, null, null, 2, null, null],
    },
    {
      type: "sequence",
      label: "Retuning targets from standard, string 6 to string 1",
      instrument: "guitar",
      bpm: 60,
      steps: [
        { notes: ["D2"], label: "6: E down to D" },
        { notes: ["A2"], label: "5: A stays" },
        { notes: ["D3"], label: "4: D stays" },
        { notes: ["G3"], label: "3: G stays" },
        { notes: ["A3"], label: "2: B down to A" },
        { notes: ["D4"], label: "1: E down to D", beats: 2 },
      ],
    },
  ],

  "trn-gtr-transcribe-masters": [
    {
      type: "sequence",
      label: "Study lick (original, blues in A) - sing it, then find it, slow",
      instrument: "guitar",
      bpm: 60,
      steps: [
        { notes: ["A3"], label: "1" },
        { notes: ["C4"], label: "b3" },
        { notes: ["D4"], label: "4" },
        { notes: ["Eb4"], label: "b5 (blue note)" },
        { notes: ["D4"], label: "4" },
        { notes: ["C4"], label: "b3" },
        { notes: ["A3"], label: "1" },
        { notes: ["E3"], label: "5 below", beats: 2 },
      ],
    },
  ],

  "trn-pno-transcribe-masters": [
    {
      type: "sequence",
      label: "Study lick (original, blues in C) - transcribe in layers, half speed",
      instrument: "piano",
      bpm: 60,
      steps: [
        { notes: ["C4"], label: "1" },
        { notes: ["Eb4"], label: "b3 (blue third)" },
        { notes: ["E4"], label: "3" },
        { notes: ["G4"], label: "5" },
        { notes: ["A4"], label: "6" },
        { notes: ["C5"], label: "1" },
        { notes: ["Bb4"], label: "b7" },
        { notes: ["C3", "E3", "Bb3", "G4"], label: "C7 shell + top", beats: 2 },
      ],
    },
  ],

  "trn-pno-orchestral": [
    {
      type: "piano",
      label: "Orchestral spread voicing of C major - bass, tenor, and ringing top",
      notes: ["C2", "G2", "E3", "C4", "E4", "G4", "C5"],
      roots: ["C2", "C4", "C5"],
    },
    {
      type: "sequence",
      label: "Quiet texture: a thin two-voice whisper (pp)",
      instrument: "piano",
      bpm: 70,
      steps: [
        { notes: ["C3", "E4"], label: "pp" },
        { notes: ["C3", "G4"] },
        { notes: ["C3", "E4"] },
        { notes: ["C3", "C4"], beats: 2 },
      ],
    },
    {
      type: "sequence",
      label: "Full texture: the same harmony scored like an orchestra (ff)",
      instrument: "piano",
      bpm: 70,
      steps: [
        { notes: ["C2", "G2", "E3", "C4", "E4", "G4", "C5"], label: "ff: C" },
        { notes: ["F2", "C3", "F3", "C4", "F4", "A4", "C5"], label: "F" },
        { notes: ["G2", "D3", "G3", "B3", "D4", "G4", "B4"], label: "G" },
        { notes: ["C2", "G2", "E3", "C4", "E4", "G4", "C5"], label: "C", beats: 2 },
      ],
    },
  ],
};
