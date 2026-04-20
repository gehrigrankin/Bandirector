"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { GuitarDiagram } from "@/components/music/GuitarDiagram";
import { NextChord } from "@/components/music/NextChord";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { UnverifiedBadge } from "@/components/music/UnverifiedBadge";
import { PICKING_PATTERNS } from "@/lib/music/patterns";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

export function AcousticGuitarFingerstyle({ song, positionMs, chordAt }: Props) {
  const feel = song.feel ?? song.analysis_json?.feel ?? "folk";
  const pattern = PICKING_PATTERNS[feel];

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Fingerstyle · {song.key ?? "?"} · {song.bpm ? `${Math.round(Number(song.bpm))} BPM` : "?"}
        </div>
        <UnverifiedBadge chord={chordAt.current} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div
          className="text-center font-bold leading-none"
          style={{ fontSize: "clamp(5rem, 16vw, 10rem)" }}
        >
          {chordAt.current?.chord ?? "—"}
        </div>

        <NextChord next={chordAt.next} />

        {chordAt.current ? (
          <GuitarDiagram chord={chordAt.current.chord} size={160} />
        ) : null}

        <div className="rounded-xl border border-border bg-bg-raised p-3 text-center text-sm">
          <div className="text-xs uppercase tracking-wider text-text-muted">
            Picking pattern
          </div>
          <div className="mt-1 font-mono">{pattern}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-raised p-4">
        <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} />
      </div>
    </div>
  );
}
