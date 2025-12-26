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
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-serif)', 'DM Serif Display', 'serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        'solar-glow': '#ff9d6c',
        'haze-pink': '#f0a2b1',
        'deep-cosmos': '#2e1a47',
        'clay-surface': '#ffffff',
        'glass-shine': 'rgba(255, 255, 255, 0.25)',
        'soft-shadow': 'rgba(74, 34, 122, 0.15)',
        'input-bg': '#f7f3ff',
      },
      borderRadius: {
        'clay': '60px',
        'clay-sm': '40px',
        'input': '30px',
      },
      boxShadow: {
        'clay': '25px 25px 60px rgba(74, 34, 122, 0.15), -15px -15px 50px rgba(255, 255, 255, 0.6)',
        'clay-hover': '30px 30px 70px rgba(74, 34, 122, 0.15), -18px -18px 55px rgba(255, 255, 255, 0.7)',
        'neumorphic': 'inset 5px 5px 12px rgba(74, 34, 122, 0.08), inset -5px -5px 12px rgba(255, 255, 255, 0.9)',
        'neumorphic-focus': 'inset 3px 3px 8px rgba(74, 34, 122, 0.06), inset -3px -3px 8px rgba(255, 255, 255, 1)',
        'solar-button': '0 12px 35px rgba(255, 157, 108, 0.35), 0 4px 15px rgba(240, 162, 177, 0.25)',
      },
      animation: {
        'drift': 'drift 20s infinite alternate ease-in-out',
        'slideUp': 'slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'sparkle': 'sparkle 4s infinite',
      },
      keyframes: {
        drift: {
          from: { transform: 'translate(0, 0) rotate(0deg)' },
          to: { transform: 'translate(60px, 40px) rotate(8deg)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(50px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '0.6', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'media',
};

export default config;
