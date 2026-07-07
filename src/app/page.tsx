import Link from "next/link";
import { Music4, Users, ArrowRight, ListMusic } from "lucide-react";
import { AppShell } from "@/components/ui/AppNav";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";

export const dynamic = "force-dynamic";

type SongRow = {
  id: string;
  title: string;
  artist: string | null;
  key: string | null;
  bpm: number | null;
};

export default async function HubPage() {
  let initials = "··";
  let songs: SongRow[] = [];

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      initials = getInitials(user.user_metadata?.display_name ?? user.email);
      const { data } = await supabase
        .from("songs")
        .select("id,title,artist,key,bpm")
        .order("created_at", { ascending: false })
        .limit(3);
      songs = (data as SongRow[] | null) ?? [];
    }
  }

  return (
    <AppShell initials={initials}>
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-8 md:px-14 md:py-16">
        <header>
          <div className="flex items-center gap-2.5 md:hidden">
            <span className="flex size-8 items-center justify-center rounded-[9px] bg-accent font-display text-base font-bold text-black">
              B
            </span>
            <span className="font-display text-[22px] font-bold tracking-tight">
              Bandirector
            </span>
          </div>
          <h1 className="hidden font-display text-[44px] font-bold leading-[1.05] tracking-[-0.02em] md:block">
            Bandirector
          </h1>
          <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-text-muted md:text-base">
            A multi-part music app. Write songs in the Studio, then play them
            together in a Jam.
          </p>
        </header>

        {/* section cards */}
        <div className="mt-8 grid gap-4 md:mt-11 md:grid-cols-2 md:gap-5">
          {/* Studio */}
          <div className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(160deg,#15120b_0%,#121218_55%)] p-6 md:p-8">
            <div className="pointer-events-none absolute -right-14 -top-14 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(245,165,36,0.18),transparent_70%)]" />
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Music4 className="size-[22px]" strokeWidth={1.8} />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold md:text-[26px]">
              Songwriter Studio
            </h2>
            <p className="mt-2 max-w-[420px] text-sm leading-relaxed text-text-muted">
              Pick a chord, choose a playing style, loop it — lock loops to layer
              a full arrangement with real instrument sounds.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
              <Link
                href="/studio"
                className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-black transition-colors hover:bg-accent-soft"
              >
                Open Studio
                <ArrowRight className="size-[15px]" strokeWidth={2} />
              </Link>
              <span className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-xs text-text-muted">
                Continue{" "}
                <span className="font-display font-semibold text-text">
                  Untitled loop
                </span>
                <span className="font-mono text-[11px] text-accent">
                  C·G·Am·F
                </span>
              </span>
            </div>
          </div>

          {/* Jam */}
          <div className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(160deg,#0b1514_0%,#121218_55%)] p-6 md:p-8">
            <div className="pointer-events-none absolute -right-14 -top-14 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(63,217,197,0.15),transparent_70%)]" />
            <span className="flex size-11 items-center justify-center rounded-xl bg-jam/[0.12] text-jam">
              <Users className="size-[22px]" strokeWidth={1.8} />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold md:text-[26px]">
              Jam Together
            </h2>
            <p className="mt-2 max-w-[420px] text-sm leading-relaxed text-text-muted">
              Upload a song, analyze its chords, and everyone plays their part in
              a synced room.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
              <Link
                href="/jam"
                className="inline-flex h-[46px] items-center rounded-xl bg-jam px-5 text-sm font-semibold text-black transition-colors hover:bg-jam-soft"
              >
                Join a jam
              </Link>
              <Link
                href="/jam"
                className="text-sm font-medium text-jam hover:text-jam-soft"
              >
                Host a jam →
              </Link>
            </div>
          </div>
        </div>

        {/* library preview */}
        <section className="mt-9">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim">
              Your library
            </h3>
            <Link
              href="/library"
              className="ml-auto text-xs text-accent hover:text-accent-soft"
            >
              View all →
            </Link>
          </div>
          {songs.length > 0 ? (
            <div className="mt-3 grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
              {songs.map((s) => (
                <Link
                  key={s.id}
                  href={`/songs/${s.id}/edit`}
                  className="flex items-center gap-3 rounded-2xl border border-line-soft bg-bg-card px-4 py-3.5 transition-colors hover:bg-bg-raised"
                >
                  <span className="flex size-9 items-center justify-center rounded-[9px] bg-bg-higher text-text-muted">
                    <ListMusic className="size-4" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {s.title}
                    </div>
                    <div className="truncate text-[11px] text-text-muted">
                      {s.artist ?? "—"}
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-[11px] text-text-dim">
                    {(s.key ?? "—") +
                      (s.bpm ? " · " + Math.round(Number(s.bpm)) : "")}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-line-soft bg-bg-card px-4 py-6 text-sm text-text-muted">
              No songs yet.{" "}
              <Link href="/songs/upload" className="text-accent">
                Upload your first →
              </Link>
            </div>
          )}
        </section>

        <footer className="mt-auto pt-9 text-xs text-text-dim">
          Upload-only. No scraping, no YouTube. Your music stays yours.
        </footer>
      </div>
    </AppShell>
  );
}
