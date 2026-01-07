/**
 * Alerting Configuration
 *
 * Defines alerting rules and thresholds for monitoring.
 * These can be used to configure PostHog alerts or external monitoring.
 */

// ============================================================================
// ALERT THRESHOLDS
// ============================================================================

export const AlertThresholds = {
  // Error thresholds
  ERROR_RATE_WARNING: 0.01, // 1% error rate
  ERROR_RATE_CRITICAL: 0.05, // 5% error rate
  ERROR_SPIKE_COUNT: 10, // Errors in 5 minutes
  ERROR_SPIKE_WINDOW_MS: 5 * 60 * 1000, // 5 minutes

  // Latency thresholds (milliseconds)
  CHART_CALCULATION_P95_WARNING: 500,
  CHART_CALCULATION_P95_CRITICAL: 1000,
  API_RESPONSE_P95_WARNING: 1000,
  API_RESPONSE_P95_CRITICAL: 2000,
  DATABASE_QUERY_P95_WARNING: 100,
  DATABASE_QUERY_P95_CRITICAL: 500,

  // Rate limiting
  RATE_LIMIT_SPIKE_COUNT: 100, // Hits in 5 minutes
  RATE_LIMIT_SPIKE_WINDOW_MS: 5 * 60 * 1000,

  // System health
  MEMORY_USAGE_WARNING: 0.8, // 80% heap usage
  MEMORY_USAGE_CRITICAL: 0.95, // 95% heap usage

  // Availability
  HEALTH_CHECK_TIMEOUT_MS: 5000,
  CONSECUTIVE_FAILURES_CRITICAL: 3,
} as const;

// ============================================================================
// ALERT DEFINITIONS
// ============================================================================

export interface AlertRule {
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  condition: string;
  threshold: number | string;
  window?: string;
  action: 'slack' | 'email' | 'pagerduty' | 'posthog';
}

export const AlertRules: AlertRule[] = [
  // Critical Alerts (Page immediately)
  {
    name: 'calculation_errors_spike',
    description: 'High rate of calculation errors detected',
    severity: 'critical',
    condition: 'errors_total{category="calculation"} > threshold in window',
    threshold: AlertThresholds.ERROR_SPIKE_COUNT,
    window: '5m',
    action: 'pagerduty',
  },
  {
    name: 'database_down',
    description: 'Database health check failing',
    severity: 'critical',
    condition: 'health_check.database.status != "up"',
    threshold: 'down',
    action: 'pagerduty',
  },
  {
    name: 'ephemeris_failed',
    description: 'Ephemeris WASM failed to load or calculate',
    severity: 'critical',
    condition: 'health_check.ephemeris.status != "up"',
    threshold: 'down',
    action: 'pagerduty',
  },
  {
    name: 'memory_critical',
    description: 'Memory usage critically high',
    severity: 'critical',
    condition: 'process_memory_heap_percent > threshold',
    threshold: AlertThresholds.MEMORY_USAGE_CRITICAL,
    action: 'pagerduty',
  },

  // Warning Alerts (Slack notification)
  {
    name: 'high_latency',
    description: 'API response latency elevated',
    severity: 'warning',
    condition: 'api_request_duration_ms_p95 > threshold for 10m',
    threshold: AlertThresholds.API_RESPONSE_P95_WARNING,
    window: '10m',
    action: 'slack',
  },
  {
    name: 'error_rate_elevated',
    description: 'Error rate above normal threshold',
    severity: 'warning',
    condition: 'error_rate > threshold for 15m',
    threshold: AlertThresholds.ERROR_RATE_WARNING,
    window: '15m',
    action: 'slack',
  },
  {
    name: 'rate_limit_spike',
    description: 'Unusual number of rate limit hits',
    severity: 'warning',
    condition: 'rate_limit_hits_total > threshold in window',
    threshold: AlertThresholds.RATE_LIMIT_SPIKE_COUNT,
    window: '5m',
    action: 'slack',
  },
  {
    name: 'memory_warning',
    description: 'Memory usage approaching limit',
    severity: 'warning',
    condition: 'process_memory_heap_percent > threshold',
    threshold: AlertThresholds.MEMORY_USAGE_WARNING,
    action: 'slack',
  },
  {
    name: 'calculation_slow',
    description: 'Chart calculations taking longer than expected',
    severity: 'warning',
    condition: 'chart_calculation_duration_ms_p95 > threshold',
    threshold: AlertThresholds.CHART_CALCULATION_P95_WARNING,
    window: '10m',
    action: 'slack',
  },

  // Info Alerts (Logging only)
  {
    name: 'new_error_type',
    description: 'New error category detected',
    severity: 'info',
    condition: 'new_error_category_detected',
    threshold: 'any',
    action: 'posthog',
  },
];

// ============================================================================
// SLA DEFINITIONS
// ============================================================================

export const SLATargets = {
  // Availability
  uptime: {
    target: 0.999, // 99.9%
    alertThreshold: 0.995, // Alert if below 99.5%
    window: '30d',
  },

  // Latency
  chartCalculationP95: {
    target: 200, // 200ms
    alertThreshold: 500, // Alert if above 500ms
    unit: 'ms',
  },
  apiResponseP95: {
    target: 500, // 500ms
    alertThreshold: 1000, // Alert if above 1s
    unit: 'ms',
  },

  // Error Rate
  errorRate: {
    target: 0.001, // 0.1%
    alertThreshold: 0.01, // Alert if above 1%
    window: '1h',
  },

  // Throughput (for capacity planning)
  minChartsPerHour: {
    target: 1000,
    alertThreshold: 100, // Alert if below (indicates possible issue)
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if current metrics violate any alert thresholds
 */
export function checkAlertConditions(currentMetrics: {
  errorRate?: number;
  p95Latency?: number;
  memoryUsage?: number;
  rateLimitHits?: number;
}): AlertRule[] {
  const triggeredAlerts: AlertRule[] = [];

  if (
    currentMetrics.errorRate !== undefined &&
    currentMetrics.errorRate > AlertThresholds.ERROR_RATE_CRITICAL
  ) {
    triggeredAlerts.push(
      AlertRules.find((r) => r.name === 'error_rate_elevated')!
    );
  }

  if (
    currentMetrics.p95Latency !== undefined &&
    currentMetrics.p95Latency > AlertThresholds.API_RESPONSE_P95_CRITICAL
  ) {
    triggeredAlerts.push(AlertRules.find((r) => r.name === 'high_latency')!);
  }

  if (
    currentMetrics.memoryUsage !== undefined &&
    currentMetrics.memoryUsage > AlertThresholds.MEMORY_USAGE_CRITICAL
  ) {
    triggeredAlerts.push(AlertRules.find((r) => r.name === 'memory_critical')!);
  }

  return triggeredAlerts.filter(Boolean);
}

/**
 * Get PostHog alert configuration for export
 */
export function getPostHogAlertConfig(): object[] {
  return AlertRules.filter((r) => r.action === 'posthog').map((rule) => ({
    name: rule.name,
    description: rule.description,
    threshold: rule.threshold,
    condition: rule.condition,
  }));
}
