import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChordEditor } from "@/components/editor/ChordEditor";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: song } = await supabase
    .from("songs")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!song) notFound();

  return (
    <main className="flex min-h-dvh flex-col safe-top safe-bottom">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <Link href="/library" className="text-sm text-text-muted">
          ← Library
        </Link>
        <div className="text-right">
          <div className="text-sm font-semibold">{song.title}</div>
          <div className="text-xs text-text-muted">{song.artist}</div>
        </div>
      </header>
      <ChordEditor song={song} />
    </main>
  );
}
