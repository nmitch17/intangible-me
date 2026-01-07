# Observability & Testing Foundation Plan

## Executive Summary

This document outlines a comprehensive observability and testing strategy for the Intangible Me Human Design calculation engine. This system will handle thousands of requests per hour and serve as the foundation for a multi-million dollar business.

**Current State**: Minimal observability (console.error only), basic test coverage, no production monitoring.

**Target State**: Enterprise-grade observability with full test coverage, verified calculation accuracy, and real-time monitoring.

---

## Part 1: Comprehensive Test Suite

### 1.1 Test Categories

#### A. Unit Tests (Calculation Engine)

**Ephemeris Tests** (`tests/unit/ephemeris.test.ts`)
- Julian day conversion accuracy (multiple date ranges)
- Planet position calculation for all 13 celestial bodies
- Design time calculation (88° solar arc)
- Edge cases: leap years, century boundaries, timezone transitions
- Performance benchmarks (< 50ms per calculation)

**Mandala Mapping Tests** (`tests/unit/mandala.test.ts`)
- All 64 gates map to correct degree ranges
- All 6 lines per gate (384 total line positions)
- Boundary conditions (gate transitions)
- Start codon (Gate 41 at 302° Aquarius)

**Chart Derivation Tests** (`tests/unit/chart.test.ts`)
- Type derivation logic (all 5 types)
- Authority hierarchy (all 7 authorities)
- Definition calculation (Single/Split/Triple/Quadruple)
- Profile calculation (12 profiles)
- Incarnation cross lookup (192+ crosses)
- Channel detection (36 channels)
- Center definition logic (9 centers)

#### B. Integration Tests (API Endpoints)

**Chart API** (`tests/integration/chart-api.test.ts`)
- Valid request returns complete chart
- Invalid datetime returns 400
- Invalid coordinates return 400
- Rate limiting enforced
- Response time < 500ms

**Transit API** (`tests/integration/transit-api.test.ts`)
- Current transits calculated correctly
- Natal overlay calculates temporary channels
- Historical transits work

**Composite API** (`tests/integration/composite-api.test.ts`)
- Two chart comparison works
- Electromagnetic channels detected
- Compatibility score calculated

**Reference APIs** (`tests/integration/reference-api.test.ts`)
- Gates endpoint returns all 64 gates
- Channels endpoint returns all 36 channels
- Pagination works correctly
- Filtering works correctly

#### C. Verified Chart Fixtures (CRITICAL)

**Strategy for Gathering Known Valid Charts:**

