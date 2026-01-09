### 2.1 Install Mastra Framework ⚡

**Current Dependencies Status:**
- ✅ `@copilotkit/runtime`, `@copilotkit/react-core`, `@copilotkit/react-ui` (already installed)
- ❌ `@mastra/core` and `@mastra/memory` (need installation)

**Detailed Steps:**

1. **Install Mastra packages:**
   ```bash
   npm install @mastra/core @mastra/memory
   ```

2. **Verify package versions:**
   - Use latest stable versions
   - Check compatibility with Node 20.x (as per `package.json:6`)

3. **Create agent directory structure:**
   ```
   src/lib/agents/
   ├── index.ts              # Mastra configuration export
   ├── hd-guide.ts           # Human Design Guide agent
   └── tools/
       ├── calculate-chart.ts    # Chart calculation tool
       ├── get-gate-info.ts      # Gate reference lookup
       ├── get-channel-info.ts   # Channel reference lookup
       └── get-transit.ts        # Current transit data
   ```

4. **Remove Python agent directory:**
   ```bash
   git rm -r agent/
   ```

**Files to Create:**
- `src/lib/agents/index.ts`
- `src/lib/agents/hd-guide.ts`
- `src/lib/agents/tools/` (directory with tool files)

**Files to Delete:**
- `agent/main.py`
- `agent/requirements.txt`

**Success Criteria:**
- Mastra packages installed without errors
- Agent directory structure created
- Python agent directory removed
- No build errors

---

### 2.2 Human Design Guide Agent 🤖

**Agent Configuration:**

The agent should use **OpenAI GPT-5.2** (the latest model) instead of the older version mentioned in the development plan. This ensures optimal performance and cost efficiency.

**Tool Implementation Details:**

1. **calculateChart Tool:**
   - **Input:** `{ datetime_utc: string, lat: number, lng: number }`
   - **Action:** Call existing `/api/chart` endpoint internally
   - **Output:** Full chart calculation response
   - **Purpose:** Allow agent to calculate charts during conversation

2. **getGateInfo Tool:**
   - **Input:** `{ gate_id: number }`
   - **Action:** Query existing reference data from `src/lib/reference/`
   - **Output:** Gate name, center, description
   - **Purpose:** Provide gate information for interpretation

3. **getChannelInfo Tool:**
   - **Input:** `{ gates: [number, number] }` or `{ channel_id: string }`
   - **Action:** Query `src/lib/reference/channels.ts`
   - **Output:** Channel name, circuit, theme, description
   - **Purpose:** Explain channel mechanics and meaning

4. **getCurrentTransit Tool:**
   - **Input:** `{ datetime_utc?: string }` (defaults to now)
   - **Action:** Call `/api/transit` endpoint
   - **Output:** Current planetary activations
   - **Purpose:** Analyze transit influences on natal chart

**Agent Instructions Template:**
```typescript
const HD_AGENT_INSTRUCTIONS = `You are an expert Human Design analyst with deep knowledge of the Human Design system.

CORE PRINCIPLES:
- Be accurate about mechanics (Type, Strategy, Authority, Profile, Definition)
- Explain concepts in accessible language while maintaining technical precision
- Focus on practical application in daily life
- Be encouraging but honest - HD is about self-acceptance
- When discussing gates/channels, explain both energy and manifestation
- Remember: charts show potential, not fixed destiny

INTERPRETATION APPROACH:
- Analyze holistically, looking for patterns
- Consider how channels connect centers
- Identify circuit dominance (Individual, Tribal, Collective)
- Explain defined vs undefined centers
- Integrate Profile lines and Incarnation Cross
- NEVER fabricate information - if unsure, acknowledge it

AVAILABLE TOOLS:
Use these tools to provide accurate, personalized guidance based on real chart data.`;
```

**Model Configuration:**
```typescript
model: {
  provider: '',
  name: 'gpt-5.2-2025-12-11', // Latest OpenAI model
}
```

**Files to Create:**
- `src/lib/agents/hd-guide.ts` (main agent)
- `src/lib/agents/tools/calculate-chart.ts`
- `src/lib/agents/tools/get-gate-info.ts`
- `src/lib/agents/tools/get-channel-info.ts`
- `src/lib/agents/tools/get-transit.ts`

