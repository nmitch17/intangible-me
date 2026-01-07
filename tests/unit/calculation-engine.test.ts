/**
 * Calculation Engine Tests
 *
 * Tests the core calculation logic for structural correctness,
 * consistency, and proper handling of edge cases.
 */

import { describe, it, expect } from 'vitest';
import { calculateChart } from '@/lib/calculation/chart';
import { calculateActivations, calculateTransits } from '@/lib/calculation/ephemeris';
import { longitudeToGateLine } from '@/lib/calculation/mandala';

describe('Ephemeris Calculations', () => {
  describe('calculateActivations', () => {
    it('should return activations for a valid date', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const activations = await calculateActivations(birthDate);

      expect(activations).toBeDefined();
      expect(activations.personality).toBeDefined();
      expect(activations.design).toBeDefined();
    }, 30000);

    it('should return all required planets for personality', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const activations = await calculateActivations(birthDate);

      const requiredPlanets = [
        'sun',
        'earth',
        'moon',
        'north_node',
        'south_node',
        'mercury',
        'venus',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto',
      ];

      for (const planet of requiredPlanets) {
        expect(activations.personality[planet]).toBeDefined();
        expect(activations.personality[planet].gate).toBeGreaterThanOrEqual(1);
        expect(activations.personality[planet].gate).toBeLessThanOrEqual(64);
        expect(activations.personality[planet].line).toBeGreaterThanOrEqual(1);
        expect(activations.personality[planet].line).toBeLessThanOrEqual(6);
      }
    }, 30000);

    it('should return all required planets for design', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const activations = await calculateActivations(birthDate);

      const requiredPlanets = [
        'sun',
        'earth',
        'moon',
        'north_node',
        'south_node',
        'mercury',
        'venus',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto',
      ];

      for (const planet of requiredPlanets) {
        expect(activations.design[planet]).toBeDefined();
        expect(activations.design[planet].gate).toBeGreaterThanOrEqual(1);
        expect(activations.design[planet].gate).toBeLessThanOrEqual(64);
        expect(activations.design[planet].line).toBeGreaterThanOrEqual(1);
        expect(activations.design[planet].line).toBeLessThanOrEqual(6);
      }
    }, 30000);

    it('should calculate design ~88 days before birth', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const activations = await calculateActivations(birthDate);

      // Design sun should be different from personality sun (88° arc)
      expect(activations.personality.sun.gate).not.toBe(activations.design.sun.gate);
    }, 30000);

    it('should produce consistent results for the same date', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');

      const activations1 = await calculateActivations(birthDate);
      const activations2 = await calculateActivations(birthDate);

      expect(activations1.personality.sun.gate).toBe(activations2.personality.sun.gate);
      expect(activations1.personality.sun.line).toBe(activations2.personality.sun.line);
      expect(activations1.design.sun.gate).toBe(activations2.design.sun.gate);
      expect(activations1.design.sun.line).toBe(activations2.design.sun.line);
    }, 30000);
  });

  describe('calculateTransits', () => {
    it('should calculate current transits', async () => {
      const transits = await calculateTransits();

      expect(transits).toBeDefined();
      expect(transits.sun).toBeDefined();
      expect(transits.moon).toBeDefined();
    }, 30000);

    it('should calculate transits for a specific date', async () => {
      const date = new Date('2024-06-21T12:00:00Z');
      const transits = await calculateTransits(date);

      expect(transits).toBeDefined();
      expect(transits.sun.gate).toBeGreaterThanOrEqual(1);
      expect(transits.sun.gate).toBeLessThanOrEqual(64);
    }, 30000);
  });
});

describe('Mandala Mapping', () => {
  describe('longitudeToGateLine', () => {
    it('should map 0° to a valid gate', () => {
      const result = longitudeToGateLine(0);
      expect(result.gate).toBeGreaterThanOrEqual(1);
      expect(result.gate).toBeLessThanOrEqual(64);
      expect(result.line).toBeGreaterThanOrEqual(1);
      expect(result.line).toBeLessThanOrEqual(6);
    });

    it('should map 180° to a valid gate', () => {
      const result = longitudeToGateLine(180);
      expect(result.gate).toBeGreaterThanOrEqual(1);
      expect(result.gate).toBeLessThanOrEqual(64);
    });

    it('should map 359.99° to a valid gate', () => {
      const result = longitudeToGateLine(359.99);
      expect(result.gate).toBeGreaterThanOrEqual(1);
      expect(result.gate).toBeLessThanOrEqual(64);
    });

    it('should produce consistent results', () => {
      const result1 = longitudeToGateLine(45.5);
      const result2 = longitudeToGateLine(45.5);
      expect(result1.gate).toBe(result2.gate);
      expect(result1.line).toBe(result2.line);
    });

    it('should cover all 64 gates across the zodiac', () => {
      const gatesFound = new Set<number>();

      // Sample points across the zodiac
      for (let deg = 0; deg < 360; deg += 1) {
        const result = longitudeToGateLine(deg);
        gatesFound.add(result.gate);
      }

      expect(gatesFound.size).toBe(64);
    });

    it('should assign correct lines (1-6) based on sub-gate position', () => {
      const lines = new Set<number>();

      // Sample multiple points within a single gate
      for (let offset = 0; offset < 5.625; offset += 0.5) {
        const result = longitudeToGateLine(offset);
        lines.add(result.line);
      }

      expect(lines.size).toBeGreaterThanOrEqual(5);
    });
  });
});

