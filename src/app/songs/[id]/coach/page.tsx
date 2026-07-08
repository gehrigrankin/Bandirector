import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppRail } from "@/components/ui/AppNav";
import { SongCoach } from "@/components/coach/SongCoach";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function CoachPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  const supabase = createClient();
  const { data: song } = await supabase
    .from("songs")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!song) notFound();

  return (
    <div className="flex h-dvh overflow-hidden bg-bg text-text">
      <AppRail />
      <SongCoach song={song} />
    </div>
  );
}
