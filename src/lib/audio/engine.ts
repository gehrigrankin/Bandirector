// Audio engine for the Songwriter Studio.
//
// Two responsibilities:
//   1. Own a single AudioContext + master gain, and lazily build one real
//      sampled instrument (smplr Soundfont / DrumMachine) per track, each on
//      its own gain node so volume / mute / solo are per-track.
//   2. Drive everything from one lookahead scheduler (the Web Audio "two
//      clocks" pattern): a setInterval tick schedules the next bar of note
//      events slightly ahead of the audio clock, so every locked loop stays
//      sample-accurately in sync under one global BPM + bar clock.

import { DrumMachine, Soundfont } from "smplr";
import { getInstrument } from "@/lib/audio/instruments";

export const BEATS_PER_BAR = 4;

/** A single note to fire within a bar. `time` is an offset (seconds) from the
 *  bar start; the scheduler adds the bar's absolute start time. For pitched
 *  instruments `note` is a MIDI number; for drums it is a logical token
 *  ("kick" | "snare" | "hihat" | "openhat" | "clap"). */
export interface BarEvent {
  note: number | string;
  time: number;
  duration?: number;
  velocity?: number;
}

/** What the React layer hands the scheduler each bar. `getBarEvents` is a
 *  closure over the track's instrument + style; `barIndex` is the shared,
 *  monotonically increasing bar counter so every layer lands on the same step
 *  of the progression. */
export interface ScheduledTrack {
  id: string;
  instrumentId: string;
  volume: number; // 0..1
  muted: boolean;
  solo: boolean;
  noteLength: number; // sustain multiplier (0.3 short … 2 long)
  reverb: number; // 0 dry … 1 wet
  getBarEvents: (barSeconds: number, barIndex: number) => BarEvent[];
}

type SmplrInstrument = ReturnType<typeof Soundfont> | ReturnType<typeof DrumMachine>;

interface Handle {
  instrumentId: string;
  gain: GainNode;
  send: GainNode; // reverb send
  instrument: SmplrInstrument;
  isDrums: boolean;
  loaded: boolean;
  /** logical drum token -> real sample name, populated once a kit loads */
  drumMap?: Record<string, string | null>;
}

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.25; // seconds

function resolveDrumName(logical: string, names: string[]): string | null {
  const find = (re: RegExp) => names.find((n) => re.test(n)) ?? null;
  switch (logical) {
    case "kick":
      return find(/kick|bass/i) ?? names[0] ?? null;
    case "snare":
      return find(/snare/i) ?? find(/clap/i);
    case "hihat":
      return find(/clos.*hat|hat.*clos|hi-?hat|closed/i) ?? find(/hat/i);
    case "openhat":
      return find(/open.*hat|hat.*open|open/i) ?? find(/hat/i);
    case "clap":
      return find(/clap/i) ?? find(/snare/i);
    default:
      return find(new RegExp(logical, "i"));
  }
}

interface ScheduledBar {
  start: number;
  dur: number;
  index: number;
}

