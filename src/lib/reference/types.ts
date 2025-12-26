import type { HumanDesignType, Strategy } from '@/types';

export interface TypeReference {
  name: HumanDesignType;
  strategy: Strategy;
  signature: string;
  notSelf: string;
  description: string;
  aura: string;
}

/**
 * All 5 Human Design Types with interpretation data
 */
export const TYPES: TypeReference[] = [
  {
    name: 'Manifestor',
    strategy: 'Inform',
    signature: 'Peace',
    notSelf: 'Anger',
    description: 'Manifestors are the only Type designed to initiate action without waiting. You are here to make things happen and impact others with your energy. Your aura is closed and repelling, designed to push through resistance and make things happen. You represent about 9% of the population. Your Strategy is to inform those who will be impacted by your actions before you act. When you inform, you minimize resistance and move through life with greater ease. Your power lies in your ability to start things, but you are not designed to do all the work yourself - that\'s for Generators. You\'re here to initiate, inform, and then let others help bring your visions into form. When you\'re living correctly, you experience peace. When you\'re not informing or trying to force things, you experience anger.',
    aura: 'Closed and repelling - designed to push through and impact. Your aura creates resistance naturally, which is why informing is so important to minimize that resistance.'
  },
  {
    name: 'Generator',
    strategy: 'Wait to Respond',
    signature: 'Satisfaction',
    notSelf: 'Frustration',
    description: 'Generators are the life force of the planet, representing about 37% of the population (pure Generators, not including Manifesting Generators). You have a defined Sacral center that gives you consistent access to sustainable life force energy. Your Strategy is to wait to respond - to let life come to you and respond with your Sacral sounds (uh-huh or uhn-uhn). You are not designed to initiate, but to respond to what life brings. When you respond to things that light you up, you have incredible energy to work, build, and master what you love. Your power is in your response and your ability to know what is correct for you through that Sacral response. When you\'re responding correctly, you experience satisfaction and have energy for what you\'re doing. When you\'re initiating or doing things your Sacral didn\'t respond to, you experience frustration and exhaustion.',
    aura: 'Open and enveloping - designed to draw life to you so you can respond. Your aura pulls people and opportunities in, giving you things to respond to.'
  },
  {
    name: 'Manifesting Generator',
    strategy: 'Wait to Respond',
    signature: 'Satisfaction & Peace',
    notSelf: 'Frustration & Anger',
    description: 'Manifesting Generators are a hybrid Type combining Generator and Manifestor qualities, representing about 33% of the population. Like Generators, you have a defined Sacral and are designed to wait to respond. Like Manifestors, you have a motor connected to the Throat, giving you the ability to manifest and move quickly. You are the most multi-passionate, multi-talented Type, designed to do many things and skip steps. Your Strategy is to wait to respond, and once you respond, to inform before you act. You move fast, often faster than others can track, which is why informing is important. You\'re here to find the shortcuts and most efficient paths. When you respond correctly and inform, you experience both satisfaction (from responding) and peace (from informing). When you initiate without responding or act without informing, you experience frustration and anger.',
    aura: 'Open and enveloping like Generators, but with manifestor-like impact - designed to respond, then move quickly and powerfully.'
  },
  {
    name: 'Projector',
    strategy: 'Wait for Invitation',
    signature: 'Success',
    notSelf: 'Bitterness',
    description: 'Projectors are the guides and managers of humanity, representing about 20% of the population. You do not have a defined Sacral, which means you don\'t have consistent access to sustainable work energy. Your gift is in seeing others, seeing systems, and guiding energy effectively. Your Strategy is to wait for invitation - specifically for the big things in life (career, relationships, where you live). When you\'re invited and recognized, people are ready to hear your guidance. You\'re not here to work in the traditional sense, but to guide, manage, and direct the energy of others. Your aura is focused and penetrating - you see deeply into others and systems. When you wait for invitations and are recognized for your gifts, you experience success. When you try to force your way in or share your guidance without invitation, you experience bitterness and rejection.',
    aura: 'Focused and penetrating - designed to see deeply into others and systems. Your aura takes in specific people and situations to understand them deeply.'
  },
  {
    name: 'Reflector',
    strategy: 'Wait Lunar Cycle',
    signature: 'Surprise',
    notSelf: 'Disappointment',
    description: 'Reflectors are the rarest Type, representing about 1% of the population. You have no centers defined, which makes you completely open and receptive to the world around you. You are the ultimate mirrors of your community and environment, deeply sampling and reflecting the health of the world around you. Your Strategy is to wait a full lunar cycle (about 28 days) before making major decisions, as you experience the moon activating each gate and need that full cycle to gain clarity. You are deeply connected to the lunar cycle and experience life through the moon\'s transit. Your aura is resistant and sampling - you take everything in but in a protected way. You\'re here to experience all of life and reflect back the truth of what you experience. When you\'re in the right environment with the right people and honoring your lunar cycle, you experience surprise and delight. When you\'re in the wrong environment or rushing decisions, you experience disappointment.',
    aura: 'Resistant and sampling - designed to take in and reflect everything while maintaining energetic protection. Your aura samples the world without being defined by it.'
  }
];

/**
 * Type lookup by name
 */
export const TYPE_MAP: Record<HumanDesignType, TypeReference> = {
  'Manifestor': TYPES[0],
  'Generator': TYPES[1],
  'Manifesting Generator': TYPES[2],
  'Projector': TYPES[3],
  'Reflector': TYPES[4],
};

/**
 * Get type reference by name
 */
export function getType(name: HumanDesignType): TypeReference | undefined {
  return TYPE_MAP[name];
}
