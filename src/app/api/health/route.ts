import { NextResponse } from 'next/server';

const startTime = Date.now();

/**
 * GET /api/health
 *
 * Basic liveness check - returns immediately if the server is running.
 * Use this for load balancer health checks.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.0.0',
      uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
