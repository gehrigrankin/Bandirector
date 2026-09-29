"use client";

// Everything about one section: its name, kind, length, and the chords that
// loop inside it. Chords are what-you-see-is-what-plays — colouring to 7ths
// rewrites the progression instead of hiding a global setting somewhere.

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Minus,
  Plus,
  Play,
  Repeat,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { InstrumentId } from "@/lib/audio/instruments";
import {
  chordNoteNames,
  chordSymbol,
  extendQuality,
  PROGRESSION_TEMPLATES,
  type ChordExt,
} from "@/lib/music/chord";
import {
  degreesToChords,
  MAX_BARS,
  MIN_BARS,
  SECTION_KINDS,
  triadOf,
  type ChordStep,
  type Section,
  type SectionKind,
  type Song,
} from "@/lib/song/model";
import { DiatonicChords } from "@/components/studio/DiatonicChords";
import { ChordGrid } from "@/components/studio/ChordGrid";
import { MidiPanel } from "@/components/studio/MidiPanel";
import { LABEL, SECTION_COLORS } from "@/components/studio/shared";

interface Props {
  song: Song;
  section: Section;
  index: number;
  liveInstrument: InstrumentId;
  isLooping: boolean;
  onChange: (patch: Partial<Section>) => void;
  onKind: (kind: SectionKind) => void;
  onProgression: (chords: ChordStep[]) => void;
  onTemplate: (chords: ChordStep[]) => void;
  onColour: (ext: ChordExt) => void;
  onLoop: () => void;
  onPlayFrom: () => void;
  onDuplicate: () => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}

// Plain templates only — the colour buttons below cover the 7th/9th variants.
const TEMPLATES = PROGRESSION_TEMPLATES.filter((t) => !t.ext);

/** The colour level a section is currently at, or null when mixed. */
function sectionExt(section: Section): ChordExt | null {
  if (section.progression.length === 0) return null;
  const levels = section.progression.map((c) =>
    /9/.test(c.quality) ? "9th" : triadOf(c.quality) === c.quality ? "triad" : "7th",
  );
  return levels.every((l) => l === levels[0]) ? (levels[0] as ChordExt) : null;
}

const iconBtn =
  "flex size-9 items-center justify-center rounded-lg border border-line text-text-muted hover:bg-bg-raised hover:text-text disabled:opacity-30 disabled:hover:bg-transparent";

