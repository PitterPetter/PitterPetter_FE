/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scrollText: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      animation: {
        scrollText: "scrollText 6s linear infinite", 
      },
      backgroundColor: {
        'primary': '#662B2B',
        'secondary': '#FFEDED',
        'third': '#93000A'
      },
    },
  },
  plugins: [],
}
