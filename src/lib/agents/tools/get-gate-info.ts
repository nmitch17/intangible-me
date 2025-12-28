import { z } from 'zod';

// Gate reference data - 64 gates with their centers and descriptions
const GATES: Record<number, { name: string; center: string; keynote: string }> = {
  1: { name: 'Self-Expression', center: 'g', keynote: 'The gate of creative self-expression and individuality' },
  2: { name: 'Direction of Self', center: 'g', keynote: 'The gate of the receptive, allowing life to unfold' },
  3: { name: 'Ordering', center: 'sacral', keynote: 'The gate of mutation and new beginnings' },
  4: { name: 'Formulization', center: 'ajna', keynote: 'The gate of mental answers and formulas' },
  5: { name: 'Waiting', center: 'sacral', keynote: 'The gate of natural rhythms and patterns' },
  6: { name: 'Friction', center: 'solar_plexus', keynote: 'The gate of emotional intimacy and conflict resolution' },
  7: { name: 'The Role of the Self', center: 'g', keynote: 'The gate of leadership and pointing the way' },
  8: { name: 'Contribution', center: 'throat', keynote: 'The gate of creative contribution and making a mark' },
  9: { name: 'Focus', center: 'sacral', keynote: 'The gate of concentrated energy and determination' },
  10: { name: 'Behavior of the Self', center: 'g', keynote: 'The gate of self-love and awakening' },
  11: { name: 'Ideas', center: 'ajna', keynote: 'The gate of new ideas and conceptualization' },
  12: { name: 'Caution', center: 'throat', keynote: 'The gate of social caution and articulation' },
  13: { name: 'Listener', center: 'g', keynote: 'The gate of the listener and witness' },
  14: { name: 'Power Skills', center: 'sacral', keynote: 'The gate of prosperity and key-holding' },
  15: { name: 'Extremes', center: 'g', keynote: 'The gate of extremes and humanity love' },
  16: { name: 'Skills', center: 'throat', keynote: 'The gate of enthusiasm and identification with skills' },
  17: { name: 'Opinions', center: 'ajna', keynote: 'The gate of following and opinions' },
  18: { name: 'Correction', center: 'spleen', keynote: 'The gate of correction and challenging patterns' },
  19: { name: 'Wanting', center: 'root', keynote: 'The gate of sensitivity to needs' },
  20: { name: 'Now', center: 'throat', keynote: 'The gate of the now and contemplation' },
  21: { name: 'Hunter/Huntress', center: 'ego', keynote: 'The gate of control and the hunter' },
  22: { name: 'Openness', center: 'solar_plexus', keynote: 'The gate of grace and social openness' },
  23: { name: 'Assimilation', center: 'throat', keynote: 'The gate of insight and assimilation' },
  24: { name: 'Rationalization', center: 'ajna', keynote: 'The gate of returning and reviewing' },
  25: { name: 'Innocence', center: 'g', keynote: 'The gate of universal love and innocence' },
  26: { name: 'The Egoist', center: 'ego', keynote: 'The gate of the trickster and accumulation' },
  27: { name: 'Caring', center: 'sacral', keynote: 'The gate of nourishment and caring' },
  28: { name: 'The Game Player', center: 'spleen', keynote: 'The gate of risk-taking and purpose' },
  29: { name: 'Perseverance', center: 'sacral', keynote: 'The gate of saying yes and commitment' },
  30: { name: 'Feelings', center: 'solar_plexus', keynote: 'The gate of intense feelings and desire' },
  31: { name: 'Leading', center: 'throat', keynote: 'The gate of influence and democratic leadership' },
  32: { name: 'Continuity', center: 'spleen', keynote: 'The gate of continuity and instinctive recognition' },
  33: { name: 'Privacy', center: 'throat', keynote: 'The gate of retreat and sharing experiences' },
  34: { name: 'Power', center: 'sacral', keynote: 'The gate of pure power and generation' },
  35: { name: 'Change', center: 'throat', keynote: 'The gate of progress through experience' },
  36: { name: 'Crisis', center: 'solar_plexus', keynote: 'The gate of crisis and dark night of the soul' },
  37: { name: 'Friendship', center: 'solar_plexus', keynote: 'The gate of family and community' },
  38: { name: 'Fighter', center: 'root', keynote: 'The gate of the fighter and opposition' },
  39: { name: 'Provocation', center: 'root', keynote: 'The gate of the provocateur and emotional spirit' },
  40: { name: 'Aloneness', center: 'ego', keynote: 'The gate of deliverance and will power' },
  41: { name: 'Contraction', center: 'root', keynote: 'The gate of decrease and new experience' },
  42: { name: 'Growth', center: 'sacral', keynote: 'The gate of finishing and completion' },
  43: { name: 'Insight', center: 'ajna', keynote: 'The gate of breakthrough and insight' },
  44: { name: 'Alertness', center: 'spleen', keynote: 'The gate of alertness to patterns' },
  45: { name: 'Gatherer', center: 'throat', keynote: 'The gate of the gatherer and prosperity' },
  46: { name: 'Love of Body', center: 'g', keynote: 'The gate of determination and serendipity' },
  47: { name: 'Realization', center: 'ajna', keynote: 'The gate of realization and abstract oppression' },
  48: { name: 'Depth', center: 'spleen', keynote: 'The gate of depth and the well' },
  49: { name: 'Principles', center: 'solar_plexus', keynote: 'The gate of revolution and rejection' },
  50: { name: 'Values', center: 'spleen', keynote: 'The gate of values and the guardian' },
  51: { name: 'Shock', center: 'ego', keynote: 'The gate of arousing and initiative' },
  52: { name: 'Stillness', center: 'root', keynote: 'The gate of inaction and concentration' },
  53: { name: 'Beginnings', center: 'root', keynote: 'The gate of starting and maturation' },
  54: { name: 'Ambition', center: 'root', keynote: 'The gate of drive and marrying upward' },
  55: { name: 'Spirit', center: 'solar_plexus', keynote: 'The gate of abundance and spirit' },
  56: { name: 'Stimulation', center: 'throat', keynote: 'The gate of the storyteller and wanderer' },
  57: { name: 'Intuition', center: 'spleen', keynote: 'The gate of intuitive insight and clarity' },
  58: { name: 'Vitality', center: 'root', keynote: 'The gate of joy and aliveness' },
  59: { name: 'Sexuality', center: 'sacral', keynote: 'The gate of sexuality and intimacy' },
  60: { name: 'Acceptance', center: 'root', keynote: 'The gate of acceptance and limitation' },
  61: { name: 'Mystery', center: 'head', keynote: 'The gate of inner truth and mystery' },
  62: { name: 'Details', center: 'throat', keynote: 'The gate of precision and expression of details' },
  63: { name: 'Doubt', center: 'head', keynote: 'The gate of questioning and logical doubt' },
  64: { name: 'Confusion', center: 'head', keynote: 'The gate of divine confusion and before completion' },
};

export const getGateInfoToolDefinition = {
  name: 'getGateInfo',
  description: 'Get detailed information about a specific Human Design gate, including its name, center location, and keynotes.',
  parameters: z.object({
    gate_id: z.number().min(1).max(64).describe('The gate number (1-64)'),
  }),
};

export async function executeGetGateInfo({ gate_id }: { gate_id: number }) {
  try {
    const gate = GATES[gate_id];

    if (!gate) {
      return {
        success: false,
        error: `Gate ${gate_id} not found. Valid gates are 1-64.`,
      };
    }

    return {
      success: true,
      gate: {
        id: gate_id,
        ...gate,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
