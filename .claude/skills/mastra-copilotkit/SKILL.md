---
name: mastra-copilotkit
description: Builds AI-powered agentic applications using Mastra and CopilotKit. Use when implementing AI agents, chat interfaces, generative UI, CoAgents, human-in-the-loop workflows, AG-UI protocol integration, or agentic features in Next.js/React. Covers agent creation, tool development, workflows, memory, and frontend integration.
---

# Mastra + CopilotKit Development

Build AI-powered agentic applications using Mastra (TypeScript AI framework) and CopilotKit (agentic frontend framework). This skill covers agent creation, tool development, and real-time AI-powered features in Next.js applications.

## When to Use This Skill

- Implementing AI agents with tool-calling capabilities
- Building chat interfaces with AI copilots
- Creating generative UI that renders based on agent state
- Adding human-in-the-loop approval workflows
- Integrating frontend state with backend agents via AG-UI protocol

## Quick Start

### Installation

```bash
# Mastra
npm install @mastra/core@latest zod

# CopilotKit
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime

# AG-UI Mastra Adapter
npm install @ag-ui/mastra
```

Or use the init script: `scripts/init-project.sh my-app`

### Environment Variables

```bash
# .env.local
OPENAI_API_KEY=your-key
# ANTHROPIC_API_KEY=your-key
```

## Project Setup Workflow

Copy this checklist and track progress:

- [ ] Install dependencies (Mastra + CopilotKit packages)
- [ ] Configure API keys in `.env.local`
- [ ] Create Mastra instance (`src/mastra/index.ts`)
- [ ] Create agent(s) (`src/mastra/agents/`)
- [ ] Setup `/api/copilotkit` route (use `assets/copilotkit-route.ts`)
- [ ] Wrap app in `<CopilotKit>` provider
- [ ] Add chat component
- [ ] Test with Mastra Studio at `localhost:4111`

## Project Structure

```
src/
├── mastra/
│   ├── index.ts           # Mastra instance
│   ├── agents/            # Agent definitions
│   ├── tools/             # Tool definitions
│   └── workflows/         # Workflow definitions
├── app/
│   ├── api/copilotkit/
│   │   └── route.ts       # CopilotKit runtime
│   └── layout.tsx         # CopilotKit provider
└── components/chat/
```

## Creating Agents

### Basic Agent

```typescript
// src/mastra/agents/assistant.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
// Or use other providers:
// import { anthropic } from "@ai-sdk/anthropic";
// import { google } from "@ai-sdk/google";

export const assistantAgent = new Agent({
  name: "assistant",
  instructions: `You are a helpful assistant.
    When uncertain, ask clarifying questions.
    Use available tools to provide accurate information.`,
  model: openai("gpt-4o"),
  // model: anthropic("claude-sonnet-4-20250514"),
  // model: google("gemini-3-flash"),
});
```

### Agent with Tools

```typescript
import { Agent } from "@mastra/core/agent";
import { weatherTool, chartTool } from "../tools";

export const hdGuideAgent = new Agent({
  name: "hd-guide",
  instructions: `You are a Human Design analyst.
    Use calculateChart for birth data.
    Use getGateInfo for gate details.`,
  model: openai("gpt-4o"),
  tools: { weatherTool, chartTool },
});
```

### Mastra Instance

```typescript
// src/mastra/index.ts
import { Mastra } from "@mastra/core";
import { assistantAgent, hdGuideAgent } from "./agents";

export const mastra = new Mastra({
  agents: { assistantAgent, hdGuideAgent },
});
```

## Creating Tools

