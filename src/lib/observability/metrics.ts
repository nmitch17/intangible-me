/**
 * Metrics Collection Module
 *
 * Collects and exposes metrics in Prometheus format for monitoring.
 * Tracks business metrics, performance metrics, and system health.
 */

import { Metric } from './events';

// ============================================================================
// TYPES
// ============================================================================

interface CounterMetric {
  name: string;
  help: string;
  type: 'counter';
  values: Map<string, number>;
}

interface GaugeMetric {
  name: string;
  help: string;
  type: 'gauge';
  values: Map<string, number>;
}

interface HistogramMetric {
  name: string;
  help: string;
  type: 'histogram';
  buckets: number[];
  values: Map<string, { count: number; sum: number; buckets: number[] }>;
}

type MetricDefinition = CounterMetric | GaugeMetric | HistogramMetric;

// ============================================================================
// METRIC REGISTRY
// ============================================================================

class MetricsRegistry {
  private metrics: Map<string, MetricDefinition> = new Map();
  private startTime = Date.now();

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    // Business Counters
    this.registerCounter(
      Metric.CHARTS_CALCULATED,
      'Total number of charts calculated'
    );
    this.registerCounter(
      Metric.TRANSITS_CALCULATED,
      'Total number of transit calculations'
    );
    this.registerCounter(
      Metric.COMPOSITES_CALCULATED,
      'Total number of composite analyses'
    );
    this.registerCounter(
      Metric.AI_READINGS_GENERATED,
      'Total number of AI readings generated'
    );
    this.registerCounter(Metric.ERRORS_TOTAL, 'Total number of errors');
    this.registerCounter(
      Metric.RATE_LIMIT_HITS,
      'Total number of rate limit hits'
    );

    // Performance Histograms
    this.registerHistogram(
      Metric.CHART_CALCULATION_DURATION,
      'Time to calculate a chart in milliseconds',
      [10, 25, 50, 100, 250, 500, 1000, 2500]
    );
    this.registerHistogram(
      Metric.EPHEMERIS_CALCULATION_DURATION,
      'Time for ephemeris calculation in milliseconds',
      [5, 10, 25, 50, 100, 250]
    );
    this.registerHistogram(
      Metric.API_REQUEST_DURATION,
      'Total API request duration in milliseconds',
      [10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
    );
    this.registerHistogram(
      Metric.DATABASE_QUERY_DURATION,
      'Database query duration in milliseconds',
      [1, 5, 10, 25, 50, 100, 250]
    );
    this.registerHistogram(
      Metric.AI_GENERATION_DURATION,
      'AI generation duration in milliseconds',
      [100, 250, 500, 1000, 2500, 5000, 10000]
    );

    // Gauges
    this.registerGauge(Metric.ACTIVE_USERS, 'Number of currently active users');
    this.registerGauge(Metric.CACHE_SIZE, 'Number of items in cache');
    this.registerGauge(Metric.CACHE_HIT_RATE, 'Cache hit rate percentage');
  }

  private registerCounter(name: string, help: string): void {
    this.metrics.set(name, {
      name,
      help,
      type: 'counter',
      values: new Map([['', 0]]),
    });
  }

  private registerGauge(name: string, help: string): void {
    this.metrics.set(name, {
      name,
      help,
      type: 'gauge',
      values: new Map([['', 0]]),
    });
  }

  private registerHistogram(
    name: string,
    help: string,
    buckets: number[]
  ): void {
    this.metrics.set(name, {
      name,
      help,
      type: 'histogram',
      buckets,
      values: new Map([
        ['', { count: 0, sum: 0, buckets: new Array(buckets.length).fill(0) }],
      ]),
    });
  }

  // ============================================================================
  // INCREMENT / SET METHODS
  // ============================================================================

  incrementCounter(name: string, labels: Record<string, string> = {}): void {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'counter') return;

