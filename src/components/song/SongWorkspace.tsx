"use client";

import Link from "next/link";
import { ArrowRight, Brain, CheckCircle2, Edit3, Headphones, Play, Users } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Song = Database["public"]["Tables"]["songs"]["Row"];

export function SongWorkspace({ song, audioUrl }: { song: Song; audioUrl: string | null }) {
  const chords = song.analysis_json?.chords ?? [];
  const reviewed = chords.filter((chord) => chord.verified).length;
  const reviewPercent = chords.length ? Math.round((reviewed / chords.length) * 100) : 0;
  const actions = [
    { href: `/songs/${song.id}/coach`, label: "Practice this song", detail: "Play along with the current chord and the next change.", icon: Brain, className: "border-purple-400/25 bg-purple-400/[0.06] text-purple-200" },
    { href: `/jam?song=${song.id}`, label: "Start a Jam", detail: "Bring in players with a shared, synced song stage.", icon: Users, className: "border-jam/25 bg-jam/[0.06] text-jam" },
    { href: `/songs/${song.id}/edit`, label: "Review chords", detail: "Correct uncertain moments and improve the song for future sessions.", icon: Edit3, className: "border-accent/25 bg-accent/[0.06] text-accent" },
  ];

  return <main className="mx-auto min-h-full max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8 xl:px-12 xl:py-10">
    <Link href="/library" className="inline-flex h-9 items-center text-[13px] text-text-muted">← Songs</Link>
    <header className="mt-3 flex flex-wrap items-end justify-between gap-3 sm:mt-5">
      <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Song workspace</p><h1 className="mt-1 truncate font-display text-[30px] font-bold leading-tight tracking-[-0.03em] sm:text-4xl">{song.title}</h1><p className="mt-1.5 truncate text-[13px] text-text-muted sm:text-sm">{song.artist || "Original"} · {song.key ?? "Key unknown"}{song.bpm ? ` · ${Math.round(Number(song.bpm))} BPM` : ""}</p></div>
      <div className="flex items-center gap-2 rounded-full border border-line-soft bg-bg-card px-3 py-1.5 text-[11px] text-text-muted"><CheckCircle2 className="size-3.5 text-ok" /> {song.status === "ready" ? "Ready" : "Needs review"}</div>
    </header>
    {audioUrl ? <div className="mt-5 rounded-2xl border border-line bg-bg-raised p-3.5 sm:p-4"><div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-text-muted"><Headphones className="size-4 text-accent" /> Listen</div><audio controls className="h-10 w-full" src={audioUrl} /></div> : null}
    <section className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3">{actions.map(({ href, label, detail, icon: Icon, className }, index) => <Link key={href} href={href} className={`group rounded-2xl border p-4 active:scale-[0.98] md:p-5 ${index === 0 ? "col-span-2 md:col-span-1" : ""} ${className}`}><div className="flex items-center gap-3"><Icon className="size-5 shrink-0" /><p className="text-[14px] font-semibold sm:text-base">{label}</p><ArrowRight className="ml-auto size-4 opacity-60" /></div><p className={`${index === 0 ? "block" : "hidden sm:block"} mt-2 text-xs leading-relaxed text-text-muted`}>{detail}</p></Link>)}</section>
    <section className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-line bg-bg-card p-4 sm:rounded-3xl sm:p-5 md:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Chord timeline</p><h2 className="mt-1 font-display text-lg font-bold sm:text-xl">{chords.length ? `${chords.length} detected moments` : "No chord timeline yet"}</h2></div><Link href={`/songs/${song.id}/edit`} className="shrink-0 text-xs font-semibold text-accent">Edit →</Link></div>{chords.length ? <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">{chords.slice(0, 16).map((chord, index) => <span key={`${chord.time}-${index}`} className={`shrink-0 rounded-xl border px-3 py-2 font-mono text-sm ${chord.verified ? "border-ok/30 bg-ok/[0.08] text-ok" : "border-line bg-bg-raised text-text-soft"}`}>{chord.chord}</span>)}</div> : <p className="mt-4 text-sm text-text-muted">Analyze the audio to build a timeline you can practice and correct.</p>}</div>
      <div className="rounded-2xl border border-line bg-bg-raised p-4 sm:rounded-3xl sm:p-5 md:p-6"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Chord review</p><span className="font-display text-2xl font-bold">{reviewPercent}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-line-soft"><div className="h-full rounded-full bg-ok transition-all" style={{ width: `${reviewPercent}%` }} /></div><p className="mt-2.5 text-xs leading-relaxed text-text-muted">Review uncertain moments before using this song in a Jam.</p></div>
    </section>
    <div className="mt-5 hidden items-center gap-2 text-xs text-text-dim sm:flex"><Play className="size-3.5" /> Practice, correct, or Jam without losing your place.</div>
  </main>;
}
