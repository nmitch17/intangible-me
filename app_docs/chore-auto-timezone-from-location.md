# Auto-detect Timezone from Birth Location

**ADW ID:** N/A
**Date:** 2024-12-24
**Specification:** specs/chore-auto-timezone-from-location.md

## Overview

This chore eliminates manual timezone selection by automatically detecting the timezone when a user selects their birth location. The timezone is now derived from the geographic coordinates using the `geo-tz` library, which performs offline timezone boundary lookups without requiring external API calls.

## What Was Built

- Offline timezone lookup utility using geo-tz package
- Automatic timezone detection integrated into the geocoding API
- Updated LocationSearch component to pass timezone with location data
- Simplified BirthDataForm with auto-populated timezone display
- Removed manual TimezoneSelect dropdown component

## Technical Implementation

### Files Modified

- `src/lib/timezone.ts`: New utility file with `getTimezoneFromCoordinates()` function
- `src/lib/maptiler.ts`: Extended `LocationResult` interface with optional `timezone` field
- `src/app/api/geocode/route.ts`: Added timezone lookup for each geocoding result
- `src/components/form/LocationSearch.tsx`: Updated `onSelect` callback to include timezone
- `src/components/form/BirthDataForm.tsx`: Removed TimezoneSelect, timezone now derived from location
- `src/components/form/index.ts`: Removed TimezoneSelect export
- `src/components/form/TimezoneSelect.tsx`: Deleted (no longer needed)

### Key Changes

- The `geo-tz` npm package provides offline timezone boundary data (~4MB), eliminating the need for external API calls
- Timezone lookup happens server-side in the geocoding API route, so each location result includes its timezone
- The `LocationResult` interface now includes an optional `timezone?: string` field for IANA timezone strings
- BirthDataForm derives timezone from the selected location with a fallback to 'UTC'
- The detected timezone is displayed as read-only text below the location field (e.g., "America/New_York")

## How to Use

1. Navigate to the chart calculation form
2. Enter your birth date and time
3. Search for and select your birth location
4. The timezone is automatically detected and displayed below the location field
5. Submit the form - the correct timezone will be used for UTC conversion

## Configuration

No additional configuration required. The `geo-tz` package includes all timezone boundary data offline.

## Testing

1. Search for various locations across different timezones
2. Verify the displayed timezone matches the expected IANA timezone for that location
3. Submit the form and verify the chart calculation uses the correct UTC time
4. Test edge cases: locations near timezone boundaries, ocean locations (should fallback to UTC)

## Notes

- The `geo-tz` package adds ~4MB to the server bundle but eliminates external API dependencies and rate limits
- Timezone lookup returns IANA timezone strings (e.g., "America/New_York") which work correctly with the browser's Intl API for DST handling
- If timezone lookup fails for any reason, it falls back to 'UTC'
- The manual TimezoneSelect dropdown with 17 hardcoded timezones has been completely removed
