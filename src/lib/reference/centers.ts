import type { CenterName } from '@/types';

export interface CenterReference {
  name: string;
  key: CenterName;
  theme: string;
  definedDescription: string;
  undefinedDescription: string;
  notSelfTheme: string;
}

/**
 * All 9 Human Design Centers with interpretation data
 */
export const CENTERS: CenterReference[] = [
  {
    name: 'Head',
    key: 'head',
    theme: 'Inspiration & Mental Pressure',
    definedDescription: 'You have a consistent way of processing mental inspiration and questions. Your mind generates questions and ideas from a fixed place within you. You have a reliable mental pressure that drives you to think about specific types of questions and concepts. This is your consistent source of mental inspiration.',
    undefinedDescription: 'You are open and receptive to the mental pressure and inspiration of others. You can take in many different ways of thinking and question asking. You amplify the mental pressure of those around you and can become deeply identified with questions that aren\'t yours. Your openness here is designed to sample many different ways of thinking and gain wisdom about mental pressure.',
    notSelfTheme: 'Mental pressure to answer questions that don\'t matter to you, trying to prove you\'re intelligent by having all the answers, becoming overwhelmed by mental pressure from others.'
  },
  {
    name: 'Ajna',
    key: 'ajna',
    theme: 'Conceptualization & Mental Awareness',
    definedDescription: 'You have a fixed way of processing and conceptualizing information. Your mental awareness and way of thinking about things is consistent and reliable. You think about life through a particular filter or lens that doesn\'t change. This gives you a dependable mental awareness and way of making sense of experiences and information.',
    undefinedDescription: 'You are open and flexible in how you think about and conceptualize life. You can see things from many different perspectives and are capable of incredible mental flexibility. You amplify and experience different ways of thinking and can become attached to certainty and fixed opinions as you seek to feel mentally secure. Your openness allows you to gain wisdom about different ways of thinking.',
    notSelfTheme: 'Pretending to be certain when you\'re not, getting locked into fixed opinions to feel secure, mental inflexibility born from fear of not knowing.'
  },
  {
    name: 'Throat',
    key: 'throat',
    theme: 'Manifestation & Communication',
    definedDescription: 'You have consistent access to manifestation and expression. Your voice and ability to communicate or take action in the world is reliable. You have a fixed way of bringing things into form through speech or action. How you manifest depends on what connects to your Throat - whether through motor centers (action) or awareness centers (communication).',
    undefinedDescription: 'You are open in how you communicate and manifest. You can speak and act in many different ways and are designed to sample diverse forms of expression. You amplify the communication of others and may feel pressure to speak or initiate action to be heard or noticed. Your openness allows you to become wise about communication and knowing when to speak.',
    notSelfTheme: 'Talking to get attention, initiating action to prove your worth, speaking when you have nothing to say, struggling to be heard.'
  },
  {
    name: 'G Center (Identity)',
    key: 'g',
    theme: 'Identity, Direction & Love',
    definedDescription: 'You have a fixed sense of self and direction in life. Your identity and life path are consistent - you know who you are and where you\'re going, even if the how and when remain mysterious. You have a reliable sense of self that doesn\'t change based on your environment or the people around you. Your direction in life comes from within.',
    undefinedDescription: 'You are open and fluid in your sense of self and direction. You experience many different identities and life directions through the people and places around you. You can deeply identify with others and their paths, searching for yourself in relationships and environments. Your openness allows you to gain wisdom about identity and direction, understanding that you are designed to experience many selves.',
    notSelfTheme: 'Searching for yourself in others and places, lacking a consistent sense of who you are, trying to hold onto one fixed identity, feeling lost without a clear direction.'
  },
  {
    name: 'Ego (Heart/Will)',
    key: 'ego',
    theme: 'Willpower & Self-Worth',
    definedDescription: 'You have consistent access to willpower and self-worth. Your ego strength and ability to make and keep promises is reliable. You have a fixed sense of your own value and consistent access to willpower for things that are correct for you. You can make commitments and have the will to follow through when it\'s aligned with your design.',
    undefinedDescription: 'You are open in the realm of willpower and self-worth. You experience willpower inconsistently and can amplify the ego energy of others. You may try to prove your worth or make promises you can\'t keep to feel valuable. Your openness allows you to become wise about self-worth, learning that your value is not based on what you do or prove, and that rest is essential.',
    notSelfTheme: 'Trying to prove yourself worthy, making promises you can\'t keep, over-committing and burning out, tying your value to productivity and achievement.'
  },
  {
    name: 'Sacral',
    key: 'sacral',
    theme: 'Life Force & Response',
    definedDescription: 'You have consistent access to life force energy and the power to sustain work. Your Sacral motor gives you reliable energy for doing when you\'re responding to life. You are designed to work, build, and engage with life through response. Your energy is a powerful resource when used correctly - responding to what life brings rather than initiating.',
    undefinedDescription: 'You do not have consistent access to life force energy. You are not designed to work in the same sustainable way as Sacral beings. You take in and amplify Sacral energy, which can make you feel like you have more energy than you do. Your openness here is about learning when enough is enough and recognizing that your energy works in cycles, requiring rest and restoration.',
    notSelfTheme: 'Exhaustion from overworking, not knowing when to stop, feeling like you should be able to work as much as others, ignoring your need for rest.'
  },
  {
    name: 'Solar Plexus (Emotional)',
    key: 'solar_plexus',
    theme: 'Emotions & Emotional Awareness',
    definedDescription: 'You have a consistent emotional wave and emotional authority. Your emotions move in waves - highs and lows - that are not caused by external circumstances but are your natural chemistry. You are here to ride your emotional wave and wait for clarity over time before making major decisions. Your emotional awareness is a powerful guidance system when you honor your wave.',
    undefinedDescription: 'You are open and receptive to the emotions of others. You take in, amplify, and can deeply feel the emotional waves of those around you. You may struggle to know which emotions are yours and can become attached to keeping the peace or avoiding confrontation. Your openness allows you to develop empathy and emotional wisdom, learning to let emotions flow through you without holding on.',
    notSelfTheme: 'Avoiding confrontation to keep the peace, holding onto emotions that aren\'t yours, trying to maintain emotional highs or fix emotional lows, people-pleasing to avoid negative emotions.'
  },
  {
    name: 'Spleen',
    key: 'spleen',
    theme: 'Intuition, Health & Survival',
    definedDescription: 'You have consistent access to splenic intuition and body intelligence. Your awareness of health, safety, and well-being is reliable and speaks to you in the moment. Your splenic awareness is spontaneous, only speaks once, and is designed to keep you safe and healthy. You have a dependable intuitive knowing that comes from your body.',
    undefinedDescription: 'You are open to splenic awareness and can experience many forms of intuition and body intelligence. You amplify fears and health concerns, and may hold onto things, people, or situations that aren\'t healthy out of fear. Your openness allows you to become wise about fear, health, and well-being, learning to recognize what is truly dangerous versus conditioned fear.',
    notSelfTheme: 'Holding onto what\'s not good for you out of fear, amplifying health anxieties, being unable to let go of people or situations that are unhealthy, making fear-based decisions.'
  },
  {
    name: 'Root',
    key: 'root',
    theme: 'Pressure & Drive',
    definedDescription: 'You have consistent pressure and drive to do, evolve, and move. Your Root motor provides reliable fuel for action and momentum. You experience a steady pressure to complete things, move forward, and get things done. This pressure is your fuel, but it\'s important to use it correctly according to your Type and Strategy rather than letting it run you.',
    undefinedDescription: 'You are open to pressure and adrenaline from others and the world. You amplify stress and pressure, which can make you feel like you\'re always running out of time or need to hurry. You may rush to relieve pressure that isn\'t even yours. Your openness allows you to become wise about pressure and develop the capacity to remain calm in stressful situations, knowing most pressure is not yours to carry.',
    notSelfTheme: 'Always feeling rushed and under pressure, hurrying to get things done to relieve pressure, stress and anxiety about time, taking on stress from others as if it\'s your own.'
  }
];

/**
 * Center lookup by key
 */
export const CENTER_MAP: Record<CenterName, CenterReference> = {
  head: CENTERS[0],
  ajna: CENTERS[1],
  throat: CENTERS[2],
  g: CENTERS[3],
  ego: CENTERS[4],
  sacral: CENTERS[5],
  solar_plexus: CENTERS[6],
  spleen: CENTERS[7],
  root: CENTERS[8],
};

/**
 * Get center reference by key
 */
export function getCenter(key: CenterName): CenterReference | undefined {
  return CENTER_MAP[key];
}
