# Human Design App - Complete Development Plan

**Created:** December 2024
**Goal:** Complete all remaining PRD features

---

## Current Status Summary

| Category | Complete | Remaining |
|----------|----------|-----------|
| Core Calculation Engine | ✅ 100% | - |
| UI Components | ✅ 100% | - |
| Database & Auth | ✅ 100% | - |
| Reference Data | 🟡 60% | Crosses, Gate Lines, Gate Descriptions |
| API Endpoints | 🟡 50% | Transit, Composite, Reference, CopilotKit |
| AI Integration | 🔴 10% | CopilotKit frontend, Agent deployment |
| Visual Bodygraph | 🔴 0% | SVG/Canvas chart visualization |
| Validation Suite | 🔴 0% | Test against known charts |

---

## Phase 1: Complete Reference Data

### 1.1 Incarnation Crosses Database
**Priority:** High
**Effort:** Medium
**Files:** `src/lib/reference/crosses.ts`

**Current State:** ~18 entries defined
**Target:** 192+ unique crosses (64 gates × 4 positions × Right/Left/Juxtaposition)

**Implementation Steps:**
1. Create comprehensive cross data structure:
   ```typescript
   interface CrossReference {
     name: string;
     type: 'Right Angle' | 'Left Angle' | 'Juxtaposition';
     quarter: 'Initiation' | 'Civilization' | 'Duality' | 'Mutation';
     theme: string;
     gates: [number, number, number, number]; // Sun/Earth personality, Sun/Earth design
   }
   ```

2. Populate all 192+ crosses organized by quarter:
   - Quarter of Initiation (Purpose fulfilled through Mind)
   - Quarter of Civilization (Purpose fulfilled through Form)
   - Quarter of Duality (Purpose fulfilled through Bonding)
   - Quarter of Mutation (Purpose fulfilled through Transformation)

3. Add cross lookup by gate combination and by profile line

**Deliverable:** Complete `crosses.ts` with all incarnation crosses

---

### 1.2 Gate Lines Database
**Priority:** Medium
**Effort:** High
**Files:** `src/lib/reference/lines.ts` (new)

**Current State:** Not started
**Target:** 384 line descriptions (64 gates × 6 lines)

**Implementation Steps:**
1. Create new reference file structure:
   ```typescript
   interface GateLine {
     gate: number;
     line: number;
     name: string;
     keynote: string;
     description: string;
     exalted?: string;
     detriment?: string;
   }

   export const GATE_LINES: Record<string, GateLine> = {
     '1.1': { gate: 1, line: 1, name: 'Creation is Independent', ... },
     '1.2': { ... },
     // ... all 384 lines
   };
   ```

2. Populate with verified Human Design line data
3. Add lookup function: `getLine(gate: number, line: number)`
4. Integrate with chart response to include line details

**Deliverable:** Complete `lines.ts` with all 384 gate lines

---

### 1.3 Gate Descriptions Enhancement
**Priority:** Medium
**Effort:** Medium
**Files:** `src/lib/reference/gates.ts` (new or enhance mandala.ts)

**Current State:** Names only
**Target:** Full descriptions, keynotes, shadows, gifts

**Implementation Steps:**
1. Create comprehensive gate reference:
   ```typescript
   interface GateReference {
     id: number;
     name: string;
     center: Center;
     keynote: string;
     description: string;
     giftFrequency?: string;
     shadowFrequency?: string;
     siddhiFrequency?: string;
   }
   ```

2. Add Gene Keys integration data (optional enhancement)
3. Integrate with reference API endpoint

**Deliverable:** Complete gate reference data with descriptions

---

## Phase 2: API Endpoints

### 2.1 Transit API
**Priority:** High
**Effort:** Low
**Files:** `src/app/api/transit/route.ts` (new)

**Implementation Steps:**
1. Create transit calculation endpoint:
   ```typescript
   // POST /api/transit
   // Request: { datetime_utc?: string } (defaults to now)
   // Response: { datetime_utc, activations: { sun, moon, mercury, ... } }
   ```