class Engine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverbWet: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private handles = new Map<string, Handle>();

  private timer: ReturnType<typeof setInterval> | null = null;
  private nextBarTime = 0;
  private barIndex = 0;
  private scheduledBars: ScheduledBar[] = [];
  private getTracks: (() => ScheduledTrack[]) | null = null;

  bpm = 100;
  masterVolume = 0.9;
  swing = 0; // 0 = straight, ~0.6 = heavy shuffle
  humanize = 0.5; // 0 = robotic/quantized, 1 = loose
  // Note length (sustain) and reverb are per-track (see ScheduledTrack).

  get running(): boolean {
    return this.timer !== null;
  }

  private context(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.masterVolume;
      this.master.connect(this.ctx.destination);

      // Shared reverb return: per-track sends feed the convolver, whose wet
      // output mixes back to the destination. The impulse response is generated,
      // so there's no asset to fetch.
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.makeImpulse(this.ctx, 2.4, 2.6);
      this.reverbWet = this.ctx.createGain();
      this.reverbWet.gain.value = 0.9;
      this.convolver.connect(this.reverbWet);
      this.reverbWet.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  /** Must be called from a user gesture (first Play) to satisfy autoplay policy. */
  async resume(): Promise<void> {
    const ctx = this.context();
    if (ctx.state !== "running") await ctx.resume();
  }

  setMasterVolume(v: number) {
    this.masterVolume = v;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
    }
  }

  setBpm(bpm: number) {
    this.bpm = bpm;
  }

  setSwing(v: number) {
    this.swing = Math.max(0, Math.min(0.7, v));
  }

  setHumanize(v: number) {
    this.humanize = Math.max(0, Math.min(1, v));
  }

  /** Current transport position for the UI playhead, or null when idle.
   *  `phase` is 0..1 within the audible bar. */
  getPlayhead(): { barIndex: number; phase: number } | null {
    if (!this.timer || !this.ctx) return null;
    const now = this.ctx.currentTime;
    for (let i = this.scheduledBars.length - 1; i >= 0; i--) {
      const bar = this.scheduledBars[i];
      if (now >= bar.start && now < bar.start + bar.dur) {
        return { barIndex: bar.index, phase: (now - bar.start) / bar.dur };
      }
    }
    return null;
  }

  barSeconds(): number {
    return (60 / this.bpm) * BEATS_PER_BAR;
  }

  private ensureHandle(track: ScheduledTrack): Handle {
    const existing = this.handles.get(track.id);
    if (existing && existing.instrumentId === track.instrumentId) return existing;
    if (existing) this.disposeHandle(existing);

    const ctx = this.context();
    const def = getInstrument(track.instrumentId);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master!);

    // Per-track reverb send: gain -> send -> shared convolver.
    const send = ctx.createGain();
    send.gain.value = 0;
    gain.connect(send);
    send.connect(this.convolver!);

    let instrument: SmplrInstrument;
    if (def.isDrums) {
      instrument = DrumMachine(ctx, { destination: gain });
    } else {
      // MusyngKite is the richer, more natural-sounding of smplr's two kits.
      instrument = Soundfont(ctx, {
        instrument: def.gm,
        destination: gain,
        kit: "MusyngKite",
      });
    }

    const handle: Handle = {
      instrumentId: track.instrumentId,
      gain,
      send,
      instrument,
      isDrums: !!def.isDrums,
      loaded: false,
    };

    instrument.load.then(() => {
      handle.loaded = true;
      if (def.isDrums) {
        const names = (instrument as ReturnType<typeof DrumMachine>).getSampleNames();
        handle.drumMap = {
          kick: resolveDrumName("kick", names),
          snare: resolveDrumName("snare", names),
          hihat: resolveDrumName("hihat", names),
          openhat: resolveDrumName("openhat", names),
          clap: resolveDrumName("clap", names),
        };
      }
    });

    this.handles.set(track.id, handle);
    return handle;
  }

  private disposeHandle(handle: Handle) {
    try {
      handle.instrument.stop();
      handle.instrument.dispose();
    } catch {
      /* already disposed */
    }
    handle.send.disconnect();
    handle.gain.disconnect();
  }

  /** Drop instruments for tracks that no longer exist. */
  private prune(activeIds: Set<string>) {
    for (const [id, handle] of this.handles) {
      if (!activeIds.has(id)) {
        this.disposeHandle(handle);
        this.handles.delete(id);
      }
    }
  }

  private scheduleBar(barStart: number, barIndex: number) {
    if (!this.getTracks) return;
    const tracks = this.getTracks();
    const ids = new Set(tracks.map((t) => t.id));
    this.prune(ids);

    const anySolo = tracks.some((t) => t.solo);
    const barSeconds = this.barSeconds();

    // Record this bar for the UI playhead; drop bars that have finished.
    this.scheduledBars.push({ start: barStart, dur: barSeconds, index: barIndex });
    const cutoff = this.context().currentTime - 0.2;
    while (this.scheduledBars.length > 0 && this.scheduledBars[0].start + this.scheduledBars[0].dur < cutoff) {
      this.scheduledBars.shift();
    }

    for (const track of tracks) {
      const handle = this.ensureHandle(track); // starts loading even if silent
      const audible = anySolo ? track.solo : !track.muted;
      const now = this.context().currentTime;
      handle.gain.gain.setTargetAtTime(audible ? track.volume : 0, now, 0.01);
      handle.send.gain.setTargetAtTime(audible ? track.reverb * 0.5 : 0, now, 0.02);
      if (!audible || !handle.loaded) continue;

      const events = track.getBarEvents(barSeconds, barIndex);
      const eighth = barSeconds / 8;
      for (const ev of events) {
        let note = ev.note;
        if (handle.isDrums) {
          const resolved = handle.drumMap?.[note as string];
          if (!resolved) continue;
          note = resolved;
        }

        // Groove + humanization: what turns a quantized grid into a player.
        let offset = ev.time;
        // Swing: push the off-beat eighth-notes later.
        if (this.swing > 0) {
          const slot = Math.round(offset / eighth);
          if (slot % 2 === 1) offset += this.swing * eighth * 0.6;
        }
        // Micro-timing jitter (±~12ms at full humanize).
        offset = Math.max(0, offset + (Math.random() * 2 - 1) * 0.024 * this.humanize);
        // Velocity variation (±~26 at full humanize) so nothing is mechanical.
        let velocity = (ev.velocity ?? 80) + (Math.random() * 2 - 1) * 26 * this.humanize;
        // Light metric accent: notes on the beat sing a little over off-beats.
        const beatPos = offset / (barSeconds / 4);
        velocity += Math.abs(beatPos - Math.round(beatPos)) < 0.12 ? 6 : -5;
        velocity = Math.max(1, Math.min(127, Math.round(velocity)));

        // Note length (sustain): scale melodic durations; leave drum one-shots
        // alone so they aren't truncated. Longer notes get a longer release tail.
        const duration =
          handle.isDrums || ev.duration == null
            ? ev.duration
            : ev.duration * track.noteLength;

        handle.instrument.start({
          note,
          time: barStart + offset,
          duration,
          velocity,
          ampRelease: 0.12 + track.noteLength * 0.2,
        });
      }
    }
  }

  private tick = () => {
    const ctx = this.context();
    while (this.nextBarTime < ctx.currentTime + SCHEDULE_AHEAD) {
      this.scheduleBar(this.nextBarTime, this.barIndex);
      this.nextBarTime += this.barSeconds();
      this.barIndex += 1;
    }
  };

  start(getTracks: () => ScheduledTrack[]) {
    if (this.timer) return;
    this.getTracks = getTracks;
    this.barIndex = 0;
    this.scheduledBars = [];
    this.nextBarTime = this.context().currentTime + 0.12;
    this.tick();
    this.timer = setInterval(this.tick, LOOKAHEAD_MS);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.scheduledBars = [];
    for (const handle of this.handles.values()) {
      try {
        handle.instrument.stop();
      } catch {
        /* noop */
      }
    }
  }
}

let engine: Engine | null = null;

/** Lazily create the shared engine (client-side only). */
export function getEngine(): Engine {
  if (!engine) engine = new Engine();
  return engine;
}
