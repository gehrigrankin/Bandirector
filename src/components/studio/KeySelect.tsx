"use client";

import { ChevronDown } from "lucide-react";
import type { Mode } from "@/lib/music/chord";
import { ROOTS } from "@/lib/song/model";

interface Props {
  tonic: string;
  mode: Mode;
  onChange: (tonic: string, mode: Mode) => void;
}

/** Compact key picker — a dropdown, not thirteen pills. */
export function KeySelect({ tonic, mode, onChange }: Props) {
  return (
    <label className="relative inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-text-soft">
      <span className="text-text-muted">Key</span>
      <span className="font-display font-semibold text-text">
        {tonic} {mode === "major" ? "Major" : "Minor"}
      </span>
      <ChevronDown className="size-3 text-text-dim" strokeWidth={2} />
      <select
        aria-label="Key"
        value={`${tonic}|${mode}`}
        onChange={(e) => {
          const [t, m] = e.target.value.split("|");
          onChange(t, m as Mode);
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {(["major", "minor"] as Mode[]).map((m) =>
          ROOTS.map((r) => (
            <option key={`${r}|${m}`} value={`${r}|${m}`}>
              {r} {m === "major" ? "Major" : "Minor"}
            </option>
          )),
        )}
      </select>
    </label>
  );
}
