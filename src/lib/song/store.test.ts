import { describe, expect, it } from "vitest";

import { parseSong, songFromLegacy } from "./store";
import { createSong, createTrack } from "./model";

const row = (...on: number[]) => Array.from({ length: 16 }, (_, i) => on.includes(i));

const legacy = {
  version: 1,
  updatedAt: 1,
  bpm: 96,
  masterVolume: 0.9,
  swing: 0.28,
  humanize: 0.5,
  tonic: "A",
  mode: "minor",
  chordQuality: "7th",
  progression: [
    { root: "A", quality: "min" },
    { root: "D", quality: "min", ext: "triad" },
    { root: "C", quality: "maj" },
    { root: "C", quality: "maj" },
  ],
  selection: {
    instrumentId: "acoustic_guitar",
    pattern: { kind: "melodic", articulation: "strum", hits: row(0, 4, 8, 12) },
    octave: 3,
    noteLength: 1,
    reverb: 0.2,
  },
  tracks: [
    {
      id: "t1",
      instrumentId: "drums",
      pattern: {
        kind: "drums",
        rows: { kick: row(0, 8), snare: row(4, 12), hihat: row(), openhat: row(), clap: row() },
      },
      octave: 0,
      noteLength: 1,
      reverb: 0,
      volume: 0.8,
      muted: false,
      solo: false,
    },
  ],
  viewMode: "full",
};

describe("songFromLegacy", () => {
  it("lifts the old single loop into a one-section song, baking in chord colour", () => {
    const song = songFromLegacy(legacy);
    expect(song).not.toBeNull();
    expect(song!.bpm).toBe(96);
    expect(song!.tonic).toBe("A");
    expect(song!.mode).toBe("minor");
    expect(song!.sections).toHaveLength(1);
    expect(song!.sections[0].bars).toBe(8);
    expect(song!.sections[0].progression.map((c) => c.quality)).toEqual(["m7", "min", "maj7", "maj7"]);
    // The locked drum layer plus the part that was being auditioned.
    expect(song!.tracks.map((t) => t.instrumentId)).toEqual(["drums", "acoustic_guitar"]);
    expect(parseSong(song)).not.toBeNull();
  });

  it("ignores junk and empty projects", () => {
    expect(songFromLegacy({ version: 3 })).toBeNull();
    expect(songFromLegacy({ ...legacy, progression: [], tracks: [] })).toBeNull();
  });
});

describe("parseSong", () => {
  it("round-trips a fresh song and rejects bad shapes", () => {
    const song = createSong();
    song.tracks = [createTrack("bass")];
    expect(parseSong(JSON.parse(JSON.stringify(song)))).toEqual(song);
    expect(parseSong({ ...song, sections: [] })).toBeNull();
    expect(parseSong({ ...song, bpm: 999 })).toBeNull();
  });

  it("folds the short-lived per-kit drum instruments back into Drums + kit", () => {
    const song = createSong();
    const drums = { ...createTrack("drums"), instrumentId: "drums_cr8000" as never, kit: undefined };
    const parsed = parseSong(JSON.parse(JSON.stringify({ ...song, tracks: [drums] })));
    expect(parsed?.tracks[0].instrumentId).toBe("drums");
    expect(parsed?.tracks[0].kit).toBe("Roland CR-8000");
    // Drum tracks saved before kits existed were playing the 808.
    const old = { ...createTrack("drums"), kit: undefined };
    expect(parseSong(JSON.parse(JSON.stringify({ ...song, tracks: [old] })))?.tracks[0].kit).toBe("TR-808");
  });
});
