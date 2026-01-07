import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { logger } from '@/lib/observability';

interface HealthCheck {
  status: 'up' | 'down';
  latency_ms?: number;
  error?: string;
}

interface ReadinessResponse {
  status: 'ready' | 'degraded' | 'not_ready';
  timestamp: string;
  checks: {
    database: HealthCheck;
    ephemeris: HealthCheck;
  };
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return {
      status: 'up',
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    logger.error({ error }, 'Database health check failed');
    return {
      status: 'down',
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check ephemeris WASM availability
 */
async function checkEphemeris(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Dynamic import to avoid loading WASM on every request
    const { calculateTransits } = await import('@/lib/calculation/ephemeris');
    await calculateTransits(new Date());
    return {
      status: 'up',
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    logger.error({ error }, 'Ephemeris health check failed');
    return {
      status: 'down',
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * GET /api/health/ready
 *
 * Readiness check - verifies all dependencies are available.
 * Use this for Kubernetes readiness probes or before routing traffic.
 */
export async function GET() {
  const [database, ephemeris] = await Promise.all([
    checkDatabase(),
    checkEphemeris(),
  ]);

  const checks = { database, ephemeris };

  // Determine overall status
  const allUp = Object.values(checks).every((c) => c.status === 'up');
  const anyDown = Object.values(checks).some((c) => c.status === 'down');

  let status: ReadinessResponse['status'];
  if (allUp) {
    status = 'ready';
  } else if (anyDown) {
    status = 'not_ready';
  } else {
    status = 'degraded';
  }

  const response: ReadinessResponse = {
    status,
    timestamp: new Date().toISOString(),
    checks,
  };

  return NextResponse.json(response, {
    status: status === 'ready' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
