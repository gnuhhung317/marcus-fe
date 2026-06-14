/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          soft: "hsl(var(--primary) / 0.12)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        canvas: {
          DEFAULT: "hsl(var(--bg-canvas) / <alpha-value>)",
          elevated: "hsl(var(--bg-canvas-elevated) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "hsl(var(--bg-surface) / <alpha-value>)",
          strong: "hsl(var(--bg-surface-strong) / <alpha-value>)",
          hover: "hsl(var(--bg-surface-hover) / <alpha-value>)",
        },
        main: "hsl(var(--text-main) / <alpha-value>)",
        fg: {
          DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
          muted: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        "fg-muted": "hsl(var(--muted-foreground) / <alpha-value>)",
        inverse: "hsl(var(--text-inverse) / <alpha-value>)",
        mutedText: "hsl(var(--text-muted) / <alpha-value>)",
        border: {
          DEFAULT: "hsl(var(--border-base) / <alpha-value>)",
          line: "hsl(var(--border-line) / <alpha-value>)",
        },
        positive: {
          DEFAULT: "hsl(var(--semantic-positive) / <alpha-value>)",
          soft: "hsl(var(--semantic-positive-soft) / 0.12)",
        },
        negative: {
          DEFAULT: "hsl(var(--semantic-negative) / <alpha-value>)",
          soft: "hsl(var(--semantic-negative-soft) / 0.12)",
        },
        warning: {
          DEFAULT: "hsl(var(--semantic-warning) / <alpha-value>)",
          soft: "hsl(var(--semantic-warning-soft) / 0.12)",
        },
        info: {
          DEFAULT: "hsl(var(--semantic-info) / <alpha-value>)",
          soft: "hsl(var(--semantic-info-soft) / 0.12)",
        },
        "cta-on-primary": "hsl(var(--primary-foreground) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
