"use client";

import { Play, Square, Volume2 } from "lucide-react";

interface Props {
  isPlaying: boolean;
  bpm: number;
  masterVolume: number;
  onToggle: () => void;
  onBpm: (bpm: number) => void;
  onMasterVolume: (v: number) => void;
}

export function TransportBar({
  isPlaying,
  bpm,
  masterVolume,
  onToggle,
  onBpm,
  onMasterVolume,
}: Props) {
  return (
    <div className="flex items-center gap-3.5 border-t border-line-soft bg-[#0d0d11]/95 px-5 py-3 backdrop-blur safe-bottom">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? "Stop" : "Play"}
        className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-accent text-black shadow-glow-accent"
      >
        {isPlaying ? (
          <Square className="size-5" fill="currentColor" />
        ) : (
          <Play className="size-5" fill="currentColor" />
        )}
      </button>
      <div className="flex-1">
        <div className="flex items-center justify-between text-[10px] text-text-muted">
          <span>BPM</span>
          <span className="font-mono font-semibold text-accent">{bpm}</span>
        </div>
        <input
          type="range"
          min={60}
          max={180}
          step={1}
          value={bpm}
          aria-label="Tempo (BPM)"
          onChange={(e) => onBpm(Number(e.target.value))}
          className="mt-1.5 h-4 w-full accent-accent"
        />
      </div>
      <div className="flex w-24 shrink-0 items-center gap-2">
        <Volume2 className="size-5 shrink-0 text-text-muted" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={masterVolume}
          aria-label="Master volume"
          onChange={(e) => onMasterVolume(Number(e.target.value))}
          className="h-4 flex-1 accent-accent"
        />
      </div>
    </div>
  );
}
