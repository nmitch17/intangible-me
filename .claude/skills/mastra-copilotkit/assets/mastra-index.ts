// Mastra Instance Template
// Copy to: src/mastra/index.ts

import { Mastra } from "@mastra/core";
import { myAgent } from "./agents/my-agent";
// import { anotherAgent } from "./agents/another-agent";

export const mastra = new Mastra({
  agents: {
    myAgent,
    // anotherAgent,
  },
  // Optional: Global tool registry
  // tools: { weatherTool, chartTool },
});

// Access agents via mastra instance:
// const agent = mastra.getAgent("myAgent");
