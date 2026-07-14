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
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
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
        sans: ['Alexandria', 'Tajawal', 'system-ui', 'sans-serif'],
        display: ['Alexandria', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.08)',
        'glow-blue': '0 0 20px rgba(30, 150, 182, 0.15)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.15)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
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
        'gradient-modern': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-cool': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(0,180,216,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
