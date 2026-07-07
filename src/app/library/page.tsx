import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Upload, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppNav";
import { CreateRoomButton } from "@/components/room/CreateRoomButton";
import { FavoriteToggle } from "@/components/library/FavoriteToggle";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";

export const dynamic = "force-dynamic";

const GRID =
  "grid-cols-[40px_1fr_120px_100px_130px_90px] items-center gap-3";

function StatusBadge({ status }: { status: string }) {
  const ready = status === "ready";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs"
      style={{ color: ready ? "#58c98b" : "#f5a524" }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: ready ? "#58c98b" : "#f5a524" }}
      />
      {ready ? "Ready" : "Analyzing…"}
    </span>
  );
}

export default async function LibraryPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: songs }, { data: favs }] = await Promise.all([
    supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("favorites").select("song_id").eq("user_id", user.id),
  ]);

  const favSet = new Set((favs ?? []).map((f) => f.song_id));
  const sorted = (songs ?? []).slice().sort((a, b) => {
    const af = favSet.has(a.id) ? 0 : 1;
    const bf = favSet.has(b.id) ? 0 : 1;
    if (af !== bf) return af - bf;
    return a.created_at < b.created_at ? 1 : -1;
  });

  const initials = getInitials(user.user_metadata?.display_name ?? user.email);

  return (
    <AppShell initials={initials}>
      <div className="mx-auto flex min-h-full max-w-5xl flex-col px-5 py-7 md:px-12 md:py-9">
        {/* header */}
        <div className="flex items-center gap-4">
          <h1 className="font-display text-2xl font-bold md:text-[28px]">
            Library
          </h1>
          <div className="hidden h-10 w-80 items-center gap-2 rounded-xl border border-line bg-bg-raised px-3 text-text-dim md:flex">
            <Search className="size-[15px]" strokeWidth={2} />
            <span className="text-[13px]">Search songs or artists…</span>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <Link
              href="/songs/upload"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-[13px] font-semibold text-text-soft transition-colors hover:bg-bg-higher md:px-4"
            >
              <Upload className="size-[15px]" strokeWidth={1.8} />
              <span className="hidden sm:inline">Upload</span>
              <span className="hidden md:inline">&nbsp;song</span>
            </Link>
            <CreateRoomButton />
          </div>
        </div>

        {/* mobile search */}
        <div className="mt-3.5 flex h-[42px] items-center gap-2 rounded-xl border border-line bg-bg-raised px-3 text-text-dim md:hidden">
          <Search className="size-[15px]" strokeWidth={2} />
          <span className="text-[13px]">Search songs or artists…</span>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line-soft bg-bg-card p-10 text-center">
            <p className="text-text-muted">No songs yet.</p>
            <Link href="/songs/upload" className="mt-3 inline-block text-accent">
              Upload your first
            </Link>
          </div>
        ) : (
          <>
            {/* desktop table */}
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-line-soft bg-bg-card md:block">
              <div
                className={`grid ${GRID} border-b border-line-soft px-5 py-3 text-[10px] uppercase tracking-[0.12em] text-text-dim`}
              >
                <span />
                <span>Song</span>
                <span>Key</span>
                <span>BPM</span>
                <span>Status</span>
                <span className="text-right">Edit</span>
              </div>
              {sorted.map((s) => (
                <div
                  key={s.id}
                  className={`grid ${GRID} border-b border-[#17171e] px-5 py-3.5 last:border-0`}
                >
                  <FavoriteToggle songId={s.id} initial={favSet.has(s.id)} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {s.title}
                    </div>
                    <div className="truncate text-xs text-text-muted">
                      {s.artist}
                    </div>
                  </div>
                  <span className="font-mono text-[13px] text-text-soft">
                    {s.key ?? "—"}
                  </span>
                  <span className="font-mono text-[13px] text-text-soft">
                    {s.bpm ? Math.round(Number(s.bpm)) : "—"}
                  </span>
                  <StatusBadge status={s.status} />
                  <Link
                    href={`/songs/${s.id}/edit`}
                    aria-label="Edit chords"
                    className="flex justify-end text-text-muted hover:text-text"
                  >
                    <Pencil className="size-[15px]" strokeWidth={1.8} />
                  </Link>
                </div>
              ))}
            </div>

            {/* mobile list */}
            <div className="mt-4 flex flex-col gap-2 md:hidden">
              {sorted.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-2xl border border-line-soft bg-bg-card px-3.5 py-3.5"
                >
                  <FavoriteToggle songId={s.id} initial={favSet.has(s.id)} />
                  <Link
                    href={`/songs/${s.id}/edit`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {s.title}
                      </div>
                      <div className="truncate text-[11.5px] text-text-muted">
                        {s.artist}
                        {s.key || s.bpm ? (
                          <>
                            {" · "}
                            <span className="font-mono">
                              {(s.key ?? "—") +
                                (s.bpm ? " · " + Math.round(Number(s.bpm)) : "")}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <StatusBadge status={s.status} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="mt-3.5 text-xs text-text-dim md:mt-4">
          Favorites float to the top. Fixing a song&apos;s chords fixes it for
          everyone.
        </p>
      </div>
    </AppShell>
  );
}
