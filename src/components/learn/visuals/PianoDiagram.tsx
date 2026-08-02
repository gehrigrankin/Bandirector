"use client";

import type { PianoVisual } from "@/lib/learning/visuals/types";
import { noteToMidi } from "@/lib/learning/notes";
import { ensureLessonAudio, playNote } from "@/lib/learning/lessonAudio";

const WHITE_W = 26;
const WHITE_H = 96;
const BLACK_W = 16;
const BLACK_H = 58;

/** Semitone offsets of white keys within an octave, and which have a black key after. */
const WHITE_SEMIS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_AFTER = new Set([0, 1, 3, 4, 5]); // C, D, F, G, A

export function PianoDiagram({
  spec,
  accent,
}: {
  spec: PianoVisual;
  accent: string;
}) {
  const highlighted = new Set(
    spec.notes.map(noteToMidi).filter((n): n is number => n !== null),
  );
  const roots = new Set(
    (spec.roots ?? []).map(noteToMidi).filter((n): n is number => n !== null),
  );

  // Range: explicit, or derived to cover the highlighted notes (≥1 octave).
  let startOctave = spec.startOctave;
  let octaves = spec.octaves;
  if (startOctave == null || octaves == null) {
    const midis = [...highlighted];
    const lo = midis.length ? Math.min(...midis) : 60;
    const hi = midis.length ? Math.max(...midis) : 60;
    startOctave = startOctave ?? Math.floor(lo / 12) - 1;
    const endOctave = Math.floor(hi / 12) - 1;
    octaves = octaves ?? Math.min(3, Math.max(1, endOctave - startOctave + 1));
  }

  const whites: { midi: number; x: number; label?: string }[] = [];
  const blacks: { midi: number; x: number }[] = [];
  for (let o = 0; o < octaves; o++) {
    for (let w = 0; w < 7; w++) {
      const x = (o * 7 + w) * WHITE_W;
      const midi = (startOctave + o + 1) * 12 + WHITE_SEMIS[w];
      whites.push({
        midi,
        x,
        label: w === 0 ? `C${startOctave + o}` : undefined,
      });
      if (BLACK_AFTER.has(w)) {
        blacks.push({ midi: midi + 1, x: x + WHITE_W - BLACK_W / 2 });
      }
    }
  }
  const width = octaves * 7 * WHITE_W;

  async function tap(midi: number) {
    await ensureLessonAudio("piano");
    playNote("piano", midi, 1100);
  }

  return (
    <div className="flex max-w-full flex-col gap-1.5 rounded-xl border border-line-soft bg-black/20 p-3">
      <div className="overflow-x-auto">
        <svg
          width={width + 2}
          height={WHITE_H + 2}
          viewBox={`0 0 ${width + 2} ${WHITE_H + 2}`}
          aria-label={spec.label}
        >
          {whites.map((k) => {
            const hl = highlighted.has(k.midi);
            const root = roots.has(k.midi);
            return (
              <g key={k.midi} onClick={() => tap(k.midi)} className="cursor-pointer">
                <rect
                  x={k.x + 1}
                  y={1}
                  width={WHITE_W - 1.5}
                  height={WHITE_H}
                  rx={3}
                  fill={hl ? accent : "#e8e8ee"}
                  fillOpacity={hl ? (root ? 1 : 0.72) : 1}
                  stroke="#0d0d11"
                  strokeWidth={1}
                />
                {root ? (
                  <circle cx={k.x + WHITE_W / 2} cy={WHITE_H - 12} r={3.5} fill="#0d0d11" />
                ) : null}
                {k.label ? (
                  <text
                    x={k.x + WHITE_W / 2}
                    y={WHITE_H - (root ? 22 : 8)}
                    fontSize={9}
                    fill="#55555f"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                  >
                    {k.label}
                  </text>
                ) : null}
              </g>
            );
          })}
          {blacks.map((k) => {
            const hl = highlighted.has(k.midi);
            const root = roots.has(k.midi);
            return (
              <g key={k.midi} onClick={() => tap(k.midi)} className="cursor-pointer">
                <rect
                  x={k.x}
                  y={1}
                  width={BLACK_W}
                  height={BLACK_H}
                  rx={2.5}
                  fill={hl ? accent : "#17171d"}
                  fillOpacity={hl ? (root ? 1 : 0.85) : 1}
                  stroke="#0d0d11"
                  strokeWidth={1}
                />
                {root ? (
                  <circle cx={k.x + BLACK_W / 2} cy={BLACK_H - 10} r={3} fill="#0d0d11" />
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      <span className="text-[12px] font-semibold text-text-soft">
        {spec.label}
        <span className="ml-2 font-normal text-text-dim">tap keys to hear them</span>
      </span>
    </div>
  );
}
