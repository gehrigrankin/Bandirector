"use client";

import { useMemo } from "react";
import { lyricAtTimeMs, parseLrc } from "@/lib/lyrics/lrclib";
import { cn } from "@/lib/utils/cn";

interface Props {
  lrc: string | null | undefined;
  positionMs: number;
  prominent?: boolean;
}

export function SyncedLyrics({ lrc, positionMs, prominent }: Props) {
  const lines = useMemo(() => parseLrc(lrc ?? undefined), [lrc]);
  const { current, next } = lyricAtTimeMs(lines, positionMs);

  if (!lines.length) {
    return (
      <p className="text-center text-xs text-text-dim">
        No synced lyrics found for this song.
      </p>
    );
  }

  return (
    <div className="space-y-1 text-center">
      <p
        className={cn(
          "transition-opacity",
          prominent
            ? "text-2xl font-semibold leading-snug"
            : "text-base text-text",
        )}
      >
        {current?.text || "…"}
      </p>
      {next ? (
        <p
          className={cn(
            "text-text-muted",
            prominent ? "text-base" : "text-sm",
          )}
        >
          {next.text}
        </p>
      ) : null}
    </div>
  );
}
