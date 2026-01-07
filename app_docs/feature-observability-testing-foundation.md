# Observability and Testing Foundation

**Date:** 2026-01-07
**Specification:** specs/OBSERVABILITY_AND_TESTING_PLAN.md

## Overview

A comprehensive observability and testing foundation for the Human Design calculation engine. This implementation provides structured logging, metrics collection, error tracking via PostHog, audit trails, alerting rules, and a robust test suite with verified chart fixtures. The system is designed to handle thousands of requests per hour while maintaining full traceability and validation of all calculations.

## What Was Built

- **Structured Logging System** - Pino-based logging with correlation IDs for request tracing
- **PostHog Integration** - Server and client-side analytics, error tracking, and feature flags
- **Health Check Endpoints** - Liveness, readiness, and deep diagnostic checks
- **Prometheus Metrics** - Request latency, calculation performance, and error tracking
- **Audit System** - Calculation versioning, input/output hashing, and integrity verification
- **Alerting Rules** - SLA targets, thresholds, and escalation procedures
- **Test Infrastructure** - 25+ verified chart fixtures with comprehensive unit and integration tests
- **Operational Runbooks** - Incident response procedures for common issues

## Technical Implementation

### Files Modified

- `src/lib/observability/logger.ts`: Pino structured logging with dev/prod formatting
- `src/lib/observability/correlation.ts`: AsyncLocalStorage-based request context and correlation IDs
- `src/lib/observability/posthog-server.ts`: Server-side PostHog client for analytics and errors
- `src/lib/observability/posthog-client.tsx`: Client-side PostHog provider and initialization
- `src/lib/observability/events.ts`: Error categories, operation definitions, and metric names
- `src/lib/observability/metrics.ts`: Prometheus-compatible metrics registry and collection
- `src/lib/observability/audit.ts`: Calculation versioning, hashing, and integrity verification
- `src/lib/observability/alerting.ts`: Alert thresholds, SLA targets, and alert rules
- `src/lib/observability/index.ts`: Unified exports for all observability modules
- `src/app/api/health/route.ts`: Basic liveness check endpoint
- `src/app/api/health/ready/route.ts`: Readiness check (database + ephemeris)
- `src/app/api/health/deep/route.ts`: Full diagnostic health check
- `src/app/api/metrics/route.ts`: Prometheus-format metrics endpoint
- `tests/fixtures/verified-charts.ts`: 25+ verified Human Design chart fixtures
- `tests/unit/calculation-engine.test.ts`: Unit tests for calculation logic (38 tests)
- `tests/unit/verified-charts.test.ts`: Fixture validation tests
- `tests/integration/api.test.ts`: API endpoint integration tests
- `docs/RUNBOOKS.md`: Operational runbooks for incident response

### Key Changes

- **Request Correlation**: Every request gets a unique correlation ID (X-Correlation-ID header or UUID) propagated through AsyncLocalStorage for full request tracing
- **Calculation Versioning**: All calculations are tagged with `CALCULATION_VERSION` (1.0.0) for traceability when algorithms change
- **Integrity Verification**: Input/output hashes (SHA-256) allow verification that stored results match recalculated values
- **PostHog Events**: Chart calculations and AI generations automatically capture analytics with calculation metadata
- **Multi-tier Health Checks**: `/api/health` (liveness), `/api/health/ready` (readiness), `/api/health/deep` (full diagnostics)

## How to Use

### Logging

```typescript
import { createLogger, getCorrelationId } from '@/lib/observability';

// Create a context-aware logger
const log = createLogger({ module: 'my-feature' });

log.info({ data: 'value' }, 'Operation completed');
log.error({ err: error }, 'Operation failed');
```

### Metrics

```typescript
import { metrics, recordChartCalculation, startTimer } from '@/lib/observability/metrics';

// Record a chart calculation
const stopTimer = startTimer();
// ... perform calculation
recordChartCalculation('Generator', stopTimer());

// Manual metrics
metrics.incrementCounter('my_operation_total', { status: 'success' });
```

### PostHog Analytics

```typescript
import { captureChartCalculation, captureError } from '@/lib/observability/posthog-server';

// Track a chart calculation
captureChartCalculation(userId, {
  type: chart.type,
  authority: chart.authority,
  profile: chart.profile,
  calculationMs: duration
});

// Track an error
captureError(userId, error, { endpoint: '/api/chart' });
```

### Audit Logging

```typescript
import { auditChartCalculation, verifyCalculationIntegrity } from '@/lib/observability/audit';

// Create audit entry
const audit = auditChartCalculation(birthData, chartResult, calculationMs);
// audit.inputHash, audit.outputHash, audit.calculationVersion

// Verify integrity
const isValid = verifyCalculationIntegrity(storedHash, recalculatedResult);
```

## Configuration

### Environment Variables

```bash
# Logging
LOG_LEVEL=info          # debug, info, warn, error

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Feature Flags (via PostHog)
# - new_calculation_algorithm
# - enhanced_logging
```

### Health Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/api/health` | Liveness probe | 200 OK if server running |
| `/api/health/ready` | Readiness probe | 200 OK if DB + ephemeris ready |
| `/api/health/deep` | Full diagnostics | Detailed status of all components |
| `/api/metrics` | Prometheus metrics | Text format metrics |

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm test -- tests/unit/

# Run integration tests only
npm test -- tests/integration/

# Run with coverage
npm test -- --coverage
```

### Verified Chart Fixtures

The test suite includes 25+ verified Human Design charts covering:
- All 5 Types: Manifestor, Generator, Manifesting Generator, Projector, Reflector
- All 7 Authorities: Emotional, Sacral, Splenic, Ego, Self-Projected, Mental, Lunar
- All 12 Profiles: 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 5/1, 5/2, 6/2, 6/3

Fixtures include celebrity charts with publicly verified data (Richard Branson, Oprah Winfrey, etc.) for validation.

## Alerting Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | 1% | 5% |
| Chart Calculation P95 | 500ms | 1000ms |
| API Latency P95 | 200ms | 500ms |
| Ephemeris Failures | 1/min | 5/min |

### SLA Targets

- **Uptime**: 99.9%
- **Chart Calculation P95**: 500ms
- **API Latency P95**: 200ms
- **Error Rate**: < 0.1%

## Notes

- The calculation engine version (`CALCULATION_VERSION`) should be incremented whenever the algorithm changes
- PostHog has 1M free events/month - suitable for production scale
- Metrics endpoint requires authentication header in production
- Runbooks are located at `docs/RUNBOOKS.md` for incident response procedures
- All correlation IDs are propagated via `X-Correlation-ID` header for distributed tracing
