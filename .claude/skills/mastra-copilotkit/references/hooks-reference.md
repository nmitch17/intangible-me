# CopilotKit Hooks Reference

Complete API reference for CopilotKit React hooks.

## useCopilotReadable

Share application state with the AI copilot.

```typescript
import { useCopilotReadable } from "@copilotkit/react-core";

// Basic usage
useCopilotReadable({
  description: "The user's current chart data",
  value: chartData,
});

// Hierarchical state with parentId
const chartId = useCopilotReadable({
  description: "User's Human Design chart",
  value: chart,
});

useCopilotReadable({
  description: "Defined centers in the chart",
  value: chart.centers,
  parentId: chartId,
});
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | `string` | Yes | Helps AI understand the context |
| `value` | `any` | Yes | Data to share (objects auto-stringified) |
| `parentId` | `string` | No | Parent context for hierarchical relationships |
| `categories` | `string[]` | No | Categorize for selective access |

---

## useCopilotAction

Define functions the AI can invoke.

```typescript
import { useCopilotAction } from "@copilotkit/react-core";

useCopilotAction({
  name: "calculateChart",
  description: "Calculate a Human Design chart",
  parameters: [
    { name: "birthDate", type: "string", required: true, description: "YYYY-MM-DD" },
    { name: "birthTime", type: "string", required: true, description: "HH:MM" },
    { name: "birthPlace", type: "string", required: true },
  ],
  handler: async ({ birthDate, birthTime, birthPlace }) => {
    const chart = await calculateChart({ birthDate, birthTime, birthPlace });
    return `Calculated: ${chart.type} with ${chart.authority}`;
  },
});
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Unique action identifier |
| `description` | `string` | Yes | When to use this action |
| `parameters` | `Parameter[]` | Yes | Action parameters |
| `handler` | `function` | Yes | Async function to execute |
| `render` | `function` | No | Generative UI component |
| `disabled` | `boolean` | No | Disable the action |

### Parameter Types

```typescript
type Parameter = {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  required?: boolean;
  enum?: string[];  // For constrained values
};
```

---

## useCoAgent (v1)

Bidirectional state sync with agent.

```typescript
import { useCoAgent } from "@copilotkit/react-core";

const { state, setState, running, start, stop } = useCoAgent({
  name: "hd-guide-agent",
  initialState: {
    currentChart: null,
    analysisDepth: "basic",
  },
});

// Read agent state
console.log(state.currentChart);

// Update state (syncs to agent)
setState({ ...state, analysisDepth: "detailed" });
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `state` | `T` | Current agent state |
| `setState` | `(state: T) => void` | Update agent state |
| `running` | `boolean` | Is agent currently executing |
| `start` | `() => void` | Start agent execution |
| `stop` | `() => void` | Stop agent execution |

---

## useAgent (v2 - NEW in v1.50)

Superset of `useCoAgent` with additional features.

```typescript
import { useAgent } from "@copilotkit/react-core/v2";

const { agent, state, setState } = useAgent({
  agentId: "my-agent",
});
```

### New v2 Features

| Feature | Description |
|---------|-------------|
| **Shared State** | `agent.state` and `agent.setState` for bi-directional sync |
| **Time Travel** | Restore/replay conversations for testing |
| **Multi-Agent** | Run multiple agents side-by-side |
| **Agent Awareness** | Agents can read each other's messages |
| **Thread Persistence** | Long-running, resumable conversations |

---

## useCopilotChat

Direct access to chat functionality.

```typescript
import { useCopilotChat } from "@copilotkit/react-core";

const {
  visibleMessages,
  appendMessage,
  setMessages,
  isLoading,
  stop,
} = useCopilotChat();

// Append a message programmatically
appendMessage({
  role: "user",
  content: "Calculate my chart",
});
```

---

## useCoAgentStateRender

Render UI based on agent state.

```typescript
import { useCoAgentStateRender } from "@copilotkit/react-core";

useCoAgentStateRender({
  name: "my-agent",
  render: ({ state, nodeName, status }) => {
    // Return React component based on state
    return <AgentProgress state={state} />;
  },
});
```

---

## Hook Composition Example

```typescript
function ChartAnalyzer() {
  const [chart, setChart] = useState(null);

  // Share chart state with AI
  useCopilotReadable({
    description: "Current Human Design chart",
    value: chart,
  });

  // Allow AI to calculate charts
  useCopilotAction({
    name: "calculateChart",
    description: "Calculate HD chart from birth data",
    parameters: [...],
    render: ({ status }) => status === "executing" && <Spinner />,
    handler: async (args) => {
      const result = await calculateChart(args);
      setChart(result);
      return `Chart: ${result.type}`;
    },
  });

  // Sync with CoAgent for complex analysis
  const { state } = useCoAgent({
    name: "analysis-agent",
    initialState: { depth: "basic" },
  });

  return <ChartDisplay chart={chart} analysis={state} />;
}
```
