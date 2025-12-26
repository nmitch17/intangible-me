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
 * Calculate a relevance boost based on how well the result matches the search query
 * @param query - Original search query
 * @param feature - MapTiler feature to score
 * @returns Boost value (0 to 1) to add to relevance
 */
function calculateMatchBoost(query: string, feature: GeocodingFeature): number {
  const queryLower = query.toLowerCase().trim();
  const nameLower = feature.text.toLowerCase();
  const placeNameLower = feature.place_name.toLowerCase();

  // Highest boost: exact match on the primary name
  if (nameLower === queryLower) {
    return 1.0;
  }

  // High boost: primary name starts with the query
  if (nameLower.startsWith(queryLower)) {
    return 0.8;
  }

  // Good boost: place_name starts with the query (handles "New York City, New York, USA")
  if (placeNameLower.startsWith(queryLower)) {
    return 0.6;
  }

  // Medium boost: query is contained in the primary name
  if (nameLower.includes(queryLower)) {
    return 0.4;
  }

  // Small boost: all query words appear in the place_name in order
  const queryWords = queryLower.split(/\s+/);
  let lastIndex = -1;
  let allWordsInOrder = true;
  for (const word of queryWords) {
    const idx = placeNameLower.indexOf(word, lastIndex + 1);
    if (idx === -1) {
      allWordsInOrder = false;
      break;
    }
    lastIndex = idx;
  }
  if (allWordsInOrder) {
    return 0.2;
  }

  return 0;
}

/**
 * Parse MapTiler Geocoding API response into simplified LocationResult array
 * @param response - Raw MapTiler Geocoding API response
 * @param query - Original search query for relevance boosting
 * @returns Array of simplified LocationResult objects sorted by relevance
 */
export function parseGeocodingResult(
  response: GeocodingResponse,
  query?: string
): LocationResult[] {
  // Sort features by relevance + match boost
  const sortedFeatures = [...response.features].sort((a, b) => {
    const boostA = query ? calculateMatchBoost(query, a) : 0;
    const boostB = query ? calculateMatchBoost(query, b) : 0;
    const scoreA = a.relevance + boostA;
    const scoreB = b.relevance + boostB;
    return scoreB - scoreA; // Descending order
  });

  return sortedFeatures.map((feature) => {
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
