module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      colors: {},
      spacing: {
        128: "26rem",
        83: "21rem",
        23: "5.75rem",
      },
      fontFamily: {
        monoton: ["'Monoton'", "cursive"],
        rubik: ["'Rubik Mono One'", "monospace"],
        montserrat: ["'Montserrat'", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
