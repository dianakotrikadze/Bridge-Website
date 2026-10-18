import type { Config } from "tailwindcss";

/**
 * Bridge Academy brand tokens.
 * Change colours here and they update across the whole site.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        forest: { DEFAULT: "#1E3B2C", 700: "#173023", 900: "#10231A" },
        sage: { DEFAULT: "#8EA88A", 600: "#6E8C6A", 300: "#C5D4BF", 100: "#E4ECDF", 50: "#F1F5EE" },
        ivory: { DEFAULT: "#F7F5EE", 200: "#EEEADC" },
        gold: { DEFAULT: "#C49A3F", 600: "#9E7A2B", 100: "#F3E7C9" },
        ink: { DEFAULT: "#18261E", muted: "#4A5A50" },
      },
      fontFamily: {
        sans: ['"Noto Sans Georgian Variable"', '"Noto Sans Georgian"', "system-ui", "sans-serif"],
        display: ['"Noto Serif Georgian Variable"', '"Noto Serif Georgian"', "Georgia", "serif"],
      },
      borderRadius: { card: "1.75rem", tile: "1rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(30,59,44,.06), 0 12px 32px -12px rgba(30,59,44,.18)",
        lift: "0 2px 4px rgba(30,59,44,.08), 0 24px 48px -16px rgba(30,59,44,.28)",
      },
      maxWidth: { prose: "68ch" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
        "slide-in": { from: { opacity: "0", transform: "translateX(24px)" }, to: { opacity: "1", transform: "none" } },
        "slide-back": { from: { opacity: "0", transform: "translateX(-24px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.2,.7,.2,1) both",
        "slide-in": "slide-in .35s cubic-bezier(.2,.7,.2,1) both",
        "slide-back": "slide-back .35s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
