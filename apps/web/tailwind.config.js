/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          // Premium International Fitness Theme: Deep Royal Navy, Pure White, Soft Silver & Champagne Gold
          navy: '#0A1128',
          navyDark: '#050B17',
          navyCard: '#101B37',
          navyElevated: '#17254A',
          navyBorder: '#1E305C',
          navyBorderHover: '#334B85',
          gold: '#D4AF37',
          goldHover: '#E5C158',
          goldMuted: '#997D29',
          silver: '#CBD5E1',
          silverLight: '#F1F5F9',
          silverMuted: '#94A3B8',

          // Compatibility Aliases for components and tests
          black: '#050B17',
          charcoal: '#0A1128',
          card: '#101B37',
          elevated: '#17254A',
          border: '#1E305C',
          borderHover: '#334B85',
          red: '#D4AF37',        // Subtle Gold replaces aggressive red
          redHover: '#E5C158',   // Lighter Gold hover
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Montserrat', 'Inter', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.35)',
        'glow-gold-sm': '0 0 12px rgba(212, 175, 55, 0.25)',
        'glow-navy': '0 0 35px rgba(10, 17, 40, 0.7)',
        'card': '0 4px 20px -2px rgba(5, 11, 23, 0.65)'
      }
    },
  },
  plugins: [],
};
