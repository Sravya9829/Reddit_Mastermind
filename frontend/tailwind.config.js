/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-orange': '#FF4500',
        'neon-cyan': '#00F5FF',
        'dark': {
          950: '#0A0A0B',
          900: '#121214',
          800: '#1A1A1D',
          700: '#2A2A2E',
        },
        'accent': {
          orange: '#FF4500',
          cyan: '#00F5FF',
          purple: '#A855F7',
          green: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Clash Display', 'ui-sans-serif', 'system-ui'],
        display: ['Cabinet Grotesk', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 69, 0, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 69, 0, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
