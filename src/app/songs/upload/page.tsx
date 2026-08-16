import Link from "next/link";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
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
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 py-5 safe-top safe-bottom sm:px-6 md:py-10">
      <div className="flex items-center gap-3">
        <Link href="/library" className="text-sm text-text-muted hover:text-text">
          ← Library
        </Link>
        <Link
          href="/library"
          aria-label="Close"
          className="ml-auto flex size-[30px] items-center justify-center rounded-full border border-line text-text-muted hover:text-text"
        >
          <X className="size-[13px]" strokeWidth={2} />
        </Link>
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">Add to your songs</p>
      <h1 className="mt-1.5 font-display text-[28px] font-bold leading-tight tracking-[-0.03em] sm:text-[32px]">Bring in a song.</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-text-muted">We&apos;ll create a starting chord timeline in your browser, then let you review uncertain moments before you practice or Jam.</p>

      <div className="mt-5 sm:mt-6">
        <UploadForm userId={user.id} />
      </div>
    </main>
  );
}
