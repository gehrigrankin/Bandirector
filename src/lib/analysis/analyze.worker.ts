/// <reference lib="webworker" />

import type { AnalysisResult } from "@/lib/analysis/analyze";
import type { BeatInfo, ChordHit, Feel } from "@/lib/types/database";

// Minimal offline Web Worker analyzer.
//
// This is a heuristic baseline so the end-to-end pipeline works without the
// WASM bundles. In production, swap in essentia.js / chord-detector here:
//   - tempo: essentia.RhythmExtractor2013
//   - key:   essentia.KeyExtractor
//   - chords: chord-detector (CNN) over chroma frames
//
// The browser baseline uses autocorrelation for tempo and chroma-template
// matching for key/chords. It is intentionally presented as an estimate: the
// correction screen is where users bring the timeline to 100%.

declare const self: DedicatedWorkerGlobalScope;

type Msg =
  | { type: "analyze"; buffer: ArrayBuffer }
  | { type: "unknown" };

self.addEventListener("message", async (ev: MessageEvent<Msg>) => {
  try {
    if (ev.data.type !== "analyze") return;
    const result = await analyze(ev.data.buffer);
    self.postMessage({ type: "done", result });
  } catch (e) {
    self.postMessage({
      type: "error",
      message: e instanceof Error ? e.message : "Analysis failed",
    });
  }
});

function report(pct: number, label?: string) {
  self.postMessage({ type: "progress", pct, label });
}

async function analyze(buffer: ArrayBuffer): Promise<AnalysisResult> {
  report(5, "Decoding audio…");

  const OfflineCtx =
    (self as unknown as { OfflineAudioContext?: typeof OfflineAudioContext })
      .OfflineAudioContext ?? OfflineAudioContext;

  const probeCtx = new OfflineCtx(1, 44100, 44100);
  const decoded = await probeCtx.decodeAudioData(buffer.slice(0));

  const sampleRate = decoded.sampleRate;
  const duration = decoded.duration;

  report(25, "Finding the beat…");
  const samples = downmixMono(decoded);
  const bpm = estimateBpm(samples, sampleRate);

  report(45, "Tracking beats…");
  const beats = gridBeats(bpm, duration);

  report(65, "Estimating key…");
  const chroma = averageChroma(samples, sampleRate);
  const key = estimateKey(chroma);

  report(80, "Detecting chords…");
  const chords = chordTrackFromAudio(samples, sampleRate, beats);

  report(95, "Finalizing…");
  const feel = guessFeel(bpm);

  return { key, bpm, feel, beats, chords };
}

function downmixMono(buf: AudioBuffer): Float32Array {
  if (buf.numberOfChannels === 1) return buf.getChannelData(0);
  const left = buf.getChannelData(0);
  const right = buf.getChannelData(1);
  const out = new Float32Array(left.length);
  for (let i = 0; i < left.length; i++) out[i] = (left[i] + right[i]) * 0.5;
  return out;
}

function estimateBpm(samples: Float32Array, sampleRate: number): number {
  const windowSize = 1024;
  const hop = 512;
  const envelope: number[] = [];
  for (let i = 0; i + windowSize < samples.length; i += hop) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      const v = samples[i + j];
      sum += v * v;
    }
    envelope.push(Math.sqrt(sum / windowSize));
  }
  const envSampleRate = sampleRate / hop;

  const minBpm = 60;
  const maxBpm = 180;
  const minLag = Math.floor((60 / maxBpm) * envSampleRate);
  const maxLag = Math.floor((60 / minBpm) * envSampleRate);

  let bestLag = minLag;
  let bestScore = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let score = 0;
    for (let i = 0; i + lag < envelope.length; i++) {
      score += envelope[i] * envelope[i + lag];
    }
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }
  const bpm = 60 / (bestLag / envSampleRate);
  return Math.round(bpm);
}

function gridBeats(bpm: number, duration: number): BeatInfo[] {
  const beatLen = 60 / bpm;
  const beats: BeatInfo[] = [];
  let t = 0;
  let pos = 0;
  while (t < duration) {
    beats.push({ time: t, position: (pos % 4) + 1 });
    t += beatLen;
    pos += 1;
  }
  return beats;
}

function averageChroma(samples: Float32Array, sampleRate: number): Float32Array {
  const chroma = new Float32Array(12);
  const frameSize = 4096;
  const hop = 2048;
  const totalFrames = Math.floor((samples.length - frameSize) / hop);
  const take = Math.min(totalFrames, 1000);
  const stride = Math.max(1, Math.floor(totalFrames / take));

  const referenceA = 440;
  for (let f = 0; f < take; f++) {
    const start = f * stride * hop;
    const frame = samples.subarray(start, start + frameSize);
    const spectrum = magnitudeSpectrum(frame);
    for (let k = 1; k < spectrum.length; k++) {
      const freq = (k * sampleRate) / frameSize;
      if (freq < 80 || freq > 2000) continue;
      const semitone = Math.round(12 * Math.log2(freq / referenceA)) + 9;
      const pc = ((semitone % 12) + 12) % 12;
      chroma[pc] += spectrum[k];
    }
  }
  let max = 0;
  for (let i = 0; i < 12; i++) if (chroma[i] > max) max = chroma[i];
  if (max > 0) for (let i = 0; i < 12; i++) chroma[i] /= max;
  return chroma;
}

