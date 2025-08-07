/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.html',
    './src/public/**/*.js',
    './src/public/**/*.html',
  ],
  safelist: [
    'fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-50',
    'flex', 'justify-center', 'items-center', 'hidden', 'block',
    'rounded', 'p-4', 'bg-white', 'dark:bg-gray-800', 'text-black',
    'dark:text-white', 'w-full', 'max-w-md', 'shadow-lg', 'transition-all'
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

