# Human Design App - Complete Development Plan

**Created:** December 2024
**Updated:** December 2024
**Goal:** Complete all remaining PRD features
**AI Framework:** Mastra (TypeScript)

---

## Current Status Summary

| Category | Complete | Remaining |
|----------|----------|-----------|
| Core Calculation Engine | ✅ 100% | - |
| UI Components | ✅ 100% | - |
| Database & Auth | ✅ 100% | - |
| Reference Data | 🟡 60% | Crosses, Gate Lines, Gate Descriptions |
| API Endpoints | 🟡 50% | Transit, Composite, Reference, CopilotKit |
| AI Integration | 🔴 10% | Mastra agents, CopilotKit frontend |
| Visual Bodygraph | 🔴 0% | SVG/Canvas chart visualization |
| Validation Suite | 🔴 0% | Test against known charts |

---

## Technology Decision: Mastra over Pydantic AI

### Why Mastra?

| Factor | Pydantic AI (Python) | Mastra (TypeScript) ✅ |
|--------|---------------------|------------------------|
| **Language** | Python | TypeScript (matches codebase) |
| **Deployment** | Separate FastAPI service | Same Next.js deployment |
| **Operational Complexity** | Two runtimes | Single runtime |
| **CopilotKit Integration** | Via HTTP calls | Native integration |
| **Team Backing** | Pydantic team | Gatsby founders (YC W25) |

### Key Benefits
1. **Single Stack**: No separate Python deployment needed
2. **Native CopilotKit**: Mastra integrates directly with CopilotKit
3. **Simpler Ops**: One Vercel deployment, one CI/CD pipeline
4. **Type Safety**: Full TypeScript across the entire stack

### Migration Notes
- Remove `agent/` directory (Python scaffolding)
- Install Mastra: `npm install @mastra/core`
- Define agents in `src/lib/agents/` directory

---

## Sprint Overview

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| **1** | API Completion | Transit, Composite, Reference APIs, Validation Suite |
| **2** | AI Integration | Mastra agents, CopilotKit runtime & frontend |
| **3** | Visualization | SVG Bodygraph, Transit Overlay |
| **4** | Polish & Scale | Performance, API Docs, Saved Charts |
| **5** | Reference Data | 192 Crosses, 384 Gate Lines (async research) |
| **6** | User Features | Practitioner Tools |

---

## Sprint 1: API Completion

### 1.1 Transit API
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

### 1.2 Composite Chart API
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
   - **Electromagnetic Channels:** One person has one gate, other has connecting gate
   - **Dominance:** Both have the same gate (stronger activation dominates)
   - **Compromise:** Neither has the gate but it's activated in composite
   - **Companionship:** Both have the channel (shared energy)

3. Return relationship dynamics and compatibility insights

**Deliverable:** Working `/api/composite` endpoint

---

### 1.3 Reference Data APIs
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

### 1.4 Validation Suite
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

## Sprint 2: AI Integration (Mastra + CopilotKit)

### 2.1 Install Mastra Framework
**Priority:** High
**Effort:** Low
**Files:** `package.json`, `src/lib/agents/` (new directory)

**Implementation Steps:**
1. Install Mastra dependencies:
   ```bash
   npm install @mastra/core @mastra/memory
   ```

2. Create agent configuration:
   ```typescript
   // src/lib/agents/index.ts
   import { Mastra } from '@mastra/core';

   export const mastra = new Mastra({
     agents: {
       hdGuide: hdGuideAgent,
     },
   });
   ```

3. Remove old Python agent directory:
   ```bash
   rm -rf agent/
   ```

**Deliverable:** Mastra framework installed and configured

---

### 2.2 Human Design Guide Agent
**Priority:** High
**Effort:** Medium
**Files:** `src/lib/agents/hd-guide.ts` (new)

**Implementation Steps:**
1. Create HD interpretation agent:
   ```typescript
   import { Agent } from '@mastra/core';

   export const hdGuideAgent = new Agent({
     name: 'Human Design Guide',
     instructions: `You are an expert Human Design analyst...`,
     model: {
       provider: 'ANTHROPIC',
       name: 'claude-3-5-sonnet-20241022',
     },
     tools: {
       calculateChart,
       getGateInfo,
       getChannelInfo,
       getCurrentTransit,
     },
   });
   ```

2. Define agent tools:
   ```typescript
   const calculateChart = createTool({
     id: 'calculate-chart',
     description: 'Calculate a Human Design chart from birth data',
     inputSchema: z.object({
       datetime_utc: z.string(),
       lat: z.number(),
       lng: z.number(),
     }),
     execute: async ({ context }) => {
       // Call existing calculation engine
     },
   });
   ```

