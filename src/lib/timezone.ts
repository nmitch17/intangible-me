import { find } from 'geo-tz';

/**
 * Get IANA timezone string from geographic coordinates using geo-tz
 * This uses offline timezone boundary data, so no API calls are needed
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns IANA timezone string (e.g., "America/New_York") or "UTC" as fallback
 */
export function getTimezoneFromCoordinates(lat: number, lng: number): string {
  try {
    const timezones = find(lat, lng);

    if (timezones && timezones.length > 0) {
      return timezones[0];
    }

    // Fallback to UTC if no timezone found
    return 'UTC';
  } catch (error) {
    console.error('Error looking up timezone:', error);
    return 'UTC';
  }
}
