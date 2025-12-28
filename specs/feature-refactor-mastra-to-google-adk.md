# Feature: Refactor from Mastra to Google ADK (TypeScript)

## Feature Description
Replace the current Mastra-based AI agent framework with Google's Agent Development Kit (ADK) for TypeScript. This refactor addresses ongoing issues with Mastra's stability and reliability while leveraging Google's well-documented, production-ready agent framework. The new implementation will maintain full CopilotKit integration via the AG-UI protocol, preserving the existing chat UI and Human Design analysis functionality.

## User Story
As a Human Design enthusiast
I want to chat with a reliable AI guide about my Human Design chart
So that I can receive accurate, consistent interpretations and personalized guidance about my type, authority, profile, and centers

## Problem Statement
The current Mastra integration is not working reliably:
- The `@ag-ui/mastra` and `@mastra/core` packages have compatibility issues with CopilotKit
- Agent memory management is inconsistent
- Tool execution is unreliable
- Debug logs show issues with `getMemory()` and agent retrieval

## Solution Statement
Migrate to Google ADK (Agent Development Kit) TypeScript implementation which:
1. Provides a more stable, well-documented agent framework backed by Google
2. Has official CopilotKit integration support via AG-UI protocol
3. Offers a simpler tool definition pattern using Zod schemas
4. Supports built-in streaming and state management
5. Can use either Gemini or other LLMs through configuration

## Relevant Files
Use these files to implement the feature:

### Existing Files to Modify
- `src/app/api/copilotkit/route.ts` - Current CopilotKit runtime endpoint using MastraAgent; needs complete refactor to use ADK HTTP agent
- `src/lib/agents/index.ts` - Mastra initialization; replace with ADK agent exports
- `src/lib/agents/hd-guide.ts` - HD Guide agent definition using Mastra Agent class; rewrite for ADK LlmAgent
- `src/lib/agents/tools/index.ts` - Tool exports; update for ADK FunctionTool pattern
- `src/lib/agents/tools/calculate-chart.ts` - Chart calculation tool using Mastra createTool; convert to ADK FunctionTool
- `src/lib/agents/tools/get-gate-info.ts` - Gate info tool; convert to ADK FunctionTool
- `src/lib/agents/tools/get-channel-info.ts` - Channel info tool; convert to ADK FunctionTool
- `src/lib/agents/tools/get-transit.ts` - Transit calculation tool; convert to ADK FunctionTool
- `src/app/layout.tsx` - CopilotKit provider configuration; may need agent name update
- `package.json` - Remove Mastra dependencies, add Google ADK packages
- `.env.local` - Added GOOGLE_API_KEY

### New Files
- `src/lib/agents/server.ts` - ADK agent server setup with FastAPI-style endpoint using Next.js route handler
- `tests/agents/adk-agent.test.ts` - Integration tests for ADK agent and tools

## Implementation Plan

### Phase 1: Foundation
1. **Install ADK Dependencies**
   - Add `@google/adk` package for agent framework
   - Add `@ag-ui/client` for AG-UI protocol integration
   - Remove `@mastra/core`, `@mastra/memory`, and `@ag-ui/mastra` packages

2. **Configure Environment**
   - GOOGLE_API_KEY already added to environment variables
   - Verify Next.js compatibility with ADK packages

### Phase 2: Core Implementation
1. **Convert Tools to ADK FunctionTool Pattern**
   - Rewrite `calculate-chart.ts` using ADK FunctionTool with Zod schema
   - Rewrite `get-gate-info.ts` using ADK FunctionTool
   - Rewrite `get-channel-info.ts` using ADK FunctionTool
   - Rewrite `get-transit.ts` using ADK FunctionTool
   - Export all tools from `tools/index.ts`

2. **Create ADK Agent**
   - Rewrite `hd-guide.ts` using ADK LlmAgent class
   - Configure model (gemini-3-flash-preview)
   - Set comprehensive HD Guide instructions
   - Attach converted tools to agent
   - Update `index.ts` to export ADK agent

3. **Create Agent Server Endpoint**
   - Create AG-UI compatible endpoint in `src/app/api/copilotkit/route.ts`
   - Use HttpAgent from `@ag-ui/client` to connect CopilotKit to ADK agent
   - Configure CopilotRuntime with ExperimentalEmptyAdapter (agent handles LLM)
   - Set up proper error handling and logging

### Phase 3: Integration
1. **Update CopilotKit Provider**
   - Verify agent name matches in `layout.tsx`
   - Ensure runtimeUrl points to correct endpoint
   - Test chat UI connectivity

2. **Verify Frontend Integration**
   - Test CopilotChat component with new agent
   - Verify `useCopilotReadable` still provides chart context
   - Test tool invocations from chat

## Step by Step Tasks

### Step 1: Update Dependencies
- Remove Mastra packages from package.json:
  - `@ag-ui/mastra`
  - `@mastra/core`
  - `@mastra/memory`
- Add Google ADK packages:
  - `@google/adk`
  - `@ag-ui/client` (for HttpAgent)
- Run `bun install` to update dependencies

### Step 2: Configure Environment Variables
- User already added to `.env.local`:
  - `GOOGLE_API_KEY=your_google_api_key` (for Gemini)

### Step 3: Convert calculate-chart Tool
- Rewrite `src/lib/agents/tools/calculate-chart.ts`:
  - Import `FunctionTool` from `@google/adk`
  - Define input schema using Zod
  - Create tool with description and execute function
  - Maintain existing API call logic to `/api/chart`