**Success Criteria:**
- Agent responds to basic HD questions
- Tools successfully fetch reference data
- Agent provides accurate interpretations based on chart data
- No hallucinated gate/channel information

---

### 2.3 CopilotKit Runtime API 🔌

**Implementation Details:**

1. **Create API Route:**
   - **File:** `src/app/api/copilotkit/route.ts`
   - **Method:** POST endpoint for CopilotKit runtime
   - **Purpose:** Bridge between frontend CopilotKit and Mastra agent

2. **Mastra-CopilotKit Integration:**

The integration should use CopilotKit's **LangGraph adapter** for Mastra agents. Based on CopilotKit documentation:

```typescript
import { CopilotRuntime, LangGraphAdapter } from "@copilotkit/runtime";
import { mastra } from "@/lib/agents";

export async function POST(req: Request) {
  const { handleRequest } = new CopilotRuntime();
  
  const adapter = new LangGraphAdapter({
    agent: mastra.agents.hdGuide,
  });

  return handleRequest(req, adapter);
}
```

3. **Action Definitions:**

Define specific CopilotKit actions that map to common use cases:

- **`interpretChart`**: Generate full chart interpretation
- **`explainType`**: Deep dive into user's Type and Strategy
- **`explainAuthority`**: Detailed authority guidance
- **`analyzeChannels`**: Breakdown of channel themes
- **`askAboutGate`**: Get information about specific gate
- **`compareTransit`**: Analyze current transit effects

4. **Context Passing:**

Ensure chart data flows properly:
```typescript
// Chart context should be passed via CopilotKit's state
useCopilotReadable({
  description: "User's Human Design chart data",
  value: chartData,
});
```

**Environment Variables:**
Ensure `OPENAI_API_KEY` is configured in `.env.local`

**Files to Create:**
- `src/app/api/copilotkit/route.ts`

**Files to Modify:**
- `.env.local` (add `OPENAI_API_KEY` if not present)

**Success Criteria:**
- `/api/copilotkit` endpoint responds without errors
- Agent receives and processes messages
- Actions execute successfully
- Chart context flows to agent

---

### 2.4 CopilotKit Frontend Integration 🎨

**Implementation Steps:**

1. **Wrap App with CopilotKit Provider:**

Modify `src/app/layout.tsx`:

```typescript
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${dmSerif.variable} ${jetbrainsMono.variable} font-sans`}>
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
```

2. **Create Chat Component:**

**File:** `src/components/chat/CopilotChat.tsx`

This component should:
- Use `CopilotPopup` or `CopilotSidebar` from `@copilotkit/react-ui`
- Match **Solar Haze Portal** theme (deep purple, cosmic aesthetic)
- Be positioned in bottom-right corner
- Include chart context via `useCopilotReadable`

**Styling Considerations:**
- Background: `bg-deep-cosmos/95` (from existing theme)
- Border: Subtle glow effect matching clay cards
- Text: `text-white` with `text-white/70` for secondary
- Font: Use existing `font-mono` for labels, `font-sans` for content

3. **Chart Context Integration:**

In `src/app/page.tsx`, add:
```typescript
import { useCopilotReadable } from "@copilotkit/react-core";

// Inside component where chartData exists:
useCopilotReadable({
  description: "The user's complete Human Design chart",
  value: chartData?.chart,
});
```

4. **Custom Styling:**

Override CopilotKit CSS to match Solar Haze theme:
```css
/* In globals.css or component-specific CSS */
.copilotKitPopup {
  --copilot-kit-background: rgba(13, 7, 26, 0.95);
  --copilot-kit-primary: #fbbf24; /* solar-glow */
  --copilot-kit-text: #ffffff;
  --copilot-kit-muted: rgba(255, 255, 255, 0.7);
}
```

**Files to Create:**
- `src/components/chat/CopilotChat.tsx`
- `src/components/chat/index.ts` (export)

**Files to Modify:**
- `src/app/layout.tsx` (add CopilotKit provider)
- `src/app/page.tsx` (add useCopilotReadable for context)
- `src/app/globals.css` (CopilotKit theme overrides)

**Success Criteria:**
- Chat UI appears on page
- Matches Solar Haze Portal aesthetic
- Agent receives chart context
- Responses are personalized to user's chart

---

### 2.5 AI Interpretation Features 📊

**Implementation Details:**

1. **InterpretationPanel Component:**

**File:** `src/components/chart/InterpretationPanel.tsx`

This component should display AI-generated interpretations with sections:

- **Overview**: Type, Strategy, Authority summary
- **Type & Strategy**: How to use your design
- **Authority**: Decision-making guidance
- **Channels**: Deep dive into active channels
- **Incarnation Cross**: Life purpose and theme

2. **Integration Points:**

Add to `src/components/chart/ChartResult.tsx`:
```typescript
import { InterpretationPanel } from './InterpretationPanel';

