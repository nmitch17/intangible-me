# Chore: Auto-detect Timezone from Birth Location

## Chore Description
Currently, users must manually select a timezone from a dropdown when calculating their Human Design chart. This is redundant because the birth location (city/place) is already being selected via the location search, and every location has a corresponding timezone. The timezone should be automatically determined when the user selects their birth location, eliminating the need for manual timezone selection and reducing user error.

## Relevant Files
Use these files to resolve the chore:

- **`src/components/form/BirthDataForm.tsx`** - Main form component that orchestrates birth data input. Contains state for both location and timezone. Needs to be updated to auto-set timezone when location is selected.

- **`src/components/form/LocationSearch.tsx`** - Autocomplete location search component. Currently only returns `{lat, lng, displayName}`. Needs to be extended to also return timezone information.

- **`src/components/form/TimezoneSelect.tsx`** - Manual timezone dropdown with 17 hardcoded timezones. Will be removed from the UI.

- **`src/lib/maptiler.ts`** - MapTiler API types and parsing utilities. The `LocationResult` interface needs to include timezone, and `parseGeocodingResult()` needs to extract it.

- **`src/app/api/geocode/route.ts`** - Server-side geocoding API route that calls MapTiler. Needs to also perform timezone lookup and include it in the response.

### New Files

- **`src/lib/timezone.ts`** - New utility file to handle timezone lookup from coordinates. Will use a timezone API service to convert lat/lng to IANA timezone string.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create Timezone Lookup Utility
- Create `/src/lib/timezone.ts` with a `getTimezoneFromCoordinates(lat: number, lng: number): Promise<string>` function
- Use the free TimeZoneDB API or similar service (requires API key in env)
- Alternative: Use the `geo-tz` npm package for offline timezone lookup (no API needed)
- Include error handling with fallback to 'UTC' if lookup fails
- Add proper TypeScript types for the response

### Step 2: Extend LocationResult Interface
- Update `/src/lib/maptiler.ts` to add `timezone?: string` to the `LocationResult` interface
- This makes timezone an optional field to maintain backwards compatibility

### Step 3: Update Geocoding API Route
- Modify `/src/app/api/geocode/route.ts` to:
  - Import the timezone lookup utility from Step 1
  - After getting MapTiler results, look up timezone for each result using its coordinates
  - Include timezone in each `LocationResult` returned to the client
- Add error handling so geocoding still works even if timezone lookup fails

### Step 4: Update LocationSearch Component
- Modify `/src/components/form/LocationSearch.tsx` to:
  - Update the `onSelect` callback interface to include `timezone: string`
  - Pass the timezone from the selected `LocationResult` to the parent via `onSelect`
  - The callback signature becomes: `onSelect: (location: { lat: number; lng: number; displayName: string; timezone: string }) => void`

### Step 5: Update BirthDataForm to Auto-set Timezone
- Modify `/src/components/form/BirthDataForm.tsx` to:
  - Update the `Location` interface to include `timezone: string`
  - Update the `setLocation` callback to also set the timezone state when location is selected
  - Create a combined handler that sets both location and timezone in one action
  - Remove the manual `TimezoneSelect` dropdown from the form UI
  - Optionally display the detected timezone as read-only text below the location field

### Step 6: Clean Up TimezoneSelect Component
- Remove `/src/components/form/TimezoneSelect.tsx`:
  - Remove the component entirely since it's no longer needed for manual selection

### Step 7: Update Form Submission
- Ensure the auto-detected timezone is still passed to the chart calculation
- Verify the `handleSubmit` function in `BirthDataForm.tsx` uses the timezone for proper UTC conversion
- The timezone is already being used for date conversion, so no changes should be needed here

### Step 8: Run Validation Commands
- Run `npm run lint` to ensure code quality
- Run `npm run build` to verify the build completes successfully
- Run `npm run test` if tests exist to validate no regressions

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `npm run lint` - Run ESLint to ensure code quality
- `npm run build` - Verify the build completes successfully
- `npm run test` - Run Vitest test suite to validate the feature works with zero regressions (if tests exist)

## Notes

- **API Choice for Timezone Lookup**: The simplest approach is to use the `geo-tz` npm package which provides offline timezone lookup from coordinates. This avoids needing an additional API key and has no rate limits. It's a pure JavaScript library that includes timezone boundary data.

- **Alternative APIs**: If `geo-tz` is too heavy (~4MB), consider:
  - TimeZoneDB API (free tier: 1 request/second)
  - Google Maps Timezone API (paid)
  - Open-Meteo Timezone API (free)

- **DST Handling**: The timezone lookup returns an IANA timezone string (e.g., "America/New_York"), which the browser's `Intl` API can use to correctly handle DST for any given date. This is already how the form works.

- **User Experience**: After this chore, when a user selects "New York, NY, United States" as their birth location, the form should automatically show "America/New_York" as the detected timezone without requiring any user interaction.

- **Fallback Strategy**: If timezone lookup fails for any reason, fall back to 'UTC' and optionally show a message to the user that they may need to manually verify the timezone.

- **No Database Changes Required**: The `birthTimezone` field in the database schema already exists and stores IANA timezone strings. The chart calculation also already accepts and uses timezone data.
