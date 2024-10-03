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
  },
  plugins: [require('tailwindcss-primeui')],
  darkMode: 'none',
}
