import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0C0F14',
        panel: 'rgba(22, 27, 37, 0.75)',
        neon: '#D6FF00',
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        glow: '0 10px 30px rgba(214, 255, 0, 0.18)',
        soft: '0 8px 24px rgba(0,0,0,0.28)',
      },
      fontSize: {
        hero: ['2rem', { lineHeight: '2.25rem', fontWeight: '800' }],
      },
    },
  },
  plugins: [],
};

export default config;