1. **Celebrity/Public Figure Charts** (verifiable birth data)
   - Ra Uru Hu (Human Design founder) - 4/6 Manifesting Generator
   - Alan Krakower (Ra's birth name): April 9, 1948, Montreal, Canada
   - Other public figures with known HD types

2. **Cross-Validation Sources**
   - Jovian Archive official calculator
   - MyBodyGraph.com
   - GeneticMatrix.com
   - Human.Design official app

3. **Community-Verified Charts**
   - HD practitioners with verified charts
   - Published case studies from HD literature

4. **Synthetic Test Cases** (mathematically constructed)
   - Birth data engineered to produce specific types
   - Edge case configurations (rare profiles, split definitions)

### 1.2 Verified Chart Fixture Schema

```typescript
interface VerifiedChartFixture {
  id: string;
  name: string;
  source: 'celebrity' | 'practitioner' | 'cross_validated' | 'synthetic';
  verification_sources: string[];
  birth_data: {
    datetime_utc: string;  // ISO 8601
    lat: number;
    lng: number;
    location: string;
    timezone: string;
  };
  expected: {
    type: HumanDesignType;
    strategy: Strategy;
    authority: Authority;
    profile: string;  // "4/6" format
    definition: Definition;
    defined_centers: CenterName[];
    undefined_centers: CenterName[];
    incarnation_cross: {
      name: string;
      type: CrossType;
      quarter: Quarter;
    };
    channels: string[];  // ["12-22", "1-8"] format
    personality_sun_gate: number;
    personality_earth_gate: number;
    design_sun_gate: number;
    design_earth_gate: number;
  };
  notes?: string;
  last_verified: string;  // ISO date
}
```

### 1.3 Minimum Verified Fixtures Required

| Category | Count | Purpose |
|----------|-------|---------|
| Each Type (5) | 3 each = 15 | Verify type derivation |
| Each Authority (7) | 2 each = 14 | Verify authority logic |
| Each Profile (12) | 1 each = 12 | Verify profile calculation |
| Each Definition (5) | 2 each = 10 | Verify definition logic |
| Each Cross Type (3) | 2 each = 6 | Verify cross calculation |
| Edge Cases | 10 | Boundary conditions |
| **Total Minimum** | **~50 fixtures** | Full coverage |

### 1.4 Test Commands

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific category
npm run test -- --grep "ephemeris"
npm run test -- --grep "verified-charts"

# Watch mode for development
npm run test:watch
```

---

## Part 2: Structured Logging

### 2.1 Logging Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   API Request   │────▶│  Logger Module  │────▶│   Log Output    │
│                 │     │  (Pino/Winston) │     │                 │
│ • correlation_id│     │ • Structured    │     │ • Console (dev) │
│ • request_id    │     │ • JSON format   │     │ • File (local)  │
│ • user_id       │     │ • Log levels    │     │ • Vercel (prod) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.2 Log Schema

```typescript
interface LogEntry {
  // Identification
  timestamp: string;        // ISO 8601
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  // Request Context
  correlation_id: string;   // UUID, propagated across all operations
  request_id: string;       // Unique per HTTP request
  user_id?: string;         // If authenticated
  session_id?: string;      // If session exists

  // Operation Context
  service: string;          // 'api' | 'calculation' | 'database' | 'ai'
  operation: string;        // 'calculateChart' | 'deriveType' | etc.

  // Content
  message: string;
  data?: Record<string, unknown>;

  // Performance
  duration_ms?: number;

  // Error Context (if applicable)
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };

  // Environment
  environment: string;      // 'development' | 'staging' | 'production'
  version: string;          // App version
}
```

### 2.3 Log Levels & Usage

| Level | When to Use | Example |
|-------|-------------|---------|
| `debug` | Detailed diagnostic info | Planet positions calculated |
| `info` | Normal operations | Chart calculated successfully |
| `warn` | Recoverable issues | Rate limit approaching |
| `error` | Operation failed | Chart calculation failed |
| `fatal` | System cannot continue | Database connection lost |

### 2.4 What to Log

**Always Log:**
- API request start/end with timing
- Chart calculation start/end with timing
- Authentication events (login, logout, failed attempts)
- Rate limit hits
- Database queries (in debug mode)
- External API calls (Nominatim, Gemini)
- Errors with full context

**Never Log:**
- Passwords or secrets
- Full API keys
- Personal birth data (hash or anonymize)
- Session tokens

---

## Part 3: Error Tracking, Analytics & Observability Platform

### 3.1 PostHog Integration

**Why PostHog (instead of Sentry):**
- **Generous Free Tier**: 1 million events/month free (vs Sentry's 5K errors)
- **All-in-One Platform**: Combines multiple tools we'd otherwise need separately
- **LLM Analytics**: Built-in tracking for AI/LLM usage (perfect for our Gemini integration)
- **Product Analytics**: User behavior, funnels, retention
- **Session Replay**: Debug user issues with recordings
- **Feature Flags**: Roll out changes safely
- **A/B Testing**: Experiment with UI/UX changes
- **Error Tracking**: Exception monitoring with stack traces
- **Web Analytics**: Privacy-friendly alternative to Google Analytics
- **Excellent Next.js Integration**: Official SDK with App Router support

**Installation:**
```bash
npm install posthog-js posthog-node
```

**Configuration:**
```typescript
// src/lib/observability/posthog.ts
import { PostHog } from 'posthog-node';

// Server-side client
export const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  flushAt: 1,  // Flush immediately in serverless
  flushInterval: 0,
});

