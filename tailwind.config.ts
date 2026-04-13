import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon Monolith — AgentsNerator Design System
        // All values use CSS variables → supports opacity modifiers (bg-primary/20 etc.)
        "background":                "rgb(var(--clr-bg) / <alpha-value>)",
        "surface":                   "rgb(var(--clr-surface) / <alpha-value>)",
        "surface-dim":               "rgb(var(--clr-surface-dim) / <alpha-value>)",
        "surface-bright":            "rgb(var(--clr-surface-bright) / <alpha-value>)",
        "surface-container-lowest":  "rgb(var(--clr-sc-lowest) / <alpha-value>)",
        "surface-container-low":     "rgb(var(--clr-sc-low) / <alpha-value>)",
        "surface-container":         "rgb(var(--clr-sc) / <alpha-value>)",
        "surface-container-high":    "rgb(var(--clr-sc-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--clr-sc-highest) / <alpha-value>)",
        "surface-variant":           "rgb(var(--clr-surface-variant) / <alpha-value>)",
        "on-surface":                "rgb(var(--clr-on-surface) / <alpha-value>)",
        "on-surface-variant":        "rgb(var(--clr-on-surface-variant) / <alpha-value>)",
        "on-background":             "rgb(var(--clr-on-bg) / <alpha-value>)",
        // Primary — Neon Purple
        "primary":                   "rgb(var(--clr-primary) / <alpha-value>)",
        "primary-dim":               "rgb(var(--clr-primary-dim) / <alpha-value>)",
        "primary-container":         "rgb(var(--clr-primary-container) / <alpha-value>)",
        "on-primary":                "rgb(var(--clr-on-primary) / <alpha-value>)",
        "on-primary-container":      "rgb(var(--clr-on-primary-container) / <alpha-value>)",
        "inverse-primary":           "rgb(var(--clr-inverse-primary) / <alpha-value>)",
        "surface-tint":              "rgb(var(--clr-primary) / <alpha-value>)",
        // Secondary — Neon Cyan
        "secondary":                 "rgb(var(--clr-secondary) / <alpha-value>)",
        "secondary-dim":             "rgb(var(--clr-secondary-dim) / <alpha-value>)",
        "secondary-container":       "rgb(var(--clr-secondary-container) / <alpha-value>)",
        "on-secondary":              "rgb(var(--clr-on-secondary) / <alpha-value>)",
        "on-secondary-container":    "rgb(var(--clr-on-secondary-container) / <alpha-value>)",
        // Tertiary — Coral
        "tertiary":                  "rgb(var(--clr-tertiary) / <alpha-value>)",
        "tertiary-dim":              "rgb(var(--clr-tertiary-dim) / <alpha-value>)",
        "on-tertiary":               "rgb(var(--clr-on-tertiary) / <alpha-value>)",
        // Error
        "error":                     "rgb(var(--clr-error) / <alpha-value>)",
        "error-dim":                 "rgb(var(--clr-error-dim) / <alpha-value>)",
        "error-container":           "rgb(var(--clr-error-container) / <alpha-value>)",
        "on-error":                  "rgb(var(--clr-on-error) / <alpha-value>)",
        "on-error-container":        "rgb(var(--clr-on-error-container) / <alpha-value>)",
        // Outline
        "outline":                   "rgb(var(--clr-outline) / <alpha-value>)",
        "outline-variant":           "rgb(var(--clr-outline-variant) / <alpha-value>)",
        // Inverse
        "inverse-surface":           "rgb(var(--clr-inverse-surface) / <alpha-value>)",
        "inverse-on-surface":        "rgb(var(--clr-inverse-on-surface) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm:      "0.125rem",
        lg:      "0.25rem",
        xl:      "0.5rem",
        "2xl":   "0.75rem",
        full:    "9999px",
      },
      fontFamily: {
        headline: ["var(--font-space-grotesk)", "sans-serif"],
        body:     ["var(--font-manrope)", "sans-serif"],
        label:    ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
