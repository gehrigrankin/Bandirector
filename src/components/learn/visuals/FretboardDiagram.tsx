"use client";

import type { FretboardVisual } from "@/lib/learning/visuals/types";
import { fretPositionMidi } from "@/lib/learning/notes";
import { ensureLessonAudio, playNote } from "@/lib/learning/lessonAudio";

const FRET_W = 56;
const STRING_GAP = 22;
const LEFT = 34;
const TOP = 18;
const INLAYS = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21]);

export function FretboardDiagram({
  spec,
  accent,
}: {
  spec: FretboardVisual;
  accent: string;
}) {
  const startFret = spec.startFret ?? 0;
  const fretCount = spec.fretCount ?? 5;
  const width = LEFT + fretCount * FRET_W + 14;
  const height = TOP + 5 * STRING_GAP + 34;

  async function tap(string: number, fret: number) {
    await ensureLessonAudio("guitar");
    playNote("guitar", fretPositionMidi(string, fret), 1100);
  }

  /** x-center for a fret number (open notes sit just left of the nut). */
  function fretX(fret: number) {
    if (fret === 0 && startFret === 0) return LEFT - 15;
    return LEFT + (fret - startFret - 0.5) * FRET_W;
  }

  return (
    <div className="flex max-w-full flex-col gap-1.5 rounded-xl border border-line-soft bg-black/20 p-3">
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label={spec.label}>
          {/* nut */}
          {startFret === 0 ? (
            <rect x={LEFT - 3} y={TOP} width={3.5} height={5 * STRING_GAP} fill="#c9c9d4" rx={1} />
          ) : null}
          {/* frets */}
          {Array.from({ length: fretCount + 1 }, (_, i) => (
            <line
              key={i}
              x1={LEFT + i * FRET_W}
              y1={TOP}
              x2={LEFT + i * FRET_W}
              y2={TOP + 5 * STRING_GAP}
              stroke="#2a2a34"
              strokeWidth={1.2}
            />
          ))}
          {/* inlay markers + fret numbers */}
          {Array.from({ length: fretCount }, (_, i) => {
            const fret = startFret + i + 1;
            const x = LEFT + (i + 0.5) * FRET_W;
            return (
              <g key={fret}>
                {INLAYS.has(fret) ? (
                  <circle cx={x} cy={TOP + 2.5 * STRING_GAP} r={4} fill="#1e1e26" />
                ) : null}
                <text
                  x={x}
                  y={TOP + 5 * STRING_GAP + 18}
                  fontSize={10}
                  fill="#6b6b78"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                >
                  {fret}
                </text>
              </g>
            );
          })}
          {/* strings: string 1 (high E) on top */}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={i}
              x1={LEFT - (startFret === 0 ? 3 : 0)}
              y1={TOP + i * STRING_GAP}
              x2={LEFT + fretCount * FRET_W}
              y2={TOP + i * STRING_GAP}
              stroke="#3a3a46"
              strokeWidth={0.8 + i * 0.22}
            />
          ))}
          {/* notes */}
          {spec.notes.map((n, idx) => {
            const y = TOP + (n.string - 1) * STRING_GAP;
            const x = fretX(n.fret);
            return (
              <g
                key={idx}
                onClick={() => tap(n.string, n.fret)}
                className="cursor-pointer"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={9}
                  fill={n.root ? accent : "#1c1c24"}
                  stroke={accent}
                  strokeWidth={n.root ? 0 : 1.4}
                />
                {n.label ? (
                  <text
                    x={x}
                    y={y + 3.5}
                    fontSize={9}
                    fill={n.root ? "#0d0d11" : "#c9c9d4"}
                    textAnchor="middle"
                    fontWeight={600}
                  >
                    {n.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      <span className="text-[12px] font-semibold text-text-soft">
        {spec.label}
        <span className="ml-2 font-normal text-text-dim">tap notes to hear them</span>
      </span>
    </div>
  );
}
