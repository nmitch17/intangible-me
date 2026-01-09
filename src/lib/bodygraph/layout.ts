/**
 * 3D Bodygraph Layout Configuration
 *
 * Defines positions and geometry for the Human Design bodygraph
 * in 3D space. The bodygraph is centered at origin with Y-axis
 * representing vertical position.
 */

import type { CenterName, Circuit } from '@/types';
import type { ExtendedCircuit } from './colors';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface CenterConfig {
  position: Vector3D;
  scale: number;
  shape: 'triangle' | 'square' | 'diamond';
  gates: number[];
}

/**
 * Center positions in 3D space
 * Layout follows traditional bodygraph structure:
 * - Head at top, Root at bottom
 * - G center in the middle
 * - Spleen on left, Solar Plexus on right
 */
export const CENTER_POSITIONS: Record<CenterName, Vector3D> = {
  head: { x: 0, y: 5.5, z: 0 },
  ajna: { x: 0, y: 4.2, z: 0 },
  throat: { x: 0, y: 2.8, z: 0 },
  g: { x: 0, y: 1.2, z: 0 },
  ego: { x: -1.2, y: 1.6, z: 0 },
  spleen: { x: -1.8, y: -0.2, z: 0 },
  sacral: { x: 0, y: -0.8, z: 0 },
  solar_plexus: { x: 1.8, y: -0.2, z: 0 },
  root: { x: 0, y: -2.8, z: 0 },
};

/**
 * Center configurations with shape and gates
 */
export const CENTER_CONFIGS: Record<CenterName, CenterConfig> = {
  head: {
    position: CENTER_POSITIONS.head,
    scale: 0.6,
    shape: 'triangle',
    gates: [61, 63, 64],
  },
  ajna: {
    position: CENTER_POSITIONS.ajna,
    scale: 0.55,
    shape: 'triangle',
    gates: [4, 11, 17, 24, 43, 47],
  },
  throat: {
    position: CENTER_POSITIONS.throat,
    scale: 0.7,
    shape: 'square',
    gates: [8, 12, 16, 20, 23, 31, 33, 35, 45, 56, 62],
  },
  g: {
    position: CENTER_POSITIONS.g,
    scale: 0.65,
    shape: 'diamond',
    gates: [1, 2, 7, 10, 13, 15, 25, 46],
  },
  ego: {
    position: CENTER_POSITIONS.ego,
    scale: 0.5,
    shape: 'triangle',
    gates: [21, 26, 40, 51],
  },
  spleen: {
    position: CENTER_POSITIONS.spleen,
    scale: 0.55,
    shape: 'triangle',
    gates: [18, 28, 32, 44, 48, 50, 57],
  },
  sacral: {
    position: CENTER_POSITIONS.sacral,
    scale: 0.7,
    shape: 'square',
    gates: [3, 5, 9, 14, 27, 29, 34, 42, 59],
  },
  solar_plexus: {
    position: CENTER_POSITIONS.solar_plexus,
    scale: 0.55,
    shape: 'triangle',
    gates: [6, 22, 30, 36, 37, 49, 55],
  },
  root: {
    position: CENTER_POSITIONS.root,
    scale: 0.7,
    shape: 'square',
    gates: [19, 38, 39, 41, 52, 53, 54, 58, 60],
  },
};

/**
 * Channel connections between centers
 * Maps channel gate pairs to their connecting centers
 */
