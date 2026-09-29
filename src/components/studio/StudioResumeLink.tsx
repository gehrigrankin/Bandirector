"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { totalBars, type Song } from "@/lib/song/model";
import { loadSong } from "@/lib/song/store";

export function StudioResumeLink() {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    setSong(loadSong());
  }, []);

  if (!song) {
    return (
      <span className="text-xs text-text-muted">
        Autosaves on this device
      </span>
    );
  }

  const parts = song.tracks.length;
  return (
    <Link
      href="/studio"
      className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-xs text-text-muted transition-colors hover:border-accent/40 hover:text-text"
    >
      <span className="shrink-0">Resume</span>
      <span className="max-w-48 truncate font-display font-semibold text-text">
        {song.title || "Untitled song"}
      </span>
      <span className="shrink-0 font-mono text-[10px] text-accent">
        {song.sections.length} {song.sections.length === 1 ? "section" : "sections"} · {totalBars(song)} bars
        {parts > 0 ? ` · ${parts} ${parts === 1 ? "part" : "parts"}` : ""}
      </span>
    </Link>
  );
}
