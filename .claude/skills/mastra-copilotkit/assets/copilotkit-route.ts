// CopilotKit API Route Template
// Copy to: src/app/api/copilotkit/route.ts

import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";
import { mastra } from "@/mastra";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Option 1: Get specific agent
  const agents = MastraAgent.getLocalAgents({
    mastra,
    agentId: "myAgent", // Replace with your agent ID
  });

  // Option 2: Get all agents (uncomment to use)
  // const agents = MastraAgent.getLocalAgents({ mastra });

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

// ---------------------------------------------------------
// Alternative: Remote Mastra Server Configuration
// Uncomment below if using a separate Mastra server
// ---------------------------------------------------------

/*
import { MastraClient } from "@mastra/client-js";

const mastraClient = new MastraClient({
  baseUrl: process.env.MASTRA_SERVER_URL || "http://localhost:4111",
});

export async function POST(req: NextRequest) {
  const agents = await MastraAgent.getRemoteAgents({
    mastraClient,
    agentId: "myAgent",
  });

  const runtime = new CopilotRuntime({ agents });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}
*/
