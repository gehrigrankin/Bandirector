"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Plus, Save, Undo2, Redo2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AnalysisJson, ChordHit, Database } from "@/lib/types/database";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { formatTime } from "@/lib/utils/time";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song;
}

const PX_PER_SECOND = 80;

interface HistoryEntry {
  chords: ChordHit[];
}

export function ChordEditor({ song }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const initialChords = useMemo<ChordHit[]>(
    () => song.analysis_json?.chords ?? [],
    [song.analysis_json],
  );

  const [chords, setChords] = useState<ChordHit[]>(initialChords);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([
    { chords: initialChords },
  ]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [positionSec, setPositionSec] = useState(0);
  const [saving, setSaving] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const bucket = process.env.NEXT_PUBLIC_SONGS_BUCKET ?? "songs";
    if (audioRef.current && song.audio_storage_path) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(song.audio_storage_path);
      audioRef.current.src = data.publicUrl;
    }
  }, [song.audio_storage_path, supabase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setPositionSec(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onMeta = () => setDuration(audio.duration || 0);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  function pushHistory(next: ChordHit[]) {
    const snapshot: HistoryEntry = { chords: next };
    const nextHistory = history.slice(0, historyIdx + 1).concat(snapshot);
    setHistory(nextHistory);
    setHistoryIdx(nextHistory.length - 1);
    setChords(next);
  }

  function undo() {
    if (historyIdx === 0) return;
    const idx = historyIdx - 1;
    setHistoryIdx(idx);
    setChords(history[idx].chords);
  }
  function redo() {
    if (historyIdx >= history.length - 1) return;
    const idx = historyIdx + 1;
    setHistoryIdx(idx);
    setChords(history[idx].chords);
  }

  function updateChord(i: number, patch: Partial<ChordHit>) {
    const next = chords.map((c, idx) =>
      idx === i ? { ...c, ...patch, verified: true } : c,
    );
    pushHistory(next);
  }

  function deleteChord(i: number) {
    const next = chords.filter((_, idx) => idx !== i);
    pushHistory(next);
    setSelectedIdx(null);
  }

  function splitChord(i: number) {
    const c = chords[i];
    const half = c.duration / 2;
    const next = [...chords];
    next.splice(i, 1, {
      ...c,
      duration: half,
      verified: true,
    });
    next.splice(i + 1, 0, {
      ...c,
      time: c.time + half,
      duration: half,
      verified: true,
    });
    pushHistory(next);
  }

  function addChord() {
    const time = positionSec;
    const nextChord = chords.find((c) => c.time > time);
    const end = nextChord ? nextChord.time : Math.max(time + 2, duration);
    const newHit: ChordHit = {
      time,
      duration: Math.max(0.5, end - time),
      chord: "C",
      verified: true,
    };
    const next = [...chords, newHit].sort((a, b) => a.time - b.time);
    pushHistory(next);
    setSelectedIdx(next.indexOf(newHit));
  }

  async function save() {
    setSaving(true);
    const nextAnalysis: AnalysisJson = {
      ...(song.analysis_json ?? { beats: [], chords: [], version: 1 }),
      chords,
      version: (song.analysis_json?.version ?? 1) + 1,
    };
    await supabase
      .from("songs")
      .update({ analysis_json: nextAnalysis })
      .eq("id", song.id);
    setSaving(false);
  }

  const totalSec = Math.max(duration, chords.at(-1)?.time ?? 0) + 4;

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => undefined);
    else audio.pause();
  }

  function onTrackClick(e: React.MouseEvent) {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left + el.scrollLeft;
    const target = x / PX_PER_SECOND;
    if (audioRef.current) audioRef.current.currentTime = target;
  }

  return (
    <div className="flex flex-1 flex-col">
      <audio ref={audioRef} preload="auto" playsInline />

      <div className="flex items-center gap-3 border-b border-line-soft px-4 py-2.5 md:px-6">
        <button
          type="button"
          onClick={togglePlay}
          className="flex size-9 items-center justify-center rounded-full bg-accent text-black shadow-glow-accent"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="size-4" fill="currentColor" />
          ) : (
            <Play className="size-4" fill="currentColor" />
          )}
        </button>
        <span className="font-mono text-[13px] text-text-soft">
          {formatTime(positionSec * 1000)}{" "}
          <span className="text-text-dim">/ {formatTime(duration * 1000)}</span>
        </span>
        <div className="flex-1" />
        <Button size="sm" variant="ghost" onClick={undo} aria-label="Undo">
          <Undo2 className="size-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={redo} aria-label="Redo">
          <Redo2 className="size-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={addChord}>
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add chord</span>
        </Button>
        <Button size="sm" onClick={save} loading={saving}>
          <Save className="size-4" />
          <span className="hidden sm:inline">Save for everyone</span>
          <span className="sm:hidden">Save</span>
        </Button>
      </div>

      <div
        ref={trackRef}
        onClick={onTrackClick}
        className="relative flex-1 cursor-pointer overflow-x-auto bg-[#0d0d11]"
        style={{ minHeight: 220 }}
      >
        <div
          className="relative"
          style={{ width: Math.max(totalSec * PX_PER_SECOND, 800), height: 220 }}
        >
          {/* decorative waveform */}
          <div className="pointer-events-none absolute inset-x-0 top-6 flex h-24 items-center gap-[3px] px-6 opacity-60">
            {Array.from({ length: Math.max(60, Math.round(totalSec * 4)) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-1 shrink-0 rounded-full bg-[#2e2e38]"
                  style={{ height: 16 + ((i * 37) % 74) }}
                />
              ),
            )}
          </div>

          {/* chord blocks */}
          {chords.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(i);
              }}
              className={cn(
                "absolute top-[132px] flex items-center justify-center rounded-xl border font-display text-lg font-semibold transition-shadow",
                c.verified
                  ? "border-accent bg-accent/[0.14] text-accent"
                  : "border-line bg-[#15151c] text-text-muted",
                i === selectedIdx &&
                  "border-text text-text ring-2 ring-text/20",
              )}
              style={{
                left: c.time * PX_PER_SECOND,
                width: Math.max(c.duration * PX_PER_SECOND - 2, 24),
                height: 72,
              }}
            >
              {c.chord}
            </button>
          ))}

          <div
            className="absolute top-0 z-10 w-0.5 bg-accent shadow-[0_0_12px_rgba(245,165,36,0.5)]"
            style={{ left: positionSec * PX_PER_SECOND, height: 220 }}
          />
        </div>
        <div className="pointer-events-none absolute bottom-3 left-6 text-[11px] text-text-dim">
          Amber = verified by a human · Grey = analyzer guess · Click a block to
          edit
        </div>
      </div>

      {selectedIdx !== null && chords[selectedIdx] ? (
        <SelectedChordPanel
          chord={chords[selectedIdx]}
          onPatch={(patch) => updateChord(selectedIdx, patch)}
          onDelete={() => deleteChord(selectedIdx)}
          onSplit={() => splitChord(selectedIdx)}
        />
      ) : (
        <div className="border-t border-line-soft bg-bg-raised px-4 py-5 text-center text-sm text-text-muted md:px-6">
          Tap a chord to edit, or use{" "}
          <span className="font-semibold text-text">Add chord</span> to place one
          at the playhead. Saved corrections are global — you&apos;re fixing this
          song for everyone.
        </div>
      )}
    </div>
  );
}

