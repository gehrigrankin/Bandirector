// The song model behind the Create page.
//
// A Song is an ordered list of Sections (Intro, Verse 1, Chorus 1, …), each
// with its own chord progression and length in bars, plus a rack of Tracks
// (one per instrument). Every track × section cell is a Clip: either the track
// plays there (with the track's default pattern or a section-specific one) or
// it sits out. That's the whole arrangement — enough to sketch a full song
// idea and see, GarageBand-style, who plays where and for how long.
//
// Everything in here is pure data + math so the transport, the grid, the
// autosave, and the MIDI export can all agree on what bar N means.

import {
  getInstrument,
  type InstrumentId,
} from "@/lib/audio/instruments";
import {
  clonePattern,
  defaultPattern,
  type Pattern,
} from "@/lib/audio/patterns";
import {
  extendQuality,
  progressionFromDegrees,
  type ChordExt,
  type Mode,
} from "@/lib/music/chord";

export const ROOTS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/** One chord in a section's progression. Each chord lasts one bar; the
 *  progression loops to fill the section's length. */
export interface ChordStep {
  root: string;
  quality: string; // quality id from QUALITIES
}

export type SectionKind =
  | "intro"
  | "verse"
  | "prechorus"
  | "chorus"
  | "bridge"
  | "solo"
  | "outro";

export const SECTION_KINDS: { id: SectionKind; label: string; bars: number }[] = [
  { id: "intro", label: "Intro", bars: 4 },
  { id: "verse", label: "Verse", bars: 8 },
  { id: "prechorus", label: "Pre-chorus", bars: 4 },
  { id: "chorus", label: "Chorus", bars: 8 },
  { id: "bridge", label: "Bridge", bars: 8 },
  { id: "solo", label: "Solo", bars: 8 },
  { id: "outro", label: "Outro", bars: 4 },
];

export interface Section {
  id: string;
  kind: SectionKind;
  name: string; // "Verse 1"
  bars: number;
  progression: ChordStep[];
}

/** How a track behaves inside one section. A missing clip means "plays with
 *  the track's default pattern". */
export interface Clip {
  on: boolean;
  /** Section-specific pattern; falls back to the track's pattern when unset. */
  pattern?: Pattern;
}

export interface Track {
  id: string;
  instrumentId: InstrumentId;
  pattern: Pattern; // default pattern for every section
  octave: number;
  volume: number; // 0..1
  muted: boolean;
  solo: boolean;
  noteLength: number; // sustain multiplier (0.3 short … 2 long)
  reverb: number; // 0 dry … 1 wet
  clips: Record<string, Clip>; // keyed by section id
}

export interface Song {
  title: string;
  bpm: number;
  swing: number; // 0 straight … 0.5 swung
  humanize: number; // 0 robotic … 1 loose
  tonic: string;
  mode: Mode;
  sections: Section[];
  tracks: Track[];
}

export const MIN_BARS = 1;
export const MAX_BARS = 32;
export const MAX_SECTIONS = 24;
export const MAX_TRACKS = 12;

// ─── Ids ─────────────────────────────────────────────────────────────────────

let counter = 0;
export function newId(prefix: string): string {
  counter += 1;
  return `${prefix}${Date.now().toString(36)}${counter.toString(36)}`;
}

// ─── Constructors ────────────────────────────────────────────────────────────

/** Sequential name for a new section of a kind: Verse, Verse 2, Verse 3… */
export function nextSectionName(sections: Section[], kind: SectionKind): string {
  const label = SECTION_KINDS.find((k) => k.id === kind)?.label ?? "Section";
  const count = sections.filter((s) => s.kind === kind).length;
  return count === 0 ? label : `${label} ${count + 1}`;
}

export function createSection(
  sections: Section[],
  kind: SectionKind,
  progression: ChordStep[] = [],
): Section {
  const def = SECTION_KINDS.find((k) => k.id === kind) ?? SECTION_KINDS[1];
  return {
    id: newId("s"),
    kind,
    name: nextSectionName(sections, kind),
    bars: progression.length > 0 ? barsForProgression(progression.length, def.bars) : def.bars,
    progression: progression.map((c) => ({ ...c })),
  };
}

/** A sensible section length for a progression: keep the current length when
 *  it already holds whole repeats, otherwise double short loops and play
 *  longer ones (12-bar blues) once. */
