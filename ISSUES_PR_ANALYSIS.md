# Open Issues & PRs Analysis and Implementation Plan

**Generated:** December 26, 2025
**Total Open Issues:** 12
**Total Open PRs:** 13

---

## Executive Summary

The repository has a significant backlog of **13 open PRs** and **12 open issues**. Many PRs address the same underlying problems (WASM loading) with conflicting approaches. The sprint issues (#45-#50) are well-structured but represent future work. The critical priority should be:

1. **Resolve WASM infrastructure conflicts** (blocking everything)
2. **Merge ready PRs** (reference data additions)
3. **Address tech debt** (Node.js version, geocoding)
4. **Then proceed with sprint work**

---

## Critical Analysis: WASM Loading PRs (Conflicting Approaches)

### The Problem
There are **7 PRs** all attempting to fix WASM loading issues, but they use **conflicting approaches**:

| PR | Approach | Status |
|----|----------|--------|
| #30 | Filesystem path resolution with fallbacks | Conflicts with HTTP approach |
| #31 | Dynamic imports for Node.js modules | Complementary fix |
| #33 | Error handling + retry logic | Complementary fix |
| #36 | HTTP URL loading (recommended) | Best approach |
| #37 | Race condition mutex pattern | Complementary fix |
| #38 | Error handling wrapper | Overlaps with #33 |
| #40 | WASM loading tests | Depends on approach decision |

### Current State in Codebase
The main branch uses **filesystem reading** (`ephemeris.ts:22-32`):
```typescript
const wasmPath = path.join(process.cwd(), 'public', 'swisseph.wasm');
const wasmBuffer = readFileSync(wasmPath);
const wasmBase64 = wasmBuffer.toString('base64');
```

### Recommendation: Consolidate WASM PRs

**MERGE ORDER:**
1. **PR #36** (HTTP URL loading) - Best approach, eliminates fs dependency
2. **PR #37** (Race condition fix) - Apply mutex pattern to new HTTP approach
3. **PR #38** (Error handling) - Add error handling to the consolidated solution
4. **PR #31** - No longer needed if #36 is adopted (removes fs entirely)
5. **PR #33** - Overlaps with #38, close as duplicate
6. **PR #30** - Close, superseded by #36

**CLOSE:**
- PR #30 (superseded by HTTP approach)
- PR #33 (duplicate of #38)

**THEN:**
- Update PR #40 (WASM tests) to test the HTTP approach

---

## PR Status Matrix

### Ready to Merge (Low Risk)

| PR | Title | Status | Recommendation |
|----|-------|--------|----------------|
| **#26** | Add center and type interpretations | Ready | **MERGE** - Pure data addition |
| **#27** | Complete 192+ incarnation crosses | Ready | **MERGE** - Pure data addition |
| **#41** | Gate line descriptions infrastructure | Ready | **MERGE** - Foundation for Sprint 5 |

### Needs Work Before Merge

| PR | Title | Issue | Action Required |
|----|-------|-------|-----------------|
| **#34** | CosmicBirthForm tests | Timezone bug found | Fix timezone conversion first |
| **#35** | Date/time validation | Timezone bug | Fix timezone handling first |
| **#39** | Node.js 22.x upgrade | Missing @types/node update | Update @types/node to 22.x |

### Needs Architectural Decision

| PR | Title | Decision Needed |
|----|-------|-----------------|
| **#36, #37, #38, #30, #31, #33** | WASM loading fixes | Choose HTTP vs filesystem approach |
| **#40** | WASM tests | Depends on approach chosen above |

---

## Issue Analysis

### Critical/Blocking Issues

| Issue | Title | Status | Recommendation |
|-------|-------|--------|----------------|
| **#19** | Node.js 22.x required by sweph-wasm | PR #39 exists | Merge PR #39 after adding @types/node update |
| **#20** | WASM loading tests missing | PR #40 exists | Merge after WASM approach is finalized |

### Tech Debt (Should Do Soon)

| Issue | Title | Priority | Recommendation |
|-------|-------|----------|----------------|
| **#42** | Replace Nominatim geocoding | Medium | Mapbox recommended; schedule for Sprint 4 |

### Reference Data Issues (Sprint 5 Work)

| Issue | Title | Status | PRs Available |
|-------|-------|--------|---------------|
| **#23** | Complete 192+ incarnation crosses | PR #27 exists | **MERGE PR #27** |
| **#24** | Add gate line descriptions | PR #41 exists | **MERGE PR #41** |
| **#25** | Add center/type interpretations | PR #26 exists | **MERGE PR #26** |

### Sprint Issues (Future Work)

| Issue | Sprint | Dependencies | Start When |
|-------|--------|--------------|------------|
| **#45** | Sprint 1: API Completion | None | After WASM is stable |
| **#46** | Sprint 2: AI Integration | Sprint 1 complete | After Sprint 1 |
| **#47** | Sprint 3: Visual Bodygraph | Can parallel Sprint 2 | After Sprint 1 |
| **#48** | Sprint 4: Polish & Scale | Sprints 1-3 complete | After core features |
| **#49** | Sprint 5: Reference Data | None (async) | Anytime (data work) |
| **#50** | Sprint 6: Practitioner Features | All prior sprints | Last |

---

## Dependency Graph

```
                    BLOCKING
                       │
           ┌───────────┴───────────┐
           │                       │
    Issue #19              WASM PR Conflicts
    Node.js 22.x           (#30,31,33,36,37,38)
           │                       │
        PR #39              Choose approach
           │                       │
           └───────────┬───────────┘
                       │
                       ▼
              WASM Tests (#20, PR #40)
                       │
                       ▼
            ┌──────────────────────┐
            │   READY TO MERGE     │
            ├──────────────────────┤
            │ PR #26 (centers/types)│
            │ PR #27 (crosses)      │
            │ PR #41 (gate lines)   │
            └──────────────────────┘
                       │
                       ▼
              Sprint 1: API Work (#45)
                       │
           ┌───────────┴───────────┐
           │                       │
    Sprint 2: AI (#46)    Sprint 3: Visual (#47)
           │                       │
           └───────────┬───────────┘
                       │
                       ▼
              Sprint 4: Polish (#48)
                       │
                       ▼
              Sprint 6: Practitioner (#50)

    [ASYNC - Can run anytime]
              Sprint 5: Reference Data (#49)
```

---

## Recommended Implementation Plan

### Phase 1: Clean Up (Immediate)

**Day 1-2: Resolve WASM Conflicts**

1. **Decision:** Adopt HTTP-based WASM loading (PR #36 approach)
   - Better performance (CDN caching)
   - Simpler (no fs dependency)
   - Works in serverless

2. **Create consolidated WASM PR:**
   - Take PR #36 as base
   - Add mutex pattern from PR #37
   - Add error handling from PR #38
   - Close PRs #30, #31, #33 as superseded

3. **Update PR #40** to test HTTP approach

**Day 3: Node.js Upgrade**

1. Update PR #39:
   - Add `@types/node: ^22.0.0` to devDependencies
   - Update GitHub Actions workflows
   - Run full test suite

2. Merge PR #39

**Day 4: Merge Ready PRs**

1. **Merge PR #26** - Center/type interpretations
2. **Merge PR #27** - Incarnation crosses (closes #23)
3. **Merge PR #41** - Gate line infrastructure (closes #24)

### Phase 2: Fix Timezone Issues (Before Sprint Work)

PRs #34 and #35 found a **critical timezone bug** in `CosmicBirthForm`:

> The code creates dates in the browser's local timezone rather than the selected location's timezone.

**Required Fix:**
1. Install `date-fns-tz`
2. Use `zonedTimeToUtc` correctly with the birth location timezone
3. Update tests to verify timezone handling
4. Then merge PRs #34 and #35

### Phase 3: Sprint Execution

Following the development plan order:

| Week | Sprint | Issues to Close |
|------|--------|-----------------|
| 1-2 | Sprint 1: APIs | #45 |
| 3-4 | Sprint 2: AI + Sprint 3: Visual (parallel) | #46, #47 |
| 5 | Sprint 4: Polish | #48, #42 (geocoding) |
| Ongoing | Sprint 5: Reference Data | #49 |
| 6+ | Sprint 6: Practitioner | #50 |

---

## Issues to Close Without Action

None identified. All issues are valid and should be addressed.

---

## Issues to Delay

| Issue | Reason | Delay Until |
|-------|--------|-------------|
| **#50** Sprint 6: Practitioner | Low priority, high effort | After all core features |
| **#42** Nominatim replacement | Works, just rate-limited | Sprint 4 (polish phase) |

---

## Summary Action Items

### Immediate (This Week)

1. [ ] **Decide:** HTTP vs filesystem for WASM loading
2. [ ] **Create:** Consolidated WASM PR combining #36 + #37 + #38
3. [ ] **Close:** PRs #30, #31, #33 as superseded
4. [ ] **Update:** PR #39 with @types/node 22.x
5. [ ] **Merge:** PR #39 (Node.js upgrade)
6. [ ] **Merge:** PR #26, #27, #41 (reference data)

### Next Week

7. [ ] **Fix:** Timezone bug in CosmicBirthForm
8. [ ] **Merge:** PRs #34, #35 after timezone fix
9. [ ] **Begin:** Sprint 1 API work (#45)

### Ongoing

10. [ ] Execute sprints per development plan
11. [ ] Close sprint issues as completed
12. [ ] Address tech debt (#42) in Sprint 4