describe('Chart Calculation', () => {
  describe('calculateChart', () => {
    it('should return a complete chart object', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      // Core properties
      expect(chart.type).toBeDefined();
      expect(chart.strategy).toBeDefined();
      expect(chart.authority).toBeDefined();
      expect(chart.profile).toBeDefined();
      expect(chart.definition).toBeDefined();

      // Cross
      expect(chart.cross).toBeDefined();
      expect(chart.cross.name).toBeDefined();
      expect(chart.cross.type).toBeDefined();
      expect(chart.cross.quarter).toBeDefined();

      // Centers
      expect(chart.centers).toBeDefined();

      // Activations
      expect(chart.activations).toBeDefined();
    }, 30000);

    it('should return a valid type', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      expect([
        'Generator',
        'Manifesting Generator',
        'Projector',
        'Manifestor',
        'Reflector',
      ]).toContain(chart.type);
    }, 30000);

    it('should return a valid strategy', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      expect([
        'Wait to Respond',
        'Wait for Invitation',
        'Inform',
        'Wait Lunar Cycle',
      ]).toContain(chart.strategy);
    }, 30000);

    it('should return a valid authority', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      expect([
        'Emotional',
        'Sacral',
        'Splenic',
        'Ego',
        'Self-Projected',
        'Mental',
        'Lunar',
      ]).toContain(chart.authority);
    }, 30000);

    it('should return a valid profile format (X/Y)', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      expect(chart.profile).toMatch(/^[1-6]\/[1-6]$/);
    }, 30000);

    it('should return a valid definition', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      expect([
        'None',
        'Single',
        'Split',
        'Triple Split',
        'Quadruple Split',
      ]).toContain(chart.definition);
    }, 30000);

    it('should return a valid cross type', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      expect(['Right Angle', 'Left Angle', 'Juxtaposition']).toContain(
        chart.cross.type
      );
    }, 30000);

    it('should return a valid quarter', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      expect(['Initiation', 'Civilization', 'Duality', 'Mutation']).toContain(
        chart.cross.quarter
      );
    }, 30000);

    it('should have all 9 centers', async () => {
      const birthDate = new Date('1990-06-15T14:30:00Z');
      const chart = await calculateChart(birthDate);

      const expectedCenters = [
        'head',
        'ajna',
        'throat',
        'g',
        'ego',
        'sacral',
        'solar_plexus',
        'spleen',
        'root',
      ];

      for (const center of expectedCenters) {
        expect(chart.centers[center]).toBeDefined();
        expect(typeof chart.centers[center].defined).toBe('boolean');
      }
    }, 30000);
  });

  describe('Type/Strategy Consistency', () => {
    it('Generator should have Wait to Respond strategy', async () => {
      const dates = [
        '1990-01-15T12:00:00Z',
        '1990-03-15T12:00:00Z',
        '1990-05-15T12:00:00Z',
        '1990-07-15T12:00:00Z',
        '1990-09-15T12:00:00Z',
        '1990-11-15T12:00:00Z',
      ];

      for (const date of dates) {
        const chart = await calculateChart(new Date(date));

        if (
          chart.type === 'Generator' ||
          chart.type === 'Manifesting Generator'
        ) {
          expect(chart.strategy).toBe('Wait to Respond');
          return;
        }
      }
    }, 60000);

    it('Projector should have Wait for Invitation strategy', async () => {
      const dates = [
        '1995-01-15T12:00:00Z',
        '1995-03-15T12:00:00Z',
        '1995-05-15T12:00:00Z',
        '1995-07-15T12:00:00Z',
        '1995-09-15T12:00:00Z',
        '1995-11-15T12:00:00Z',
      ];

      for (const date of dates) {
        const chart = await calculateChart(new Date(date));

        if (chart.type === 'Projector') {
          expect(chart.strategy).toBe('Wait for Invitation');
          return;
        }
      }
    }, 60000);

    it('Manifestor should have Inform strategy', async () => {
      const dates = [
        '1975-01-15T12:00:00Z',
        '1975-03-15T12:00:00Z',
        '1975-05-15T12:00:00Z',
        '1975-07-15T12:00:00Z',
        '1975-09-15T12:00:00Z',
        '1975-11-15T12:00:00Z',
      ];

      for (const date of dates) {
        const chart = await calculateChart(new Date(date));

        if (chart.type === 'Manifestor') {
          expect(chart.strategy).toBe('Inform');
          return;
        }
      }
    }, 60000);
  });

  describe('Authority Hierarchy', () => {
    it('should assign Emotional authority when Solar Plexus is defined', async () => {
      const dates = [
        '1990-01-01T00:00:00Z',
        '1990-04-01T00:00:00Z',
        '1990-07-01T00:00:00Z',
        '1990-10-01T00:00:00Z',
      ];

      for (const date of dates) {
        const chart = await calculateChart(new Date(date));

        if (chart.centers.solar_plexus.defined) {
          expect(chart.authority).toBe('Emotional');
          return;
        }
      }
    }, 60000);
  });
});