    const key = this.labelsToKey(labels);
    const current = metric.values.get(key) || 0;
    metric.values.set(key, current + 1);
  }

  incrementCounterBy(
    name: string,
    value: number,
    labels: Record<string, string> = {}
  ): void {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'counter') return;

    const key = this.labelsToKey(labels);
    const current = metric.values.get(key) || 0;
    metric.values.set(key, current + value);
  }

  setGauge(
    name: string,
    value: number,
    labels: Record<string, string> = {}
  ): void {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'gauge') return;

    const key = this.labelsToKey(labels);
    metric.values.set(key, value);
  }

  observeHistogram(
    name: string,
    value: number,
    labels: Record<string, string> = {}
  ): void {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'histogram') return;

    const key = this.labelsToKey(labels);
    let data = metric.values.get(key);

    if (!data) {
      data = {
        count: 0,
        sum: 0,
        buckets: new Array(metric.buckets.length).fill(0),
      };
      metric.values.set(key, data);
    }

    data.count++;
    data.sum += value;

    // Update bucket counts
    for (let i = 0; i < metric.buckets.length; i++) {
      if (value <= metric.buckets[i]) {
        data.buckets[i]++;
      }
    }
  }

  // ============================================================================
  // EXPORT METHODS
  // ============================================================================

  private labelsToKey(labels: Record<string, string>): string {
    if (Object.keys(labels).length === 0) return '';
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }

  private keyToLabels(key: string): string {
    if (!key) return '';
    return `{${key}}`;
  }

  /**
   * Export all metrics in Prometheus text format
   */
  toPrometheusFormat(): string {
    const lines: string[] = [];

    // Add process uptime
    lines.push('# HELP process_uptime_seconds Process uptime in seconds');
    lines.push('# TYPE process_uptime_seconds gauge');
    lines.push(
      `process_uptime_seconds ${Math.floor((Date.now() - this.startTime) / 1000)}`
    );
    lines.push('');

    // Add memory metrics
    const memUsage = process.memoryUsage();
    lines.push('# HELP process_memory_heap_bytes Process heap memory usage');
    lines.push('# TYPE process_memory_heap_bytes gauge');
    lines.push(`process_memory_heap_bytes ${memUsage.heapUsed}`);
    lines.push('');

    lines.push('# HELP process_memory_rss_bytes Process RSS memory');
    lines.push('# TYPE process_memory_rss_bytes gauge');
    lines.push(`process_memory_rss_bytes ${memUsage.rss}`);
    lines.push('');

    // Export registered metrics
    for (const metric of this.metrics.values()) {
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} ${metric.type}`);

      if (metric.type === 'counter' || metric.type === 'gauge') {
        for (const [key, value] of metric.values) {
          const labels = this.keyToLabels(key);
          lines.push(`${metric.name}${labels} ${value}`);
        }
      } else if (metric.type === 'histogram') {
        for (const [key, data] of metric.values) {
          const labels = this.keyToLabels(key);
          const labelPrefix = key ? `${key},` : '';

          // Bucket values
          for (let i = 0; i < metric.buckets.length; i++) {
            const bucketLabel = `{${labelPrefix}le="${metric.buckets[i]}"}`;
            lines.push(`${metric.name}_bucket${bucketLabel} ${data.buckets[i]}`);
          }
          // +Inf bucket
          lines.push(
            `${metric.name}_bucket{${labelPrefix}le="+Inf"} ${data.count}`
          );

          // Sum and count
          lines.push(`${metric.name}_sum${labels} ${data.sum}`);
          lines.push(`${metric.name}_count${labels} ${data.count}`);
        }
      }

      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Get a summary of current metrics for health checks
   */
  getSummary(): Record<string, unknown> {
    const summary: Record<string, unknown> = {};

    for (const metric of this.metrics.values()) {
      if (metric.type === 'counter' || metric.type === 'gauge') {
        const totalValue = Array.from(metric.values.values()).reduce(
          (a, b) => a + b,
          0
        );
        summary[metric.name] = totalValue;
      } else if (metric.type === 'histogram') {
        let totalCount = 0;
        let totalSum = 0;
        for (const data of metric.values.values()) {
          totalCount += data.count;
          totalSum += data.sum;
        }
        summary[metric.name] = {
          count: totalCount,
          avg: totalCount > 0 ? totalSum / totalCount : 0,
        };
      }
    }

    return summary;
  }

  /**
   * Reset all metrics (useful for testing)
   */
  reset(): void {
    for (const metric of this.metrics.values()) {
      if (metric.type === 'counter' || metric.type === 'gauge') {
        metric.values.clear();
        metric.values.set('', 0);
      } else if (metric.type === 'histogram') {
        const histMetric = metric as HistogramMetric;
        histMetric.values.clear();
        histMetric.values.set('', {
          count: 0,
          sum: 0,
          buckets: new Array(histMetric.buckets.length).fill(0),
        });
      }
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const metrics = new MetricsRegistry();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Record a chart calculation
 */
export function recordChartCalculation(
  type: string,
  durationMs: number
): void {
  metrics.incrementCounter(Metric.CHARTS_CALCULATED, { type });
  metrics.observeHistogram(Metric.CHART_CALCULATION_DURATION, durationMs, {
    type,
  });
}

/**
 * Record a transit calculation
 */
export function recordTransitCalculation(durationMs: number): void {
  metrics.incrementCounter(Metric.TRANSITS_CALCULATED);
  metrics.observeHistogram(Metric.CHART_CALCULATION_DURATION, durationMs, {
    operation: 'transit',
  });
}

/**
 * Record a composite calculation
 */
export function recordCompositeCalculation(durationMs: number): void {
  metrics.incrementCounter(Metric.COMPOSITES_CALCULATED);
  metrics.observeHistogram(Metric.CHART_CALCULATION_DURATION, durationMs, {
    operation: 'composite',
  });
}

/**
 * Record an AI reading generation
 */
export function recordAIGeneration(
  model: string,
  durationMs: number,
  success: boolean
): void {
  metrics.incrementCounter(Metric.AI_READINGS_GENERATED, {
    model,
    success: String(success),
  });
  metrics.observeHistogram(Metric.AI_GENERATION_DURATION, durationMs, {
    model,
  });
}

/**
 * Record an API request
 */
export function recordAPIRequest(
  endpoint: string,
  method: string,
  statusCode: number,
  durationMs: number
): void {
  metrics.observeHistogram(Metric.API_REQUEST_DURATION, durationMs, {
    endpoint,
    method,
    status: String(statusCode),
  });

  if (statusCode >= 400) {
    metrics.incrementCounter(Metric.ERRORS_TOTAL, {
      endpoint,
      status: String(statusCode),
    });
  }
}

/**
 * Record a database query
 */
export function recordDatabaseQuery(
  operation: string,
  durationMs: number
): void {
  metrics.observeHistogram(Metric.DATABASE_QUERY_DURATION, durationMs, {
    operation,
  });
}

/**
 * Record a rate limit hit
 */
export function recordRateLimitHit(endpoint: string): void {
  metrics.incrementCounter(Metric.RATE_LIMIT_HITS, { endpoint });
}

/**
 * Record an error
 */
export function recordError(category: string, endpoint?: string): void {
  metrics.incrementCounter(Metric.ERRORS_TOTAL, {
    category,
    ...(endpoint ? { endpoint } : {}),
  });
}

/**
 * Update cache metrics
 */
export function updateCacheMetrics(size: number, hitRate: number): void {
  metrics.setGauge(Metric.CACHE_SIZE, size);
  metrics.setGauge(Metric.CACHE_HIT_RATE, hitRate);
}

/**
 * Create a timer for measuring duration
 */
export function startTimer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}
