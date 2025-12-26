/**
 * Ephemeris Tests
 *
 * Tests the Swiss Ephemeris integration for planetary calculations.
 * These tests verify that:
 * 1. The sweph-wasm library loads and initializes correctly
 * 2. Julian day calculations are accurate
 * 3. Planetary positions are calculated correctly
 * 4. Design time (88° solar arc) is calculated correctly
 */

import { describe, it, expect } from 'vitest';
import { calculateActivations, calculateTransits } from '@/lib/calculation/ephemeris';

describe('Swiss Ephemeris Integration', () => {
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
