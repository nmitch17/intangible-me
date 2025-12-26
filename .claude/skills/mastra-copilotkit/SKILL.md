---
name: mastra-copilotkit
description: Build AI-powered agentic applications using Mastra and CopilotKit. Use when implementing AI agents, chat interfaces, or agentic features in Next.js/React applications. Covers agent creation, tool development, workflows, memory, and frontend integration.
---

# Mastra + CopilotKit Development Skill

This skill guides development of AI-powered agentic applications using Mastra (TypeScript AI agent framework) and CopilotKit (agentic frontend framework). Use this for building intelligent chat interfaces, AI agents with tools, and real-time AI-powered features in Next.js applications.

## When to Use This Skill

- Implementing AI agents with tool-calling capabilities
- Building chat interfaces with AI copilots
- Creating workflows that combine AI reasoning with structured execution
- Adding memory and context to AI conversations
- Integrating frontend state with backend AI agents

## Technology Overview

### Mastra
Mastra is a TypeScript-first AI agent framework from the Gatsby founders (YC W25). It provides:
- **Agents**: Autonomous systems leveraging LLMs and tools
- **Workflows**: Graph-based execution with `.then()`, `.branch()`, `.parallel()`
- **Tools**: Typed functions agents can invoke
- **Memory**: Conversation history, semantic recall, and working memory
- **Model Routing**: 40+ providers through unified interface

### CopilotKit
CopilotKit is an open-source framework for building agentic React applications:
- **AG-UI Protocol**: Agent-to-user communication
- **React Hooks**: `useCopilotReadable`, `useCopilotAction`, `useCoAgent`
- **UI Components**: `CopilotChat`, `CopilotPopup`, `CopilotSidebar`
- **Human-in-the-Loop**: Approval workflows for agent actions

## Installation

### Mastra Dependencies

```bash
npm install @mastra/core@latest zod@^4
# Optional: memory support
npm install @mastra/memory @mastra/libsql
```

### CopilotKit Dependencies

```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
# For Mastra integration
npm install @ag-ui/mastra @mastra/client-js
```

### Environment Variables

```bash
# .env or .env.local
OPENAI_API_KEY=your-openai-key
# Or use Anthropic
ANTHROPIC_API_KEY=your-anthropic-key
```

## Project Structure

```
src/
├── mastra/
│   ├── index.ts           # Mastra instance configuration
│   ├── agents/
│   │   └── my-agent.ts    # Agent definitions
│   ├── tools/
│   │   └── my-tool.ts     # Tool definitions
│   └── workflows/
│       └── my-workflow.ts # Workflow definitions
├── app/
│   ├── api/
│   │   └── copilotkit/
│   │       └── route.ts   # CopilotKit runtime endpoint
│   ├── layout.tsx         # CopilotKit provider wrapper
│   └── page.tsx
└── components/
    └── chat/
        └── CopilotChat.tsx
```

## Creating Mastra Agents

### Basic Agent

```typescript
// src/mastra/agents/assistant.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";  // or anthropic, google, etc.

export const assistantAgent = new Agent({
  name: "assistant",
  instructions: `You are a helpful assistant. Be concise and accurate.
    When uncertain, ask clarifying questions.
    Use available tools to provide accurate information.`,
  model: openai("gpt-4o"),  // or "openai/gpt-4o" with Mastra router
  // model: anthropic("claude-sonnet-4-20250514"),  // Anthropic option
});
```

### Agent with Tools

```typescript
// src/mastra/agents/hd-guide.ts
import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";
import { calculateChartTool, getGateInfoTool } from "../tools";

export const hdGuideAgent = new Agent({
  name: "hd-guide",
  instructions: `You are an expert Human Design analyst.
    Use the calculateChart tool to generate charts from birth data.
    Use getGateInfo to provide detailed gate information.
    Always explain concepts in accessible language.`,
  model: anthropic("claude-sonnet-4-20250514"),
  tools: {
    calculateChartTool,
    getGateInfoTool,
  },
});
```

### Agent with Memory

```typescript
// src/mastra/agents/conversational-agent.ts
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";

export const conversationalAgent = new Agent({
  name: "conversational-agent",
  instructions: "You are a helpful assistant with memory of past conversations.",
  model: openai("gpt-4o"),
  memory: new Memory({
    storage: new LibSQLStore({ url: "file:agent-memory.db" }),
    // Memory types enabled:
    // - conversationHistory: recent messages
    // - semanticRecall: vector search of past messages
    // - workingMemory: persistent user preferences
  }),
});
```

## Creating Tools

### Basic Tool Structure

```typescript
// src/mastra/tools/weather-tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Fetches current weather for a location. Use when user asks about weather.",
  inputSchema: z.object({
    location: z.string().describe("City name or location"),
    units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
    humidity: z.number(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    const { location, units } = context;
    // Fetch weather from API
    const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
    const data = await response.json();

    return {
      temperature: units === "celsius"
        ? data.current_condition[0].temp_C
        : data.current_condition[0].temp_F,
      conditions: data.current_condition[0].weatherDesc[0].value,
      humidity: parseInt(data.current_condition[0].humidity),
      location,
    };
  },
});
```

