# Solar Haze Portal UI Redesign

**ADW ID:** N/A
**Date:** 2025-12-26
**Specification:** N/A

## Overview

Complete visual redesign of the Human Design app from a dark "Cosmic" glassmorphism theme to a new "Solar Haze Portal" design system. The redesign features claymorphism (soft 3D clay-like surfaces), neumorphic inputs, warm orange/pink gradient accents, and animated background elements including floating orbs and sparkle particles.

## What Was Built

- **New Design System**: Solar Haze Portal with warm color palette (solar orange, haze pink, deep purple)
- **Claymorphic Cards**: White surfaces with soft multi-directional shadows (60px/40px border radius)
- **Neumorphic Inputs**: Inset shadows on light purple backgrounds (#f7f3ff)
- **Gradient Buttons**: Solar-to-pink gradient with glow effects (no size/position transforms on hover)
- **Animated Background**: Three floating blurred orbs with drift animation
- **Sparkle Particles**: 20 randomly-positioned animated particles (client-side only to avoid hydration mismatch)
- **New Typography**: Outfit (body), DM Serif Display (headings), JetBrains Mono (labels)
- **Grain Overlay**: 4% opacity noise texture

## Technical Implementation

### Files Modified

- `src/app/globals.css`: Complete rewrite with Solar Haze design tokens, component styles, and animations
- `tailwind.config.ts`: Extended theme with new colors, border-radius, box-shadows, and animations
- `src/app/layout.tsx`: Replaced fonts (Inter/Space Mono → Outfit/DM Serif Display/JetBrains Mono)
- `src/app/page.tsx`: New background elements, removed parallax effect, client-side sparkle generation
- `src/components/form/CosmicBirthForm.tsx`: Solar input/button styling, updated dropdown colors
- `src/components/ui/Card.tsx`: Updated title color to solar-glow
- `src/components/ui/Badge.tsx`: Light theme variants + new 'solar' and 'pink' variants
- `src/components/ui/Spinner.tsx`: Updated to solar-glow color
- `src/components/chart/*.tsx`: All 7 chart components updated for light theme

### Key Changes

- **Color Palette**: Shifted from dark (cyan/purple on black) to light (orange/pink on white cards, purple background)
- **CSS Variables**: New tokens: `--solar-glow`, `--haze-pink`, `--deep-cosmos`, `--clay-surface`, `--input-bg`
- **Shadow System**: Claymorphic (dual-direction soft shadows) and neumorphic (inset shadows) patterns
- **Animation System**: `drift` (20s orbs), `slideUp` (1.2s entrance), `sparkle` (4s particle fade)
- **Hydration Fix**: Sparkles use `useState` + `useEffect` instead of `useMemo` to avoid SSR/client mismatch

### Design Tokens

```css
--solar-glow: #ff9d6c    /* Primary accent */
--haze-pink: #f0a2b1     /* Secondary accent */
--deep-cosmos: #2e1a47   /* Text color */
--clay-surface: #ffffff  /* Card backgrounds */
--input-bg: #f7f3ff      /* Input backgrounds */
```

## How to Use

1. Run `npm run dev` to start the development server
2. The new design applies automatically to all pages
3. Use CSS classes for styling:
   - `.clay-card` for claymorphic containers
   - `.solar-input-group` + `.solar-input` for form inputs
   - `.solar-button` for gradient buttons
   - `.data-point` for label styling with gradient accent line

## Configuration

No additional configuration required. All design tokens are defined in:
- `src/app/globals.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind theme extensions

## Testing

1. Visual inspection of all pages on desktop and mobile
2. Verify hydration: no console errors about server/client mismatch
3. Test animations: orbs drift smoothly, sparkles fade in/out
4. Test form: inputs show focus states, button shows hover glow
5. Test chart results: cards display with proper shadows

Run build to verify no TypeScript errors:
```bash
npm run build
```

## Notes

- **Hydration**: Sparkle positions use client-side state to avoid SSR mismatch
- **Button Interactions**: Per user request, buttons do not change size or position on hover - only shadow/glow changes
- **Background**: Fixed position orbs may overlap content on very long pages
- **Font Loading**: Three Google Fonts are loaded - monitor performance if needed
