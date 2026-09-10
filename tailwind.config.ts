import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-tajawal)", "var(--font-cairo)", "sans-serif"]
      },
      colors: {
        bg: {
          DEFAULT: "#0B0E14",
          soft: "#11151F",
          card: "#161B27"
        },
        border: {
          DEFAULT: "#232939"
        },
        accent: {
          DEFAULT: "#6E5BFF",
          soft: "#8B7BFF",
          glow: "#3ED6C4"
        },
        ink: {
          DEFAULT: "#EAEBF2",
          muted: "#8E96AD"
        }
      },
      borderRadius: {
        xl2: "1.1rem"
      }
    }
  },
  plugins: []
};

export default config;
