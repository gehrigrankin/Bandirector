"use client";

import { ChevronDown } from "lucide-react";
import type { Mode } from "@/lib/music/chord";
import { ROOTS } from "@/components/studio/types";

interface Props {
  tonic: string;
  mode: Mode;
  onTonic: (t: string) => void;
  onMode: (m: Mode) => void;
}

/** Compact key picker — a dropdown, not thirteen pills. */
export function KeySelect({ tonic, mode, onTonic, onMode }: Props) {
  return (
    <label className="relative inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-text-soft">
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
          onTonic(t);
          onMode(m as Mode);
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
