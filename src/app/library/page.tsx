import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/AppNav";
import { SongsLibrary, type LibrarySong } from "@/components/library/SongsLibrary";
import { JamUnavailable } from "@/components/JamUnavailable";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?returnTo=/library");

  const [{ data: songs }, { data: favs }] = await Promise.all([
    supabase.from("songs").select("id,title,artist,key,bpm,status,created_at").eq("uploaded_by", user.id).order("created_at", { ascending: false }).limit(200),
    supabase.from("favorites").select("song_id").eq("user_id", user.id),
  ]);
  const initials = getInitials(user.user_metadata?.display_name ?? user.email);
  const rows = ((songs ?? []) as LibrarySong[]).sort((a, b) => a.created_at < b.created_at ? 1 : -1);

  return <AppShell initials={initials}><main className="mx-auto min-h-full max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8 xl:px-12 xl:py-10"><header><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Your music</p><h1 className="mt-1 font-display text-[30px] font-bold tracking-[-0.03em] sm:text-4xl">Songs</h1><p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-text-muted sm:text-sm">Practice, fix, or bring any song into a Jam.</p></header><div className="mt-5 md:mt-7"><SongsLibrary songs={rows} favoriteIds={(favs ?? []).map((fav) => fav.song_id)} /></div></main></AppShell>;
}
