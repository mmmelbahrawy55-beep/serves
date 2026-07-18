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
        gold: {
          50: '#fffdf0',
          100: '#fff9d6',
          200: '#fff2a3',
          300: '#ffe870',
          400: '#ffde3d',
          500: '#FFD700',
          600: '#e6c200',
          700: '#b39b00',
          800: '#806f00',
          900: '#4d4300',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#1e1e2f',
          800: '#16162a',
          900: '#0d0d1a',
          950: '#070714',
        },
        primary: {
          50: '#fffbeb',
          100: '#fff5cc',
          200: '#ffeb99',
          300: '#ffe066',
          400: '#ffd633',
          500: '#FFD700',
          600: '#ccac00',
          700: '#998100',
          800: '#665600',
          900: '#332b00',
        },
      },
      fontFamily: {
        sans: ['Alexandria', 'Tajawal', 'system-ui', 'sans-serif'],
        display: ['Alexandria', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px -5px rgba(255, 215, 0, 0.25)',
        'gold-lg': '0 10px 40px -10px rgba(255, 215, 0, 0.3)',
        'dark': '0 4px 20px -5px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.4)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'card-hover': '0 10px 40px -10px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)',
        'glow-gold': '0 0 30px rgba(255, 215, 0, 0.15), 0 0 60px rgba(255, 215, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
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
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-gold-subtle': 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.05) 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(255,215,0,0.08) 0%, transparent 70%)',
        'radial-dark': 'radial-gradient(circle at 50% 0%, rgba(255,215,0,0.03) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
