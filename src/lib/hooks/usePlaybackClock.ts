"use client";

import { useEffect, useState } from "react";
import type { PlaybackState } from "@/lib/types/database";

export function usePlaybackClock(playback: PlaybackState, tickMs = 50) {
  const [positionMs, setPositionMs] = useState(playback.position_ms);

  useEffect(() => {
    if (!playback.playing) {
      setPositionMs(playback.position_ms);
      return;
    }
    const anchorReal = Date.now();
    const anchorTrack = playback.position_ms;
    const startedAt = new Date(playback.updated_at).getTime();
    const drift = anchorReal - startedAt;
    setPositionMs(anchorTrack + Math.max(0, drift));

    const id = setInterval(() => {
      const elapsed = Date.now() - anchorReal;
      setPositionMs(anchorTrack + drift + elapsed);
    }, tickMs);
    return () => clearInterval(id);
  }, [playback.playing, playback.position_ms, playback.updated_at, tickMs]);

  return positionMs;
}
