# Bug Fix: WASM Fetch Failed in Vercel Production

**ADW ID:** N/A
**Date:** 2025-12-26
**Specification:** specs/bug-wasm-fetch-failed-vercel-production.md

## Overview

Fixed a critical bug where the sweph-wasm WASM module failed to load in Vercel's serverless production environment, causing all Human Design chart calculations to fail with 500 errors. The solution reads the WASM file directly from the filesystem and converts it to a data URL, avoiding the self-fetch issues in serverless cold starts.

## What Was Built

- WASM file deployment as a static asset in `public/swisseph.wasm`
- Automated postinstall script to copy WASM file after `npm install`
- Filesystem-based WASM loading with data URL conversion for serverless compatibility
- `.npmrc` configuration for legacy peer deps resolution on Vercel

## Technical Implementation

### Files Modified

- `package.json`: Added `postinstall` script and updated `drizzle-kit` version
- `src/lib/calculation/ephemeris.ts`: Rewrote WASM initialization logic
- `public/swisseph.wasm`: New static asset (~570KB)
- `.npmrc`: Added `legacy-peer-deps=true` for npm dependency resolution

### Key Changes

- **Removed node_modules-based WASM loading**: The original implementation used `pathToFileURL(path.join(process.cwd(), 'node_modules/...'))` which fails in Vercel's bundled serverless functions where `node_modules` doesn't exist at runtime

- **Filesystem read with data URL**: Reads WASM file from `public/swisseph.wasm` using `fs.readFileSync`, converts to base64 data URL, and passes to `SwissEPH.init()`. This avoids serverless self-fetch issues during cold starts.

- **Automated WASM copying**: The `postinstall` script ensures the WASM file is copied to `public/` after every `npm install`, including during Vercel's build process

- **Legacy peer deps**: Added `.npmrc` with `legacy-peer-deps=true` to resolve npm dependency conflicts between `better-auth` and `drizzle-kit`

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
import { readFileSync } from 'fs';
import path from 'path';

const wasmPath = path.join(process.cwd(), 'public', 'swisseph.wasm');
const wasmBuffer = readFileSync(wasmPath);
const wasmBase64 = wasmBuffer.toString('base64');
const wasmDataUrl = `data:application/wasm;base64,${wasmBase64}`;
sweInstance = await SwissEPH.init(wasmDataUrl);
```

## How to Use

1. Run `npm install` - the postinstall script automatically copies the WASM file
2. Start the dev server with `npm run dev`
3. Chart calculations work automatically via the `/api/chart` endpoint
4. Deploy to Vercel - the WASM file is included in the public assets

## Configuration

- No environment variables required for WASM loading
- `.npmrc` with `legacy-peer-deps=true` handles npm dependency conflicts

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

- The WASM file is ~570KB and gets loaded once per serverless function instance (singleton pattern)
- The data URL approach avoids network requests entirely, making cold starts more reliable
- Alternative approaches tried:
  - HTTP URL with `VERCEL_URL` - failed because serverless functions can't fetch from their own domain during cold start
  - `node_modules` path with `file://` URL - failed because `node_modules` doesn't exist at runtime in Vercel
- The sweph-wasm library's default `init()` uses `import.meta.url` which doesn't work in bundled serverless environments
