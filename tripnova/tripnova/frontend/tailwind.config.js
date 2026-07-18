/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0F172A',      // page background
        card: '#162033',     // card surface
        primary: '#FF9F43',  // orange
        secondary: '#38BDF8',// sky blue
        slate: '#94A3B8',
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #FF9F43 0%, #FF7A45 100%)',
        'gradient-brand': 'linear-gradient(135deg, #FF9F43 0%, #38BDF8 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(255,159,67,0.25)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
