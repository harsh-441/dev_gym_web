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
          charcoal: '#171717',
          card: '#202020',
          border: '#2e2e2e',
          red: '#E02025',
          redHover: '#FF2E36',
          silver: '#C0C0C0',
          muted: '#9CA3AF',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Impact', 'Arial Black', 'sans-serif']
      }
    },
  },
  plugins: [],
};
