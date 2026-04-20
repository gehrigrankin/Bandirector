"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { GuitarDiagram } from "@/components/music/GuitarDiagram";
import { NextChord } from "@/components/music/NextChord";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { UnverifiedBadge } from "@/components/music/UnverifiedBadge";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

export function ElectricLeadView({ song, positionMs, chordAt }: Props) {
  const analysis = song.analysis_json;
  const chords = analysis?.chords ?? [];
  const current = chordAt.current;
  const inLongSection =
    !!current && current.duration > 8 && chordAt.progressWithinCurrent > 0.4;
  const segmentsStart = current?.time ?? 0;

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Electric · {song.key ?? "?"} ·{" "}
          {song.bpm ? `${Math.round(Number(song.bpm))} BPM` : "?"}
        </div>
        <UnverifiedBadge chord={current} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {inLongSection ? (
          <div className="rounded-2xl border border-border bg-bg-raised p-6 text-center">
            <div className="text-sm uppercase tracking-wider text-accent">
              Solo section
            </div>
            <div className="mt-2 text-xl">
              Over <span className="font-bold">{current!.chord}</span> — key of{" "}
              <span className="font-bold">{song.key}</span>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Tab transcription is not in v1. Improvise with the {song.key}{" "}
              {song.key?.endsWith("m") ? "minor pentatonic" : "major"} scale.
            </p>
          </div>
        ) : (
          <>
            <div
              className="text-center font-bold leading-none"
              style={{ fontSize: "clamp(5rem, 18vw, 11rem)" }}
            >
              {current?.chord ?? "—"}
            </div>
            <NextChord next={chordAt.next} />
            {current ? <GuitarDiagram chord={current.chord} size={140} /> : null}
          </>
        )}

        {chords.length ? (
          <div className="w-full max-w-md text-center text-xs text-text-muted">
            Section start {Math.round(segmentsStart)}s
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-bg-raised p-4">
        <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} />
      </div>
    </div>
  );
}
