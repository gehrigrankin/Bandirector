"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GraduationCap, Pencil, Search, SlidersHorizontal, Upload } from "lucide-react";
import { FavoriteToggle } from "@/components/library/FavoriteToggle";
import { CreateRoomButton } from "@/components/room/CreateRoomButton";
import type { SongStatus } from "@/lib/types/database";

export type LibrarySong = {
  id: string;
  title: string;
  artist: string;
  key: string | null;
  bpm: number | null;
  status: SongStatus;
  created_at: string;
};

function StatusBadge({ status }: { status: SongStatus }) {
  const config = {
    ready: ["Ready", "text-ok", "bg-ok"],
    analyzing: ["Reviewing", "text-accent", "bg-accent"],
    pending: ["Queued", "text-text-muted", "bg-text-muted"],
    failed: ["Needs attention", "text-danger", "bg-danger"],
  }[status];
  return <span className={`inline-flex items-center gap-1.5 text-xs ${config[1]}`}><span className={`size-1.5 rounded-full ${config[2]}`} />{config[0]}</span>;
}

export function SongsLibrary({ songs, favoriteIds }: { songs: LibrarySong[]; favoriteIds: string[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "attention">("all");
  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const visible = useMemo(() => songs.filter((song) => {
    const matchesQuery = `${song.title} ${song.artist}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "favorites" ? favorites.has(song.id) : song.status === "failed" || song.status === "analyzing");
    return matchesQuery && matchesFilter;
  }), [songs, query, filter, favorites]);

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-bg-raised px-3 text-text-muted focus-within:border-accent">
          <Search className="size-4" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search songs or artists…" className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-dim" />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal className="size-4 shrink-0 text-text-dim" />
          {(["all", "favorites", "attention"] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`h-9 shrink-0 rounded-lg px-3 text-xs font-semibold capitalize ${filter === value ? "bg-accent/15 text-accent" : "text-text-muted hover:bg-bg-raised"}`}>{value === "attention" ? "Needs attention" : value}</button>)}
        </div>
        <div className="flex gap-2 md:ml-auto"><Link href="/songs/upload" className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-xs font-semibold hover:bg-bg-higher"><Upload className="size-4" />Upload</Link><CreateRoomButton /></div>
      </div>

      {visible.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-line bg-bg-card p-10 text-center"><p className="text-sm text-text-muted">{songs.length === 0 ? "Your song shelf is empty." : "No songs match that search."}</p><Link href="/songs/upload" className="mt-3 inline-block text-sm font-semibold text-accent">Import a song</Link></div> : <>
        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-line-soft bg-bg-card md:block">
          <div className="grid grid-cols-[40px_1fr_120px_100px_130px_120px] gap-3 border-b border-line-soft px-5 py-3 text-[10px] uppercase tracking-[0.12em] text-text-dim"><span /><span>Song</span><span>Key</span><span>BPM</span><span>Status</span><span className="text-right">Actions</span></div>
          {visible.map((song) => <div key={song.id} className="grid grid-cols-[40px_1fr_120px_100px_130px_120px] items-center gap-3 border-b border-[#17171e] px-5 py-3.5 last:border-0"><FavoriteToggle songId={song.id} initial={favorites.has(song.id)} /><Link href={`/songs/${song.id}`} className="min-w-0"><div className="truncate text-sm font-semibold">{song.title}</div><div className="truncate text-xs text-text-muted">{song.artist || "Original"}</div></Link><span className="font-mono text-[13px] text-text-soft">{song.key ?? "—"}</span><span className="font-mono text-[13px] text-text-soft">{song.bpm ? Math.round(Number(song.bpm)) : "—"}</span><StatusBadge status={song.status} /><div className="flex justify-end gap-3"><Link href={`/songs/${song.id}/coach`} aria-label="Practice song" className="text-text-muted hover:text-jam"><GraduationCap className="size-4" /></Link><Link href={`/songs/${song.id}/edit`} aria-label="Edit chords" className="text-text-muted hover:text-text"><Pencil className="size-4" /></Link></div></div>)}
        </div>
        <div className="mt-4 flex flex-col gap-2 md:hidden">{visible.map((song) => <div key={song.id} className="flex items-center gap-3 rounded-2xl border border-line-soft bg-bg-card px-3.5 py-3.5"><FavoriteToggle songId={song.id} initial={favorites.has(song.id)} /><Link href={`/songs/${song.id}`} className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{song.title}</div><div className="truncate text-[11.5px] text-text-muted">{song.artist || "Original"}{song.key || song.bpm ? ` · ${song.key ?? "—"}${song.bpm ? ` · ${Math.round(Number(song.bpm))}` : ""}` : ""}</div></Link><StatusBadge status={song.status} /><Link href={`/songs/${song.id}/coach`} aria-label="Practice song" className="text-text-muted"><GraduationCap className="size-[18px]" /></Link></div>)}</div>
      </>}
      <p className="mt-4 text-xs text-text-dim">Songs are your starting point. Open one to practice, edit, or bring it into a Jam.</p>
    </>
  );
}
