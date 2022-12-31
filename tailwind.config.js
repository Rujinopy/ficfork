/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aYellow: '#fdd85d',
        aRose: '#f75578',
        liveOrange: '#E26868',
        softOrange: '#FF8787',
        
      },
      fontFamily: {
        PT: ['PT Sans', 'sans-serif'],
        Dance: ['Dancing Script', 'cursive']
      },

  },
    
  },
  plugins: [],
}