### Tool with Database Access

```typescript
// src/mastra/tools/chart-tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@/db";
import { calculateChart } from "@/lib/calculation/chart";

export const calculateChartTool = createTool({
  id: "calculate-chart",
  description: "Calculate a Human Design chart from birth data. Required: date, time, and location.",
  inputSchema: z.object({
    birthDate: z.string().describe("Birth date in YYYY-MM-DD format"),
    birthTime: z.string().describe("Birth time in HH:MM format (24-hour)"),
    birthPlace: z.string().describe("City and country of birth"),
    timezone: z.string().optional().describe("IANA timezone, e.g., 'America/New_York'"),
  }),
  outputSchema: z.object({
    type: z.string(),
    authority: z.string(),
    profile: z.string(),
    definition: z.string(),
    centers: z.record(z.boolean()),
    gates: z.array(z.number()),
    channels: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { birthDate, birthTime, birthPlace, timezone } = context;

    // Calculate the chart
    const chart = await calculateChart({
      date: birthDate,
      time: birthTime,
      location: birthPlace,
      timezone,
    });

    return chart;
  },
});
```

### Tool Best Practices

1. **Clear descriptions** - Help the LLM understand when to use the tool
2. **Typed schemas** - Use Zod with `.describe()` for parameters
3. **Error handling** - Return meaningful errors the LLM can interpret
4. **Atomic operations** - Each tool should do one thing well
5. **Idempotent when possible** - Safe to retry on failures

## Mastra Instance Configuration

```typescript
// src/mastra/index.ts
import { Mastra } from "@mastra/core";
import { assistantAgent, hdGuideAgent } from "./agents";
import { weatherTool, calculateChartTool } from "./tools";

export const mastra = new Mastra({
  agents: {
    assistantAgent,
    hdGuideAgent,
  },
  // Optional: global tool registry
  // Optional: logging and observability config
});

// Access agents via mastra instance for full feature support
// const agent = mastra.getAgent("hdGuideAgent");
```

## CopilotKit Integration

### Backend: API Route (Next.js App Router)

```typescript
// src/app/api/copilotkit/route.ts
import { CopilotRuntime, ExperimentalEmptyAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Get Mastra agents formatted for CopilotKit
  const agents = MastraAgent.getLocalAgents({
    mastra,
    agentId: "hdGuideAgent",  // or omit for all agents
  });

  const runtime = new CopilotRuntime({
    agents,
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}
```

### Alternative: Remote Mastra Server

```typescript
// src/app/api/copilotkit/route.ts
import { CopilotRuntime, ExperimentalEmptyAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";
import { MastraClient } from "@mastra/client-js";

const mastraClient = new MastraClient({
  baseUrl: process.env.MASTRA_SERVER_URL || "http://localhost:4111",
});

export async function POST(req: NextRequest) {
  const agents = await MastraAgent.getRemoteAgents({
    mastraClient,
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

### Frontend: Provider Setup

```typescript
// src/app/layout.tsx
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
// src/components/chat/CopilotChat.tsx
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
      className="h-full"
    />
  );
}
```

### Alternative UI Components

```typescript
// Popup in corner
import { CopilotPopup } from "@copilotkit/react-ui";

<CopilotPopup
  labels={{ title: "Assistant", initial: "Need help?" }}
  defaultOpen={false}
/>

// Sidebar
import { CopilotSidebar } from "@copilotkit/react-ui";

<CopilotSidebar
  labels={{ title: "Chat" }}
  defaultOpen={true}
>
  {children}
</CopilotSidebar>
```

## CopilotKit Hooks

### useCopilotReadable - Share State with Agent

```typescript
"use client";

import { useCopilotReadable } from "@copilotkit/react-core";

function ChartDisplay({ chart }) {
  // Share chart data with the AI agent
  useCopilotReadable({
    description: "The user's current Human Design chart",
    value: chart,
  });

  // Hierarchical state
  useCopilotReadable({
    description: "The user's defined centers",
    value: chart.centers,
    parentId: "chart",  // Reference parent context
  });

  return <div>{/* render chart */}</div>;
}
```

### useCopilotAction - Enable Agent Actions

```typescript
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { useState } from "react";

function ChartCalculator() {
  const [chart, setChart] = useState(null);

  // Allow the AI to trigger chart calculation
  useCopilotAction({
    name: "calculateChart",
    description: "Calculate a Human Design chart from birth data",
    parameters: [
      { name: "birthDate", type: "string", description: "Date in YYYY-MM-DD format", required: true },
      { name: "birthTime", type: "string", description: "Time in HH:MM format", required: true },
      { name: "birthPlace", type: "string", description: "City and country", required: true },
    ],
    handler: async ({ birthDate, birthTime, birthPlace }) => {
      const response = await fetch("/api/chart", {
        method: "POST",
        body: JSON.stringify({ birthDate, birthTime, birthPlace }),
      });
      const newChart = await response.json();
      setChart(newChart);
      return `Chart calculated: ${newChart.type} with ${newChart.authority} authority`;
    },
  });

  return <div>{chart && <ChartDisplay chart={chart} />}</div>;
}
```

### useCoAgent - Bidirectional State Sync

```typescript
"use client";

