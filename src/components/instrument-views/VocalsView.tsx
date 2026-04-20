"use client";

import type { Database } from "@/lib/types/database";
import type { chordAtTimeMs } from "@/lib/analysis/timeline";
import { SyncedLyrics } from "@/components/music/SyncedLyrics";
import { UnverifiedBadge } from "@/components/music/UnverifiedBadge";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}

export function VocalsView({ song, positionMs, chordAt }: Props) {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          Vocals · {song.key ?? "?"}
        </div>
        <UnverifiedBadge chord={chordAt.current} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4 text-text-dim">
          <span className="text-sm font-semibold">
            {chordAt.current?.chord ?? "—"}
          </span>
          <span className="text-xs">·</span>
          <span className="text-sm">{chordAt.next?.chord ?? "—"}</span>
        </div>

        <div className="min-h-[40vh] w-full max-w-2xl rounded-2xl border border-border bg-bg-raised px-6 py-10">
          <SyncedLyrics lrc={song.lyrics_lrc} positionMs={positionMs} prominent />
        </div>
      </div>
    </div>
  );
}
