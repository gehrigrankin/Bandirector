"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/", label: "Today" },
  { href: "/studio", label: "Studio" },
  { href: "/jam", label: "Jam" },
  { href: "/library", label: "Songs" },
  { href: "/learn", label: "Learn" },
];

export function TopNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="flex items-end justify-between border-b border-line px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <Link href="/" className="flex items-center gap-2.5 font-display text-[15px] font-bold tracking-tight">
        <span className="flex size-8 items-center justify-center rounded-[10px] bg-accent text-base text-black">B</span>
        Bandirector
      </Link>
      <Link href="/studio" className="inline-flex h-9 items-center rounded-xl border border-line px-3 text-xs font-semibold text-accent xl:hidden">Open Studio</Link>
      <div className="hidden items-center gap-1 xl:flex">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-bg-raised text-text"
                : "text-text-muted hover:text-text",
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
