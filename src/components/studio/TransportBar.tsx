"use client";

import { Loader2, Pause, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TransportBarProps {
  isPlaying: boolean;
  loading: boolean;
  bpm: number;
  masterVolume: number;
  onToggle: () => void;
  onBpm: (bpm: number) => void;
  onMasterVolume: (v: number) => void;
}

export function TransportBar({
  isPlaying,
  loading,
  bpm,
  masterVolume,
  onToggle,
  onBpm,
  onMasterVolume,
}: TransportBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg-raised/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-full font-semibold transition-colors",
            isPlaying
              ? "bg-bg-higher text-text"
              : "bg-accent text-black hover:bg-accent-soft",
          )}
          aria-label={isPlaying ? "Stop" : "Play"}
        >
          {loading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="size-6" />
          ) : (
            <Play className="size-6 translate-x-0.5" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-xs text-text-dim">
              {bpm} BPM
            </span>
            <input
              type="range"
              min={50}
              max={200}
              step={1}
              value={bpm}
              onChange={(e) => onBpm(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-accent"
              aria-label="Tempo"
            />
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 shrink-0 text-text-dim" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={(e) => onMasterVolume(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-accent"
              aria-label="Master volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
