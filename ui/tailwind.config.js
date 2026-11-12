/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#090d16',
        card: '#111827',
        border: '#1f2937',
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        aegis: {
          cyan: '#38bdf8',
          purple: '#a855f7',
          emerald: '#34d399',
          amber: '#fbbf24',
          rose: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};

