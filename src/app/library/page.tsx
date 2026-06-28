import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateRoomButton } from "@/components/room/CreateRoomButton";
import { FavoriteToggle } from "@/components/library/FavoriteToggle";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

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

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 py-8 safe-top safe-bottom">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-xs text-text-dim">
            ← Home
          </Link>
          <h1 className="mt-1 text-2xl font-bold">Library</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/songs/upload">
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-raised px-3 py-2 text-sm hover:bg-bg-higher">
              <Upload className="size-4" />
              Upload
            </span>
          </Link>
          <CreateRoomButton />
        </div>
      </header>

      <section className="mt-6 flex-1">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-border bg-bg-raised p-10 text-center">
            <p className="text-text-muted">No songs yet.</p>
            <Link href="/songs/upload" className="mt-3 inline-block text-accent">
              Upload your first
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-bg-raised">
            {sorted.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 px-3 py-3"
              >
                <FavoriteToggle songId={s.id} initial={favSet.has(s.id)} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="text-xs text-text-muted">
                    {s.artist}
                    {s.key ? ` · ${s.key}` : ""}
                    {s.bpm ? ` · ${Math.round(Number(s.bpm))} BPM` : ""}
                    {s.status !== "ready" ? (
                      <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase">
                        {s.status}
                      </span>
                    ) : null}
                  </div>
                </div>
                <Link
                  href={`/songs/${s.id}/edit`}
                  aria-label="Edit chords"
                  className="rounded-lg p-2 text-text-muted hover:bg-bg-higher"
                >
                  <Pencil className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
