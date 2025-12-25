# Human Design Chart Calculator

**ADW ID:** N/A (Initial Implementation)
**Date:** 2025-12-23
**Specification:** N/A

## Overview

A full-stack Human Design chart calculation platform built with Next.js 14, featuring a comprehensive chart calculation engine that derives all Human Design elements from planetary positions using the Swiss Ephemeris. Users can input their birth data and receive their complete Human Design chart including type, strategy, authority, profile, incarnation cross, centers, channels, and circuitry analysis.

## What Was Built

- Complete Human Design chart calculation engine
- Birth data input form with timezone support
- Chart result display components
- REST API for chart calculations
- TypeScript type definitions for all Human Design concepts
- Reference data for channels and incarnation crosses

## Technical Implementation

### Files Modified

- `src/lib/calculation/chart.ts`: Core chart calculation engine with algorithms for deriving type, strategy, authority, definition, and all chart elements
- `src/lib/calculation/ephemeris.ts`: Swiss Ephemeris wrapper for planetary position calculations
- `src/lib/calculation/mandala.ts`: Gate-to-center mapping (64 gates to 9 centers)
- `src/lib/reference/channels.ts`: Complete channel definitions with circuit assignments
- `src/lib/reference/crosses.ts`: Incarnation cross reference data
- `src/types/index.ts`: Comprehensive TypeScript types for all Human Design concepts
- `src/app/api/chart/route.ts`: POST endpoint for chart calculation
- `src/app/page.tsx`: Main page with form and chart display
- `src/components/form/BirthDataForm.tsx`: Birth data input with validation
- `src/components/form/TimezoneSelect.tsx`: Timezone picker component
- `src/components/chart/ChartResult.tsx`: Main chart display container
- `src/components/chart/ChartOverview.tsx`: Type, strategy, authority display
- `src/components/chart/IncarnationCross.tsx`: Cross information display
- `src/components/chart/CentersGrid.tsx`: 9-center grid visualization
- `src/components/chart/ChannelsList.tsx`: Active channels list
- `src/components/chart/ActivationsTable.tsx`: Planetary gate/line activations
- `src/components/chart/CircuitryBalance.tsx`: Circuit distribution display

### Key Changes

- **Chart Calculation Algorithm**: Derives Human Design type using center definition rules (Sacral defines Generator/MG, motor-to-throat defines Manifestor, otherwise Projector, no centers = Reflector)
- **Authority Hierarchy**: Implements correct authority derivation (Emotional > Sacral > Splenic > Ego > Self-Projected > Mental > Lunar)
- **Definition Analysis**: Uses graph traversal (BFS/DFS) to determine center connectivity and definition type (Single, Split, Triple Split, Quadruple Split)
- **Cross Type Derivation**: Maps profiles to cross types (Right Angle, Juxtaposition, Left Angle)
- **Circuitry Analysis**: Counts channels by circuit type (Individual, Tribal, Collective)

## How to Use

1. Navigate to the application homepage
2. Enter your birth date using the date picker
3. Enter your birth time (as accurate as possible)
4. Select your birth timezone from the dropdown
5. Enter your birth location coordinates (latitude and longitude)
6. Click "Calculate Chart"
7. View your complete Human Design chart including:
   - Type, Strategy, Signature, and Not-Self Theme
   - Authority
   - Profile
   - Definition type
   - Incarnation Cross
   - Defined/undefined centers
   - Active channels with circuit information
   - Planetary activations (Personality and Design)
   - Circuitry balance

## Configuration

### Environment Variables

Required in `.env.local`:
- `DATABASE_URL` - Neon connection string (for future features)
- `BETTER_AUTH_SECRET` - Auth secret (for future features)
- `BETTER_AUTH_URL` - App URL (for future features)
- `OPENAI_API_KEY` - For CopilotKit (for future features)

### API Usage

```bash
POST /api/chart
Content-Type: application/json

{
  "datetime_utc": "1980-09-13T09:15:00Z",
  "lat": 34.0522,
  "lng": -118.2437
}
```

Response includes complete chart data with type, strategy, authority, profile, definition, cross, centers, channels, activations, gates, and circuitry.

## Testing

1. Start the development server: `PORT=3003 bun dev`
2. Navigate to http://localhost:3003
3. Enter birth data and verify chart calculation
4. Test various birth dates to verify different types are calculated correctly
5. Test API directly using curl or Postman

## Notes

- The `swisseph` package requires native compilation and works in Node.js environments but not Edge Runtime
- Incarnation cross data is partially implemented - some crosses will show generic names
- Timezone handling uses browser's Intl API - consider using a library like date-fns-tz for production
- Gate interpretations are simplified - full 64 gates x 6 lines data would enhance the system