function magnitudeSpectrum(frame: Float32Array): Float32Array {
  const n = frame.length;
  const re = new Float32Array(n);
  const im = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
    re[i] = frame[i] * w;
  }
  fft(re, im);
  const mag = new Float32Array(n / 2);
  for (let k = 0; k < n / 2; k++) {
    mag[k] = Math.sqrt(re[k] * re[k] + im[k] * im[k]);
  }
  return mag;
}

function fft(re: Float32Array, im: Float32Array) {
  const n = re.length;
  let j = 0;
  for (let i = 1; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j |= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wlenR = Math.cos(ang);
    const wlenI = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wr = 1;
      let wi = 0;
      for (let k = 0; k < len / 2; k++) {
        const uR = re[i + k];
        const uI = im[i + k];
        const vR = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi;
        const vI = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
        re[i + k] = uR + vR;
        im[i + k] = uI + vI;
        re[i + k + len / 2] = uR - vR;
        im[i + k + len / 2] = uI - vI;
        const nwr = wr * wlenR - wi * wlenI;
        wi = wr * wlenI + wi * wlenR;
        wr = nwr;
      }
    }
  }
}

const KEY_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const MAJOR_PROFILE = [
  6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88,
];
const MINOR_PROFILE = [
  6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17,
];

function estimateKey(chroma: Float32Array): string {
  let bestKey = "C";
  let bestScore = -Infinity;
  for (let i = 0; i < 12; i++) {
    let majorScore = 0;
    let minorScore = 0;
    for (let j = 0; j < 12; j++) {
      majorScore += chroma[(j + i) % 12] * MAJOR_PROFILE[j];
      minorScore += chroma[(j + i) % 12] * MINOR_PROFILE[j];
    }
    if (majorScore > bestScore) {
      bestScore = majorScore;
      bestKey = KEY_NAMES[i];
    }
    if (minorScore > bestScore) {
      bestScore = minorScore;
      bestKey = `${KEY_NAMES[i]}m`;
    }
  }
  return bestKey;
}

function chordTrackFromAudio(samples: Float32Array, sampleRate: number, beats: BeatInfo[]): ChordHit[] {
  if (beats.length < 2) return [];
  const out: ChordHit[] = [];
  let beatIdx = 0;
  while (beatIdx < beats.length - 4) {
    const start = beats[beatIdx].time;
    const end = beats[Math.min(beatIdx + 4, beats.length - 1)].time;
    const duration = end - start;
    if (duration <= 0) break;
    const chroma = windowChroma(samples, sampleRate, start, end);
    const match = bestChord(chroma);
    out.push({ time: start, duration, chord: match.chord, confidence: match.confidence, verified: false });
    beatIdx += 4;
  }
  return out;
}

function windowChroma(samples: Float32Array, sampleRate: number, startTime: number, endTime: number): Float32Array {
  const frameSize = 4096;
  const hop = 2048;
  const start = Math.max(0, Math.floor(startTime * sampleRate));
  const end = Math.min(samples.length, Math.ceil(endTime * sampleRate));
  const chroma = new Float32Array(12);
  let frames = 0;
  for (let offset = start; offset + frameSize <= end; offset += hop) {
    const spectrum = magnitudeSpectrum(samples.subarray(offset, offset + frameSize));
    for (let k = 1; k < spectrum.length; k++) {
      const freq = (k * sampleRate) / frameSize;
      if (freq < 70 || freq > 1600) continue;
      const semitone = Math.round(12 * Math.log2(freq / 440)) + 9;
      chroma[((semitone % 12) + 12) % 12] += spectrum[k];
    }
    frames += 1;
  }
  if (!frames) return chroma;
  let max = 0;
  for (let i = 0; i < 12; i++) max = Math.max(max, chroma[i]);
  if (max > 0) for (let i = 0; i < 12; i++) chroma[i] /= max;
  return chroma;
}

function bestChord(chroma: Float32Array): { chord: string; confidence: number } {
  let best = { chord: "N", score: 0 };
  let second = 0;
  for (let root = 0; root < 12; root++) {
    for (const minor of [false, true]) {
      const third = (root + (minor ? 3 : 4)) % 12;
      const fifth = (root + 7) % 12;
      const seventh = (root + 10) % 12;
      const score = chroma[root] * 1.6 + chroma[third] * 1.05 + chroma[fifth] * 1.25 + chroma[seventh] * 0.2;
      if (score > best.score) { second = best.score; best = { chord: `${KEY_NAMES[root]}${minor ? "m" : ""}`, score }; }
      else if (score > second) second = score;
    }
  }
  const confidence = best.score > 0 ? Math.max(0, Math.min(1, (best.score - second) / best.score + 0.45)) : 0;
  return { chord: best.chord, confidence: Number(confidence.toFixed(2)) };
}

function guessFeel(bpm: number): Feel {
  if (bpm < 75) return "ballad";
  if (bpm < 95) return "folk";
  if (bpm < 110) return "pop";
  if (bpm < 130) return "rock";
  if (bpm < 150) return "funk";
  return "rock";
}
