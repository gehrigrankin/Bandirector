import Link from "next/link";
import { redirect } from "next/navigation";
import { Music4, ListMusic } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppNav";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";

export const dynamic = "force-dynamic";

type Skill = {
  name: string;
  level: string;
  pct: number;
  next: string;
  hint: string;
  filled: boolean;
};

const SKILLS: Skill[] = [
  {
    name: "Guitar",
    level: "Intermediate",
    pct: 68,
    next: "F barre chord",
    hint: "unlocks 14 songs in your library",
    filled: true,
  },
  {
    name: "Piano",
    level: "Beginner",
    pct: 34,
    next: "Shell voicings",
    hint: "pairs with the Studio's comp engine",
    filled: false,
  },
  {
    name: "Music theory",
    level: "Intermediate",
    pct: 45,
    next: "Secondary dominants",
    hint: "you keep using V/vi in loops",
    filled: false,
  },
];

const WEEK = [
  { d: "M", h: 34 },
  { d: "T", h: 58 },
  { d: "W", h: 22 },
  { d: "T", h: 74 },
  { d: "F", h: 46 },
  { d: "S", h: 88, active: true },
  { d: "S", h: 12 },
];

const UP_NEXT = [
  { badge: "F", title: "F barre chord", sub: "10 min drill · guitar" },
  { badge: "ii", title: "ii–V–I in three keys", sub: "theory · from your jazz loops" },
];

export default async function LearnPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: songs } = await supabase
    .from("songs")
    .select("id,title")
    .order("created_at", { ascending: false })
    .limit(3);
  const learned = (songs ?? []) as { id: string; title: string }[];
  const initials = getInitials(user.user_metadata?.display_name ?? user.email);

  return (
    <AppShell initials={initials}>
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-7 md:px-11 md:py-9">
        {/* header */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold md:text-[28px]">Learn</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/[0.08] px-3 py-1 text-xs text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            12-day streak
          </span>
          <span className="ml-auto hidden text-xs text-text-muted md:block">
            Progress updates automatically from Coach sessions and Jams.
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row">
          {/* skills + songs */}
          <div className="grid flex-1 gap-3.5 sm:grid-cols-2">
            {SKILLS.map((s) => (
              <div
                key={s.name}
                className="flex flex-col rounded-2xl border border-line bg-bg-raised p-5"
              >
                <div className="flex items-baseline gap-2.5">
                  <div className="font-display text-lg font-semibold">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-text-muted">{s.level}</div>
                  <div
                    className={
                      "ml-auto font-mono text-[13px] " +
                      (s.filled ? "text-accent" : "text-text-muted")
                    }
                  >
                    {s.pct}%
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line-soft">
                  <div
                    className={
                      "h-full rounded-full " +
                      (s.filled ? "bg-accent" : "bg-[#6e6e7a]")
                    }
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <div className="mt-3 text-xs text-text-muted">
                  Next:{" "}
                  <span className="font-medium text-text">{s.next}</span> ·{" "}
                  {s.hint}
                </div>
                {s.filled ? (
                  <Link
                    href="/library"
                    className="mt-auto inline-flex h-9 items-center self-start rounded-[10px] bg-accent px-4 pt-[1px] text-xs font-semibold text-black"
                  >
                    Continue
                  </Link>
                ) : null}
              </div>
            ))}

            {/* songs learned */}
            <div className="flex flex-col rounded-2xl border border-line bg-bg-raised p-5">
              <div className="flex items-baseline gap-2.5">
                <div className="font-display text-lg font-semibold">
                  Songs learned
                </div>
                <div className="ml-auto font-mono text-[13px] text-accent">
                  {learned.length}
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {learned.length === 0 ? (
                  <Link href="/library" className="text-xs text-accent">
                    Add songs from your library →
                  </Link>
                ) : (
                  learned.map((song, i) => (
                    <Link
                      key={song.id}
                      href={`/songs/${song.id}/coach`}
                      className="flex items-center gap-2 text-xs hover:text-accent"
                    >
                      <span
                        className="size-[5px] rounded-full"
                        style={{ background: i === 2 ? "#f5a524" : "#58c98b" }}
                      />
                      <span className="font-medium">{song.title}</span>
                      <span className="text-text-dim">
                        {i === 0
                          ? "· chorus mastered this week"
                          : i === 2
                            ? "· in progress"
                            : "· full song"}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div className="flex w-full flex-col gap-3.5 lg:w-[300px] lg:shrink-0">
            <div className="rounded-2xl border border-line bg-bg-raised p-[18px]">
              <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                Up next for you
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {UP_NEXT.map((u) => (
                  <div key={u.title} className="flex items-center gap-2.5">
                    <div className="flex size-[30px] items-center justify-center rounded-lg bg-accent/[0.12] font-display text-[13px] font-bold text-accent">
                      {u.badge}
                    </div>
                    <div>
                      <div className="text-[12.5px] font-semibold">
                        {u.title}
                      </div>
                      <div className="text-[10.5px] text-text-muted">
                        {u.sub}
                      </div>
                    </div>
                  </div>
                ))}
                {learned[0] ? (
                  <Link
                    href={`/songs/${learned[0].id}/coach`}
                    className="flex items-center gap-2.5"
                  >
                    <div className="flex size-[30px] items-center justify-center rounded-lg bg-bg-higher text-text-muted">
                      <Music4 className="size-3.5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-semibold">
                        {learned[0].title} — coach
                      </div>
                      <div className="text-[10.5px] text-text-muted">
                        song coach · play-along
                      </div>
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-2xl border border-line bg-bg-raised p-[18px]">
              <div className="text-[10px] uppercase tracking-[0.12em] text-text-dim">
                This week
              </div>
              <div className="mt-3.5 flex flex-1 items-end gap-2">
                {WEEK.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-full rounded-[5px]"
                      style={{
                        height: b.h,
                        background: b.active ? "#f5a524" : "#2a2a33",
                      }}
                    />
                    <span
                      className="text-[9px]"
                      style={{ color: b.active ? "#f5a524" : "#5e5e6b" }}
                    >
                      {b.d}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-text-dim">
                2h 40m practiced · best day Saturday
              </div>
            </div>

            <Link
              href="/library"
              className="flex items-center justify-center gap-2 rounded-2xl border border-line-soft bg-bg-card py-3 text-[13px] font-medium text-text-muted hover:text-text"
            >
              <ListMusic className="size-4" strokeWidth={1.8} />
              Pick a song to learn
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
