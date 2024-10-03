/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './theme/**/*.{js,vue,ts}',
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,css}',
  ],
  theme: {
    // fontSize: {
    //   sm: '0.7rem',
    //   base: '0.8rem',
    //   lg: '1rem',
    //   xl: '1.25rem',
    //   '2xl': '1.563rem',
    //   '3xl': '1.953rem',
    //   '4xl': '2.441rem',
    //   '5xl': '3.052rem',
    // },
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