// Add after existing chart display:
<InterpretationPanel chart={chart} />
```

3. **Generate Reading Button:**

Use `useCopilotAction` to trigger interpretation:
```typescript
import { useCopilotAction } from "@copilotkit/react-core";

useCopilotAction({
  name: "generateReading",
  description: "Generate a comprehensive chart interpretation",
  parameters: [/* ... */],
  handler: async ({ chart }) => {
    // Trigger interpretation generation
  },
});
```

4. **Streaming Implementation:**

Use CopilotKit's built-in streaming to show real-time interpretation:
- Display typing indicator while generating
- Stream text token by token
- Show loading state per section

5. **Database Caching:**

**Schema Addition** (to `src/db/schema.ts`):
```typescript
export const interpretations = pgTable('interpretations', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  chartHash: text('chart_hash').notNull(), // Hash of birth data
  interpretation: text('interpretation').notNull(),
  focus: text('focus'), // null = full, or "type", "authority", etc.
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Caching Logic:**
- Generate hash from `datetime_utc + lat + lng + focus`
- Check database before generating
- Store new interpretations for reuse
- TTL: Indefinite (birth data doesn't change)

**Files to Create:**
- `src/components/chart/InterpretationPanel.tsx`

**Files to Modify:**
- `src/components/chart/ChartResult.tsx` (integrate panel)
- `src/db/schema.ts` (add interpretations table)

**Database Migration:**
After schema update, run:
```bash
npm run db:generate
npm run db:push
```

**Success Criteria:**
- "Generate Reading" button works
- Streaming text displays smoothly
- Interpretations are cached and retrieved
- UI matches Solar Haze Portal theme
- Sections are clear and organized

---

### Additional Recommendations

#### Testing Strategy
Add tests for:
- Agent tool execution
- CopilotKit runtime endpoint
- Chart context passing
- Interpretation caching

**Test File:** `tests/agents/hd-guide.test.ts`

#### Error Handling
Implement robust error handling:
- API key validation
- Mastra agent initialization errors
- Tool execution failures
- Graceful degradation if AI unavailable

#### Rate Limiting
Consider rate limiting for AI endpoints:
- Reuse existing `src/lib/ratelimit.ts`
- Apply to `/api/copilotkit`
- Prevent abuse of expensive AI calls

#### Documentation
Update README with:
- Required environment variables
- AI feature usage instructions
- Cost considerations for API usage

---

### Dependency Order

The tasks have clear dependencies:

```
2.1 (Install Mastra) → 2.2 (Build Agent) → 2.3 (Runtime API)
                                              ↓
                              2.4 (Frontend) → 2.5 (Interpretation)
```

**Recommended Approach:**
1. Complete 2.1 and 2.2 together (backend foundation)
2. Build 2.3 to connect backend to frontend
3. Implement 2.4 for basic chat UI
4. Add 2.5 for advanced interpretation features

---

### Environment Setup Checklist

Before starting, ensure:
- [ ] `OPENAI_API_KEY` in `.env.local`
- [ ] Database access for caching (Neon connection)
- [ ] Node 20.x (already configured)
- [ ] All existing dependencies installed

---

### References for Implementation

**Mastra Documentation:**
- [Getting Started](https://mastra.ai/docs/getting-started)
- [Agent Configuration](https://mastra.ai/docs/agents)
- [Tool Creation](https://mastra.ai/docs/tools)

**CopilotKit Documentation:**
- [Runtime Setup](https://docs.copilotkit.ai/runtime)
- [LangGraph Integration](https://docs.copilotkit.ai/integrations/langgraph)
- [React Hooks](https://docs.copilotkit.ai/react)

**Development Plan:**
- [specs/DEVELOPMENT_PLAN.md](https://github.com/nmitch17/intangible-me/blob/main/specs/DEVELOPMENT_PLAN.md)
