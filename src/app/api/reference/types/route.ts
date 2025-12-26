import { NextResponse } from 'next/server';
import { TYPES, getType } from '@/lib/reference/types';
import type { HumanDesignType } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') as HumanDesignType | null;

    if (name) {
      const type = getType(name);
      if (!type) {
        return NextResponse.json(
          { error: 'Type not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(type);
    }

    // Return all types
    return NextResponse.json(TYPES);
  } catch (error) {
    console.error('Types reference error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
