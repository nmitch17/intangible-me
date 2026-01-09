/**
 * 3D Bodygraph Color Scheme
 *
 * Colors matching the HD.OS aesthetic with distinct
 * chakra-style center colors and circuit-based channels.
 */

import type { Circuit, CenterName } from '@/types';

/**
 * Extended circuit type including sub-circuits
 */
export type ExtendedCircuit =
  | 'Integration'
  | 'Individual'
  | 'Tribal'
  | 'Collective-Logic'
  | 'Collective-Sensing';

/**
 * Circuit colors for channels (HD.OS style)
 * Each circuit has a distinct color identity
 */
export const CIRCUIT_COLORS: Record<Circuit, number> = {
  Individual: 0x8b7355, // Brown/tan - empowerment & unique path
  Tribal: 0xa65858, // Red/maroon - support & resources
  Collective: 0x5b8db5, // Blue - sharing & logic
};

/**
 * Extended circuit colors including sub-circuits
 */
export const EXTENDED_CIRCUIT_COLORS: Record<ExtendedCircuit, number> = {
  Integration: 0x6bc4c4, // Cyan/teal - self-empowerment
  Individual: 0x8b7355, // Brown/tan - empowerment & unique path
  Tribal: 0xa65858, // Red/maroon - support & resources
  'Collective-Logic': 0x5b8db5, // Blue - logic & understanding
  'Collective-Sensing': 0xc47878, // Red/pink - feeling & sensing
};

/**
 * Circuit colors as hex strings for CSS
 */
export const CIRCUIT_COLORS_HEX: Record<Circuit, string> = {
  Individual: '#8b7355',
  Tribal: '#a65858',
  Collective: '#5b8db5',
};

/**
 * Extended circuit colors as hex strings for CSS
 */
export const EXTENDED_CIRCUIT_COLORS_HEX: Record<ExtendedCircuit, string> = {
  Integration: '#6bc4c4',
  Individual: '#8b7355',
  Tribal: '#a65858',
  'Collective-Logic': '#5b8db5',
  'Collective-Sensing': '#c47878',
};

/**
 * HD.OS style center colors (chakra-inspired)
 */
export const CENTER_COLORS: Record<CenterName, number> = {
  head: 0xe896a7, // Pink/magenta - Crown
  ajna: 0x8b7db1, // Purple/indigo - Third Eye
  throat: 0x5b8dbf, // Blue - Communication
  g: 0x7cb07c, // Green - Heart/Identity
  ego: 0xa65b5b, // Dark red - Willpower
  sacral: 0xe88f45, // Orange - Life Force
  solar_plexus: 0xd4b85b, // Yellow-gold - Emotions
  spleen: 0x6bc4c4, // Cyan - Intuition
  root: 0x8b4b4b, // Dark red/maroon - Grounding
};

/**
 * HD.OS center colors as hex strings
 */
export const CENTER_COLORS_HEX: Record<CenterName, string> = {
  head: '#e896a7',
  ajna: '#8b7db1',
  throat: '#5b8dbf',
  g: '#7cb07c',
  ego: '#a65b5b',
  sacral: '#e88f45',
  solar_plexus: '#d4b85b',
  spleen: '#6bc4c4',
  root: '#8b4b4b',
};

/**
 * State colors for centers and elements
 */
export const STATE_COLORS = {
  defined: 0xff9d6c, // Solar glow - activated/defined
  open: 0x3d2a54, // Dark cosmic - undefined/open
  openEmissive: 0x1a1025, // Subtle glow for open centers
  definedEmissive: 0xff6a3d, // Strong glow for defined
};

/**
 * Activation colors for gates
 */
export const ACTIVATION_COLORS = {
  personality: 0xf0a2b1, // Haze pink - conscious
  design: 0xff6b4a, // Warm red - unconscious
  both: 0xffd700, // Gold - both activated (full channel)
};

/**
 * UI/Scene colors
 */
export const SCENE_COLORS = {
  background: 0x0a0612, // Deep void
  backgroundGradientTop: 0x2e1a47, // Deep cosmos purple
  backgroundGradientBottom: 0x0a0612, // Near black
  ambientLight: 0x4a3a6a, // Soft purple ambient
  directionalLight: 0xfff0e6, // Warm white
  pointLightSolar: 0xff9d6c, // Solar glow
  pointLightCosmic: 0x9d7cff, // Cosmic purple
};

/**
 * Hover and selection states
 */
export const INTERACTION_COLORS = {
  hover: 0xffffff, // White highlight
  hoverEmissive: 0x444444, // Subtle glow on hover
  selected: 0xffd700, // Gold for selection
  selectedEmissive: 0xffaa00, // Strong gold glow
};

/**
 * Center-specific accent colors
 * Each center has a unique accent within the overall scheme
 */
export const CENTER_ACCENT_COLORS: Record<string, number> = {
  head: 0xffe66d, // Yellow - inspiration
  ajna: 0x7dd87d, // Green - mental
  throat: 0x64b5f6, // Blue - expression
  g: 0xffd700, // Gold - identity
  ego: 0xff6b6b, // Red - willpower
  sacral: 0xff8c42, // Orange - life force
  solar_plexus: 0x4ecdc4, // Teal - emotions
  spleen: 0x9d7cff, // Purple - intuition
  root: 0xef5350, // Deep red - pressure
};

/**
 * Material settings for 3D objects
 */
export const MATERIAL_SETTINGS = {
  defined: {
    metalness: 0.2,
    roughness: 0.5,
    emissiveIntensity: 0.3,
    opacity: 1.0,
  },
  open: {
    metalness: 0.1,
    roughness: 0.7,
    emissiveIntensity: 0.05,
    opacity: 0.35,
    transparent: true,
  },
  channelDefined: {
    metalness: 0.3,
    roughness: 0.4,
    emissiveIntensity: 0.5,
    opacity: 1.0,
  },
  channelOpen: {
    metalness: 0.1,
    roughness: 0.6,
    emissiveIntensity: 0.1,
    opacity: 0.25,
    transparent: true,
  },
  channel: {
    metalness: 0.5,
    roughness: 0.3,
    emissiveIntensity: 0.6,
  },
  gate: {
    metalness: 0.4,
    roughness: 0.3,
    emissiveIntensity: 0.5,
  },
};

/**
 * Convert hex number to CSS hex string
 */
export function hexToString(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`;
}

/**
 * Lighten a hex color
 */
export function lightenColor(hex: number, amount: number): number {
  const r = Math.min(255, ((hex >> 16) & 0xff) + Math.round(255 * amount));
  const g = Math.min(255, ((hex >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (hex & 0xff) + Math.round(255 * amount));
  return (r << 16) | (g << 8) | b;
}

/**
 * Darken a hex color
 */
export function darkenColor(hex: number, amount: number): number {
  const r = Math.max(0, ((hex >> 16) & 0xff) - Math.round(255 * amount));
  const g = Math.max(0, ((hex >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (hex & 0xff) - Math.round(255 * amount));
  return (r << 16) | (g << 8) | b;
}

/**
 * Blend two colors
 */
export function blendColors(color1: number, color2: number, ratio: number): number {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;

  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;

  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

  return (r << 16) | (g << 8) | b;
}
