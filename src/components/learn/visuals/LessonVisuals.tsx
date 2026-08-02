"use client";

import { useEffect } from "react";
import type { Visual } from "@/lib/learning/visuals/types";
import { prepareLessonAudio } from "@/lib/learning/lessonAudio";
import { GuitarChordDiagram } from "./GuitarChordDiagram";
import { PianoDiagram } from "./PianoDiagram";
import { FretboardDiagram } from "./FretboardDiagram";
import { SequencePlayer } from "./SequencePlayer";

export function LessonVisuals({
  visuals,
  accent,
}: {
  visuals: Visual[];
  accent: string;
}) {
  // Warm the soundfonts this lesson needs so the first tap isn't silent.
  useEffect(() => {
    const kinds = new Set(
      visuals.map((v) =>
        v.type === "piano" || (v.type === "sequence" && v.instrument === "piano")
          ? "piano"
          : "guitar",
      ),
    );
    kinds.forEach((k) => prepareLessonAudio(k));
  }, [visuals]);

  const chords = visuals.filter((v) => v.type === "guitar-chord");
  const rest = visuals.filter((v) => v.type !== "guitar-chord");

  return (
    <div className="flex flex-col gap-3">
      {chords.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {chords.map((v, i) => (
            <GuitarChordDiagram key={i} spec={v} accent={accent} />
          ))}
        </div>
      ) : null}
      {rest.map((v, i) => {
        switch (v.type) {
          case "piano":
            return <PianoDiagram key={i} spec={v} accent={accent} />;
          case "fretboard":
            return <FretboardDiagram key={i} spec={v} accent={accent} />;
          case "sequence":
            return <SequencePlayer key={i} spec={v} accent={accent} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
