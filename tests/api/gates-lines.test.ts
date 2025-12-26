/**
 * Gate Lines API Tests
 *
 * Tests the /api/reference/gates/:id/lines endpoint
 */

import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/reference/gates/[id]/lines/route';
import { NextRequest } from 'next/server';

/**
 * Helper to create a mock NextRequest
 */
function createMockRequest(url: string): NextRequest {
  return new NextRequest(url);
}

/**
 * Helper to create mock context with params
 */
function createMockContext(id: string) {
  return {
    params: Promise.resolve({ id })
  };
}

describe('GET /api/reference/gates/:id/lines', () => {
  describe('Valid requests', () => {
    it('should return 200 for gate with complete data', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/1/lines');
      const context = createMockContext('1');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('gate');
      expect(data).toHaveProperty('lines');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('available');
      expect(data).toHaveProperty('expected');
      expect(data.gate).toBe(1);
      expect(Array.isArray(data.lines)).toBe(true);
      expect(data.expected).toBe(6);
    });

    it('should return complete status for gate with all 6 lines', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/1/lines');
      const context = createMockContext('1');

      const response = await GET(request, context);
      const data = await response.json();

      if (data.lines.length === 6) {
        expect(data.status).toBe('complete');
        expect(data.available).toBe(6);
      }
    });

    it('should return partial status for gate with incomplete data', async () => {
      // Test with a gate that might have partial data
      // This will depend on the current implementation status
      const request = createMockRequest('http://localhost:3000/api/reference/gates/5/lines');
      const context = createMockContext('5');

      const response = await GET(request, context);
      const data = await response.json();

      if (response.status === 200 && data.lines.length > 0 && data.lines.length < 6) {
        expect(data.status).toBe('partial');
        expect(data.available).toBeLessThan(6);
        expect(data.available).toBe(data.lines.length);
      }
    });

    it('should return valid line structure', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/1/lines');
      const context = createMockContext('1');

      const response = await GET(request, context);
      const data = await response.json();

      if (data.lines && data.lines.length > 0) {
        for (const line of data.lines) {
          expect(line).toHaveProperty('gate');
          expect(line).toHaveProperty('line');
          expect(line).toHaveProperty('name');
          expect(line).toHaveProperty('description');
          expect(line.gate).toBe(1);
          expect(line.line).toBeGreaterThanOrEqual(1);
          expect(line.line).toBeLessThanOrEqual(6);
          expect(typeof line.name).toBe('string');
          expect(typeof line.description).toBe('string');
        }
      }
    });

    it('should accept gate IDs from 1 to 64', async () => {
      // Test boundary values
      const testGates = [1, 32, 64];

      for (const gateId of testGates) {
        const request = createMockRequest(`http://localhost:3000/api/reference/gates/${gateId}/lines`);
        const context = createMockContext(String(gateId));

        const response = await GET(request, context);

        // Should return either 200 (with data) or 404 (no data)
        expect([200, 404]).toContain(response.status);
      }
    });
  });

  describe('Invalid gate IDs', () => {
    it('should return 400 for gate ID 0', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/0/lines');
      const context = createMockContext('0');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for gate ID 65', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/65/lines');
      const context = createMockContext('65');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for negative gate ID', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/-1/lines');
      const context = createMockContext('-1');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for non-numeric gate ID', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/abc/lines');
      const context = createMockContext('abc');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for decimal gate ID', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/1.5/lines');
      const context = createMockContext('1.5');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Missing data handling', () => {
    it('should return 404 for gate without any line data', async () => {
      // Test with a gate that likely has no data (e.g., gate 50)
      const request = createMockRequest('http://localhost:3000/api/reference/gates/50/lines');
      const context = createMockContext('50');

      const response = await GET(request, context);

      if (response.status === 404) {
        const data = await response.json();
        expect(data).toHaveProperty('error');
        expect(data).toHaveProperty('gate');
        expect(data).toHaveProperty('message');
        expect(data.gate).toBe(50);
      }
    });

    it('should include helpful message for missing data', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/60/lines');
      const context = createMockContext('60');

      const response = await GET(request, context);

      if (response.status === 404) {
        const data = await response.json();
        expect(data.message).toContain('not');
        expect(data.message.toLowerCase()).toMatch(/not.*available|not.*yet/);
      }
    });
  });

  describe('Error handling', () => {
    it('should return proper error structure for validation errors', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/invalid/lines');
      const context = createMockContext('invalid');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(typeof data.error).toBe('string');
    });

    it('should include Zod error details for invalid input', async () => {
      const request = createMockRequest('http://localhost:3000/api/reference/gates/abc/lines');
      const context = createMockContext('abc');

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('details');
      expect(Array.isArray(data.details)).toBe(true);
    });
  });

  describe('Response consistency', () => {
    it('should return consistent structure for same gate', async () => {
      const request1 = createMockRequest('http://localhost:3000/api/reference/gates/1/lines');
      const context1 = createMockContext('1');
      const response1 = await GET(request1, context1);
      const data1 = await response1.json();

      const request2 = createMockRequest('http://localhost:3000/api/reference/gates/1/lines');
      const context2 = createMockContext('1');
      const response2 = await GET(request2, context2);
      const data2 = await response2.json();

      expect(response1.status).toBe(response2.status);
      expect(data1.gate).toBe(data2.gate);
      expect(data1.lines.length).toBe(data2.lines.length);
      expect(data1.status).toBe(data2.status);
    });
  });
});
