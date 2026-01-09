'use client';

import { useState, useCallback, useEffect } from 'react';
import { useCopilotReadable } from '@copilotkit/react-core';
import type { ChartData } from '@/types';
import { buildSectionPrompt, type InterpretationSection } from '@/lib/prompts/reading-prompts';

interface InterpretationPanelProps {
  chart: ChartData;
}

interface SectionState {
  content: string;
  isLoading: boolean;
  isGenerated: boolean;
}

const SESSION_STORAGE_KEY = 'hd-reading-sections';

// Fallback interpretations when AI is unavailable
function getFallbackInterpretation(section: InterpretationSection, chart: ChartData): string {
  const fallbacks: Record<InterpretationSection, string> = {
    overview: `You are a ${chart.type} with ${chart.authority} Authority.

Your Strategy is to "${chart.strategy}" - this is the key to making correct decisions and attracting the right opportunities in life.

With a ${chart.profile} Profile and ${chart.definition} Definition, you have a unique way of learning and engaging with the world.

Your Incarnation Cross, the ${chart.cross.name}, represents your life's purpose and the unique contribution you're here to make.

Use the chat feature to ask specific questions about your design!`,

    type: `As a ${chart.type}, your Strategy is: ${chart.strategy}

When you're living correctly, you experience: ${chart.signature}
When out of alignment, you may feel: ${chart.not_self}

The key for you is to trust your natural way of operating in the world. Every Type has its unique genius - yours comes through ${chart.type === 'Generator' || chart.type === 'Manifesting Generator' ? 'your sustainable life force energy' : chart.type === 'Manifestor' ? 'your initiating power' : chart.type === 'Projector' ? 'your ability to guide and manage others' : 'your ability to reflect and evaluate'}.

Try the chat to explore more about how to honor your Type!`,

    authority: `Your Authority is ${chart.authority}.

This is your inner compass for making decisions. ${chart.authority === 'Emotional' ? 'Wait for emotional clarity before deciding - there is no truth in the now.' : chart.authority === 'Sacral' ? 'Trust your gut response - the "uh-huh" or "unh-unh" in the moment.' : chart.authority === 'Splenic' ? 'Trust your instant intuition - it speaks once, quietly.' : 'Trust your inner knowing and give yourself time to find clarity.'}

Your Authority is one of the most practical tools in Human Design. Ask questions in the chat to learn how to apply it!`,

    channels: `You have ${chart.channels.length} defined channel(s) in your chart.

Your circuitry balance:
- Individual: ${chart.circuitry.individual}% (mutation, uniqueness, empowerment)
- Tribal: ${chart.circuitry.tribal}% (support, resources, family)
- Collective: ${chart.circuitry.collective}% (sharing, logic, experience)

${chart.channels.map((c) => `• ${c.name} (${c.gates[0]}-${c.gates[1]})`).join('\n')}

Each channel represents consistent energy in your life. Use the chat to explore what each means!`,

    cross: `Your Incarnation Cross: ${chart.cross.name}
Type: ${chart.cross.type}
Quarter: ${chart.cross.quarter}

Gates: ${chart.cross.gates.join(', ')}

Your Incarnation Cross represents your life's purpose - the theme that unfolds as you live correctly according to your Type and Authority.

${chart.cross.type === 'Right Angle' ? 'As a Right Angle cross, your purpose is deeply personal.' : chart.cross.type === 'Left Angle' ? 'As a Left Angle cross, your purpose involves others and transpersonal karma.' : 'As a Juxtaposition cross, you have a fixed fate and specific life purpose.'}

Explore your Cross further through the chat!`,
  };

  return fallbacks[section];
}

// Load sections from sessionStorage
function loadSavedSections(): Record<InterpretationSection, SectionState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

// Save sections to sessionStorage
function saveSections(sections: Record<InterpretationSection, SectionState>) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sections));
  } catch {
    // Ignore storage errors
  }
}

