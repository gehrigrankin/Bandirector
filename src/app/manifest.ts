import type { MetadataRoute } from "next";

// Makes Bandirector installable as a home-screen app (Android/desktop install
// prompt; iOS "Add to Home Screen"). Launches straight into the Studio, which
// is where a plugged-in MIDI keyboard is most useful.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bandirector",
    short_name: "Bandirector",
    description:
      "Write songs with chords, loops, and real instruments — and jam together in real time.",
    start_url: "/studio",
    display: "standalone",
    background_color: "#0a0a0d",
    theme_color: "#0a0a0d",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
