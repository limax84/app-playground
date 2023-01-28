const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
    './web3/**/*.{js,ts,jsx,tsx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      // https://vercel.com/design/color
      colors: {
        gray: colors.zinc,
        'gray-1000': 'rgb(17,17,19)',
        'gray-1100': 'rgb(10,10,11)',
        vercel: {
          pink: '#FF0080',
          blue: '#0070F3',
          cyan: '#50E3C2',
          orange: '#F5A623',
          violet: '#7928CA',
        },
      },
      backgroundImage: ({theme}) => ({
        'vc-border-gradient': `radial-gradient(at left top, ${theme(
          'colors.gray.500',
        )}, 50px, ${theme('colors.gray.800')} 50%)`,
      }),
      boxShadow: {
        sm: ['0 0 4px 0 rgb(0, 0, 0, 0.5)'],
        md: ['0 0 8px 0 rgb(0, 0, 0, 0.5)'],
        lg: ['0 0 12px 0 rgb(0, 0, 0, 0.5)'],
        xl: ['0 0 14px 2px rgb(0, 0, 0, 0.5)'],
        lightGlow: ['0px 0px 120px 40px rgba(255, 255, 255, 0.2)'],
        lightGlowShort: ['0px 10px 40px 40px rgba(255, 255, 255, 0.2)'],
        lightGlowShorter: ['0px 0px 16px 8px rgba(255, 255, 255, 0.25)'],
        lightGlowShortest: ['0px 0px 12px 4px rgba(255, 255, 255, 0.35)'],
        lightPanel: ['0px 0px 25px 0px  rgba(255, 255, 255, 0.5), 0px 0px 4px 3px rgb(0 0 0), 0px 0px 3px 1px rgb(0 0 0), 0px 0px 2px 1px rgb(0 0 0)'],
        white: ['0px 0px 1px rgb(255 255 255 / 10%)'],
        insetDark: ['inset 0 0 3px 1px rgb(0 0 0 / 30%)']
      },
      dropShadow: {
        logo: ['1px 1px 2px rgb(0 0 0 / 25%)'],
        logoDark: ['1px 1px 2px rgb(255 255 255 / 25%)'],
        baseline: ['3px 2px 2px rgb(0 0 0 / 50%)'],
        strong: ['1px 1px 3px rgb(0 0 0 / 100%)'],
        light1px: ['-1px 1px 0px white']
      },
      textShadow: {
        DEFAULT: '0 0 4px rgb(0 0 0 / 100%)'
      },
      keyframes: ({theme}) => ({
        rerender: {
          '0%': {
            ['border-color']: theme('colors.vercel.pink'),
          },
          '40%': {
            ['border-color']: theme('colors.vercel.pink'),
          },
        },
        highlight: {
          '0%': {
            background: theme('colors.vercel.pink'),
            color: theme('colors.white'),
          },
          '40%': {
            background: theme('colors.vercel.pink'),
            color: theme('colors.white'),
          },
        },
        loading: {
          '0%': {
            opacity: '.2',
          },
          '20%': {
            opacity: '1',
            transform: 'translateX(1px)',
          },
          to: {
            opacity: '.2',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        translateXReset: {
          '100%': {
            transform: 'translateX(0)',
          },
        },
        fadeToTransparent: {
          '0%': {
            opacity: 1,
          },
          '40%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp')
  ],
};
