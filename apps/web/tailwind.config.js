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
          black: '#080808',
          charcoal: '#121212',
          card: '#181818',
          elevated: '#202020',
          border: '#282828',
          borderHover: '#3F3F46',
          red: '#E02025',
          redHover: '#FF2E36',
          silver: '#D4D4D8',
          muted: '#A1A1AA',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Montserrat', 'Inter', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(224, 32, 37, 0.35)',
        'glow-red-sm': '0 0 12px rgba(224, 32, 37, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
};