```typescript
// src/mastra/tools/weather.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City name"),
    units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
  }),
  execute: async ({ context }) => {
    const { location, units } = context;
    const data = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`)
      .then(r => r.json());
    return {
      temperature: units === "celsius" ? data.current_condition[0].temp_C : data.current_condition[0].temp_F,
      conditions: data.current_condition[0].weatherDesc[0].value,
    };
  },
});
```

**Tool Best Practices:**
- Clear descriptions help LLM decide when to use
- Use Zod `.describe()` for parameters
- Return meaningful errors the LLM can interpret
- Keep tools atomic (one thing per tool)

## CopilotKit Integration

### API Route

```typescript
// src/app/api/copilotkit/route.ts
import { CopilotRuntime, ExperimentalEmptyAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";

export async function POST(req: NextRequest) {
  const agents = MastraAgent.getLocalAgents({
    mastra,
    agentId: "hdGuideAgent",
  });

  const runtime = new CopilotRuntime({ agents });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}
```

### Provider Setup

```typescript
// src/app/layout.tsx
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
```

### Chat Component

```typescript
"use client";
import { CopilotChat } from "@copilotkit/react-ui";

export function ChatInterface() {
  return (
    <CopilotChat
      labels={{
        title: "AI Assistant",
        initial: "How can I help you today?",
        placeholder: "Ask me anything...",
      }}
    />
  );
}
```

## Essential Hooks

### useCopilotReadable - Share State

```typescript
import { useCopilotReadable } from "@copilotkit/react-core";

function ChartDisplay({ chart }) {
  useCopilotReadable({
    description: "User's current Human Design chart",
    value: chart,
  });
  return <div>{/* render */}</div>;
}
```

### useCopilotAction - Enable Actions

```typescript
import { useCopilotAction } from "@copilotkit/react-core";

useCopilotAction({
  name: "calculateChart",
  description: "Calculate a Human Design chart",
  parameters: [
    { name: "birthDate", type: "string", required: true },
    { name: "birthTime", type: "string", required: true },
    { name: "birthPlace", type: "string", required: true },
  ],
  handler: async ({ birthDate, birthTime, birthPlace }) => {
    const chart = await calculateChart({ birthDate, birthTime, birthPlace });
    return `Chart: ${chart.type} with ${chart.authority}`;
  },
});
```

### useCoAgent - Bidirectional State

```typescript
import { useCoAgent } from "@copilotkit/react-core";

const { state, setState } = useCoAgent({
  name: "hdGuideAgent",
  initialState: { analysisDepth: "basic" },
});
```

### useAgent (v2) - Advanced Features

```typescript
import { useAgent } from "@copilotkit/react-core/v2";

const { agent, state } = useAgent({
  agentId: "my-agent",
});
// Shared state, time travel, multi-agent support
```

See `references/hooks-reference.md` for complete API.

## Generative UI

Render React components based on action execution:

```typescript
useCopilotAction({
  name: "showWeather",
  description: "Display weather information",
  parameters: [...],
  render: ({ status, args, result }) => {
    if (status === "executing") return <WeatherSkeleton />;
    if (status === "complete") return <WeatherCard data={result} />;
    return null;
  },
  handler: async ({ location }) => fetchWeather(location),
});
```

**Three Generative UI patterns:**
1. **Static** - Pre-defined components, agent selects (most reliable)
2. **Declarative** - Component registry with flexible props (recommended)
3. **Open-Ended** - Fully generated UI (prototype only)

See `references/generative-ui.md` for patterns and HITL examples.

## Mastra Workflows

```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const fetchStep = createStep({
  id: "fetch",
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({ data: z.any() }),
  execute: async ({ context }) => {
    return { data: await db.users.findUnique({ where: { id: context.userId } }) };
  },
});

const analyzeStep = createStep({
  id: "analyze",
  inputSchema: z.object({ data: z.any() }),
  outputSchema: z.object({ analysis: z.string() }),
  execute: async ({ context, mastra }) => {
    const agent = mastra.getAgent("assistantAgent");
    const result = await agent.generate(`Analyze: ${JSON.stringify(context.data)}`);
    return { analysis: result.text };
  },
});

export const analysisWorkflow = createWorkflow({
  name: "user-analysis",
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({ analysis: z.string() }),
})
  .then(fetchStep)
  .then(analyzeStep)
  .commit();
```

**Control flow:** `.then()`, `.branch()`, `.parallel()`

## AG-UI Protocol

CopilotKit v1.50+ uses AG-UI for agent-frontend communication:

| Event Category | Events |
|----------------|--------|
| Lifecycle | `RUN_STARTED`, `RUN_FINISHED` |
| Text | `TEXT_MESSAGE_START/CONTENT/END` |
| Tools | `TOOL_CALL_START/ARGS/END` |
| State | `STATE_SNAPSHOT`, `STATE_DELTA` |

See `references/ag-ui-protocol.md` for streaming architecture.

## UI Components

```typescript
// Full chat
import { CopilotChat } from "@copilotkit/react-ui";
<CopilotChat labels={{ title: "Assistant" }} />

// Popup
import { CopilotPopup } from "@copilotkit/react-ui";
<CopilotPopup defaultOpen={false} />

// Sidebar
import { CopilotSidebar } from "@copilotkit/react-ui";
<CopilotSidebar>{children}</CopilotSidebar>
```

## Multi-Provider Model Support

Mastra supports 600+ models from OpenAI, Anthropic, Google, and OpenRouter.

### Quick Provider Setup

```bash
# .env.local - Choose your provider
OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GEMINI_API_KEY=...
```

### Environment-Based Model Abstraction

Use `assets/model-factory.ts` for seamless provider switching:

```typescript
import { getModel, defaultModel } from "@/lib/model-factory";

// Uses AI_PROVIDER and AI_MODEL from env
const agent = new Agent({ model: defaultModel });

// Or explicit selection
const agent = new Agent({ model: getModel("google", "gemini-3-flash") });
```

This allows switching providers (OpenAI → Gemini → Anthropic) via environment variables without code changes.

See `references/mastra-advanced.md` for full model factory pattern and provider-specific options.

## Best Practices

**Agent Instructions:**
- Be specific about role and capabilities
- List available tools and when to use them
- Include guardrails and limitations

**Frontend Integration:**
- Share only relevant state with `useCopilotReadable`
- Use `useCopilotAction` for UI-triggering operations
- Implement loading states for agent responses

**Performance:**
- Stream responses for better UX
- Use parallel workflow steps when possible
- Cache frequently-accessed data

## Debugging

**Mastra Studio:** `npm run dev` → `http://localhost:4111`
- Test agents interactively
- Inspect tool calls
- View memory state

**Common Issues:**
- Agent not responding → Check API keys in `.env`
- Tools not called → Improve tool descriptions
- State not syncing → Ensure `useCoAgent` names match agent IDs

## Bundled Resources

| Directory | Contents |
|-----------|----------|
| `references/ag-ui-protocol.md` | AG-UI events, streaming |
| `references/generative-ui.md` | UI patterns, HITL |
| `references/hooks-reference.md` | Complete hook API |
| `references/mastra-advanced.md` | Memory, MCP, routing, Gemini, model abstraction |
| `scripts/init-project.sh` | Project scaffolding |
| `assets/copilotkit-route.ts` | CopilotKit API route template |
| `assets/model-factory.ts` | Provider-agnostic model selection |
| `assets/example-agent.ts` | Agent template with tools |

## External Resources

- [Mastra Docs](https://mastra.ai/docs)
- [CopilotKit Docs](https://docs.copilotkit.ai)
- [AG-UI Protocol](https://docs.ag-ui.com)