export const CHANNEL_CENTER_CONNECTIONS: Record<string, [CenterName, CenterName]> = {
  // Head to Ajna
  '64-47': ['head', 'ajna'],
  '61-24': ['head', 'ajna'],
  '63-4': ['head', 'ajna'],

  // Ajna to Throat
  '17-62': ['ajna', 'throat'],
  '43-23': ['ajna', 'throat'],
  '11-56': ['ajna', 'throat'],

  // Throat to G
  '31-7': ['throat', 'g'],
  '8-1': ['throat', 'g'],
  '33-13': ['throat', 'g'],

  // Throat to Ego
  '45-21': ['throat', 'ego'],

  // Throat to Sacral (via G integration)
  '20-34': ['throat', 'sacral'],
  '12-22': ['throat', 'solar_plexus'],
  '35-36': ['throat', 'solar_plexus'],
  '16-48': ['throat', 'spleen'],

  // G to Sacral
  '15-5': ['g', 'sacral'],
  '2-14': ['g', 'sacral'],
  '46-29': ['g', 'sacral'],

  // G to Spleen
  '10-57': ['g', 'spleen'],
  '25-51': ['g', 'ego'],
  '10-34': ['g', 'sacral'],
  '10-20': ['g', 'throat'],

  // Ego to Spleen
  '26-44': ['ego', 'spleen'],

  // Ego to Solar Plexus
  '40-37': ['ego', 'solar_plexus'],

  // Sacral to Spleen
  '34-57': ['sacral', 'spleen'],
  '27-50': ['sacral', 'spleen'],
  '59-6': ['sacral', 'solar_plexus'],

  // Sacral to Root
  '42-53': ['sacral', 'root'],
  '3-60': ['sacral', 'root'],
  '9-52': ['sacral', 'root'],

  // Spleen to Root
  '32-54': ['spleen', 'root'],
  '28-38': ['spleen', 'root'],
  '18-58': ['spleen', 'root'],
  '48-16': ['spleen', 'throat'],
  '57-20': ['spleen', 'throat'],
  '44-26': ['spleen', 'ego'],
  '50-27': ['spleen', 'sacral'],

  // Solar Plexus to Root
  '49-19': ['solar_plexus', 'root'],
  '55-39': ['solar_plexus', 'root'],
  '30-41': ['solar_plexus', 'root'],

  // Additional channels
  '22-12': ['solar_plexus', 'throat'],
  '36-35': ['solar_plexus', 'throat'],
  '37-40': ['solar_plexus', 'ego'],
  '6-59': ['solar_plexus', 'sacral'],
  '39-55': ['root', 'solar_plexus'],
  '41-30': ['root', 'solar_plexus'],
  '19-49': ['root', 'solar_plexus'],
  '52-9': ['root', 'sacral'],
  '53-42': ['root', 'sacral'],
  '60-3': ['root', 'sacral'],
  '54-32': ['root', 'spleen'],
  '38-28': ['root', 'spleen'],
  '58-18': ['root', 'spleen'],
};

/**
 * Gate positions around their center
 * Returns normalized angle for positioning gate indicators
 */
export function getGateAngle(gate: number, center: CenterName): number {
  const config = CENTER_CONFIGS[center];
  const index = config.gates.indexOf(gate);
  if (index === -1) return 0;

  const totalGates = config.gates.length;
  return (index / totalGates) * Math.PI * 2;
}

/**
 * Get gate position in 3D space relative to its center
 */
export function getGatePosition(gate: number, center: CenterName): Vector3D {
  const centerPos = CENTER_POSITIONS[center];
  const angle = getGateAngle(gate, center);
  const radius = CENTER_CONFIGS[center].scale * 1.2;

  return {
    x: centerPos.x + Math.cos(angle) * radius,
    y: centerPos.y + Math.sin(angle) * radius * 0.5, // Flatten vertically
    z: centerPos.z + Math.sin(angle) * 0.3, // Slight depth variation
  };
}

/**
 * All 36 channels in Human Design with their circuit types
 */
export interface ChannelDefinition {
  gates: [number, number];
  name: string;
  circuit: Circuit;
  extendedCircuit: ExtendedCircuit;
  stream: string;
}

