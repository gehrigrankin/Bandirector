export interface InstrumentOption {
  value: string;
  label: string;
}

export const INSTRUMENTS: InstrumentOption[] = [
  { value: "acoustic_guitar", label: "Acoustic guitar" },
  { value: "electric_guitar", label: "Electric guitar" },
  { value: "bass", label: "Bass" },
  { value: "piano", label: "Piano / keys" },
  { value: "vocals", label: "Vocals" },
  { value: "drums", label: "Drums" },
];

export function stylesFor(instrument: string): InstrumentOption[] {
  switch (instrument) {
    case "acoustic_guitar":
      return [
        { value: "rhythm", label: "Rhythm / strumming" },
        { value: "fingerstyle", label: "Fingerstyle" },
        { value: "arpeggiated", label: "Arpeggiated" },
      ];
    case "electric_guitar":
      return [
        { value: "rhythm", label: "Rhythm" },
        { value: "lead", label: "Lead" },
      ];
    case "bass":
      return [{ value: "root", label: "Root notes" }];
    case "piano":
      return [{ value: "chords", label: "Chords" }];
    case "vocals":
      return [{ value: "lead", label: "Lead" }];
    case "drums":
      return [{ value: "kit", label: "Full kit" }];
    default:
      return [{ value: "default", label: "Default" }];
  }
}

export function instrumentLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return INSTRUMENTS.find((i) => i.value === value)?.label ?? value;
}
