// Model Factory - Provider-Agnostic Model Selection
// Copy to: src/lib/model-factory.ts
//
// This factory enables seamless switching between AI providers
// via environment variables. No code changes needed to switch models.

import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
// Uncomment if using OpenRouter:
// import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// ---------------------------------------------------------
// Configuration
// ---------------------------------------------------------

type ModelProvider = "openai" | "anthropic" | "google" | "openrouter";

// Uncomment for OpenRouter support:
// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// ---------------------------------------------------------
// Model Factory
// ---------------------------------------------------------

/**
 * Get a model instance based on provider and model ID.
 * Defaults to environment variables if not specified.
 *
 * @example
 * // Use default from env
 * const model = getModel();
 *
 * // Specify provider and model
 * const model = getModel("google", "gemini-3-flash");
 */
export function getModel(
  provider: ModelProvider = (process.env.AI_PROVIDER as ModelProvider) || "openai",
  modelId: string = process.env.AI_MODEL || "gpt-4o"
) {
  switch (provider) {
    case "openai":
      return openai(modelId);
    case "anthropic":
      return anthropic(modelId);
    case "google":
      return google(modelId);
    // case "openrouter":
    //   return openrouter(modelId);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// ---------------------------------------------------------
// Convenience Exports
// ---------------------------------------------------------

/**
 * Default model from environment.
 * Set AI_PROVIDER and AI_MODEL in .env.local
 */
export const defaultModel = getModel();

/**
 * Fast/cheap model for simple tasks.
 * Set AI_PROVIDER_FAST and AI_MODEL_FAST in .env.local
 */
export const fastModel = getModel(
  (process.env.AI_PROVIDER_FAST as ModelProvider) || "openai",
  process.env.AI_MODEL_FAST || "gpt-4o-mini"
);

/**
 * Reasoning model for complex tasks.
 * Set AI_PROVIDER_REASONING and AI_MODEL_REASONING in .env.local
 */
export const reasoningModel = getModel(
  (process.env.AI_PROVIDER_REASONING as ModelProvider) || "google",
  process.env.AI_MODEL_REASONING || "gemini-3-flash"
);

// ---------------------------------------------------------
// Usage Example
// ---------------------------------------------------------

/*
// In your agent:
import { Agent } from "@mastra/core/agent";
import { defaultModel, fastModel, getModel } from "@/lib/model-factory";

export const mainAgent = new Agent({
  name: "main",
  instructions: "...",
  model: defaultModel,
});

export const quickAgent = new Agent({
  name: "quick",
  instructions: "...",
  model: fastModel,
});

// Dynamic selection based on user tier
export const tieredAgent = new Agent({
  name: "tiered",
  instructions: "...",
  model: ({ runtimeContext }) => {
    const tier = runtimeContext.get("user-tier");
    return tier === "premium"
      ? getModel("anthropic", "claude-sonnet-4-20250514")
      : getModel("openai", "gpt-4o-mini");
  },
});
*/
