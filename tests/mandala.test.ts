/**
 * Mandala Tests
 *
 * Tests the Rave Mandala gate mapping functionality.
 * Verifies that ecliptic longitude is correctly mapped to gates and lines.
 */

import { describe, it, expect } from 'vitest';
import {
  longitudeToGateLine,
  getGateCenter,
  GATE_POSITIONS,
  GATE_CENTERS,
  GATE_SEQUENCE,
} from '@/lib/calculation/mandala';

describe('Mandala Gate Mapping', () => {
  describe('longitudeToGateLine', () => {
    it('should map Gate 41 start correctly (302°)', () => {
      // Gate 41 starts at 2°00' Aquarius = 302°
      const result = longitudeToGateLine(302.0);
      expect(result.gate).toBe(41);
      expect(result.line).toBe(1);
    });

    it('should map Gate 41 line 6 correctly', () => {
      // Near the end of Gate 41, before Gate 19
      const result = longitudeToGateLine(307.0);
      expect(result.gate).toBe(41);
      expect(result.line).toBe(6);
    });

    it('should map Gate 1 correctly (Scorpio)', () => {
      // Gate 1 is in Scorpio, around 223-229°
      const result = longitudeToGateLine(225.0);
      expect(result.gate).toBe(1);
    });

    it('should handle wrap-around for Gate 25', () => {
      // Gate 25 wraps from 358.25° to 3.875°
      const result1 = longitudeToGateLine(359.0);
      expect(result1.gate).toBe(25);

      const result2 = longitudeToGateLine(1.0);
      expect(result2.gate).toBe(25);
    });

    it('should return lines 1-6 within a gate', () => {
      // Test multiple positions within Gate 41
      const lineWidth = 0.9375; // degrees per line
      const gateStart = 302.0;

      for (let line = 1; line <= 6; line++) {
        const longitude = gateStart + (line - 1) * lineWidth + 0.1;
        const result = longitudeToGateLine(longitude);
        expect(result.gate).toBe(41);
        expect(result.line).toBe(line);
      }
    });

    it('should normalize longitudes > 360', () => {
      const result = longitudeToGateLine(362.0); // Same as 2°
      const expected = longitudeToGateLine(2.0);
      expect(result.gate).toBe(expected.gate);
      expect(result.line).toBe(expected.line);
    });

    it('should handle negative longitudes', () => {
      const result = longitudeToGateLine(-10.0); // Same as 350°
      const expected = longitudeToGateLine(350.0);
      expect(result.gate).toBe(expected.gate);
    });

    it('should return valid gate for any longitude', () => {
      // Test various longitudes across the zodiac
      const testLongitudes = [0, 45, 90, 135, 180, 225, 270, 315, 359.99];

      for (const long of testLongitudes) {
        const result = longitudeToGateLine(long);
        expect(result.gate).toBeGreaterThanOrEqual(1);
        expect(result.gate).toBeLessThanOrEqual(64);
        expect(result.line).toBeGreaterThanOrEqual(1);
        expect(result.line).toBeLessThanOrEqual(6);
      }
    });
  });

  describe('GATE_POSITIONS', () => {
    it('should have 64 gate entries', () => {
      expect(GATE_POSITIONS.length).toBe(64);
    });

    it('should have all gates from 1-64', () => {
      const gates = GATE_POSITIONS.map(p => p.gate).sort((a, b) => a - b);
      for (let i = 1; i <= 64; i++) {
        expect(gates).toContain(i);
      }
    });

    it('should have valid degree ranges for each gate', () => {
      for (const pos of GATE_POSITIONS) {
        expect(pos.start).toBeGreaterThanOrEqual(0);
        expect(pos.start).toBeLessThan(360);
        // End can be less than start for wrap-around gates
        expect(pos.end).toBeGreaterThanOrEqual(0);
        expect(pos.end).toBeLessThan(360);
      }
    });

    it('should have correct gate width (~5.625 degrees)', () => {
      // Check a few non-wrapping gates
      const gate41 = GATE_POSITIONS.find(p => p.gate === 41)!;
      const width = gate41.end - gate41.start;
      expect(width).toBeCloseTo(5.625, 2);
    });
  });

  describe('GATE_CENTERS', () => {
    it('should have all 64 gates assigned to centers', () => {
      const gates = Object.keys(GATE_CENTERS).map(Number);
      expect(gates.length).toBe(64);

      for (let i = 1; i <= 64; i++) {
        expect(GATE_CENTERS[i]).toBeDefined();
      }
    });

    it('should only use valid center names', () => {
      const validCenters = [
        'head', 'ajna', 'throat', 'g', 'ego',
        'sacral', 'solar_plexus', 'spleen', 'root'
      ];

      for (const center of Object.values(GATE_CENTERS)) {
        expect(validCenters).toContain(center);
      }
    });

    it('should have correct center assignments for key gates', () => {
      // Head center gates
      expect(GATE_CENTERS[61]).toBe('head');
      expect(GATE_CENTERS[63]).toBe('head');
      expect(GATE_CENTERS[64]).toBe('head');

      // Sacral center gates
      expect(GATE_CENTERS[34]).toBe('sacral');
      expect(GATE_CENTERS[5]).toBe('sacral');

      // G center gates
      expect(GATE_CENTERS[1]).toBe('g');
      expect(GATE_CENTERS[2]).toBe('g');
    });
  });

  describe('GATE_SEQUENCE', () => {
    it('should have 64 entries', () => {
      expect(GATE_SEQUENCE.length).toBe(64);
    });

    it('should start with Gate 41 (Rave New Year)', () => {
      expect(GATE_SEQUENCE[0]).toBe(41);
    });

    it('should contain all gates 1-64', () => {
      const sorted = [...GATE_SEQUENCE].sort((a, b) => a - b);
      for (let i = 1; i <= 64; i++) {
        expect(sorted[i - 1]).toBe(i);
      }
    });
  });

  describe('getGateCenter', () => {
    it('should return correct center for known gates', () => {
      expect(getGateCenter(1)).toBe('g');
      expect(getGateCenter(34)).toBe('sacral');
      expect(getGateCenter(61)).toBe('head');
      expect(getGateCenter(12)).toBe('throat');
    });

    it('should return unknown for invalid gate', () => {
      expect(getGateCenter(0)).toBe('unknown');
      expect(getGateCenter(65)).toBe('unknown');
    });
  });
});
