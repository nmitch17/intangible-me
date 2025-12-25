import { NextRequest, NextResponse } from 'next/server';
import { generateChartResponse } from '@/lib/calculation/chart';
import { z } from 'zod';

const requestSchema = z.object({
  datetime_utc: z.string().datetime(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timezone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = requestSchema.parse(body);
    
    const response = generateChartResponse(
      validated.datetime_utc,
      validated.lat,
      validated.lng,
      validated.timezone
    );
    
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Chart calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
