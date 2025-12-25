# Human Design MVP Implementation Plan

## Overview

Build an MVP prototype for a Human Design chart calculator targeting **consumers** with:
- Anonymous use (no authentication)
- No AI features
- Data-only display (text/cards, no visual bodygraph)

## Current State

**Working:**
- Calculation engine complete (`/src/lib/calculation/`)
- API endpoint working (`POST /api/chart`)
- Basic form and chart display on homepage

**To Remove:**
- CopilotKit integration (unused for MVP)
- Authentication hooks (anonymous MVP)

**To Enhance:**
- Chart display missing: Centers, Activations, Circuitry sections
- No timezone handling (user must enter UTC time)
- No loading skeleton or proper error handling

---

## Implementation Steps

### Step 1: Simplify Layout
**File:** `/src/app/layout.tsx`

Remove CopilotKit wrapper:
- Remove `CopilotKit` import and `@copilotkit/react-ui/styles.css`
- Render children directly without wrapper

### Step 2: Create UI Components
**New Directory:** `/src/components/ui/`

| Component | Purpose |
|-----------|---------|
| `Card.tsx` | Reusable card container with title |
| `Badge.tsx` | Colored pill for channels, circuits |
| `Spinner.tsx` | Loading indicator |

### Step 3: Create Chart Display Components
**New Directory:** `/src/components/chart/`

| Component | Displays |
|-----------|----------|
| `ChartOverview.tsx` | Type, Strategy, Authority, Profile, Definition |
| `IncarnationCross.tsx` | Cross name, type, quarter, gates |
| `CentersGrid.tsx` | 9 centers with defined/undefined status and gates |
| `ChannelsList.tsx` | Active channels with circuit badges |
| `ActivationsTable.tsx` | Personality vs Design planetary positions |
| `CircuitryBalance.tsx` | Individual/Tribal/Collective distribution |
| `ChartResult.tsx` | Container composing all sections |

### Step 4: Create Form Components
**New Directory:** `/src/components/form/`

| Component | Purpose |
|-----------|---------|
| `BirthDataForm.tsx` | Date, time, lat/lng inputs with validation |
| `TimezoneSelect.tsx` | Dropdown for local-to-UTC conversion |

### Step 5: Refactor Homepage
**File:** `/src/app/page.tsx`

Changes:
- Remove CopilotKit imports and popup
- Remove useSession hook and auth UI
- Remove unused `birthLocation` state
- Add timezone select for local time conversion
- Use new `ChartResult` component for display
- Add loading state during calculation
- Add proper error display

### Step 6: Add HD Color Theme
**File:** `/src/app/globals.css`

Add CSS custom properties:
```css
--hd-personality: #1a1a1a;  /* Black - conscious */
--hd-design: #d63031;       /* Red - unconscious */
--hd-defined: #00b894;      /* Green */
--hd-undefined: #dfe6e9;    /* Gray */
--hd-individual: #6c5ce7;   /* Purple */
--hd-tribal: #e17055;       /* Orange */
--hd-collective: #0984e3;   /* Blue */
```

### Step 7: Test & Polish
- Test with known birth data for validation
- Verify responsive design on mobile
- Test edge cases (Reflector, no channels)
- Ensure dark mode works

---

## File Structure After Implementation

```
src/
  app/
    page.tsx              # Refactored (no auth/CopilotKit)
    layout.tsx            # Simplified
    globals.css           # HD colors added
    api/chart/route.ts    # Unchanged
  components/
    ui/
      Card.tsx
      Badge.tsx
      Spinner.tsx
    chart/
      ChartOverview.tsx
      IncarnationCross.tsx
      CentersGrid.tsx
      ChannelsList.tsx
      ActivationsTable.tsx
      CircuitryBalance.tsx
      ChartResult.tsx
    form/
      BirthDataForm.tsx
      TimezoneSelect.tsx
  lib/                    # Unchanged
  types/                  # Unchanged
```

---

## Key Files to Modify

| File | Action |
|------|--------|
| `/src/app/layout.tsx` | Remove CopilotKit |
| `/src/app/page.tsx` | Remove auth, enhance UI |
| `/src/app/globals.css` | Add HD color variables |

## New Files to Create

| File | Purpose |
|------|---------|
| `/src/components/ui/Card.tsx` | Card container |
| `/src/components/ui/Badge.tsx` | Colored pill |
| `/src/components/ui/Spinner.tsx` | Loading indicator |
| `/src/components/chart/ChartOverview.tsx` | Core metrics |
| `/src/components/chart/IncarnationCross.tsx` | Cross display |
| `/src/components/chart/CentersGrid.tsx` | 9 centers |
| `/src/components/chart/ChannelsList.tsx` | Channels |
| `/src/components/chart/ActivationsTable.tsx` | Planets |
| `/src/components/chart/CircuitryBalance.tsx` | Circuits |
| `/src/components/chart/ChartResult.tsx` | Container |
| `/src/components/form/BirthDataForm.tsx` | Birth form |
| `/src/components/form/TimezoneSelect.tsx` | TZ select |

---

## Out of Scope (Future)

- Visual bodygraph (SVG/Canvas)
- Authentication and saved charts
- AI chat interpretation
- Transit and composite charts
- City geocoding (users enter lat/lng)
- Database integration
