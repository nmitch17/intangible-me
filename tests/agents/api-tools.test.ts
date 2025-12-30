/**
 * AI Agent API Tools Test Suite
 *
 * Tests for tools that make API calls:
 * - calculateChartTool: Calls /api/chart
 * - getCurrentTransitTool: Calls /api/transit
 *
 * These tests mock the fetch API to avoid actual network calls.
 */

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

// Mock chart response
const MOCK_CHART_RESPONSE = {
  chart: {
    type: 'Projector',
    strategy: 'Wait for Invitation',
    authority: 'Splenic',
    profile: '4/6',
    definition: 'Split',
    centers: {
      head: { defined: false },
      ajna: { defined: true },
      throat: { defined: true },
      g: { defined: true },
      ego: { defined: false },
      sacral: { defined: false },
      solar_plexus: { defined: false },
      spleen: { defined: true },
      root: { defined: false },
    },
    channels: [
      { gates: [57, 20], name: 'The Brainwave' },
      { gates: [10, 57], name: 'Perfected Form' },
    ],
  },
  birth: {
    datetime_utc: '1996-12-17T09:55:00.000Z',
    lat: 35.0841,
    lng: -106.6510,
  },
};

// Mock transit response
const MOCK_TRANSIT_RESPONSE = {
  datetime_utc: '2025-01-15T12:00:00.000Z',
  activations: {
    sun: { gate: 61, line: 3, planet: 'sun' },
    earth: { gate: 62, line: 3, planet: 'earth' },
    moon: { gate: 19, line: 5, planet: 'moon' },
    north_node: { gate: 4, line: 2, planet: 'north_node' },
    south_node: { gate: 49, line: 2, planet: 'south_node' },
    mercury: { gate: 60, line: 4, planet: 'mercury' },
    venus: { gate: 41, line: 1, planet: 'venus' },
    mars: { gate: 45, line: 6, planet: 'mars' },
    jupiter: { gate: 25, line: 5, planet: 'jupiter' },
    saturn: { gate: 4, line: 4, planet: 'saturn' },
    uranus: { gate: 27, line: 3, planet: 'uranus' },
    neptune: { gate: 36, line: 2, planet: 'neptune' },
    pluto: { gate: 60, line: 2, planet: 'pluto' },
  },
};

// Simulate calculateChartTool execute function
async function executeCalculateChart(params: {
  datetime_utc: string;
  lat: number;
  lng: number;
}): Promise<{ success: boolean; chart?: any; error?: string }> {
  try {
    const { datetime_utc, lat, lng } = params;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetime_utc, lat, lng }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to calculate chart',
      };
    }

    const chartData = await response.json();
    return {
      success: true,
      chart: chartData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Simulate getCurrentTransitTool execute function
async function executeGetCurrentTransit(params: {
  datetime_utc?: string;
}): Promise<{ success: boolean; transit?: any; error?: string }> {
  try {
    const datetime_utc = params.datetime_utc || new Date().toISOString();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/transit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetime_utc }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to calculate transit',
      };
    }

    const transitData = await response.json();
    return {
      success: true,
      transit: transitData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

describe('calculateChartTool', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  it('should successfully calculate a chart with valid input', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_CHART_RESPONSE,
    } as Response);

    const result = await executeCalculateChart({
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    });

    expect(result.success).toBe(true);
    expect(result.chart).toBeDefined();
    expect(result.chart.chart.type).toBe('Projector');
    expect(result.chart.chart.authority).toBe('Splenic');
    expect(result.chart.chart.profile).toBe('4/6');
  });

  it('should call the correct API endpoint', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_CHART_RESPONSE,
    } as Response);

    await executeCalculateChart({
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/chart'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should pass correct body parameters', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_CHART_RESPONSE,
    } as Response);

    const params = {
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    };

    await executeCalculateChart(params);

    const fetchCall = (global.fetch as Mock).mock.calls[0];
    const body = JSON.parse(fetchCall[1]?.body as string);

    expect(body.datetime_utc).toBe(params.datetime_utc);
    expect(body.lat).toBe(params.lat);
    expect(body.lng).toBe(params.lng);
  });

  it('should handle API error response', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid datetime format' }),
    } as Response);

    const result = await executeCalculateChart({
      datetime_utc: 'invalid-date',
      lat: 35.0841,
      lng: -106.6510,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid datetime format');
    expect(result.chart).toBeUndefined();
  });

  it('should handle network error', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await executeCalculateChart({
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should handle API returning empty error', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    const result = await executeCalculateChart({
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to calculate chart');
  });

  it('should include all chart data in response', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_CHART_RESPONSE,
    } as Response);

    const result = await executeCalculateChart({
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    });

    expect(result.chart.chart).toHaveProperty('type');
    expect(result.chart.chart).toHaveProperty('strategy');
    expect(result.chart.chart).toHaveProperty('authority');
    expect(result.chart.chart).toHaveProperty('profile');
    expect(result.chart.chart).toHaveProperty('definition');
    expect(result.chart.chart).toHaveProperty('centers');
    expect(result.chart.chart).toHaveProperty('channels');
    expect(result.chart.birth).toHaveProperty('datetime_utc');
    expect(result.chart.birth).toHaveProperty('lat');
    expect(result.chart.birth).toHaveProperty('lng');
  });
});

