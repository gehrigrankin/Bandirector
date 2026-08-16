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
      <main className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-7 md:px-12 md:py-11">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Your music desk</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.03em] md:text-5xl">What are you making today?</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">One place to write an idea, learn the missing piece, practice a song, and bring people in.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-line-soft bg-bg-card px-3.5 py-2 text-xs text-text-muted md:flex"><Clock3 className="size-3.5 text-accent" /><span>Practice streak starts with one minute.</span></div>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map(({ href, label, detail, icon: Icon, tone }) => (
            <Link key={href} href={href} className={`group rounded-2xl border p-4 transition-transform hover:-translate-y-0.5 ${tone === "jam" ? "border-jam/25 bg-jam/[0.06]" : tone === "learn" ? "border-blue-400/20 bg-blue-400/[0.05]" : tone === "practice" ? "border-purple-400/20 bg-purple-400/[0.05]" : "border-accent/25 bg-accent/[0.06]"}`}>
              <Icon className={`size-5 ${tone === "jam" ? "text-jam" : tone === "learn" ? "text-blue-300" : tone === "practice" ? "text-purple-300" : "text-accent"}`} />
              <p className="mt-5 text-sm font-semibold">{label}</p><p className="mt-1.5 text-xs leading-relaxed text-text-muted">{detail}</p><ArrowRight className="mt-4 size-4 text-text-dim transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl border border-line bg-bg-raised p-5 md:p-6">
            <div className="flex items-center gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Continue</p><h2 className="mt-1 font-display text-xl font-bold">Pick up where you left off</h2></div><div className="ml-auto"><StudioResumeLink /></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link href="/studio" className="rounded-2xl border border-line-soft bg-bg-card p-4 transition-colors hover:bg-bg-higher"><Music4 className="size-5 text-accent" /><p className="mt-4 text-sm font-semibold">Songwriter Studio</p><p className="mt-1 text-xs text-text-muted">Turn a chord idea into a playable loop.</p></Link>
              <Link href="/learn" className="rounded-2xl border border-line-soft bg-bg-card p-4 transition-colors hover:bg-bg-higher"><Sparkles className="size-5 text-blue-300" /><p className="mt-4 text-sm font-semibold">Your next small win</p><p className="mt-1 text-xs text-text-muted">Learn one skill, then use it in a song.</p></Link>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-bg-card p-5 md:p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Practice idea</p><h2 className="mt-2 font-display text-xl font-bold">Make the hard part smaller.</h2><p className="mt-2 text-sm leading-relaxed text-text-muted">Loop one transition at a slower tempo, then bring the full song back in when it feels easy.</p><Link href="/learn" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">Open Learn <ArrowRight className="size-4" /></Link></div>
        </section>

        <section className="mt-9"><div className="flex items-center gap-2.5"><div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Your songs</p><h2 className="mt-1 font-display text-xl font-bold">Recent music</h2></div><Link href="/library" className="ml-auto text-xs font-semibold text-accent hover:text-accent-soft">View all <ArrowRight className="ml-1 inline size-3.5" /></Link></div>
          {songs.length > 0 ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{songs.map((song) => <Link key={song.id} href={`/songs/${song.id}`} className="rounded-2xl border border-line-soft bg-bg-card p-4 transition-colors hover:bg-bg-raised"><ListMusic className="size-4 text-text-muted" /><p className="mt-4 truncate text-sm font-semibold">{song.title}</p><p className="mt-1 truncate text-xs text-text-muted">{song.artist ?? "Original"}</p><p className="mt-3 font-mono text-[11px] text-text-dim">{song.key ?? "Key —"}{song.bpm ? ` · ${Math.round(Number(song.bpm))} BPM` : ""}</p></Link>)}</div> : <div className="mt-4 rounded-2xl border border-dashed border-line bg-bg-card p-6 text-sm text-text-muted">No songs yet. <Link href="/songs/upload" className="font-semibold text-accent">Import your first song →</Link></div>}
        </section>
      </main>
    </AppShell>
  );
}
