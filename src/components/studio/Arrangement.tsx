"use client";

// The arrangement grid: sections across the top (Intro · Verse 1 · Chorus 1 …),
// a chord lane under them, then one row per instrument. Each track × section
// cell is a clip — filled when the instrument plays there, dashed when it sits
// out — and its width is the section's length in bars, so you can see who
// plays where and for how long at a glance.

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type DragEvent } from "react";
import { Plus, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getInstrument, INSTRUMENTS, type InstrumentId } from "@/lib/audio/instruments";
import { patternSummary, type Pattern } from "@/lib/audio/patterns";
import { chordSymbol } from "@/lib/music/chord";
import {
  barSeconds,
  chordAt,
  clipOf,
  formatDuration,
  patternFor,
  SECTION_KINDS,
  totalBars,
  type ChordStep,
  type Section,
  type SectionKind,
  type Song,
  type Track,
} from "@/lib/song/model";
import { Menu } from "@/components/studio/Menu";
import { LABEL, SECTION_COLORS, type Selection } from "@/components/studio/shared";

const HEADER_W = 176;
const SECTION_H = 46;
const CHORD_H = 26;
const ROW_H = 58;
const TAIL_W = 150; // room for "+ Add section"
const MIN_BAR_W = 10;
const MAX_BAR_W = 80;

export interface PlayheadPosition {
  songBar: number;
  phase: number;
  sectionId: string;
}

interface Props {
  song: Song;
  selection: Selection;
  isPlaying: boolean;
  getPlayhead: () => PlayheadPosition | null;
  onSelect: (s: Selection) => void;
  onClipOn: (trackId: string, sectionId: string, on: boolean) => void;
  onAddSection: (kind: SectionKind) => void;
  onAddTrack: (id: InstrumentId) => void;
  onMute: (trackId: string, muted: boolean) => void;
  onSolo: (trackId: string, solo: boolean) => void;
  /** Drop a section into slot `toIndex` (counted with the section lifted out). */
  onReorderSection: (sectionId: string, toIndex: number) => void;
}

const DRAG_TYPE = "application/x-bandirector-section";

// ─── Pattern glyph ───────────────────────────────────────────────────────────

const COMP_RH_STEPS: Record<string, number[]> = {
  block: [0, 4, 8, 12],
  comp: [0, 6, 12],
  charleston: [0, 6],
  neosoul: [0, 6, 12, 14],
  broken: [0, 2, 4, 6, 8, 10, 12, 14],
  arpeggio: [0, 2, 4, 6, 8, 10, 12, 14],
};

/** Per-step intensity (0–1) of a one-bar pattern, folded down to `cols`. */
function glyphLevels(p: Pattern, cols: number): number[] {
  const raw = new Array<number>(16).fill(0);
  if (p.kind === "melodic") {
    p.hits.forEach((h, i) => (raw[i] = h ? 1 : 0));
  } else if (p.kind === "drums") {
    const rows = Object.values(p.rows);
    for (let i = 0; i < 16; i++) raw[i] = Math.min(1, rows.filter((r) => r[i]).length / 3);
  } else {
    for (const s of COMP_RH_STEPS[p.rightHand] ?? []) raw[s] = p.rightHand === "broken" || p.rightHand === "arpeggio" ? 0.6 : 1;
    for (const s of [0, 8]) raw[s] = Math.max(raw[s], 0.7);
  }
  const per = 16 / cols;
  return Array.from({ length: cols }, (_, c) =>
    Math.max(...raw.slice(c * per, c * per + per)),
  );
}

function PatternGlyph({
  pattern,
  barW,
  bars,
  color,
  id,
}: {
  pattern: Pattern;
  barW: number;
  bars: number;
  color: string;
  id: string;
}) {
  const cols = barW >= 44 ? 16 : barW >= 20 ? 8 : 4;
  const levels = glyphLevels(pattern, cols);
  const h = ROW_H - 8;
  const w = Math.max(1, bars * barW - 6);
  const stepW = barW / cols;
  return (
    <svg
      className="absolute inset-0"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
    >
      <defs>
        <pattern id={id} width={barW} height={h} patternUnits="userSpaceOnUse">
          {levels.map((v, i) =>
            v > 0 ? (
              <rect
                key={i}
                x={i * stepW + 1}
                y={h - 5 - v * (h - 12)}
                width={Math.max(1, stepW - 2)}
                height={v * (h - 12)}
                rx={1}
                fill={color}
                opacity={0.4 + v * 0.55}
              />
            ) : null,
          )}
          <rect x={0} y={0} width={1} height={h} fill="rgba(0,0,0,0.4)" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
    </svg>
  );
}

