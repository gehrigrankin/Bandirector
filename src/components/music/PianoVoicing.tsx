"use client";

import { parseChord, noteToSemitone } from "@/lib/music/chord";
import { pianoTriadOffsets } from "@/lib/music/diagrams";

interface Props {
  chord: string;
  width?: number;
}

const WHITE_NOTES = [0, 2, 4, 5, 7, 9, 11];
const BLACK_NOTES = [1, 3, 6, 8, 10];

export function PianoVoicing({ chord, width = 320 }: Props) {
  const parsed = parseChord(chord);
  const rootSemitone = parsed ? noteToSemitone(parsed.root) : null;

  const offsets = pianoTriadOffsets(chord);
  const highlightedSemitones = new Set(
    rootSemitone !== null ? offsets.map((o) => (rootSemitone + o) % 12) : [],
  );

  const octaves = 2;
  const whiteCount = 7 * octaves;
  const whiteW = width / whiteCount;
  const whiteH = Math.min(120, width * 0.4);
  const blackW = whiteW * 0.6;
  const blackH = whiteH * 0.6;

  return (
    <svg
      width={width}
      height={whiteH}
      viewBox={`0 0 ${width} ${whiteH}`}
      role="img"
      aria-label={`${chord} piano voicing`}
    >
      {Array.from({ length: whiteCount }).map((_, i) => {
        const oct = Math.floor(i / 7);
        const pc = WHITE_NOTES[i % 7];
        const semitone = (pc + oct * 12) % 12;
        const highlight = highlightedSemitones.has(semitone);
        return (
          <rect
            key={i}
            x={i * whiteW}
            y={0}
            width={whiteW - 1}
            height={whiteH}
            fill={highlight ? "var(--tw-color-accent, #f59e0b)" : "#fafafa"}
            stroke="#222"
            strokeWidth={1}
          />
        );
      })}
      {Array.from({ length: whiteCount }).map((_, i) => {
        const whiteSlot = i % 7;
        if (whiteSlot === 2 || whiteSlot === 6) return null;
        const oct = Math.floor(i / 7);
        const pc = WHITE_NOTES[whiteSlot] + 1;
        const blackPc = BLACK_NOTES.includes(pc) ? pc : null;
        if (blackPc === null) return null;
        const semitone = (blackPc + oct * 12) % 12;
        const highlight = highlightedSemitones.has(semitone);
        const x = (i + 1) * whiteW - blackW / 2;
        return (
          <rect
            key={`b${i}`}
            x={x}
            y={0}
            width={blackW}
            height={blackH}
            fill={highlight ? "#f59e0b" : "#111"}
            stroke="#000"
          />
        );
      })}
    </svg>
  );
}
