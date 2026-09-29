// The Songwriter Studio instrument roster: app instrument id -> the smplr GM
// soundfont name (or the drum machine), a default octave, and the family of
// playing styles it supports. Sample buffers stream lazily from smplr's default
// soundfont CDN the first time each instrument is played.

export type StyleFamily = "strum" | "bass" | "keys" | "sustain" | "drums";

export type InstrumentId =
  | "acoustic_guitar"
  | "electric_guitar"
  | "bass"
  | "piano"
  | "drums"
  | "electric_piano"
  | "organ"
  | "synth_pad"
  | "trumpet"
  | "sax"
  | "flute"
  | "strings"
  | "cello";

export interface InstrumentDef {
  id: InstrumentId;
  label: string;
  /** GM soundfont name passed to smplr's Soundfont (ignored when isDrums). */
  gm: string;
  isDrums?: boolean;
  /** Default root octave (scientific pitch, C4 = 60). */
  octave: number;
  family: StyleFamily;
}

export const INSTRUMENTS: InstrumentDef[] = [
  // Core
  {
    id: "acoustic_guitar",
    label: "Acoustic Guitar",
    gm: "acoustic_guitar_steel",
    octave: 3,
    family: "strum",
  },
  {
    id: "electric_guitar",
    label: "Electric Guitar",
    gm: "electric_guitar_clean",
    octave: 3,
    family: "strum",
  },
  {
    id: "bass",
    label: "Bass",
    gm: "electric_bass_finger",
    octave: 2,
    family: "bass",
  },
  {
    id: "piano",
    label: "Piano",
    gm: "acoustic_grand_piano",
    octave: 4,
    family: "keys",
  },
  { id: "drums", label: "Drums", gm: "", isDrums: true, octave: 0, family: "drums" },

  // More keys
  {
    id: "electric_piano",
    label: "Electric Piano",
    gm: "electric_piano_1",
    octave: 4,
    family: "keys",
  },
  { id: "organ", label: "Organ", gm: "drawbar_organ", octave: 4, family: "keys" },
  {
    id: "synth_pad",
    label: "Synth Pad",
    gm: "pad_2_warm",
    octave: 3,
    family: "sustain",
  },

  // Winds / brass
  { id: "trumpet", label: "Trumpet", gm: "trumpet", octave: 4, family: "sustain" },
  { id: "sax", label: "Sax", gm: "alto_sax", octave: 4, family: "sustain" },
  { id: "flute", label: "Flute", gm: "flute", octave: 5, family: "sustain" },

  // Strings
  {
    id: "strings",
    label: "Strings",
    gm: "string_ensemble_1",
    octave: 3,
    family: "sustain",
  },
  { id: "cello", label: "Cello", gm: "cello", octave: 3, family: "sustain" },
];

/** The sampled drum machines a drum track can play through (smplr kits). */
export type DrumKitId = "LM-2" | "TR-808" | "Roland CR-8000" | "Casio-RZ1" | "MFB-512";

export const DRUM_KITS: { id: DrumKitId; label: string; hint: string }[] = [
  { id: "LM-2", label: "LinnDrum", hint: "Punchy, most natural" },
  { id: "TR-808", label: "TR-808", hint: "Deep boomy electronic" },
  { id: "Roland CR-8000", label: "CR-8000", hint: "Crisp, tight" },
  { id: "Casio-RZ1", label: "Casio RZ-1", hint: "Lo-fi 80s" },
  { id: "MFB-512", label: "MFB-512", hint: "Analog, dry" },
];

export const DEFAULT_DRUM_KIT: DrumKitId = "LM-2";

const BY_ID: Record<string, InstrumentDef> = Object.fromEntries(
  INSTRUMENTS.map((i) => [i.id, i]),
);

export function getInstrument(id: string): InstrumentDef {
  return BY_ID[id] ?? INSTRUMENTS[0];
}
