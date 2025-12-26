import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getTimezoneFromCoordinates } from '@/lib/timezone';
import { nominatimRateLimiter, getClientIdentifier } from '@/lib/ratelimit';
import { geocodingCache } from '@/lib/cache';

const querySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
});

// Nominatim response types
interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientId = getClientIdentifier(request);
    const rateLimit = nominatimRateLimiter.check(clientId);

    if (!rateLimit.success) {
      const retryAfter = Math.ceil((rateLimit.reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again in a moment.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    const validated = querySchema.parse({ q: query });

    // Check cache first
    const cacheKey = `geocode:${validated.q.toLowerCase()}`;
    const cachedResult = geocodingCache.get(cacheKey);

    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          'X-Cache': 'HIT',
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
        },
      });
    }

    const encodedQuery = encodeURIComponent(validated.q);

    // Use Nominatim (OpenStreetMap) - free, no API key required, better city results
    // featuretype=city prioritizes cities/towns over smaller places
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=10&addressdetails=0&featuretype=city`;

    const response = await fetch(url, {
      headers: {
        // Nominatim requires a User-Agent header
        'User-Agent': 'IntangibleMe/1.0 (birth chart app)',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in a moment.' },
          { status: 429 }
        );
      }
      console.error('Nominatim API error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Failed to search locations' },
        { status: 502 }
      );
    }

    const data: NominatimResult[] = await response.json();

    // Parse, deduplicate, and sort by importance (Nominatim's relevance score)
    const seen = new Set<string>();
    const results = data
      .sort((a, b) => b.importance - a.importance)
      .filter((result) => {
        // Deduplicate by display name
        if (seen.has(result.display_name)) return false;
        seen.add(result.display_name);
        return true;
      })
      .slice(0, 10)
      .map((result) => ({
        id: `${result.osm_type}-${result.osm_id}`,
        name: result.name,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
      }));

    // Add timezone to each result
    const resultsWithTimezone = results.map((result) => ({
      ...result,
      timezone: getTimezoneFromCoordinates(result.lat, result.lng),
    }));

    // Cache the result
    geocodingCache.set(cacheKey, resultsWithTimezone);

    return NextResponse.json(resultsWithTimezone, {
      headers: {
        'X-Cache': 'MISS',
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
      },
    });
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
