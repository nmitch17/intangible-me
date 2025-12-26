# Bug: Vercel Build Failure - swisseph Native Module Compilation Error

## Bug Description

The Vercel deployment fails during `npm install` because the `swisseph` npm package requires native C compilation via `node-gyp`. On Vercel's build environment with Python 3.12, the `distutils` module has been removed (deprecated in Python 3.10, removed in 3.12), causing `node-gyp` to crash with `ModuleNotFoundError: No module named 'distutils'`.

**Symptoms:**
- Vercel build fails with exit code 1 during `npm install`
- Error message: `ModuleNotFoundError: No module named 'distutils'`
- Error originates from `node_modules/swisseph` trying to run `node-gyp rebuild`

**Expected behavior:** Deployment should complete successfully without requiring native C compilation.

**Actual behavior:** Build fails because `swisseph` tries to compile native code on Vercel's serverless environment.

## Problem Statement

The `swisseph` npm package is a native Node.js addon that requires C compilation. This is incompatible with:
1. Vercel's serverless build environment (no native compilation support)
2. Python 3.12+ (which removed the `distutils` module that `node-gyp` depends on)
3. Edge/serverless runtimes in general

The application needs Swiss Ephemeris calculations for Human Design chart generation, but must use a WASM-based alternative that doesn't require native compilation.

## Solution Statement

Replace the native `swisseph` npm package with `sweph-wasm`, a WebAssembly-based implementation of Swiss Ephemeris that:
1. Works on all platforms without compilation (including Vercel)
2. Runs in both Node.js and browser environments
3. Provides the same planetary calculation capabilities needed for Human Design charts

## Steps to Reproduce

1. Push code to GitHub on the `feature/cosmic-ui-redesign` branch
2. Trigger Vercel deployment
3. Observe build failure during `npm install` phase
4. Check logs for `node-gyp rebuild` error in `/vercel/path0/node_modules/swisseph`

Or locally:
```bash
# Simulate Vercel build with Python 3.12
npm ci
# If on Python 3.12+, swisseph will fail to install
```

## Root Cause Analysis

1. **Package.json contains `swisseph`**: The native ephemeris package requires C compilation
2. **Vercel uses Python 3.12**: Python 3.12 removed the `distutils` module entirely
3. **node-gyp depends on distutils**: The build tool chain fails immediately
4. **Previous WASM migration was reverted**: Commit `9dc4cba` mentions "replace swisseph with sweph-wasm" but the code currently uses native `swisseph`

The `app_docs/feature-cosmic-ui-redesign.md` documentation states:
> "The ephemeris library was switched from `sweph-wasm` to native `swisseph` for better cross-platform compatibility"

This is incorrect - native modules are LESS cross-platform compatible, not more. The switch should be reversed.

## Relevant Files

Use these files to fix the bug:

### Core Files to Modify

- **`package.json`**: Contains the `swisseph` dependency that must be replaced with `sweph-wasm`
- **`src/lib/calculation/ephemeris.ts`**: Main file using swisseph API - needs complete rewrite to use sweph-wasm async API
- **`next.config.mjs`**: Contains `serverComponentsExternalPackages: ['swisseph']` which needs to be removed
- **`tests/ephemeris.test.ts`**: Tests the ephemeris module - needs updates for async WASM initialization

### Reference Files (no changes needed)

- **`src/lib/calculation/mandala.ts`**: Uses `longitudeToGateLine()` from ephemeris - no changes needed, already properly imported
- **`src/types/index.ts`**: Type definitions for Activation, Activations, Planet - no changes needed
- **`src/lib/calculation/chart.ts`**: Imports from ephemeris - may need async handling updates

### Documentation to Update

- **`app_docs/feature-cosmic-ui-redesign.md`**: Correct the inaccurate statement about swisseph vs sweph-wasm

## Step by Step Tasks

### Step 1: Replace swisseph with sweph-wasm in package.json

- Remove `swisseph` from dependencies
- Add `sweph-wasm` package: `npm install sweph-wasm@latest`
- Remove any references to swisseph in devDependencies if present

### Step 2: Update next.config.mjs

- Remove `serverComponentsExternalPackages: ['swisseph']` from experimental config
- WASM packages don't need external package configuration

### Step 3: Rewrite src/lib/calculation/ephemeris.ts for sweph-wasm

Replace the synchronous swisseph API with the async sweph-wasm API:

- Import and initialize `SwissEPH` from `sweph-wasm`
- Maintain singleton pattern for WASM initialization (expensive to reinitialize)
- Convert `dateToJulianDay()` to use `swe_julday()`
- Convert `getPlanetPosition()` to use `swe_calc_ut()`
- Convert `swe_revjul()` usage for design time calculation
- Keep the same exported function signatures (`calculateActivations`, `calculateTransits`)
- Handle the async nature of WASM initialization

Key API mapping:
| swisseph | sweph-wasm |
|----------|------------|
| `swisseph.swe_julday()` | `swe.swe_julday()` |
| `swisseph.swe_calc_ut()` | `swe.swe_calc_ut()` |
| `swisseph.swe_revjul()` | `swe.swe_revjul()` |
| `swisseph.SE_GREG_CAL` | `1` (gregorian flag) |

### Step 4: Update src/lib/calculation/chart.ts for async ephemeris

- If `calculateActivations` becomes async, update callers to await it
- Check API route handlers that call chart calculation functions

### Step 5: Update tests/ephemeris.test.ts

- Update imports to use sweph-wasm
- Handle async initialization in test setup (beforeAll/beforeEach)
- Keep same test assertions - functionality should be identical

### Step 6: Update documentation

- Correct `app_docs/feature-cosmic-ui-redesign.md` to accurately reflect the change
- Update `README.md` Swiss Ephemeris note to mention WASM compatibility

### Step 7: Run validation commands

- Execute all validation commands to ensure zero regressions

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

- `npm run test` - Run Vitest test suite to validate ephemeris calculations work with zero regressions
- `npm run lint` - Run ESLint to ensure code quality
- `npm run build` - Verify the Next.js build completes successfully (simulates Vercel build)
- `npm run dev` - Start dev server and manually test chart calculation at http://localhost:3000

## Notes

- The `sweph-wasm` package is actively maintained and provides the same Swiss Ephemeris calculations
- WASM initialization is async; consider lazy loading pattern to avoid blocking
- The package size may be slightly larger due to embedded WASM binary, but this is acceptable for serverless compatibility
- No ephemeris data files are needed - sweph-wasm embeds the necessary data
- License: sweph-wasm uses AGPL-3.0 - ensure this is compatible with project licensing
