"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { chordSymbol } from "@/lib/music/chord";
import { getInstrument } from "@/lib/audio/instruments";
import { getStyle } from "@/lib/audio/patterns";
import type { Track } from "@/components/studio/types";

interface Props {
  track: Track;
  onMute: (id: string, muted: boolean) => void;
  onSolo: (id: string, solo: boolean) => void;
  onVolume: (id: string, volume: number) => void;
  onRemove: (id: string) => void;
}

export function TrackRow({ track, onMute, onSolo, onVolume, onRemove }: Props) {
  const def = getInstrument(track.instrumentId);
  const style = getStyle(def.family, track.styleId);
  const title = def.isDrums
    ? def.label
    : `${chordSymbol(track.root, track.quality)} · ${def.label}`;

  return (
    <div className="rounded-xl border border-border bg-bg-raised p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-semibold">{title}</div>
          <div className="truncate text-xs text-text-muted">{style.label}</div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0 px-2"
          aria-label="Remove track"
          onClick={() => onRemove(track.id)}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={track.muted ? "danger" : "secondary"}
          className="w-11 px-0"
          aria-pressed={track.muted}
          onClick={() => onMute(track.id, !track.muted)}
        >
          M
        </Button>
        <Button
          size="sm"
          variant={track.solo ? "primary" : "secondary"}
          className="w-11 px-0"
          aria-pressed={track.solo}
          onClick={() => onSolo(track.id, !track.solo)}
        >
          S
        </Button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={track.volume}
          aria-label="Track volume"
          onChange={(e) => onVolume(track.id, Number(e.target.value))}
          className="h-11 flex-1 accent-accent"
        />
      </div>
    </div>
  );
}
