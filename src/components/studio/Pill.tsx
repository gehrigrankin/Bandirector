"use client";

import { cn } from "@/lib/utils/cn";

interface PillProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

/** Touch-friendly (44px) selectable chip used across the studio pickers. */
export function Pill({ active, onClick, children, className }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent text-black"
          : "border-border bg-bg-raised text-text hover:bg-bg-higher",
        className,
      )}
    >
      {children}
    </button>
  );
}
