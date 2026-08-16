"use client";

import { Lock, Minus, Play, Plus, Square, Volume2 } from "lucide-react";

interface Props {
  isPlaying: boolean;
  bpm: number;
  masterVolume: number;
  onToggle: () => void;
  onBpm: (bpm: number) => void;
  onMasterVolume: (v: number) => void;
  canLock: boolean;
  onLock: () => void;
}

export function TransportBar({
  isPlaying,
  bpm,
  masterVolume,
  onToggle,
  onBpm,
  onMasterVolume,
  canLock,
  onLock,
}: Props) {
  return (
    <div className="border-t border-line-soft bg-[#0d0d11]/95 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2.5 px-3 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={onToggle}
          aria-label={isPlaying ? "Stop" : "Play"}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-black shadow-glow-accent"
        >
          {isPlaying ? (
            <Square className="size-[18px]" fill="currentColor" />
          ) : (
            <Play className="size-[18px]" fill="currentColor" />
          )}
        </button>

        <div className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-line bg-bg-raised">
          <button
            type="button"
            aria-label="Decrease tempo"
            onClick={() => onBpm(Math.max(60, bpm - 2))}
            className="flex h-full w-10 shrink-0 items-center justify-center text-text-muted active:text-text"
          >
            <Minus className="size-4" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <div className="font-mono text-sm font-semibold leading-none text-accent">
              {bpm}
            </div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-text-dim">
              BPM
            </div>
          </div>
          <button
            type="button"
            aria-label="Increase tempo"
            onClick={() => onBpm(Math.min(180, bpm + 2))}
            className="flex h-full w-10 shrink-0 items-center justify-center text-text-muted active:text-text"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <div className="hidden w-32 shrink-0 items-center gap-2 md:flex">
          <Volume2 className="size-4 shrink-0 text-text-muted" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVolume}
            aria-label="Master volume"
            onChange={(e) => onMasterVolume(Number(e.target.value))}
            className="h-4 min-w-0 flex-1 accent-accent"
          />
        </div>

        <button
          type="button"
          onClick={onLock}
          disabled={!canLock}
          aria-label="Lock loop as a layer"
          className="flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-accent px-3.5 text-sm font-semibold text-black disabled:bg-bg-higher disabled:text-text-dim"
        >
          <Lock className="size-4" />
          <span className="hidden min-[360px]:inline">Lock</span>
        </button>
      </div>
    </div>
  );
}
