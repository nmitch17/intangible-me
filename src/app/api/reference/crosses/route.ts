import { NextResponse } from 'next/server';
import { getAllCrosses, getUniqueCrossNames, CROSSES } from '@/lib/reference/crosses';

/**
 * GET /api/reference/crosses
 * Returns all incarnation crosses with their gate combinations
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  try {
    if (format === 'unique') {
      // Return unique cross names only
      const uniqueNames = getUniqueCrossNames();
      return NextResponse.json({
        count: uniqueNames.length,
        crosses: uniqueNames,
      });
    }

    if (format === 'detailed') {
      // Return all crosses with gate combinations as array
      const allCrosses = getAllCrosses();
      return NextResponse.json({
        count: allCrosses.length,
        crosses: allCrosses,
      });
    }

    // Default: return raw crosses object
    const crossCount = Object.keys(CROSSES).length;
    return NextResponse.json({
      count: crossCount,
      crosses: CROSSES,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch crosses data' },
      { status: 500 }
    );
  }
}
