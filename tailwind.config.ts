import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF7",
        foreground: "#0F0F0E",
        accent: "#C84B31",
        muted: "#6B6B63",
        border: "#E8E8E3",
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%":   { transform: "translateY(0px) scale(1)" },
          "50%":  { transform: "translateY(-14px) scale(1.05)" },
          "100%": { transform: "translateY(6px) scale(0.97)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite alternate",
        ticker: "ticker 40s linear infinite",
        "fade-up": "fadeUp 0.7s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
