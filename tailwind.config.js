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
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      'lg-xl': { 'min': '1125px', 'max': '1279px' },
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}
