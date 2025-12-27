import { NextRequest, NextResponse } from 'next/server';
import { GATE_CENTERS } from '@/lib/calculation/mandala';
import type { GateReference, CenterName } from '@/types';
import { z } from 'zod';

/**
 * Query parameter validation schema
 */
const queryParamsSchema = z.object({
  center: z.enum(['head', 'ajna', 'throat', 'g', 'ego', 'sacral', 'solar_plexus', 'spleen', 'root']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(64),
});

/**
 * Gate names mapping
 */
const GATE_NAMES: Record<number, string> = {
  1: 'Self-Expression', 2: 'Direction', 3: 'Ordering', 4: 'Formulization',
  5: 'Waiting', 6: 'Friction', 7: 'Self in Interaction', 8: 'Contribution',
  9: 'Focus', 10: 'Self-Love', 11: 'Ideas', 12: 'Caution',
  13: 'Listening', 14: 'Power Skills', 15: 'Extremes', 16: 'Skills',
  17: 'Opinions', 18: 'Correction', 19: 'Wanting', 20: 'Now',
  21: 'Hunter', 22: 'Openness', 23: 'Assimilation', 24: 'Rationalization',
  25: 'Spirit of Self', 26: 'Egoist', 27: 'Caring', 28: 'Game Player',
  29: 'Perseverance', 30: 'Feelings', 31: 'Leading', 32: 'Continuity',
  33: 'Privacy', 34: 'Power', 35: 'Change', 36: 'Crisis',
  37: 'Friendship', 38: 'Fighter', 39: 'Provocation', 40: 'Aloneness',
  41: 'Contraction', 42: 'Growth', 43: 'Insight', 44: 'Alertness',
  45: 'Gatherer', 46: 'Love of Body', 47: 'Realizing', 48: 'Depth',
  49: 'Principles', 50: 'Values', 51: 'Shock', 52: 'Stillness',
  53: 'Starting', 54: 'Ambition', 55: 'Abundance', 56: 'Stimulation',
  57: 'Intuitive Clarity', 58: 'Joy', 59: 'Sexuality', 60: 'Limitation',
  61: 'Mystery', 62: 'Details', 63: 'Doubt', 64: 'Confusion',
};

/**
 * Get all gates as reference data
 */
function getAllGates(): GateReference[] {
  const gates: GateReference[] = [];

  for (let i = 1; i <= 64; i++) {
    const center = GATE_CENTERS[i] as CenterName;
    gates.push({
      id: i,
      name: GATE_NAMES[i] || `Gate ${i}`,
      center,
    });
  }

  return gates;
}

/**
 * GET /api/reference/gates
 * Returns all gates with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = queryParamsSchema.parse({
      center: searchParams.get('center'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    let gates = getAllGates();

    // Filter by center if specified
    if (params.center) {
      gates = gates.filter(g => g.center === params.center);
    }

    // Pagination
    const total = gates.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedGates = gates.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedGates,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        total_pages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Gates reference error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
