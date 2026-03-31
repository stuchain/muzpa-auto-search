/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07070f",
        surface: "#121225",
        accent: "#56f1d4",
        accent2: "#a35dff"
      },
      boxShadow: {
        glow: "0 0 40px rgba(86, 241, 212, 0.2)"
      }
    }
  },
  plugins: []
};
