"use client";

interface Props {
  /** Left-hand pitch classes (0–11), shown in the lower octave. */
  bass: number[];
  /** Right-hand chord pitch classes (0–11), shown in the upper octave. */
  chord: number[];
  width?: number;
}

const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11];
// black key after white index → pitch class
const BLACK_AFTER: Record<number, number> = { 0: 1, 1: 3, 3: 6, 4: 8, 5: 10 };

const RH = "#f5a524";
const LH = "#a76a24";
const WHITE = "#20202a";
const BLACK = "#0d0d11";
const STROKE = "#3a3a44";

export function HandsKeyboard({ bass, chord, width = 360 }: Props) {
  const octaves = 2;
  const whiteCount = 7 * octaves;
  const whiteW = width / whiteCount;
  const whiteH = Math.min(120, width * 0.34);
  const blackW = whiteW * 0.62;
  const blackH = whiteH * 0.62;

  const bassSet = new Set(bass);
  const chordSet = new Set(chord);

  function fill(oct: number, pc: number, white: boolean) {
    if (oct === 0 && bassSet.has(pc)) return LH;
    if (oct === 1 && chordSet.has(pc)) return RH;
    return white ? WHITE : BLACK;
  }

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${whiteH}`}
      role="img"
      aria-label="What your hands play"
      style={{ maxWidth: width }}
    >
      {Array.from({ length: whiteCount }).map((_, i) => {
        const oct = Math.floor(i / 7);
        const pc = WHITE_PCS[i % 7];
        return (
          <rect
            key={`w${i}`}
            x={i * whiteW}
            y={0}
            width={whiteW - 1}
            height={whiteH}
            rx={3}
            fill={fill(oct, pc, true)}
            stroke={STROKE}
            strokeWidth={1}
          />
        );
      })}
      {Array.from({ length: whiteCount }).map((_, i) => {
        const slot = i % 7;
        const pc = BLACK_AFTER[slot];
        if (pc === undefined) return null;
        const oct = Math.floor(i / 7);
        const x = (i + 1) * whiteW - blackW / 2;
        return (
          <rect
            key={`b${i}`}
            x={x}
            y={0}
            width={blackW}
            height={blackH}
            rx={2}
            fill={fill(oct, pc, false)}
            stroke="#000"
            strokeWidth={0.5}
          />
        );
      })}
    </svg>
  );
}
