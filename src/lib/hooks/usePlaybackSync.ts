"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database, PlaybackState } from "@/lib/types/database";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Params {
  isHost: boolean;
  roomId: string;
  song: Song | null;
  playback: PlaybackState;
}

const DRIFT_THRESHOLD_MS = 300;

export function usePlaybackSync({ isHost, roomId, song, playback }: Params) {
  const supabase = useMemo(() => createClient(), []);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;
    const bucket = process.env.NEXT_PUBLIC_SONGS_BUCKET ?? "songs";
    if (song.audio_storage_path) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(song.audio_storage_path);
      if (audio.src !== data.publicUrl) {
        audio.src = data.publicUrl;
        audio.load();
      }
    }
  }, [song, supabase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const positionSec = playback.position_ms / 1000;
    const hostReportedAt = new Date(playback.updated_at).getTime();

    const estimated = playback.playing
      ? positionSec + Math.max(0, (Date.now() - hostReportedAt) / 1000)
      : positionSec;

    if (
      Math.abs(audio.currentTime - estimated) * 1000 >
      DRIFT_THRESHOLD_MS
    ) {
      try {
        audio.currentTime = Math.max(0, estimated);
      } catch {
        /* ignore seek errors */
      }
    }

    if (playback.playing && audio.paused) {
      audio.play().catch(() => {
        /* autoplay likely blocked until user gesture */
      });
    } else if (!playback.playing && !audio.paused) {
      audio.pause();
    }
  }, [playback]);

  const publishState = useCallback(
    async (next: Partial<PlaybackState>) => {
      const state: PlaybackState = {
        ...playback,
        ...next,
        updated_at: new Date().toISOString(),
      };
      await supabase
        .from("rooms")
        .update({ playback_state: state })
        .eq("id", roomId);
    },
    [playback, roomId, supabase],
  );

  const onHostPlay = useCallback(() => {
    if (!isHost) return;
    const audio = audioRef.current;
    const pos = audio ? audio.currentTime * 1000 : playback.position_ms;
    publishState({ playing: true, position_ms: pos });
    audio?.play().catch(() => undefined);
  }, [isHost, publishState, playback.position_ms]);

  const onHostPause = useCallback(() => {
    if (!isHost) return;
    const audio = audioRef.current;
    const pos = audio ? audio.currentTime * 1000 : playback.position_ms;
    publishState({ playing: false, position_ms: pos });
    audio?.pause();
  }, [isHost, publishState, playback.position_ms]);

  const onHostSeek = useCallback(
    (positionMs: number) => {
      if (!isHost) return;
      const audio = audioRef.current;
      if (audio) audio.currentTime = positionMs / 1000;
      publishState({ position_ms: positionMs });
    },
    [isHost, publishState],
  );

  useEffect(() => {
    if (!isHost) return;
    const audio = audioRef.current;
    if (!audio) return;

    const interval = setInterval(() => {
      if (!audio.paused && !audio.ended) {
        publishState({
          playing: true,
          position_ms: Math.round(audio.currentTime * 1000),
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isHost, publishState]);

  return { audioRef, onHostPlay, onHostPause, onHostSeek };
}