export function SectionInspector({
  song,
  section,
  index,
  liveInstrument,
  isLooping,
  onChange,
  onKind,
  onProgression,
  onTemplate,
  onColour,
  onLoop,
  onPlayFrom,
  onDuplicate,
  onMove,
  onRemove,
}: Props) {
  const [chordIndex, setChordIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    setChordIndex(0);
  }, [section.id]);

  const chords = section.progression;
  const current = chords[Math.min(chordIndex, Math.max(0, chords.length - 1))];
  const color = SECTION_COLORS[section.kind];
  const ext = sectionExt(section) ?? "triad";
  const repeats = chords.length > 0 ? section.bars / chords.length : 0;

  const replaceChord = (i: number, chord: ChordStep) =>
    onProgression(chords.map((c, k) => (k === i ? chord : c)));

  const pick = (root: string, quality: string) => {
    if (chords.length === 0) {
      onProgression([{ root, quality }]);
      setChordIndex(0);
      return;
    }
    replaceChord(Math.min(chordIndex, chords.length - 1), { root, quality });
  };

  const addChord = () => {
    const last = chords[chords.length - 1] ?? { root: song.tonic, quality: song.mode === "major" ? "maj" : "min" };
    onProgression([...chords, { ...last }]);
    setChordIndex(chords.length);
  };

  const removeChord = (i: number) => {
    const next = chords.filter((_, k) => k !== i);
    onProgression(next);
    setChordIndex((c) => Math.max(0, Math.min(c, next.length - 1)));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Identity + transport for this section */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="size-3 rounded-[4px]" style={{ background: color.fill }} />
        <input
          value={section.name}
          onChange={(e) => onChange({ name: e.target.value.slice(0, 40) })}
          aria-label="Section name"
          className="h-9 w-40 rounded-lg border border-line bg-bg-input px-2.5 font-display text-[15px] font-bold text-text outline-none focus:border-accent"
        />
        <select
          aria-label="Section type"
          value={section.kind}
          onChange={(e) => onKind(e.target.value as SectionKind)}
          className="h-9 rounded-lg border border-line bg-bg-input px-2 text-[12px] text-text-soft outline-none focus:border-accent"
        >
          {SECTION_KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>

        <div className="flex h-9 items-center rounded-lg border border-line">
          <button
            type="button"
            aria-label="Fewer bars"
            disabled={section.bars <= MIN_BARS}
            onClick={() => onChange({ bars: Math.max(MIN_BARS, section.bars - 1) })}
            className="flex h-full w-8 items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-16 text-center text-[12px] font-semibold tabular-nums">
            {section.bars} {section.bars === 1 ? "bar" : "bars"}
          </span>
          <button
            type="button"
            aria-label="More bars"
            disabled={section.bars >= MAX_BARS}
            onClick={() => onChange({ bars: Math.min(MAX_BARS, section.bars + 1) })}
            className="flex h-full w-8 items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={onLoop}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold",
              isLooping ? "bg-accent text-black" : "border border-line text-text-soft hover:bg-bg-raised",
            )}
          >
            <Repeat className="size-3.5" /> Loop
          </button>
          <button
            type="button"
            onClick={onPlayFrom}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[12px] font-semibold text-text-soft hover:bg-bg-raised"
          >
            <Play className="size-3.5" fill="currentColor" /> From here
          </button>
          <button type="button" aria-label="Move earlier" disabled={index === 0} onClick={() => onMove(-1)} className={iconBtn}>
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Move later"
            disabled={index >= song.sections.length - 1}
            onClick={() => onMove(1)}
            className={iconBtn}
          >
            <ArrowRight className="size-4" />
          </button>
          <button type="button" aria-label="Duplicate section" onClick={onDuplicate} className={iconBtn}>
            <Copy className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Delete section"
            disabled={song.sections.length <= 1}
            onClick={onRemove}
            className={cn(iconBtn, "hover:border-danger/40 hover:text-danger")}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Chords */}
      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(280px,360px)]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={LABEL}>Chords</span>
            <span className="text-[11px] text-text-muted">
              One bar each
              {chords.length > 0
                ? ` · plays ${Number.isInteger(repeats) ? repeats : repeats.toFixed(1)}× over ${section.bars} bars`
                : ""}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <select
                aria-label="Start from a progression"
                value=""
                onChange={(e) => {
                  const t = TEMPLATES.find((x) => x.id === e.target.value);
                  if (!t) return;
                  const next = degreesToChords(song.tonic, song.mode, t.degrees).map((c) => ({
                    ...c,
                    quality: extendQuality(c.root, c.quality, song.tonic, song.mode, ext),
                  }));
                  onTemplate(next);
                  setChordIndex(0);
                }}
                className="h-8 rounded-full border border-line bg-bg-input px-2.5 text-[11px] text-text-soft outline-none"
              >
                <option value="">Start from…</option>
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="flex overflow-hidden rounded-full border border-line">
                {(["triad", "7th", "9th"] as ChordExt[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onColour(c)}
                    disabled={chords.length === 0}
                    className={cn(
                      "h-8 px-2.5 text-[11px] font-semibold disabled:opacity-40",
                      ext === c && chords.length > 0 ? "bg-accent text-black" : "text-text-muted hover:text-text",
                    )}
                  >
                    {c === "triad" ? "Triads" : c === "7th" ? "7ths" : "9ths"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {chords.map((c, i) => {
              const active = i === chordIndex;
              return (
                <div
                  key={i}
                  className={cn(
                    "relative min-w-[84px] shrink-0 rounded-xl border pb-2 pl-3 pr-6 pt-1.5",
                    active ? "border-accent bg-accent/10" : "border-line bg-bg-raised",
                  )}
                >
                  <button type="button" onClick={() => setChordIndex(i)} className="block w-full text-left">
                    <div className="text-[9.5px] font-semibold uppercase tracking-wider text-text-dim">Bar {i + 1}</div>
                    <div className={cn("font-display text-[19px] font-semibold leading-tight", active ? "text-accent" : "text-text")}>
                      {chordSymbol(c.root, c.quality)}
                    </div>
                    <div className="mt-0.5 text-[10px] text-text-muted">{chordNoteNames(c.root, c.quality).join(" ")}</div>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove chord ${i + 1}`}
                    onClick={() => removeChord(i)}
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-md text-text-dim hover:bg-danger/10 hover:text-danger"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addChord}
              className="flex min-h-[72px] min-w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-[11px] font-semibold text-text-muted hover:border-text-dim hover:text-text"
            >
              <Plus className="size-4" /> Chord
            </button>
          </div>

          <DiatonicChords
            tonic={song.tonic}
            mode={song.mode}
            ext={ext}
            current={current ?? { root: "", quality: "" }}
            onPick={(root, quality) =>
              pick(root, extendQuality(root, quality, song.tonic, song.mode, ext))
            }
            title={current ? `Replace bar ${Math.min(chordIndex, chords.length - 1) + 1} with a chord in ${song.tonic} ${song.mode}` : `Chords in ${song.tonic} ${song.mode}`}
          />
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="self-start text-[12px] font-medium text-accent hover:text-accent-soft"
          >
            {showAll ? "Hide other chords" : "Any chord →"}
          </button>
          {showAll ? (
            <ChordGrid
              root={current?.root ?? song.tonic}
              quality={current?.quality ?? "maj"}
              onRoot={(root) => pick(root, current?.quality ?? "maj")}
              onQuality={(quality) => pick(current?.root ?? song.tonic, quality)}
            />
          ) : null}
        </div>

        <MidiPanel
          instrumentId={liveInstrument}
          onAddChord={(root, quality) => {
            onProgression([...chords, { root, quality }]);
            setChordIndex(chords.length);
          }}
        />
      </div>
    </div>
  );
}
