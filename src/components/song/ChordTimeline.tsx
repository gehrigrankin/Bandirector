"use client";

import { useEffect, useMemo, useRef } from "react";
import type { AnalysisJson } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

interface Props {
  analysis: AnalysisJson | null;
  positionMs: number;
  compact?: boolean;
  onSeek?: (positionMs: number) => void;
  showPlayhead?: boolean;
}

const PX_PER_SECOND = 60;

export function ChordTimeline({
  analysis,
  positionMs,
  compact,
  onSeek,
  showPlayhead = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSec = useMemo(() => {
    if (!analysis?.chords?.length) return 0;
    const last = analysis.chords[analysis.chords.length - 1];
    return last.time + last.duration;
  }, [analysis]);

  const positionSec = positionMs / 1000;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !showPlayhead) return;
    const target = positionSec * PX_PER_SECOND - el.clientWidth * 0.3;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, [positionSec, showPlayhead]);

  if (!analysis?.chords?.length) {
    return (
      <div
        className={cn(
          "px-4 py-3 text-center text-xs text-text-dim",
          compact ? "" : "py-10",
        )}
      >
        No chord timeline yet.
      </div>
    );
  }

  const height = compact ? 48 : 96;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onSeek) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left + el.scrollLeft;
    const sec = x / PX_PER_SECOND;
    onSeek(Math.max(0, sec * 1000));
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={cn(
        "relative overflow-x-auto overflow-y-hidden",
        onSeek ? "cursor-pointer" : "",
      )}
      style={{ height }}
    >
      <div
        className="relative"
        style={{
          width: Math.max(totalSec * PX_PER_SECOND, 800),
          height,
        }}
      >
        {analysis.chords.map((c, i) => (
          <div
            key={i}
            className={cn(
              "absolute top-2 flex items-center justify-center rounded-md border text-center text-sm font-semibold",
              c.verified
                ? "border-accent bg-accent/20 text-accent"
                : "border-border bg-bg text-text",
            )}
            style={{
              left: c.time * PX_PER_SECOND,
              width: Math.max(c.duration * PX_PER_SECOND - 2, 8),
              height: height - 16,
            }}
          >
            {c.chord}
          </div>
        ))}

        {analysis.beats?.slice(0, 2000).map((b, i) => (
          <div
            key={`b${i}`}
            className="absolute top-0 w-px bg-border/60"
            style={{
              left: b.time * PX_PER_SECOND,
              height: 6,
            }}
          />
        ))}

        {showPlayhead ? (
          <div
            className="absolute top-0 z-10 w-0.5 bg-accent"
            style={{
              left: positionSec * PX_PER_SECOND,
              height,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