import { useCoAgent } from "@copilotkit/react-core";

function AgentStateDisplay() {
  const { state, setState } = useCoAgent({
    name: "hdGuideAgent",
    initialState: {
      currentChart: null,
      analysisDepth: "basic",
    },
  });

  return (
    <div>
      <p>Analysis depth: {state.analysisDepth}</p>
      <button onClick={() => setState({ ...state, analysisDepth: "detailed" })}>
        Go Deeper
      </button>
    </div>
  );
}
```

## Mastra Workflows

### Basic Workflow

```typescript
// src/mastra/workflows/analysis-workflow.ts
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const fetchDataStep = createStep({
  id: "fetch-data",
  inputSchema: z.object({
    userId: z.string(),
  }),
  outputSchema: z.object({
    userData: z.any(),
  }),
  execute: async ({ context }) => {
    const userData = await db.users.findUnique({ where: { id: context.userId } });
    return { userData };
  },
});

const analyzeStep = createStep({
  id: "analyze",
  inputSchema: z.object({
    userData: z.any(),
  }),
  outputSchema: z.object({
    analysis: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const agent = mastra.getAgent("assistantAgent");
    const result = await agent.generate(`Analyze this user data: ${JSON.stringify(context.userData)}`);
    return { analysis: result.text };
  },
});

export const analysisWorkflow = createWorkflow({
  name: "user-analysis",
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({ analysis: z.string() }),
})
  .then(fetchDataStep)
  .then(analyzeStep)
  .commit();
```

### Workflow with Branching

```typescript
const workflow = createWorkflow({
  name: "conditional-flow",
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
})
  .then(validateStep)
  .branch([
    [
      async ({ context }) => context.isValid,
      processStep,
    ],
    [
      async () => true,  // else branch
      errorStep,
    ],
  ])
  .then(finalizeStep)
  .commit();
```

### Parallel Execution

```typescript
const workflow = createWorkflow({
  name: "parallel-processing",
  inputSchema: z.object({ items: z.array(z.string()) }),
  outputSchema: z.object({ results: z.array(z.any()) }),
})
  .then(prepareStep)
  .parallel([
    processItemsA,
    processItemsB,
    processItemsC,
  ])
  .then(mergeResultsStep)
  .commit();
```

## AG-UI Protocol Events

When building custom integrations, understand these event types:

| Event | Purpose |
|-------|---------|
| `RUN_STARTED` | Agent execution begins |
| `RUN_FINISHED` | Agent execution completes |
| `TEXT_MESSAGE_START` | Begin streaming text |
| `TEXT_MESSAGE_CONTENT` | Text chunk in stream |
| `TEXT_MESSAGE_END` | End streaming text |
| `TOOL_CALL_START` | Agent invoking a tool |
| `TOOL_CALL_ARGS` | Tool arguments |
| `TOOL_CALL_END` | Tool execution complete |
| `STATE_SNAPSHOT` | Full state update |
| `STATE_DELTA` | Incremental state update |

## Best Practices

### Agent Instructions
- Be specific about the agent's role and capabilities
- List available tools and when to use them
- Include guardrails and limitations
- Use system message formatting for provider-specific features

### Tool Design
- One tool per distinct capability
- Descriptive IDs that hint at functionality
- Comprehensive input/output schemas with descriptions
- Handle errors gracefully and return useful messages

### Memory Management
- Use thread-scoped memory for conversation continuity
- Use resource-scoped memory for user preferences
- Consider semantic recall for long-term knowledge
- Clean up stale threads periodically

### Frontend Integration
- Share only relevant state with `useCopilotReadable`
- Use `useCopilotAction` for UI-triggering operations
- Implement loading states for agent responses
- Handle errors and display them appropriately

### Performance
- Stream responses for better UX
- Use parallel workflow steps when possible
- Cache frequently-accessed data
- Monitor token usage and costs

## Debugging

### Mastra Studio
Run `npm run dev` to access Mastra Studio at `http://localhost:4111` for:
- Testing agents interactively
- Inspecting workflow execution
- Viewing tool calls and results
- Monitoring memory state

### CopilotKit DevTools
- Check browser console for AG-UI events
- Use React DevTools to inspect hook state
- Monitor Network tab for `/api/copilotkit` calls

### Common Issues

1. **Agent not responding**: Check API keys in `.env`
2. **Tools not called**: Improve tool descriptions, check schema
3. **Memory not persisting**: Verify storage adapter configuration
4. **State not syncing**: Ensure `useCoAgent` names match agent IDs

## Resources

- [Mastra Documentation](https://mastra.ai/docs)
- [CopilotKit Documentation](https://docs.copilotkit.ai)
- [AG-UI Protocol](https://docs.ag-ui.com)
- [Mastra + CopilotKit Integration Guide](https://mastra.ai/docs/frameworks/agentic-uis/copilotkit)
- [CopilotKit + Mastra Starter](https://github.com/CopilotKit/with-mastra)
