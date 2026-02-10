/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        beige: '#F5E6D3',
        peach: '#FFD4C4',
        pink: '#FFB6C1',
        lavender: '#E6D5F5',
        blue: '#D4E4FF',
        mint: '#D4F5E6',
        yellow: '#FFF4D4',
        coral: '#FF9999',
        purple: '#D4B5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(255, 182, 193, 0.15)',
        'glow': '0 0 20px rgba(255, 182, 193, 0.3)',
      },
    },
  },
  plugins: [],
}
