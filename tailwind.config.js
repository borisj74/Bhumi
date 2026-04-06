/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './work.html',
    './work-item.html',
    './info.html',
    './notes.html',
    './talent.html',
    './src/**/*.{js,ts,tsx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        notes: '600px',
      },
      colors: {
        base: '#F4F4F0',
        ink: '#111111',
        gold: '#C5A880',
        muted: '#8A8A8A',
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', 'serif'],
        sans: ['"Geist Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        widest: '0.2em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
};
