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
          50: '#e8e4dd',
          100: '#d0cbc2',
          200: '#a8a29e',
          300: '#78716c',
          400: '#57534e',
          500: '#44403c',
          600: '#292524',
          700: '#0d0d18',
          800: '#0a0a12',
          900: '#06060c',
          950: '#030308',
        },
        amber: {
          50: '#fefbf0',
          100: '#fdf3d4',
          200: '#fbe5a8',
          300: '#f8d278',
          400: '#e8b84a',
          500: '#c8a24e',
          600: '#a88a3a',
          700: '#8a7030',
          800: '#6c5828',
          900: '#4a3d1c',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'card-hover': '0 10px 40px -10px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)',
        'glow-amber': '0 0 40px rgba(200,162,78,0.08), 0 0 80px rgba(200,162,78,0.04)',
        'glow-gold': '0 0 30px rgba(200,162,78,0.1), 0 0 60px rgba(200,162,78,0.05)',
        'premium': '0 20px 60px -15px rgba(200,162,78,0.15)',
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
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
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
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #08080f 0%, #0a0a12 50%, #0c0c14 100%)',
        'gradient-premium': 'linear-gradient(135deg, #08080f 0%, #0d0d18 40%, #12101a 100%)',
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(200,162,78,0.06) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