export function barsForProgression(chords: number, current: number): number {
  if (chords <= 0) return current;
  if (current % chords === 0 && current >= chords) return current;
  return Math.min(MAX_BARS, chords <= 4 ? chords * 2 : chords);
}

export function createTrack(instrumentId: InstrumentId): Track {
  const def = getInstrument(instrumentId);
  return {
    id: newId("t"),
    instrumentId,
    pattern: defaultPattern(def.family),
    octave: def.octave,
    volume: 0.85,
    muted: false,
    solo: false,
    noteLength: 1,
    reverb: 0.2,
    clips: {},
  };
}

/** A fresh song: key of C, one verse and one chorus with a pop progression,
 *  and no instruments yet — the first "Add instrument" makes sound. */
export function createSong(): Song {
  const tonic = "C";
  const mode: Mode = "major";
  const sections: Section[] = [];
  const verse = createSection(sections, "verse", degreesToChords(tonic, mode, [1, 5, 6, 4]));
  sections.push(verse);
  const chorus = createSection(sections, "chorus", degreesToChords(tonic, mode, [6, 4, 1, 5]));
  sections.push(chorus);
  return {
    title: "Untitled song",
    bpm: 100,
    swing: 0,
    humanize: 0.5,
    tonic,
    mode,
    sections,
    tracks: [],
  };
}

export function degreesToChords(tonic: string, mode: Mode, degrees: number[]): ChordStep[] {
  return progressionFromDegrees(tonic, mode, degrees).map((c) => ({
    root: c.root,
    quality: c.quality,
  }));
}

// ─── Clips ───────────────────────────────────────────────────────────────────

export function clipOf(track: Track, sectionId: string): Clip {
  return track.clips[sectionId] ?? { on: true };
}

/** The pattern a track plays in a section (section override or the default). */
export function patternFor(track: Track, sectionId: string): Pattern {
  return track.clips[sectionId]?.pattern ?? track.pattern;
}

export function isPlaying(track: Track, sectionId: string): boolean {
  return clipOf(track, sectionId).on;
}

export function setClip(track: Track, sectionId: string, patch: Partial<Clip>): Track {
  const current = clipOf(track, sectionId);
  return { ...track, clips: { ...track.clips, [sectionId]: { ...current, ...patch } } };
}

/** Give a section its own copy of the track's pattern so edits there don't
 *  leak into the other sections. No-op when it already has one. */
export function forkClipPattern(track: Track, sectionId: string): Track {
  if (track.clips[sectionId]?.pattern) return track;
  return setClip(track, sectionId, { pattern: clonePattern(track.pattern) });
}

/** Drop a section's override so the track goes back to its default pattern. */
export function unforkClipPattern(track: Track, sectionId: string): Track {
  const clip = track.clips[sectionId];
  if (!clip?.pattern) return track;
  const { pattern: _drop, ...rest } = clip;
  return { ...track, clips: { ...track.clips, [sectionId]: rest } };
}

// ─── Section edits ───────────────────────────────────────────────────────────

export function duplicateSection(song: Song, sectionId: string): Song {
  const index = song.sections.findIndex((s) => s.id === sectionId);
  if (index < 0 || song.sections.length >= MAX_SECTIONS) return song;
  const source = song.sections[index];
  const copy: Section = {
    ...source,
    id: newId("s"),
    name: nextSectionName(song.sections, source.kind),
    progression: source.progression.map((c) => ({ ...c })),
  };
  const sections = [...song.sections];
  sections.splice(index + 1, 0, copy);
  // The copy inherits who plays in it, including section-specific patterns.
  const tracks = song.tracks.map((t) => {
    const clip = t.clips[sectionId];
    if (!clip) return t;
    return {
      ...t,
      clips: {
        ...t.clips,
        [copy.id]: { ...clip, pattern: clip.pattern ? clonePattern(clip.pattern) : undefined },
      },
    };
  });
  return { ...song, sections, tracks };
}

export function removeSection(song: Song, sectionId: string): Song {
  if (song.sections.length <= 1) return song;
  return {
    ...song,
    sections: song.sections.filter((s) => s.id !== sectionId),
    tracks: song.tracks.map((t) => {
      if (!(sectionId in t.clips)) return t;
      const { [sectionId]: _drop, ...clips } = t.clips;
      return { ...t, clips };
    }),
  };
}

