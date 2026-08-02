"use client";

import { Volume2 } from "lucide-react";
import type { GuitarChordVisual } from "@/lib/learning/visuals/types";
import { chordShapeMidi } from "@/lib/learning/notes";
import { ensureLessonAudio, playChord } from "@/lib/learning/lessonAudio";

const W = 150;
const H = 176;
const LEFT = 22;
const TOP = 40;
const GRID_W = 105;
const STRING_GAP = GRID_W / 5;

export function GuitarChordDiagram({
  spec,
  accent,
}: {
  spec: GuitarChordVisual;
  accent: string;
}) {
  const baseFret = spec.baseFret ?? 1;
  const fretted = spec.frets.filter((f): f is number => f !== null && f > 0);
  const windowFrets = Math.max(4, ...fretted);
  const FRET_GAP = 118 / windowFrets;

  async function play() {
    await ensureLessonAudio("guitar");
    playChord("guitar", chordShapeMidi(spec.frets, baseFret));
  }

  return (
    <button
      onClick={play}
      className="group flex flex-col items-center gap-1 rounded-xl border border-line-soft bg-black/20 px-3 pb-2.5 pt-3 transition-colors hover:border-line"
      title={`Play ${spec.label}`}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-label={spec.label}>
        {/* nut or base-fret label */}
        {baseFret === 1 ? (
          <rect x={LEFT} y={TOP - 4} width={GRID_W} height={4} fill="#c9c9d4" rx={1} />
        ) : (
          <text
            x={LEFT - 8}
            y={TOP + FRET_GAP / 2 + 4}
            fontSize={11}
            fill="#9a9aa8"
            textAnchor="end"
            fontFamily="ui-monospace, monospace"
          >
            {baseFret}
          </text>
        )}
        {/* frets */}
        {Array.from({ length: windowFrets + 1 }, (_, i) => (
          <line
            key={i}
            x1={LEFT}
            y1={TOP + i * FRET_GAP}
            x2={LEFT + GRID_W}
            y2={TOP + i * FRET_GAP}
            stroke="#2a2a34"
            strokeWidth={1}
          />
        ))}
        {/* strings */}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={i}
            x1={LEFT + i * STRING_GAP}
            y1={TOP}
            x2={LEFT + i * STRING_GAP}
            y2={TOP + windowFrets * FRET_GAP}
            stroke="#3a3a46"
            strokeWidth={1}
          />
        ))}
        {/* per-string markers */}
        {spec.frets.map((f, i) => {
          const x = LEFT + i * STRING_GAP;
          if (f === null) {
            return (
              <text key={i} x={x} y={TOP - 10} fontSize={11} fill="#6b6b78" textAnchor="middle">
                ×
              </text>
            );
          }
          if (f === 0) {
            return (
              <circle
                key={i}
                cx={x}
                cy={TOP - 14}
                r={4}
                fill="none"
                stroke="#9a9aa8"
                strokeWidth={1.3}
              />
            );
          }
          const y = TOP + (f - 0.5) * FRET_GAP;
          const finger = spec.fingers?.[i];
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={8.5} fill={accent} />
              {finger ? (
                <text
                  x={x}
                  y={y + 3.5}
                  fontSize={10}
                  fill="#0d0d11"
                  textAnchor="middle"
                  fontWeight={700}
                >
                  {finger}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-text-soft">
        <Volume2
          className="size-3.5 text-text-dim transition-colors group-hover:text-text-soft"
          strokeWidth={1.8}
        />
        {spec.label}
      </span>
    </button>
  );
}
