/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'app-border': 'var(--border)',
        'app-text': 'var(--text)',
        'text-soft': 'var(--text-soft)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-soft': 'var(--accent-soft)',
        error: 'var(--error)',
      },
      borderRadius: {
        'app': 'var(--radius)',
        'app-sm': 'var(--radius-sm)',
        'app-lg': 'var(--radius-lg)',
      },
      boxShadow: {
        'app-sm': 'var(--shadow-sm)',
        'app': 'var(--shadow)',
        'app-md': 'var(--shadow-md)',
        'app-lg': 'var(--shadow-lg)',
        'app-xl': 'var(--shadow-xl)',
        'app-glow': 'var(--shadow-glow)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        spring: 'var(--ease-spring)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.45s var(--ease-out-expo) both',
        'fade-in-up': 'fade-in-up 0.55s var(--ease-out-expo) both',
        'scale-in': 'scale-in 0.4s var(--ease-spring) both',
      },
    },
  },
  plugins: [],
}
