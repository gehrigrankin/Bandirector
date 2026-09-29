import type { SectionKind } from "@/lib/song/model";

/** What the inspector is looking at. */
export type Selection =
  | { kind: "song" }
  | { kind: "section"; sectionId: string }
  | { kind: "track"; trackId: string }
  | { kind: "clip"; trackId: string; sectionId: string };

/** Section colours by kind — the arrangement's visual vocabulary. */
export const SECTION_COLORS: Record<SectionKind, { fill: string; text: string }> = {
  intro: { fill: "#7c8db5", text: "#0b1020" },
  verse: { fill: "#3fd9c5", text: "#06201d" },
  prechorus: { fill: "#e8843a", text: "#1f0e02" },
  chorus: { fill: "#f5a524", text: "#1a1200" },
  bridge: { fill: "#a78bfa", text: "#170f2e" },
  solo: { fill: "#f0655a", text: "#2a0b08" },
  breakdown: { fill: "#e879a8", text: "#2a0a1a" },
  outro: { fill: "#8c8c9a", text: "#121218" },
  other: { fill: "#c9c9d4", text: "#121218" },
};

export const LABEL = "text-[10px] font-semibold uppercase tracking-[0.12em] text-text-dim";