2. Reuse existing ephemeris functions
3. Return current planetary gate/line positions
4. Add optional natal chart overlay for temporary channels

**Deliverable:** Working `/api/transit` endpoint

---

### 2.2 Composite Chart API
**Priority:** Medium
**Effort:** Medium
**Files:** `src/app/api/composite/route.ts` (new)

**Implementation Steps:**
1. Create composite calculation endpoint:
   ```typescript
   // POST /api/composite
   // Request: { chart_a: {...}, chart_b: {...} }
   // Response: {
   //   combined_channels,
   //   electromagnetic_connections,
   //   compromise_gates,
   //   dominance_gates,
   //   companionship_analysis
   // }
   ```

2. Implement partnership analysis logic:
   - **Electromagnetic Channels:** Where one person has one gate and the other has the connecting gate
   - **Dominance:** Both have the same gate (stronger activation dominates)
   - **Compromise:** Neither has the gate but it's activated in the composite
   - **Companionship:** Both have the channel (shared energy)

3. Return relationship dynamics and compatibility insights

**Deliverable:** Working `/api/composite` endpoint

---

### 2.3 Reference Data APIs
**Priority:** Medium
**Effort:** Low
**Files:**
- `src/app/api/reference/gates/route.ts` (new)
- `src/app/api/reference/channels/route.ts` (new)
- `src/app/api/reference/types/route.ts` (new)

**Implementation Steps:**
1. Create static reference endpoints:
   ```typescript
   // GET /api/reference/gates
   // GET /api/reference/gates/[id]
   // GET /api/reference/channels
   // GET /api/reference/channels/[gates]
   // GET /api/reference/types
   // GET /api/reference/types/[type]
   ```

2. Serve from existing reference data files
3. Add filtering and pagination for large datasets
4. Include OpenAPI documentation

**Deliverable:** Complete reference API suite

---

### 2.4 CopilotKit Runtime API
**Priority:** High
**Effort:** Medium
**Files:** `src/app/api/copilotkit/route.ts` (new)

**Implementation Steps:**
1. Install CopilotKit dependencies:
   ```bash
   npm install @copilotkit/runtime @copilotkit/react-core @copilotkit/react-ui
   ```

2. Create CopilotKit runtime endpoint:
   ```typescript
   import { CopilotRuntime } from "@copilotkit/runtime";

   const runtime = new CopilotRuntime({
     actions: {
       calculateChart: async ({ datetime_utc, lat, lng }) => { ... },
       getGateInfo: async ({ gateId }) => { ... },
       getChannelInfo: async ({ gates }) => { ... },
       getCurrentTransit: async () => { ... },
     }
   });
   ```

3. Define CopilotKit actions for HD operations
4. Connect to existing calculation functions

**Deliverable:** Working `/api/copilotkit` endpoint with HD actions

---

## Phase 3: AI Integration

### 3.1 CopilotKit Frontend Integration
**Priority:** High
**Effort:** Medium
**Files:**
- `src/app/layout.tsx`
- `src/components/chat/CopilotChat.tsx` (new)

**Implementation Steps:**
1. Wrap app in CopilotKit provider:
   ```tsx
   import { CopilotKit } from "@copilotkit/react-core";

   <CopilotKit runtimeUrl="/api/copilotkit">
     {children}
   </CopilotKit>
   ```

2. Create chat interface component:
   ```tsx
   import { CopilotPopup } from "@copilotkit/react-ui";

   export function CopilotChat({ chartData }) {
     return (
       <CopilotPopup
         labels={{ title: "Human Design Guide" }}
         instructions="Help users understand their Human Design chart..."
       />
     );
   }
   ```

3. Pass chart context to CopilotKit for personalized responses
4. Style chat UI to match Solar Haze Portal theme

**Deliverable:** In-app AI chat for chart interpretation

---

### 3.2 Pydantic AI Agent Deployment
**Priority:** Medium
**Effort:** Medium
**Files:** `agent/` directory

**Current State:** Agent code exists but not deployed

