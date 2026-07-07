import type { Metadata } from "next";
import { AppRail, MobileTabBar } from "@/components/ui/AppNav";
import { StudioApp } from "@/components/studio/StudioApp";

export const metadata: Metadata = {
  title: "Songwriter Studio · Bandirector",
  description:
    "A chord + loop workstation: pick a chord, choose a playing style, and lock loops to layer a full arrangement.",
};

export default function StudioPage() {
  return (
    <div className="flex h-dvh overflow-hidden bg-bg text-text">
      <AppRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <StudioApp />
        <MobileTabBar />
      </div>
    </div>
  );
}
