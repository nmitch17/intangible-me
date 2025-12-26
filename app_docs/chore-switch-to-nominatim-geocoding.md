# Switch Geocoding from MapTiler to Nominatim

**ADW ID:** N/A
**Date:** 2024-12-24
**Specification:** N/A

## Overview

Replaced MapTiler geocoding API with Nominatim (OpenStreetMap) for location search functionality. This eliminates the need for a MapTiler API key and provides better city-focused search results using a free, open-source solution.

## What Was Built

- Switched geocoding backend from MapTiler to Nominatim
- Removed MapTiler API key requirement
- Added proper User-Agent header for Nominatim API compliance
- Implemented deduplication and importance-based sorting for results
- Enhanced MapTiler parsing with query-based relevance boosting (retained for potential future use)

## Technical Implementation

### Files Modified

- `src/app/api/geocode/route.ts`: Complete rewrite to use Nominatim API instead of MapTiler
- `src/lib/maptiler.ts`: Added `calculateMatchBoost()` function and enhanced `parseGeocodingResult()` with query-based relevance sorting

### Key Changes

- **Nominatim Integration**: The geocode route now calls `https://nominatim.openstreetmap.org/search` with `featuretype=city` to prioritize cities/towns
- **No API Key Required**: Removed dependency on `MAPTILER_API_KEY` environment variable
- **User-Agent Header**: Added required `User-Agent: IntangibleMe/1.0 (birth chart app)` header per Nominatim usage policy
- **Deduplication**: Results are deduplicated by display name and sorted by Nominatim's importance score
- **Result Mapping**: Nominatim results are mapped to the existing `LocationResult` interface with `osm_type-osm_id` as unique identifier

## How to Use

1. No configuration changes required - the geocoding works without an API key
2. The location search component continues to work as before
3. Search results now prioritize cities and provide OpenStreetMap-sourced data

## Configuration

No environment variables required for geocoding. The `MAPTILER_API_KEY` is no longer needed for location search functionality.

## Testing

1. Navigate to the birth data form
2. Enter a city name in the location search field
3. Verify that search results appear and include city-level locations
4. Select a location and verify coordinates and timezone are populated correctly

## Notes

- Nominatim has a usage policy limiting requests to 1 request per second for non-commercial use
- The MapTiler parsing logic in `src/lib/maptiler.ts` is retained with enhancements for potential future use
- Results are limited to 10 items after deduplication
