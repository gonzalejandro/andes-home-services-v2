/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7f5',
          100: '#dfeae5',
          200: '#b5d0c4',
          700: '#1B4332',
          800: '#14332A',
          900: '#0B2118',
        },
        accent: {
          DEFAULT: '#1B4332',
          dark: '#14332A',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