// Client-side initialization in _app.tsx or layout.tsx
import posthog from 'posthog-js';
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
});
```

### 3.2 PostHog Event Categories

```typescript
// Custom events for Human Design platform
enum PostHogEvent {
  // Calculation Events
  CHART_CALCULATED = 'chart_calculated',
  TRANSIT_CALCULATED = 'transit_calculated',
  COMPOSITE_CALCULATED = 'composite_calculated',

  // AI Events (LLM Analytics)
  AI_READING_REQUESTED = 'ai_reading_requested',
  AI_READING_COMPLETED = 'ai_reading_completed',
  AI_READING_FAILED = 'ai_reading_failed',

  // User Journey Events
  CHART_SAVED = 'chart_saved',
  CHART_SHARED = 'chart_shared',
  READING_VIEWED = 'reading_viewed',

  // Error Events
  CALCULATION_ERROR = 'calculation_error',
  VALIDATION_ERROR = 'validation_error',
  API_ERROR = 'api_error',

  // Feature Usage
  FEATURE_USED = 'feature_used',
}

// Example usage
posthog.capture(PostHogEvent.CHART_CALCULATED, {
  type: 'generator',
  authority: 'sacral',
  profile: '4/6',
  calculation_time_ms: 45,
  $set: { last_chart_type: 'generator' },  // Update user properties
});
```

### 3.3 LLM Analytics Integration

PostHog's LLM analytics track AI usage automatically:

```typescript
// Track AI reading generation
posthog.capture('$ai_generation', {
  $ai_model: 'gemini-3-flash',
  $ai_provider: 'google',
  $ai_input_tokens: 1200,
  $ai_output_tokens: 850,
  $ai_latency_ms: 2300,
  $ai_success: true,

  // Custom properties
  chart_type: 'generator',
  reading_focus: 'authority',
});
```

### 3.4 Feature Flags for Safe Rollouts

```typescript
// Check feature flag before using new calculation logic
const useNewEphemeris = await posthog.isFeatureEnabled(
  'new-ephemeris-algorithm',
  userId
);

if (useNewEphemeris) {
  return calculateWithNewAlgorithm(birthData);
} else {
  return calculateWithLegacyAlgorithm(birthData);
}

// A/B test different UI layouts
const variant = await posthog.getFeatureFlag('chart-display-variant', userId);
// Returns: 'control' | 'bodygraph-3d' | 'bodygraph-classic'
```

### 3.5 Session Replay for Debugging

PostHog automatically records user sessions (with privacy controls):

```typescript
// Mask sensitive data
posthog.init(key, {
  session_recording: {
    maskAllInputs: true,
    maskTextContent: true,
    // Only record calculation flows
    recordHeaders: false,
    recordBody: false,
  },
});
```

### 3.6 Error Categories for Tracking

```typescript
enum ErrorCategory {
  // Calculation Errors
  EPHEMERIS_ERROR = 'ephemeris_error',
  GATE_MAPPING_ERROR = 'gate_mapping_error',
  TYPE_DERIVATION_ERROR = 'type_derivation_error',

  // Input Errors
  VALIDATION_ERROR = 'validation_error',
  INVALID_COORDINATES = 'invalid_coordinates',
  INVALID_DATETIME = 'invalid_datetime',

  // External Service Errors
  GEOCODE_ERROR = 'geocode_error',
  AI_SERVICE_ERROR = 'ai_service_error',
  DATABASE_ERROR = 'database_error',

  // System Errors
  RATE_LIMIT_ERROR = 'rate_limit_error',
  AUTH_ERROR = 'auth_error',
  UNKNOWN_ERROR = 'unknown_error',
}

