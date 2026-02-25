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
        'app': 'var(--shadow)',
        'app-lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
