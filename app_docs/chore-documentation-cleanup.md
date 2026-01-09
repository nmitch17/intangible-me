# Documentation Cleanup & Consolidation

**ADW ID:** N/A
**Date:** 2025-12-30
**Specification:** N/A

## Overview

Cleaned up and consolidated the project documentation to remove outdated, conflicting, or superseded information. The cleanup addressed flip-flopping documentation around WASM loading strategies, agent frameworks (Mastra vs CopilotKit), geocoding providers (MapTiler vs Nominatim), and design systems (Cosmic vs Solar Haze Portal).

## What Was Built

- Identified and removed outdated documentation files
- Fixed incorrect references in existing documentation
- Updated conditional_docs.md to reflect current tech stack
- Validated current implementation against documentation claims

## Technical Implementation

### Files Removed (Manual Deletion Required)

- `app_docs/chore-location-search-maptiler.md`: Superseded by Nominatim geocoding
- `app_docs/feature-cosmic-ui-redesign.md`: Superseded by Solar Haze Portal design

### Files Modified

- `app_docs/feature-cosmic-ui-redesign-sprint1.md`:
  - Fixed "Mastra" reference to "CopilotKit with Google Gemini"
  - Removed `MAPTILER_API_KEY` requirement (Nominatim is free)
  - Fixed WASM path from `/public/wasm/` to `/public/swisseph.wasm`

- `app_docs/feature-initial-human-design-chart-calculator.md`:
  - Updated `OPENAI_API_KEY` to `GOOGLE_GENERATIVE_AI_API_KEY`

- `.claude/commands/conditional_docs.md`:
  - Removed MapTiler documentation reference
  - Removed Cosmic UI documentation reference
  - Added LocationSearch conditions to Nominatim docs
  - Expanded Solar Haze UI conditions to cover all styling scenarios

### Key Changes

- **Agent Framework**: Documentation now correctly states CopilotKit with Google Gemini (not Mastra)
- **Geocoding**: Nominatim documentation is now the authoritative source
- **Design System**: Solar Haze Portal documentation is now the authoritative source
- **WASM Loading**: Data URL approach from `/public/swisseph.wasm` is correctly documented

## Current Tech Stack (Validated)

| Component | Implementation |
|-----------|---------------|
| **WASM Loading** | Data URL from `/public/swisseph.wasm` via postinstall script |
| **Agent Framework** | CopilotKit with Google Gemini (`@copilotkit/runtime` + `GoogleGenerativeAIAdapter`) |
| **Geocoding** | Nominatim (OpenStreetMap) - no API key required |
| **Design System** | Solar Haze Portal (claymorphism, warm palette) |
| **AI Provider** | Google Gemini (`GOOGLE_GENERATIVE_AI_API_KEY`) |

## How to Use

1. Review the remaining documentation files for accurate information:
   - `chore-auto-timezone-from-location.md` - Timezone detection
   - `chore-switch-to-nominatim-geocoding.md` - Geocoding implementation
   - `feature-solar-haze-ui-redesign.md` - Design system
   - `feature-initial-human-design-chart-calculator.md` - Core calculator
   - `feature-cosmic-ui-redesign-sprint1.md` - Sprint 1 APIs
   - `bug-wasm-fetch-failed-vercel-production.md` - WASM loading solution

2. Use `conditional_docs.md` to determine which docs to read for specific tasks

3. Manually delete the outdated files:
   ```bash
   rm app_docs/chore-location-search-maptiler.md
   rm app_docs/feature-cosmic-ui-redesign.md
   ```

## Configuration

No configuration changes required. This was a documentation-only cleanup.

## Testing

Validate documentation accuracy by checking:
1. `src/app/api/copilotkit/route.ts` uses `GoogleGenerativeAIAdapter`
2. `src/app/api/geocode/route.ts` calls Nominatim, not MapTiler
3. `src/lib/calculation/ephemeris.ts` loads WASM from `/public/swisseph.wasm`
4. `src/app/globals.css` defines Solar Haze Portal tokens

## Notes

- Two files require manual deletion due to hook restrictions on `rm` command
- The `src/lib/maptiler.ts` file still exists but only provides type definitions (not API calls)
- All documentation now accurately reflects the current implementation