// Capture errors in PostHog
posthog.capture('$exception', {
  $exception_message: error.message,
  $exception_type: ErrorCategory.EPHEMERIS_ERROR,
  $exception_stack_trace_raw: error.stack,
  birth_datetime: birthData.datetime_utc,  // Context for debugging
});
```

### 3.7 Distributed Tracing Spans

```
[HTTP Request] ─────────────────────────────────────────────────────▶
    │
    ├── [Validation] ────▶
    │
    ├── [Calculate Design Time] ──────────────────▶
    │       │
    │       └── [Binary Search] ──▶ ──▶ ──▶ ──▶
    │
    ├── [Calculate Activations] ──────────────────▶
    │       │
    │       ├── [Sun Position] ──▶
    │       ├── [Moon Position] ──▶
    │       └── [... 11 more planets] ──▶
    │
    ├── [Derive Chart] ──────────────────────────▶
    │       │
    │       ├── [Derive Type] ──▶
    │       ├── [Derive Authority] ──▶
    │       ├── [Calculate Definition] ──▶
    │       └── [Lookup Cross] ──▶
    │
    └── [Database Save] ──────▶
```

---

## Part 4: Metrics Collection

### 4.1 Key Metrics

#### Business Metrics
| Metric | Type | Description |
|--------|------|-------------|
| `charts_calculated_total` | Counter | Total charts calculated |
| `charts_by_type` | Counter | Charts calculated by HD type |
| `transits_calculated_total` | Counter | Total transit calculations |
| `composites_calculated_total` | Counter | Total composite analyses |
| `ai_readings_generated` | Counter | AI readings generated |
| `active_users` | Gauge | Currently active users |

#### Performance Metrics
| Metric | Type | Description |
|--------|------|-------------|
| `chart_calculation_duration_ms` | Histogram | Time to calculate chart |
| `ephemeris_calculation_duration_ms` | Histogram | Time for ephemeris lookup |
| `api_request_duration_ms` | Histogram | Total API response time |
| `database_query_duration_ms` | Histogram | Database query time |

#### Error Metrics
| Metric | Type | Description |
|--------|------|-------------|
| `errors_total` | Counter | Total errors by category |
| `validation_errors_total` | Counter | Input validation failures |
| `rate_limit_hits_total` | Counter | Rate limit violations |

#### System Metrics
| Metric | Type | Description |
|--------|------|-------------|
| `memory_usage_bytes` | Gauge | Memory consumption |
| `cache_hit_rate` | Gauge | Cache effectiveness |
| `cache_size` | Gauge | Items in cache |

### 4.2 Metrics Implementation

```typescript
// src/lib/observability/metrics.ts
interface MetricsService {
  // Counters
  incrementChartCalculations(type: HumanDesignType): void;
  incrementErrors(category: ErrorCategory): void;
  incrementRateLimitHits(): void;

  // Histograms
  recordCalculationDuration(operation: string, ms: number): void;
  recordApiDuration(endpoint: string, method: string, ms: number): void;

  // Gauges
  setActiveUsers(count: number): void;
  setCacheSize(size: number): void;

  // Export
  getMetrics(): Promise<string>;  // Prometheus format
}
```

---

## Part 5: Health Checks & Monitoring Endpoints

### 5.1 Health Check Endpoints

**GET `/api/health`** - Basic liveness check
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

**GET `/api/health/ready`** - Readiness check (all dependencies)
```json
{
  "status": "ready",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": {
    "database": { "status": "up", "latency_ms": 5 },
    "ephemeris": { "status": "up", "loaded": true },
    "cache": { "status": "up", "size": 45 }
  }
}
```

**GET `/api/health/deep`** - Full diagnostic (authenticated)
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime_seconds": 3600,
  "checks": {
    "database": { "status": "up", "latency_ms": 5, "connections": 3 },
    "ephemeris": { "status": "up", "wasm_loaded": true, "last_calculation_ms": 12 },
    "geocode_service": { "status": "up", "cache_hits": 150, "cache_misses": 20 },
    "ai_service": { "status": "up", "quota_remaining": 450 },
    "rate_limiter": { "status": "up", "active_limits": 12 }
  },
  "metrics_summary": {
    "charts_last_hour": 250,
    "errors_last_hour": 3,
    "avg_calculation_ms": 45,
    "p99_calculation_ms": 120
  }
}
```

### 5.2 Metrics Endpoint

