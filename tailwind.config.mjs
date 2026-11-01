/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cereza-oscura': '#3A0E22',
        'cereza-profunda': '#24081A',
        'crema': '#E8A838',
        'porcelana': '#F4F6F3',
        'espresso': '#1F1410',
        'humo': '#6B5B63',
        'humo-claro': '#CDBFC6',
        'tueste-crudo': '#8FA86B',
        'tueste-claro': '#E8A838',
        'tueste-medio': '#B9702E',
        'tueste-oscuro': '#6A3B20',
        'tueste-espresso': '#2A1810',
        'error': '#B3261E',
      },
      fontFamily: {
        display: ['Gloock', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '14px',
        lg: '28px',
        cup: '50%',
        pill: '999px',
      },
      boxShadow: {
        flotante: '0 12px 32px -12px rgba(36, 8, 26, 0.45)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '240ms',
        pour: '700ms',
      },
      transitionTimingFunction: {
        tazamo: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
