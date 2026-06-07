/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Abundance Code palette
        ivory:     '#F5F1ED',  // Warm Ivory — fondo principal
        beige:     '#E8DCC8',  // Beige Arena — cards, bloques
        champagne: '#D4AF37',  // Champagne Gold — acentos
        moka:      '#3D2817',  // Espresso Moka — texto, botones

        // Variants
        'ivory-soft':   '#F7F3EE',
        'moka-soft':    '#5B3E2A',
        'moka-deep':    '#1E1A16',
        'logo-gold':    '#D4AF72',

        // Legacy compatibility
        black: '#3D2817',      // remap to moka for legacy text classes
        gold: {
          DEFAULT: '#D4AF37',
          light:   '#E6C76A',
          dark:    '#A88B20',
        },
        surface: '#E8DCC8',
        border:  '#E8DCC8',
      },
      fontFamily: {
        // Single family per spec
        sans:  ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Spec sizes
        'h1':   ['1.75rem',  { lineHeight: '1.25', fontWeight: '600' }],  // 28px SemiBold
        'h2':   ['1.125rem', { lineHeight: '1.35', fontWeight: '700' }],  // 18px Bold
        'body': ['0.875rem', { lineHeight: '1.55', fontWeight: '400' }],  // 14px Regular
        'sm-ac':['0.75rem',  { lineHeight: '1.45', fontWeight: '300' }],  // 12px Light
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.20)' },
          '50%':      { boxShadow: '0 0 40px rgba(212,175,55,0.40)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};
