"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Music4,
  Users,
  ListMusic,
  Settings,
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
  { href: "/", label: "Today", icon: Home, accent: "accent" },
  { href: "/studio", label: "Create", icon: Music4, accent: "accent" },
  {
    href: "/jam",
    label: "Jam",
    icon: Users,
    accent: "jam",
    match: ["/jam", "/room"],
  },
  {
    href: "/library",
    label: "Songs",
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

/**
 * Desktop nav — slim 64px icon rail on medium screens, expands to a labeled
 * sidebar at lg and up.
 */
export function AppRail({ initials = "··" }: { initials?: string }) {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="hidden w-48 flex-shrink-0 flex-col items-stretch gap-1.5 border-r border-line-soft px-3 py-3.5 xl:flex">
      <Link
        href="/"
        aria-label="Bandirector home"
        className="mb-3 flex items-center justify-start gap-2.5 px-1"
      >
        <span className="flex size-[34px] flex-shrink-0 items-center justify-center rounded-[10px] bg-accent font-display text-lg font-bold text-black">
          B
        </span>
        <span className="font-display text-[15px] font-bold text-text">
          Bandirector
        </span>
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
              "flex h-10 w-full items-center justify-start gap-3 rounded-[10px] px-3 transition-colors",
              active
                ? ACTIVE_TILE[item.accent]
                : "text-text-dim hover:bg-bg-raised hover:text-text-soft",
            )}
          >
            <Icon className="size-5 flex-shrink-0" strokeWidth={1.8} />
            <span className="text-sm font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
      <div className="flex-1" />
      <Link
        href="/settings"
        aria-label="Account settings"
        className="flex items-center justify-start gap-2.5 rounded-[10px] px-1 py-1.5 hover:bg-bg-raised"
      >
        <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-bg-higher text-[11px] font-semibold text-text-soft">
          {initials}
        </span>
        <span className="text-xs text-text-muted">Account</span>
      </Link>
    </nav>
  );
}

function currentSection(pathname: string) {
  if (pathname === "/settings") return "Settings";
  return NAV.find((item) => isActive(item, pathname))?.label ?? "Bandirector";
}

/** Compact app identity and account access for phones and tablets. */
export function MobileAppHeader() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="sticky top-0 z-30 flex min-h-[52px] items-end border-b border-line-soft bg-bg/90 px-4 pb-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))] backdrop-blur-xl xl:hidden">
      <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Bandirector home">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-accent font-display text-base font-bold text-black shadow-glow-accent">B</span>
        <span className="truncate font-display text-[15px] font-semibold">{currentSection(pathname)}</span>
      </Link>
      <Link href="/settings" aria-label="Settings" className="ml-auto flex size-9 items-center justify-center rounded-full text-text-muted active:bg-bg-higher active:text-text">
        <Settings className="size-[19px]" strokeWidth={1.8} />
      </Link>
    </header>
  );
}

/** Thumb-reachable navigation for phones and tablets. */
export function MobileTabBar() {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(4.25rem+env(safe-area-inset-bottom))] items-stretch border-t border-line-soft bg-[#0d0d11]/95 px-1.5 pb-[env(safe-area-inset-bottom)] shadow-[0_-16px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl md:inset-x-1/2 md:bottom-4 md:h-[68px] md:w-[min(560px,calc(100%_-_2rem))] md:-translate-x-1/2 md:rounded-2xl md:border md:px-2 md:pb-0 xl:hidden">
      {NAV.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl active:bg-bg-higher",
              active ? ACTIVE_TEXT[item.accent] : "text-text-dim",
            )}
          >
            <Icon className="size-[21px]" strokeWidth={active ? 2.2 : 1.8} />
            <span
              className={cn(
                "max-w-full truncate text-[10px] leading-none",
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
        <MobileAppHeader />
        <div className={cn("min-h-0 flex-1 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-28 xl:pb-0", className)}>{children}</div>
        <MobileTabBar />
      </div>
    </div>
  );
}
