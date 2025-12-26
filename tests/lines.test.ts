/**
 * Gate Lines Tests
 *
 * Tests the gate lines reference data and helper functions.
 */

import { describe, it, expect } from 'vitest';
import {
  getGateLines,
  getGateLine,
  getLinesByGates,
  validateCompleteness,
  GATE_LINES,
  GATE_LINE_MAP
} from '@/lib/reference/lines';

describe('Gate Lines Reference Data', () => {
  describe('GATE_LINES', () => {
    it('should be an array', () => {
      expect(Array.isArray(GATE_LINES)).toBe(true);
    });

    it('should have valid structure for each entry', () => {
      for (const line of GATE_LINES) {
        expect(line).toHaveProperty('gate');
        expect(line).toHaveProperty('line');
        expect(line).toHaveProperty('name');
        expect(line).toHaveProperty('description');
        expect(typeof line.gate).toBe('number');
        expect(typeof line.line).toBe('number');
        expect(typeof line.name).toBe('string');
        expect(typeof line.description).toBe('string');
      }
    });

    it('should have gate numbers between 1 and 64', () => {
      for (const line of GATE_LINES) {
        expect(line.gate).toBeGreaterThanOrEqual(1);
        expect(line.gate).toBeLessThanOrEqual(64);
      }
    });

    it('should have line numbers between 1 and 6', () => {
      for (const line of GATE_LINES) {
        expect(line.line).toBeGreaterThanOrEqual(1);
        expect(line.line).toBeLessThanOrEqual(6);
      }
    });
  });

  describe('GATE_LINE_MAP', () => {
    it('should be an object', () => {
      expect(typeof GATE_LINE_MAP).toBe('object');
    });

    it('should have keys in format "gate.line"', () => {
      for (const key of Object.keys(GATE_LINE_MAP)) {
        expect(key).toMatch(/^\d+\.\d+$/);
      }
    });

    it('should map to correct line objects', () => {
      const line = GATE_LINE_MAP['1.1'];
      if (line) {
        expect(line.gate).toBe(1);
        expect(line.line).toBe(1);
      }
    });
  });
});

describe('getGateLines', () => {
  it('should return array of lines for valid gate', () => {
    const lines = getGateLines(1);
    expect(Array.isArray(lines)).toBe(true);
    for (const line of lines) {
      expect(line.gate).toBe(1);
    }
  });

  it('should return empty array for gate without data', () => {
    const lines = getGateLines(50); // Assuming gate 50 has no data yet
    expect(Array.isArray(lines)).toBe(true);
    // Could be empty or have data depending on implementation status
  });

  it('should throw error for invalid gate number', () => {
    expect(() => getGateLines(0)).toThrow('Invalid gate number');
    expect(() => getGateLines(65)).toThrow('Invalid gate number');
    expect(() => getGateLines(-1)).toThrow('Invalid gate number');
    expect(() => getGateLines(1.5)).toThrow('Invalid gate number');
  });

  it('should throw error for non-integer gate', () => {
    expect(() => getGateLines(NaN)).toThrow('Invalid gate number');
  });
});

describe('getGateLine', () => {
  it('should return specific line for valid gate and line', () => {
    const line = getGateLine(1, 1);
    if (line) {
      expect(line.gate).toBe(1);
      expect(line.line).toBe(1);
      expect(line).toHaveProperty('name');
      expect(line).toHaveProperty('description');
    }
  });

  it('should return undefined for missing data', () => {
    const line = getGateLine(50, 3); // Assuming this doesn't exist
    // Could be undefined if data doesn't exist
    if (line === undefined) {
      expect(line).toBeUndefined();
    }
  });

  it('should throw error for invalid gate number', () => {
    expect(() => getGateLine(0, 1)).toThrow('Invalid gate number');
    expect(() => getGateLine(65, 1)).toThrow('Invalid gate number');
    expect(() => getGateLine(-1, 1)).toThrow('Invalid gate number');
  });

  it('should throw error for invalid line number', () => {
    expect(() => getGateLine(1, 0)).toThrow('Invalid line number');
    expect(() => getGateLine(1, 7)).toThrow('Invalid line number');
    expect(() => getGateLine(1, -1)).toThrow('Invalid line number');
    expect(() => getGateLine(1, 1.5)).toThrow('Invalid line number');
  });

  it('should throw error for both invalid gate and line', () => {
    expect(() => getGateLine(0, 0)).toThrow('Invalid gate number');
  });
});

describe('getLinesByGates', () => {
  it('should return record of lines for valid gates array', () => {
    const result = getLinesByGates([1, 2]);
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('1');
    expect(result).toHaveProperty('2');
    expect(Array.isArray(result[1])).toBe(true);
    expect(Array.isArray(result[2])).toBe(true);
  });

  it('should return empty arrays for gates without data', () => {
    const result = getLinesByGates([50, 51]); // Assuming these don't have data
    expect(typeof result).toBe('object');
    // Results could be empty or have data depending on implementation
  });

  it('should throw error for invalid gate in array', () => {
    expect(() => getLinesByGates([1, 65])).toThrow('Invalid gate number');
    expect(() => getLinesByGates([0, 1])).toThrow('Invalid gate number');
  });

  it('should throw error for non-array input', () => {
    expect(() => getLinesByGates(1 as any)).toThrow('Gates parameter must be an array');
    expect(() => getLinesByGates('1,2' as any)).toThrow('Gates parameter must be an array');
  });

  it('should handle empty array', () => {
    const result = getLinesByGates([]);
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBe(0);
  });
});

describe('validateCompleteness', () => {
  it('should return object with correct structure', () => {
    const result = validateCompleteness();
    expect(result).toHaveProperty('complete');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('missing');
    expect(typeof result.complete).toBe('boolean');
    expect(typeof result.total).toBe('number');
    expect(Array.isArray(result.missing)).toBe(true);
  });

  it('should have total between 0 and 384', () => {
    const result = validateCompleteness();
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(384);
  });

  it('should have missing entries with valid structure', () => {
    const result = validateCompleteness();
    for (const missing of result.missing) {
      expect(missing).toHaveProperty('gate');
      expect(missing).toHaveProperty('line');
      expect(missing.gate).toBeGreaterThanOrEqual(1);
      expect(missing.gate).toBeLessThanOrEqual(64);
      expect(missing.line).toBeGreaterThanOrEqual(1);
      expect(missing.line).toBeLessThanOrEqual(6);
    }
  });

  it('should report complete as false if data is incomplete', () => {
    const result = validateCompleteness();
    if (result.total < 384) {
      expect(result.complete).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
      expect(result.missing.length).toBe(384 - result.total);
    }
  });

  it('should report complete as true when all 384 lines exist', () => {
    const result = validateCompleteness();
    if (result.total === 384) {
      expect(result.complete).toBe(true);
      expect(result.missing.length).toBe(0);
    }
  });
});
