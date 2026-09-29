import { describe, expect, it } from "vitest";

import { createSection, createSong, createTrack, setClip } from "./model";
import { midiFileName, songToMidi } from "./midi";

const ascii = (bytes: Uint8Array, at: number, len: number) =>
  String.fromCharCode(...bytes.slice(at, at + len));

function readChunks(bytes: Uint8Array): { tag: string; body: Uint8Array }[] {
  const chunks = [];
  let i = 0;
  while (i < bytes.length) {
    const tag = ascii(bytes, i, 4);
    const len = (bytes[i + 4] << 24) | (bytes[i + 5] << 16) | (bytes[i + 6] << 8) | bytes[i + 7];
    chunks.push({ tag, body: bytes.slice(i + 8, i + 8 + len) });
    i += 8 + len;
  }
  return chunks;
}

/** Walk a track body message by message (the writer never uses running
 *  status) and return the channel-message status bytes in order. */
function statuses(body: Uint8Array): number[] {
  const out: number[] = [];
  let i = 0;
  const vlq = () => {
    let v = 0;
    while (true) {
      const b = body[i++];
      v = (v << 7) | (b & 0x7f);
      if ((b & 0x80) === 0) return v;
    }
  };
  while (i < body.length) {
    vlq(); // delta time
    const status = body[i++];
    if (status === 0xff) {
      i++; // meta type
      const len = vlq(); // (not `i += vlq()`: that reads i before vlq moves it)
      i += len;
      continue;
    }
    const hi = status & 0xf0;
    // Note-on with velocity 0 is a note-off in disguise; report it as such.
    out.push(hi === 0x90 && body[i + 1] === 0 ? 0x80 | (status & 0x0f) : status);
    i += hi === 0xc0 || hi === 0xd0 ? 1 : 2;
  }
  return out;
}

function countNotes(body: Uint8Array): { on: number; off: number } {
  const st = statuses(body);
  return {
    on: st.filter((s) => (s & 0xf0) === 0x90).length,
    off: st.filter((s) => (s & 0xf0) === 0x80).length,
  };
}

describe("songToMidi", () => {
  it("writes a format-1 file with a conductor track plus one track per audible instrument", () => {
    const song = createSong();
    song.tracks = [createTrack("bass"), createTrack("drums"), { ...createTrack("piano"), muted: true }];
    const bytes = songToMidi(song);
    const chunks = readChunks(bytes);
    expect(chunks[0].tag).toBe("MThd");
    expect(chunks[0].body[1]).toBe(1); // format 1
    expect((chunks[0].body[2] << 8) | chunks[0].body[3]).toBe(3); // conductor + bass + drums
    expect(chunks.filter((c) => c.tag === "MTrk")).toHaveLength(3);
    // Every track ends with End Of Track.
    for (const c of chunks.slice(1)) {
      expect(Array.from(c.body.slice(-3))).toEqual([0xff, 0x2f, 0x00]);
    }
  });

  it("puts the tempo and a marker per section in the conductor track", () => {
    const song = createSong();
    song.bpm = 120;
    const conductor = readChunks(songToMidi(song))[1].body;
    // Set Tempo: FF 51 03 tt tt tt — 500000 µs per quarter at 120 BPM.
    const tempoAt = conductor.findIndex((b, i) => b === 0xff && conductor[i + 1] === 0x51);
    expect(tempoAt).toBeGreaterThan(-1);
    const us = (conductor[tempoAt + 3] << 16) | (conductor[tempoAt + 4] << 8) | conductor[tempoAt + 5];
    expect(us).toBe(500000);
    const text = new TextDecoder().decode(conductor);
    expect(text).toContain("Verse");
    expect(text).toContain("Chorus");
  });

  it("balances note-ons and note-offs and skips sections a track sits out", () => {
    const song = createSong();
    const bass = createTrack("bass");
    song.tracks = [bass];
    const full = countNotes(readChunks(songToMidi(song))[2].body);
    expect(full.on).toBeGreaterThan(0);
    expect(full.on).toBe(full.off);

    song.tracks = [setClip(bass, song.sections[0].id, { on: false })];
    const half = countNotes(readChunks(songToMidi(song))[2].body);
    expect(half.on).toBe(full.on / 2);
  });

  it("drums land on channel 10 and melodic parts get a program change", () => {
    const song = createSong();
    song.sections = [createSection([], "verse", [{ root: "C", quality: "maj" }])];
    song.tracks = [createTrack("drums"), createTrack("acoustic_guitar")];
    const chunks = readChunks(songToMidi(song));
    const drums = chunks[2].body;
    const guitar = chunks[3].body;
    expect(statuses(drums)).toContain(0x99); // note-on, channel 10
    expect(statuses(drums).some((s) => (s & 0xf0) === 0xc0)).toBe(false);
    expect(statuses(guitar)).toContain(0xc0);
    const pc = Array.from(guitar).findIndex((b, i) => b === 0xc0 && guitar[i + 1] === 25);
    expect(pc).toBeGreaterThan(-1); // steel-string acoustic
  });
});

describe("midiFileName", () => {
  it("slugs the title and falls back", () => {
    expect(midiFileName({ ...createSong(), title: "My Cool Song!" })).toBe("My-Cool-Song.mid");
    expect(midiFileName({ ...createSong(), title: "   " })).toBe("song.mid");
  });
});
