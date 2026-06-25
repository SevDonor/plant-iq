/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
    extend: {
      colors: {
        garden: {
          50: '#f3fbf3',
          100: '#e4f7e8',
          200: '#c9efd2',
          300: '#9be0ad',
          400: '#5ec77b',
          500: '#27a74f',
          600: '#16843b',
          700: '#126932',
          800: '#11542b',
          900: '#0e4525',
        },
        leaf: '#18a957',
        mist: '#eef8ff',
        sunwash: '#fff8dc',
      },
      boxShadow: {
        card: '0 16px 45px rgba(36, 75, 57, 0.10)',
        soft: '0 10px 24px rgba(15, 74, 40, 0.08)',
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
};
