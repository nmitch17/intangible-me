# Location Search with MapTiler Geocoding

**ADW ID:** N/A
**Date:** 2025-12-23
**Specification:** specs/chore-location-search-maptiler.md

## Overview

Replaced manual latitude/longitude number inputs in the BirthDataForm with a user-friendly location search autocomplete. Users can now type in their city, zip code, or location name and see real-time dropdown results. When a location is selected, the coordinates are automatically extracted from the MapTiler Geocoding API.

## What Was Built

- Server-side geocoding API proxy to securely call MapTiler
- Reusable LocationSearch autocomplete component with debounced input
- Integration with BirthDataForm replacing lat/lng inputs
- Full keyboard navigation and ARIA accessibility support

## Technical Implementation

### Files Created/Modified

- `src/lib/maptiler.ts`: Type definitions for MapTiler Geocoding API (GeoJSON format) and `parseGeocodingResult` helper function
- `src/app/api/geocode/route.ts`: Server-side API proxy with Zod validation, rate limiting handling, and error responses
- `src/components/form/LocationSearch.tsx`: Autocomplete component with 300ms debounce, keyboard navigation, click-outside-to-close
- `src/components/form/BirthDataForm.tsx`: Updated to use LocationSearch instead of separate lat/lng inputs

### Key Changes

- MapTiler API key stays server-side only (no `NEXT_PUBLIC_` prefix) for security
- GeoJSON coordinates are `[longitude, latitude]` - the helper function handles the swap
- Debouncing prevents excessive API calls during typing
- API route filters by `types=place,locality,municipality,postal_code` for relevant results
- Selected coordinates displayed below search input for transparency

## How to Use

1. In the birth data form, click on the "Birth Location" input field
2. Start typing a city name, zip code, or location (minimum 2 characters)
3. Wait for dropdown results to appear (debounced 300ms)
4. Use arrow keys to navigate or click to select a location
5. Selected coordinates will display below the input
6. Complete the rest of the form and submit

## Configuration

**Environment Variables:**
- `MAPTILER_API_KEY`: Required. MapTiler API key for geocoding service (server-side only)

## Testing

1. Start the dev server: `PORT=3003 bun dev`
2. Navigate to the chart calculation form
3. Test with various inputs:
   - City name: "Los Angeles"
   - City + Country: "Paris, France"
   - Zip code: "90210"
   - Partial input: "New Y"
4. Verify keyboard navigation (Arrow up/down, Enter, Escape)
5. Verify coordinates display after selection

## Notes

- MapTiler free tier has rate limits; the component handles 429 responses gracefully
- Long location names are truncated in the dropdown with CSS
- The component clears the selection if the user edits the search after selecting
- Full ARIA accessibility with `role="combobox"` and `role="listbox"`
