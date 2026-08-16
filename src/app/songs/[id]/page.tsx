import { notFound } from "next/navigation";
import { AppShell } from "@/components/ui/AppNav";
import { SongWorkspace } from "@/components/song/SongWorkspace";
import { JamUnavailable } from "@/components/JamUnavailable";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";

export const dynamic = "force-dynamic";

export default async function SongWorkspacePage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  const supabase = createClient();
  const [{ data: song }, { data: { user } }] = await Promise.all([
    supabase.from("songs").select("*").eq("id", params.id).maybeSingle(),
    supabase.auth.getUser(),
  ]);
  if (!song) notFound();
  const bucket = process.env.NEXT_PUBLIC_SONGS_BUCKET ?? "songs";
  const audioUrl = song.audio_storage_path ? supabase.storage.from(bucket).getPublicUrl(song.audio_storage_path).data.publicUrl : null;
  return <AppShell initials={getInitials(user?.user_metadata?.display_name ?? user?.email)}><SongWorkspace song={song} audioUrl={audioUrl} /></AppShell>;
}
