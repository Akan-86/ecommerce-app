/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // App Router ve src dizini için
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",
        secondary: "#f59e0b",
      },
    },
  },
  darkMode: "class", // 🌗 Tema geçişi için ThemeProvider ile uyumlu
  plugins: [],
};
