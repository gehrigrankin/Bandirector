/**
 * Studio audio engine.
 *
 * Wraps smplr: one shared AudioContext + master gain, lazily-loaded sample
 * instruments (Soundfont / DrumMachine), and a single Sequencer that loops a
 * bar and dispatches every track in sync. "Locking" a loop = adding a track to
 * the sequencer; layered instruments stay sample-accurately together because
 * they share one transport.
 */
import { DrumMachine, Sequencer, Soundfont } from "smplr";
import { chordToMidi } from "@/lib/music/chord";
import { getStudioInstrument } from "./instruments";
import { STYLES, type DrumVoice } from "./patterns";

export interface StudioTrack {
  id: string;
  instrumentId: string;
  root: string;
  quality: string;
  styleId: string;
  octave: number;
  volume: number; // 0..1
  muted: boolean;
  solo: boolean;
}

const PPQ = 480;
const BEATS_PER_BAR = 4;
const BARS = 1;
const BAR_TICKS = PPQ * BEATS_PER_BAR;

type Loaded = {
  inst: { start: (e: unknown) => unknown; getGroupNames?: () => string[] };
  ready: Promise<void>;
  ok: boolean;
};

function pickVoice(groups: string[], voice: DrumVoice): string {
  const patterns: Record<DrumVoice, RegExp> = {
    kick: /kick|bass|bd/i,
    snare: /snare|sd|clap|rim/i,
    hat: /hat|hh|hi/i,
  };
  return groups.find((g) => patterns[voice].test(g)) ?? groups[0] ?? voice;
}

export class StudioEngine {
  readonly ctx: AudioContext;
  private readonly master: GainNode;
  private readonly seq: ReturnType<typeof Sequencer>;
  private readonly cache = new Map<string, Loaded>();
  private rebuildSeq = 0;

  constructor() {
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.85;
    this.master.connect(this.ctx.destination);
    this.seq = Sequencer(this.ctx, { bpm: 100, ppq: PPQ, loop: true });
  }

  private load(instrumentId: string): Loaded {
    const existing = this.cache.get(instrumentId);
    if (existing) return existing;

    const def = getStudioInstrument(instrumentId);
    const inst =
      def.kind === "drum"
        ? DrumMachine(this.ctx, {
            instrument: def.drumMachine,
            destination: this.master,
            volume: 100,
          })
        : Soundfont(this.ctx, {
            instrument: def.soundfont,
            kit: "FluidR3_GM",
            destination: this.master,
            volume: 100,
          });

    const entry: Loaded = {
      inst: inst as Loaded["inst"],
      ok: false,
      ready: inst.ready
        .then(() => {
          entry.ok = true;
        })
        .catch(() => {
          entry.ok = false;
        }),
    };
    this.cache.set(instrumentId, entry);
    return entry;
  }

  /** Pre-warm an instrument's samples (e.g. when its pill is selected). */
  preload(instrumentId: string): Promise<void> {
    return this.load(instrumentId).ready;
  }

  isLoaded(instrumentId: string): boolean {
    return this.cache.get(instrumentId)?.ok ?? false;
  }

  /**
   * Replace the sequencer's tracks. Loaded once, the loop reflects exactly the
   * tracks passed. Safe to call rapidly; stale rebuilds are discarded.
   */
  async setTracks(tracks: StudioTrack[]): Promise<void> {
    const token = ++this.rebuildSeq;
    const entries = tracks.map((t) => this.load(t.instrumentId));
    await Promise.all(entries.map((e) => e.ready));
    if (token !== this.rebuildSeq) return; // superseded

    this.seq.clearTracks();
    tracks.forEach((t, i) => {
      const def = getStudioInstrument(t.instrumentId);
      const style = STYLES[t.styleId];
      const entry = entries[i];
      if (!style) return;

      let notes: { note: string | number; at: number; duration?: number; velocity: number }[] = [];
      if (def.kind === "drum" && style.drum) {
        const groups = entry.inst.getGroupNames?.() ?? [];
        const hits = style.drum({ chord: [], ppq: PPQ, beatsPerBar: BEATS_PER_BAR });
        notes = tile(
          hits.map((h) => ({ note: pickVoice(groups, h.voice), at: h.at, velocity: h.velocity })),
        );
      } else if (style.pitched) {
        const chord = chordToMidi(t.root, t.quality, t.octave);
        const events = style.pitched({ chord, ppq: PPQ, beatsPerBar: BEATS_PER_BAR });
        notes = tile(events);
      }

      this.seq.addTrack(entry.inst, notes, {
        id: t.id,
        volume: t.volume,
        muted: t.muted,
        solo: t.solo,
      });
    });

    this.seq.loop = true;
    this.seq.loopStart = 0;
    this.seq.loopEnd = BARS * BAR_TICKS;
  }

  setTrackVolume(id: string, volume: number) {
    this.seq.setTrackVolume(id, volume);
  }

  setTrackMuted(id: string, muted: boolean) {
    if (muted) this.seq.muteTrack(id);
    else this.seq.unmuteTrack(id);
  }

  setTrackSolo(id: string, solo: boolean) {
    if (solo) this.seq.soloTrack(id);
    else this.seq.unsoloTrack(id);
  }

  setBpm(bpm: number) {
    this.seq.bpm = bpm;
  }

  setMasterVolume(v: number) {
    this.master.gain.value = v;
  }

  async play() {
    if (this.ctx.state !== "running") await this.ctx.resume();
    this.seq.start();
  }

  stop() {
    this.seq.stop();
  }

  dispose() {
    this.seq.stop();
    void this.ctx.close();
  }
}

function tile<T extends { at: number }>(events: T[]): T[] {
  if (BARS <= 1) return events;
  const out: T[] = [];
  for (let b = 0; b < BARS; b++) {
    for (const e of events) out.push({ ...e, at: e.at + b * BAR_TICKS });
  }
  return out;
}