describe('getCurrentTransitTool', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should successfully get current transits', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_TRANSIT_RESPONSE,
    } as Response);

    const result = await executeGetCurrentTransit({});

    expect(result.success).toBe(true);
    expect(result.transit).toBeDefined();
    expect(result.transit.activations).toBeDefined();
    expect(result.transit.activations.sun).toBeDefined();
  });

  it('should use provided datetime_utc', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_TRANSIT_RESPONSE,
    } as Response);

    const specificDate = '2025-01-15T12:00:00.000Z';
    await executeGetCurrentTransit({ datetime_utc: specificDate });

    const fetchCall = (global.fetch as Mock).mock.calls[0];
    const body = JSON.parse(fetchCall[1]?.body as string);

    expect(body.datetime_utc).toBe(specificDate);
  });

  it('should use current time when datetime_utc not provided', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_TRANSIT_RESPONSE,
    } as Response);

    const beforeCall = new Date().toISOString();
    await executeGetCurrentTransit({});
    const afterCall = new Date().toISOString();

    const fetchCall = (global.fetch as Mock).mock.calls[0];
    const body = JSON.parse(fetchCall[1]?.body as string);

    // The datetime should be between beforeCall and afterCall
    expect(body.datetime_utc >= beforeCall.slice(0, 19)).toBe(true);
    expect(body.datetime_utc <= afterCall.slice(0, 19) + 'Z').toBe(true);
  });

  it('should call the transit API endpoint', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_TRANSIT_RESPONSE,
    } as Response);

    await executeGetCurrentTransit({});

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/transit'),
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('should handle API error response', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Transit calculation failed' }),
    } as Response);

    const result = await executeGetCurrentTransit({});

    expect(result.success).toBe(false);
    expect(result.error).toBe('Transit calculation failed');
  });

  it('should handle network error', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('Connection refused'));

    const result = await executeGetCurrentTransit({});

    expect(result.success).toBe(false);
    expect(result.error).toBe('Connection refused');
  });

  it('should return all planetary activations', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_TRANSIT_RESPONSE,
    } as Response);

    const result = await executeGetCurrentTransit({});

    const activations = result.transit.activations;
    expect(activations).toHaveProperty('sun');
    expect(activations).toHaveProperty('earth');
    expect(activations).toHaveProperty('moon');
    expect(activations).toHaveProperty('mercury');
    expect(activations).toHaveProperty('venus');
    expect(activations).toHaveProperty('mars');
    expect(activations).toHaveProperty('jupiter');
    expect(activations).toHaveProperty('saturn');
    expect(activations).toHaveProperty('uranus');
    expect(activations).toHaveProperty('neptune');
    expect(activations).toHaveProperty('pluto');
    expect(activations).toHaveProperty('north_node');
    expect(activations).toHaveProperty('south_node');
  });

  it('should include gate and line for each activation', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_TRANSIT_RESPONSE,
    } as Response);

    const result = await executeGetCurrentTransit({});

    const sunActivation = result.transit.activations.sun;
    expect(sunActivation).toHaveProperty('gate');
    expect(sunActivation).toHaveProperty('line');
    expect(sunActivation).toHaveProperty('planet');
    expect(typeof sunActivation.gate).toBe('number');
    expect(sunActivation.gate).toBeGreaterThanOrEqual(1);
    expect(sunActivation.gate).toBeLessThanOrEqual(64);
    expect(sunActivation.line).toBeGreaterThanOrEqual(1);
    expect(sunActivation.line).toBeLessThanOrEqual(6);
  });
});

describe('Tool Response Format Consistency', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('calculateChartTool success response should have consistent format', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_CHART_RESPONSE,
    } as Response);

    const result = await executeCalculateChart({
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    });

    // Success response format
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('chart');
    expect(result).not.toHaveProperty('error');
  });

  it('calculateChartTool error response should have consistent format', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('Test error'));

    const result = await executeCalculateChart({
      datetime_utc: '1996-12-17T09:55:00.000Z',
      lat: 35.0841,
      lng: -106.6510,
    });

    // Error response format
    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty('error');
    expect(result.chart).toBeUndefined();
  });

  it('getCurrentTransitTool success response should have consistent format', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_TRANSIT_RESPONSE,
    } as Response);

    const result = await executeGetCurrentTransit({});

    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('transit');
    expect(result).not.toHaveProperty('error');
  });

  it('getCurrentTransitTool error response should have consistent format', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('Test error'));

    const result = await executeGetCurrentTransit({});

    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty('error');
    expect(result.transit).toBeUndefined();
  });
});
