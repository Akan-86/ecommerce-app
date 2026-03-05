/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          accent: "#f59e0b",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
        ],
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },

      boxShadow: {
        card: "0 10px 30px -10px rgba(0,0,0,0.15)",
        elevated: "0 20px 60px -15px rgba(0,0,0,0.25)",
        modal: "0 30px 80px -20px rgba(0,0,0,0.35)",
      },

      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },

      spacing: {
        section: "6rem",
        "section-sm": "4rem",
      },
    },
  },
  plugins: [],
};