**GET `/api/metrics`** - Prometheus-compatible metrics
```
# HELP charts_calculated_total Total number of charts calculated
# TYPE charts_calculated_total counter
charts_calculated_total{type="generator"} 1250
charts_calculated_total{type="projector"} 890
charts_calculated_total{type="manifestor"} 340
charts_calculated_total{type="manifesting_generator"} 720
charts_calculated_total{type="reflector"} 45

# HELP chart_calculation_duration_ms Time to calculate a chart
# TYPE chart_calculation_duration_ms histogram
chart_calculation_duration_ms_bucket{le="10"} 50
chart_calculation_duration_ms_bucket{le="25"} 200
chart_calculation_duration_ms_bucket{le="50"} 450
chart_calculation_duration_ms_bucket{le="100"} 495
chart_calculation_duration_ms_bucket{le="+Inf"} 500
```

---

## Part 6: What You're Not Thinking Of

### 6.1 Calculation Audit Trail

For a business handling financial decisions based on chart readings, you need an **immutable audit trail**:

```typescript
interface CalculationAudit {
  id: string;
  timestamp: string;

  // Input hash (for privacy)
  input_hash: string;  // SHA-256 of datetime + coords

  // Calculation metadata
  ephemeris_version: string;
  algorithm_version: string;
  wasm_checksum: string;

  // Results (can verify later)
  result_hash: string;  // SHA-256 of output

  // For debugging disputes
  raw_activations?: Activations;  // Store only if needed
}
```

### 6.2 Calculation Versioning

When you update calculation logic, you need to:
1. Version your algorithms
2. Store which version produced each chart
3. Be able to recalculate with old versions
4. Track differences between versions

```typescript
const CALCULATION_VERSION = '2.0.0';
const ALGORITHM_CHANGES = {
  '2.0.0': 'Updated gate boundary precision to 6 decimal places',
  '1.1.0': 'Fixed design time binary search edge case',
  '1.0.0': 'Initial release'
};
```

### 6.3 Data Integrity Checks

Periodic validation to catch drift:

```typescript
// Daily job: recalculate 100 random stored charts
// Alert if any differ from stored results
async function validateStoredCharts() {
  const samples = await db.select().from(charts).orderBy(sql`random()`).limit(100);

  for (const chart of samples) {
    const recalculated = await calculateChart(chart.birthData);
    const matches = deepEqual(recalculated, chart.chartData);

    if (!matches) {
      alert({
        severity: 'critical',
        message: 'Stored chart differs from recalculation',
        chart_id: chart.id,
        differences: diff(chart.chartData, recalculated)
      });
    }
  }
}
```

### 6.4 Rate Limiting Persistence

Current in-memory rate limiting resets on deploy. Need Redis or database-backed:

```typescript
// Move from in-memory Map to Redis
interface PersistentRateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
  increment(identifier: string): Promise<void>;
  reset(identifier: string): Promise<void>;
}
```

### 6.5 Request Replay & Debugging

For debugging production issues, capture enough to replay:

```typescript
interface RequestCapture {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;  // sanitized
  body: unknown;
  response_status: number;
  response_time_ms: number;
  // Can replay this exact request later
}
```

### 6.6 Graceful Degradation

What happens when dependencies fail?

| Dependency | Failure Mode | Degradation Strategy |
|------------|--------------|---------------------|
| Database | Connection lost | Read from cache, queue writes |
| Geocode API | Rate limited | Use cached results, return error |
| AI Service | Quota exceeded | Return pre-computed readings |
| Ephemeris WASM | Failed to load | Return 503, alert immediately |

### 6.7 Load Testing Strategy

Before going live with high traffic:

```bash
# Artillery or k6 load test scenarios
- Baseline: 100 req/min for 10 min
- Ramp-up: 10 → 1000 req/min over 10 min
- Sustained: 500 req/min for 30 min
- Spike: 2000 req/min burst for 1 min
- Soak: 200 req/min for 4 hours
```

### 6.8 Security Monitoring

For a business-critical API:

- **Anomaly detection**: Unusual request patterns
- **Abuse detection**: Scraping attempts, enumeration attacks
- **Auth monitoring**: Failed login spikes, credential stuffing
- **Input validation logging**: Track malformed requests

### 6.9 SLA Monitoring

