/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "Avenir", "Helvetica", "Arial", "sans-serif"],
    },
    extend: {
      fontSize: {
        "17px": "17px",
        "15px": "15px",
      },
      colors: {
        black: "#0D131A",
        gray: "#46494D",
      },
    },
  },
  plugins: [],
};
