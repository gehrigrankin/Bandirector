// Standard MIDI File export (format 1): one track per instrument, section
// markers, GM program changes, drums on channel 10. Drop the file into
// GarageBand / Logic / Ableton and every part lands on its own track, so a
// sketch made here can be finished there.

import { getInstrument } from "@/lib/audio/instruments";
import { renderBar } from "@/lib/song/render";
import { barSeconds as secondsPerBar, type Song } from "@/lib/song/model";

const PPQ = 480; // ticks per quarter note
const BAR_TICKS = PPQ * 4;
const DRUM_CHANNEL = 9; // channel 10, 0-based

/** GM program numbers (0-based) for smplr's soundfont names. */
const GM_PROGRAM: Record<string, number> = {
  acoustic_grand_piano: 0,
  electric_piano_1: 4,
  drawbar_organ: 16,
  acoustic_guitar_steel: 25,
  electric_guitar_clean: 27,
  electric_bass_finger: 33,
  cello: 42,
  string_ensemble_1: 48,
  trumpet: 56,
  alto_sax: 65,
  flute: 73,
  pad_2_warm: 89,
};

/** GM percussion key numbers for the drum machine's logical voices. */
const DRUM_NOTE: Record<string, number> = {
  kick: 36,
  snare: 38,
  hihat: 42,
  openhat: 46,
  clap: 39,
};

interface MidiEvent {
  tick: number;
  order: number; // tie-break: note-offs before note-ons at the same tick
  bytes: number[];
}

function vlq(value: number): number[] {
  let v = Math.max(0, Math.round(value));
  const out = [v & 0x7f];
  v >>= 7;
  while (v > 0) {
    out.unshift((v & 0x7f) | 0x80);
    v >>= 7;
  }
  return out;
}

function text(bytes: string): number[] {
  return Array.from(new TextEncoder().encode(bytes));
}

function meta(type: number, data: number[]): number[] {
  return [0xff, type, ...vlq(data.length), ...data];
}

function chunk(tag: string, body: number[]): number[] {
  const len = body.length;
  return [
    ...text(tag),
    (len >>> 24) & 0xff,
    (len >>> 16) & 0xff,
    (len >>> 8) & 0xff,
    len & 0xff,
    ...body,
  ];
}

function encodeTrack(events: MidiEvent[]): number[] {
  const sorted = [...events].sort((a, b) => a.tick - b.tick || a.order - b.order);
  const body: number[] = [];
  let last = 0;
  for (const ev of sorted) {
    body.push(...vlq(ev.tick - last), ...ev.bytes);
    last = ev.tick;
  }
  body.push(...vlq(0), ...meta(0x2f, []));
  return chunk("MTrk", body);
}

/** Apply the engine's swing so the file grooves like playback did (humanize
 *  is left out on purpose — the DAW can add its own). */
function swung(offsetSeconds: number, barSec: number, swing: number): number {
  if (swing <= 0) return offsetSeconds;
  const eighth = barSec / 8;
  const slot = Math.round(offsetSeconds / eighth);
  return slot % 2 === 1 ? offsetSeconds + swing * eighth * 0.6 : offsetSeconds;
}

export function songToMidi(song: Song): Uint8Array {
  const barSec = secondsPerBar(song.bpm);
  const toTicks = (seconds: number) => (seconds / barSec) * BAR_TICKS;

  // Conductor track: tempo, meter, and a marker at every section.
  const conductor: MidiEvent[] = [];
  const usPerQuarter = Math.round(60_000_000 / song.bpm);
  conductor.push({ tick: 0, order: 0, bytes: meta(0x03, text(song.title || "Bandirector song")) });
  conductor.push({
    tick: 0,
    order: 1,
    bytes: meta(0x51, [(usPerQuarter >> 16) & 0xff, (usPerQuarter >> 8) & 0xff, usPerQuarter & 0xff]),
  });
  conductor.push({ tick: 0, order: 2, bytes: meta(0x58, [4, 2, 24, 8]) });
  let bar = 0;
  for (const section of song.sections) {
    conductor.push({ tick: bar * BAR_TICKS, order: 3, bytes: meta(0x06, text(section.name)) });
    bar += section.bars;
  }
  const totalTicks = bar * BAR_TICKS;

  const anySolo = song.tracks.some((t) => t.solo);
  const audible = song.tracks.filter((t) => (anySolo ? t.solo : !t.muted));

  const tracks: number[][] = [encodeTrack(conductor)];
  let melodicChannel = 0;
  for (const track of audible) {
    const def = getInstrument(track.instrumentId);
    const channel = def.isDrums ? DRUM_CHANNEL : melodicChannel++;
    if (melodicChannel === DRUM_CHANNEL) melodicChannel++;
    if (channel > 15) break;

    const events: MidiEvent[] = [];
    events.push({ tick: 0, order: 0, bytes: meta(0x03, text(def.label)) });
    if (!def.isDrums) {
      events.push({ tick: 0, order: 1, bytes: [0xc0 | channel, GM_PROGRAM[def.gm] ?? 0] });
    }
    // Track volume as CC7 so the DAW mix roughly matches the app's.
    events.push({ tick: 0, order: 1, bytes: [0xb0 | channel, 7, Math.round(track.volume * 127)] });

    let songBar = 0;
    for (const section of song.sections) {
      for (let b = 0; b < section.bars; b++, songBar++) {
        const barStart = songBar * BAR_TICKS;
        for (const ev of renderBar(track, section, b, barSec)) {
          const note = def.isDrums ? DRUM_NOTE[ev.note as string] : (ev.note as number);
          if (note == null || note < 0 || note > 127) continue;
          const start = barStart + toTicks(swung(ev.time, barSec, song.swing));
          const durSec = (ev.duration ?? barSec / 8) * (def.isDrums ? 1 : track.noteLength);
          const end = Math.min(totalTicks, start + Math.max(PPQ / 8, toTicks(durSec)));
          const velocity = Math.max(1, Math.min(127, Math.round(ev.velocity ?? 80)));
          events.push({ tick: Math.round(start), order: 2, bytes: [0x90 | channel, note, velocity] });
          events.push({ tick: Math.round(end), order: 0, bytes: [0x80 | channel, note, 0] });
        }
      }
    }
    tracks.push(encodeTrack(events));
  }

  const header = chunk("MThd", [0, 1, (tracks.length >> 8) & 0xff, tracks.length & 0xff, (PPQ >> 8) & 0xff, PPQ & 0xff]);
  return new Uint8Array([...header, ...tracks.flat()]);
}

/** A file-system-friendly name for the export. */
export function midiFileName(song: Song): string {
  const base = (song.title || "song").trim().replace(/[^\w\- ]+/g, "").replace(/\s+/g, "-");
  return `${base || "song"}.mid`;
}
