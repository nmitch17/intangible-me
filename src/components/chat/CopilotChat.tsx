'use client';

import { useState, useEffect } from 'react';
import { useCopilotReadable } from '@copilotkit/react-core';
import { CopilotChat as CopilotChatUI } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import type { ChartData } from '@/types';

interface CopilotChatProps {
  chart?: ChartData | null;
}

export function CopilotChat({ chart }: CopilotChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Provide chart context to CopilotKit
  useCopilotReadable({
    description: "The user's complete Human Design chart data including type, authority, profile, centers, gates, channels, and incarnation cross",
    value: chart,
  });

  if (!mounted) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #ff9d6c, #f0a2b1)',
          boxShadow:
            '0 8px 30px rgba(255, 157, 108, 0.4), 0 4px 15px rgba(240, 162, 177, 0.3)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] rounded-3xl overflow-hidden flex flex-col copilot-chat-container"
          style={{
            background: 'rgba(13, 7, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 157, 108, 0.2)',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 157, 108, 0.15)',
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
            <h3 className="font-mono text-xs uppercase tracking-widest text-solar-glow">
              HD Guide
            </h3>
            <p className="text-white/50 text-xs mt-1">
              {chart
                ? `${chart.type} • ${chart.authority}`
                : 'Calculate your chart first'}
            </p>
          </div>

          {/* CopilotKit Chat UI */}
          <div className="flex-1 overflow-hidden">
            <CopilotChatUI
              labels={{
                initial: chart
                  ? `Hello! I see you're a ${chart.type} with ${chart.authority} Authority. I'm here to help you understand your Human Design chart. What would you like to know?`
                  : 'Please calculate your chart first to get personalized guidance.',
                placeholder: chart
                  ? 'Ask about your chart...'
                  : 'Calculate your chart first',
              }}
              className="h-full copilot-chat-inner"
            />
          </div>
        </div>
      )}

      {/* Custom styles for CopilotKit UI */}
      <style jsx global>{`
        .copilot-chat-container .copilot-chat-inner {
          background: transparent !important;
          height: 100% !important;
        }

        .copilot-chat-container [class*="copilotkit"] {
          background: transparent !important;
          font-family: var(--font-outfit), sans-serif !important;
        }

        .copilot-chat-container [class*="messages"] {
          background: transparent !important;
          padding: 1rem !important;
        }

        .copilot-chat-container [class*="message"] {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .copilot-chat-container [class*="user"] [class*="message"] {
          background: linear-gradient(135deg, rgba(255, 157, 108, 0.2), rgba(240, 162, 177, 0.15)) !important;
          border: 1px solid rgba(255, 157, 108, 0.3) !important;
        }

        .copilot-chat-container [class*="input"] {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 9999px !important;
          color: white !important;
          padding: 0.5rem 1rem !important;
        }

        .copilot-chat-container [class*="input"]::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }

        .copilot-chat-container [class*="input"]:focus {
          border-color: rgba(255, 157, 108, 0.5) !important;
          outline: none !important;
        }

        .copilot-chat-container button[type="submit"],
        .copilot-chat-container [class*="send"] {
          background: linear-gradient(135deg, #ff9d6c, #f0a2b1) !important;
          border-radius: 9999px !important;
          color: white !important;
        }

        .copilot-chat-container [class*="header"] {
          display: none !important;
        }

        .copilot-chat-container [class*="footer"] {
          background: transparent !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 0.75rem !important;
        }
      `}</style>
    </>
  );
}
