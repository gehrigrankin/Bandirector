"use client";

import type { BeatInfo, ChordHit, Feel } from "@/lib/types/database";

export interface AnalysisResult {
  key?: string;
  bpm?: number;
  feel?: Feel;
  beats: BeatInfo[];
  chords: ChordHit[];
}

export type ProgressFn = (pct: number, label?: string) => void;

/**
 * Client-side audio analysis. Delegates to a Web Worker (WASM: essentia.js /
 * chord-detector in production). This driver falls back to a lightweight
 * pure-browser heuristic so the pipeline works end-to-end before the WASM
 * bundles are wired up.
 */
export async function analyzeAudioFile(
  file: File,
  onProgress: ProgressFn,
): Promise<AnalysisResult> {
  onProgress(5, "Decoding audio…");
  const arrayBuffer = await file.arrayBuffer();

  return new Promise<AnalysisResult>((resolve, reject) => {
    const worker = new Worker(
      new URL("./analyze.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as
        | { type: "progress"; pct: number; label?: string }
        | { type: "done"; result: AnalysisResult }
        | { type: "error"; message: string };

      if (msg.type === "progress") {
        onProgress(msg.pct, msg.label);
      } else if (msg.type === "done") {
        worker.terminate();
        resolve(msg.result);
      } else if (msg.type === "error") {
        worker.terminate();
        reject(new Error(msg.message));
      }
    };
    worker.onerror = (err) => {
      worker.terminate();
      reject(err.error ?? new Error(err.message));
    };
    worker.postMessage({ type: "analyze", buffer: arrayBuffer }, [arrayBuffer]);
  });
}
