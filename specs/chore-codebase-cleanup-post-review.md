# Chore: Codebase Cleanup Post-Review

## Chore Description

This chore addresses multiple code quality issues identified during a comprehensive code review of the Human Design application. The cleanup includes:

1. **Fix drizzle-kit version**: Resolve peer dependency conflict causing Vercel deployment failures (better-auth@1.4.9 requires drizzle-kit@>=0.31.4)
2. **Remove dead ADK agent route**: Delete unused `src/app/api/adk-agent/` directory
3. **Add error handling for sessionStorage**: Wrap sessionStorage operations in try-catch
4. **Extract gate data to reference file**: Move 130+ lines of hardcoded gate data from ElementInfoPanel to `src/lib/reference/gates.ts`
5. **Extract SelectedElement type**: Move duplicate type definition to shared types file
6. **Remove Bodygraph3D and related code**: The 3D bodygraph component is unused in the dashboard (which uses Bodygraph2D) - remove it to reduce bundle size
7. **Clean up gsap types**: Ensure gsap has proper type support
8. **Fix empty catch block**: Capture error variable in catch block
9. **Fix test duplication**: Import convertToUTC from source instead of duplicating

## Relevant Files

Use these files to resolve the chore:

- `package.json` - Contains drizzle-kit version that needs updating and dependencies to clean up
- `src/app/api/adk-agent/route.ts` - Dead code to delete
- `src/app/page.tsx` - Contains sessionStorage.setItem calls that need error handling
- `src/app/dashboard/page.tsx` - Contains sessionStorage operations and empty catch block to fix
- `src/components/chart/ElementInfoPanel.tsx` - Contains hardcoded gate data to extract and imports SelectedElement from Bodygraph3D
- `src/components/chart/Bodygraph3D.tsx` - Unused component to delete, contains SelectedElement type to extract
- `src/components/chart/Bodygraph2D.tsx` - Contains duplicate SelectedElement type definition
- `src/types/index.ts` - Destination for extracted SelectedElement type
- `src/lib/reference/index.ts` - Export barrel to update with new gates export
- `tests/timezone.test.ts` - Contains duplicated convertToUTC function
- `src/components/form/CosmicBirthForm.tsx` - Source of convertToUTC function to extract
- `src/lib/bodygraph/layout.ts` - May have imports from Bodygraph3D to update
- `src/lib/bodygraph/colors.ts` - Used by Bodygraph3D, may need cleanup

### New Files

- `src/lib/reference/gates.ts` - New file for gate reference data (names, descriptions)
- `src/lib/timezone.ts` - New file for shared timezone utilities (extracting convertToUTC)

## Step by Step Tasks

### 1. Update drizzle-kit version in package.json

- Open `package.json`
- Change `"drizzle-kit": "^0.30.0"` to `"drizzle-kit": "^0.31.4"`
- This resolves the peer dependency conflict with better-auth@1.4.9

### 2. Delete dead ADK agent route

- Delete the entire `src/app/api/adk-agent/` directory
- This directory contains only a comment saying functionality moved to /api/copilotkit

### 3. Extract SelectedElement type to shared types

- Open `src/types/index.ts`
- Add the SelectedElement type after the existing type definitions:
  ```typescript
  export type SelectedElement =
    | { type: 'center'; name: CenterName; defined: boolean }
    | { type: 'gate'; number: number; center: CenterName }
    | { type: 'channel'; gates: [number, number]; name: string; circuit: string };
  ```
- Update `src/components/chart/Bodygraph2D.tsx` to import SelectedElement from `@/types` instead of defining it locally
- Update `src/components/chart/ElementInfoPanel.tsx` to import SelectedElement from `@/types` instead of from `./Bodygraph3D`
- Update `src/app/dashboard/page.tsx` to import SelectedElement from `@/types` if it's using it from Bodygraph2D

### 4. Create gates reference file

- Create new file `src/lib/reference/gates.ts`
- Move `GATE_NAMES` and `GATE_DESCRIPTIONS` objects from `src/components/chart/ElementInfoPanel.tsx` to this new file
- Export both as named exports: `export const GATE_NAMES: Record<number, string>` and `export const GATE_DESCRIPTIONS: Record<number, string>`
- Update `src/lib/reference/index.ts` to add `export * from './gates';`
- Update `src/components/chart/ElementInfoPanel.tsx` to import `GATE_NAMES` and `GATE_DESCRIPTIONS` from `@/lib/reference/gates`

### 5. Remove Bodygraph3D component and related code

- Delete `src/components/chart/Bodygraph3D.tsx`
- Verify no other files import from Bodygraph3D (after step 3, ElementInfoPanel should import from @/types)
- Check if `src/lib/bodygraph/colors.ts` exports are only used by Bodygraph3D - if so, consider keeping for future use or documenting

### 6. Add error handling for sessionStorage operations

- Open `src/app/page.tsx`
- Wrap sessionStorage.setItem calls (lines 56-57) in try-catch:
  ```typescript
  try {
    sessionStorage.setItem('chartData', JSON.stringify(result.chart));
    sessionStorage.setItem('birthData', JSON.stringify(result.birth));
  } catch (e) {
    console.error('Failed to save chart to session storage:', e);
  }
  ```

### 7. Fix empty catch block in dashboard

- Open `src/app/dashboard/page.tsx`
- Change the empty catch block (line 48) from `} catch {` to `} catch (error) {`
- Update the console.error to include the error: `console.error('Failed to parse stored chart data:', error);`

### 8. Extract convertToUTC to shared utility

- Create new file `src/lib/timezone.ts`
- Move the `convertToUTC` function from `src/components/form/CosmicBirthForm.tsx` to this new file
- Export it as a named export
- Update `src/components/form/CosmicBirthForm.tsx` to import `convertToUTC` from `@/lib/timezone`
- Update `tests/timezone.test.ts` to import `convertToUTC` from `@/lib/timezone` instead of duplicating the function

### 9. Clean up unused displayColor assignment (optional)

- In `src/components/chart/Bodygraph3D.tsx` there was a no-op assignment `const displayColor = isDefined ? centerColor : centerColor`
- Since we're deleting Bodygraph3D.tsx, this is automatically resolved

### 10. Run validation commands

- Run `npm run test` to verify all tests pass
- Run `npm run lint` to verify no linting errors
- Run `npm run build` to verify build completes successfully

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run test` - Run Vitest test suite to validate the feature works with zero regressions
- `npm run lint` - Run ESLint to ensure code quality
- `npm run build` - Verify the build completes successfully

## Notes

- The `src/lib/bodygraph/colors.ts` and `src/lib/bodygraph/layout.ts` files contain 3D-specific configuration but also general Human Design reference data (channel definitions, center positions). These should be kept as they may be useful for future 2D enhancements or re-implementing 3D later.
- The dashboard currently uses only Bodygraph2D for visualization. If 3D visualization is needed in the future, Bodygraph3D can be re-implemented using the preserved bodygraph library files.
- After running `npm install` to update drizzle-kit, the `package-lock.json` will be updated - this should be committed along with the other changes.
- The gsap package already has bundled types, so no additional @types/gsap package is needed.
