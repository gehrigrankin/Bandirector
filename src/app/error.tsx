"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6 text-center text-text">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-danger">Playback interrupted</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Something went out of tune.</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">Try the page again, or return to your music.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={reset} className="h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-black">Try again</button>
          <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-semibold">Today</Link>
        </div>
      </div>
    </main>
  );
}
