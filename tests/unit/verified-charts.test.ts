/**
 * Verified Charts Test Suite
 *
 * Tests calculation accuracy against verified chart fixtures.
 * These tests ensure the calculation engine produces correct results
 * for all Human Design types, authorities, profiles, and definitions.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  verifiedChartFixtures,
  getFixturesByType,
  getFixturesByAuthority,
  fixtureStats,
  type VerifiedChartFixture,
} from '../fixtures/verified-charts';

// Import calculation functions
import { calculateChart } from '@/lib/calculation/chart';
import { calculateActivations } from '@/lib/calculation/ephemeris';

describe('Verified Chart Fixtures', () => {
  describe('Fixture Coverage', () => {
    it('should have at least 25 verified fixtures', () => {
      expect(fixtureStats.total).toBeGreaterThanOrEqual(25);
    });

    it('should cover all 5 Human Design types', () => {
      expect(fixtureStats.byType.Generator).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byType['Manifesting Generator']).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byType.Projector).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byType.Manifestor).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byType.Reflector).toBeGreaterThanOrEqual(1);
    });

    it('should cover all 7 authorities', () => {
      expect(fixtureStats.byAuthority.Sacral).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byAuthority.Emotional).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byAuthority.Splenic).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byAuthority.Ego).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byAuthority['Self-Projected']).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byAuthority.Mental).toBeGreaterThanOrEqual(1);
      expect(fixtureStats.byAuthority.Lunar).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Type Derivation', () => {
    const typeFixtures = [
      ...getFixturesByType('Generator').slice(0, 2),
      ...getFixturesByType('Manifesting Generator').slice(0, 2),
      ...getFixturesByType('Projector').slice(0, 2),
      ...getFixturesByType('Manifestor').slice(0, 2),
      ...getFixturesByType('Reflector').slice(0, 1),
    ];

    it.each(typeFixtures)(
      'should correctly derive type for $name ($expected.type)',
      async (fixture: VerifiedChartFixture) => {
        const birthDate = new Date(fixture.birth_data.datetime_utc);
        const activations = await calculateActivations(birthDate);
        const chart = calculateChart(activations);

        expect(chart.type).toBe(fixture.expected.type);
      },
      30000
    );
  });

  describe('Authority Derivation', () => {
    const authorityFixtures = [
      ...getFixturesByAuthority('Sacral').slice(0, 1),
      ...getFixturesByAuthority('Emotional').slice(0, 1),
      ...getFixturesByAuthority('Splenic').slice(0, 1),
      ...getFixturesByAuthority('Ego').slice(0, 1),
      ...getFixturesByAuthority('Self-Projected').slice(0, 1),
      ...getFixturesByAuthority('Mental').slice(0, 1),
      ...getFixturesByAuthority('Lunar').slice(0, 1),
    ];

    it.each(authorityFixtures)(
      'should correctly derive authority for $name ($expected.authority)',
      async (fixture: VerifiedChartFixture) => {
        const birthDate = new Date(fixture.birth_data.datetime_utc);
        const activations = await calculateActivations(birthDate);
        const chart = calculateChart(activations);

        expect(chart.authority).toBe(fixture.expected.authority);
      },
      30000
    );
  });

  describe('Profile Calculation', () => {
    // Get one fixture for each profile
    const profileFixtures = verifiedChartFixtures.filter((f) =>
      [
        '1/3',
        '1/4',
        '2/4',
        '2/5',
        '3/5',
        '3/6',
        '4/6',
        '4/1',
        '5/1',
        '5/2',
        '6/2',
        '6/3',
      ].includes(f.expected.profile)
    );

    it.each(profileFixtures)(
      'should correctly calculate profile for $name ($expected.profile)',
      async (fixture: VerifiedChartFixture) => {
        const birthDate = new Date(fixture.birth_data.datetime_utc);
        const activations = await calculateActivations(birthDate);
        const chart = calculateChart(activations);

        expect(chart.profile).toBe(fixture.expected.profile);
      },
      30000
    );
  });

  describe('Strategy Derivation', () => {
    const strategyTests = [
      { type: 'Generator', expectedStrategy: 'Wait to Respond' },
      { type: 'Manifesting Generator', expectedStrategy: 'Wait to Respond' },
      { type: 'Projector', expectedStrategy: 'Wait for Invitation' },
      { type: 'Manifestor', expectedStrategy: 'Inform' },
      { type: 'Reflector', expectedStrategy: 'Wait Lunar Cycle' },
    ];

    it.each(strategyTests)(
      'should derive correct strategy for $type',
      async ({ type, expectedStrategy }) => {
        const fixtures = getFixturesByType(type);
        expect(fixtures.length).toBeGreaterThan(0);

        const fixture = fixtures[0];
        const birthDate = new Date(fixture.birth_data.datetime_utc);
        const activations = await calculateActivations(birthDate);
        const chart = calculateChart(activations);

        expect(chart.strategy).toBe(expectedStrategy);
      },
      30000
    );
  });

  describe('Definition Calculation', () => {
    const definitionTests = ['Single', 'Split', 'Triple Split', 'None'];

    it.each(definitionTests)(
      'should correctly identify %s definition',
      async (definition) => {
        const fixtures = verifiedChartFixtures.filter(
          (f) => f.expected.definition === definition
        );

        if (fixtures.length === 0) {
          // Skip if no fixture for this definition type
          return;
        }

        const fixture = fixtures[0];
        const birthDate = new Date(fixture.birth_data.datetime_utc);
        const activations = await calculateActivations(birthDate);
        const chart = calculateChart(activations);

        expect(chart.definition).toBe(definition);
      },
      30000
    );
  });

  describe('Cross Type Calculation', () => {
    const crossTests = [
      { crossType: 'Right Angle', description: 'Personal Destiny' },
      { crossType: 'Left Angle', description: 'Transpersonal Karma' },
      { crossType: 'Juxtaposition', description: 'Fixed Fate' },
    ];

    it.each(crossTests)(
      'should correctly identify $crossType cross',
      async ({ crossType }) => {
        const fixtures = verifiedChartFixtures.filter(
          (f) => f.expected.incarnation_cross.type === crossType
        );

        if (fixtures.length === 0) {
          return;
        }

        const fixture = fixtures[0];
        const birthDate = new Date(fixture.birth_data.datetime_utc);
        const activations = await calculateActivations(birthDate);
        const chart = calculateChart(activations);

        expect(chart.cross.type).toBe(crossType);
      },
      30000
    );
  });
});

describe('Full Chart Calculation', () => {
  // Run full calculation test on a subset of fixtures
  const sampleFixtures = verifiedChartFixtures.slice(0, 10);

  describe.each(sampleFixtures)('$name', (fixture: VerifiedChartFixture) => {
    let chart: Awaited<ReturnType<typeof calculateChart>>;

    beforeAll(async () => {
      const birthDate = new Date(fixture.birth_data.datetime_utc);
      const activations = await calculateActivations(birthDate);
      chart = calculateChart(activations);
    }, 30000);

    it('should calculate correct type', () => {
      expect(chart.type).toBe(fixture.expected.type);
    });

    it('should calculate correct strategy', () => {
      expect(chart.strategy).toBe(fixture.expected.strategy);
    });

    it('should calculate correct authority', () => {
      expect(chart.authority).toBe(fixture.expected.authority);
    });

    it('should calculate correct profile', () => {
      expect(chart.profile).toBe(fixture.expected.profile);
    });

    it('should calculate correct definition', () => {
      expect(chart.definition).toBe(fixture.expected.definition);
    });

    it('should calculate correct incarnation cross type', () => {
      expect(chart.cross.type).toBe(fixture.expected.incarnation_cross.type);
    });

    it('should have correct personality sun gate', () => {
      expect(chart.activations.personality.sun.gate).toBe(
        fixture.expected.personality_sun.gate
      );
    });

    it('should have correct personality sun line', () => {
      expect(chart.activations.personality.sun.line).toBe(
        fixture.expected.personality_sun.line
      );
    });
  });
});

describe('Edge Cases', () => {
  it('should handle dates at year boundaries', async () => {
    const newYearsEve = new Date('1999-12-31T23:59:00Z');
    const activations = await calculateActivations(newYearsEve);
    const chart = calculateChart(activations);

    expect(chart.type).toBeDefined();
    expect(chart.profile).toMatch(/^\d\/\d$/);
  }, 30000);

  it('should handle dates at century boundaries', async () => {
    const y2k = new Date('2000-01-01T00:00:00Z');
    const activations = await calculateActivations(y2k);
    const chart = calculateChart(activations);

    expect(chart.type).toBeDefined();
    expect(chart.profile).toMatch(/^\d\/\d$/);
  }, 30000);

  it('should handle leap year dates', async () => {
    const leapDay = new Date('2000-02-29T12:00:00Z');
    const activations = await calculateActivations(leapDay);
    const chart = calculateChart(activations);

    expect(chart.type).toBeDefined();
    expect(chart.profile).toMatch(/^\d\/\d$/);
  }, 30000);

  it('should handle dates far in the past', async () => {
    const oldDate = new Date('1920-06-15T10:00:00Z');
    const activations = await calculateActivations(oldDate);
    const chart = calculateChart(activations);

    expect(chart.type).toBeDefined();
  }, 30000);

  it('should handle recent dates', async () => {
    const recentDate = new Date('2024-01-15T14:30:00Z');
    const activations = await calculateActivations(recentDate);
    const chart = calculateChart(activations);

    expect(chart.type).toBeDefined();
  }, 30000);
});

describe('Calculation Consistency', () => {
  it('should produce identical results for the same input', async () => {
    const birthDate = new Date('1990-05-15T12:00:00Z');

    const activations1 = await calculateActivations(birthDate);
    const chart1 = calculateChart(activations1);

    const activations2 = await calculateActivations(birthDate);
    const chart2 = calculateChart(activations2);

    expect(chart1.type).toBe(chart2.type);
    expect(chart1.authority).toBe(chart2.authority);
    expect(chart1.profile).toBe(chart2.profile);
    expect(chart1.definition).toBe(chart2.definition);
    expect(chart1.activations.personality.sun.gate).toBe(
      chart2.activations.personality.sun.gate
    );
  }, 30000);

  it('should produce different results for different inputs', async () => {
    const date1 = new Date('1990-01-01T00:00:00Z');
    const date2 = new Date('1990-07-01T12:00:00Z');

    const activations1 = await calculateActivations(date1);
    const chart1 = calculateChart(activations1);

    const activations2 = await calculateActivations(date2);
    const chart2 = calculateChart(activations2);

    // At least the sun gate should be different (6 months apart)
    expect(chart1.activations.personality.sun.gate).not.toBe(
      chart2.activations.personality.sun.gate
    );
  }, 30000);
});
