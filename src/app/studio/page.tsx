import type { Metadata } from "next";
import { StudioApp } from "@/components/studio/StudioApp";

export const metadata: Metadata = {
  title: "Songwriter Studio · Bandirector",
  description:
    "Build chords, pick a playing style, loop it, and lock instruments together to layer an arrangement.",
};

export default function StudioPage() {
  return <StudioApp />;
}
