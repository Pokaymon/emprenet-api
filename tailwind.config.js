/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.html',
    './src/public/**/*.js',
    './src/public/**/*.html',
  ],
  darkMode: 'media', // o 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};

