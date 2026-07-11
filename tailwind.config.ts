import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9fc',
          100: '#d6f1f7',
          200: '#aee2ee',
          300: '#7bcde0',
          400: '#43b1cb',
          500: '#1e96b6',
          600: '#15789a',
          700: '#13617d',
          800: '#144f67',
          900: '#154258',
        },
        medical: {
          mint: '#a8e6cf',
          navy: '#0a2540',
          steel: '#1a3a5c',
          accent: '#00b4d8',
          soft: '#f0f9ff',
        },
      },
      fontFamily: {
        sans: ['var(--font-tajawal)', 'system-ui', 'sans-serif'],
        display: ['var(--font-tajawal)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-medical': 'linear-gradient(135deg, #0a2540 0%, #1a3a5c 50%, #00b4d8 100%)',
        'gradient-soft': 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(0,180,216,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;