# Chore: Reimplement Mastra Agent Integration Correctly

## Chore Description

The previous Mastra + CopilotKit integration failed because the original spec (`specs/feature-mastra-copilotkit-openai-assistant.md`) incorrectly recommended using `LangGraphAdapter` to connect Mastra agents to CopilotKit. LangGraph and Mastra are incompatible frameworks - `LangGraphAdapter` expects a LangGraph `CompiledGraph`, not a Mastra `Agent`.

The correct integration path uses the AG-UI protocol via `@ag-ui/mastra` package with `MastraAgent.getLocalAgents()`. This chore fixes all integration issues:

1. **API Route**: Currently uses `OpenAIAdapter` (bypassing Mastra entirely) - needs `MastraAgent` + `ExperimentalEmptyAdapter`
2. **Agent Model**: Uses invalid string format - needs AI SDK model instance
3. **Tool Imports**: Use incorrect import path - needs `@mastra/core/tools`
4. **Missing Package**: `@ai-sdk/openai` not installed
5. **README**: Still references deprecated Python agent

## Relevant Files

Use these files to resolve the chore:

### Files to Modify

- `src/app/api/copilotkit/route.ts` - **Critical**: Replace `OpenAIAdapter` with `MastraAgent` + `ExperimentalEmptyAdapter` to actually connect Mastra agent
- `src/lib/agents/hd-guide.ts` - Fix model configuration from string to AI SDK model instance
- `src/lib/agents/tools/calculate-chart.ts` - Fix import path from `@mastra/core` to `@mastra/core/tools`
- `src/lib/agents/tools/get-gate-info.ts` - Fix import path from `@mastra/core` to `@mastra/core/tools`
- `src/lib/agents/tools/get-channel-info.ts` - Fix import path from `@mastra/core` to `@mastra/core/tools`
- `src/lib/agents/tools/get-transit.ts` - Fix import path from `@mastra/core` to `@mastra/core/tools`
- `package.json` - Add `@ai-sdk/openai` dependency
- `README.md` - Update AI Agent stack info from "Pydantic AI (Python)" to "Mastra (TypeScript)"

### Reference Files (Read Only)

- `.claude/skills/mastra-copilotkit/assets/copilotkit-route.ts` - Template for correct API route implementation
- `.claude/skills/mastra-copilotkit/assets/example-agent.ts` - Template for correct agent configuration
- `.claude/skills/mastra-copilotkit/references/ag-ui-protocol.md` - AG-UI protocol documentation

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Install Missing AI SDK Package

Install the required `@ai-sdk/openai` package that Mastra needs to instantiate OpenAI models:

- Run: `npm install @ai-sdk/openai`
- Verify installation in `package.json`

### Step 2: Fix Tool Import Paths

Update all four tool files to use the correct import path:

**For each file in `src/lib/agents/tools/`:**
- Change: `import { createTool } from '@mastra/core';`
- To: `import { createTool } from '@mastra/core/tools';`

Files to update:
- `src/lib/agents/tools/calculate-chart.ts`
- `src/lib/agents/tools/get-gate-info.ts`
- `src/lib/agents/tools/get-channel-info.ts`
- `src/lib/agents/tools/get-transit.ts`

### Step 3: Fix Agent Model Configuration

Update `src/lib/agents/hd-guide.ts`:

- Add import: `import { openai } from '@ai-sdk/openai';`
- Change model from string format to AI SDK instance:
  - From: `model: 'openai/gpt-5.2-2025-12-11',`
  - To: `model: openai('gpt-4o'),`

Note: Using `gpt-4o` as it's a real, available model. The string `gpt-5.2-2025-12-11` doesn't exist.

### Step 4: Connect Mastra to CopilotKit API Route

This is the critical fix. Update `src/app/api/copilotkit/route.ts`:

**Remove:**
- `OpenAIAdapter` import and usage
- `systemPromptPreamble` (instructions are in the agent)

**Add:**
- `MastraAgent` from `@ag-ui/mastra`
- `ExperimentalEmptyAdapter` from `@copilotkit/runtime`
- Import `mastra` from `@/lib/agents`

**New implementation pattern:**
```typescript
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { MastraAgent } from '@ag-ui/mastra';
import { NextRequest } from 'next/server';
import { mastra } from '@/lib/agents';

export async function POST(req: NextRequest) {
  const agents = MastraAgent.getLocalAgents({
    mastra,
    agentId: 'hdGuide',  // Must match key in mastra config
  });

  const runtime = new CopilotRuntime({ agents });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
}
```

### Step 5: Update README

Update `README.md` to reflect the correct AI stack:

- Change line 13 from: `- **AI Agent**: Pydantic AI (Python)`
- To: `- **AI Agent**: Mastra (TypeScript)`
- Remove references to `agent/` Python directory in project structure and setup sections

### Step 6: Run Validation Commands

Execute every command to validate the chore is complete with zero regressions.

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run lint` - Run ESLint to ensure code quality and no import errors
- `npm run build` - Verify the build completes successfully (critical: will catch type errors in Mastra integration)
- `npm run test` - Run Vitest test suite to validate with zero regressions
- Manual test: Start dev server (`npm run dev`), open app, calculate a chart, open chat, and ask the agent about the chart

## Notes

### Why The Original Implementation Failed

The spec at `specs/feature-mastra-copilotkit-openai-assistant.md` lines 142-156 recommended:
```typescript
import { CopilotRuntime, LangGraphAdapter } from "@copilotkit/runtime";
const adapter = new LangGraphAdapter({ agent: mastra.agents.hdGuide });
```

This is fundamentally wrong because:
1. `LangGraphAdapter` is for LangGraph (LangChain's graph framework), not Mastra
2. Mastra agents have a completely different API than LangGraph graphs
3. The types are incompatible and runtime behavior would fail

### The Correct Integration Path

CopilotKit v1.50+ uses the AG-UI protocol. Mastra has an official adapter:
- Package: `@ag-ui/mastra`
- Function: `MastraAgent.getLocalAgents({ mastra, agentId })`
- This wraps Mastra agents to emit AG-UI events that CopilotKit understands

### Agent ID Mapping

The `agentId` in `MastraAgent.getLocalAgents()` must match the key in the Mastra config:
```typescript
// src/lib/agents/index.ts
export const mastra = new Mastra({
  agents: {
    hdGuide: hdGuideAgent,  // Key is "hdGuide"
  },
});
```

### Model Considerations

- The agent currently specifies `gpt-5.2-2025-12-11` which doesn't exist
- Recommend using `gpt-4o` for best performance or `gpt-4o-mini` for cost efficiency
- Ensure `OPENAI_API_KEY` is set in `.env.local`
