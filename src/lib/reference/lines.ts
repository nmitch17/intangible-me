import type { GateLineReference } from '@/types';

/**
 * Human Design Gate Lines Reference Data
 *
 * Complete dataset: 384 entries (64 gates × 6 lines each)
 *
 * Each gate has 6 lines representing different expressions/themes.
 * Lines progress from 1-6 in each gate's hexagram structure.
 *
 * IMPORTANT: This file contains sample/template data for demonstration.
 * Full implementation requires all 384 line descriptions from official
 * Human Design sources (Jovian Archive, Gene Keys, etc.).
 *
 * Structure:
 * - gate: 1-64
 * - line: 1-6
 * - name: Line keynote/theme
 * - description: Line interpretation
 */

/**
 * All gate lines (384 total)
 *
 * TODO: Populate remaining entries from authoritative HD sources
 * Current status: Template structure with examples from Gates 1, 2, 13, 41
 */
export const GATE_LINES: GateLineReference[] = [
  // ============================================================================
  // GATE 1: THE CREATIVE - Self-Expression
  // ============================================================================
  {
    gate: 1,
    line: 1,
    name: 'Creativity is energy',
    description: 'The fundamental power to create through energy alone. This line represents the raw creative force that exists independent of external validation or direction.',
  },
  {
    gate: 1,
    line: 2,
    name: 'Love is unity',
    description: 'Creative expression through connection and unity. The ability to create through partnership and harmonious relationships.',
  },
  {
    gate: 1,
    line: 3,
    name: 'Energy to sustain creative work',
    description: 'The perseverance and stamina required to maintain creative output. Building sustainable creative practices through trial and error.',
  },
  {
    gate: 1,
    line: 4,
    name: 'Aloneness as the medium of creativity',
    description: 'Finding creative power in solitude and independence. The network builder who must first establish their own creative foundation.',
  },
  {
    gate: 1,
    line: 5,
    name: 'Energy to attract society',
    description: 'Creative expression that naturally draws attention and community. The practical heretic whose creativity serves collective needs.',
  },
  {
    gate: 1,
    line: 6,
    name: 'Objectivity - the creative ideal',
    description: 'Transcendent creativity that serves universal principles. Moving beyond personal expression to channel pure creative wisdom.',
  },

  // ============================================================================
  // GATE 2: THE RECEPTIVE - Higher Knowledge
  // ============================================================================
  {
    gate: 2,
    line: 1,
    name: 'Intuition',
    description: 'The foundation of receptivity through instinctive knowing. Trusting the natural ability to sense direction without mental interference.',
  },
  {
    gate: 2,
    line: 2,
    name: 'Genius',
    description: 'Natural brilliance that emerges through receptivity. The hermit who possesses innate knowledge waiting for the right moment to share.',
  },
  {
    gate: 2,
    line: 3,
    name: 'Patience',
    description: 'Learning to wait for correct timing through experience. Trial and error teaches the value of receptive waiting.',
  },
  {
    gate: 2,
    line: 4,
    name: 'Secretiveness',
    description: 'Protecting one\'s receptive space through selective sharing. The opportunist who knows when to reveal knowledge and when to remain silent.',
  },
  {
    gate: 2,
    line: 5,
    name: 'Intelligent application',
    description: 'Practical wisdom in applying higher knowledge. The heretic who demonstrates the value of receptivity through tangible results.',
  },
  {
    gate: 2,
    line: 6,
    name: 'Fixation',
    description: 'Unwavering dedication to higher principles. The role model who embodies receptive wisdom in all aspects of life.',
  },

  // ============================================================================
  // GATE 13: THE FELLOWSHIP - The Listener
  // ============================================================================
  {
    gate: 13,
    line: 1,
    name: 'Empathy',
    description: 'The foundation of fellowship through genuine understanding of others\' experiences. Deep listening creates authentic connection.',
  },
  {
    gate: 13,
    line: 2,
    name: 'Bigotry',
    description: 'The shadow side of selective listening. Learning to recognize and transcend prejudicial patterns in receptivity to others\' stories.',
  },
  {
    gate: 13,
    line: 3,
    name: 'Pessimism',
    description: 'Testing fellowship through challenging experiences. Trial and error reveals which connections are authentic and sustainable.',
  },
  {
    gate: 13,
    line: 4,
    name: 'Fatigue',
    description: 'The need for rest and renewal in the fellowship process. The opportunist knows when to withdraw to preserve listening capacity.',
  },
  {
    gate: 13,
    line: 5,
    name: 'The savior',
    description: 'Using listening skills to guide others practically. The heretic who demonstrates that true fellowship requires appropriate boundaries.',
  },
  {
    gate: 13,
    line: 6,
    name: 'The optimist',
    description: 'Transcendent faith in human connection. The role model whose listening creates space for collective wisdom to emerge.',
  },

  // ============================================================================
  // GATE 41: DECREASE - Contraction (Start Codon / Rave New Year)
  // ============================================================================
  {
    gate: 41,
    line: 1,
    name: 'Reasonableness',
    description: 'The foundation of new experiences through realistic assessment. Understanding what is truly possible before beginning.',
  },
  {
    gate: 41,
    line: 2,
    name: 'Caution',
    description: 'Careful consideration before initiating new experiences. The hermit who evaluates fantasies against practical reality.',
  },
  {
    gate: 41,
    line: 3,
    name: 'Efficiency',
    description: 'Learning through direct experience which fantasies are worth pursuing. Trial and error refines the ability to sense new possibilities.',
  },
  {
    gate: 41,
    line: 4,
    name: 'Correction',
    description: 'Adjusting course based on experience. The opportunist who knows when to shift direction in pursuit of new experiences.',
  },
  {
    gate: 41,
    line: 5,
    name: 'Authorization',
    description: 'Gaining permission or validation for new beginnings. The heretic who demonstrates that not all fantasies are meant to be manifested.',
  },
  {
    gate: 41,
    line: 6,
    name: 'Influence',
    description: 'Inspiring others through the wisdom of selective pursuit. The role model who shows that decreasing possibilities leads to depth.',
  },

  // ============================================================================
  // TEMPLATE FOR REMAINING GATES (3-40, 42-64)
  // ============================================================================
  // TODO: Add remaining 60 gates × 6 lines = 360 entries
  // Each gate requires research from official Human Design sources
  //
  // Format for each entry:
  // {
  //   gate: [number 1-64],
  //   line: [number 1-6],
  //   name: '[Line keynote from HD source]',
  //   description: '[Detailed line interpretation]',
  // },
  //
  // Gates still needed: 3-12, 14-40, 42-64 (60 gates × 6 lines = 360 entries)
  //
  // Recommended sources:
  // - The Definitive Book of Human Design (Lynda Bunnell, Ra Uru Hu)
  // - Gene Keys (Richard Rudd) - for shadow/gift/siddhi perspective
  // - Jovian Archive official materials
  // - Rave I'Ching (Ra Uru Hu)
];

