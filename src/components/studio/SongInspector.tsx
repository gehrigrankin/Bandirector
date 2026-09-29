"use client";

// Song-wide settings: title, feel, and the way out (MIDI export, start over).

import { Download, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDuration, songSeconds, totalBars, type Song } from "@/lib/song/model";
import { Slider } from "@/components/studio/Slider";
import { LABEL } from "@/components/studio/shared";

interface Props {
  song: Song;
  onChange: (patch: Partial<Song>) => void;
  onExportMidi: () => void;
  onNewSong: () => void;
}

const FEELS: { id: string; label: string; swing: number }[] = [
  { id: "straight", label: "Straight", swing: 0 },
  { id: "laidback", label: "Laid-back", swing: 0.28 },
  { id: "swing", label: "Swing", swing: 0.5 },
];

export function SongInspector({ song, onChange, onExportMidi, onNewSong }: Props) {
  const feel = song.swing < 0.05 ? "straight" : song.swing < 0.35 ? "laidback" : "swing";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <div className={LABEL}>Title</div>
          <input
            value={song.title}
            onChange={(e) => onChange({ title: e.target.value.slice(0, 80) })}
            aria-label="Song title"
            placeholder="Untitled song"
            className="mt-0.5 h-10 w-64 rounded-lg border border-line bg-bg-input px-3 font-display text-[16px] font-bold text-text outline-none placeholder:text-text-dim focus:border-accent"
          />
        </div>
        <div className="text-[12px] text-text-muted">
          {song.sections.length} sections · {totalBars(song)} bars · {formatDuration(songSeconds(song))} at {song.bpm} BPM
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-xs font-medium text-text-muted">Feel</div>
          <div className="flex overflow-hidden rounded-full border border-line">
            {FEELS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ swing: f.swing })}
                aria-pressed={feel === f.id}
                className={cn(
                  "h-10 flex-1 text-[11.5px] font-semibold",
                  feel === f.id ? "bg-accent text-black" : "text-text-muted hover:text-text",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <Slider
          label="Humanize"
          value={song.humanize}
          display={song.humanize < 0.15 ? "Tight" : song.humanize > 0.7 ? "Loose" : `${Math.round(song.humanize * 100)}%`}
          min={0}
          max={1}
          onChange={(v) => onChange({ humanize: v })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onExportMidi}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-[12.5px] font-semibold text-black"
        >
          <Download className="size-4" /> Export MIDI for GarageBand / Logic / Ableton
        </button>
        <button
          type="button"
          onClick={onNewSong}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-4 text-[12.5px] font-semibold text-text-soft hover:bg-bg-raised"
        >
          <FilePlus2 className="size-4" /> New song
        </button>
      </div>
      <p className="text-[11.5px] leading-relaxed text-text-muted">
        Every song is saved on this device as you edit; open, duplicate, or delete
        songs from the Songs menu in the header. The MIDI file has one track per instrument, a marker at every section, and the tempo
        baked in — drop it into your DAW and every part lands on its own track, ready to
        swap sounds and build out.
      </p>
    </div>
  );
}
