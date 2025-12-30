/**
 * Timezone Conversion Tests
 *
 * Tests the convertToUTC function used in CosmicBirthForm to ensure
 * birth times in various timezones are correctly converted to UTC.
 */

import { describe, it, expect } from 'vitest';
import { convertToUTC } from '../src/lib/timezone';

describe('Timezone Conversion', () => {
  describe('convertToUTC', () => {
    it('should correctly convert MST (UTC-7) to UTC', () => {
      // Albuquerque, NM - Dec 17, 1996, 2:55 AM MST
      // Expected: 2:55 AM + 7 hours = 9:55 AM UTC
      const result = convertToUTC('1996-12-17T02:55:00', 'America/Denver');
      expect(result).toBe('1996-12-17T09:55:00.000Z');
    });

    it('should correctly convert EST (UTC-5) to UTC', () => {
      // New York - Dec 17, 1996, 2:55 AM EST
      // Expected: 2:55 AM + 5 hours = 7:55 AM UTC
      const result = convertToUTC('1996-12-17T02:55:00', 'America/New_York');
      expect(result).toBe('1996-12-17T07:55:00.000Z');
    });

    it('should correctly handle UTC timezone (no offset)', () => {
      // London in winter (UTC+0)
      const result = convertToUTC('1996-12-17T02:55:00', 'Europe/London');
      expect(result).toBe('1996-12-17T02:55:00.000Z');
    });

    it('should correctly convert JST (UTC+9) to UTC', () => {
      // Tokyo - Dec 17, 1996, 2:55 AM JST
      // Expected: 2:55 AM - 9 hours = Dec 16, 5:55 PM UTC
      const result = convertToUTC('1996-12-17T02:55:00', 'Asia/Tokyo');
      expect(result).toBe('1996-12-16T17:55:00.000Z');
    });

    it('should correctly convert PST (UTC-8) to UTC', () => {
      // Los Angeles in winter - Dec 17, 1996, 2:55 AM PST
      // Expected: 2:55 AM + 8 hours = 10:55 AM UTC
      const result = convertToUTC('1996-12-17T02:55:00', 'America/Los_Angeles');
      expect(result).toBe('1996-12-17T10:55:00.000Z');
    });

    it('should correctly convert IST (UTC+5:30) to UTC', () => {
      // India - handles half-hour offset timezone
      // Dec 17, 1996, 14:30 IST = 14:30 - 5:30 = 09:00 UTC
      const result = convertToUTC('1996-12-17T14:30:00', 'Asia/Kolkata');
      expect(result).toBe('1996-12-17T09:00:00.000Z');
    });

    it('should correctly handle date rollover when converting westward', () => {
      // Tokyo midnight - should roll back to previous day UTC
      // Jan 1, 2000, 00:00 JST = Dec 31, 1999, 15:00 UTC
      const result = convertToUTC('2000-01-01T00:00:00', 'Asia/Tokyo');
      expect(result).toBe('1999-12-31T15:00:00.000Z');
    });

    it('should correctly handle date rollover when converting eastward', () => {
      // Late night in LA should roll forward to next day UTC
      // Dec 31, 1999, 23:00 PST = Jan 1, 2000, 07:00 UTC
      const result = convertToUTC('1999-12-31T23:00:00', 'America/Los_Angeles');
      expect(result).toBe('2000-01-01T07:00:00.000Z');
    });

    it('should handle daylight saving time correctly (summer)', () => {
      // New York in summer (EDT, UTC-4)
      // July 4, 1996, 12:00 EDT = 16:00 UTC
      const result = convertToUTC('1996-07-04T12:00:00', 'America/New_York');
      expect(result).toBe('1996-07-04T16:00:00.000Z');
    });

    it('should handle daylight saving time correctly (winter)', () => {
      // New York in winter (EST, UTC-5)
      // January 15, 1996, 12:00 EST = 17:00 UTC
      const result = convertToUTC('1996-01-15T12:00:00', 'America/New_York');
      expect(result).toBe('1996-01-15T17:00:00.000Z');
    });
  });
});