/**
 * Gate line lookup map: "gate.line" → GateLineReference
 * Example: "1.1", "1.2", ..., "64.6"
 */
export const GATE_LINE_MAP: Record<string, GateLineReference> = {};
for (const line of GATE_LINES) {
  const key = `${line.gate}.${line.line}`;
  GATE_LINE_MAP[key] = line;
}

/**
 * Get all lines for a specific gate
 * @param gate Gate number (1-64)
 * @returns Array of GateLineReference objects (lines 1-6)
 * @throws Error if gate number is invalid
 */
export function getGateLines(gate: number): GateLineReference[] {
  if (!Number.isInteger(gate) || gate < 1 || gate > 64) {
    throw new Error(`Invalid gate number: ${gate}. Must be an integer between 1 and 64.`);
  }
  return GATE_LINES.filter(line => line.gate === gate);
}

/**
 * Get specific gate line
 * @param gate Gate number (1-64)
 * @param line Line number (1-6)
 * @returns GateLineReference or undefined if not found
 * @throws Error if gate or line number is invalid
 */
export function getGateLine(gate: number, line: number): GateLineReference | undefined {
  if (!Number.isInteger(gate) || gate < 1 || gate > 64) {
    throw new Error(`Invalid gate number: ${gate}. Must be an integer between 1 and 64.`);
  }
  if (!Number.isInteger(line) || line < 1 || line > 6) {
    throw new Error(`Invalid line number: ${line}. Must be an integer between 1 and 6.`);
  }
  return GATE_LINE_MAP[`${gate}.${line}`];
}

/**
 * Get gate lines by gate numbers (useful for channel lookups)
 * @param gates Array of gate numbers (each 1-64)
 * @returns Record mapping gate numbers to their line arrays
 * @throws Error if any gate number is invalid
 */
export function getLinesByGates(gates: number[]): Record<number, GateLineReference[]> {
  if (!Array.isArray(gates)) {
    throw new Error('Gates parameter must be an array');
  }
  const result: Record<number, GateLineReference[]> = {};
  for (const gate of gates) {
    // getGateLines will validate each gate
    result[gate] = getGateLines(gate);
  }
  return result;
}

/**
 * Validate that all 384 lines are present
 */
export function validateCompleteness(): {
  complete: boolean;
  total: number;
  missing: Array<{ gate: number; line: number }>
} {
  const expected = 384; // 64 gates × 6 lines
  const missing: Array<{ gate: number; line: number }> = [];

  for (let gate = 1; gate <= 64; gate++) {
    for (let line = 1; line <= 6; line++) {
      if (!GATE_LINE_MAP[`${gate}.${line}`]) {
        missing.push({ gate, line });
      }
    }
  }

  return {
    complete: missing.length === 0,
    total: GATE_LINES.length,
    missing,
  };
}
