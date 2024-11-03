/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TODO: change name for this colors here and wherever used
        softGray: "#D9D9D9",
        charcoalGray: "#616161",
        warmLightGray: " #F4F0F0"

      }
    },
  },
  plugins: [],
}

