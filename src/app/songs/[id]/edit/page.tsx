import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChordEditor } from "@/components/editor/ChordEditor";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function EditPage({
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
    <main className="flex min-h-dvh flex-col bg-bg safe-top safe-bottom">
      <header className="flex items-center gap-4 border-b border-line-soft px-4 py-3 md:px-6">
        <Link
          href={`/songs/${song.id}`}
          className="text-sm text-text-muted hover:text-text"
        >
          ← Song workspace
        </Link>
        <div className="hidden h-6 w-px bg-line-soft sm:block" />
          <div>
          <div className="text-sm font-semibold">{song.title}</div>
          <div className="text-[11px] text-text-muted">
            {song.artist} · chord editor
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs font-semibold"><Link href={`/songs/${song.id}/coach`} className="text-jam hover:text-jam-soft">Practice</Link><Link href={`/jam?song=${song.id}`} className="text-jam hover:text-jam-soft">Start Jam</Link></div>
        </div>
      </header>
      <ChordEditor song={song} />
    </main>
  );
}
