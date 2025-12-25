# Human Design API
## Product Requirements Document v2.0

**Version:** 2.0  
**Date:** December 2024

---

## 1. Executive Summary

This document defines the requirements for a comprehensive Human Design chart calculation system. The system is built as a full-stack Next.js application with the calculation engine designed for future extraction as a standalone API service.

### 1.1 Vision

Build the most comprehensive, accurate, and performant Human Design calculation engine available, serving as the foundation for a consumer chart app, practitioner management system, and AI-powered chart interpretation services.

### 1.2 Goals

- Own the entire technology stack for Human Design chart calculations
- Provide accurate calculations based on verified Rave Mandala data
- Enable AI-powered chart interpretation via CopilotKit and Pydantic AI
- Support future extraction as standalone API-as-a-service
- Maintain complete independence from third-party calculation services

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16.2 (App Router) | Full-stack React framework |
| Database | Neon (Serverless Postgres) | User data, saved charts, sessions |
| ORM | Drizzle | Type-safe database queries |
| Authentication | Better Auth | User auth, sessions, OAuth |
| AI Chat | CopilotKit | In-app AI assistant |
| AI Agent | Pydantic AI (Python) | Chart interpretation engine |
| Ephemeris | Swiss Ephemeris (swisseph) | Planetary position calculations |
| Deployment | Vercel | Serverless hosting |

---

## 3. System Architecture

### 3.1 Design Principles

1. **Stateless Calculation:** Pure calculation functions with no side effects
2. **Separation of Concerns:** Calculation, storage, and AI interpretation are independent
3. **Data-Only Responses:** No embedded interpretations in calculation output
4. **Extraction-Ready:** Calculation engine isolated in `/lib/calculation` for future API extraction

### 3.2 Project Structure

```
src/
├── app/
│   └── api/
│       ├── auth/           # Better Auth endpoints
│       ├── chart/          # Chart calculation
│       ├── copilotkit/     # AI chat runtime
│       └── reference/      # Reference data
├── db/
│   ├── schema.ts           # Drizzle schema
│   └── index.ts            # Neon client
├── lib/
│   ├── auth.ts             # Better Auth config
│   ├── calculation/        # ← EXTRACTABLE API
│   │   ├── chart.ts        # Main calculator
│   │   ├── ephemeris.ts    # Swiss Ephemeris
│   │   └── mandala.ts      # Gate mapping
│   └── reference/          # Static HD data
│       ├── channels.ts
│       └── crosses.ts
└── types/                  # TypeScript types

agent/                      # Pydantic AI (Python)
├── main.py
└── requirements.txt
```

---

## 4. Rave Mandala Data (Verified)

The Rave Mandala maps ecliptic longitude to Human Design gates. This data has been verified against official Human Design sources.

### 4.1 Core Parameters

| Parameter | Value |
|-----------|-------|
| Start Gate | Gate 41 (Start Codon / Rave New Year) |
| Gate 41 Position | 2°00' - 7°37'30" Aquarius (302° - 307.625° ecliptic) |
| Gate Arc | 5°37'30" (5.625°) |
| Line Arc | 0°56'15" (0.9375°) |
| Total Gates | 64 gates × 6 lines = 384 unique positions |
| Design Time Offset | 88° solar arc before birth (~88 days) |

### 4.2 Gate Sequence by Zodiac Sign

Starting from Gate 41 (Rave New Year), the gates proceed through the zodiac:

| Sign | Gates (in order) |
|------|------------------|
| Aquarius | 60 → 41 → 19 → 13 → 49 → 30 |
| Pisces | 55 → 37 → 63 → 22 → 36 → 25 |
| Aries | 17 → 21 → 51 → 42 → 3 |
| Taurus | 27 → 24 → 2 → 23 → 8 |
| Gemini | 20 → 16 → 35 → 45 → 12 → 15 |
| Cancer | 52 → 39 → 53 → 62 → 56 |
| Leo | 31 → 33 → 7 → 4 → 29 |
| Virgo | 59 → 40 → 64 → 47 → 6 → 46 |
| Libra | 18 → 48 → 57 → 32 → 50 |
| Scorpio | 28 → 44 → 1 → 43 → 14 |
| Sagittarius | 34 → 9 → 5 → 26 → 11 → 10 |
| Capricorn | 58 → 38 → 54 → 61 → 60 |

---

## 5. API Specification

### 5.1 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chart` | Generate chart from birth data |
| POST | `/api/transit` | Current planetary positions as HD gates |
| POST | `/api/composite` | Compare two charts |
| POST | `/api/copilotkit` | CopilotKit runtime for AI chat |
| GET | `/api/reference/gates` | All 64 gates |
| GET | `/api/reference/channels` | All 36 channels |
| GET | `/api/reference/types` | All 5 types |
| * | `/api/auth/[...all]` | Better Auth endpoints |

### 5.2 Request/Response Format

**POST /api/chart**

Request:
```json
{
  "datetime_utc": "1980-09-13T09:15:00Z",
  "lat": 34.0522,
  "lng": -118.2437
}
```

Response:
```json
{
  "birth": {
    "datetime_utc": "...",
    "timezone": "...",
    "lat": 34.0522,
    "lng": -118.2437
  },
  "chart": {
    "type": "Manifestor",
    "strategy": "Inform",
    "authority": "Emotional",
    "profile": "4/1",
    "definition": "Triple Split",
    "cross": {
      "name": "...",
      "type": "...",
      "quarter": "...",
      "gates": [47, 22, 12, 11]
    },
    "centers": { ... },
    "channels": [ ... ],
    "activations": {
      "personality": { ... },
      "design": { ... }
    },
    "gates": { ... },
    "circuitry": {
      "individual": 1,
      "tribal": 1,
      "collective": 1
    }
  }
}
```

