"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import type { SequenceVisual } from "@/lib/learning/visuals/types";
import { noteToMidi } from "@/lib/learning/notes";
import {
  ensureLessonAudio,
  playSteps,
  type PlayableStep,
} from "@/lib/learning/lessonAudio";
import { cn } from "@/lib/utils/cn";

export function SequencePlayer({
  spec,
  accent,
}: {
  spec: SequenceVisual;
  accent: string;
}) {
  const [active, setActive] = useState(-1);
  const cancelRef = useRef<(() => void) | null>(null);
  const playing = active >= 0;

  useEffect(() => () => cancelRef.current?.(), []);

  async function toggle() {
    if (playing) {
      cancelRef.current?.();
      cancelRef.current = null;
      return;
    }
    await ensureLessonAudio(spec.instrument);
    const steps: PlayableStep[] = spec.steps.map((s) => ({
      midis: s.notes
        .map(noteToMidi)
        .filter((n): n is number => n !== null),
      beats: s.beats ?? 1,
    }));
    cancelRef.current = playSteps(
      spec.instrument,
      steps,
      spec.bpm ?? 90,
      setActive,
    );
  }

  return (
    <div className="flex w-full flex-col gap-2.5 rounded-xl border border-line-soft bg-black/20 p-3">
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggle}
          aria-label={playing ? "Stop" : `Play ${spec.label}`}
          className="flex size-8 flex-shrink-0 items-center justify-center rounded-full text-black transition-transform active:scale-95"
          style={{ background: accent }}
        >
          {playing ? (
            <Square className="size-3.5 fill-current" />
          ) : (
            <Play className="size-4 fill-current pl-0.5" />
          )}
        </button>
        <span className="text-[12px] font-semibold text-text-soft">
          {spec.label}
        </span>
        <span className="ml-auto font-mono text-[10px] text-text-dim">
          {spec.bpm ?? 90} bpm
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {spec.steps.map((step, i) => (
          <span
            key={i}
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[11px] transition-colors",
              active === i
                ? "border-transparent text-black"
                : "border-line-soft text-text-muted",
            )}
            style={active === i ? { background: accent } : undefined}
          >
            {step.label ?? step.notes.join(" ")}
          </span>
        ))}
      </div>
    </div>
  );
}
