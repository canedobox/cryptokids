// Getting Tailwind CSS default color palette
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      },
      screens: {
        // => @media (min-width: 380) { ... }
        "2xs": "380px",
        // => @media (min-width: 480) { ... }
        xs: "480px"
      },
      spacing: {
        128: "25rem"
      },
      maxWidth: {
        "3xs": "11rem"
      }
    },
    colors: {
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      white: colors.white,
      black: colors.black,
      primary: colors.indigo,
      accent: colors.yellow,
      gray: colors.slate,
      red: colors.red
    }
  },
  plugins: []
};
