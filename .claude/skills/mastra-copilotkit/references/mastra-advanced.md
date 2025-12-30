# Mastra Advanced Patterns

Advanced features and patterns for Mastra agent development.

## Model Routing

Mastra supports 600+ models through auto-detection:

```typescript
import { Agent } from "@mastra/core/agent";

// String format (auto-detected)
const agent = new Agent({
  name: "my-agent",
  instructions: "...",
  model: "openai/gpt-4o",           // OpenAI
  // model: "anthropic/claude-sonnet-4-20250514",  // Anthropic
  // model: "google/gemini-3-flash",  // Google Gemini 3 Flash
});

// Provider SDK format
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

const agent = new Agent({
  model: openai("gpt-4o"),
  // model: anthropic("claude-sonnet-4-20250514"),
  // model: google("gemini-3-flash"),
});
```

## Environment-Based Model Abstraction

Abstract model selection via environment variables for seamless provider switching:

### Setup

```bash
# .env.local
# Choose ONE provider/model combination:

# OpenAI
AI_PROVIDER=openai
AI_MODEL=gpt-4o
OPENAI_API_KEY=sk-...

# Anthropic
# AI_PROVIDER=anthropic
# AI_MODEL=claude-sonnet-4-20250514
# ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini
# AI_PROVIDER=google
# AI_MODEL=gemini-3-flash
# GEMINI_API_KEY=...

# OpenRouter (access any model)
# AI_PROVIDER=openrouter
# AI_MODEL=anthropic/claude-3-opus
# OPENROUTER_API_KEY=sk-or-...
```

### Model Factory

```typescript
// src/lib/model-factory.ts
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

type ModelProvider = "openai" | "anthropic" | "google" | "openrouter";

export function getModel(
  provider: ModelProvider = process.env.AI_PROVIDER as ModelProvider,
  modelId: string = process.env.AI_MODEL || "gpt-4o"
) {
  switch (provider) {
    case "openai":
      return openai(modelId);
    case "anthropic":
      return anthropic(modelId);
    case "google":
      return google(modelId);
    case "openrouter":
      return openrouter(modelId);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// Convenience exports
export const defaultModel = getModel();
export const fastModel = getModel(
  process.env.AI_PROVIDER_FAST as ModelProvider || "openai",
  process.env.AI_MODEL_FAST || "gpt-4o-mini"
);
```

### Usage in Agents

```typescript
// src/mastra/agents/assistant.ts
import { Agent } from "@mastra/core/agent";
import { getModel, defaultModel, fastModel } from "@/lib/model-factory";

// Using default model from env
export const assistantAgent = new Agent({
  name: "assistant",
  instructions: "...",
  model: defaultModel,
});

// Using fast model for simple tasks
export const quickAgent = new Agent({
  name: "quick-agent",
  instructions: "...",
  model: fastModel,
});

// Dynamic model selection
export const tieredAgent = new Agent({
  name: "tiered-agent",
  instructions: "...",
  model: ({ runtimeContext }) => {
    const tier = runtimeContext.get("user-tier");
    return tier === "premium"
      ? getModel("anthropic", "claude-sonnet-4-20250514")
      : getModel("openai", "gpt-4o-mini");
  },
});
```

### OpenRouter for Maximum Flexibility

OpenRouter provides unified access to 100+ models:

```bash
# .env.local
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...

# Switch between ANY model via env:
AI_MODEL=anthropic/claude-3-opus
# AI_MODEL=google/gemini-pro
# AI_MODEL=meta-llama/llama-3-70b
# AI_MODEL=mistralai/mixtral-8x7b
```

```typescript
// Install: npm install @openrouter/ai-sdk-provider
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const agent = new Agent({
  model: openrouter(process.env.AI_MODEL || "anthropic/claude-3-opus"),
});
```

## Google Gemini Models

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `gemini-3-flash` | 1M tokens | Complex reasoning, coding (fastest) |
| `gemini-3-pro-preview` | 1M tokens | Advanced reasoning, agentic workflows |
| `gemini-2.5-flash` | 1M tokens | Balanced performance/cost |
| `gemini-2.0-flash` | 1M tokens | Cost-efficient |
| `gemini-2.0-flash-lite` | 1M tokens | High-speed, simple tasks |

### Setup

```bash
# .env.local
GEMINI_API_KEY=your-api-key
```

### Usage

```typescript
import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";

// Gemini 3 Flash (latest, recommended)
const agent = new Agent({
  name: "gemini-agent",
  instructions: "...",
  model: google("gemini-3-flash"),
});

// Or with string format
const agent2 = new Agent({
  model: "google/gemini-3-flash",
});
```

### Provider-Specific Options

Gemini supports thinking configuration for enhanced reasoning:

```typescript
const response = await agent.generate(prompt, {
  providerOptions: {
    google: {
      thinkingConfig: {
        thinkingBudget: 10000,      // Token budget for thinking
        includeThoughts: true,      // Return reasoning steps
        thinkingLevel: "high",      // "low" | "medium" | "high"
      },
    },
  },
});
```

### Gemini with Safety Settings

```typescript
const response = await agent.generate(prompt, {
  providerOptions: {
    google: {
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    },
  },
});
```

