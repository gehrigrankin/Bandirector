"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

export function MobileStudioSheet({
  title,
  description,
  onClose,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center xl:hidden">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[82dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-b-0 border-line bg-bg shadow-[0_-24px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line" />
        <header className="flex items-start gap-3 border-b border-line-soft px-5 pb-4 pt-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-relaxed text-text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bg-raised text-text-muted active:bg-bg-higher active:text-text"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5">
          {children}
        </div>
      </section>
    </div>
  );
}
