"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { UnverifiedBadge } from "@/components/music/UnverifiedBadge";
import { rootOf } from "@/lib/music/chord";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

export function BassView({ song, positionMs, chordAt }: Props) {
  const currentRoot = chordAt.current ? rootOf(chordAt.current.chord) : null;
  const nextRoot = chordAt.next ? rootOf(chordAt.next.chord) : null;

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Bass · {song.key ?? "?"}
        </div>
        <UnverifiedBadge chord={chordAt.current} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div
          className="text-center font-bold leading-none"
          style={{ fontSize: "clamp(9rem, 30vw, 18rem)" }}
        >
          {currentRoot ?? "—"}
        </div>

        <div className="text-center text-sm uppercase tracking-widest text-text-muted">
          Root note
        </div>

        <div className="mt-4 rounded-xl border border-border bg-bg-raised px-4 py-3 text-center">
          <div className="text-xs uppercase tracking-wider text-text-muted">
            Next
          </div>
          <div className="mt-1 text-3xl font-semibold">{nextRoot ?? "—"}</div>
        </div>

        <p className="text-center text-xs text-text-dim">
          Try the octave above on the & of 4 to walk up to the next chord.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-bg-raised p-4">
        <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} />
      </div>
    </div>
  );
}
