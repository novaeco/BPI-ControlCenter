/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        'tall': { 'raw': '(min-height: 800px)' },
        'short': { 'raw': '(max-height: 700px)' },
        'touch': { 'raw': '(pointer: coarse)' },
        'mouse': { 'raw': '(pointer: fine)' },
      },
      colors: {
        primary: {
          50: '#e6f8ff',
          100: '#b3e7ff',
          200: '#80d5ff',
          300: '#4dc4ff',
          400: '#1ab2ff',
          500: '#00a0ff',
          600: '#0080cc',
          700: '#006099',
          800: '#004066',
          900: '#002033',
        },
        background: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#1a1f2e',
        },
        surface: {
          light: '#ffffff',
          DEFAULT: '#ffffff',
          dark: '#242937',
        }
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'soft-sm': '0 2px 4px rgba(0,0,0,0.05)',
        'soft': '0 4px 6px rgba(0,0,0,0.07)',
        'soft-md': '0 6px 8px rgba(0,0,0,0.09)',
        'soft-lg': '0 8px 16px rgba(0,0,0,0.12)',
        'soft-xl': '0 20px 25px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-small': '640px',
        'screen-medium': '768px',
        'screen-large': '1024px',
      },
      aspectRatio: {
        'portrait': '3/4',
        'landscape': '4/3',
        'wide': '16/9',
        'ultrawide': '21/9',
      },
    },
  },
  plugins: [],
};