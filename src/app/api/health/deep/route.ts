import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { logger } from '@/lib/observability';

const startTime = Date.now();

interface HealthCheck {
  status: 'up' | 'down' | 'degraded';
  latency_ms?: number;
  error?: string;
  details?: Record<string, unknown>;
}

interface DeepHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime_seconds: number;
  checks: {
    database: HealthCheck;
    ephemeris: HealthCheck;
    geocode_cache: HealthCheck;
    memory: HealthCheck;
  };
  system: {
    node_version: string;
    platform: string;
    memory_usage_mb: number;
    heap_used_mb: number;
    heap_total_mb: number;
  };
}

/**
 * Check database connectivity and query performance
 */
async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Run a simple query to check connectivity
    await db.execute(sql`SELECT 1`);
    const latency = Date.now() - start;

    return {
      status: latency < 100 ? 'up' : 'degraded',
      latency_ms: latency,
      details: {
        warning: latency >= 100 ? 'High latency detected' : undefined,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Database deep health check failed');
    return {
      status: 'down',
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check ephemeris WASM and calculation performance
 */
async function checkEphemeris(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const { calculateTransits } = await import('@/lib/calculation/ephemeris');

    // Run actual calculation to verify WASM is working
    const transits = await calculateTransits(new Date());
    const latency = Date.now() - start;

    // Verify we got valid results
    const hasValidResults =
      transits.sun && transits.moon && typeof transits.sun.gate === 'number';

    if (!hasValidResults) {
      return {
        status: 'degraded',
        latency_ms: latency,
        error: 'Invalid calculation results',
      };
    }

    return {
      status: latency < 200 ? 'up' : 'degraded',
      latency_ms: latency,
      details: {
        sample_sun_gate: transits.sun.gate,
        sample_moon_gate: transits.moon.gate,
        warning: latency >= 200 ? 'High calculation latency' : undefined,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Ephemeris deep health check failed');
    return {
      status: 'down',
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check geocode cache status
 */
async function checkGeocodeCache(): Promise<HealthCheck> {
  try {
    // Import the cache to check its status
    const { geocodingCache } = await import('@/lib/cache');
    const size = geocodingCache?.size ?? 0;

    return {
      status: 'up',
      details: {
        cache_size: size,
        max_size: 100, // From cache.ts configuration
      },
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Cache not available',
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): HealthCheck {
  const usage = process.memoryUsage();
  const heapUsedMB = usage.heapUsed / 1024 / 1024;
  const heapTotalMB = usage.heapTotal / 1024 / 1024;
  const heapUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;

  // Warn if heap usage is above 80%
  const status = heapUsagePercent > 90 ? 'degraded' : 'up';

  return {
    status,
    details: {
      heap_used_mb: Math.round(heapUsedMB * 100) / 100,
      heap_total_mb: Math.round(heapTotalMB * 100) / 100,
      heap_usage_percent: Math.round(heapUsagePercent * 100) / 100,
      rss_mb: Math.round((usage.rss / 1024 / 1024) * 100) / 100,
      warning: heapUsagePercent > 80 ? 'High memory usage' : undefined,
    },
  };
}

/**
 * GET /api/health/deep
 *
 * Deep diagnostic check - comprehensive system health.
 * Use this for debugging and detailed monitoring.
 */
export async function GET() {
  const [database, ephemeris, geocode_cache] = await Promise.all([
    checkDatabase(),
    checkEphemeris(),
    checkGeocodeCache(),
  ]);

  const memory = checkMemory();
  const checks = { database, ephemeris, geocode_cache, memory };

  // Determine overall status
  const statuses = Object.values(checks).map((c) => c.status);
  const hasDown = statuses.includes('down');
  const hasDegraded = statuses.includes('degraded');

  let status: DeepHealthResponse['status'];
  if (hasDown) {
    status = 'unhealthy';
  } else if (hasDegraded) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }

  const memUsage = process.memoryUsage();
  const response: DeepHealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.0.0',
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    checks,
    system: {
      node_version: process.version,
      platform: process.platform,
      memory_usage_mb: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
      heap_used_mb: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
      heap_total_mb: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  return NextResponse.json(response, {
    status: status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
