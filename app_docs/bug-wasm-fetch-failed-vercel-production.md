# Bug Fix: WASM Fetch Failed in Vercel Production

**ADW ID:** N/A
**Date:** 2025-12-25
**Specification:** specs/bug-wasm-fetch-failed-vercel-production.md

## Overview

Fixed a critical bug where the sweph-wasm WASM module failed to load in Vercel's serverless production environment, causing all Human Design chart calculations to fail with 500 errors. The solution bundles the WASM file as a public static asset and uses HTTP URLs for loading instead of filesystem paths.

## What Was Built

- WASM file deployment as a static asset in `public/swisseph.wasm`
- Automated postinstall script to copy WASM file after `npm install`
- Updated WASM initialization to use HTTP URLs compatible with serverless environments
- Environment-aware URL construction (Vercel production vs localhost development)

## Technical Implementation

### Files Modified

- `package.json`: Added `postinstall` script and updated `drizzle-kit` version
- `src/lib/calculation/ephemeris.ts`: Rewrote WASM initialization logic
- `public/swisseph.wasm`: New static asset (~570KB)

### Key Changes

- **Removed filesystem-based WASM loading**: The previous implementation used `pathToFileURL(path.join(process.cwd(), 'node_modules/...'))` which fails in Vercel's bundled serverless functions where `node_modules` doesn't exist at runtime

- **Added HTTP URL-based loading**: The WASM file is now served as a static asset at `/swisseph.wasm` and loaded via absolute HTTP URL

- **Environment-aware base URL**: Uses `VERCEL_URL` environment variable (automatically set by Vercel) for production, falls back to `localhost:3000` for development

- **Automated WASM copying**: The `postinstall` script ensures the WASM file is copied to `public/` after every `npm install`, including during Vercel's build process

### Code Changes

**Before (broken in Vercel):**
```typescript
import path from 'path';
import { pathToFileURL } from 'url';

const wasmPath = path.join(
  process.cwd(),
  'node_modules/sweph-wasm/dist/wasm/swisseph.wasm'
);
const wasmUrl = pathToFileURL(wasmPath).href;
sweInstance = await SwissEPH.init(wasmUrl);
```

**After (works everywhere):**
```typescript
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';
const wasmUrl = `${baseUrl}/swisseph.wasm`;
sweInstance = await SwissEPH.init(wasmUrl);
```

## How to Use

1. Run `npm install` - the postinstall script automatically copies the WASM file
2. Start the dev server with `npm run dev`
3. Chart calculations work automatically via the `/api/chart` endpoint
4. Deploy to Vercel - the WASM file is included in the static assets

## Configuration

- `VERCEL_URL`: Automatically set by Vercel, contains the deployment URL (e.g., `my-app-xyz.vercel.app`)
- No additional configuration required

## Testing

- Run `npm run test` to execute the Vitest test suite (57 tests)
- Run `npm run build` to verify production build succeeds
- Test the API endpoint locally:
  ```bash
  curl -X POST http://localhost:3000/api/chart \
    -H "Content-Type: application/json" \
    -d '{"datetime_utc":"1980-09-13T09:15:00Z","lat":34.0522,"lng":-118.2437}'
  ```

## Notes

- The WASM file is ~570KB and will be cached by browsers after first load
- The `VERCEL_URL` approach ensures the correct URL is used for preview deployments (each has a unique URL)
- Alternative approaches (webpack `asyncWebAssembly`, Next.js `serverComponentsExternalPackages`) were considered but the public asset approach is simpler and more reliable
- The sweph-wasm library does NOT have a built-in CDN fallback - `init()` uses `import.meta.url` which doesn't work in bundled serverless environments