3. Add tools for gate info, channel info, and transit data

**Deliverable:** Fully functional HD Guide agent

---

### 2.3 CopilotKit Runtime API
**Priority:** High
**Effort:** Medium
**Files:** `src/app/api/copilotkit/route.ts` (new)

**Implementation Steps:**
1. Install CopilotKit dependencies:
   ```bash
   npm install @copilotkit/runtime @copilotkit/react-core @copilotkit/react-ui
   ```

2. Create CopilotKit runtime with Mastra integration:
   ```typescript
   import { CopilotRuntime } from "@copilotkit/runtime";
   import { mastra } from "@/lib/agents";

   const runtime = new CopilotRuntime({
     actions: {
       interpretChart: async (chartData) => {
         return mastra.agents.hdGuide.generate(
           `Interpret this chart: ${JSON.stringify(chartData)}`
         );
       },
       askAboutGate: async (gateId) => {
         return mastra.agents.hdGuide.generate(
           `Explain gate ${gateId} in detail`
         );
       },
     }
   });
   ```

3. Connect Mastra agent to CopilotKit actions

**Deliverable:** Working `/api/copilotkit` endpoint

---

### 2.4 CopilotKit Frontend Integration
**Priority:** High
**Effort:** Medium
**Files:**
- `src/app/layout.tsx`
- `src/components/chat/CopilotChat.tsx` (new)

**Implementation Steps:**
1. Wrap app in CopilotKit provider:
   ```tsx
   import { CopilotKit } from "@copilotkit/react-core";
   import "@copilotkit/react-ui/styles.css";

   export default function RootLayout({ children }) {
     return (
       <CopilotKit runtimeUrl="/api/copilotkit">
         {children}
       </CopilotKit>
     );
   }
   ```

2. Create chat interface component:
   ```tsx
   import { CopilotPopup } from "@copilotkit/react-ui";

   export function CopilotChat({ chartData }) {
     return (
       <CopilotPopup
         labels={{
           title: "Human Design Guide",
           initial: "Ask me anything about your chart!"
         }}
         instructions={`The user's chart: ${JSON.stringify(chartData)}`}
       />
     );
   }
   ```

3. Style chat UI to match Solar Haze Portal theme
4. Pass chart context for personalized responses

**Deliverable:** In-app AI chat for chart interpretation

---

### 2.5 AI Interpretation Features
**Priority:** Medium
**Effort:** Medium
**Files:** `src/components/chart/InterpretationPanel.tsx` (new)

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

## Sprint 3: Visual Bodygraph

### 3.1 SVG Bodygraph Component
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

### 3.2 Transit Overlay
**Priority:** Low
**Effort:** Medium
**Files:** `src/components/chart/TransitOverlay.tsx` (new)

**Implementation Steps:**
1. Fetch current transit data from `/api/transit`
2. Overlay transit activations on natal chart
3. Highlight temporary channels formed
4. Show transit gate positions with different styling (e.g., dashed lines)

**Deliverable:** Transit overlay on bodygraph

---

## Sprint 4: Polish & Scale

### 4.1 Performance Optimization
**Priority:** Medium
**Effort:** Low

**Implementation Steps:**
1. Add Redis/Upstash caching for:
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

### 4.2 API Documentation
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

### 4.3 Saved Charts
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

## Sprint 5: Reference Data (Async Research)

> **Note:** This sprint involves extensive research and data entry. It can be worked on asynchronously alongside other sprints.

### 5.1 Incarnation Crosses Database
**Priority:** Medium
**Effort:** High (research-intensive)
**Files:** `src/lib/reference/crosses.ts`

**Current State:** ~18 entries defined
**Target:** 192+ unique crosses

**Implementation Steps:**
1. Expand cross data structure:
   ```typescript
   interface CrossReference {
     name: string;
     type: 'Right Angle' | 'Left Angle' | 'Juxtaposition';
     quarter: 'Initiation' | 'Civilization' | 'Duality' | 'Mutation';
     theme: string;
     description: string;
     gates: [number, number, number, number];
   }
   ```

2. Research and populate all 192+ crosses organized by quarter:
   - Quarter of Initiation (Purpose through Mind)
   - Quarter of Civilization (Purpose through Form)
   - Quarter of Duality (Purpose through Bonding)
   - Quarter of Mutation (Purpose through Transformation)

3. Add cross lookup by gate combination and profile line

**Deliverable:** Complete `crosses.ts` with all incarnation crosses

---

### 5.2 Gate Lines Database
**Priority:** Medium
**Effort:** High (research-intensive)
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
     // ... all 384 lines
   };
   ```

