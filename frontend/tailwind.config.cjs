/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-hourly': 'linear-gradient(to bottom right, #a18cd1, #fbc2eb)', // purple
        'gradient-live': 'linear-gradient(to bottom right, #fddb92, #d1fdff)', // yellow
        'gradient-wealth': 'linear-gradient(to bottom right, #f6d365, #fda085)', // gold/beige
      }
    },
  },
  plugins: [],
};