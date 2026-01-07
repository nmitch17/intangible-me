/**
 * API Integration Tests
 *
 * Tests all API endpoints for correct behavior, validation, and error handling.
 */

import { describe, it, expect } from 'vitest';

// Base URL for API calls (using Next.js test server)
const API_BASE = 'http://localhost:3000/api';

// Helper to make API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${endpoint}`;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

describe('Health Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const response = await apiRequest('/health');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.version).toBeDefined();
    });
  });

  describe('GET /api/health/ready', () => {
    it('should return readiness status with checks', async () => {
      const response = await apiRequest('/health/ready');
      const data = await response.json();

      expect(data.status).toMatch(/^(ready|degraded|not_ready)$/);
      expect(data.checks).toBeDefined();
      expect(data.checks.database).toBeDefined();
      expect(data.checks.ephemeris).toBeDefined();
    });
  });

  describe('GET /api/health/deep', () => {
    it('should return detailed health information', async () => {
      const response = await apiRequest('/health/deep');
      const data = await response.json();

      expect(data.status).toMatch(/^(healthy|degraded|unhealthy)$/);
      expect(data.checks).toBeDefined();
      expect(data.system).toBeDefined();
      expect(data.system.node_version).toBeDefined();
      expect(data.system.memory_usage_mb).toBeGreaterThan(0);
    });
  });
});

