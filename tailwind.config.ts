import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B10",
        paper: "#FAF7F2",
        accent: "#FF7A1A",
        accent2: "#FFB340",
        mute: "#6B6B75"
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(255,122,26,0.55), 0 4px 20px -5px rgba(255,179,64,0.35)"
      },
      animation: {
        "pulse-slow": "pulse 3.5s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
        "shimmer": "shimmer 2.2s linear infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
