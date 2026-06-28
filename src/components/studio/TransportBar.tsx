"use client";

import { Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="sticky bottom-0 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur safe-bottom">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="w-9 shrink-0 font-semibold">BPM</span>
          <input
            type="range"
            min={60}
            max={180}
            step={1}
            value={bpm}
            aria-label="Tempo (BPM)"
            onChange={(e) => onBpm(Number(e.target.value))}
            className="h-8 flex-1 accent-accent"
          />
          <span className="w-8 shrink-0 text-right tabular-nums text-text">{bpm}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Button size="lg" className="flex-1" onClick={onToggle}>
            {isPlaying ? (
              <>
                <Square className="size-5" />
                Stop
              </>
            ) : (
              <>
                <Play className="size-5" />
                Play
              </>
            )}
          </Button>
          <div className="flex w-36 items-center gap-2">
            <Volume2 className="size-5 shrink-0 text-text-muted" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              aria-label="Master volume"
              onChange={(e) => onMasterVolume(Number(e.target.value))}
              className="h-8 flex-1 accent-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
