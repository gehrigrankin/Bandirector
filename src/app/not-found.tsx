import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6 text-center text-text">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">404 · Off the setlist</p>
        <h1 className="mt-3 font-display text-3xl font-bold">That page isn’t here.</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">The song, room, or lesson may have moved or been closed.</p>
        <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-black">Back to Today</Link>
      </div>
    </main>
  );
}
