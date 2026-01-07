import { NextResponse } from 'next/server';
import { metrics } from '@/lib/observability';

/**
 * GET /api/metrics
 *
 * Returns metrics in Prometheus text format.
 * Use this endpoint for Prometheus scraping or monitoring dashboards.
 */
export async function GET() {
  const metricsOutput = metrics.toPrometheusFormat();

  return new NextResponse(metricsOutput, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
