import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGateLines } from '@/lib/reference/lines';

const paramsSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'Gate ID must be a number')
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 1 && val <= 64, {
      message: 'Gate ID must be between 1 and 64'
    }),
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
    const { id: gateId } = paramsSchema.parse(params);

    // Get lines for this gate
    const lines = getGateLines(gateId);

    // Return 404 if no data exists for this gate
    if (lines.length === 0) {
      return NextResponse.json(
        {
          error: 'Line data not available for this gate',
          gate: gateId,
          message: 'This gate does not have line descriptions yet. See PRD Section 9 for implementation status.'
        },
        { status: 404 }
      );
    }

    // Check if all 6 lines are present
    const isComplete = lines.length === 6;

    return NextResponse.json({
      gate: gateId,
      lines,
      status: isComplete ? 'complete' : 'partial',
      available: lines.length,
      expected: 6,
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