Define and monitor SLAs:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | 99.9% | < 99.5% |
| Chart calculation P95 | < 200ms | > 500ms |
| API response P95 | < 500ms | > 1000ms |
| Error rate | < 0.1% | > 1% |

### 6.10 Cost Monitoring

Track per-operation costs:

- AI API calls (Gemini tokens)
- Database queries
- Vercel function invocations
- External API calls (Nominatim)

---

## Part 7: Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up structured logging (Pino)
- [ ] Add correlation ID middleware
- [ ] Create health check endpoints
- [ ] Set up PostHog (error tracking + analytics + feature flags)

### Phase 2: Testing (Week 2)
- [ ] Gather 50+ verified chart fixtures
- [ ] Implement comprehensive unit tests
- [ ] Add integration tests for all endpoints
- [ ] Set up CI/CD test pipeline

### Phase 3: Metrics (Week 3)
- [ ] Implement metrics collection
- [ ] Create metrics endpoint
- [ ] Add performance timing to all operations
- [ ] Set up dashboards (Grafana/Vercel)

### Phase 4: Production Hardening (Week 4)
- [ ] Implement audit logging
- [ ] Add calculation versioning
- [ ] Set up Redis for rate limiting
- [ ] Create load testing suite

### Phase 5: Monitoring & Alerting (Week 5)
- [ ] Configure PostHog alerts and dashboards
- [ ] Set up uptime monitoring
- [ ] Create SLA dashboards in PostHog
- [ ] Configure A/B tests for UI experiments
- [ ] Document runbooks

---

## Part 8: Technology Choices

| Need | Recommendation | Rationale |
|------|----------------|-----------|
| Logging | **Pino** | Fastest Node.js logger, JSON native |
| Observability Platform | **PostHog** | All-in-one: errors, analytics, feature flags, A/B tests |
| LLM Analytics | **PostHog** | Built-in AI/LLM tracking for Gemini usage |
| Product Analytics | **PostHog** | User funnels, retention, behavior tracking |
| Feature Flags | **PostHog** | Safe rollouts, included in platform |
| A/B Testing | **PostHog** | Experiment framework, included in platform |
| Session Replay | **PostHog** | Debug user issues with recordings |
| Load Testing | **k6** | Modern, scriptable, free |
| Test Framework | **Vitest** (existing) | Already configured |
| Rate Limit Store | **Upstash Redis** | Serverless, Vercel-native |

### PostHog Free Tier Limits (Generous)

| Feature | Free Limit |
|---------|------------|
| Events | 1 million/month |
| Session Replays | 5,000/month |
| Feature Flags | Unlimited |
| A/B Tests | Unlimited |
| Surveys | 250 responses/month |
| Data retention | 1 year |

---

## Part 9: File Structure

```
src/
├── lib/
│   ├── observability/
│   │   ├── index.ts           # Main exports
│   │   ├── logger.ts          # Pino logger setup
│   │   ├── posthog.ts         # PostHog client (server + client)
│   │   ├── events.ts          # Custom event definitions
│   │   ├── metrics.ts         # Metrics collection
│   │   ├── correlation.ts     # Correlation ID handling
│   │   └── audit.ts           # Audit logging
│   └── ...
├── app/
│   └── api/
│       ├── health/
│       │   └── route.ts       # Basic health
│       ├── health/
│       │   ├── ready/
│       │   │   └── route.ts   # Readiness check
│       │   └── deep/
│       │       └── route.ts   # Deep diagnostic
│       └── metrics/
│           └── route.ts       # Prometheus metrics
tests/
├── fixtures/
│   └── verified-charts.json   # 50+ verified chart fixtures
├── unit/
│   ├── ephemeris.test.ts
│   ├── mandala.test.ts
│   ├── chart.test.ts
│   └── type-derivation.test.ts
├── integration/
│   ├── chart-api.test.ts
│   ├── transit-api.test.ts
│   ├── composite-api.test.ts
│   └── reference-api.test.ts
├── validation/
│   └── verified-charts.test.ts  # Tests against fixtures
└── load/
    └── scenarios/
        ├── baseline.js
        ├── spike.js
        └── soak.js
```

---

