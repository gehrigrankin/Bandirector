"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/studio", label: "Studio" },
  { href: "/jam", label: "Jam" },
];

export function TopNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="flex items-center justify-between border-b border-border px-4 py-3 safe-top">
      <Link href="/" className="text-lg font-bold tracking-tight">
        Bandirector
      </Link>
      <div className="flex items-center gap-1">
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
