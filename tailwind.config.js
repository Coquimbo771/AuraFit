/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sage': '#7C9A92',
        'sage-50': '#F2F5F4',
        'sage-100': '#E8F0EE',
        'sage-200': '#D1DFDB',
        'sage-300': '#BACFC8',
        'sage-400': '#8DB5AB',
        'sage-500': '#7C9A92',
        'sage-600': '#6B8680',
        'sage-700': '#5A726E',
        'sage-800': '#495E5C',
        'sand': '#F5F5DC',
        'sand-50': '#FDFCF9',
        'sand-100': '#FBF9F3',
        'sand-200': '#F7F3E7',
        'sand-300': '#F3EDDB',
        'sand-400': '#EFE7CF',
        'sand-500': '#F5F5DC',
        'neon-blue': '#00F0FF',
        'neon-blue-dark': '#00D9F0',
        'neon-blue-light': '#4FE9FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