// Call the dedicated reading generation API
async function callAI(prompt: string): Promise<string> {
  const response = await fetch('/api/generate-reading', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      systemPrompt: 'You are a warm and insightful Human Design expert. Provide personalized, meaningful interpretations that help people understand their unique design. Write in flowing prose, speaking directly to the person.',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content || '';
}

export function InterpretationPanel({ chart }: InterpretationPanelProps) {
  const [activeSection, setActiveSection] = useState<InterpretationSection>('overview');
  const [sections, setSections] = useState<Record<InterpretationSection, SectionState>>(() => {
    const saved = loadSavedSections();
    return saved || {
      overview: { content: '', isLoading: false, isGenerated: false },
      type: { content: '', isLoading: false, isGenerated: false },
      authority: { content: '', isLoading: false, isGenerated: false },
      channels: { content: '', isLoading: false, isGenerated: false },
      cross: { content: '', isLoading: false, isGenerated: false },
    };
  });

  // Share chart context with CopilotKit (for the chat widget)
  useCopilotReadable({
    description: "User's Human Design chart for interpretation",
    value: chart,
  });

  // Save sections whenever they change
  useEffect(() => {
    saveSections(sections);
  }, [sections]);

  const generateInterpretation = useCallback(async (section: InterpretationSection) => {
    // Check if already generated or loading using functional setState
    let shouldProceed = false;
    setSections((prev) => {
      if (prev[section].isGenerated || prev[section].isLoading) {
        return prev; // Don't proceed
      }
      shouldProceed = true;
      return {
        ...prev,
        [section]: { ...prev[section], isLoading: true },
      };
    });

    if (!shouldProceed) return;

    try {
      const prompt = buildSectionPrompt(section, chart);
      const content = await callAI(prompt);

      if (content && content.length > 50) {
        setSections((prev) => ({
          ...prev,
          [section]: { content, isLoading: false, isGenerated: true },
        }));
      } else {
        throw new Error('Empty or short response');
      }
    } catch (error) {
      console.error('Error generating interpretation:', error);
      // Fall back to static content on error
      const content = getFallbackInterpretation(section, chart);
      setSections((prev) => ({
        ...prev,
        [section]: { content, isLoading: false, isGenerated: true },
      }));
    }
  }, [chart]);

  const sectionLabels: Record<InterpretationSection, string> = {
    overview: 'Overview',
    type: 'Type & Strategy',
    authority: 'Authority',
    channels: 'Channels',
    cross: 'Incarnation Cross',
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(sectionLabels) as InterpretationSection[]).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wider transition-all ${
              activeSection === section
                ? 'bg-gradient-to-r from-solar-glow to-haze-pink text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}
          >
            {sectionLabels[section]}
            {sections[section].isGenerated && (
              <span className="ml-2 text-xs">&#10003;</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[300px] p-6 rounded-3xl bg-gray-50 border border-gray-200">
        {!sections[activeSection].isGenerated && !sections[activeSection].isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <p className="text-gray-500 mb-4">
              Generate an AI-powered interpretation of your {sectionLabels[activeSection].toLowerCase()}
            </p>
            <button
              onClick={() => generateInterpretation(activeSection)}
              className="solar-button px-8 py-3"
            >
              Generate Reading
            </button>
          </div>
        ) : sections[activeSection].isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="w-8 h-8 border-2 border-solar-glow border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-mono text-sm uppercase tracking-wider">
              Generating interpretation...
            </p>
          </div>
        ) : (
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
            {sections[activeSection].content}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gray-50 text-center border border-gray-100">
          <div className="text-xs font-mono text-solar-glow uppercase tracking-wider mb-1">
            Type
          </div>
          <div className="text-gray-800 font-medium">{chart.type}</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-50 text-center border border-gray-100">
          <div className="text-xs font-mono text-solar-glow uppercase tracking-wider mb-1">
            Authority
          </div>
          <div className="text-gray-800 font-medium">{chart.authority}</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-50 text-center border border-gray-100">
          <div className="text-xs font-mono text-solar-glow uppercase tracking-wider mb-1">
            Profile
          </div>
          <div className="text-gray-800 font-medium">{chart.profile}</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-50 text-center border border-gray-100">
          <div className="text-xs font-mono text-solar-glow uppercase tracking-wider mb-1">
            Definition
          </div>
          <div className="text-gray-800 font-medium">{chart.definition}</div>
        </div>
      </div>
    </div>
  );
}
