/** @type {import('tailwindcss').Config} */

/*
 * Design tokens ported from the designer's mockup (nani-tutorial/styles.css).
 * The mockup sets `html { font-size: 15px }` — global.css keeps that, so every
 * rem-based Tailwind utility lines up 1:1 with the rem values in the mockup.
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // Breakpoints mirror the mockup's three media queries (600 / 960 / 1080)
    // so responsive behaviour matches what the designer built.
    screens: {
      sm: '601px',
      md: '768px',
      lg: '961px',
      xl: '1081px',
      '2xl': '1280px',
    },
    extend: {
      colors: {
        // Brand green ramp. 900/800/500 are the mockup's --green-* variables;
        // 50/100/200 carry over from the previous theme (the reviews section
        // already used them and the mockup kept those exact values).
        brand: {
          50: '#f2f7f5',
          100: '#dfeae5',
          200: '#b5d0c4',
          300: '#8fbab3', // teal blob in the mesh gradient
          500: '#3f7a5a', // --green-500
          800: '#1f4a3b', // --green-800
          900: '#15362b', // --green-900, the primary brand dark
        },
        accent: '#6fa668', // eyebrows, accent buttons, feature panel
        sage: '#73956f',
        cream: '#faf7f2',
        sand: '#f0ede6',
        ink: '#1e1e1e',
        muted: '#5f6b5f',
        hairline: '#e3ddd1',
        mist: '#c3c8d6', // terracotta/grey blob in the mesh gradient
        mint: '#a8b5b1', // third service panel
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Bai Jamjuree', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid type scale from the mockup
        eyebrow: ['0.72rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        'display-sm': ['clamp(1.4rem, 2.2vw, 1.75rem)', { lineHeight: '1.15' }],
        'display-md': ['clamp(1.5rem, 2.8vw, 2rem)', { lineHeight: '1.15' }],
        'display-lg': ['clamp(1.8rem, 3vw, 2.4rem)', { lineHeight: '1.15' }],
        'display-xl': ['clamp(2.2rem, 3.8vw, 3rem)', { lineHeight: '1.1' }],
        hero: ['clamp(2.6rem, 5vw, 3.8rem)', { lineHeight: '1.05' }],
      },
      maxWidth: {
        shell: '1200px', // --container
      },
      borderRadius: {
        theme: '10px', // --radius
      },
      boxShadow: {
        soft: '0 6px 20px rgb(30 30 30 / 0.08)', // --shadow
        lift: '0 12px 28px rgb(30 30 30 / 0.12)', // card/carousel hover
      },
      flex: {
        // .svc-card grows from flex:1 to flex:1.7 on hover
        '1.7': '1.7 1.7 0%',
      },
      transitionTimingFunction: {
        swoop: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionProperty: {
        flex: 'flex',
        size: 'flex, padding, font-size, max-height, opacity, margin',
      },
      keyframes: {
        'hero-zoom': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(1.08)' },
        },
        // 3 images x 2.5s, offset with negative delays
        'carousel-fade': {
          '0%, 26.7%': { opacity: '1' },
          '33.3%, 93.3%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'hero-zoom': 'hero-zoom 5s ease-in-out infinite alternate',
        'carousel-fade': 'carousel-fade 7.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
