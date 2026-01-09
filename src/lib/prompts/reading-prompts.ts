import type { ChartData } from '@/types';

export type InterpretationSection = 'overview' | 'type' | 'authority' | 'channels' | 'cross';

/**
 * Build a section-specific prompt for AI reading generation.
 * Each prompt includes full chart context and instructions to use tools for enrichment.
 */
export function buildSectionPrompt(section: InterpretationSection, chart: ChartData): string {
  const chartContext = buildChartContext(chart);
  const sectionInstructions = getSectionInstructions(section, chart);

  return `${chartContext}

${sectionInstructions}

IMPORTANT INSTRUCTIONS:
- Write 2-4 paragraphs of rich, personalized interpretation
- Be warm and insightful, not generic
- Reference specific elements from the chart data provided above
- Avoid bullet points - use flowing prose
- Speak directly to the person ("you" language)
- Do NOT call any tools - just generate the interpretation directly from the chart data provided`;
}

function buildChartContext(chart: ChartData): string {
  const channelList = chart.channels
    .map((c) => `${c.name} (${c.gates[0]}-${c.gates[1]})`)
    .join(', ');

  const definedCenters = Object.entries(chart.centers)
    .filter(([, center]) => center.defined)
    .map(([name]) => name)
    .join(', ');

  const undefinedCenters = Object.entries(chart.centers)
    .filter(([, center]) => !center.defined)
    .map(([name]) => name)
    .join(', ');

  return `HUMAN DESIGN CHART CONTEXT:
Type: ${chart.type}
Strategy: ${chart.strategy}
Signature (when living correctly): ${chart.signature}
Not-Self Theme (when off track): ${chart.not_self}
Authority: ${chart.authority}
Profile: ${chart.profile}
Definition: ${chart.definition}
Incarnation Cross: ${chart.cross.name} (${chart.cross.type}, ${chart.cross.quarter} Quarter)
Cross Gates: ${chart.cross.gates.join(', ')}
Defined Centers: ${definedCenters || 'None'}
Undefined Centers: ${undefinedCenters || 'None'}
Channels: ${channelList || 'None'}
Circuitry Balance: Individual ${chart.circuitry.individual}%, Tribal ${chart.circuitry.tribal}%, Collective ${chart.circuitry.collective}%`;
}

function getSectionInstructions(section: InterpretationSection, chart: ChartData): string {
  switch (section) {
    case 'overview':
      return `SECTION: Overview Interpretation

Generate a holistic overview of this person's Human Design. Cover:
- What makes this design unique
- How the key components (type, authority, profile) work together
- The overall gifts and themes of this design
- How the circuitry balance shapes their energy`;

    case 'type':
      return `SECTION: Type & Strategy Interpretation

Generate a deep interpretation of what it means to be a ${chart.type}. Cover:
- Their natural role in the world as a ${chart.type}
- How to apply the strategy "${chart.strategy}" in daily life
- What the signature "${chart.signature}" feels like when aligned
- How to recognize the not-self theme "${chart.not_self}" and course correct
- Practical examples of living this type correctly`;

    case 'authority':
      return `SECTION: Authority Interpretation

Generate a deep interpretation of ${chart.authority} Authority. Cover:
- How this authority operates in decision-making
- Physical/emotional cues to recognize when authority is speaking
- Common pitfalls when ignoring this authority
- Practical techniques for tuning into this authority
- How this authority relates to their ${chart.type} strategy`;

    case 'channels':
      return `SECTION: Channels Interpretation

This person has ${chart.channels.length} defined channel(s): ${chart.channels.map((c) => `${c.name} (${c.gates[0]}-${c.gates[1]}, ${c.circuit} circuit)`).join(', ')}

Their circuitry is: ${chart.circuitry.individual}% Individual, ${chart.circuitry.tribal}% Tribal, ${chart.circuitry.collective}% Collective.

Generate an interpretation covering:
- What each channel brings to their design based on the channel names and circuits provided
- How the channels work together to create their unique energy signature
- What their circuitry balance means for how they process and share energy
- The life force themes these channels create`;

    case 'cross':
      return `SECTION: Incarnation Cross Interpretation

This person has the ${chart.cross.name} (${chart.cross.type}, ${chart.cross.quarter} Quarter).
The cross gates are: ${chart.cross.gates.join(', ')}

Generate an interpretation covering:
- The overall life purpose theme of this cross based on its name
- How ${chart.cross.type} crosses experience their purpose (personal vs transpersonal)
- The ${chart.cross.quarter} Quarter's influence on when/how the purpose unfolds
- How this purpose integrates with their ${chart.type} nature`;

    default:
      return 'Generate a general interpretation of this Human Design chart.';
  }
}
