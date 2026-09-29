"use client";

import { ChevronDown, Download, ListMusic, Minus, Play, Plus, Square } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Mode } from "@/lib/music/chord";
import type { Song } from "@/lib/song/model";
import type { ProjectMeta } from "@/lib/song/library";
import { KeySelect } from "@/components/studio/KeySelect";
import { Menu } from "@/components/studio/Menu";

interface Props {
  song: Song;
  isPlaying: boolean;
  loopMode: "song" | "section";
  loopSectionName: string | null;
  songSelected: boolean;
  saveState: "saving" | "saved" | "error";
  onPlay: () => void;
  onStop: () => void;
  onBpm: (bpm: number) => void;
  onKey: (tonic: string, mode: Mode) => void;
  onLoopMode: (mode: "song" | "section") => void;
  onSelectSong: () => void;
  onExportMidi: () => void;
  projects: ProjectMeta[];
  currentProjectId: string | null;
  onOpenProject: (id: string) => void;
  onNewSong: () => void;
  onDuplicateSong: () => void;
  onDeleteSong: () => void;
  onExportFile: () => void;
  onImportFile: () => void;
}

function when(ts: number): string {
  const d = new Date(ts);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function Transport({
  song,
  isPlaying,
  loopMode,
  loopSectionName,
  songSelected,
  saveState,
  onPlay,
  onStop,
  onBpm,
  onKey,
  onLoopMode,
  onSelectSong,
  onExportMidi,
  projects,
  currentProjectId,
  onOpenProject,
  onNewSong,
  onDuplicateSong,
  onDeleteSong,
  onExportFile,
  onImportFile,
}: Props) {
  const others = projects.filter((p) => p.id !== currentProjectId);
  const menuItems = [
    { id: "new", label: "New song" },
    { id: "duplicate", label: "Duplicate this song" },
    { id: "export", label: "Export song file" },
    { id: "import", label: "Import song file…" },
    ...(projects.length > 1 ? [{ id: "delete", label: "Delete this song" }] : []),
    ...others.map((p) => ({
      id: `open:${p.id}`,
      label: p.title,
      hint: `${p.tracks} ${p.tracks === 1 ? "part" : "parts"} · ${when(p.updatedAt)}`,
    })),
  ];
  const pick = (id: string) => {
    if (id === "new") onNewSong();
    else if (id === "duplicate") onDuplicateSong();
    else if (id === "delete") onDeleteSong();
    else if (id === "export") onExportFile();
    else if (id === "import") onImportFile();
    else if (id.startsWith("open:")) onOpenProject(id.slice(5));
  };
  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line-soft bg-[#0d0d11] px-3 py-2 sm:px-4">
      <button
        type="button"
        onClick={onSelectSong}
        aria-pressed={songSelected}
        className={cn(
          "min-w-0 rounded-lg px-2 py-1 text-left hover:bg-bg-raised",
          songSelected ? "bg-bg-raised" : "",
        )}
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
          Songwriter Studio
        </div>
        <div className="max-w-56 truncate font-display text-[15px] font-bold leading-tight">
          {song.title || "Untitled song"}
        </div>
      </button>

      <KeySelect
        tonic={song.tonic}
        mode={song.mode}
        onTonic={(t) => onKey(t, song.mode)}
        onMode={(m) => onKey(song.tonic, m)}
      />

      <div className="flex items-center gap-2 sm:ml-auto">
        <div className="flex h-10 items-center rounded-full border border-line bg-bg-raised">
          <button
            type="button"
            aria-label="Decrease tempo"
            onClick={() => onBpm(Math.max(40, song.bpm - 2))}
            className="flex h-full w-9 items-center justify-center text-text-muted hover:text-text"
          >
            <Minus className="size-3.5" />
          </button>
          <div className="w-14 text-center">
            <div className="font-mono text-[13px] font-semibold leading-none text-accent">{song.bpm}</div>
            <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-text-dim">bpm</div>
          </div>
          <button
            type="button"
            aria-label="Increase tempo"
            onClick={() => onBpm(Math.min(220, song.bpm + 2))}
            className="flex h-full w-9 items-center justify-center text-text-muted hover:text-text"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={isPlaying ? onStop : onPlay}
          aria-label={isPlaying ? "Stop" : "Play"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-black shadow-glow-accent"
        >
          {isPlaying ? (
            <Square className="size-4" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 size-4" fill="currentColor" />
          )}
        </button>

        <div className="flex h-10 items-center overflow-hidden rounded-full border border-line text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => onLoopMode("song")}
            aria-pressed={loopMode === "song"}
            className={cn("h-full px-3", loopMode === "song" ? "bg-accent text-black" : "text-text-muted hover:text-text")}
          >
            Whole song
          </button>
          <button
            type="button"
            onClick={() => onLoopMode("section")}
            aria-pressed={loopMode === "section"}
            title={loopSectionName ? `Loop ${loopSectionName}` : "Loop the selected section"}
            className={cn("h-full max-w-36 truncate px-3", loopMode === "section" ? "bg-accent text-black" : "text-text-muted hover:text-text")}
          >
            {loopMode === "section" && loopSectionName ? `Loop ${loopSectionName}` : "Loop section"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Menu
          title={others.length > 0 ? "Your songs" : undefined}
          align="left"
          trigger={
            <span className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-[11.5px] font-semibold text-text-soft hover:bg-bg-raised">
              <ListMusic className="size-3.5" />
              Songs
              {projects.length > 1 ? (
                <span className="rounded-full bg-bg-higher px-1.5 font-mono text-[10px] text-text-muted">
                  {projects.length}
                </span>
              ) : null}
              <ChevronDown className="size-3 text-text-dim" />
            </span>
          }
          items={menuItems}
          onPick={pick}
        />
        <button
          type="button"
          onClick={onExportMidi}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-[11.5px] font-semibold text-text-soft hover:bg-bg-raised"
          title="Download a MIDI file with one track per instrument"
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Export MIDI</span>
          <span className="sm:hidden">MIDI</span>
        </button>
        <span className="hidden text-[11px] text-text-dim md:inline">
          {saveState === "saved" ? "Saved on this device" : saveState === "saving" ? "Saving…" : "Couldn't save"}
        </span>
      </div>
    </header>
  );
}
