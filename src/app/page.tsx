import Link from "next/link";
import { Music4, Users } from "lucide-react";

export default function HubPage() {
  return (
    <main className="flex min-h-dvh flex-col px-6 py-10 safe-top safe-bottom">
      <header className="w-full max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight">Bandirector</h1>
        <p className="mt-2 text-text-muted">
          A multi-part music app. Write songs, then play them together.
        </p>
      </header>

      <section className="mx-auto grid w-full max-w-lg flex-1 content-center gap-4 py-10">
        <Link
          href="/studio"
          className="group rounded-2xl border border-border bg-bg-raised p-6 transition-colors hover:bg-bg-higher"
        >
          <div className="flex items-start gap-4">
            <span className="rounded-xl bg-accent/15 p-3 text-accent">
              <Music4 className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Songwriter Studio</h2>
              <p className="mt-1 text-sm text-text-muted">
                Pick a chord, choose a playing style, loop it — and lock loops to
                layer a full arrangement with real instrument sounds.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/jam"
          className="group rounded-2xl border border-border bg-bg-raised p-6 transition-colors hover:bg-bg-higher"
        >
          <div className="flex items-start gap-4">
            <span className="rounded-xl bg-accent/15 p-3 text-accent">
              <Users className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Jam Together</h2>
              <p className="mt-1 text-sm text-text-muted">
                Upload a song, analyze its chords, and everyone plays their part
                in a synced room.
              </p>
            </div>
          </div>
        </Link>
      </section>

      <footer className="text-xs text-text-dim">
        Upload-only. No scraping, no YouTube. Your music stays yours.
      </footer>
    </main>
  );
}
