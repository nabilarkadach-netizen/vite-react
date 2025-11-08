/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        duskTop: "#0F1724",
        duskMid: "#152034",
        duskBot: "#0B1220",
        sunrise: "#FFA131",
        dream: "#83A3FF",
        accent: "#FFE387"
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"]
      }
    }
  },
  plugins: []
};