// ─── Chord lane ──────────────────────────────────────────────────────────────

function sameChord(a: ChordStep | null, b: ChordStep | null) {
  return a?.root === b?.root && a?.quality === b?.quality;
}

function ChordLane({
  section,
  barW,
  onClick,
}: {
  section: Section;
  barW: number;
  onClick: () => void;
}) {
  const chips: { bar: number; span: number; chord: ChordStep | null }[] = [];
  for (let b = 0; b < section.bars; b++) {
    const chord = chordAt(section, b);
    const last = chips[chips.length - 1];
    if (last && sameChord(last.chord, chord)) last.span += 1;
    else chips.push({ bar: b, span: 1, chord });
  }
  const color = SECTION_COLORS[section.kind];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Chords in ${section.name}`}
      className="relative h-full shrink-0 border-r border-bg py-[3px]"
      style={{ width: section.bars * barW }}
    >
      {chips.map((c) => (
        <span
          key={c.bar}
          className="absolute inset-y-[3px] flex items-center justify-center overflow-hidden rounded-[5px] px-[2px] font-display text-[10px] font-semibold leading-none"
          style={{
            left: c.bar * barW + 1,
            width: c.span * barW - 2,
            background: `${color.fill}22`,
            color: color.fill,
          }}
        >
          <span className="overflow-hidden whitespace-nowrap">{c.chord ? chordSymbol(c.chord.root, c.chord.quality) : "—"}</span>
        </span>
      ))}
    </button>
  );
}

// ─── Rows ────────────────────────────────────────────────────────────────────

function SectionHeader({
  section,
  index,
  barW,
  selected,
  playing,
  dropSide,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  section: Section;
  index: number;
  barW: number;
  selected: boolean;
  playing: boolean;
  dropSide: "before" | "after" | null;
  onClick: () => void;
  onDragStart: (e: DragEvent<HTMLButtonElement>) => void;
  onDragOver: (e: DragEvent<HTMLButtonElement>) => void;
  onDrop: (e: DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
}) {
  const color = SECTION_COLORS[section.kind];
  const summary = section.progression.map((c) => chordSymbol(c.root, c.quality)).join(" · ");
  return (
    <button
      type="button"
      draggable
      data-index={index}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      aria-pressed={selected}
      aria-label={`${section.name}, ${section.bars} bars`}
      title="Drag to move this section"
      className="relative h-full shrink-0 cursor-grab border-r border-bg p-[3px] text-left active:cursor-grabbing"
      style={{ width: section.bars * barW }}
    >
      {dropSide ? (
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 z-10 w-[3px] rounded-full bg-text",
            dropSide === "before" ? "-left-[2px]" : "-right-[2px]",
          )}
        />
      ) : null}
      <div
        className={cn(
          "flex h-full flex-col justify-center overflow-hidden rounded-md px-2 transition-opacity",
          selected ? "opacity-100 ring-2 ring-text" : "opacity-85 hover:opacity-100",
        )}
        style={{ background: color.fill, color: color.text }}
      >
        <div className="flex items-center gap-1.5">
          {playing ? <span className="beat-pulse size-1.5 shrink-0 rounded-full bg-current" /> : null}
          <span className="truncate text-[12px] font-bold leading-tight">{section.name}</span>
        </div>
        <div className="truncate text-[10px] font-medium leading-tight opacity-75">
          {section.bars} {section.bars === 1 ? "bar" : "bars"}
          {summary && barW * section.bars > 150 ? ` · ${summary}` : ""}
        </div>
      </div>
    </button>
  );
}

function ClipCell({
  track,
  section,
  barW,
  selected,
  onSelect,
  onClipOn,
}: {
  track: Track;
  section: Section;
  barW: number;
  selected: boolean;
  onSelect: () => void;
  onClipOn: (on: boolean) => void;
}) {
  const clip = clipOf(track, section.id);
  const color = SECTION_COLORS[section.kind];
  const label = getInstrument(track.instrumentId).label;
  return (
    <div className="relative h-full shrink-0 border-r border-bg p-[3px]" style={{ width: section.bars * barW }}>
      <button
        type="button"
        onClick={() => {
          if (!clip.on) onClipOn(true);
          onSelect();
        }}
        onDoubleClick={() => onClipOn(!clip.on)}
        aria-pressed={selected}
        aria-label={`${label} in ${section.name}: ${clip.on ? "playing" : "not playing"}`}
        title={clip.on ? "Double-click to take it out of this section" : "Click to play here"}
        className={cn(
          "relative h-full w-full overflow-hidden rounded-md text-left transition-colors",
          clip.on
            ? "border"
            : "border border-dashed border-line hover:border-text-dim hover:bg-bg-raised",
          selected ? "ring-2 ring-text" : "",
        )}
        style={
          clip.on
            ? { background: `${color.fill}26`, borderColor: `${color.fill}66` }
            : undefined
        }
      >
        {clip.on ? (
          <PatternGlyph
            pattern={patternFor(track, section.id)}
            barW={barW}
            bars={section.bars}
            color={color.fill}
            id={`glyph-${track.id}-${section.id}`}
          />
        ) : null}
        {clip.on && clip.pattern ? (
          <span
            className="absolute right-1 top-0.5 rounded-[3px] px-1 text-[8.5px] font-bold uppercase tracking-wide"
            style={{ background: "#0a0a0dcc", color: color.fill }}
          >
            custom
          </span>
        ) : null}
      </button>
    </div>
  );
}

function TrackHeader({
  track,
  selected,
  onSelect,
  onMute,
  onSolo,
}: {
  track: Track;
  selected: boolean;
  onSelect: () => void;
  onMute: (muted: boolean) => void;
  onSolo: (solo: boolean) => void;
}) {
  const def = getInstrument(track.instrumentId);
  const chip = "flex size-7 items-center justify-center rounded-md border text-[10px] font-bold";
  return (
    <div
      className={cn(
        "sticky left-0 z-20 flex shrink-0 items-center gap-1.5 border-r border-line-soft pl-3 pr-2",
        selected ? "bg-bg-raised" : "bg-bg",
      )}
      style={{ width: HEADER_W }}
    >
      <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left" aria-pressed={selected}>
        <div className={cn("truncate text-[13px] font-semibold", track.muted ? "text-text-dim" : "text-text")}>
          {def.label}
        </div>
        <div className="truncate text-[10.5px] text-text-muted">{patternSummary(track.pattern)}</div>
      </button>
      <button
        type="button"
        aria-label="Mute"
        aria-pressed={track.muted}
        onClick={() => onMute(!track.muted)}
        className={cn(chip, track.muted ? "border-danger/50 bg-danger/15 text-danger" : "border-line text-text-dim hover:text-text")}
      >
        M
      </button>
      <button
        type="button"
        aria-label="Solo"
        aria-pressed={track.solo}
        onClick={() => onSolo(!track.solo)}
        className={cn(chip, track.solo ? "border-accent bg-accent text-black" : "border-line text-text-dim hover:text-text")}
      >
        S
      </button>
    </div>
  );
}

// ─── The grid ────────────────────────────────────────────────────────────────

export function Arrangement({
  song,
  selection,
  isPlaying,
  getPlayhead,
  onSelect,
  onClipOn,
  onAddSection,
  onAddTrack,
  onMute,
  onSolo,
  onReorderSection,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [playingSection, setPlayingSection] = useState<string | null>(null);

  const total = totalBars(song);
  const fit = containerW > 0 && total > 0 ? (containerW - HEADER_W - TAIL_W) / total : 28;
  const barW = Math.max(MIN_BAR_W, Math.min(MAX_BAR_W, fit * zoom));
  const barWRef = useRef(barW);
  useEffect(() => {
    barWRef.current = barW;
  }, [barW]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setContainerW(el.clientWidth);
    const ro = new ResizeObserver((entries) => setContainerW(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Move the playhead off the audio clock without re-rendering the grid;
  // only the "which section is playing" highlight goes through React.
  useEffect(() => {
    const line = playheadRef.current;
    if (!isPlaying) {
      if (line) line.style.display = "none";
      setPlayingSection(null);
      return;
    }
    let raf = 0;
    let lastSection: string | null = null;
    const tick = () => {
      const ph = getPlayhead();
      if (line) {
        if (ph) {
          const x = HEADER_W + (ph.songBar + ph.phase) * barWRef.current;
          line.style.display = "block";
          line.style.transform = `translateX(${x}px)`;
          const el = scrollRef.current;
          if (el) {
            const visibleLeft = el.scrollLeft + HEADER_W;
            const visibleRight = el.scrollLeft + el.clientWidth;
            if (x < visibleLeft || x > visibleRight - 12) el.scrollLeft = Math.max(0, x - HEADER_W - 24);
          }
        } else {
          line.style.display = "none";
        }
      }
      const sid = ph?.sectionId ?? null;
      if (sid !== lastSection) {
        lastSection = sid;
        setPlayingSection(sid);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, getPlayhead]);

  // Drag a section header to move it; the drop side comes from the pointer's
  // half of the target header.
  const [drag, setDrag] = useState<{ id: string; over: number; side: "before" | "after" } | null>(null);
  const dragId = useRef<string | null>(null);
  const startDrag = (id: string) => (e: DragEvent<HTMLButtonElement>) => {
    dragId.current = id;
    e.dataTransfer.setData(DRAG_TYPE, id);
    e.dataTransfer.effectAllowed = "move";
  };
  const overSection = (index: number) => (e: DragEvent<HTMLButtonElement>) => {
    if (!dragId.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientX - rect.left < rect.width / 2 ? "before" : "after";
    setDrag((d) => (d && d.over === index && d.side === side ? d : { id: dragId.current!, over: index, side }));
  };
  const dropOnSection = (index: number) => (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = dragId.current || e.dataTransfer.getData(DRAG_TYPE);
    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientX - rect.left < rect.width / 2 ? "before" : "after";
    dragId.current = null;
    setDrag(null);
    if (!id) return;
    const from = song.sections.findIndex((x) => x.id === id);
    if (from < 0) return;
    let to = side === "before" ? index : index + 1;
    if (from < to) to -= 1; // slots shift once the section is lifted out
    onReorderSection(id, to);
  };
  const clearDrag = () => {
    dragId.current = null;
    setDrag(null);
  };

  const zoomBy = useCallback((factor: number) => {
    setZoom((z) => Math.max(0.25, Math.min(6, z * factor)));
  }, []);

  const width = HEADER_W + total * barW + TAIL_W;
  const selectedSection = selection.kind === "section" ? selection.sectionId : null;
  const selectedTrack = selection.kind === "track" ? selection.trackId : null;

  return (
    <div className="flex shrink-0 flex-col xl:min-h-0 xl:flex-1">
      <div className="flex items-center gap-2 border-b border-line-soft px-3 py-1.5">
        <span className={LABEL}>Arrangement</span>
        <span className="text-[11px] text-text-muted">
          {song.sections.length} {song.sections.length === 1 ? "section" : "sections"} · {total} bars ·{" "}
          {formatDuration(total * barSeconds(song.bpm))}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoomBy(1 / 1.3)}
            className="flex size-7 items-center justify-center rounded-md text-text-dim hover:bg-bg-raised hover:text-text"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="rounded-md px-1.5 text-[10px] font-semibold text-text-dim hover:bg-bg-raised hover:text-text"
          >
            Fit
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoomBy(1.3)}
            className="flex size-7 items-center justify-center rounded-md text-text-dim hover:bg-bg-raised hover:text-text"
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-thin relative max-h-[52vh] min-h-0 overflow-auto xl:max-h-none xl:flex-1"
      >
        <div className="relative" style={{ width, minWidth: "100%" }}>
          {/* Sections + chords stay pinned while the instrument rows scroll */}
          <div className="sticky top-0 z-30 bg-bg">
          <div className="flex" style={{ height: SECTION_H }}>
            <div
              className="sticky left-0 z-20 flex shrink-0 items-end border-r border-line-soft bg-bg px-3 pb-1.5"
              style={{ width: HEADER_W }}
            >
              <span className={LABEL}>Sections</span>
            </div>
            {song.sections.map((s, i) => (
              <SectionHeader
                key={s.id}
                section={s}
                index={i}
                barW={barW}
                selected={selectedSection === s.id}
                playing={playingSection === s.id}
                dropSide={drag && drag.over === i && drag.id !== s.id ? drag.side : null}
                onClick={() => onSelect({ kind: "section", sectionId: s.id })}
                onDragStart={startDrag(s.id)}
                onDragOver={overSection(i)}
                onDrop={dropOnSection(i)}
                onDragEnd={clearDrag}
              />
            ))}
            <div className="flex shrink-0 items-center pl-2" style={{ width: TAIL_W }}>
              <Menu
                title="Add a section"
                trigger={
                  <span className="inline-flex h-8 items-center gap-1 rounded-md border border-dashed border-line px-2.5 text-[11.5px] font-semibold text-text-muted hover:border-text-dim hover:text-text">
                    <Plus className="size-3.5" /> Section
                  </span>
                }
                items={SECTION_KINDS.map((k) => ({
                  id: k.id,
                  label: k.label,
                  hint: `${k.bars} bars`,
                  swatch: SECTION_COLORS[k.id].fill,
                }))}
                onPick={(id) => onAddSection(id as SectionKind)}
              />
            </div>
          </div>

          {/* Chords */}
          <div className="flex border-t border-line-soft" style={{ height: CHORD_H }}>
            <div
              className="sticky left-0 z-20 flex shrink-0 items-center border-r border-line-soft bg-bg px-3"
              style={{ width: HEADER_W }}
            >
              <span className="text-[11px] font-medium text-text-muted">Chords</span>
            </div>
            {song.sections.map((s) => (
              <ChordLane
                key={s.id}
                section={s}
                barW={barW}
                onClick={() => onSelect({ kind: "section", sectionId: s.id })}
              />
            ))}
          </div>
          </div>

          {/* Instruments */}
          {song.tracks.map((t) => (
            <div key={t.id} className="flex border-t border-line-soft" style={{ height: ROW_H }}>
              <TrackHeader
                track={t}
                selected={selectedTrack === t.id}
                onSelect={() => onSelect({ kind: "track", trackId: t.id })}
                onMute={(m) => onMute(t.id, m)}
                onSolo={(s) => onSolo(t.id, s)}
              />
              {song.sections.map((s) => (
                <ClipCell
                  key={s.id}
                  track={t}
                  section={s}
                  barW={barW}
                  selected={
                    selection.kind === "clip" &&
                    selection.trackId === t.id &&
                    selection.sectionId === s.id
                  }
                  onSelect={() => onSelect({ kind: "clip", trackId: t.id, sectionId: s.id })}
                  onClipOn={(on) => onClipOn(t.id, s.id, on)}
                />
              ))}
            </div>
          ))}

          {/* Add instrument */}
          <div className="flex border-t border-line-soft" style={{ height: ROW_H }}>
            <div
              className="sticky left-0 z-20 flex shrink-0 items-center border-r border-line-soft bg-bg px-3"
              style={{ width: HEADER_W }}
            >
              <Menu
                title="Add an instrument"
                trigger={
                  <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-line px-2.5 text-[12px] font-semibold text-text-muted hover:border-text-dim hover:text-text">
                    <Plus className="size-3.5" /> Instrument
                  </span>
                }
                items={INSTRUMENTS.map((i) => ({
                  id: i.id,
                  label: i.label,
                  hint: song.tracks.some((t) => t.instrumentId === i.id) ? "added" : undefined,
                }))}
                onPick={(id) => onAddTrack(id as InstrumentId)}
              />
            </div>
            {song.tracks.length === 0 ? (
              <div className="flex items-center pl-3 text-[12px] text-text-dim">
                Add an instrument to hear the song. Each one gets a row; click a block to
                put it in a section, double-click to take it out.
              </div>
            ) : null}
          </div>

          {/* Playhead */}
          <div
            ref={playheadRef}
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-px bg-text shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