**Implementation Steps:**
1. Enhance agent with HD-specific tools:
   ```python
   @agent.tool
   async def get_gate_meaning(gate_id: int) -> str:
       """Fetch detailed gate information"""

   @agent.tool
   async def calculate_chart(birth_data: dict) -> dict:
       """Calculate a Human Design chart"""
   ```

2. Add streaming response support for better UX
3. Deploy to cloud provider (Railway, Render, or Modal)
4. Create Next.js proxy endpoint to agent service
5. Add environment variable for agent URL

**Deliverable:** Deployed Pydantic AI agent with Next.js integration

---

### 3.3 AI Interpretation Features
**Priority:** Low
**Effort:** High

**Implementation Steps:**
1. Create interpretation UI component with sections:
   - Overview interpretation
   - Type & Strategy guidance
   - Authority deep dive
   - Channel analysis
   - Life purpose (Incarnation Cross)

2. Add "Generate Reading" button to chart results
3. Implement streaming text display for interpretations
4. Cache interpretations in database for returning users

**Deliverable:** AI-powered chart interpretation feature

---

## Phase 4: Visual Bodygraph

### 4.1 SVG Bodygraph Component
**Priority:** Medium
**Effort:** High
**Files:** `src/components/chart/Bodygraph.tsx` (new)

**Implementation Steps:**
1. Create base SVG bodygraph structure:
   - 9 geometric center shapes at correct positions
   - 36 channel connection lines
   - 64 gate positions around centers

2. Implement visual states:
   - Defined centers (filled/colored)
   - Undefined centers (outline only)
   - Active channels (colored lines)
   - Gate activations (dots/numbers)

3. Color coding:
   - Personality activations (black)
   - Design activations (red)
   - Circuit colors (Individual/Tribal/Collective)

4. Add interactivity:
   - Hover tooltips for gates/channels
   - Click to expand gate/channel info
   - Zoom and pan for mobile

**Deliverable:** Interactive SVG bodygraph visualization

---

### 4.2 Transit Overlay
**Priority:** Low
**Effort:** Medium
**Files:** `src/components/chart/TransitOverlay.tsx` (new)

**Implementation Steps:**
1. Fetch current transit data
2. Overlay transit activations on natal chart
3. Highlight temporary channels
4. Show transit gate positions with different styling

**Deliverable:** Transit overlay on bodygraph

---

## Phase 5: Validation & Quality

### 5.1 Chart Calculation Validation Suite
**Priority:** High
**Effort:** Medium
**Files:** `tests/validation/` (new directory)

**Implementation Steps:**
1. Gather 20+ verified charts from known sources
2. Create test cases comparing calculated vs expected:
   ```typescript
   test('validates Ra Uru Hu chart', async () => {
     const result = await calculateChart({
       datetime_utc: '1948-04-09T12:00:00Z',
       lat: 31.7683,
       lng: 35.2137
     });
     expect(result.type).toBe('Manifestor');
     expect(result.profile).toBe('5/1');
     // ... verify all properties
   });
   ```

3. Test edge cases:
   - Reflector (no defined centers)
   - All 5 types
   - All 7 authorities
   - Triple/Quadruple split definitions
   - Cusp positions (gate boundaries)

4. Add CI integration to run validation on every PR

**Deliverable:** Comprehensive validation test suite

---

### 5.2 Performance Optimization
**Priority:** Medium
**Effort:** Low

**Implementation Steps:**
1. Add Redis caching for:
   - Ephemeris calculations (cache by date)
   - Reference data queries
   - AI interpretations

