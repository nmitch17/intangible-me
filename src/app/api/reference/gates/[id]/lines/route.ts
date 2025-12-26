import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGateLines } from '@/lib/reference/lines';

const paramsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Gate ID must be a number'),
});

/**
 * GET /api/reference/gates/:id/lines
 *
 * Returns all 6 lines for a specific gate
 *
 * Path Parameters:
 * - id: Gate number (1-64)
 *
 * Example: GET /api/reference/gates/1/lines
 *
 * Response:
 * {
 *   gate: 1,
 *   lines: [
 *     { gate: 1, line: 1, name: "...", description: "..." },
 *     { gate: 1, line: 2, name: "...", description: "..." },
 *     ...
 *   ]
 * }
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const validated = paramsSchema.parse(params);
    const gateId = parseInt(validated.id, 10);

    // Validate gate range
    if (gateId < 1 || gateId > 64) {
      return NextResponse.json(
        { error: 'Gate ID must be between 1 and 64' },
        { status: 400 }
      );
    }

    // Get lines for this gate
    const lines = getGateLines(gateId);

    // Check if lines exist for this gate
    if (lines.length === 0) {
      return NextResponse.json(
        {
          gate: gateId,
          lines: [],
          warning: 'Line data not yet available for this gate. See PRD Section 9 for implementation status.',
        },
        { status: 200 }
      );
    }

    // Check if all 6 lines are present
    const complete = lines.length === 6;

    return NextResponse.json({
      gate: gateId,
      lines,
      complete,
      ...(complete ? {} : { warning: 'Incomplete line data. Some lines missing.' }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid gate ID', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Gate lines API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
