// ============================================================================
// MAPTILER GEOCODING API TYPES
// ============================================================================

/**
 * MapTiler Geocoding API response types (GeoJSON FeatureCollection format)
 * Documentation: https://docs.maptiler.com/cloud/api/geocoding/
 */

export interface GeocodingContext {
  id: string;
  text: string;
  short_code?: string;
}

export interface GeocodingFeature {
  id: string;
  type: 'Feature';
  place_type: string[];
  relevance: number;
  text: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude] - NOTE: MapTiler uses lng,lat order
  context?: GeocodingContext[];
  bbox?: [number, number, number, number];
}

export interface GeocodingResponse {
  type: 'FeatureCollection';
  features: GeocodingFeature[];
  attribution?: string;
}

// ============================================================================
// SIMPLIFIED LOCATION RESULT TYPE
// ============================================================================

export interface LocationResult {
  id: string;
  name: string;
  lat: number;
  lng: number;
  displayName: string;
  timezone?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse MapTiler Geocoding API response into simplified LocationResult array
 * @param response - Raw MapTiler Geocoding API response
 * @returns Array of simplified LocationResult objects
 */
export function parseGeocodingResult(response: GeocodingResponse): LocationResult[] {
  return response.features.map((feature) => {
    // center is [longitude, latitude] in GeoJSON format
    const [lng, lat] = feature.center;

    return {
      id: feature.id,
      name: feature.text,
      lat,
      lng,
      displayName: feature.place_name,
    };
  });
}
