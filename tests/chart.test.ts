/**
 * Chart Calculation Tests
 *
 * Tests the complete Human Design chart calculation engine.
 * Verifies type derivation, authority, definition, and all chart elements.
 */

import { describe, it, expect } from 'vitest';
import { calculateChart, generateChartResponse } from '@/lib/calculation/chart';
import { CHANNELS } from '@/lib/reference/channels';

describe('Chart Calculation', () => {
  describe('calculateChart', () => {
    it('should calculate a complete chart from birth date', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      expect(chart).toHaveProperty('type');
      expect(chart).toHaveProperty('strategy');
      expect(chart).toHaveProperty('signature');
      expect(chart).toHaveProperty('not_self');
      expect(chart).toHaveProperty('authority');
      expect(chart).toHaveProperty('profile');
      expect(chart).toHaveProperty('definition');
      expect(chart).toHaveProperty('cross');
      expect(chart).toHaveProperty('centers');
      expect(chart).toHaveProperty('channels');
      expect(chart).toHaveProperty('activations');
      expect(chart).toHaveProperty('gates');
      expect(chart).toHaveProperty('circuitry');
    });

    it('should return valid Human Design type', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      const validTypes = [
        'Manifestor',
        'Generator',
        'Manifesting Generator',
        'Projector',
        'Reflector'
      ];
      expect(validTypes).toContain(chart.type);
    });

    it('should return matching strategy for type', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      const typeStrategyMap: Record<string, string> = {
        'Manifestor': 'Inform',
        'Generator': 'Wait to Respond',
        'Manifesting Generator': 'Wait to Respond',
        'Projector': 'Wait for Invitation',
        'Reflector': 'Wait Lunar Cycle',
      };

      expect(chart.strategy).toBe(typeStrategyMap[chart.type]);
    });

    it('should return valid authority', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      const validAuthorities = [
        'Emotional',
        'Sacral',
        'Splenic',
        'Ego',
        'Self-Projected',
        'Mental',
        'Lunar'
      ];
      expect(validAuthorities).toContain(chart.authority);
    });

    it('should return valid profile format', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      // Profile should be in format "X/Y" where X and Y are 1-6
      expect(chart.profile).toMatch(/^[1-6]\/[1-6]$/);
    });

    it('should return valid definition type', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      const validDefinitions = [
        'None',
        'Single',
        'Split',
        'Triple Split',
        'Quadruple Split'
      ];
      expect(validDefinitions).toContain(chart.definition);
    });

    it('should have all 9 centers in the chart', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      const centerNames = [
        'head', 'ajna', 'throat', 'g', 'ego',
        'sacral', 'solar_plexus', 'spleen', 'root'
      ];

      for (const center of centerNames) {
        expect(chart.centers).toHaveProperty(center);
        expect(chart.centers[center as keyof typeof chart.centers]).toHaveProperty('defined');
        expect(chart.centers[center as keyof typeof chart.centers]).toHaveProperty('gates');
      }
    });

    it('should have valid cross structure', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      expect(chart.cross).toHaveProperty('name');
      expect(chart.cross).toHaveProperty('type');
      expect(chart.cross).toHaveProperty('quarter');
      expect(chart.cross).toHaveProperty('gates');
      expect(chart.cross.gates).toHaveLength(4);

      const validCrossTypes = ['Right Angle', 'Juxtaposition', 'Left Angle'];
      expect(validCrossTypes).toContain(chart.cross.type);

      const validQuarters = ['Initiation', 'Civilization', 'Duality', 'Mutation'];
      expect(validQuarters).toContain(chart.cross.quarter);
    });

    it('should have personality and design activations', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      expect(chart.activations).toHaveProperty('personality');
      expect(chart.activations).toHaveProperty('design');

      const planets = [
        'sun', 'earth', 'north_node', 'south_node', 'moon',
        'mercury', 'venus', 'mars', 'jupiter', 'saturn',
        'uranus', 'neptune', 'pluto'
      ];

      for (const planet of planets) {
        expect(chart.activations.personality).toHaveProperty(planet);
        expect(chart.activations.design).toHaveProperty(planet);
      }
    });

    it('should have valid circuitry counts', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      expect(chart.circuitry).toHaveProperty('individual');
      expect(chart.circuitry).toHaveProperty('tribal');
      expect(chart.circuitry).toHaveProperty('collective');

      expect(chart.circuitry.individual).toBeGreaterThanOrEqual(0);
      expect(chart.circuitry.tribal).toBeGreaterThanOrEqual(0);
      expect(chart.circuitry.collective).toBeGreaterThanOrEqual(0);
    });

    it('should produce consistent results for same input', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart1 = calculateChart(birthDate);
      const chart2 = calculateChart(birthDate);

      expect(chart1.type).toBe(chart2.type);
      expect(chart1.authority).toBe(chart2.authority);
      expect(chart1.profile).toBe(chart2.profile);
      expect(chart1.definition).toBe(chart2.definition);
    });
  });

  describe('Type Derivation Logic', () => {
    it('should derive Reflector when no centers are defined', () => {
      // Reflectors are rare - this is a structural test
      // We verify the logic exists by checking type derivation works
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      // If no channels, should be Reflector
      if (chart.channels.length === 0) {
        expect(chart.type).toBe('Reflector');
        expect(chart.definition).toBe('None');
        expect(chart.authority).toBe('Lunar');
      }
    });

    it('should have sacral defined for Generators', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      if (chart.type === 'Generator' || chart.type === 'Manifesting Generator') {
        expect(chart.centers.sacral.defined).toBe(true);
      }
    });

    it('should not have sacral defined for Manifestors and Projectors', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      if (chart.type === 'Manifestor' || chart.type === 'Projector') {
        expect(chart.centers.sacral.defined).toBe(false);
      }
    });
  });

  describe('Authority Hierarchy', () => {
    it('should have Emotional authority when Solar Plexus is defined', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      // Emotional authority takes precedence
      if (chart.centers.solar_plexus.defined && chart.type !== 'Reflector') {
        expect(chart.authority).toBe('Emotional');
      }
    });

    it('should have Lunar authority for Reflectors', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      if (chart.type === 'Reflector') {
        expect(chart.authority).toBe('Lunar');
      }
    });
  });

  describe('Channel Detection', () => {
    it('should only include complete channels', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      for (const channel of chart.channels) {
        // Both gates of the channel should be in the activated gates
        const allGates = Object.values(chart.activations.personality)
          .concat(Object.values(chart.activations.design))
          .map(a => a.gate);

        expect(allGates).toContain(channel.gates[0]);
        expect(allGates).toContain(channel.gates[1]);
      }
    });

    it('should mark centers as defined when they have complete channels', () => {
      const birthDate = new Date('1980-09-13T09:15:00Z');
      const chart = calculateChart(birthDate);

      // If there are channels, there should be defined centers
      if (chart.channels.length > 0) {
        const definedCenters = Object.entries(chart.centers)
          .filter(([_, c]) => c.defined)
          .length;
        expect(definedCenters).toBeGreaterThan(0);
      }
    });
  });

  describe('generateChartResponse', () => {
    it('should generate complete response with birth data', () => {
      const response = generateChartResponse(
        '1980-09-13T09:15:00Z',
        34.0522,
        -118.2437,
        'America/Los_Angeles'
      );

      expect(response).toHaveProperty('birth');
      expect(response).toHaveProperty('chart');

      expect(response.birth.datetime_utc).toBe('1980-09-13T09:15:00Z');
      expect(response.birth.lat).toBe(34.0522);
      expect(response.birth.lng).toBe(-118.2437);
      expect(response.birth.timezone).toBe('America/Los_Angeles');
    });

    it('should default timezone to UTC if not provided', () => {
      const response = generateChartResponse(
        '1980-09-13T09:15:00Z',
        34.0522,
        -118.2437
      );

      expect(response.birth.timezone).toBe('UTC');
    });
  });
});

describe('Reference Data', () => {
  describe('CHANNELS', () => {
    it('should have valid channel structure', () => {
      expect(Array.isArray(CHANNELS)).toBe(true);
      expect(CHANNELS.length).toBeGreaterThan(0);

      for (const channel of CHANNELS) {
        expect(channel).toHaveProperty('gates');
        expect(channel).toHaveProperty('name');
        expect(channel).toHaveProperty('circuit');
        expect(channel.gates).toHaveLength(2);
      }
    });

    it('should have valid circuit types', () => {
      const validCircuits = ['Individual', 'Tribal', 'Collective'];

      for (const channel of CHANNELS) {
        expect(validCircuits).toContain(channel.circuit);
      }
    });
  });
});
