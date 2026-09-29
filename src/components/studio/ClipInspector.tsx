"use client";

// One instrument inside one section: whether it plays there, and with which
// groove — the track's default (shared by every section) or one made just for
// this section.

import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getInstrument } from "@/lib/audio/instruments";
import type { Pattern } from "@/lib/audio/patterns";
import { clipOf, patternFor, type Section, type Track } from "@/lib/song/model";
import { PatternEditor } from "@/components/studio/PatternEditor";
import { LABEL, SECTION_COLORS } from "@/components/studio/shared";

interface Props {
  track: Track;
  section: Section;
  playStep: number | null;
  onOn: (on: boolean) => void;
  onCustom: (custom: boolean) => void;
  onPattern: (pattern: Pattern) => void;
}

export function ClipInspector({ track, section, playStep, onOn, onCustom, onPattern }: Props) {
  const def = getInstrument(track.instrumentId);
  const clip = clipOf(track, section.id);
  const custom = !!clip.pattern;
  const color = SECTION_COLORS[section.kind];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0">
          <div className={LABEL}>Instrument in section</div>
          <div className="mt-0.5 flex items-center gap-2 font-display text-[15px] font-bold">
            {def.label}
            <span className="text-text-dim">in</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-[3px]" style={{ background: color.fill }} />
              {section.name}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOn(!clip.on)}
          aria-pressed={clip.on}
          className={cn(
            "ml-auto inline-flex h-10 items-center gap-2 rounded-full px-4 text-[12.5px] font-semibold",
            clip.on
              ? "bg-accent text-black"
              : "border border-line text-text-muted hover:bg-bg-raised hover:text-text",
          )}
        >
          {clip.on ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          {clip.on ? `Playing in ${section.name}` : `Sitting out ${section.name}`}
        </button>
      </div>

      {clip.on ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-text-muted">Groove</span>
            <div className="flex overflow-hidden rounded-full border border-line">
              <button
                type="button"
                onClick={() => onCustom(false)}
                aria-pressed={!custom}
                className={cn("h-9 px-3 text-[11px] font-semibold", !custom ? "bg-accent text-black" : "text-text-muted hover:text-text")}
              >
                Same as every section
              </button>
              <button
                type="button"
                onClick={() => onCustom(true)}
                aria-pressed={custom}
                className={cn("h-9 px-3 text-[11px] font-semibold", custom ? "bg-accent text-black" : "text-text-muted hover:text-text")}
              >
                Just for {section.name}
              </button>
            </div>
            <span className="text-[11px] text-text-dim">
              {custom
                ? "Edits below only change this section."
                : "Edits below change the track everywhere it plays."}
            </span>
          </div>
          <PatternEditor
            instrumentId={track.instrumentId}
            pattern={patternFor(track, section.id)}
            playStep={playStep}
            onChange={onPattern}
          />
        </>
      ) : (
        <p className="text-[12px] text-text-muted">
          {def.label} stays silent for the {section.bars} bars of {section.name}. Turn it back
          on to hear it here again.
        </p>
      )}
    </div>
  );
}
