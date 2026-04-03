/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#071218',
        surface: '#0c1820',
        'surface-2': '#10222d',
        'surface-3': '#15303d',
        border: '#1b3744',
        'border-2': '#2a5569',
        text: '#ebfbff',
        muted: '#a4c1cb',
        dim: '#6d8b96',
        accent: '#22e0c2',
        'accent-dark': '#113239',
        danger: '#ff6c7f',
        gold: '#f2bf5d',
        blue: '#66a7ff',
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        panel: '22px',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(4, 11, 15, 0.35)',
        accent: '0 0 0 1px rgba(34, 224, 194, 0.3), 0 12px 40px rgba(10, 28, 33, 0.4)',
      },
      spacing: {
        13: '3.25rem',
      },
    },
  },
  plugins: [],
}
