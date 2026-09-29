// Device-local autosave for the Create page's song, plus a one-time upgrade of
// the previous Studio loop (a single progression + locked layers) into a
// one-section song so nothing someone was working on disappears.

import { z } from "zod";
import { extendQuality } from "@/lib/music/chord";
import {
  barsForProgression,
  createSong,
  newId,
  type Song,
} from "@/lib/song/model";

export const SONG_STORAGE_KEY = "bandirector.song.v2";
const LEGACY_STORAGE_KEY = "bandirector.studio.autosave.v1";

const TONICS = new Set([
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
]);

const instrumentIdSchema = z.enum([
  "acoustic_guitar",
  "electric_guitar",
  "bass",
  "piano",
  "drums",
  "electric_piano",
  "organ",
  "synth_pad",
  "trumpet",
  "sax",
  "flute",
  "strings",
  "cello",
]);

const stepRowSchema = z.array(z.boolean()).length(16);

const patternSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("melodic"),
    hits: stepRowSchema,
    articulation: z.enum(["strum", "block", "arp", "root", "octave"]),
  }),
  z.object({
    kind: z.literal("drums"),
    rows: z.object({
      kick: stepRowSchema,
      snare: stepRowSchema,
      hihat: stepRowSchema,
      openhat: stepRowSchema,
      clap: stepRowSchema,
    }),
  }),
  z.object({
    kind: z.literal("comp"),
    leftHand: z.enum(["bass", "octaves", "shell", "stride", "walking"]),
    rightHand: z.enum([
      "block",
      "broken",
      "arpeggio",
      "comp",
      "charleston",
      "neosoul",
    ]),
    voicing: z.enum(["triad", "rootless", "shell"]),
  }),
]);

const chordStepSchema = z.object({
  root: z.string().min(1).max(3),
  quality: z.string().min(1).max(16),
});

const sectionSchema = z.object({
  id: z.string().min(1).max(80),
  kind: z.enum(["intro", "verse", "prechorus", "chorus", "bridge", "solo", "breakdown", "outro", "other"]),
  name: z.string().min(1).max(40),
  bars: z.number().int().min(1).max(32),
  progression: z.array(chordStepSchema).max(64),
});

const clipSchema = z.object({
  on: z.boolean(),
  pattern: patternSchema.optional(),
});

const kitSchema = z.enum(["LM-2", "TR-808", "Roland CR-8000", "Casio-RZ1", "MFB-512"]);

// Briefly, kits were separate instrument ids; fold those back into Drums + kit.
const TEMP_KIT_IDS: Record<string, z.infer<typeof kitSchema>> = {
  drums_lm2: "LM-2",
  drums_cr8000: "Roland CR-8000",
  drums_rz1: "Casio-RZ1",
  drums_mfb512: "MFB-512",
};

const trackSchema = z.preprocess(
  (raw) => {
    if (raw && typeof raw === "object" && "instrumentId" in raw) {
      const t = raw as { instrumentId: string; kit?: string };
      const kit = TEMP_KIT_IDS[t.instrumentId];
      if (kit) return { ...t, instrumentId: "drums", kit };
      if (t.instrumentId === "drums" && !t.kit) return { ...t, kit: "TR-808" };
    }
    return raw;
  },
  z.object({
  id: z.string().min(1).max(80),
  instrumentId: instrumentIdSchema,
  kit: kitSchema.optional(),
  pattern: patternSchema,
  octave: z.number().int().min(0).max(8),
  volume: z.number().min(0).max(1),
  muted: z.boolean(),
  solo: z.boolean(),
  noteLength: z.number().min(0.3).max(2),
  reverb: z.number().min(0).max(1),
  clips: z.record(z.string(), clipSchema),
  }),
);

const songSchema = z.object({
  title: z.string().max(80),
  bpm: z.number().int().min(40).max(220),
  swing: z.number().min(0).max(1),
  humanize: z.number().min(0).max(1),
  tonic: z.string().refine((v) => TONICS.has(v), "Invalid tonic"),
  mode: z.enum(["major", "minor"]),
  sections: z.array(sectionSchema).min(1).max(24),
  tracks: z.array(trackSchema).max(12),
});

