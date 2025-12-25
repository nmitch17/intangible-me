import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GeocodingResponse, parseGeocodingResult } from '@/lib/maptiler';
import { getTimezoneFromCoordinates } from '@/lib/timezone';

const querySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    const validated = querySchema.parse({ q: query });

    const apiKey = process.env.MAPTILER_API_KEY;
    if (!apiKey) {
      console.error('MAPTILER_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Geocoding service not configured' },
        { status: 500 }
      );
    }

    const encodedQuery = encodeURIComponent(validated.q);
    const url = `https://api.maptiler.com/geocoding/${encodedQuery}.json?key=${apiKey}&autocomplete=true&limit=5&types=place,locality,municipality,postal_code`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in a moment.' },
          { status: 429 }
        );
      }
      console.error('MapTiler API error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Failed to search locations' },
        { status: 502 }
      );
    }

    const data: GeocodingResponse = await response.json();
    const results = parseGeocodingResult(data);

    // Add timezone to each result
    const resultsWithTimezone = results.map((result) => ({
      ...result,
      timezone: getTimezoneFromCoordinates(result.lat, result.lng),
    }));

    return NextResponse.json(resultsWithTimezone);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Geocode error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
