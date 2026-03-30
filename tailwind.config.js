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
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          primary: "#0f172a",
          secondary: "#1e293b",
          accent: "#f59e0b",
          success: "#10b981",
          danger: "#ef4444",
        },
      },

      backgroundColor: {
        "brand-soft": "#f8fafc",
        "brand-dark": "#0b0f1a",
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
        elevated: "0 25px 70px -20px rgba(0,0,0,0.3)",
        modal: "0 40px 120px -30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(255,255,255,0.05), 0 10px 40px rgba(0,0,0,0.25)",
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

      backdropBlur: {
        xs: "2px",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
      },