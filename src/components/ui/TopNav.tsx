import Link from "next/link";

/**
 * App-wide top navigation. Bandirector is a multi-part music app; this bar
 * links the parts (Studio, Jam) and is reused across the hub, jam, and studio.
 */
export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur safe-top">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Bandirector
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/studio"
            className="rounded-lg px-3 py-2 text-text-muted transition-colors hover:bg-bg-raised hover:text-text"
          >
            Studio
          </Link>
          <Link
            href="/jam"
            className="rounded-lg px-3 py-2 text-text-muted transition-colors hover:bg-bg-raised hover:text-text"
          >
            Jam
          </Link>
        </div>
      </nav>
    </header>
  );
}
