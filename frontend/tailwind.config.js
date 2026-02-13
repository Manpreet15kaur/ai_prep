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
        'coral-vibrant': '#FF7E5F',
        'coral-light': '#FEB47B',
        purple: '#D4B5F5',
        'electric-violet': '#8B5CF6',
        'emerald': '#10B981',
        'rose-red': '#F43F5E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(255, 182, 193, 0.2)',
        'glow': '0 0 40px rgba(255, 126, 95, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
        'lift': '0 20px 60px rgba(139, 92, 246, 0.3)',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, #FFD4C4 0px, transparent 50%), radial-gradient(at 80% 0%, #E6D5F5 0px, transparent 50%), radial-gradient(at 0% 50%, #D4F5E6 0px, transparent 50%), radial-gradient(at 80% 50%, #FFB6C1 0px, transparent 50%), radial-gradient(at 0% 100%, #D4E4FF 0px, transparent 50%), radial-gradient(at 80% 100%, #FFF4D4 0px, transparent 50%)',
        'gradient-vibrant': 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
        'gradient-electric': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
