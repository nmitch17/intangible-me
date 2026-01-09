# Generate Reading Feature Implementation Plan

## Summary
Implement AI-powered reading generation for the InterpretationPanel using the existing CopilotKit/Gemini infrastructure, with rich 2-4 paragraph interpretations enriched by gate/channel data.

## Current State
- **InterpretationPanel.tsx**: Shows 5 sections (overview, type, authority, channels, cross) with hardcoded fallback text
- **CopilotKit**: Fully configured with Gemini adapter and HD tools (getGateInfo, getChannelInfo)
- **Problem**: The "Generate Reading" button just returns fallback text, no AI is called

## Implementation Steps

### Step 1: Create Reading Prompt Builder
**New file**: `src/lib/prompts/reading-prompts.ts`

Create section-specific prompts that:
- Include chart context (type, authority, profile, etc.)
- Instruct AI to use `getGateInfo`/`getChannelInfo` tools for enrichment
- Request 2-4 paragraphs of rich, personalized interpretation

```typescript
export function buildSectionPrompt(section: InterpretationSection, chart: ChartData): string
```

### Step 2: Update InterpretationPanel to Use CopilotKit
**Modify**: `src/components/chart/InterpretationPanel.tsx`

1. Add `useCopilotChat` hook for programmatic AI calls
2. Add `useCopilotReadable` to share chart context with AI
3. Replace `generateInterpretation` to call `appendMessage` with structured prompts
4. Watch `visibleMessages` for AI response completion
5. Keep fallback content as error recovery

Key changes:
```typescript
import { useCopilotChat, useCopilotReadable } from '@copilotkit/react-core';

// In component:
const { appendMessage, visibleMessages, isLoading } = useCopilotChat();

useCopilotReadable({
  description: "User's Human Design chart for interpretation",
  value: chart,
});

// On button click:
await appendMessage({
  role: "user",
  content: buildSectionPrompt(section, chart),
});
```

### Step 3: Handle Response Extraction
Track pending generation and extract AI response:
```typescript
const [pendingSection, setPendingSection] = useState<InterpretationSection | null>(null);

useEffect(() => {
  if (!pendingSection || isLoading) return;

  const lastAssistantMessage = visibleMessages
    .filter(m => m.role === 'assistant')
    .pop();

  if (lastAssistantMessage?.content) {
    setSections(prev => ({
      ...prev,
      [pendingSection]: {
        content: lastAssistantMessage.content,
        isLoading: false,
        isGenerated: true,
      },
    }));
    setPendingSection(null);
  }
}, [visibleMessages, isLoading, pendingSection]);
```

### Step 4: Remove "Coming soon..." text
Fix line 158 which appends "Coming soon..." after generated content.

### Step 5: Add Session Persistence (Optional)
Store generated readings in sessionStorage so they persist on page refresh.

## Files to Modify/Create

| File | Action |
|------|--------|
| `src/lib/prompts/reading-prompts.ts` | CREATE |
| `src/components/chart/InterpretationPanel.tsx` | MODIFY |

## Section Prompts (High-Level)

Each section prompt will:
1. Provide full chart context
2. Instruct AI to use tools for enrichment
3. Request specific interpretation focus:
   - **Overview**: Unique design, how components work together, gifts, themes
   - **Type & Strategy**: Role in world, applying strategy, signature/not-self
   - **Authority**: How it operates, recognizing it, practical techniques
   - **Channels**: Each channel's meaning, how they work together, circuitry
   - **Cross**: Life purpose, gate contributions, how it unfolds

## UX Considerations

1. **Loading**: Keep current spinner with "Generating interpretation..."
2. **Errors**: Gracefully fallback to static content with retry option
3. **Caching**: Generated readings stay in state (can add sessionStorage)
4. **Chat Integration**: AI messages will appear in both places (acceptable for MVP)

## Testing Checklist
- [ ] Generate reading for each of the 5 sections
- [ ] Verify AI uses gate/channel tools (check network/logs)
- [ ] Test error handling (disable API key)
- [ ] Verify readings are rich and personalized (not generic)
- [ ] Check that checkmark appears after generation
