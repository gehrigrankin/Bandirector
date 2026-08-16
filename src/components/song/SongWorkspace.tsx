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

  return <main className="mx-auto min-h-full max-w-6xl px-5 py-7 md:px-12 md:py-10">
    <Link href="/library" className="text-sm text-text-muted hover:text-text">← Songs</Link>
    <header className="mt-7 flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Song workspace</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.03em]">{song.title}</h1><p className="mt-2 text-sm text-text-muted">{song.artist || "Original"} · {song.key ?? "Key unknown"}{song.bpm ? ` · ${Math.round(Number(song.bpm))} BPM` : ""}</p></div>
      <div className="flex items-center gap-2 rounded-full border border-line-soft bg-bg-card px-3 py-2 text-xs text-text-muted"><CheckCircle2 className="size-3.5 text-ok" /> {song.status === "ready" ? "Ready to work" : "Analysis needs review"}</div>
    </header>
    {audioUrl ? <div className="mt-7 rounded-2xl border border-line bg-bg-raised p-4"><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-text-muted"><Headphones className="size-4 text-accent" /> Listen before you work</div><audio controls className="h-10 w-full" src={audioUrl} /></div> : null}
    <section className="mt-7 grid gap-3 md:grid-cols-3">{actions.map(({ href, label, detail, icon: Icon, className }) => <Link key={href} href={href} className={`group rounded-2xl border p-5 transition-transform hover:-translate-y-0.5 ${className}`}><Icon className="size-5" /><p className="mt-6 text-base font-semibold">{label}</p><p className="mt-2 text-xs leading-relaxed text-text-muted">{detail}</p><ArrowRight className="mt-6 size-4 opacity-60 transition-transform group-hover:translate-x-1" /></Link>)}</section>
    <section className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-line bg-bg-card p-5 md:p-6"><div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Chord timeline</p><h2 className="mt-1 font-display text-xl font-bold">{chords.length ? `${chords.length} detected moments` : "No chord timeline yet"}</h2></div><Link href={`/songs/${song.id}/edit`} className="text-xs font-semibold text-accent">Open editor →</Link></div>{chords.length ? <div className="mt-5 flex flex-wrap gap-2">{chords.slice(0, 16).map((chord, index) => <span key={`${chord.time}-${index}`} className={`rounded-xl border px-3 py-2 font-mono text-sm ${chord.verified ? "border-ok/30 bg-ok/[0.08] text-ok" : "border-line bg-bg-raised text-text-soft"}`}>{chord.chord}</span>)}</div> : <p className="mt-4 text-sm text-text-muted">Upload or analyze the audio to build a timeline you can practice and correct.</p>}</div>
      <div className="rounded-3xl border border-line bg-bg-raised p-5 md:p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Analysis confidence</p><div className="mt-3 flex items-end justify-between"><span className="font-display text-4xl font-bold">{reviewPercent}%</span><span className="text-xs text-text-muted">manually reviewed</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-line-soft"><div className="h-full rounded-full bg-ok transition-all" style={{ width: `${reviewPercent}%` }} /></div><p className="mt-3 text-xs leading-relaxed text-text-muted">Bandirector should show its uncertainty. Review the moments that feel wrong before using this song in a Jam.</p></div>
    </section>
    <div className="mt-7 flex items-center gap-2 text-xs text-text-dim"><Play className="size-3.5" /> Your next step can be practice, correction, or a Jam—this workspace keeps the context.</div>
  </main>;
}
