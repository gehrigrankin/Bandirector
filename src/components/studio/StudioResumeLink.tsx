"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { chordSymbol, extendQuality } from "@/lib/music/chord";
import {
  loadStudioProject,
  type StudioProjectSnapshot,
} from "@/lib/studio/projectStore";

export function StudioResumeLink() {
  const [project, setProject] = useState<StudioProjectSnapshot | null>(null);

  useEffect(() => {
    setProject(loadStudioProject());
  }, []);

  if (!project?.progression.length) {
    return (
      <span className="text-xs text-text-muted">
        Autosaves on this device
      </span>
    );
  }

  const chords = project.progression
    .slice(0, 4)
    .map((step) =>
      chordSymbol(
        step.root,
        extendQuality(
          step.root,
          step.quality,
          project.tonic,
          project.mode,
          step.ext ?? project.chordQuality,
        ),
      ),
    )
    .join(" · ");

  return (
    <Link
      href="/studio"
      className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-xs text-text-muted transition-colors hover:border-accent/40 hover:text-text"
    >
      <span className="shrink-0">Resume</span>
      <span className="max-w-48 truncate font-display font-semibold text-text">
        {chords}
      </span>
      {project.tracks.length > 0 ? (
        <span className="shrink-0 font-mono text-[10px] text-accent">
          {project.tracks.length} {project.tracks.length === 1 ? "layer" : "layers"}
        </span>
      ) : null}
    </Link>
  );
}
