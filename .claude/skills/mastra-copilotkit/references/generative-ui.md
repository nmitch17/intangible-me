# Generative UI Patterns

Generative UI enables AI agents to render dynamic React components based on execution state.

## Three Types of Generative UI

### 1. Static Generative UI
- Engineers pre-define visual components
- Agent selects which components to display
- **Best for:** Mission-critical flows (payments, compliance)
- **Reliability:** Highest

### 2. Declarative UI (Recommended)
- AI assembles UI from a registry of pre-approved components
- Components have flexible props
- **Best for:** Dashboards, chat assistants, multi-modal apps
- **Reliability:** High, balances creativity with safety

### 3. Open-Ended / Fully Generated
- Agents generate complete UI surfaces
- Maximum creativity and fast iteration
- **Best for:** Prototyping, experiments
- **Reliability:** Lower, less production-safe

## useCopilotAction with Render

The `render` function enables Generative UI:

```typescript
import { useCopilotAction } from "@copilotkit/react-core";

useCopilotAction({
  name: "showWeather",
  description: "Display weather for a location",
  parameters: [
    { name: "location", type: "string", required: true },
  ],
  render: ({ status, args, result }) => {
    switch (status) {
      case "executing":
        return <WeatherSkeleton location={args.location} />;
      case "complete":
        return <WeatherCard data={result} />;
      default:
        return null;
    }
  },
  handler: async ({ location }) => {
    return await fetchWeather(location);
  },
});
```

### Render Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `"executing" \| "complete"` | Current execution state |
| `args` | `object` | Parsed action arguments |
| `result` | `any` | Handler return value (when complete) |

## Human-in-the-Loop with renderAndWait

For approval workflows, use `renderAndWaitForResponse`:

```typescript
useCopilotAction({
  name: "sendEmail",
  description: "Send email - requires approval",
  parameters: [...],
  render: ({ status, args, handler }) => {
    if (status === "executing") {
      return (
        <EmailConfirmation
          email={args}
          onApprove={() => handler.resolve({ approved: true })}
          onReject={() => handler.resolve({ approved: false })}
        />
      );
    }
    return <EmailSent />;
  },
  handler: async (args, { renderAndWaitForResponse }) => {
    const { approved } = await renderAndWaitForResponse();
    if (!approved) return "Email cancelled";
    await sendEmail(args);
    return "Email sent successfully";
  },
});
```

## useCoAgentStateRender

Render UI based on agent state changes:

```typescript
import { useCoAgentStateRender } from "@copilotkit/react-core";

useCoAgentStateRender({
  name: "analysis-agent",
  render: ({ state, nodeName, status }) => {
    if (state.progress) {
      return (
        <ProgressBar
          value={state.progress}
          step={nodeName}
          status={status}
        />
      );
    }

    if (state.results) {
      return <ResultsTable data={state.results} />;
    }

    return null;
  },
});
```

## Best Practices

1. **Progressive Enhancement**: Show skeleton/loading states during execution
2. **Error States**: Handle failures gracefully in render
3. **Accessibility**: Ensure generated components are accessible
4. **Consistent Design**: Use your design system components
5. **Type Safety**: Define proper TypeScript types for state and args
