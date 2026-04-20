"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { NextChord } from "@/components/music/NextChord";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { UnverifiedBadge } from "@/components/music/UnverifiedBadge";
import { PianoVoicing } from "@/components/music/PianoVoicing";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

export function PianoView({ song, positionMs, chordAt }: Props) {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Piano · {song.key ?? "?"}
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
          <div className="w-full max-w-sm text-accent">
            <PianoVoicing chord={chordAt.current.chord} width={320} />
          </div>
        ) : null}
        <p className="text-center text-xs text-text-dim">
          Root position voicing. Invert as needed for smooth voice leading.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-bg-raised p-4">
        <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} />
      </div>
    </div>
  );
}