## Runtime Context

Dynamically adjust behavior based on request context:

```typescript
const agent = new Agent({
  name: "tiered-agent",
  instructions: "...",
  model: ({ runtimeContext }) => {
    const tier = runtimeContext.get("user-tier");
    return tier === "enterprise"
      ? openai("gpt-4o")
      : openai("gpt-4o-mini");
  },
});

// Usage with context
const response = await agent.generate("Hello", {
  runtimeContext: {
    "user-tier": "enterprise",
    "user-id": "12345",
  },
});
```

## Structured Output

Type-safe responses with Zod schemas:

```typescript
import { z } from "zod";

const ChartSchema = z.object({
  type: z.enum(["Generator", "Projector", "Manifestor", "Reflector", "Manifesting Generator"]),
  authority: z.string(),
  profile: z.string(),
  definition: z.enum(["Single", "Split", "Triple Split", "Quadruple Split", "None"]),
});

const response = await agent.generate("Analyze this chart data...", {
  structuredOutput: {
    schema: ChartSchema,
  },
});

// Type-safe access
console.log(response.object.type);      // "Generator"
console.log(response.object.authority); // "Sacral"
```

## Max Steps Control

Control sequential LLM calls for complex reasoning:

```typescript
// Default is 5 steps
const response = await agent.generate(prompt, {
  maxSteps: 10,  // Allow more reasoning iterations
});

// Each step can include tool calls
// Agent continues until task complete or max reached
```

## Callbacks for Monitoring

```typescript
const response = await agent.generate(prompt, {
  onStepFinish: ({ step, text, toolCalls }) => {
    console.log(`Step ${step}: ${text}`);
    toolCalls?.forEach(tc => console.log(`Tool: ${tc.name}`));
  },
  onFinish: ({ text, usage, finishReason }) => {
    console.log(`Finished: ${finishReason}`);
    console.log(`Tokens: ${usage.totalTokens}`);
  },
});
```

## Tool Creation Patterns

### Basic Tool

```typescript
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
    const data = await fetchWeather(location);
    return {
      temperature: units === "celsius" ? data.temp_c : data.temp_f,
      conditions: data.description,
    };
  },
});
```

### Tool with Runtime Context

```typescript
export const userDataTool = createTool({
  id: "get-user-data",
  description: "Get data for the current user",
  inputSchema: z.object({}),
  execute: async ({ context, runtimeContext }) => {
    const userId = runtimeContext.get("user-id");
    return await db.users.findUnique({ where: { id: userId } });
  },
});
```

## MCP Integration

### Using External MCP Tools

```typescript
import { MCPClient } from "@mastra/mcp";

const mcpClient = new MCPClient({
  servers: {
    filesystem: {
      command: "npx",
      args: ["-y", "@anthropic/mcp-filesystem", "/allowed/path"],
    },
    github: {
      url: "https://mcp.composio.dev/github",
      auth: { token: process.env.GITHUB_TOKEN },
    },
  },
});

// Get tools for agent
const tools = await mcpClient.getTools();

const agent = new Agent({
  name: "mcp-agent",
  instructions: "...",
  model: "openai/gpt-4o",
  tools,
});
```

### Dynamic Tool Configuration (Multi-tenant)

```typescript
// Per-request tool configuration
const agent = new Agent({
  name: "multi-tenant-agent",
  instructions: "...",
  model: "openai/gpt-4o",
  tools: async ({ runtimeContext }) => {
    const apiKey = runtimeContext.get("user-api-key");
    const client = new MCPClient({
      servers: {
        custom: { url: "...", auth: { token: apiKey } },
      },
    });
    return client.getToolsets();
  },
});
```

## Memory Configuration

```typescript
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

const memory = new Memory({
  storage: new LibSQLStore({
    url: process.env.DATABASE_URL || "file:agent-memory.db"
  }),
  options: {
    // Enable conversation history
    conversationHistory: { maxMessages: 50 },
    // Enable semantic recall (vector search)
    semanticRecall: {
      enabled: true,
      topK: 5,
    },
    // Enable working memory (persistent preferences)
    workingMemory: { enabled: true },
  },
});

const agent = new Agent({
  name: "memory-agent",
  instructions: "...",
  model: "openai/gpt-4o",
  memory,
});
```

## Mastra Instance Registration

```typescript
import { Mastra } from "@mastra/core";

export const mastra = new Mastra({
  agents: {
    assistantAgent,
    hdGuideAgent,
    analysisAgent,
  },
  // Optional: global tool registry
  tools: {
    weatherTool,
    chartTool,
  },
  // Optional: logging
  logger: console,
});

// Access registered agents
const agent = mastra.getAgent("hdGuideAgent");

// From workflow steps
const step = createStep({
  execute: async ({ mastra }) => {
    const agent = mastra.getAgent("assistantAgent");
    return agent.generate("...");
  },
});
```

## Debugging with Mastra Studio

Start the dev server to access Mastra Studio:

```bash
npm run dev
# Access at http://localhost:4111
```

**Studio Features:**
- Interactive agent testing
- Tool call inspection
- Workflow execution tracing
- Memory state viewing
- Real-time logs