export function moveSection(song: Song, sectionId: string, delta: -1 | 1): Song {
  const from = song.sections.findIndex((s) => s.id === sectionId);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= song.sections.length) return song;
  const sections = [...song.sections];
  const [moved] = sections.splice(from, 1);
  sections.splice(to, 0, moved);
  return { ...song, sections };
}

/** Move a section to an absolute position (drag and drop). `toIndex` is the
 *  slot in the list *after* the section has been lifted out. */
export function reorderSection(song: Song, sectionId: string, toIndex: number): Song {
  const from = song.sections.findIndex((s) => s.id === sectionId);
  if (from < 0) return song;
  const sections = [...song.sections];
  const [moved] = sections.splice(from, 1);
  const to = Math.max(0, Math.min(sections.length, toIndex));
  if (to === from) return song;
  sections.splice(to, 0, moved);
  return { ...song, sections };
}

/** Upgrade (or reset) every chord in a section to a colour level, using the
 *  song key so I becomes maj7 while V becomes 7. */
export function colourSection(
  section: Section,
  tonic: string,
  mode: Mode,
  ext: ChordExt,
  baseQualities?: Record<string, string>,
): Section {
  return {
    ...section,
    progression: section.progression.map((c) => {
      const base = baseQualities?.[c.quality] ?? triadOf(c.quality);
      return { ...c, quality: extendQuality(c.root, base, tonic, mode, ext) };
    }),
  };
}

/** Reduce a quality id to its triad so colouring is idempotent. */
export function triadOf(quality: string): string {
  if (/^(maj7|maj9|6|add9)$/.test(quality)) return "maj";
  if (/^(m7|m9|m6)$/.test(quality)) return "min";
  if (/^(7|9)$/.test(quality)) return "maj";
  if (/^(m7b5)$/.test(quality)) return "dim";
  return quality;
}

// ─── Bar math ────────────────────────────────────────────────────────────────

export interface BarPosition {
  sectionIndex: number;
  section: Section;
  barInSection: number; // 0-based
  songBar: number; // 0-based across the whole song
  chord: ChordStep | null;
}

export function totalBars(song: Song): number {
  return song.sections.reduce((n, s) => n + s.bars, 0);
}

/** Absolute bar where each section starts. */
export function sectionStarts(song: Song): number[] {
  const starts: number[] = [];
  let bar = 0;
  for (const s of song.sections) {
    starts.push(bar);
    bar += s.bars;
  }
  return starts;
}

/** Resolve an absolute song bar (wrapping around the end) to its section,
 *  offset, and chord. Returns null for an empty song. */
export function resolveSongBar(song: Song, songBar: number): BarPosition | null {
  const total = totalBars(song);
  if (total <= 0 || song.sections.length === 0) return null;
  const bar = ((songBar % total) + total) % total;
  let start = 0;
  for (let i = 0; i < song.sections.length; i++) {
    const section = song.sections[i];
    if (bar < start + section.bars) {
      const barInSection = bar - start;
      return {
        sectionIndex: i,
        section,
        barInSection,
        songBar: bar,
        chord: chordAt(section, barInSection),
      };
    }
    start += section.bars;
  }
  return null;
}

export function chordAt(section: Section, barInSection: number): ChordStep | null {
  if (section.progression.length === 0) return null;
  return section.progression[barInSection % section.progression.length];
}

/** What the transport is doing: looping the whole song, or one section. */
export interface Transport {
  loop: "song" | "section";
  sectionId: string | null; // the section to loop (section mode) or start from (song mode)
}

/** Map the engine's monotonically increasing bar counter to a song position
 *  for the current transport settings. */
export function resolveTransportBar(
  song: Song,
  transport: Transport,
  barIndex: number,
): BarPosition | null {
  if (song.sections.length === 0) return null;
  const starts = sectionStarts(song);
  const idx = Math.max(
    0,
    song.sections.findIndex((s) => s.id === transport.sectionId),
  );
  if (transport.loop === "section") {
    const section = song.sections[idx];
    if (section.bars <= 0) return null;
    const barInSection = barIndex % section.bars;
    return {
      sectionIndex: idx,
      section,
      barInSection,
      songBar: starts[idx] + barInSection,
      chord: chordAt(section, barInSection),
    };
  }
  return resolveSongBar(song, starts[idx] + barIndex);
}

/** Seconds per bar at a tempo (4/4). */
export function barSeconds(bpm: number): number {
  return (60 / bpm) * 4;
}

export function songSeconds(song: Song): number {
  return totalBars(song) * barSeconds(song.bpm);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
