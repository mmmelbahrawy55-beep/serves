import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#0f0f22',
          800: '#0a0a1a',
          900: '#060612',
          950: '#030308',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Noto Kufi Arabic', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'Noto Kufi Arabic', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'card-hover': '0 10px 40px -10px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)',
        'glow-blue': '0 0 30px rgba(59,130,246,0.1), 0 0 60px rgba(59,130,246,0.05)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.7s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #030308 0%, #0a0a1a 50%, #0f0f22 100%)',
        'radial-blue': 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
