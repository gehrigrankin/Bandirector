import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0b0e",
          raised: "#15151c",
          higher: "#1d1d27",
        },
        accent: {
          DEFAULT: "#f59e0b",
          soft: "#fbbf24",
        },
        text: {
          DEFAULT: "#f5f5f7",
          muted: "#9ca3af",
          dim: "#6b7280",
        },
        border: {
          DEFAULT: "#27272f",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
