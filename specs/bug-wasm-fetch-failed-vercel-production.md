# Bug: WASM Fetch Failed in Vercel Production

## Bug Description
In production on Vercel, the sweph-wasm WASM module fails to load with the error "wasm streaming compile failed: TypeError: fetch failed" followed by "failed to asynchronously prepare wasm: both async and sync fetching of the wasm failed". This causes chart calculations to fail with a RuntimeError, completely breaking the Human Design chart calculation functionality.

**Symptoms:**
- Chart calculation API endpoint (`/api/chart`) returns 500 errors
- Error logs show WASM fetch failures
- The application falls back to ArrayBuffer instantiation which also fails
- All chart-related functionality is broken in production

**Expected behavior:** The sweph-wasm library should load correctly in the Vercel serverless environment and calculate planetary positions.

**Actual behavior:** WASM file cannot be fetched/loaded, causing all ephemeris calculations to fail.

## Problem Statement
The sweph-wasm library initialization in `src/lib/calculation/ephemeris.ts` uses `pathToFileURL(path.join(process.cwd(), 'node_modules/sweph-wasm/dist/wasm/swisseph.wasm'))` to locate the WASM file. This approach fails in Vercel's serverless environment because:

1. The `node_modules` directory structure is not preserved in the Vercel build output
2. `process.cwd()` does not point to the expected location in serverless functions
3. The WASM file is not bundled with the serverless function code
4. Using `file://` URLs for WASM loading is problematic in serverless environments

## Solution Statement
Bundle the WASM file as a static asset in the `public/` directory and pass an absolute HTTP URL to `SwissEPH.init()`. The solution involves:

1. Copy the WASM file to the `public` directory so it's served as a static asset at `/swisseph.wasm`
2. Modify the ephemeris.ts initialization to construct an absolute HTTP URL to the public WASM file
3. Use environment variables (`VERCEL_URL` or `NEXT_PUBLIC_SITE_URL`) to construct the correct base URL in production
4. Add a `postinstall` script to automate WASM file copying

## Steps to Reproduce
1. Deploy the application to Vercel
2. Navigate to the application and enter birth data
3. Click "Calculate Chart"
4. Observe the error: "Chart calculation error: RuntimeError: Aborted(both async and sync fetching of the wasm failed)"
5. Check Vercel logs to see the full error stack trace

## Root Cause Analysis
The root cause is the WASM loading strategy in `src/lib/calculation/ephemeris.ts`:

```typescript
const wasmPath = path.join(
  process.cwd(),
  'node_modules/sweph-wasm/dist/wasm/swisseph.wasm'
);
const wasmUrl = pathToFileURL(wasmPath).href;
sweInstance = await SwissEPH.init(wasmUrl);
```

This code:
1. Assumes `node_modules` exists at runtime in the serverless function
2. Uses `file://` URLs which are problematic for WASM loading in serverless environments
3. Doesn't account for how Vercel bundles and deploys serverless functions

In Vercel's serverless environment:
- The function is bundled with webpack/esbuild
- `node_modules` is not available in its original form
- `process.cwd()` points to a read-only filesystem location
- WASM files need to be explicitly included in the bundle or served as static assets

## Relevant Files
Use these files to fix the bug:

- **`src/lib/calculation/ephemeris.ts`**: Contains the WASM initialization logic that needs to be modified to use a proper loading strategy for serverless environments
- **`next.config.mjs`**: May need configuration to properly handle WASM files and copy them to the output
- **`package.json`**: May need a postinstall or build script to copy the WASM file to public

### New Files
- **`public/swisseph.wasm`**: The WASM file copied from node_modules to be served as a static asset

## Step by Step Tasks

### Step 1: Copy WASM file to public directory
- Copy `node_modules/sweph-wasm/dist/wasm/swisseph.wasm` to `public/swisseph.wasm`
- Add a `postinstall` script to `package.json` to automate this copy: `"postinstall": "cp node_modules/sweph-wasm/dist/wasm/swisseph.wasm public/swisseph.wasm"`
- Verify the file is copied correctly and is accessible at `/swisseph.wasm` in development

### Step 2: Update ephemeris.ts WASM initialization
- Modify the `getSwe()` function in `src/lib/calculation/ephemeris.ts` to:
  - Remove the `path`, `pathToFileURL`, and `readFileSync` imports (no longer needed)
  - Construct an absolute HTTP URL to the public WASM file
  - Use `VERCEL_URL` environment variable in production, or `localhost:3000` in development
  - Pass this URL to `SwissEPH.init(wasmUrl)`

The updated code should look like:
```typescript
import SwissEPH from 'sweph-wasm';
import { longitudeToGateLine } from './mandala';
import type { Activations, Planet } from '@/types';

// Singleton instance of SwissEPH
let sweInstance: SwissEPH | null = null;

/**
 * Initialize SwissEPH WASM module (singleton pattern)
 * Uses public WASM file served as a static asset
 */
async function getSwe(): Promise<SwissEPH> {
  if (!sweInstance) {
    // Construct absolute URL to the public WASM file
    // In production (Vercel), use VERCEL_URL; in development, use localhost
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const wasmUrl = `${baseUrl}/swisseph.wasm`;

    sweInstance = await SwissEPH.init(wasmUrl);
  }
  return sweInstance;
}
```

**Important:** The sweph-wasm library does NOT have a CDN fallback. The `init()` method uses `import.meta.url` to resolve the WASM path relative to the JavaScript module, which fails in Vercel's bundled serverless environment because the WASM file is not co-located with the bundled JS.

### Step 3: Verify local development still works
- Run `npm run dev` and verify chart calculations work locally
- Test the `/api/chart` endpoint with sample data
- Confirm no WASM loading errors in the console

### Step 4: Update tests if needed
- Verify existing ephemeris tests pass: `npm run test`
- The tests should work as sweph-wasm CDN loading works in Node.js test environment

### Step 5: Run validation commands
- Run all validation commands to confirm the fix works correctly with zero regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `npm run test` - Run Vitest test suite to validate the ephemeris calculations work correctly
- `npm run lint` - Run ESLint to ensure code quality
- `npm run build` - Verify the build completes successfully (this simulates production bundling)
- `curl -X POST http://localhost:3000/api/chart -H "Content-Type: application/json" -d '{"datetime_utc":"1980-09-13T09:15:00Z","lat":34.0522,"lng":-118.2437}'` - Test the chart API endpoint locally after running `npm run dev`

## Notes
- The sweph-wasm library does NOT have a built-in CDN fallback. When `init()` is called without a URL, it uses `import.meta.url` to resolve the WASM path relative to the JavaScript module location
- This relative resolution fails in Vercel's serverless environment because the bundled JS is in a different location than the WASM file
- The solution requires copying the WASM file to `public/` and passing an absolute HTTP URL to `init()`
- The `VERCEL_URL` environment variable is automatically set by Vercel and contains the deployment URL (e.g., `my-app-xyz.vercel.app`)
- The WASM file is ~570KB and will be cached by browsers after first load
- Alternative approaches like webpack `experiments.asyncWebAssembly` or Next.js `serverComponentsExternalPackages` were considered but the public asset approach is simpler and more reliable
- The `postinstall` script ensures the WASM file is always copied after `npm install`, including in Vercel's build process
