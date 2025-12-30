'use client';

import { useEffect, useState } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import type { ChartData, CenterName, SelectedElement } from '@/types';
import { CENTER_DISPLAY_NAMES, CENTER_DESCRIPTIONS } from '@/lib/bodygraph/layout';
import { CIRCUIT_COLORS_HEX } from '@/lib/bodygraph/colors';
import { CHANNELS } from '@/lib/reference/channels';
import { GATE_NAMES, GATE_DESCRIPTIONS } from '@/lib/reference/gates';

interface ElementInfoPanelProps {
  element: SelectedElement;
  chartData: ChartData;
  onClose: () => void;
}

export default function ElementInfoPanel({
  element,
  chartData,
  onClose,
}: ElementInfoPanelProps) {
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Make element context available to CopilotKit
  useCopilotReadable({
    description: 'Currently selected bodygraph element',
    value: JSON.stringify({
      element,
      userType: chartData.type,
      userAuthority: chartData.authority,
      userProfile: chartData.profile,
    }),
  });

  // Action to get interpretation
  useCopilotAction({
    name: 'interpretElement',
    description: 'Get personalized interpretation for the selected element',
    parameters: [
      {
        name: 'interpretation',
        type: 'string',
        description: 'The personalized interpretation text',
      },
    ],
    handler: async ({ interpretation: text }) => {
      setInterpretation(text);
      return 'Interpretation provided';
    },
  });

  // Request interpretation when element changes
  useEffect(() => {
    setInterpretation('');
    setIsLoading(true);

    // Simulate AI interpretation request
    const generateInterpretation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let baseText = '';
      switch (element.type) {
        case 'center':
          baseText = `As a ${chartData.type} with ${chartData.authority} authority, your ${element.defined ? 'defined' : 'open'} ${CENTER_DISPLAY_NAMES[element.name]} center plays a unique role in your design. ${element.defined ? 'This consistent energy is a reliable part of how you operate.' : 'This open center allows you to sample and amplify this energy from others, giving you wisdom in this area.'}`;
          break;
        case 'gate':
          baseText = `Gate ${element.number} (${GATE_NAMES[element.number] || 'Unknown'}) in your ${CENTER_DISPLAY_NAMES[element.center]} center brings a specific energy to your design. This gate represents ${GATE_DESCRIPTIONS[element.number] || 'a unique aspect of your design.'}`;
          break;
        case 'channel':
          baseText = `The Channel of ${element.name} (${element.gates[0]}-${element.gates[1]}) is part of your ${element.circuit} circuitry. This defined channel provides you with consistent access to this energy flow, making it a dependable part of your expression.`;
          break;
      }

      setInterpretation(baseText);
      setIsLoading(false);
    };

    generateInterpretation();
  }, [element, chartData]);

  const renderContent = () => {
    switch (element.type) {
      case 'center':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif text-white">
                {CENTER_DISPLAY_NAMES[element.name]}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  element.defined
                    ? 'bg-[#ff9d6c]/20 text-[#ff9d6c]'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {element.defined ? 'Defined' : 'Open'}
              </span>
            </div>
            <p className="text-white/70 text-sm mb-4">
              {CENTER_DESCRIPTIONS[element.name]}
            </p>
            <div className="text-xs text-white/50 mb-4">
              Gates in this center:{' '}
              {chartData.centers[element.name]?.gates.join(', ') || 'None'}
            </div>
          </>
        );

      case 'gate':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif text-white">
                Gate {element.number}
              </h3>
              <span className="px-2 py-1 rounded text-xs font-medium bg-[#f0a2b1]/20 text-[#f0a2b1]">
                {CENTER_DISPLAY_NAMES[element.center]}
              </span>
            </div>
            <div className="text-lg text-white/90 mb-2">
              {GATE_NAMES[element.number] || 'Unknown'}
            </div>
            <p className="text-white/70 text-sm mb-4">
              {GATE_DESCRIPTIONS[element.number] ||
                'Gate description not available.'}
            </p>
          </>
        );

      case 'channel': {
        const channelData = CHANNELS.find(
          (c) =>
            (c.gates[0] === element.gates[0] && c.gates[1] === element.gates[1]) ||
            (c.gates[0] === element.gates[1] && c.gates[1] === element.gates[0])
        );

        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif text-white">
                Channel of {element.name}
              </h3>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${CIRCUIT_COLORS_HEX[channelData?.circuit || 'Individual']}20`,
                  color: CIRCUIT_COLORS_HEX[channelData?.circuit || 'Individual'],
                }}
              >
                {element.circuit}
              </span>
            </div>
            <div className="text-lg text-white/90 mb-2">
              Gates {element.gates[0]} - {element.gates[1]}
            </div>
            <div className="text-sm text-white/60 mb-4">
              {GATE_NAMES[element.gates[0]]} connecting to{' '}
              {GATE_NAMES[element.gates[1]]}
            </div>
            {channelData?.stream && (
              <div className="text-xs text-white/50 mb-4">
                Stream: {channelData.stream}
              </div>
            )}
          </>
        );
      }
    }
  };

  return (
    <div className="absolute top-4 left-4 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
        <div className="text-xs font-mono uppercase tracking-wider text-[#ff9d6c]">
          {element.type}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">{renderContent()}</div>

      {/* AI Interpretation */}
      <div className="border-t border-white/10 p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-[#9d7cff] mb-3">
          Personal Insight
        </div>
        {isLoading ? (
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <div className="w-4 h-4 border-2 border-white/20 border-t-[#9d7cff] rounded-full animate-spin" />
            Generating insight...
          </div>
        ) : (
          <p className="text-white/80 text-sm leading-relaxed">{interpretation}</p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-3 text-center">
        <p className="text-xs text-white/40">
          Part of your {chartData.type} design with {chartData.authority} authority
        </p>
      </div>
    </div>
  );
}
