/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-2': '#CEEE5E',
        'primary-3': '#7E5EEE',
        'secondary-2': '#00778B',
        'background-1': '#49c5b1',
        'background-2': '#CEEE5E',
        'background-3': '#65d2ec',
        'border-color': '#7073724d',
        'border-color-full': '#707372',
        warning: '#F1B434',
        error: '#EF6079',
      },
    },
  },
  plugins: [require('@headlessui/vue'), require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#49c5b1',
          secondary: '#f3effe',
          accent: '#37cdbe',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          'primary-2': '#CEEE5E',
        },
      },
    ],
  },
}
