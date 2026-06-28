/**
 * Studio instrument roster. Each entry maps an app instrument to a smplr
 * sound source (a FluidR3_GM `Soundfont` name, or a `DrumMachine` for the kit),
 * a sensible base octave for chord voicings, and the playing styles it offers.
 *
 * Style ids reference generators in `./patterns`.
 */

export type StudioInstrumentKind = "pitched" | "drum";

export interface StudioInstrument {
  id: string;
  label: string;
  group: string;
  kind: StudioInstrumentKind;
  /** FluidR3_GM soundfont name (pitched instruments). */
  soundfont?: string;
  /** smplr DrumMachine name (drum kit). */
  drumMachine?: string;
  /** Scientific-pitch octave for the chord root (MIDI 60 = C4). */
  octave: number;
  styleIds: string[];
}

const GUITAR_STYLES = [
  "rhythm1",
  "rhythm2",
  "rhythm3",
  "fingerstyle1",
  "fingerstyle2",
  "fingerstyle3",
  "pluck",
];
const ELECTRIC_STYLES = ["rhythm1", "rhythm2", "rhythm3", "arp", "pluck", "power"];
const BASS_STYLES = ["bassRoot", "bassRootFifth", "bassWalk", "bassOctave"];
const KEYS_STYLES = ["keysBlock", "keysArp", "keysBroken", "keysSustain"];
const PAD_STYLES = ["sustain", "swell", "stabs", "arp"];
const DRUM_STYLES = [
  "drumRock",
  "drumPop",
  "drumFunk",
  "drumFolk",
  "drumBallad",
  "drumLatin",
];

export const STUDIO_INSTRUMENTS: StudioInstrument[] = [
  // Core band
  {
    id: "acoustic_guitar",
    label: "Acoustic guitar",
    group: "Guitars",
    kind: "pitched",
    soundfont: "acoustic_guitar_steel",
    octave: 3,
    styleIds: GUITAR_STYLES,
  },
  {
    id: "electric_guitar",
    label: "Electric guitar",
    group: "Guitars",
    kind: "pitched",
    soundfont: "electric_guitar_clean",
    octave: 3,
    styleIds: ELECTRIC_STYLES,
  },
  {
    id: "bass",
    label: "Bass",
    group: "Bass",
    kind: "pitched",
    soundfont: "electric_bass_finger",
    octave: 2,
    styleIds: BASS_STYLES,
  },
  {
    id: "piano",
    label: "Piano",
    group: "Keys",
    kind: "pitched",
    soundfont: "acoustic_grand_piano",
    octave: 4,
    styleIds: KEYS_STYLES,
  },
  {
    id: "drums",
    label: "Drums",
    group: "Drums",
    kind: "drum",
    drumMachine: "TR-808",
    octave: 0,
    styleIds: DRUM_STYLES,
  },
  // More keys
  {
    id: "electric_piano",
    label: "Electric piano",
    group: "Keys",
    kind: "pitched",
    soundfont: "electric_piano_1",
    octave: 4,
    styleIds: KEYS_STYLES,
  },
  {
    id: "organ",
    label: "Organ",
    group: "Keys",
    kind: "pitched",
    soundfont: "drawbar_organ",
    octave: 4,
    styleIds: ["keysSustain", "keysBlock", "stabs", "keysArp"],
  },
  {
    id: "synth_pad",
    label: "Synth pad",
    group: "Keys",
    kind: "pitched",
    soundfont: "pad_2_warm",
    octave: 4,
    styleIds: ["sustain", "swell"],
  },
  // Winds & brass
  {
    id: "trumpet",
    label: "Trumpet",
    group: "Winds & Brass",
    kind: "pitched",
    soundfont: "trumpet",
    octave: 4,
    styleIds: ["stabs", "sustain", "arp"],
  },
  {
    id: "sax",
    label: "Saxophone",
    group: "Winds & Brass",
    kind: "pitched",
    soundfont: "alto_sax",
    octave: 4,
    styleIds: ["sustain", "stabs", "arp"],
  },
  {
    id: "flute",
    label: "Flute",
    group: "Winds & Brass",
    kind: "pitched",
    soundfont: "flute",
    octave: 5,
    styleIds: ["arp", "sustain"],
  },
  // Strings
  {
    id: "strings",
    label: "String ensemble",
    group: "Strings",
    kind: "pitched",
    soundfont: "string_ensemble_1",
    octave: 3,
    styleIds: PAD_STYLES,
  },
  {
    id: "cello",
    label: "Cello",
    group: "Strings",
    kind: "pitched",
    soundfont: "cello",
    octave: 3,
    styleIds: ["sustain", "swell", "arp"],
  },
];

export function getStudioInstrument(id: string): StudioInstrument {
  return (
    STUDIO_INSTRUMENTS.find((i) => i.id === id) ?? STUDIO_INSTRUMENTS[0]
  );
}

/** Roster grouped by their `group` label, preserving declaration order. */
export function instrumentsByGroup(): { group: string; items: StudioInstrument[] }[] {
  const groups: { group: string; items: StudioInstrument[] }[] = [];
  for (const inst of STUDIO_INSTRUMENTS) {
    let bucket = groups.find((g) => g.group === inst.group);
    if (!bucket) {
      bucket = { group: inst.group, items: [] };
      groups.push(bucket);
    }
    bucket.items.push(inst);
  }
  return groups;
}
