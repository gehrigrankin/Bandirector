"use client";

import { Trash2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getStudioInstrument } from "@/lib/audio/instruments";
import { styleLabel } from "@/lib/audio/patterns";
import { chordSymbol } from "@/lib/music/chord";
import type { StudioTrack } from "@/lib/audio/engine";

interface TrackRackProps {
  tracks: StudioTrack[];
  onRemove: (id: string) => void;
  onVolume: (id: string, volume: number) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
}

export function TrackRack({
  tracks,
  onRemove,
  onVolume,
  onToggleMute,
  onToggleSolo,
}: TrackRackProps) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Locked loops ({tracks.length})
      </h2>
      {tracks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-bg-raised/50 p-4 text-sm text-text-muted">
          Lock a loop to start layering. Each locked instrument keeps playing in
          sync, so you can stack a whole band.
        </p>
      ) : (
        <ul className="space-y-2">
          {tracks.map((t) => (
            <TrackRow
              key={t.id}
              track={t}
              onRemove={onRemove}
              onVolume={onVolume}
              onToggleMute={onToggleMute}
              onToggleSolo={onToggleSolo}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function TrackRow({
  track,
  onRemove,
  onVolume,
  onToggleMute,
  onToggleSolo,
}: {
  track: StudioTrack;
  onRemove: (id: string) => void;
  onVolume: (id: string, volume: number) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
}) {
  const inst = getStudioInstrument(track.instrumentId);
  const label =
    inst.kind === "drum"
      ? styleLabel(track.styleId)
      : `${chordSymbol(track.root, track.quality)} · ${styleLabel(track.styleId)}`;

  return (
    <li className="rounded-2xl border border-border bg-bg-raised p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{inst.label}</p>
          <p className="truncate text-xs text-text-muted">{label}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleSolo(track.id)}
            className={cn(
              "h-9 w-9 rounded-lg border text-xs font-bold",
              track.solo
                ? "border-accent bg-accent text-black"
                : "border-border bg-bg-higher text-text-muted hover:text-text",
            )}
            aria-pressed={track.solo}
          >
            S
          </button>
          <button
            type="button"
            onClick={() => onToggleMute(track.id)}
            className={cn(
              "h-9 w-9 rounded-lg border text-xs font-bold",
              track.muted
                ? "border-red-500 bg-red-600 text-white"
                : "border-border bg-bg-higher text-text-muted hover:text-text",
            )}
            aria-pressed={track.muted}
          >
            M
          </button>
          <button
            type="button"
            onClick={() => onRemove(track.id)}
            aria-label="Remove loop"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-bg-higher text-text-muted hover:text-text"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Volume2 className="size-4 shrink-0 text-text-dim" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={track.volume}
          onChange={(e) => onVolume(track.id, Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-accent"
          aria-label="Track volume"
        />
      </div>
    </li>
  );
}
