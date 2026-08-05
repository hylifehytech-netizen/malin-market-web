/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelGreen: {
          50: '#F4FBF7',
          100: '#E6F7ED',
          200: '#C6EED5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        softGold: {
          50: '#FFFDF0',
          100: '#FEF9C3',
          200: '#FEF08A',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
        }
      }
    },
  },
  plugins: [],
}