### Step 4: Convert get-gate-info Tool
- Rewrite `src/lib/agents/tools/get-gate-info.ts`:
  - Convert to ADK FunctionTool pattern
  - Keep existing GATES data structure
  - Implement execute function with gate lookup

### Step 5: Convert get-channel-info Tool
- Rewrite `src/lib/agents/tools/get-channel-info.ts`:
  - Convert to ADK FunctionTool pattern
  - Maintain channel lookup from reference data
  - Keep circuit and stream descriptions

### Step 6: Convert get-transit Tool
- Rewrite `src/lib/agents/tools/get-transit.ts`:
  - Convert to ADK FunctionTool pattern
  - Maintain API call to `/api/transit`
  - Handle optional datetime parameter

### Step 7: Update Tools Index
- Update `src/lib/agents/tools/index.ts`:
  - Export all converted ADK FunctionTools
  - Use consistent naming pattern

### Step 8: Create ADK HD Guide Agent
- Rewrite `src/lib/agents/hd-guide.ts`:
  - Import `LlmAgent` from `@google/adk`
  - Create agent with name "hdGuide"
  - Set model to `gemini-3-flash-preview` (or configurable)
  - Add comprehensive HD instructions (preserve existing)
  - Attach all tools
  - Export agent

### Step 9: Update Agent Index
- Rewrite `src/lib/agents/index.ts`:
  - Remove Mastra initialization
  - Export ADK agent directly
  - Provide typed exports

### Step 10: Create CopilotKit Runtime Route
- Rewrite `src/app/api/copilotkit/route.ts`:
  - Import HttpAgent from `@ag-ui/client`
  - Import CopilotRuntime, ExperimentalEmptyAdapter from `@copilotkit/runtime`
  - Create HttpAgent pointing to ADK agent endpoint
  - Configure CopilotRuntime with agent
  - Handle POST requests

### Step 11: Create ADK Agent Server (if needed)
- If ADK requires separate server process:
  - Create `src/lib/agents/server.ts` for standalone agent
  - Configure to run on port 8000
  - Expose AG-UI compatible endpoint
  - Add npm script to run agent server

### Step 12: Update Layout Provider
- Review `src/app/layout.tsx`:
  - Ensure agent name matches ("hdGuide")
  - Verify runtimeUrl is correct

### Step 13: Write Integration Tests
- Create `tests/agents/adk-agent.test.ts`:
  - Test tool execution (calculate chart, get gate info, etc.)
  - Test agent response generation
  - Test CopilotKit integration

### Step 14: Run Validation Commands
- Execute all validation commands to ensure zero regressions

## Testing Strategy

### Unit Tests
- Test each ADK FunctionTool in isolation
- Verify input validation with Zod schemas
- Test tool output formatting
- Mock API calls for chart and transit calculations

### Integration Tests
- Test ADK agent with all tools attached
- Verify agent can invoke tools based on user queries
- Test CopilotKit runtime integration
- Verify streaming responses work correctly

### Edge Cases
- Empty or invalid birth data input
- Missing gate/channel information
- API timeout handling
- Model rate limiting
- Invalid datetime formats
- Out-of-range gate numbers (< 1 or > 64)
- Invalid coordinates

## Acceptance Criteria
- [ ] All Mastra packages removed from dependencies
- [ ] Google ADK packages installed and configured
- [ ] All four tools (calculate-chart, get-gate-info, get-channel-info, get-transit) converted to ADK FunctionTool pattern
- [ ] HD Guide agent created using ADK LlmAgent
- [ ] CopilotKit runtime properly connects to ADK agent
- [ ] Chat UI successfully communicates with new agent
- [ ] Agent can calculate charts from birth data
- [ ] Agent can explain gates, channels, and transits
- [ ] Chart context is properly passed via useCopilotReadable
- [ ] No console errors in browser or server
- [ ] All existing functionality preserved
- [ ] Tests pass with zero failures
- [ ] Build completes successfully
- [ ] Lint passes with no errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run Vitest test suite to validate the feature works with zero regressions
- `bun run lint` - Run ESLint to ensure code quality
- `bun run build` - Verify the build completes successfully
- `bun run dev` - Start development server to manually test chat functionality
- Manual validation: Open app, calculate a chart, test chat with questions like:
  - "What is my type and strategy?"
  - "Tell me about Gate 13"
  - "What are my defined channels?"
  - "What are the current transits?"

## Notes

### ADK vs Mastra Architecture Differences
- **Mastra**: Uses `Agent` class with `createTool()` helper, memory via `@mastra/memory`
- **ADK**: Uses `LlmAgent` class with `FunctionTool`, built-in session management

### Model Configuration
The ADK supports multiple LLM providers:
- Default: `gemini-3-flash-preview` (requires GOOGLE_API_KEY)
- Consider making model configurable via environment variable

### AG-UI Protocol
CopilotKit connects to ADK agents via the AG-UI protocol. Key points:
- Use `HttpAgent` from `@ag-ui/client` to wrap the ADK agent endpoint
- Use `ExperimentalEmptyAdapter` since the agent handles LLM calls
- The agent runs as an HTTP endpoint, not in-process

### Dependencies to Add
```json
{
  "@google/adk": "latest",
  "@ag-ui/client": "latest"
}
```

### Dependencies to Remove
```json
{
  "@ag-ui/mastra": "^0.2.0",
  "@mastra/core": "^0.24.9",
  "@mastra/memory": "^0.15.13"
}
```
