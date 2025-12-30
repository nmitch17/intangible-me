// Example Mastra Agent Template
// Copy to: src/mastra/agents/my-agent.ts

import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
// import { anthropic } from "@ai-sdk/anthropic";

export const myAgent = new Agent({
  name: "my-agent",
  instructions: `You are a helpful assistant.

    When uncertain, ask clarifying questions.
    Use available tools to provide accurate information.
    Be concise but thorough in your responses.`,

  // Model options:
  model: openai("gpt-4o"),
  // model: openai("gpt-4o-mini"),  // Faster, cheaper
  // model: anthropic("claude-sonnet-4-20250514"),
  // model: "openai/gpt-4o",  // String format (auto-detected)

  // Optional: Add tools
  // tools: { weatherTool, chartTool },
});

// ---------------------------------------------------------
// Agent with Tools Example
// ---------------------------------------------------------

/*
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const greetTool = createTool({
  id: "greet",
  description: "Greet a user by name",
  inputSchema: z.object({
    name: z.string().describe("The name to greet"),
  }),
  execute: async ({ context }) => {
    return `Hello, ${context.name}!`;
  },
});

export const agentWithTools = new Agent({
  name: "greeter-agent",
  instructions: "Greet users warmly using the greet tool.",
  model: openai("gpt-4o"),
  tools: { greetTool },
});
*/
