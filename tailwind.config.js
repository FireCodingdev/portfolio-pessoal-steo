/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: "#e91e8c",
          light: "#ff4db8",
          soft: "#ff80cc",
        },
        dark: {
          DEFAULT: "#0a0a0a",
          1: "#111111",
          2: "#1a1a1a",
          3: "#222222",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