## Appendix A: Verified Chart Sources

### Public Figures with Verified Birth Data
1. Ra Uru Hu - April 9, 1948, Montreal, Canada (4/6 MG)
2. [Research and add more celebrities with known HD types]

### Cross-Validation Websites
1. https://www.jovianarchive.com/get_your_chart
2. https://www.mybodygraph.com/
3. https://geneticmatrix.com/
4. https://humandesign.tools/

### HD Practitioner Networks
1. IHDS (International Human Design School) practitioners
2. BG5 Business Institute practitioners

---

## Appendix B: Alerting Rules

```yaml
# Critical (Page immediately)
- name: calculation_errors_spike
  condition: errors_total > 10 in 5 minutes
  severity: critical

- name: database_down
  condition: health_check.database != "up"
  severity: critical

- name: ephemeris_failed
  condition: health_check.ephemeris != "up"
  severity: critical

# Warning (Slack notification)
- name: high_latency
  condition: p95_latency > 500ms for 10 minutes
  severity: warning

- name: error_rate_elevated
  condition: error_rate > 1% for 15 minutes
  severity: warning

- name: rate_limit_spike
  condition: rate_limit_hits > 100 in 5 minutes
  severity: warning
```

---

## Summary

This plan provides:

1. **100% Test Coverage** on calculation logic with 50+ verified fixtures
2. **Structured Logging** with correlation IDs for request tracing
3. **PostHog Observability Platform**:
   - Error tracking with full context
   - Product analytics (funnels, retention, user behavior)
   - LLM analytics for AI reading generation
   - Feature flags for safe rollouts
   - A/B testing for experiments
   - Session replay for debugging
4. **Metrics Collection** for business and performance insights
5. **Health Monitoring** for operational visibility
6. **Audit Trail** for calculation accountability
7. **Load Testing** for capacity planning

**Why PostHog over Sentry:**
- 200x more free events (1M vs 5K)
- Consolidates 5+ tools into 1 platform
- Built-in LLM analytics for your AI features
- Feature flags included (would need LaunchDarkly otherwise)
- Product analytics included (would need Mixpanel/Amplitude otherwise)

For a system handling thousands of requests/hour for a multi-million dollar business, this foundation ensures reliability, debuggability, and accountability.

---

## Appendix C: PostHog Dashboards to Create

### 1. Operations Dashboard
- Charts calculated per hour/day
- Error rate trend
- API latency P50/P95/P99
- Rate limit hits
- Active users (real-time)

### 2. Product Analytics Dashboard
- User funnel: Landing → Chart Created → Reading Generated → Saved
- Retention cohorts (7-day, 30-day)
- Feature adoption rates
- Most calculated chart types
- Geographic distribution

### 3. AI/LLM Dashboard
- AI readings generated per day
- Token usage (input/output)
- AI latency distribution
- AI error rate
- Cost tracking (estimated from tokens)

### 4. Business Metrics Dashboard
- New users per day
- Charts per user
- Conversion rates
- Revenue attribution (if applicable)

---

## Appendix D: Environment Variables

```bash
# PostHog Configuration
POSTHOG_API_KEY=phc_xxxxxxxxxxxxx          # Server-side key (secret)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx  # Client-side key (public)
POSTHOG_HOST=https://us.i.posthog.com      # US or EU region
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Feature Flags (optional overrides for local dev)
POSTHOG_FEATURE_FLAGS_ENABLED=true

# Logging
LOG_LEVEL=info                              # debug | info | warn | error
LOG_FORMAT=json                             # json | pretty (dev only)

# Redis (for persistent rate limiting)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
```

---

## Appendix E: PostHog Feature Flags to Create

| Flag Name | Purpose | Default |
|-----------|---------|---------|
| `new-ephemeris-v2` | Roll out ephemeris algorithm updates | false |
| `ai-readings-enabled` | Kill switch for AI readings | true |
| `session-recording` | Enable session replay | true |
| `bodygraph-3d` | New 3D bodygraph visualization | false |
| `composite-charts` | Enable composite/relationship charts | true |
| `practitioner-mode` | Enable practitioner features | false |
