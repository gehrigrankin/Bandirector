import { describe, expect, it } from "vitest";

import {
  chordNoteNames,
  chordSymbol,
  diatonicChords,
  extendQuality,
  isInKey,
  parseChord,
  PROGRESSION_TEMPLATES,
  progressionFromDegrees,
  qualityIdFromToken,
} from "./chord";

const names = (chords: { root: string; quality: string }[]) =>
  chords.map((c) => chordSymbol(c.root, c.quality));

describe("parseChord", () => {
  it("splits root, quality and slash bass", () => {
    expect(parseChord("Am7")).toEqual({ root: "A", quality: "m7", bass: undefined });
    expect(parseChord("C/G")).toEqual({ root: "C", quality: "", bass: "G" });
    expect(parseChord("F#maj7")?.root).toBe("F#");
  });

  it("never throws on junk — the chord editor takes free text", () => {
    expect(parseChord("not a chord")).toEqual({ root: "notachord", quality: "" });
  });
});

describe("qualityIdFromToken", () => {
  it("folds the aliases a user might type onto one id", () => {
    expect(qualityIdFromToken("m")).toBe("min");
    expect(qualityIdFromToken("min")).toBe("min");
    expect(qualityIdFromToken("min7")).toBe("m7");
    expect(qualityIdFromToken("sus")).toBe("sus4");
    expect(qualityIdFromToken("")).toBe("maj");
    expect(qualityIdFromToken("nonsense")).toBe("maj");
  });
});

describe("diatonicChords", () => {
  it("builds the seven chords of C major", () => {
    expect(names(diatonicChords("C", "major"))).toEqual([
      "C", "Dm", "Em", "F", "G", "Am", "Bdim",
    ]);
  });

  it("builds natural minor, not the relative major reshuffled", () => {
    expect(names(diatonicChords("A", "minor"))).toEqual([
      "Am", "Bdim", "C", "Dm", "Em", "F", "G",
    ]);
  });

  it("carries the roman numerals the picker labels with", () => {
    expect(diatonicChords("G", "major").map((c) => c.numeral)).toEqual([
      "I", "ii", "iii", "IV", "V", "vi", "vii\u00b0",
    ]);
  });

  it("wraps past the octave — G major reaches F#, not F", () => {
    expect(names(diatonicChords("G", "major"))[6]).toBe("F#dim");
  });
});

describe("isInKey", () => {
  it("accepts a diatonic chord and rejects a borrowed one", () => {
    expect(isInKey("F", "maj", "C", "major")).toBe(true);
    expect(isInKey("F", "min", "C", "major")).toBe(false);
  });

  it("matches enharmonically — Db and C# are the same chord", () => {
    expect(isInKey("Db", "maj", "Ab", "major")).toBe(true);
  });
});

describe("progressionFromDegrees", () => {
  it("maps I-V-vi-IV onto the key", () => {
    expect(names(progressionFromDegrees("C", "major", [1, 5, 6, 4]))).toEqual([
      "C", "G", "Am", "F",
    ]);
  });

  it("adapts the same degrees to a minor key", () => {
    expect(names(progressionFromDegrees("A", "minor", [1, 4, 5]))).toEqual([
      "Am", "Dm", "Em",
    ]);
  });

  it("resolves every shipped template to real chords in every key", () => {
    for (const tpl of PROGRESSION_TEMPLATES) {
      for (const tonic of ["C", "F#", "Bb"]) {
        const chords = progressionFromDegrees(tonic, "major", tpl.degrees);
        expect(chords).toHaveLength(tpl.degrees.length);
        expect(chords.every((c) => c && typeof c.root === "string")).toBe(true);
      }
    }
  });
});

describe("extendQuality", () => {
  it("leaves triads alone", () => {
    expect(extendQuality("C", "maj", "C", "major", "triad")).toBe("maj");
  });

  it("knows I and V are both major triads but different sevenths", () => {
    expect(extendQuality("C", "maj", "C", "major", "7th")).toBe("maj7");
    expect(extendQuality("G", "maj", "C", "major", "7th")).toBe("7");
  });

  it("falls back to the triad core for a chord outside the key", () => {
    expect(extendQuality("Eb", "min", "C", "major", "7th")).toBe("m7");
  });

  it("leaves sus and aug chords untouched", () => {
    expect(extendQuality("C", "sus4", "C", "major", "9th")).toBe("sus4");
  });
});

describe("chordNoteNames", () => {
  it("spells a chord from the root up", () => {
    expect(chordNoteNames("A", "m7")).toEqual(["A", "C", "E", "G"]);
    expect(chordNoteNames("C", "maj7")).toEqual(["C", "E", "G", "B"]);
  });
});
