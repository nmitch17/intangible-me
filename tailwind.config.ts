import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'Space Mono', 'monospace'],
      },
      colors: {
        'nebula-purple': '#6366f1',
        'nebula-pink': '#d946ef',
        'nebula-cyan': '#06b6d4',
        'crystal-bg': 'rgba(255, 255, 255, 0.03)',
        'crystal-border': 'rgba(255, 255, 255, 0.12)',
      },
    },
  },
  plugins: [],
  darkMode: 'media',
};

export default config;