interface PanelProps {
  chord: ChordHit;
  onPatch: (patch: Partial<ChordHit>) => void;
  onDelete: () => void;
  onSplit: () => void;
}

function SelectedChordPanel({ chord, onPatch, onDelete, onSplit }: PanelProps) {
  return (
    <div className="mt-auto border-t border-line-soft bg-bg-raised p-4 md:px-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full text-[10px] uppercase tracking-[0.12em] text-text-dim sm:w-auto sm:self-center">
          Selected chord
        </div>
        <Input
          label="Chord"
          value={chord.chord}
          onChange={(e) => onPatch({ chord: e.target.value })}
          className="w-28 border-accent font-display text-lg font-semibold"
        />
        <Input
          label="Start (s)"
          type="number"
          step="0.01"
          value={chord.time}
          onChange={(e) => onPatch({ time: Number(e.target.value) })}
          className="w-28 font-mono"
        />
        <Input
          label="Duration (s)"
          type="number"
          step="0.01"
          value={chord.duration}
          onChange={(e) => onPatch({ duration: Number(e.target.value) })}
          className="w-32 font-mono"
        />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={onSplit}>
            Split in half
          </Button>
          <Button size="sm" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
        <p className="ml-auto hidden max-w-[260px] text-[11px] leading-relaxed text-text-dim lg:block">
          Saved corrections are global — you&apos;re fixing this song for
          everyone.
        </p>
      </div>
    </div>
  );
}
