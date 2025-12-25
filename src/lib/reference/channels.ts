import type { Channel, Circuit } from '@/types';

/**
 * All 36 Human Design Channels
 */
export const CHANNELS: Channel[] = [
  // Individual Circuit - Knowing
  { gates: [43, 23], name: 'Structuring', circuit: 'Individual', stream: 'Knowing' },
  { gates: [1, 8], name: 'Inspiration', circuit: 'Individual', stream: 'Knowing' },
  { gates: [2, 14], name: 'The Beat', circuit: 'Individual', stream: 'Knowing' },
  { gates: [3, 60], name: 'Mutation', circuit: 'Individual', stream: 'Knowing' },
  { gates: [39, 55], name: 'Emoting', circuit: 'Individual', stream: 'Knowing' },
  { gates: [12, 22], name: 'Openness', circuit: 'Individual', stream: 'Knowing' },

  // Individual Circuit - Centering
  { gates: [25, 51], name: 'Initiation', circuit: 'Individual', stream: 'Centering' },
  { gates: [10, 34], name: 'Exploration', circuit: 'Individual', stream: 'Centering' },

  // Integration (Individual)
  { gates: [20, 34], name: 'Charisma', circuit: 'Individual', stream: 'Integration' },
  { gates: [10, 20], name: 'Awakening', circuit: 'Individual', stream: 'Integration' },
  { gates: [10, 57], name: 'Perfected Form', circuit: 'Individual', stream: 'Integration' },
  { gates: [20, 57], name: 'Brainwave', circuit: 'Individual', stream: 'Integration' },
  { gates: [34, 57], name: 'Power', circuit: 'Individual', stream: 'Integration' },

  // Tribal Circuit - Ego
  { gates: [21, 45], name: 'Money Line', circuit: 'Tribal', stream: 'Ego' },
  { gates: [26, 44], name: 'Surrender', circuit: 'Tribal', stream: 'Ego' },
  { gates: [37, 40], name: 'Community', circuit: 'Tribal', stream: 'Ego' },

  // Tribal Circuit - Defense
  { gates: [27, 50], name: 'Preservation', circuit: 'Tribal', stream: 'Defense' },
  { gates: [6, 59], name: 'Intimacy', circuit: 'Tribal', stream: 'Defense' },
  { gates: [19, 49], name: 'Synthesis', circuit: 'Tribal', stream: 'Defense' },
  { gates: [32, 54], name: 'Transformation', circuit: 'Tribal', stream: 'Defense' },

  // Collective Circuit - Logic/Understanding
  { gates: [63, 4], name: 'Logic', circuit: 'Collective', stream: 'Logic' },
  { gates: [17, 62], name: 'Acceptance', circuit: 'Collective', stream: 'Logic' },
  { gates: [16, 48], name: 'Wavelength', circuit: 'Collective', stream: 'Logic' },
  { gates: [18, 58], name: 'Judgment', circuit: 'Collective', stream: 'Logic' },
  { gates: [5, 15], name: 'Rhythm', circuit: 'Collective', stream: 'Logic' },
  { gates: [7, 31], name: 'Alpha', circuit: 'Collective', stream: 'Logic' },
  { gates: [9, 52], name: 'Concentration', circuit: 'Collective', stream: 'Logic' },

  // Collective Circuit - Abstract/Sensing
  { gates: [64, 47], name: 'Abstraction', circuit: 'Collective', stream: 'Sensing' },
  { gates: [11, 56], name: 'Curiosity', circuit: 'Collective', stream: 'Sensing' },
  { gates: [13, 33], name: 'Prodigal', circuit: 'Collective', stream: 'Sensing' },
  { gates: [30, 41], name: 'Recognition', circuit: 'Collective', stream: 'Sensing' },
  { gates: [35, 36], name: 'Transitoriness', circuit: 'Collective', stream: 'Sensing' },
  { gates: [29, 46], name: 'Discovery', circuit: 'Collective', stream: 'Sensing' },
  { gates: [42, 53], name: 'Maturation', circuit: 'Collective', stream: 'Sensing' },

  // Additional
  { gates: [28, 38], name: 'Struggle', circuit: 'Individual', stream: 'Knowing' },
  { gates: [24, 61], name: 'Awareness', circuit: 'Individual', stream: 'Knowing' },
];

/**
 * Channel lookup by gate pair
 */
export const CHANNEL_MAP: Record<string, Channel> = {};
for (const channel of CHANNELS) {
  const key1 = `${channel.gates[0]}-${channel.gates[1]}`;
  const key2 = `${channel.gates[1]}-${channel.gates[0]}`;
  CHANNEL_MAP[key1] = channel;
  CHANNEL_MAP[key2] = channel;
}

/**
 * Get channel by gate numbers
 */
export function getChannel(gateA: number, gateB: number): Channel | undefined {
  return CHANNEL_MAP[`${gateA}-${gateB}`];
}
