import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gold: { 50:'#fffbeb', 100:'#fef3c7', 200:'#fde68a', 300:'#fcd34d', 400:'#fbbf24', 500:'#c9a84c', 600:'#b8961f', 700:'#92700a', 800:'#78520f', 900:'#451a03' },
        navy: { 50:'#f0f4ff', 100:'#e0e9ff', 200:'#c7d7fe', 300:'#a5b8fc', 400:'#818cf8', 500:'#1e3a8a', 600:'#1e40af', 700:'#1d4ed8', 800:'#1e3a8a', 900:'#0f172a' },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease',
        'slide-down': 'slideDown 0.3s ease',
        'ticker': 'ticker 35s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from:{ opacity:'0', transform:'translateY(12px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        slideDown: { from:{ opacity:'0', transform:'translateY(-8px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        ticker: { from:{ transform:'translateX(0)' }, to:{ transform:'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
export default config;
