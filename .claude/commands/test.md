---
description: Analyze changes, write tests, run all tests, verify build, and create e2e test plan for UI changes
---

# Test Command

Analyze uncommitted changes, write necessary tests, run comprehensive testing, and create e2e test plans for UI changes.

## Phase 1: Analyze Changes and Identify Testing Needs

First, analyze what has changed and what testing is needed.

### 1.1 Gather Change Information

Run these commands to understand what changed:
- `git diff HEAD` - see all uncommitted changes
- `git status` - see changed/added files
- `git diff --name-only HEAD` - list of changed files

### 1.2 Categorize Changes

For each changed file, categorize it:

**Code requiring unit tests:**
- Utility functions, helpers, libraries (`lib/`, `utils/`, `helpers/`)
- API routes and handlers (`api/`, `routes/`, `server/`)
- Data models and schemas (`models/`, `schemas/`, `types/`)
- Business logic (`services/`, `actions/`)
- Hooks and state management (`hooks/`, `store/`, `context/`)

**Code requiring e2e tests (UI changes):**
- React components (`*.tsx`, `*.jsx`)
- Stylesheets (`*.css`, `*.scss`, `*.sass`, `*.less`)
- Pages and views (`pages/`, `views/`, `app/`)
- Component directories (`components/`, `ui/`)

### 1.3 Check Existing Test Coverage

For each changed file, check if tests already exist:
- Look for corresponding `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx` files
- Check `tests/` or `__tests__/` directories for related test files

## Phase 2: Write Missing Tests

For changed code that lacks test coverage, write appropriate tests.

### 2.1 Unit Tests

For utility functions, API routes, hooks, and business logic:

1. Create test files following project conventions (e.g., `foo.test.ts` next to `foo.ts`)
2. Write tests that cover:
   - Happy path scenarios
   - Edge cases
   - Error conditions
3. Use existing test patterns from the codebase as reference

**Test file location conventions:**
- Colocated: `src/utils/helpers.ts` → `src/utils/helpers.test.ts`
- Separate directory: `src/utils/helpers.ts` → `tests/utils/helpers.test.ts`

### 2.2 Check Test Infrastructure

Before writing tests, verify test infrastructure exists:
- Check for `vitest.config.ts`, `jest.config.js`, or similar
- Check `package.json` for test scripts and test dependencies
- If no test infrastructure exists, set it up first (vitest recommended for modern projects)

## Phase 3: Run Build Verification

Run the full build verification pipeline:

```bash
nvm use 20 && bun install && bun run lint && bun test && bun run build
```

If any step fails, stop and report the failure with details about what went wrong.

## Phase 4: E2E Test Planning (If UI Changes Detected)

If UI changes were detected in Phase 1, create and execute an e2e test plan.

### 4.1 Analyze UI Changes

For each UI change, determine:
1. What component/page was modified
2. What user-facing behavior might be affected
3. What interactions need to be tested (clicks, forms, navigation)

### 4.2 Create Test Plan

Generate a structured e2e test plan with test cases organized into parallel batches.

**Test plan format:**
```
Batch 1 (parallel):
  - Test: [description]
    Steps: [what to do]
    Expected: [what should happen]

Batch 2 (parallel):
  - Test: [description]
    Steps: [what to do]
    Expected: [what should happen]
```

### 4.3 Execute E2E Tests in Parallel

Use the Task tool to spawn multiple parallel agents with the haiku model (`model: "haiku"`) to run e2e tests.

**Important execution rules:**
- Group tests into small batches of 2-3 tests per agent
- Launch all batch agents in parallel using a single message with multiple Task tool calls
- Each agent should use `run_in_background: true`
- Use `subagent_type: "general-purpose"` with `model: "haiku"`
- Each agent's prompt should include:
  1. Instructions to use the dev-browser skill
  2. The specific test cases to execute
  3. Instructions to report pass/fail status for each test

Example agent launch pattern:
```
Task tool calls (all in one message for parallel execution):
  - Agent 1: Tests batch 1 (run_in_background: true, model: haiku)
  - Agent 2: Tests batch 2 (run_in_background: true, model: haiku)
  - Agent 3: Tests batch 3 (run_in_background: true, model: haiku)
```

After launching all agents, use TaskOutput to wait for and collect results from all agents.

## Phase 5: Report Results

Provide a summary report:

1. **Changes Analyzed**: List of files changed and their categories
2. **Tests Written**: New test files created and what they cover
3. **Build Status**: Pass/Fail for each step (lint, test, build)
4. **UI Changes Detected**: List of UI files that were modified
5. **E2E Test Results** (if applicable):
   - Total tests run
   - Passed/Failed counts
   - Details of any failures

## Notes

- If no changes require testing, report that no new tests are needed
- If no UI changes are detected, skip Phase 4 and report that no e2e testing is needed
- Use the existing dev-browser skill setup (start server with `./skills/dev-browser/server.sh &`)
- For local development, tests should target `http://localhost:3000` or the configured dev server
- All package management commands use `bun` instead of `npm`
