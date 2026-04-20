import type { AnalysisJson, ChordHit } from "@/lib/types/database";

export interface ChordAtTime {
  current: ChordHit | null;
  next: ChordHit | null;
  progressWithinCurrent: number;
  index: number;
}

export function chordAtTimeMs(
  analysis: AnalysisJson | null | undefined,
  timeMs: number,
): ChordAtTime {
  if (!analysis?.chords?.length) {
    return { current: null, next: null, progressWithinCurrent: 0, index: -1 };
  }

  const seconds = timeMs / 1000;
  const chords = analysis.chords;

  let idx = -1;
  for (let i = 0; i < chords.length; i++) {
    const c = chords[i];
    if (seconds >= c.time && seconds < c.time + c.duration) {
      idx = i;
      break;
    }
    if (seconds < c.time) break;
  }

  if (idx === -1) {
    const last = chords[chords.length - 1];
    if (seconds >= last.time + last.duration) {
      return {
        current: null,
        next: null,
        progressWithinCurrent: 1,
        index: chords.length,
      };
    }
    const upcomingIdx = chords.findIndex((c) => c.time > seconds);
    return {
      current: null,
      next: upcomingIdx >= 0 ? chords[upcomingIdx] : null,
      progressWithinCurrent: 0,
      index: -1,
    };
  }

  const current = chords[idx];
  const next = chords[idx + 1] ?? null;
  const progress = current.duration
    ? Math.min(1, Math.max(0, (seconds - current.time) / current.duration))
    : 0;

  return { current, next, progressWithinCurrent: progress, index: idx };
}

export function beatPhase(
  analysis: AnalysisJson | null | undefined,
  timeMs: number,
): { lastBeat: number; nextBeat: number; fraction: number } | null {
  if (!analysis?.beats?.length) return null;
  const seconds = timeMs / 1000;
  const beats = analysis.beats;

  let i = 0;
  while (i < beats.length && beats[i].time <= seconds) i++;
  const prev = beats[i - 1];
  const next = beats[i];
  if (!prev || !next) return null;
  const fraction = (seconds - prev.time) / (next.time - prev.time);
  return { lastBeat: prev.time, nextBeat: next.time, fraction };
}
