import Link from "next/link";
import { TopNav } from "@/components/ui/TopNav";
import { Button } from "@/components/ui/Button";

/** Shown on jam/auth routes when this deployment has no Supabase configured. */
export function JamUnavailable() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 safe-bottom">
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-raised p-6 text-center">
          <h1 className="text-2xl font-bold">Jam isn’t set up here</h1>
          <p className="mt-2 text-sm text-text-muted">
            This deployment doesn’t have Supabase configured, so the jam features
            — accounts, uploads, and synced rooms — are unavailable. The
            Songwriter Studio works with no setup at all.
          </p>
          <Link href="/studio" className="mt-5 block">
            <Button size="lg" className="w-full">
              Open the Studio
            </Button>
          </Link>
          <Link
            href="/"
            className="mt-3 inline-block text-sm text-text-muted hover:text-text"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
