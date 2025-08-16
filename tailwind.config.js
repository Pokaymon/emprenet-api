/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.{html,ejs}',
    './src/public/**/*.{js,html}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