2. Research and populate with verified Human Design line data
3. Add lookup function: `getLine(gate: number, line: number)`
4. Integrate with chart response to include line details

**Deliverable:** Complete `lines.ts` with all 384 gate lines

---

### 5.3 Gate Descriptions Enhancement
**Priority:** Medium
**Effort:** Medium
**Files:** `src/lib/reference/gates.ts` (new)

**Current State:** Names only
**Target:** Full descriptions, keynotes

**Implementation Steps:**
1. Create comprehensive gate reference:
   ```typescript
   interface GateReference {
     id: number;
     name: string;
     center: Center;
     keynote: string;
     description: string;
     notSelfQuestion: string;
   }
   ```

2. Research and add detailed gate information
3. Integrate with reference API endpoint

**Deliverable:** Complete gate reference data with descriptions

---

## Sprint 6: User Features

### 6.1 Practitioner Features
**Priority:** Low
**Effort:** High

**Implementation Steps:**
1. Client management dashboard at `/dashboard/clients`
2. Session notes with chart reference
3. Bulk chart calculations
4. Client portal for chart access
5. Export charts as PDF

**Deliverable:** Practitioner management system

---

## Dependency Graph

```
Sprint 1 (APIs) ← No dependencies, start immediately
    ├── 1.1 Transit API
    ├── 1.2 Composite API
    ├── 1.3 Reference APIs
    └── 1.4 Validation Suite
              │
              ▼
Sprint 2 (AI) ← Depends on APIs being stable
    ├── 2.1 Install Mastra
    ├── 2.2 HD Guide Agent
    ├── 2.3 CopilotKit Runtime ← depends on 2.2
    ├── 2.4 CopilotKit Frontend ← depends on 2.3
    └── 2.5 AI Interpretation ← depends on 2.4
              │
              ▼
Sprint 3 (Visual) ← Can start parallel to Sprint 2
    ├── 3.1 SVG Bodygraph
    └── 3.2 Transit Overlay ← depends on 1.1, 3.1
              │
              ▼
Sprint 4 (Polish) ← After core features complete
    ├── 4.1 Performance
    ├── 4.2 API Docs
    └── 4.3 Saved Charts
              │
              ▼
Sprint 5 (Reference Data) ← Async, can run parallel
    ├── 5.1 Incarnation Crosses
    ├── 5.2 Gate Lines
    └── 5.3 Gate Descriptions
              │
              ▼
Sprint 6 (Practitioner) ← After user features
    └── 6.1 Practitioner Dashboard
```

---

## File Changes Summary

### New Files to Create
```
src/lib/agents/
├── index.ts              # Mastra configuration
├── hd-guide.ts           # HD Guide agent
└── tools/
    ├── calculate-chart.ts
    ├── get-gate-info.ts
    ├── get-channel-info.ts
    └── get-transit.ts

src/app/api/
├── transit/route.ts
├── composite/route.ts
├── copilotkit/route.ts
└── reference/
    ├── gates/route.ts
    ├── channels/route.ts
    └── types/route.ts

src/components/
├── chat/
│   └── CopilotChat.tsx
└── chart/
    ├── Bodygraph.tsx
    ├── TransitOverlay.tsx
    └── InterpretationPanel.tsx

src/lib/reference/
├── gates.ts              # Enhanced gate data
└── lines.ts              # Gate line data

tests/validation/
└── charts.test.ts
```

### Files to Modify
```
src/app/layout.tsx        # Add CopilotKit provider
src/lib/reference/crosses.ts  # Expand to 192+ crosses
package.json              # Add Mastra, CopilotKit deps
```

### Files to Delete
```
agent/                    # Remove Python agent (replaced by Mastra)
├── main.py
└── requirements.txt
```

---

## Success Criteria

- [ ] 100% chart calculation accuracy vs verified charts
- [ ] Transit and Composite APIs functional
- [ ] Mastra HD Guide agent responding accurately
- [ ] CopilotKit AI chat working in-app
- [ ] Interactive bodygraph visualization
- [ ] P95 response time < 200ms
- [ ] API documentation complete
- [ ] All 192+ incarnation crosses defined
- [ ] All 384 gate lines documented
- [ ] Saved charts feature working
- [ ] 99.9% uptime in production
