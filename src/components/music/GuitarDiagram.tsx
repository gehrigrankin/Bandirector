"use client";

import { guitarVoicing } from "@/lib/music/diagrams";

interface Props {
  chord: string;
  size?: number;
}

export function GuitarDiagram({ chord, size = 120 }: Props) {
  const voicing = guitarVoicing(chord);
  const strings = 6;
  const frets = 4;
  const padX = size * 0.12;
  const padY = size * 0.18;
  const usableW = size - padX * 2;
  const usableH = size - padY * 1.4;
  const stringSpacing = usableW / (strings - 1);
  const fretSpacing = usableH / frets;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${chord} guitar diagram`}
    >
      <text
        x={size / 2}
        y={padY * 0.7}
        textAnchor="middle"
        fontSize={size * 0.14}
        fontWeight={700}
        fill="currentColor"
      >
        {chord}
      </text>

      <rect
        x={padX}
        y={padY}
        width={usableW}
        height={usableH}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.5}
      />
      {Array.from({ length: strings }).map((_, i) => (
        <line
          key={`s${i}`}
          x1={padX + i * stringSpacing}
          y1={padY}
          x2={padX + i * stringSpacing}
          y2={padY + usableH}
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={0.6}
        />
      ))}
      {Array.from({ length: frets + 1 }).map((_, i) => (
        <line
          key={`f${i}`}
          x1={padX}
          y1={padY + i * fretSpacing}
          x2={padX + usableW}
          y2={padY + i * fretSpacing}
          stroke="currentColor"
          strokeWidth={i === 0 ? 2.5 : 0.8}
          opacity={i === 0 ? 0.9 : 0.5}
        />
      ))}

      {!voicing ? (
        <text
          x={size / 2}
          y={padY + usableH / 2}
          textAnchor="middle"
          fontSize={size * 0.1}
          fill="currentColor"
          opacity={0.7}
        >
          (custom)
        </text>
      ) : (
        voicing.frets.map((fret, idx) => {
          const x = padX + idx * stringSpacing;
          if (fret === -1) {
            return (
              <text
                key={idx}
                x={x}
                y={padY - 2}
                textAnchor="middle"
                fontSize={size * 0.1}
                fill="currentColor"
                opacity={0.8}
              >
                ×
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={idx}
                cx={x}
                cy={padY - size * 0.04}
                r={size * 0.025}
                fill="none"
                stroke="currentColor"
              />
            );
          }
          return (
            <circle
              key={idx}
              cx={x}
              cy={padY + (fret - 0.5) * fretSpacing}
              r={size * 0.05}
              fill="currentColor"
            />
          );
        })
      )}
    </svg>
  );
}
