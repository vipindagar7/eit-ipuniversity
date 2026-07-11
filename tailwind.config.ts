import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        // Academic / institutional palette — deep indigo + warm brass accent.
        // Chosen deliberately to avoid the generic cream+terracotta / dark+neon defaults.
        ink: "#101828",
        indigo: {
          50: "#EEF1F8",
          100: "#D7DEEE",
          400: "#3A4E85",
          600: "#22315C",
          700: "#1A2547",
          900: "#101833",
          950: "#0A0F22",
        },
        brass: {
          50: "#FBF3E3",
          200: "#EBD19B",
          400: "#C99A3B",
          600: "#A87B22",
        },
        paper: "#FAF9F6",
        slate: {
          50: "#F5F6F8",
          200: "#E1E4EA",
          500: "#5B6472",
          700: "#333A45",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
    },
  },
  plugins: [],
} satisfies Config;
