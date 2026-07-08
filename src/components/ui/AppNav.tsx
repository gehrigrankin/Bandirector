"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Music4,
  Users,
  ListMusic,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Accent = "accent" | "jam";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  accent: Accent;
  /** additional path prefixes that should mark this item active */
  match?: string[];
}

const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: Home, accent: "accent" },
  { href: "/studio", label: "Studio", icon: Music4, accent: "accent" },
  {
    href: "/jam",
    label: "Jam",
    icon: Users,
    accent: "jam",
    match: ["/jam", "/room"],
  },
  {
    href: "/library",
    label: "Library",
    icon: ListMusic,
    accent: "accent",
    match: ["/library", "/songs"],
  },
  { href: "/learn", label: "Learn", icon: Target, accent: "accent" },
];

function isActive(item: NavItem, pathname: string) {
  const prefixes = item.match ?? [item.href];
  if (item.href === "/") return pathname === "/";
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

const ACTIVE_TILE: Record<Accent, string> = {
  accent: "bg-accent/10 text-accent",
  jam: "bg-jam/10 text-jam",
};

const ACTIVE_TEXT: Record<Accent, string> = {
  accent: "text-accent",
  jam: "text-jam",
};

/** Slim 64px icon rail — desktop only. */
export function AppRail({ initials = "GR" }: { initials?: string }) {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="hidden w-16 flex-shrink-0 flex-col items-center gap-1.5 border-r border-line-soft py-3.5 md:flex">
      <Link
        href="/"
        aria-label="Bandirector home"
        className="mb-3 flex size-[34px] items-center justify-center rounded-[10px] bg-accent font-display text-lg font-bold text-black"
      >
        B
      </Link>
      {NAV.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex size-10 items-center justify-center rounded-[10px] transition-colors",
              active
                ? ACTIVE_TILE[item.accent]
                : "text-text-dim hover:bg-bg-raised hover:text-text-soft",
            )}
          >
            <Icon className="size-5" strokeWidth={1.8} />
          </Link>
        );
      })}
      <div className="flex-1" />
      <div className="flex size-8 items-center justify-center rounded-full bg-bg-higher text-[11px] font-semibold text-text-soft">
        {initials}
      </div>
    </nav>
  );
}

/** Bottom tab bar — mobile only. */
export function MobileTabBar() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="flex h-[72px] flex-shrink-0 items-stretch border-t border-line-soft bg-[#0d0d11]/95 px-2.5 safe-bottom md:hidden">
      {NAV.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-[3px]",
              active ? ACTIVE_TEXT[item.accent] : "text-text-dim",
            )}
          >
            <Icon className="size-5" strokeWidth={1.8} />
            <span
              className={cn(
                "text-[10px]",
                active ? "font-semibold" : "font-medium",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Standard app shell: desktop icon rail on the left, mobile tab bar pinned to
 * the bottom. `children` is the scrollable main content column.
 */
export function AppShell({
  children,
  initials,
  className,
}: {
  children: React.ReactNode;
  initials?: string;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh bg-bg text-text">
      <AppRail initials={initials} />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <div className={cn("min-h-0 flex-1", className)}>{children}</div>
        <MobileTabBar />
      </div>
    </div>
  );
}