---

## 6. Data Model

### 6.1 Chart Object

| Field | Type | Description |
|-------|------|-------------|
| `type` | enum | Manifestor \| Generator \| MG \| Projector \| Reflector |
| `strategy` | enum | Inform \| Wait to Respond \| Wait for Invitation \| Wait Lunar Cycle |
| `authority` | enum | Emotional \| Sacral \| Splenic \| Ego \| Self-Projected \| Mental \| Lunar |
| `profile` | string | Profile lines (e.g., "4/1", "6/2") |
| `definition` | enum | None \| Single \| Split \| Triple Split \| Quadruple Split |
| `cross` | object | { name, type, quarter, gates[4] } |
| `centers` | object | 9 centers with { defined: boolean, gates: number[] } |
| `channels` | array | { gates[2], name, circuit, stream } |
| `activations` | object | { personality: 13 planets, design: 13 planets } |
| `gates` | object | All activated gates with { name, center } |
| `circuitry` | object | { individual, tribal, collective } channel counts |

### 6.2 Database Schema (Drizzle)

Key tables in the Neon Postgres database:

- **users:** Better Auth user accounts
- **sessions:** Auth sessions
- **charts:** Saved user charts with computed data
- **clients:** Practitioner client records
- **session_notes:** Practitioner session notes
- **chat_history:** AI chat conversations

### 6.3 Out of Scope (v1)

- Variables (PHS arrows)
- Color, Tone, Base (substructure below line)
- Determination/Diet
- Cognition
- Environment
- Perspective/Motivation

---

## 7. Calculation Logic

### 7.1 Design Time Calculation

Calculate the exact moment when the Sun was 88° behind its birth position. This is approximately 88 days prior but must be computed precisely using binary search on solar longitude.

### 7.2 Gate/Line Mapping

1. Get ecliptic longitude from Swiss Ephemeris for each planet
2. Look up gate position using GATE_POSITIONS table
3. Calculate line by subdividing gate arc (0.9375° per line)
4. Return gate.line format (e.g., 47.4)

### 7.3 Type Derivation

1. No defined centers → Reflector
2. Sacral defined + motor-to-throat → Manifesting Generator
3. Sacral defined (no motor-to-throat) → Generator
4. Motor to Throat (no Sacral) → Manifestor
5. Otherwise → Projector

### 7.4 Authority Derivation

Hierarchy: Solar Plexus → Sacral → Spleen → Ego (to Throat) → G (to Throat) → Ajna (to Throat) → Lunar

### 7.5 Definition Calculation

Build a graph of connected centers via channels, then count connected components using BFS/DFS:
- 0 components = None
- 1 component = Single
- 2 components = Split
- 3 components = Triple Split
- 4+ components = Quadruple Split

---

## 8. AI Integration

### 8.1 CopilotKit (In-App Chat)

CopilotKit provides the in-app AI assistant with access to actions:

- **calculateChart:** Calculate a chart from birth data
- **getGateInfo:** Get detailed gate information
- **getChannelInfo:** Get channel details

### 8.2 Pydantic AI Agent (Python)

Separate Python FastAPI service for deeper chart interpretation:

- **POST /interpret:** Generate comprehensive chart interpretation
- **POST /chat:** Multi-turn conversation with chart context
- **POST /analyze-transit:** Analyze transit effects on natal chart

---

## 9. Reference Data Requirements

| Category | Count | Status | Fields |
|----------|-------|--------|--------|
| Gate Positions (Mandala) | 64 | ✅ Complete | gate, start°, end°, center |
| Gate Centers | 64 | ✅ Complete | gate → center mapping |
| Channels | 36 | ✅ Complete | gates, name, circuit, stream |
| Gate Names | 64 | ✅ Complete | id, name |
| Gate Descriptions | 64 | 🟡 Partial | keynotes, description |
| Gate Lines | 384 | 🔴 Not Started | gate, line, name, description |
| Incarnation Crosses | 192+ | 🟡 Partial (~20) | name, type, quarter, gates |

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Complete)

- [x] Project scaffolding with Next.js, Neon, Drizzle
- [x] Better Auth integration
- [x] Verified Rave Mandala gate mapping data
- [x] Swiss Ephemeris wrapper
- [x] Core calculation logic (Type, Authority, Profile, Definition)

### Phase 2: Complete Reference Data

- [ ] Complete 192+ incarnation crosses
- [ ] Gate line descriptions (384 entries)
- [ ] Center and type interpretations

### Phase 3: Validation & UI

- [ ] Validate calculations against known charts
- [ ] Chart visualization component
- [ ] Transit overlay on natal chart
- [ ] Composite chart UI

### Phase 4: Production & Scaling

- [ ] Deploy to Vercel
- [ ] Caching layer for calculations
- [ ] Rate limiting
- [ ] API documentation for future extraction

---

## 11. Success Metrics

1. **Accuracy:** 100% match with verified chart calculations
2. **Performance:** P95 response time < 200ms
3. **Completeness:** All core data points covered (excluding Variables)
4. **Reliability:** 99.9% uptime
5. **AI Quality:** Accurate, helpful chart interpretations
