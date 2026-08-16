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
      <header className="sticky top-0 z-30 border-b border-line-soft bg-bg/95 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <Link href={`/songs/${song.id}`} className="inline-flex h-9 items-center text-[13px] text-text-muted">← Workspace</Link>
          <div className="ml-auto flex items-center gap-3 text-xs font-semibold"><Link href={`/songs/${song.id}/coach`} className="text-jam">Practice</Link><Link href={`/jam?song=${song.id}`} className="text-jam">Start Jam</Link></div>
        </div>
        <div className="mt-1 min-w-0">
          <div className="truncate text-sm font-semibold">{song.title}</div>
          <div className="truncate text-[11px] text-text-muted">{song.artist} · chord editor</div>
        </div>
      </header>
      <ChordEditor song={song} />
    </main>
  );
}
