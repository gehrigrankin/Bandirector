import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Base surfaces (redesign)
        bg: {
          DEFAULT: "#0a0a0d",
          raised: "#121218", // panel
          higher: "#191923", // elev
          card: "#101016", // inset card
          input: "#0f0f14",
        },
        line: {
          DEFAULT: "#23232c",
          soft: "#1c1c24",
        },
        // Studio accent (amber)
        accent: {
          DEFAULT: "#f5a524",
          soft: "#ffc252",
        },
        // Jam accent (teal)
        jam: {
          DEFAULT: "#3fd9c5",
          soft: "#5fe8d6",
        },
        text: {
          DEFAULT: "#f4f4f6",
          muted: "#9b9ba8",
          dim: "#5e5e6b",
          soft: "#c9c9d4",
        },
        border: {
          DEFAULT: "#23232c",
        },
        ok: "#58c98b",
        danger: "#f0655a",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "glow-accent": "0 0 24px rgba(245,165,36,0.35)",
        "glow-jam": "0 0 24px rgba(63,217,197,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
