import type { Metadata } from "next";
import { TopNav } from "@/components/ui/TopNav";
import { StudioApp } from "@/components/studio/StudioApp";

export const metadata: Metadata = {
  title: "Songwriter Studio · Bandirector",
  description:
    "A chord + loop workstation: pick a chord, choose a playing style, and lock loops to layer a full arrangement.",
};

export default function StudioPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopNav />
      <StudioApp />
    </div>
  );
}