2. Implement chart calculation caching:
   - Cache key: hash of birth data
   - TTL: indefinite (birth data doesn't change)

3. Add performance monitoring:
   - Response time tracking
   - P95 latency dashboard
   - Error rate monitoring

**Deliverable:** Sub-200ms P95 response times

---

### 5.3 API Documentation
**Priority:** Low
**Effort:** Low
**Files:** `src/app/api/docs/` or OpenAPI spec

**Implementation Steps:**
1. Generate OpenAPI 3.0 specification
2. Add Swagger UI at `/api/docs`
3. Document all request/response schemas
4. Include example requests and responses
5. Add rate limiting documentation

**Deliverable:** Complete API documentation

---

## Phase 6: User Features

### 6.1 Saved Charts
**Priority:** Medium
**Effort:** Medium

**Implementation Steps:**
1. Add "Save Chart" button (requires auth)
2. Create charts list page at `/charts`
3. Implement chart CRUD operations:
   - Save with custom name
   - Update notes
   - Delete chart
   - Share chart (public URL)

**Deliverable:** User chart library feature

---

### 6.2 Practitioner Features
**Priority:** Low
**Effort:** High

**Implementation Steps:**
1. Client management dashboard
2. Session notes with chart reference
3. Bulk chart calculations
4. Client portal for chart access

**Deliverable:** Practitioner management system

---

## Implementation Order (Recommended)

### Sprint 1: Reference Data Foundation
1. ✅ Complete Incarnation Crosses (1.1)
2. ✅ Gate Descriptions Enhancement (1.3)
3. ✅ Transit API (2.1)

### Sprint 2: API Completion
1. ✅ Reference Data APIs (2.3)
2. ✅ Composite Chart API (2.2)
3. ✅ Validation Suite (5.1)

### Sprint 3: AI Integration
1. ✅ CopilotKit Runtime API (2.4)
2. ✅ CopilotKit Frontend (3.1)
3. ✅ AI Interpretation Features (3.3)

### Sprint 4: Visualization
1. ✅ SVG Bodygraph Component (4.1)
2. ✅ Transit Overlay (4.2)

### Sprint 5: Polish & Scale
1. ✅ Gate Lines Database (1.2)
2. ✅ Performance Optimization (5.2)
3. ✅ API Documentation (5.3)
4. ✅ Pydantic Agent Deployment (3.2)

### Sprint 6: User Features
1. ✅ Saved Charts (6.1)
2. ✅ Practitioner Features (6.2)

---

## Dependency Graph

```
Phase 1 (Reference Data)
    ├── 1.1 Crosses ─────────────────────────────────────────────┐
    ├── 1.3 Gate Descriptions ───────────────────────────────────┤
    └── 1.2 Gate Lines ──────────────────────────────────────────┤
                                                                  │
Phase 2 (APIs)                                                    │
    ├── 2.1 Transit ← depends on ephemeris (done)                │
    ├── 2.2 Composite ← depends on chart calc (done)             │
    ├── 2.3 Reference APIs ← depends on Phase 1 ─────────────────┤
    └── 2.4 CopilotKit API ← standalone                          │
                                                                  │
Phase 3 (AI)                                                      │
    ├── 3.1 CopilotKit Frontend ← depends on 2.4                 │
    ├── 3.2 Pydantic Agent ← standalone                          │
    └── 3.3 AI Interpretation ← depends on 3.1 or 3.2            │
                                                                  │
Phase 4 (Visual)                                                  │
    ├── 4.1 Bodygraph SVG ← depends on gate data                 │
    └── 4.2 Transit Overlay ← depends on 2.1, 4.1                │
                                                                  │
Phase 5 (Quality)                                                 │
    ├── 5.1 Validation Suite ← can start immediately             │
    ├── 5.2 Performance ← after APIs complete                    │
    └── 5.3 API Docs ← after APIs complete ───────────────────────┘
```

---

## Effort Estimates

| Phase | Items | Complexity |
|-------|-------|------------|
| Phase 1: Reference Data | 3 | High (data entry) |
| Phase 2: API Endpoints | 4 | Low-Medium |
| Phase 3: AI Integration | 3 | Medium-High |
| Phase 4: Visual Bodygraph | 2 | High |
| Phase 5: Validation & Quality | 3 | Low-Medium |
| Phase 6: User Features | 2 | Medium |

---

## Success Criteria

- [ ] 100% chart calculation accuracy vs verified charts
- [ ] All 192+ incarnation crosses defined
- [ ] All 384 gate lines documented
- [ ] Transit and Composite APIs functional
- [ ] CopilotKit AI chat working in-app
- [ ] Interactive bodygraph visualization
- [ ] P95 response time < 200ms
- [ ] API documentation complete
- [ ] 99.9% uptime in production
