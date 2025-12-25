# Chore: Replace Latitude/Longitude Inputs with Location Search

## Chore Description
Replace the existing manual latitude and longitude number inputs in the BirthDataForm component with a user-friendly location search autocomplete. Users will be able to type in their city, zip code, or location name and see real-time dropdown results showing city, state/province, and country. When a location is selected, the latitude and longitude will be automatically extracted from the MapTiler Geocoding API response. This improves UX by eliminating the need for users to manually look up and enter coordinates.

## Relevant Files
Use these files to resolve the chore:

- `src/components/form/BirthDataForm.tsx` - Main form component containing the latitude/longitude inputs that need to be replaced with the location search component
- `src/types/index.ts` - Type definitions; may need to add location-related types
- `.env.local` - Contains `MAPTILER_API_KEY` for API authentication
- `src/app/api/chart/route.ts` - Reference for API route patterns using Zod validation

### New Files
- `src/components/form/LocationSearch.tsx` - New autocomplete component for location search with debounced input and dropdown results
- `src/app/api/geocode/route.ts` - Server-side API proxy to call MapTiler Geocoding API (keeps API key secure on server)
- `src/lib/maptiler.ts` - MapTiler API utility functions and type definitions

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create MapTiler Type Definitions and Utility
Create the MapTiler utility file with type definitions for the Geocoding API response.

- Create `src/lib/maptiler.ts` with:
  - TypeScript interfaces for MapTiler Geocoding API response (GeoJSON FeatureCollection format)
  - `GeocodingFeature` interface with `place_name`, `center` (coordinates array), `context` (hierarchy), and `relevance`
  - `GeocodingResponse` interface for the full API response
  - `LocationResult` interface for simplified location data (name, lat, lng, displayName)
  - Helper function `parseGeocodingResult` to transform API response to simplified LocationResult array

### Step 2: Create Server-Side Geocoding API Route
Create an API route to proxy requests to MapTiler, keeping the API key secure on the server.

- Create `src/app/api/geocode/route.ts` with:
  - GET handler accepting `q` (query) search parameter
  - Zod validation for query parameter (min 2 characters)
  - Fetch to MapTiler Geocoding API: `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`
  - Query parameters: `key` (from env), `autocomplete=true`, `limit=5`, `types=place,locality,municipality,postal_code`
  - Transform response to simplified LocationResult array
  - Error handling for API failures
  - Return JSON array of location results

### Step 3: Create LocationSearch Component
Create a reusable autocomplete component for location search.

- Create `src/components/form/LocationSearch.tsx` with:
  - Props interface: `onSelect: (location: { lat: number; lng: number; displayName: string }) => void`, `value?: string`, `error?: string`
  - State: `query` (input value), `results` (location array), `isLoading`, `isOpen` (dropdown visibility), `selectedIndex` (keyboard nav)
  - Debounced search effect (300ms delay) that calls `/api/geocode?q={query}`
  - Input field with autocomplete styling matching existing form inputs
  - Dropdown positioned below input showing results as clickable items
  - Each result displays: city, state/province (if available), country
  - Keyboard navigation: Arrow up/down to navigate, Enter to select, Escape to close
  - Click outside to close dropdown
  - When location selected: call `onSelect` with lat, lng, and formatted display name
  - Loading spinner during API fetch
  - "No results found" message when search returns empty

### Step 4: Update BirthDataForm to Use LocationSearch
Replace the latitude/longitude inputs with the new LocationSearch component.

- In `src/components/form/BirthDataForm.tsx`:
  - Import the new `LocationSearch` component
  - Replace the `lat` and `lng` state variables with:
    - `location: { lat: number; lng: number; displayName: string } | null`
  - Remove the two separate input fields for Latitude and Longitude (lines 135-169)
  - Add the LocationSearch component spanning full width (`md:col-span-2`)
  - Create handler `handleLocationSelect` that:
    - Sets the location state with lat, lng, and displayName
  - Update form validation to check `location !== null` instead of checking lat/lng strings
  - Update `handleSubmit` to use `location.lat` and `location.lng`
  - Remove the tip about Google Maps (no longer needed)
  - Optionally display the selected coordinates below the search for transparency (e.g., "Coordinates: 34.0522, -118.2437")

### Step 5: Add Environment Variable for Client Access (if needed)
Ensure the API key is accessible server-side.

- Verify `MAPTILER_API_KEY` is in `.env.local` (confirmed: `MAPTILER_API_KEY="aW1PplnTugY5Lu2cYxZv"`)
- The API key stays server-side only (in the `/api/geocode` route), so no `NEXT_PUBLIC_` prefix is needed
- No changes to environment files required

### Step 6: Handle Edge Cases and Polish
Add error handling and edge case support.

- Handle API rate limiting gracefully with user-friendly message
- Handle network errors with retry suggestion
- Clear location selection if user manually edits the search query after selection
- Ensure component is accessible (ARIA labels, keyboard navigation)
- Test with various input types:
  - City name: "Los Angeles"
  - City + Country: "Paris, France"
  - Zip code: "90210"
  - Partial input: "New Y"

### Step 7: Run Validation Commands
Execute validation commands to ensure the chore is complete with zero regressions.

- Run `npm run lint` to check for linting errors
- Run `npm run build` to verify TypeScript compilation and build success
- Manually test the form with various location searches

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `npm run lint` - Run ESLint to ensure code quality
- `npm run build` - Verify the build completes successfully and TypeScript has no errors

## Notes
- The MapTiler Geocoding API uses GeoJSON format where coordinates are `[longitude, latitude]` (note the order!)
- The `types` parameter filters results to relevant location types: `place` (cities), `locality` (neighborhoods), `municipality`, `postal_code`
- Debouncing is critical to avoid excessive API calls during typing
- The API key must remain server-side to prevent exposure in client bundles
- The dropdown should handle long location names gracefully with text truncation
- Consider adding a small map preview in future enhancement, but not required for this chore
