"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface MenuItem {
  id: string;
  label: string;
  hint?: string;
  swatch?: string;
}

interface Props {
  trigger: ReactNode;
  items: MenuItem[];
  onPick: (id: string) => void;
  className?: string;
  align?: "left" | "right";
  title?: string;
}

/** A small click-to-open list. Closes on outside click or Escape. */
export function Menu({ trigger, items, onPick, className, align = "left", title }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="contents"
      >
        {trigger}
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute z-40 mt-1 min-w-44 overflow-hidden rounded-xl border border-line bg-bg-higher py-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {title ? (
            <div className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-dim">
              {title}
            </div>
          ) : null}
          <div className="max-h-72 overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onPick(item.id);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-text hover:bg-bg-raised"
              >
                {item.swatch ? (
                  <span
                    className="size-2.5 shrink-0 rounded-[3px]"
                    style={{ background: item.swatch }}
                  />
                ) : null}
                <span className="flex-1">{item.label}</span>
                {item.hint ? (
                  <span className="text-[11px] text-text-dim">{item.hint}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
