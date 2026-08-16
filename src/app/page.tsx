import Link from "next/link";
import { ArrowRight, Brain, Clock3, ListMusic, Music4, Sparkles, Users } from "lucide-react";
import { AppShell } from "@/components/ui/AppNav";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";
import { StudioResumeLink } from "@/components/studio/StudioResumeLink";

export const dynamic = "force-dynamic";

type SongRow = { id: string; title: string; artist: string | null; key: string | null; bpm: number | null };

const ACTIONS = [
  { href: "/studio", label: "Create something", detail: "Build chords, grooves, and a full arrangement.", icon: Music4, tone: "accent" },
  { href: "/library", label: "Practice a song", detail: "Pick up where you left off with a song you know.", icon: Brain, tone: "practice" },
  { href: "/jam", label: "Play together", detail: "Join a room or start a rehearsal with your band.", icon: Users, tone: "jam" },
  { href: "/learn", label: "Learn a skill", detail: "Turn a tricky chord or rhythm into your next win.", icon: Sparkles, tone: "learn" },
] as const;

export default async function TodayPage() {
  let initials = "··";
  let songs: SongRow[] = [];
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      initials = getInitials(user.user_metadata?.display_name ?? user.email);
      const { data } = await supabase.from("songs").select("id,title,artist,key,bpm").eq("uploaded_by", user.id).order("created_at", { ascending: false }).limit(4);
      songs = (data as SongRow[] | null) ?? [];
    }
  }

  return (
    <AppShell initials={initials}>
      <main className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-5 sm:px-6 md:px-8 md:py-8 xl:px-12 xl:py-11">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Today</p>
            <h1 className="mt-1.5 max-w-3xl font-display text-[30px] font-bold leading-[1.06] tracking-[-0.035em] sm:text-4xl md:text-5xl">What do you want to play?</h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-text-muted sm:text-sm md:text-base">Continue your music, start an idea, or get the band together.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-line-soft bg-bg-card px-3.5 py-2 text-xs text-text-muted sm:flex"><Clock3 className="size-3.5 text-accent" /><span>One minute counts.</span></div>
        </header>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-line bg-bg-raised p-4 sm:rounded-3xl sm:p-5 md:p-6">
            <div className="flex items-start gap-3"><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Continue</p><h2 className="mt-1 font-display text-lg font-bold sm:text-xl">Pick up where you left off</h2></div><div className="ml-auto shrink-0"><StudioResumeLink /></div></div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
              <Link href="/studio" className="rounded-xl border border-line-soft bg-bg-card p-3.5 active:bg-bg-higher sm:rounded-2xl sm:p-4"><Music4 className="size-[18px] text-accent" /><p className="mt-3 text-[13px] font-semibold sm:text-sm">Studio</p><p className="mt-1 hidden text-xs text-text-muted sm:block">Turn a chord idea into a playable loop.</p></Link>
              <Link href="/learn" className="rounded-xl border border-line-soft bg-bg-card p-3.5 active:bg-bg-higher sm:rounded-2xl sm:p-4"><Sparkles className="size-[18px] text-blue-300" /><p className="mt-3 text-[13px] font-semibold sm:text-sm">Next skill</p><p className="mt-1 hidden text-xs text-text-muted sm:block">Learn one thing, then use it in a song.</p></Link>
            </div>
          </div>
          <div className="hidden rounded-3xl border border-line bg-bg-card p-5 sm:block md:p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Practice idea</p><h2 className="mt-2 font-display text-xl font-bold">Make the hard part smaller.</h2><p className="mt-2 text-sm leading-relaxed text-text-muted">Loop one transition slower, then bring the full song back.</p><Link href="/learn" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">Open Learn <ArrowRight className="size-4" /></Link></div>
        </section>

        <section className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Quick start</p>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {ACTIONS.map(({ href, label, detail, icon: Icon, tone }) => (
              <Link key={href} href={href} className={`group min-h-[112px] rounded-2xl border p-3.5 active:scale-[0.98] sm:min-h-0 sm:p-4 ${tone === "jam" ? "border-jam/25 bg-jam/[0.06]" : tone === "learn" ? "border-blue-400/20 bg-blue-400/[0.05]" : tone === "practice" ? "border-purple-400/20 bg-purple-400/[0.05]" : "border-accent/25 bg-accent/[0.06]"}`}>
                <Icon className={`size-[19px] ${tone === "jam" ? "text-jam" : tone === "learn" ? "text-blue-300" : tone === "practice" ? "text-purple-300" : "text-accent"}`} />
                <p className="mt-4 text-[13px] font-semibold sm:text-sm">{label}</p><p className="mt-1 hidden text-xs leading-relaxed text-text-muted sm:block">{detail}</p><ArrowRight className="mt-2.5 size-3.5 text-text-dim sm:mt-4" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-7"><div className="flex items-center gap-2.5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Your songs</p><h2 className="mt-1 font-display text-lg font-bold sm:text-xl">Recent music</h2></div><Link href="/library" className="ml-auto text-xs font-semibold text-accent">View all <ArrowRight className="ml-1 inline size-3.5" /></Link></div>
          {songs.length > 0 ? <div className="-mx-4 mt-3 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">{songs.map((song) => <Link key={song.id} href={`/songs/${song.id}`} className="w-[72vw] max-w-[260px] shrink-0 snap-start rounded-2xl border border-line-soft bg-bg-card p-4 sm:w-auto sm:max-w-none"><ListMusic className="size-4 text-text-muted" /><p className="mt-4 truncate text-sm font-semibold">{song.title}</p><p className="mt-1 truncate text-xs text-text-muted">{song.artist ?? "Original"}</p><p className="mt-3 font-mono text-[11px] text-text-dim">{song.key ?? "Key —"}{song.bpm ? ` · ${Math.round(Number(song.bpm))} BPM` : ""}</p></Link>)}</div> : <Link href="/songs/upload" className="mt-3 flex min-h-20 items-center justify-between rounded-2xl border border-dashed border-line bg-bg-card px-4 text-sm text-text-muted"><span>No songs yet</span><span className="font-semibold text-accent">Import one →</span></Link>}
        </section>
      </main>
    </AppShell>
  );
}
