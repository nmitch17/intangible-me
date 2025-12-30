# AG-UI Protocol Reference

The Agent-User Interaction (AG-UI) Protocol is an open, lightweight standard for connecting AI agents to user-facing applications.

## Protocol Ecosystem

| Protocol | Purpose |
|----------|---------|
| **MCP** (Model Context Protocol) | Agent-to-tools/data connections |
| **A2A** (Agent-to-Agent) | Distributed agent coordination |
| **AG-UI** | Human-in-the-loop layer connecting agents to users |

## Streaming Architecture

The frontend sends an HTTP POST request with the user's prompt and listens to a Server-Sent Events (SSE) stream. As the agent runs, it emits typed events describing its actions.

```
Frontend (POST) ──────────────> Agent Backend
         <──────────── SSE Event Stream ────
         RUN_STARTED
         TEXT_MESSAGE_START
         TEXT_MESSAGE_CONTENT (chunks)
         TEXT_MESSAGE_END
         TOOL_CALL_START
         TOOL_CALL_ARGS
         TOOL_CALL_END
         STATE_DELTA
         RUN_FINISHED
```

## Event Types

### Lifecycle Events

| Event | Purpose |
|-------|---------|
| `RUN_STARTED` | Agent execution begins |
| `RUN_FINISHED` | Agent execution completes |
| `RUN_ERROR` | Agent encountered an error |

### Text Message Events

| Event | Purpose |
|-------|---------|
| `TEXT_MESSAGE_START` | Beginning of a new message |
| `TEXT_MESSAGE_CONTENT` | Chunk of text in the stream |
| `TEXT_MESSAGE_END` | Message complete |

### Tool Call Events

| Event | Purpose |
|-------|---------|
| `TOOL_CALL_START` | Agent invoking a tool |
| `TOOL_CALL_ARGS` | Tool arguments (can stream) |
| `TOOL_CALL_END` | Tool execution complete |

### State Management Events

| Event | Purpose |
|-------|---------|
| `STATE_SNAPSHOT` | Full state update |
| `STATE_DELTA` | Incremental state patch (JSON Patch format) |

## Shared State

AG-UI supports bi-directional state synchronization between agent and frontend:

```typescript
// Agent emits state updates
emit({ type: "STATE_DELTA", delta: [{ op: "replace", path: "/step", value: 2 }] });

// Frontend receives and applies
const { state } = useAgent({ agentId: "my-agent" });
// state.step === 2
```

**Key benefits:**
- Send diffs instead of full blobs (bandwidth efficient)
- Clear schema for state changes
- Real-time UI updates as agent progresses

## Framework Support

AG-UI integrates with:
- **Mastra** via `@ag-ui/mastra`
- **LangGraph** via `@ag-ui/langgraph`
- **CrewAI** via `@ag-ui/crewai`
- **AutoGen2** via `@ag-ui/autogen`
- **Agno** via `@ag-ui/agno`
- SDKs in TypeScript, Python, Kotlin, Go, Java, Rust

## CopilotKit Integration

CopilotKit v1.50+ is built natively on AG-UI:

```typescript
import { useAgent } from "@copilotkit/react-core/v2";

const { agent, state } = useAgent({
  agentId: "my-mastra-agent",
});

// Access shared state
console.log(agent.state);

// Mutate from frontend
agent.setState({ userPreference: "dark" });
```
