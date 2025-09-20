/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5'
        },
        xp: '#fbbf24',
        hit: '#4ade80',
        miss: '#f87171',
        panel: '#0f172a'
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(99,102,241,0.35), 0 0 12px -2px rgba(99,102,241,0.6)',
        neon: '0 0 4px #6366f1, 0 0 12px #6366f1, 0 0 24px #6366f1'
      },
      keyframes: {
        pulseBorder: { '0%,100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.0)' }, '50%': { boxShadow: '0 0 0 4px rgba(99,102,241,0.25)' } },
        confetti: { '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' }, '10%': { opacity: '1' }, '100%': { transform: 'translateY(120vh) rotate(720deg)', opacity: '0' } }
      },
      animation: {
        'pulse-border': 'pulseBorder 2.4s ease-in-out infinite',
        confetti: 'confetti 3.2s linear forwards'
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ],
  daisyui: {
    themes: [
      {
        decoder: {
          'primary': '#6366f1',
          'primary-content': '#ffffff',
          'secondary': '#f472b6',
          'accent': '#fbbf24',
          'neutral': '#1e293b',
          'base-100': '#0f172a',
          'info': '#38bdf8',
          'success': '#4ade80',
          'warning': '#fbbf24',
          'error': '#f87171'
        }
      }, 'dark'
    ]
  }
};
