import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UploadForm } from "@/components/upload/UploadForm";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6 py-10 safe-top safe-bottom">
      <Link href="/library" className="text-sm text-text-muted">
        ← Library
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Upload a song</h1>
      <p className="mt-1 text-text-muted">
        MP3 only. Analysis runs in your browser — you can fill in the details while it works.
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-bg-raised p-6">
        <UploadForm userId={user.id} />
      </div>
    </main>
  );
}
