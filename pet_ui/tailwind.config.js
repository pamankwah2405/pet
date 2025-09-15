/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}", // Scan for files in the root directory
  ],
  theme: {
    extend: {
      colors: {
        'apc-red': '#e2251d',
        'apc-black': '#2d2d2d',
        'apc-dark-grey': '#4a4a4a',
        'apc-light-grey': '#d9d9d9',
        'apc-warm-yellow': '#ffc107',
        'apc-soft-yellow': '#fff3cd',
      }
    },
  },
  plugins: [],
}