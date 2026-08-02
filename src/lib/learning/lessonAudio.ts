// Thin client-side wrapper over the studio audio engine for lesson visuals:
// one-shot notes, strummed chords, and simple step sequences.

import { getEngine } from "@/lib/audio/engine";

export type LessonInstrument = "guitar" | "piano";

const INSTRUMENT_ID: Record<LessonInstrument, string> = {
  guitar: "acoustic_guitar",
  piano: "piano",
};

/** Start loading the soundfont so the first tap doesn't stall. */
export function prepareLessonAudio(instrument: LessonInstrument) {
  getEngine().prepareLive(INSTRUMENT_ID[instrument]);
}

/** Must run inside a user gesture the first time (autoplay policy). */
export async function ensureLessonAudio(instrument: LessonInstrument) {
  const engine = getEngine();
  await engine.resume();
  engine.prepareLive(INSTRUMENT_ID[instrument]);
}

export function playNote(
  instrument: LessonInstrument,
  midi: number,
  ms = 900,
) {
  const engine = getEngine();
  const id = INSTRUMENT_ID[instrument];
  engine.liveNoteOn(id, midi);
  setTimeout(() => engine.liveNoteOff(id, midi), ms);
}

export function playChord(
  instrument: LessonInstrument,
  midis: number[],
  ms = 1600,
) {
  const engine = getEngine();
  const id = INSTRUMENT_ID[instrument];
  const strumMs = instrument === "guitar" ? 42 : 14;
  midis.forEach((midi, i) => {
    setTimeout(() => {
      engine.liveNoteOn(id, midi);
      setTimeout(() => engine.liveNoteOff(id, midi), ms);
    }, i * strumMs);
  });
}

export interface PlayableStep {
  midis: number[];
  beats: number;
}

/**
 * Play steps back to back at `bpm`. `onStep` fires with each step index and
 * finally with -1. Returns a cancel function.
 */
export function playSteps(
  instrument: LessonInstrument,
  steps: PlayableStep[],
  bpm: number,
  onStep?: (index: number) => void,
): () => void {
  const engine = getEngine();
  const id = INSTRUMENT_ID[instrument];
  const beatMs = 60000 / bpm;
  const timeouts: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;
  let at = 0;

  steps.forEach((step, index) => {
    const durMs = Math.max(120, step.beats * beatMs * 0.92);
    timeouts.push(
      setTimeout(() => {
        if (cancelled) return;
        onStep?.(index);
        for (const midi of step.midis) {
          engine.liveNoteOn(id, midi);
          timeouts.push(setTimeout(() => engine.liveNoteOff(id, midi), durMs));
        }
      }, at),
    );
    at += step.beats * beatMs;
  });
  timeouts.push(
    setTimeout(() => {
      if (!cancelled) onStep?.(-1);
    }, at + 100),
  );

  return () => {
    cancelled = true;
    for (const t of timeouts) clearTimeout(t);
    onStep?.(-1);
  };
}
