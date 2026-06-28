"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getInstrument } from "@/lib/audio/instruments";
import { patternSummary } from "@/lib/audio/patterns";
import { Slider, lengthLabel, reverbLabel } from "@/components/studio/Slider";
import type { Track } from "@/components/studio/types";

interface Props {
  track: Track;
  onMute: (id: string, muted: boolean) => void;
  onSolo: (id: string, solo: boolean) => void;
  onVolume: (id: string, volume: number) => void;
  onNoteLength: (id: string, v: number) => void;
  onReverb: (id: string, v: number) => void;
  onRemove: (id: string) => void;
}

export function TrackRow({
  track,
  onMute,
  onSolo,
  onVolume,
  onNoteLength,
  onReverb,
  onRemove,
}: Props) {
  const def = getInstrument(track.instrumentId);

  return (
    <div className="rounded-xl border border-border bg-bg-raised p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-semibold">{def.label}</div>
          <div className="truncate text-xs text-text-muted">
            {patternSummary(track.pattern)}
            {def.isDrums ? "" : " · follows progression"}
          </div>
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
      <div className="mt-2 grid grid-cols-2 gap-x-3">
        <Slider
          label="Length"
          value={track.noteLength}
          display={lengthLabel(track.noteLength)}
          min={0.3}
          max={2}
          onChange={(v) => onNoteLength(track.id, v)}
        />
        <Slider
          label="Reverb"
          value={track.reverb}
          display={reverbLabel(track.reverb)}
          min={0}
          max={1}
          onChange={(v) => onReverb(track.id, v)}
        />
      </div>
    </div>
  );
}