export const ALL_CHANNELS: ChannelDefinition[] = [
  // Head to Ajna
  { gates: [64, 47], name: 'Abstraction', circuit: 'Collective', extendedCircuit: 'Collective-Sensing', stream: 'Sensing' },
  { gates: [61, 24], name: 'Awareness', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Knowing' },
  { gates: [63, 4], name: 'Logic', circuit: 'Collective', extendedCircuit: 'Collective-Logic', stream: 'Logic' },

  // Ajna to Throat
  { gates: [17, 62], name: 'Acceptance', circuit: 'Collective', extendedCircuit: 'Collective-Logic', stream: 'Logic' },
  { gates: [43, 23], name: 'Structuring', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Knowing' },
  { gates: [11, 56], name: 'Curiosity', circuit: 'Collective', extendedCircuit: 'Collective-Sensing', stream: 'Sensing' },

  // Throat to G
  { gates: [31, 7], name: 'The Alpha', circuit: 'Collective', extendedCircuit: 'Collective-Logic', stream: 'Logic' },
  { gates: [8, 1], name: 'Inspiration', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Centering' },
  { gates: [33, 13], name: 'The Prodigal', circuit: 'Collective', extendedCircuit: 'Collective-Sensing', stream: 'Sensing' },

  // Throat connections
  { gates: [45, 21], name: 'Money', circuit: 'Tribal', extendedCircuit: 'Tribal', stream: 'Ego' },
  { gates: [20, 34], name: 'Charisma', circuit: 'Individual', extendedCircuit: 'Integration', stream: 'Integration' },
  { gates: [12, 22], name: 'Openness', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Centering' },
  { gates: [35, 36], name: 'Transitoriness', circuit: 'Collective', extendedCircuit: 'Collective-Sensing', stream: 'Sensing' },
  { gates: [16, 48], name: 'The Wavelength', circuit: 'Collective', extendedCircuit: 'Collective-Logic', stream: 'Logic' },
  { gates: [20, 57], name: 'The Brainwave', circuit: 'Individual', extendedCircuit: 'Integration', stream: 'Integration' },
  { gates: [20, 10], name: 'Awakening', circuit: 'Individual', extendedCircuit: 'Integration', stream: 'Integration' },

  // G to Sacral
  { gates: [15, 5], name: 'Rhythm', circuit: 'Collective', extendedCircuit: 'Collective-Logic', stream: 'Logic' },
  { gates: [2, 14], name: 'The Beat', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Centering' },
  { gates: [46, 29], name: 'Discovery', circuit: 'Collective', extendedCircuit: 'Collective-Sensing', stream: 'Sensing' },

  // G to Spleen
  { gates: [10, 57], name: 'Perfected Form', circuit: 'Individual', extendedCircuit: 'Integration', stream: 'Integration' },

  // G to Ego
  { gates: [25, 51], name: 'Initiation', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Centering' },

  // Ego connections
  { gates: [26, 44], name: 'Surrender', circuit: 'Tribal', extendedCircuit: 'Tribal', stream: 'Ego' },
  { gates: [40, 37], name: 'Community', circuit: 'Tribal', extendedCircuit: 'Tribal', stream: 'Ego' },

  // Sacral to Spleen
  { gates: [34, 57], name: 'Power', circuit: 'Individual', extendedCircuit: 'Integration', stream: 'Integration' },
  { gates: [27, 50], name: 'Preservation', circuit: 'Tribal', extendedCircuit: 'Tribal', stream: 'Defense' },

  // Sacral to Solar Plexus
  { gates: [59, 6], name: 'Intimacy', circuit: 'Tribal', extendedCircuit: 'Tribal', stream: 'Defense' },

  // Sacral to Root
  { gates: [42, 53], name: 'Maturation', circuit: 'Collective', extendedCircuit: 'Collective-Sensing', stream: 'Sensing' },
  { gates: [3, 60], name: 'Mutation', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Knowing' },
  { gates: [9, 52], name: 'Concentration', circuit: 'Collective', extendedCircuit: 'Collective-Logic', stream: 'Logic' },

  // Spleen to Root
  { gates: [32, 54], name: 'Transformation', circuit: 'Tribal', extendedCircuit: 'Tribal', stream: 'Ego' },
  { gates: [28, 38], name: 'Struggle', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Knowing' },
  { gates: [18, 58], name: 'Judgement', circuit: 'Collective', extendedCircuit: 'Collective-Logic', stream: 'Logic' },

  // Solar Plexus to Root
  { gates: [49, 19], name: 'Synthesis', circuit: 'Tribal', extendedCircuit: 'Tribal', stream: 'Defense' },
  { gates: [55, 39], name: 'Emoting', circuit: 'Individual', extendedCircuit: 'Individual', stream: 'Knowing' },
  { gates: [30, 41], name: 'Recognition', circuit: 'Collective', extendedCircuit: 'Collective-Sensing', stream: 'Sensing' },
];

/**
 * Channel lookup by gate pair
 */
export function getChannelByGates(gate1: number, gate2: number): ChannelDefinition | undefined {
  return ALL_CHANNELS.find(
    ch => (ch.gates[0] === gate1 && ch.gates[1] === gate2) ||
          (ch.gates[0] === gate2 && ch.gates[1] === gate1)
  );
}

/**
 * Display names for centers
 */
export const CENTER_DISPLAY_NAMES: Record<CenterName, string> = {
  head: 'Head',
  ajna: 'Ajna',
  throat: 'Throat',
  g: 'G (Identity)',
  ego: 'Ego/Heart',
  sacral: 'Sacral',
  solar_plexus: 'Solar Plexus',
  spleen: 'Spleen',
  root: 'Root',
};

/**
 * Center descriptions for info panel
 */
export const CENTER_DESCRIPTIONS: Record<CenterName, string> = {
  head: 'The pressure center for mental inspiration and questions. Source of mental pressure to understand the mysteries of life.',
  ajna: 'The awareness center for mental processing and conceptualization. How you process information and form opinions.',
  throat: 'The center of manifestation and communication. Where thoughts, feelings, and identity are expressed into the world.',
  g: 'The center of identity, love, and direction. Your inner GPS that guides you through life and contains your magnetic monopole.',
  ego: 'The willpower center. Source of material resources, self-worth, and the competitive spirit.',
  sacral: 'The life force and generative center. The motor for work, sexuality, and sustainable energy.',
  solar_plexus: 'The emotional awareness center. The source of emotional intelligence, desire, and passion.',
  spleen: 'The awareness center for survival, intuition, and well-being. Operates in the present moment for health and safety.',
  root: 'The pressure center for adrenaline and stress. Provides the fuel to get things moving and adapt to circumstances.',
};