describe('Chart Calculation Endpoint', () => {
  describe('POST /api/chart', () => {
    it('should calculate a chart with valid input', async () => {
      const response = await apiRequest('/chart', {
        method: 'POST',
        body: JSON.stringify({
          datetime_utc: '1990-06-15T14:30:00Z',
          lat: 40.7128,
          lng: -74.006,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.chart).toBeDefined();
      expect(data.chart.type).toMatch(
        /^(Generator|Manifesting Generator|Projector|Manifestor|Reflector)$/
      );
      expect(data.chart.authority).toBeDefined();
      expect(data.chart.profile).toMatch(/^\d\/\d$/);
      expect(data.chart.definition).toBeDefined();
    });

    it('should return 400 for invalid datetime', async () => {
      const response = await apiRequest('/chart', {
        method: 'POST',
        body: JSON.stringify({
          datetime_utc: 'not-a-date',
          lat: 40.7128,
          lng: -74.006,
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid latitude', async () => {
      const response = await apiRequest('/chart', {
        method: 'POST',
        body: JSON.stringify({
          datetime_utc: '1990-06-15T14:30:00Z',
          lat: 100, // Invalid: must be -90 to 90
          lng: -74.006,
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid longitude', async () => {
      const response = await apiRequest('/chart', {
        method: 'POST',
        body: JSON.stringify({
          datetime_utc: '1990-06-15T14:30:00Z',
          lat: 40.7128,
          lng: -200, // Invalid: must be -180 to 180
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await apiRequest('/chart', {
        method: 'POST',
        body: JSON.stringify({
          datetime_utc: '1990-06-15T14:30:00Z',
          // Missing lat and lng
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should include all expected chart properties', async () => {
      const response = await apiRequest('/chart', {
        method: 'POST',
        body: JSON.stringify({
          datetime_utc: '1985-03-20T10:00:00Z',
          lat: 51.5074,
          lng: -0.1278,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      const chart = data.chart;

      // Core properties
      expect(chart.type).toBeDefined();
      expect(chart.strategy).toBeDefined();
      expect(chart.authority).toBeDefined();
      expect(chart.profile).toBeDefined();
      expect(chart.definition).toBeDefined();

      // Cross
      expect(chart.cross).toBeDefined();
      expect(chart.cross.name).toBeDefined();
      expect(chart.cross.type).toMatch(
        /^(Right Angle|Left Angle|Juxtaposition)$/
      );
      expect(chart.cross.quarter).toMatch(
        /^(Initiation|Civilization|Duality|Mutation)$/
      );

      // Centers
      expect(chart.centers).toBeDefined();
      expect(Object.keys(chart.centers).length).toBe(9);

      // Activations
      expect(chart.activations).toBeDefined();
      expect(chart.activations.personality).toBeDefined();
      expect(chart.activations.design).toBeDefined();
      expect(chart.activations.personality.sun).toBeDefined();
      expect(chart.activations.personality.sun.gate).toBeGreaterThanOrEqual(1);
      expect(chart.activations.personality.sun.gate).toBeLessThanOrEqual(64);
    });
  });
});

describe('Transit Endpoint', () => {
  describe('POST /api/transit', () => {
    it('should calculate current transits', async () => {
      const response = await apiRequest('/transit', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.transits).toBeDefined();
      expect(data.transits.sun).toBeDefined();
      expect(data.transits.moon).toBeDefined();
    });

    it('should calculate transits for a specific date', async () => {
      const response = await apiRequest('/transit', {
        method: 'POST',
        body: JSON.stringify({
          datetime_utc: '2024-06-21T12:00:00Z',
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.transits).toBeDefined();
    });

    it('should calculate transits with natal overlay', async () => {
      const response = await apiRequest('/transit', {
        method: 'POST',
        body: JSON.stringify({
          natal_chart: {
            datetime_utc: '1990-06-15T14:30:00Z',
          },
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.transits).toBeDefined();
    });
  });
});

describe('Composite Endpoint', () => {
  describe('POST /api/composite', () => {
    it('should calculate composite chart for two people', async () => {
      const response = await apiRequest('/composite', {
        method: 'POST',
        body: JSON.stringify({
          chart_a: {
            datetime_utc: '1990-06-15T14:30:00Z',
          },
          chart_b: {
            datetime_utc: '1988-03-22T08:00:00Z',
          },
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.chart_a).toBeDefined();
      expect(data.chart_b).toBeDefined();
      expect(data.composite).toBeDefined();
    });

    it('should return 400 for missing chart data', async () => {
      const response = await apiRequest('/composite', {
        method: 'POST',
        body: JSON.stringify({
          chart_a: {
            datetime_utc: '1990-06-15T14:30:00Z',
          },
          // Missing chart_b
        }),
      });

      expect(response.status).toBe(400);
    });
  });
});

describe('Reference Endpoints', () => {
  describe('GET /api/reference/gates', () => {
    it('should return gate reference data', async () => {
      const response = await apiRequest('/reference/gates');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.gates).toBeDefined();
      expect(Array.isArray(data.gates)).toBe(true);
    });

    it('should support filtering by center', async () => {
      const response = await apiRequest('/reference/gates?center=sacral');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.gates).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await apiRequest('/reference/gates?page=1&limit=10');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.gates.length).toBeLessThanOrEqual(10);
    });
  });

  describe('GET /api/reference/channels', () => {
    it('should return channel reference data', async () => {
      const response = await apiRequest('/reference/channels');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.channels).toBeDefined();
      expect(Array.isArray(data.channels)).toBe(true);
    });

    it('should support filtering by circuit', async () => {
      const response = await apiRequest('/reference/channels?circuit=Individual');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/reference/types', () => {
    it('should return type reference data', async () => {
      const response = await apiRequest('/reference/types');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toBeDefined();
    });
  });
});

describe('Geocode Endpoint', () => {
  describe('GET /api/geocode', () => {
    it('should return location data for a city search', async () => {
      const response = await apiRequest('/geocode?q=New%20York');

      // May fail if geocoding service is unavailable
      if (response.status === 200) {
        const data = await response.json();
        expect(data.results).toBeDefined();
        expect(Array.isArray(data.results)).toBe(true);
      }
    });

    it('should return 400 for missing query', async () => {
      const response = await apiRequest('/geocode');
      expect(response.status).toBe(400);
    });

    it('should return cache headers', async () => {
      const response = await apiRequest('/geocode?q=London');

      if (response.status === 200) {
        // Should have cache-related headers
        const cacheHeader = response.headers.get('X-Cache');
        expect(cacheHeader).toMatch(/^(HIT|MISS)$/);
      }
    });
  });
});

describe('Error Handling', () => {
  it('should return JSON error for invalid JSON body', async () => {
    const response = await fetch(`${API_BASE}/chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'not valid json',
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should handle non-existent endpoints gracefully', async () => {
    const response = await apiRequest('/nonexistent');
    expect(response.status).toBe(404);
  });
});

describe('Response Times', () => {
  it('should calculate chart within 2 seconds', async () => {
    const start = Date.now();

    await apiRequest('/chart', {
      method: 'POST',
      body: JSON.stringify({
        datetime_utc: '1990-06-15T14:30:00Z',
        lat: 40.7128,
        lng: -74.006,
      }),
    });

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  it('should return health check within 100ms', async () => {
    const start = Date.now();
    await apiRequest('/health');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
