/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#7956FF",
        lightPrimary: "#AD98FF",
        secondary: "#FF9228",
        lightSecondary: "#FFF5F3",
        black: "#333333",
        bgWhite: "#F9F9F9",
        lightGray: "#A0A7B1",
        darkText: "#3D355E",
        semiDarkText: "#524B6B",
      },
      fontFamily: {
        Roboto: ["Roboto"],
      },
      maxWidth: {
        panel: "50rem",
      },
    },
  },
  plugins: [],
};