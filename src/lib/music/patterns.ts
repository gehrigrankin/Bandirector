import type { Feel } from "@/lib/types/database";

export interface StrumPattern {
  label: string;
  // 8 slots per bar: 'D' | 'U' | '-'
  strokes: ("D" | "U" | "-")[];
}

export const STRUM_PATTERNS: Record<Feel, StrumPattern> = {
  rock: {
    label: "Rock — driving 8ths",
    strokes: ["D", "D", "U", "U", "D", "U", "D", "U"],
  },
  pop: {
    label: "Pop — D–DU–UDU",
    strokes: ["D", "-", "D", "U", "-", "U", "D", "U"],
  },
  folk: {
    label: "Folk — D–DUDU",
    strokes: ["D", "-", "D", "U", "D", "U", "D", "U"],
  },
  blues: {
    label: "Blues shuffle",
    strokes: ["D", "-", "D", "U", "D", "-", "D", "U"],
  },
  funk: {
    label: "Funk — 16th chops",
    strokes: ["D", "U", "D", "U", "D", "U", "D", "U"],
  },
  country: {
    label: "Country — boom-chick",
    strokes: ["D", "-", "D", "U", "D", "-", "D", "U"],
  },
  ballad: {
    label: "Ballad — gentle 8ths",
    strokes: ["D", "-", "-", "U", "D", "-", "-", "U"],
  },
  reggae: {
    label: "Reggae — off-beat skank",
    strokes: ["-", "U", "-", "U", "-", "U", "-", "U"],
  },
  latin: {
    label: "Latin — syncopated",
    strokes: ["D", "-", "U", "D", "-", "U", "D", "U"],
  },
};

export const PICKING_PATTERNS: Record<Feel, string> = {
  rock: "p–i–m–a, accent 1 & 3",
  pop: "p i m a i m, keep it light",
  folk: "Travis: p-i-p-m (thumb alternates)",
  blues: "Monotonic thumb on root, fingers on & beats",
  funk: "Tight: p-mute-i-m, staccato",
  country: "p (bass) – i-m – p (alt) – i-m",
  ballad: "p-i-m-i-m-a slow arpeggio",
  reggae: "Skank the off-beats with i-m",
  latin: "Rumba pattern: p-i-m-i-p-m",
};

export const DRUM_PATTERNS: Record<Feel, string> = {
  rock: "Kick 1 & 3 · Snare 2 & 4 · Hats 8ths",
  pop: "Kick 1 · & of 2 · 3 · Snare 2 & 4",
  folk: "Light kit: brushes or shakers, kick on 1",
  blues: "Shuffle: kick 1&3, snare 2&4, swung hats",
  funk: "Ghost snares, kick on 1 & 'e' of 2",
  country: "Train beat: kick/snare 8ths alternating",
  ballad: "Cross-stick on 3, kick on 1, sparse cymbal",
  reggae: "One drop: kick & snare together on 3",
  latin: "Clave 3–2 pattern",
};
