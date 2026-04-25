module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        // Custom colors can be added here
      },
      spacing: {
        128: "26rem",
        83: "21rem", // Adds h-83, w-83, p-83, etc.
        23: "5.75rem", // Adds h-23, w-23, p-23, etc.
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
