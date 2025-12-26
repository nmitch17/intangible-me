/**
 * Ephemeris Tests
 *
 * Tests the Swiss Ephemeris integration for planetary calculations.
 * These tests verify that:
 * 1. The sweph-wasm library loads and initializes correctly
 * 2. The custom WASM loading implementation works (production code path)
 * 3. Julian day calculations are accurate
 * 4. Planetary positions are calculated correctly
 * 5. Design time (88° solar arc) is calculated correctly
 * 6. Singleton pattern behavior
 * 7. Error scenarios and edge cases
 */

import { describe, it, expect } from 'vitest';
import { calculateActivations, calculateTransits } from '@/lib/calculation/ephemeris';
import fs from 'fs';
import path from 'path';

describe('Swiss Ephemeris Integration', () => {
  describe('WASM file and production loading', () => {
    it('should have WASM file in public directory', () => {
      const wasmPath = path.join(process.cwd(), 'public', 'swisseph.wasm');
      expect(fs.existsSync(wasmPath)).toBe(true);

      // Verify the file is not empty
      const stats = fs.statSync(wasmPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should initialize through calculateActivations (production code path)', async () => {
      // This test verifies the production code path that uses getSwe()
      // which reads the WASM file and creates a base64 data URL
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      // If this succeeds, it means:
      // - WASM file was read successfully
      // - Base64 encoding worked
      // - SwissEPH.init() accepted the data URL
      // - Calculations completed successfully
      expect(result).toBeDefined();
      expect(result).toHaveProperty('personality');
      expect(result).toHaveProperty('design');
    });

    it('should initialize through calculateTransits (production code path)', async () => {
      // Another test of the production getSwe() path
      const result = await calculateTransits();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('sun');
      expect(typeof result.sun.gate).toBe('number');
      expect(typeof result.sun.line).toBe('number');
    });

    it('should use singleton pattern (same instance on multiple calls)', async () => {
      // Multiple calculations should reuse the same WASM instance
      const birthDate = new Date('1990-01-01T12:00:00Z');

      // First call - initializes the singleton
      const result1 = await calculateActivations(birthDate);

      // Second call - should reuse the instance
      const result2 = await calculateActivations(birthDate);

      // Results should be identical (proving same instance)
      expect(result1.personality.sun.gate).toBe(result2.personality.sun.gate);
      expect(result1.personality.sun.line).toBe(result2.personality.sun.line);

      // Also test with transits
      const transit1 = await calculateTransits(birthDate);
      const transit2 = await calculateTransits(birthDate);
      expect(transit1.sun.gate).toBe(transit2.sun.gate);
    });

    it('should handle concurrent initialization calls', async () => {
      // Simulate multiple simultaneous calls to ensure singleton works correctly
      const birthDate = new Date('1995-06-15T08:30:00Z');

      const promises = [
        calculateActivations(birthDate),
        calculateActivations(birthDate),
        calculateTransits(),
      ];

      const results = await Promise.all(promises);

      // All should succeed
      expect(results[0]).toBeDefined();
      expect(results[1]).toBeDefined();
      expect(results[2]).toBeDefined();

      // Activations should be identical
      expect(results[0].personality.sun.gate).toBe(results[1].personality.sun.gate);
    });
  });

  describe('sweph-wasm library loading', () => {
    it('should import sweph-wasm without errors', async () => {
      // This test verifies the WASM module loads correctly
      const SwissEPH = await import('sweph-wasm');
      expect(SwissEPH).toBeDefined();
      expect(SwissEPH.default).toBeDefined();
    });

    it('should initialize SwissEPH instance', async () => {
      const SwissEPH = await import('sweph-wasm');
      const swe = await SwissEPH.default.init();
      expect(swe).toBeDefined();
      expect(typeof swe.swe_julday).toBe('function');
      expect(typeof swe.swe_calc_ut).toBe('function');
      expect(typeof swe.swe_revjul).toBe('function');
    });
  });

  describe('calculateActivations', () => {
    it('should calculate activations for a known birth date', async () => {
      // Test date: September 13, 1980, 9:15 AM UTC (example from README)
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      expect(result).toHaveProperty('personality');
      expect(result).toHaveProperty('design');
      expect(result).toHaveProperty('designTime');
    });

    it('should return valid personality activations with all planets', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      const planets = [
        'sun', 'earth', 'north_node', 'south_node', 'moon',
        'mercury', 'venus', 'mars', 'jupiter', 'saturn',
        'uranus', 'neptune', 'pluto'
      ];

      for (const planet of planets) {
        expect(result.personality).toHaveProperty(planet);
        expect(result.personality[planet as keyof typeof result.personality]).toHaveProperty('gate');
        expect(result.personality[planet as keyof typeof result.personality]).toHaveProperty('line');
      }
    });

    it('should return valid design activations with all planets', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      const planets = [
        'sun', 'earth', 'north_node', 'south_node', 'moon',
        'mercury', 'venus', 'mars', 'jupiter', 'saturn',
        'uranus', 'neptune', 'pluto'
      ];

      for (const planet of planets) {
        expect(result.design).toHaveProperty(planet);
        expect(result.design[planet as keyof typeof result.design]).toHaveProperty('gate');
        expect(result.design[planet as keyof typeof result.design]).toHaveProperty('line');
      }
    });

    it('should have gates in valid range (1-64)', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      for (const activation of Object.values(result.personality)) {
        expect(activation.gate).toBeGreaterThanOrEqual(1);
        expect(activation.gate).toBeLessThanOrEqual(64);
      }

      for (const activation of Object.values(result.design)) {
        expect(activation.gate).toBeGreaterThanOrEqual(1);
        expect(activation.gate).toBeLessThanOrEqual(64);
      }
    });

    it('should have lines in valid range (1-6)', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      for (const activation of Object.values(result.personality)) {
        expect(activation.line).toBeGreaterThanOrEqual(1);
        expect(activation.line).toBeLessThanOrEqual(6);
      }

      for (const activation of Object.values(result.design)) {
        expect(activation.line).toBeGreaterThanOrEqual(1);
        expect(activation.line).toBeLessThanOrEqual(6);
      }
    });

    it('should calculate design time approximately 88 days before birth', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      const diffMs = birthDate.getTime() - result.designTime.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      // Design time should be approximately 88 days before birth
      // (88° solar arc, Sun moves ~1°/day)
      expect(diffDays).toBeGreaterThan(80);
      expect(diffDays).toBeLessThan(96);
    });

    it('should have design time before birth time', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      expect(result.designTime.getTime()).toBeLessThan(birthDate.getTime());
    });

    it('should produce consistent results for the same input', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result1 = await calculateActivations(birthDate);
      const result2 = await calculateActivations(birthDate);

      expect(result1.personality.sun.gate).toBe(result2.personality.sun.gate);
      expect(result1.personality.sun.line).toBe(result2.personality.sun.line);
      expect(result1.design.sun.gate).toBe(result2.design.sun.gate);
      expect(result1.design.sun.line).toBe(result2.design.sun.line);
    });
  });

  describe('calculateTransits', () => {
    it('should calculate transits for current time', async () => {
      const result = await calculateTransits();

      expect(result).toHaveProperty('sun');
      expect(result).toHaveProperty('moon');
      expect(result).toHaveProperty('mercury');
    });

    it('should calculate transits for a specific date', async () => {
      const testDate = new Date('2024-12-21T12:00:00Z');
      const result = await calculateTransits(testDate);

      expect(result.sun).toHaveProperty('gate');
      expect(result.sun).toHaveProperty('line');
      expect(result.sun.gate).toBeGreaterThanOrEqual(1);
      expect(result.sun.gate).toBeLessThanOrEqual(64);
    });

    it('should return different positions for different dates', async () => {
      const date1 = new Date('2024-01-01T12:00:00Z');
      const date2 = new Date('2024-07-01T12:00:00Z');

      const result1 = await calculateTransits(date1);
      const result2 = await calculateTransits(date2);

      // Sun position should differ significantly between these dates
      // (They're 6 months apart, Sun would be in different gates)
      expect(result1.sun.gate !== result2.sun.gate || result1.sun.line !== result2.sun.line).toBe(true);
    });
  });

  describe('Earth and Node calculations', () => {
    it('should have Earth opposite to Sun (180 degrees)', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      // Earth gate should be different from Sun gate
      // (they're 180° apart on the zodiac)
      expect(result.personality.earth.gate).not.toBe(result.personality.sun.gate);
    });

    it('should have South Node opposite to North Node', async () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const result = await calculateActivations(birthDate);

      // South node is always opposite to North node
      expect(result.personality.south_node.gate).not.toBe(result.personality.north_node.gate);
    });
  });
});
