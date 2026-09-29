import { describe, expect, it } from "vitest";

import {
  barsForProgression,
  chordAt,
  colourSection,
  createSection,
  createSong,
  createTrack,
  duplicateSection,
  forkClipPattern,
  isPlaying,
  moveSection,
  nextSectionName,
  patternFor,
  removeSection,
  reorderSection,
  resolveSongBar,
  resolveTransportBar,
  sectionStarts,
  setClip,
  totalBars,
  unforkClipPattern,
  type Song,
} from "./model";

function songWith(bars: number[]): Song {
  const song = createSong();
  song.sections = bars.map((n, i) =>
    Object.assign(createSection(song.sections, "verse"), { id: `s${i}`, bars: n }),
  );
  return song;
}

describe("section naming", () => {
  it("numbers repeats of a kind", () => {
    const sections = [createSection([], "verse")];
    expect(sections[0].name).toBe("Verse");
    expect(nextSectionName(sections, "verse")).toBe("Verse 2");
    expect(nextSectionName(sections, "chorus")).toBe("Chorus");
  });
});

describe("barsForProgression", () => {
  it("keeps a length that already holds whole repeats", () => {
    expect(barsForProgression(4, 8)).toBe(8);
    expect(barsForProgression(2, 8)).toBe(8);
  });
  it("doubles short loops and plays long ones once", () => {
    expect(barsForProgression(3, 8)).toBe(6);
    expect(barsForProgression(12, 8)).toBe(12);
    expect(barsForProgression(5, 8)).toBe(5);
  });
});

describe("bar math", () => {
  const song = songWith([4, 8, 8]);

  it("totals and starts", () => {
    expect(totalBars(song)).toBe(20);
    expect(sectionStarts(song)).toEqual([0, 4, 12]);
  });

  it("resolves a song bar to its section and offset, wrapping at the end", () => {
    expect(resolveSongBar(song, 0)).toMatchObject({ sectionIndex: 0, barInSection: 0 });
    expect(resolveSongBar(song, 3)).toMatchObject({ sectionIndex: 0, barInSection: 3 });
    expect(resolveSongBar(song, 4)).toMatchObject({ sectionIndex: 1, barInSection: 0 });
    expect(resolveSongBar(song, 19)).toMatchObject({ sectionIndex: 2, barInSection: 7 });
    expect(resolveSongBar(song, 20)).toMatchObject({ sectionIndex: 0, barInSection: 0, songBar: 0 });
    expect(resolveSongBar(song, 25)).toMatchObject({ sectionIndex: 1, barInSection: 1 });
  });

  it("loops the chord progression inside a section", () => {
    const section = createSection([], "verse", [
      { root: "C", quality: "maj" },
      { root: "G", quality: "maj" },
    ]);
    expect(chordAt(section, 0)?.root).toBe("C");
    expect(chordAt(section, 1)?.root).toBe("G");
    expect(chordAt(section, 2)?.root).toBe("C");
    expect(chordAt({ ...section, progression: [] }, 0)).toBeNull();
  });

  it("section loop stays inside the chosen section", () => {
    const t = { loop: "section" as const, sectionId: "s1" };
    expect(resolveTransportBar(song, t, 0)).toMatchObject({ sectionIndex: 1, barInSection: 0, songBar: 4 });
    expect(resolveTransportBar(song, t, 7)).toMatchObject({ sectionIndex: 1, barInSection: 7, songBar: 11 });
    expect(resolveTransportBar(song, t, 8)).toMatchObject({ sectionIndex: 1, barInSection: 0, songBar: 4 });
  });

  it("song loop starts from the chosen section and runs to the end and around", () => {
    const t = { loop: "song" as const, sectionId: "s2" };
    expect(resolveTransportBar(song, t, 0)).toMatchObject({ sectionIndex: 2, barInSection: 0 });
    expect(resolveTransportBar(song, t, 8)).toMatchObject({ sectionIndex: 0, barInSection: 0 });
  });

  it("falls back to the first section when the id is unknown", () => {
    const t = { loop: "song" as const, sectionId: "nope" };
    expect(resolveTransportBar(song, t, 0)).toMatchObject({ sectionIndex: 0 });
  });
});

