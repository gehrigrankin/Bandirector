"use client";

import { TrackRow } from "@/components/studio/TrackRow";
import type { Track } from "@/components/studio/types";

interface Props {
  tracks: Track[];
  onMute: (id: string, muted: boolean) => void;
  onSolo: (id: string, solo: boolean) => void;
  onVolume: (id: string, volume: number) => void;
  onRemove: (id: string) => void;
}

export function TrackRack({ tracks, onMute, onSolo, onVolume, onRemove }: Props) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-text-muted">
        Layers{tracks.length > 0 ? ` (${tracks.length})` : ""}
      </h2>
      {tracks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-text-dim">
          No locked loops yet. Build a part above and press <strong>Lock loop</strong>{" "}
          to stack it here — every layer plays together under one transport.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {tracks.map((t) => (
            <TrackRow
              key={t.id}
              track={t}
              onMute={onMute}
              onSolo={onSolo}
              onVolume={onVolume}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}
