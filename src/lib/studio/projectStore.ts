import { z } from "zod";

const STORAGE_KEY = "bandirector.studio.autosave.v1";
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

const selectionSchema = z.object({
  instrumentId: instrumentIdSchema,
  pattern: patternSchema,
  octave: z.number().int().min(0).max(8),
  noteLength: z.number().min(0.3).max(2),
  reverb: z.number().min(0).max(1),
});

const trackSchema = selectionSchema.extend({
  id: z.string().min(1).max(80),
  volume: z.number().min(0).max(1),
  muted: z.boolean(),
  solo: z.boolean(),
});

const projectSchema = z.object({
  version: z.literal(1),
  updatedAt: z.number().finite().nonnegative(),
  bpm: z.number().int().min(60).max(180),
  masterVolume: z.number().min(0).max(1),
  swing: z.number().min(0).max(1),
  humanize: z.number().min(0).max(1),
  tonic: z.string().refine((value) => TONICS.has(value), "Invalid tonic"),
  mode: z.enum(["major", "minor"]),
  chordQuality: z.enum(["triad", "7th", "9th"]),
  progression: z
    .array(
      z.object({
        root: z.string().min(1).max(3),
        quality: z.string().min(1).max(16),
        ext: z.enum(["triad", "7th", "9th"]).optional(),
      }),
    )
    .max(128),
  selection: selectionSchema,
  tracks: z.array(trackSchema).max(32),
  viewMode: z.enum(["full", "focus"]),
});

export type StudioProjectSnapshot = z.infer<typeof projectSchema>;

export function loadStudioProject(): StudioProjectSnapshot | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = projectSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveStudioProject(project: StudioProjectSnapshot): boolean {
  if (typeof window === "undefined") return false;

  try {
    const parsed = projectSchema.parse(project);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return true;
  } catch {
    return false;
  }
}
