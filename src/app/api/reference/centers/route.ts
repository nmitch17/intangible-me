import { NextResponse } from 'next/server';
import { CENTERS, getCenter } from '@/lib/reference/centers';
import type { CenterName } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') as CenterName | null;

    if (key) {
      const center = getCenter(key);
      if (!center) {
        return NextResponse.json(
          { error: 'Center not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(center);
    }

    // Return all centers
    return NextResponse.json(CENTERS);
  } catch (error) {
    console.error('Centers reference error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
