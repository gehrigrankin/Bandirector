"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database";
import { deriveSections } from "@/lib/analysis/sections";
import { chordAtTimeMs } from "@/lib/analysis/timeline";
import { STRUM_PATTERNS } from "@/lib/music/patterns";
import { GuitarDiagram } from "@/components/music/GuitarDiagram";
import { formatTime } from "@/lib/utils/time";
import { cn } from "@/lib/utils/cn";

type Song = Database["public"]["Tables"]["songs"]["Row"];

const SPEEDS = [
  { value: 0.7, label: "70%" },
  { value: 0.85, label: "85%" },
  { value: 1, label: "Full speed" },
];

export function SongCoach({ song }: { song: Song }) {
  const supabase = useMemo(() => createClient(), []);
  const audioRef = useRef<HTMLAudioElement>(null);

  const bpm = song.bpm ? Math.round(Number(song.bpm)) : null;
  const feel = (song.feel ?? song.analysis_json?.feel ?? "rock") as
    | keyof typeof STRUM_PATTERNS;
  const strum = STRUM_PATTERNS[feel] ?? STRUM_PATTERNS.rock;

  const sections = useMemo(
    () => deriveSections(song.analysis_json, song.bpm),
    [song.analysis_json, song.bpm],
  );
  const distinctChords = useMemo(() => {
    const set = new Set((song.analysis_json?.chords ?? []).map((c) => c.chord));
    return set.size;
  }, [song.analysis_json]);

  const [selectedId, setSelectedId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [positionSec, setPositionSec] = useState(0);

  const section = sections[selectedId] ?? sections[0] ?? null;

  // load the audio
  useEffect(() => {
    const bucket = process.env.NEXT_PUBLIC_SONGS_BUCKET ?? "songs";
    if (audioRef.current && song.audio_storage_path) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(song.audio_storage_path);
      audioRef.current.src = data.publicUrl;
    }
  }, [song.audio_storage_path, supabase]);

  // playback rate follows the speed toggle
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  // clock + loop the selected section
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setPositionSec(audio.currentTime);
      if (section && audio.currentTime >= section.endSec) {
        audio.currentTime = section.startSec;
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [section]);

  function pickSection(id: number) {
    setSelectedId(id);
    const s = sections[id];
    if (s && audioRef.current) audioRef.current.currentTime = s.startSec;
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (section && audio.currentTime < section.startSec)
        audio.currentTime = section.startSec;
      audio.playbackRate = speed;
      audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }

  const currentChord = chordAtTimeMs(
    song.analysis_json,
    positionSec * 1000,
  ).current?.chord;
  const lessonChords = section?.chords ?? [];

  const railLabel =
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim";

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-bg text-text">
      <audio ref={audioRef} preload="auto" playsInline />

      {/* header */}
      <header className="flex flex-shrink-0 flex-wrap items-center gap-3 border-b border-line-soft px-4 py-3 md:px-6 md:py-0 md:h-[60px]">
        <Link
          href={`/songs/${song.id}/edit`}
          aria-label="Back"
          className="text-text-dim hover:text-text md:hidden"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
            How to play
          </div>
          <div className="font-display text-base font-semibold">
            {song.title}
            {song.artist ? (
              <span className="text-text-muted"> — {song.artist}</span>
            ) : null}
          </div>
        </div>
        <span className="font-mono text-xs text-text-muted">
          {(song.key ?? "?") + (bpm ? ` · ${bpm} BPM` : "")} · 4/4
        </span>
        <span className="rounded-full border border-jam/20 bg-jam/[0.06] px-3 py-1 text-[11px] text-jam">
          Beginner-friendly · {distinctChords} chords
        </span>
      </header>

      {/* ── desktop ── */}
      <div className="hidden min-h-0 flex-1 md:flex">
        {/* song map */}
        <aside className="scrollbar-thin flex w-72 shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-line-soft p-3.5">
          <div className={`${railLabel} px-2 pb-1.5`}>Song map</div>
          {sections.map((s) => {
            const active = s.id === selectedId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pickSection(s.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  active
                    ? "border-jam/60 bg-jam/[0.07]"
                    : "border-line-soft hover:bg-bg-raised",
                )}
              >
                <span className="font-mono text-[10px] text-text-dim">
                  {formatTime(s.startSec * 1000)}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[13px] font-semibold",
                      active ? "text-jam" : "text-text-soft",
                    )}
                  >
                    {s.name}
                  </span>
                  <span className="block truncate text-[10.5px] text-text-dim">
                    {s.chords.join(" · ")} — {s.bars} bars
                  </span>
                </span>
              </button>
            );
          })}
          <p className="mt-auto px-2 pt-2 text-[11px] leading-relaxed text-text-dim">
            Sections come from the same analysis the Jam room uses. Pick a part to
            loop it.
          </p>
        </aside>

        {/* lesson */}
        <div className="scrollbar-thin flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto p-6 md:p-8">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-[26px] font-bold">
              {section?.name ?? "—"}
            </h2>
            <span className="text-[13px] text-text-muted">
              {lessonChords.length} chords · strum: {strum.label}
            </span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {lessonChords.map((chord, i) => {
              const active = chord === currentChord;
              return (
                <div
                  key={`${chord}-${i}`}
                  className={cn(
                    "flex flex-col items-center rounded-2xl border p-4",
                    active
                      ? "border-jam bg-jam/[0.07]"
                      : "border-line bg-bg-card",
                  )}
                >
                  <div
                    className={cn(
                      "font-display text-[34px] font-semibold",
                      active ? "text-jam" : "text-text",
                    )}
                  >
                    {chord}
                  </div>
                  <div
                    className={cn(
                      "mt-1.5",
                      active ? "text-jam" : "text-text-muted",
                    )}
                  >
                    <GuitarDiagram chord={chord} size={96} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* strum guide */}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line-soft bg-bg-card px-4 py-3.5">
            <div className="w-14 text-[10px] uppercase leading-tight tracking-[0.12em] text-text-dim">
              Strum guide
            </div>
            <div className="flex gap-1.5">
              {strum.strokes.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-10 w-9 items-center justify-center rounded-[7px] border text-[15px] font-semibold",
                    i === 0
                      ? "border-jam bg-jam/15 text-jam"
                      : "border-line bg-[#15151c]",
                    s === "-" && "opacity-40",
                  )}
                >
                  {s === "D" ? "↓" : s === "U" ? "↑" : "·"}
                </div>
              ))}
            </div>
            <p className="max-w-[420px] text-xs leading-relaxed text-text-muted">
              Keep your wrist loose and let the up-strums glance the top strings.
              Practice the trickiest change on its own first.
            </p>
          </div>

          {/* play-along */}
          <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-line-soft pt-4">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play along"}
              className="flex size-[46px] items-center justify-center rounded-full bg-jam text-black shadow-glow-jam"
            >
              {playing ? (
                <Pause className="size-[17px]" fill="currentColor" />
              ) : (
                <Play className="size-[17px]" fill="currentColor" />
              )}
            </button>
            <div>
              <div className="text-[13px] font-semibold">
                Play along — loop this section
              </div>
              <div className="text-[11.5px] text-text-muted">
                Real backing from the analysis · loops until you pick another part
              </div>
            </div>
            <div className="ml-auto flex overflow-hidden rounded-full border border-line">
              {SPEEDS.map((sp) => (
                <button
                  key={sp.value}
                  type="button"
                  onClick={() => setSpeed(sp.value)}
                  className={cn(
                    "px-3.5 py-1.5 text-[11px]",
                    speed === sp.value
                      ? "bg-jam/15 font-semibold text-jam"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── mobile ── */}
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <div className="flex gap-1.5 overflow-x-auto px-5 pt-3">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pickSection(s.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-[11px]",
                s.id === selectedId
                  ? "border-jam/60 bg-jam/[0.08] font-semibold text-jam"
                  : "border-line-soft text-text-muted",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3.5 px-5">
          <div className="text-[10px] uppercase tracking-[0.14em] text-text-dim">
            Now
          </div>
          <div className="font-display text-[88px] font-semibold leading-none text-jam">
            {currentChord ?? lessonChords[0] ?? "—"}
          </div>
          <div className="text-jam">
            <GuitarDiagram chord={currentChord ?? lessonChords[0] ?? "C"} size={120} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.14em] text-text-dim">
              Then
            </span>
            {lessonChords.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="rounded-[9px] border border-line px-3 py-1 font-display text-base font-semibold text-text-soft"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3 border-t border-line-soft bg-[#0d0d11]/95 px-5 py-3.5 safe-bottom">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play along"}
            className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-jam text-black"
          >
            {playing ? (
              <Pause className="size-5" fill="currentColor" />
            ) : (
              <Play className="size-5" fill="currentColor" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold">Loop this section</div>
            <div className="truncate text-[10.5px] text-text-muted">
              {section ? `${section.chords.join(" · ")}` : ""}
            </div>
          </div>
          <div className="flex shrink-0 overflow-hidden rounded-full border border-line">
            {SPEEDS.filter((s) => s.value !== 0.85).map((sp) => (
              <button
                key={sp.value}
                type="button"
                onClick={() => setSpeed(sp.value)}
                className={cn(
                  "px-3 py-1.5 text-[10px]",
                  speed === sp.value
                    ? "bg-jam/15 font-semibold text-jam"
                    : "text-text-muted",
                )}
              >
                {sp.value === 1 ? "Full" : sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