const snapshotSchema = z.object({
  version: z.literal(2),
  updatedAt: z.number().finite().nonnegative(),
  song: songSchema,
});

export type SongSnapshot = z.infer<typeof snapshotSchema>;

// The previous Studio's shape — just enough to lift it into a song.
const legacySchema = z.object({
  version: z.literal(1),
  bpm: z.number().int().min(60).max(180),
  swing: z.number().min(0).max(1),
  humanize: z.number().min(0).max(1),
  tonic: z.string(),
  mode: z.enum(["major", "minor"]),
  chordQuality: z.enum(["triad", "7th", "9th"]),
  progression: z.array(
    chordStepSchema.extend({ ext: z.enum(["triad", "7th", "9th"]).optional() }),
  ),
  selection: z.object({
    instrumentId: instrumentIdSchema,
    pattern: patternSchema,
    octave: z.number().int(),
    noteLength: z.number(),
    reverb: z.number(),
  }),
  tracks: z.array(
    z.object({
      id: z.string(),
      instrumentId: instrumentIdSchema,
      pattern: patternSchema,
      octave: z.number().int(),
      noteLength: z.number(),
      reverb: z.number(),
      volume: z.number(),
      muted: z.boolean(),
      solo: z.boolean(),
    }),
  ),
});

/** Turn the old single-loop Studio state into a one-section song. The old
 *  Studio only coloured keyboard chords (triad → 7th → 9th); the song model
 *  is what-you-see-is-what-plays, so the colour is baked into the chords. */
export function songFromLegacy(raw: unknown): Song | null {
  const parsed = legacySchema.safeParse(raw);
  if (!parsed.success) return null;
  const old = parsed.data;
  if (old.progression.length === 0 && old.tracks.length === 0) return null;

  const progression = old.progression.map((c) => ({
    root: c.root,
    quality: extendQuality(c.root, c.quality, old.tonic, old.mode, c.ext ?? old.chordQuality),
  }));
  const song = createSong();
  const section = {
    id: newId("s"),
    kind: "verse" as const,
    name: "Verse",
    bars: barsForProgression(progression.length, 8),
    progression,
  };
  const parts = [...old.tracks];
  // The part being auditioned was audible too, so it comes along as a track.
  if (!parts.some((t) => t.instrumentId === old.selection.instrumentId)) {
    parts.push({ ...old.selection, id: "preview", volume: 0.85, muted: false, solo: false });
  }
  return {
    ...song,
    title: "Old Studio loop",
    bpm: old.bpm,
    swing: old.swing,
    humanize: old.humanize,
    tonic: TONICS.has(old.tonic) ? old.tonic : "C",
    mode: old.mode,
    sections: [section],
    tracks: parts.map((t) => ({
      id: newId("t"),
      instrumentId: t.instrumentId,
      kit: t.instrumentId === "drums" ? ("TR-808" as const) : undefined,
      pattern: t.pattern,
      octave: Math.max(0, Math.min(8, t.octave)),
      volume: Math.max(0, Math.min(1, t.volume)),
      muted: t.muted,
      solo: t.solo,
      noteLength: Math.max(0.3, Math.min(2, t.noteLength)),
      reverb: Math.max(0, Math.min(1, t.reverb)),
      clips: {},
    })),
  };
}

export function loadSong(): Song | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SONG_STORAGE_KEY);
    if (raw) {
      const parsed = snapshotSchema.safeParse(JSON.parse(raw));
      if (parsed.success) return parsed.data.song;
    }
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const song = songFromLegacy(JSON.parse(legacy));
      if (song) return song;
    }
  } catch {
    /* corrupt storage — start fresh */
  }
  return null;
}

export function saveSong(song: Song): boolean {
  if (typeof window === "undefined") return false;
  try {
    const snapshot = snapshotSchema.parse({ version: 2, updatedAt: Date.now(), song });
    window.localStorage.setItem(SONG_STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

/** Validate an arbitrary object as a song (used by the file import). */
export function parseSong(raw: unknown): Song | null {
  const parsed = songSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}
