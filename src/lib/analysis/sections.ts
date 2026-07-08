import type { AnalysisJson } from "@/lib/types/database";

export interface SongSection {
  id: number;
  name: string;
  startSec: number;
  endSec: number;
  /** Distinct chords in order (consecutive duplicates collapsed). */
  chords: string[];
  bars: number;
}

/**
 * Group a song's chord timeline into a handful of contiguous "sections" so the
 * Coach can present one part at a time. We don't have true structural labels
 * (verse/chorus) from analysis, so parts are named ordinally but their times,
 * chords and bar counts are real — derived from the same analysis the Jam room
 * uses.
 */
export function deriveSections(
  analysis: AnalysisJson | null | undefined,
  bpm?: number | null,
): SongSection[] {
  const chords = analysis?.chords ?? [];
  if (chords.length === 0) return [];

  const secPerBar = bpm && bpm > 0 ? (60 / Number(bpm)) * 4 : 2;
  const target = Math.min(6, Math.max(1, Math.round(chords.length / 4)));
  const per = Math.ceil(chords.length / target);

  const sections: SongSection[] = [];
  for (let i = 0; i < chords.length; i += per) {
    const slice = chords.slice(i, i + per);
    if (slice.length === 0) continue;
    const start = slice[0].time;
    const last = slice[slice.length - 1];
    const end = last.time + last.duration;

    const distinct: string[] = [];
    for (const c of slice) {
      if (distinct[distinct.length - 1] !== c.chord) distinct.push(c.chord);
    }

    sections.push({
      id: sections.length,
      name: `Part ${sections.length + 1}`,
      startSec: start,
      endSec: end,
      chords: distinct,
      bars: Math.max(1, Math.round((end - start) / secPerBar)),
    });
  }
  return sections;
}