describe('Edge Cases', () => {
  it('should handle dates at year boundaries', async () => {
    const newYearsEve = new Date('1999-12-31T23:59:00Z');
    const chart = await calculateChart(newYearsEve);

    expect(chart.type).toBeDefined();
    expect(chart.profile).toMatch(/^\d\/\d$/);
  }, 30000);

  it('should handle dates at century boundaries', async () => {
    const y2k = new Date('2000-01-01T00:00:00Z');
    const chart = await calculateChart(y2k);

    expect(chart.type).toBeDefined();
    expect(chart.profile).toMatch(/^\d\/\d$/);
  }, 30000);

  it('should handle leap year dates', async () => {
    const leapDay = new Date('2000-02-29T12:00:00Z');
    const chart = await calculateChart(leapDay);

    expect(chart.type).toBeDefined();
  }, 30000);

  it('should handle dates far in the past', async () => {
    const oldDate = new Date('1920-06-15T10:00:00Z');
    const chart = await calculateChart(oldDate);

    expect(chart.type).toBeDefined();
  }, 30000);

  it('should handle recent dates', async () => {
    const recentDate = new Date('2024-01-15T14:30:00Z');
    const chart = await calculateChart(recentDate);

    expect(chart.type).toBeDefined();
  }, 30000);

  it('should handle noon UTC', async () => {
    const noonUtc = new Date('1990-06-15T12:00:00Z');
    const chart = await calculateChart(noonUtc);

    expect(chart.type).toBeDefined();
  }, 30000);

  it('should handle midnight UTC', async () => {
    const midnightUtc = new Date('1990-06-15T00:00:00Z');
    const chart = await calculateChart(midnightUtc);

    expect(chart.type).toBeDefined();
  }, 30000);
});

describe('Performance', () => {
  it('should calculate activations in under 500ms', async () => {
    const birthDate = new Date('1990-06-15T14:30:00Z');

    const start = Date.now();
    await calculateActivations(birthDate);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(500);
  }, 30000);

  it('should calculate full chart in under 1000ms', async () => {
    const birthDate = new Date('1990-06-15T14:30:00Z');

    const start = Date.now();
    await calculateChart(birthDate);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
  }, 30000);

  it('should handle 10 consecutive calculations efficiently', async () => {
    const start = Date.now();

    for (let i = 0; i < 10; i++) {
      const birthDate = new Date(`199${i}-06-15T14:30:00Z`);
      await calculateChart(birthDate);
    }

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000);
  }, 60000);
});

describe('Calculation Consistency', () => {
  it('should produce identical results for the same input', async () => {
    const birthDate = new Date('1990-05-15T12:00:00Z');

    const chart1 = await calculateChart(birthDate);
    const chart2 = await calculateChart(birthDate);

    expect(chart1.type).toBe(chart2.type);
    expect(chart1.authority).toBe(chart2.authority);
    expect(chart1.profile).toBe(chart2.profile);
    expect(chart1.definition).toBe(chart2.definition);
  }, 30000);

  it('should produce different results for different inputs', async () => {
    const date1 = new Date('1990-01-01T00:00:00Z');
    const date2 = new Date('1990-07-01T12:00:00Z');

    const chart1 = await calculateChart(date1);
    const chart2 = await calculateChart(date2);

    // At least the sun gate should be different (6 months apart)
    expect(chart1.activations.personality.sun.gate).not.toBe(
      chart2.activations.personality.sun.gate
    );
  }, 30000);
});