describe("clips", () => {
  it("plays everywhere by default, with the track's pattern", () => {
    const track = createTrack("bass");
    expect(isPlaying(track, "s0")).toBe(true);
    expect(patternFor(track, "s0")).toBe(track.pattern);
  });

  it("can sit a section out and come back", () => {
    let track = setClip(createTrack("bass"), "s0", { on: false });
    expect(isPlaying(track, "s0")).toBe(false);
    expect(isPlaying(track, "s1")).toBe(true);
    track = setClip(track, "s0", { on: true });
    expect(isPlaying(track, "s0")).toBe(true);
  });

  it("forks a per-section pattern copy and can drop it again", () => {
    const track = forkClipPattern(createTrack("bass"), "s0");
    const forked = patternFor(track, "s0");
    expect(forked).not.toBe(track.pattern);
    expect(forked).toEqual(track.pattern);
    expect(forkClipPattern(track, "s0")).toBe(track);
    const back = unforkClipPattern(track, "s0");
    expect(patternFor(back, "s0")).toBe(back.pattern);
    expect(isPlaying(back, "s0")).toBe(true);
  });
});

describe("section edits", () => {
  it("duplicates a section right after itself, carrying who plays in it", () => {
    const song = songWith([4, 8]);
    song.tracks = [setClip(createTrack("drums"), "s0", { on: false })];
    const next = duplicateSection(song, "s0");
    expect(next.sections.map((s) => s.bars)).toEqual([4, 4, 8]);
    expect(next.sections[1].name).toBe("Verse 3");
    expect(isPlaying(next.tracks[0], next.sections[1].id)).toBe(false);
  });

  it("removes a section and its clips but never the last one", () => {
    const song = songWith([4, 8]);
    song.tracks = [setClip(createTrack("drums"), "s0", { on: false })];
    const next = removeSection(song, "s0");
    expect(next.sections.map((s) => s.id)).toEqual(["s1"]);
    expect(next.tracks[0].clips).toEqual({});
    expect(removeSection(next, "s1")).toBe(next);
  });

  it("moves sections and clamps at the ends", () => {
    const song = songWith([1, 2, 3]);
    expect(moveSection(song, "s2", -1).sections.map((s) => s.id)).toEqual(["s0", "s2", "s1"]);
    expect(moveSection(song, "s0", -1)).toBe(song);
    expect(moveSection(song, "s2", 1)).toBe(song);
  });

  it("reorders a section to an absolute slot", () => {
    const song = songWith([1, 2, 3, 4]);
    expect(reorderSection(song, "s3", 0).sections.map((s) => s.id)).toEqual(["s3", "s0", "s1", "s2"]);
    expect(reorderSection(song, "s0", 3).sections.map((s) => s.id)).toEqual(["s1", "s2", "s3", "s0"]);
    expect(reorderSection(song, "s1", 1)).toBe(song);
    expect(reorderSection(song, "nope", 0)).toBe(song);
  });

  it("colours chords by scale degree and is reversible", () => {
    const section = createSection([], "verse", [
      { root: "C", quality: "maj" },
      { root: "G", quality: "maj" },
      { root: "A", quality: "min" },
    ]);
    const sevenths = colourSection(section, "C", "major", "7th");
    expect(sevenths.progression.map((c) => c.quality)).toEqual(["maj7", "7", "m7"]);
    const again = colourSection(sevenths, "C", "major", "9th");
    expect(again.progression.map((c) => c.quality)).toEqual(["maj9", "9", "m9"]);
    const triads = colourSection(again, "C", "major", "triad");
    expect(triads.progression.map((c) => c.quality)).toEqual(["maj", "maj", "min"]);
  });
});
