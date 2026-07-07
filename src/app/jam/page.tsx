import Link from "next/link";
import { JoinRoomForm } from "@/components/room/JoinRoomForm";
import { AppShell } from "@/components/ui/AppNav";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function JamPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  return (
    <AppShell>
      <div className="relative flex min-h-full flex-col items-center justify-center px-5 py-12 md:px-10">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[600px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(63,217,197,0.10),transparent_70%)]" />

        <div className="text-center">
          <h1 className="font-display text-[32px] font-bold tracking-[-0.02em] md:text-[38px]">
            Jam Together
          </h1>
          <p className="mt-2 text-sm text-text-muted md:text-[15px]">
            Upload a song. Everyone plays their part.
          </p>
        </div>

        <div className="mt-8 grid w-full max-w-[940px] gap-5 md:mt-10 md:grid-cols-2">
          <div className="rounded-[20px] border border-line bg-bg-raised p-6 md:p-7">
            <h2 className="font-display text-xl font-semibold">Join a jam</h2>
            <p className="mt-1.5 text-[13px] text-text-muted">
              Enter the 6-letter room code from your host.
            </p>
            <div className="mt-5">
              <JoinRoomForm />
            </div>
          </div>

          <div className="flex flex-col rounded-[20px] border border-line bg-bg-raised p-6 md:p-7">
            <h2 className="font-display text-xl font-semibold">Host a jam</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
              Sign in to upload songs, pick what the band plays, and drive the
              transport for everyone.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-text-muted">
              <li className="flex items-center gap-2.5">
                <span className="size-[5px] rounded-full bg-jam" />
                Chords, tempo &amp; key analyzed in your browser
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-[5px] rounded-full bg-jam" />
                Synced lyrics found automatically
              </li>
            </ul>
            <div className="mt-auto flex gap-2.5 pt-5">
              <Link
                href="/signup"
                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-jam text-sm font-semibold text-black transition-colors hover:bg-jam-soft"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-line text-sm font-semibold text-text transition-colors hover:bg-bg-higher"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-9 text-xs text-text-dim">
          Upload-only. No scraping, no YouTube. Your jams stay yours.
        </p>
      </div>
    </AppShell>
  );
}
