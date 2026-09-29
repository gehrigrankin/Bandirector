// Turns the song model into what the audio engine consumes: one ScheduledTrack
// per instrument whose getBarEvents closure looks up the bar's section, checks
// whether the track plays there, and renders its pattern over that bar's chord.
// The MIDI export uses the same renderBar so the file matches playback.

import type { BarEvent, ScheduledTrack } from "@/lib/audio/engine";
import { getInstrument } from "@/lib/audio/instruments";
import { renderPattern } from "@/lib/audio/patterns";
import { chordIntervals, chordToMidi, noteToSemitone } from "@/lib/music/chord";
import {
  chordAt,
  isPlaying,
  patternFor,
  resolveTransportBar,
  type Section,
  type Song,
  type Track,
  type Transport,
} from "@/lib/song/model";

/** The note events a track plays in one bar of a section (empty when it sits
 *  the section out or there's no chord to play). */
export function renderBar(
  track: Track,
  section: Section,
  barInSection: number,
  barSeconds: number,
): BarEvent[] {
  if (!isPlaying(track, section.id)) return [];
  const def = getInstrument(track.instrumentId);
  const chord = chordAt(section, barInSection);
  if (!chord && !def.isDrums) return [];
  const root = chord?.root ?? "C";
  const quality = chord?.quality ?? "maj";
  const intervals = chordIntervals(quality);
  const rootPc = noteToSemitone(root) ?? 0;
  const chordNotes = def.isDrums ? [] : chordToMidi(root, quality, track.octave);
  return renderPattern(patternFor(track, section.id), {
    chordNotes,
    rootMidi: chordNotes[0] ?? 60,
    barSeconds,
    octave: track.octave,
    rootPc,
    intervals,
  });
}

/** Live snapshot for the scheduler. `read` is called on every bar so the
 *  closure always sees the latest song + transport without restarting audio. */
export function buildScheduledTracks(
  read: () => { song: Song; transport: Transport },
): ScheduledTrack[] {
  const { song } = read();
  return song.tracks.map((track) => ({
    id: track.id,
    instrumentId: track.instrumentId,
    volume: track.volume,
    muted: track.muted,
    solo: track.solo,
    noteLength: track.noteLength,
    reverb: track.reverb,
    getBarEvents: (barSeconds, barIndex) => {
      const { song: current, transport } = read();
      const live = current.tracks.find((t) => t.id === track.id);
      if (!live) return [];
      const pos = resolveTransportBar(current, transport, barIndex);
      if (!pos) return [];
      return renderBar(live, pos.section, pos.barInSection, barSeconds);
    },
  }));
}
