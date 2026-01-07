# Operational Runbooks

This document contains runbooks for responding to common operational issues with the Intangible Me platform.

## Table of Contents

1. [Alert Response Procedures](#alert-response-procedures)
2. [Incident Classification](#incident-classification)
3. [Common Issues & Resolutions](#common-issues--resolutions)
4. [Escalation Procedures](#escalation-procedures)

---

## Alert Response Procedures

### Critical Alerts

#### `calculation_errors_spike`

**Severity**: Critical
**Description**: High rate of calculation errors detected (>10 in 5 minutes)

**Immediate Actions**:
1. Check `/api/health/deep` for system status
2. Review recent deployments for calculation logic changes
3. Check PostHog for error details and stack traces
4. Verify ephemeris WASM is loaded correctly

**Investigation**:
```bash
# Check recent errors in logs
grep "calculation_error" logs/app.log | tail -50

# Verify ephemeris health
curl https://your-domain.com/api/health/ready | jq '.checks.ephemeris'
```

**Resolution**:
- If WASM failed to load: Restart the application
- If calculation logic bug: Rollback to last known good version
- If input validation issue: Add validation and notify users

---

#### `database_down`

**Severity**: Critical
**Description**: Database health check failing

**Immediate Actions**:
1. Check Neon dashboard for database status
2. Verify DATABASE_URL environment variable
3. Check for connection pool exhaustion

**Investigation**:
```bash
# Test database connection
curl https://your-domain.com/api/health/ready | jq '.checks.database'

# Check Vercel function logs for connection errors
vercel logs --filter "database"
```

**Resolution**:
- If Neon outage: Wait for provider recovery, enable read-from-cache fallback
- If connection pool exhausted: Restart application, increase pool size
- If credentials issue: Verify and update DATABASE_URL in Vercel

---

#### `ephemeris_failed`

**Severity**: Critical
**Description**: Ephemeris WASM failed to load or calculate

**Immediate Actions**:
1. Check if `/public/swisseph.wasm` is accessible
2. Verify WASM file integrity
3. Check memory usage (WASM requires ~5MB)

**Investigation**:
```bash
# Check WASM file accessibility
curl -I https://your-domain.com/swisseph.wasm

# Check application memory
curl https://your-domain.com/api/health/deep | jq '.system.memory_usage_mb'
```

**Resolution**:
- If file missing: Redeploy with WASM file
- If memory issue: Increase Vercel function memory limit
- If initialization error: Check for WASM loading race conditions

---

#### `memory_critical`

**Severity**: Critical
**Description**: Memory usage above 95% of heap limit

**Immediate Actions**:
1. Identify memory-intensive operations
2. Check for memory leaks in recent code
3. Consider scaling or restarting

**Investigation**:
```bash
# Get detailed memory breakdown
curl https://your-domain.com/api/health/deep | jq '.system'
```

**Resolution**:
- Short-term: Restart application to clear memory
- Long-term: Profile and fix memory leaks, increase memory allocation

---

### Warning Alerts

#### `high_latency`

**Severity**: Warning
**Description**: API P95 latency above 1 second for 10+ minutes

**Investigation**:
1. Check `/api/metrics` for latency distribution
2. Identify slow endpoints
3. Check database query times
4. Review recent traffic patterns

**Resolution**:
- If database slow: Add indexes, optimize queries
- If calculation slow: Profile ephemeris operations
- If traffic spike: Enable rate limiting, scale up

---

#### `rate_limit_spike`

**Severity**: Warning
**Description**: >100 rate limit hits in 5 minutes

**Investigation**:
1. Check PostHog for source IPs/users
2. Look for scraping patterns
3. Review legitimate traffic spikes

**Resolution**:
- If abuse: Block IP/user, consider CAPTCHA
- If legitimate: Increase rate limits for authenticated users
- If bug: Fix client-side retry logic

---

## Incident Classification

| Severity | Impact | Response Time | Examples |
|----------|--------|---------------|----------|
| **P1 - Critical** | Service down, all users affected | 15 minutes | Database down, WASM failed |
| **P2 - High** | Major feature broken | 1 hour | Chart calculation failing |
| **P3 - Medium** | Degraded performance | 4 hours | High latency, rate limiting |
| **P4 - Low** | Minor issues | 24 hours | UI glitches, non-critical errors |

---

## Common Issues & Resolutions

### Issue: Charts not calculating

**Symptoms**: Users report "calculation failed" errors

**Diagnosis**:
1. Check `/api/health/ready` - ephemeris status
2. Review error logs for specific failures
3. Test with known valid birth data

**Common Causes**:
- Invalid date format (must be ISO 8601)
- Coordinates out of range
- WASM initialization timeout

**Resolution**:
```typescript
// Validate input before calculation
const schema = z.object({
  datetime_utc: z.string().datetime(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
```

---

### Issue: AI readings not generating

**Symptoms**: AI reading requests timeout or fail

**Diagnosis**:
1. Check Gemini API status
2. Verify API key is valid
3. Check rate limits

**Common Causes**:
- API quota exceeded
- Invalid API key
- Model overloaded

**Resolution**:
- Implement retry with exponential backoff
- Add fallback to cached readings
- Monitor token usage in PostHog

---

### Issue: Slow geocoding

**Symptoms**: Location search taking >5 seconds

**Diagnosis**:
1. Check Nominatim rate limit status
2. Verify cache is working
3. Check network latency

**Resolution**:
- Ensure caching is enabled (check `X-Cache` header)
- Implement client-side debouncing
- Consider alternative geocoding service

---

## Escalation Procedures

### Level 1: On-Call Engineer
- Respond to all alerts within SLA
- Follow runbook procedures
- Escalate if unable to resolve in 30 minutes

### Level 2: Senior Engineer
- Complex debugging
- Code changes requiring review
- Infrastructure decisions

### Level 3: Engineering Lead
- Major incidents affecting all users
- Decisions requiring stakeholder communication
- Post-incident reviews

---

## Useful Commands

```bash
# Check overall health
curl https://your-domain.com/api/health/deep | jq

# Get current metrics
curl https://your-domain.com/api/metrics

# Test chart calculation
curl -X POST https://your-domain.com/api/chart \
  -H "Content-Type: application/json" \
  -d '{"datetime_utc":"1990-06-15T12:00:00Z","lat":40.7128,"lng":-74.006}'

# Check PostHog for recent errors
# Visit: https://app.posthog.com/events?event=$exception

# View Vercel function logs
vercel logs --follow
```

---

## Post-Incident Checklist

After resolving any P1 or P2 incident:

- [ ] Document timeline of events
- [ ] Identify root cause
- [ ] Create follow-up tasks for prevention
- [ ] Update runbooks if needed
- [ ] Schedule post-mortem meeting
- [ ] Communicate resolution to stakeholders
