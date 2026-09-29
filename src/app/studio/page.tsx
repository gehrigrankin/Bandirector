import type { Metadata } from "next";
import { AppRail, MobileTabBar } from "@/components/ui/AppNav";
import { StudioApp } from "@/components/studio/StudioApp";

export const metadata: Metadata = {
  title: "Songwriter Studio · Bandirector",
  description:
    "Sketch a whole song: sections with their own chords, one row per instrument, click blocks to decide who plays where, then export MIDI to finish it in your DAW.",
};

export default function StudioPage() {
  return (
    <div className="flex h-dvh overflow-hidden bg-bg text-text">
      <AppRail />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <StudioApp />
        <MobileTabBar />
      </div>
    </div>
  );
}
