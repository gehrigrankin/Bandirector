"use client";

import { useState } from "react";
import { INSTRUMENTS, stylesFor } from "@/lib/instruments";
import { cn } from "@/lib/utils/cn";

interface Props {
  instrument: string;
  style: string;
  onChange: (instrument: string, style: string) => void;
}

export function InstrumentSwitcher({ instrument, style, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const activeStyles = stylesFor(instrument);
  const activeLabel =
    INSTRUMENTS.find((i) => i.value === instrument)?.label ?? instrument;
  const styleLabel =
    activeStyles.find((s) => s.value === style)?.label ?? style;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl border border-border bg-bg-raised px-3 py-2 text-right text-sm hover:bg-bg-higher"
      >
        <div className="text-text">{activeLabel}</div>
        <div className="text-xs text-text-muted">{styleLabel}</div>
      </button>
      {open ? (
        <div
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-border bg-bg-raised p-3 shadow-xl"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="mb-2 text-xs uppercase tracking-wider text-text-dim">
            Instrument
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {INSTRUMENTS.map((i) => (
              <button
                key={i.value}
                type="button"
                onClick={() => {
                  const nextStyles = stylesFor(i.value);
                  onChange(i.value, nextStyles[0]?.value ?? "default");
                }}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-left text-xs",
                  i.value === instrument
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-bg hover:bg-bg-higher",
                )}
              >
                {i.label}
              </button>
            ))}
          </div>
          {activeStyles.length > 1 ? (
            <>
              <div className="mb-2 mt-3 text-xs uppercase tracking-wider text-text-dim">
                Style
              </div>
              <div className="flex flex-col gap-1.5">
                {activeStyles.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onChange(instrument, s.value)}
                    className={cn(
                      "rounded-lg border px-2 py-1.5 text-left text-xs",
                      s.value === style
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-bg hover:bg-bg-higher",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
