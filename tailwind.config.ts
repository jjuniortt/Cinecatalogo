import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: "#E50914",
        "netflix-light": "#ff2d3b",
        base: "#08080a",
        "base-soft": "#0f0f13",
        rating: "#f5c518",
        relevant: "#46d369",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-anton)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 45px -5px rgba(229,9,20,0.55)",
        "glow-soft": "0 0 0 4px rgba(229,9,20,0.10), 0 0 24px rgba(229,9,20,0.28)",
        card: "0 18px 50px -18px rgba(0,0,0,0.9)",
        "card-hover":
          "0 30px 70px -20px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.08)",
      },
      dropShadow: {
        hero: "0 8px 30px rgba(0,0,0,0.9)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(26px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.18)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 12px #E50914" },
          "50%": { opacity: "0.4", boxShadow: "0 0 4px #E50914" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 1.2s ease both",
        "slow-zoom": "slow-zoom 24s ease-out forwards",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
