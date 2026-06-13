/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "var(--bg-canvas)",
          elevated: "var(--bg-canvas-elevated)",
        },
        surface: {
          DEFAULT: "var(--bg-surface)",
          strong: "var(--bg-surface-strong)",
          hover: "var(--bg-surface-hover)",
        },
        main: "var(--text-main)",
        muted: "var(--text-muted)",
        inverse: "var(--text-inverse)",
        border: {
          DEFAULT: "var(--border-base)",
          line: "var(--border-line)",
        },
        positive: {
          DEFAULT: "var(--semantic-positive)",
          soft: "var(--semantic-positive-soft)",
        },
        negative: {
          DEFAULT: "var(--semantic-negative)",
          soft: "var(--semantic-negative-soft)",
        },
        warning: {
          DEFAULT: "var(--semantic-warning)",
          soft: "var(--semantic-warning-soft)",
        },
        info: {
          DEFAULT: "var(--semantic-info)",
          soft: "var(--semantic-info-soft)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          soft: "var(--primary-soft)",
        },
      },
    },
  },
  plugins: [],
};
