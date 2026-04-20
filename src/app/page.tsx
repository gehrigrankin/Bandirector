import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { JoinRoomForm } from "@/components/room/JoinRoomForm";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-6 py-10 safe-top safe-bottom">
      <header className="w-full max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight">Bandirector</h1>
        <p className="mt-2 text-text-muted">
          Upload a song. Everyone plays their part.
        </p>
      </header>

      <section className="w-full max-w-lg space-y-8 py-10">
        <div className="rounded-2xl border border-border bg-bg-raised p-6">
          <h2 className="text-xl font-semibold">Join a jam</h2>
          <p className="mt-1 text-sm text-text-muted">
            Enter the 6-letter room code from your host.
          </p>
          <div className="mt-4">
            <JoinRoomForm />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-bg-raised p-6">
          <h2 className="text-xl font-semibold">Host a jam</h2>
          <p className="mt-1 text-sm text-text-muted">
            Sign in to upload songs and start a room.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/signup" className="flex-1">
              <Button className="w-full" size="lg">
                Create account
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button className="w-full" size="lg" variant="secondary">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-xs text-text-dim">
        Upload-only. No scraping, no YouTube. Your jams stay yours.
      </footer>
    </main>
  );
}
