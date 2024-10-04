/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,css}'],
  theme: {
    extend: {},
    fontSize: {
      xs: ['0.75rem', 'normal'],
      sm: ['0.875rem', 'normal'],
      base: ['1rem', 'normal'],
      lg: ['1.125rem', 'normal'],
      xl: ['1.25rem', 'normal'],
      '2xl': ['1.5rem', 'normal'],
      '3xl': ['1.875rem', 'normal'],
      '4xl': ['2.25rem', 'normal'],
      '5xl': ['3rem', 'normal'],
      '6xl': ['3.75rem', 'normal'],
      '7xl': ['4.5rem', 'normal'],
      '8xl': ['6rem', 'normal'],
      '9xl': ['8rem', 'normal'],
    },
  },
  plugins: [require('tailwindcss-primeui')],
}
