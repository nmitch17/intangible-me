import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';
import {
  executeCalculateChart,
  executeGetGateInfo,
  executeGetChannelInfo,
  executeGetCurrentTransit,
} from '@/lib/agents/tools';

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: 'gemini-3-flash-preview',
});

export async function POST(req: NextRequest) {
  const runtime = new CopilotRuntime({
    actions: [
      {
        name: 'calculateChart',
        description: 'Calculate a Human Design chart from birth data. Returns complete chart including type, strategy, authority, profile, centers, channels, and activations.',
        parameters: [
          {
            name: 'datetime_utc',
            type: 'string',
            description: 'Birth datetime in UTC ISO format (e.g., "1990-01-15T14:30:00Z")',
            required: true,
          },
          {
            name: 'lat',
            type: 'number',
            description: 'Birth location latitude',
            required: true,
          },
          {
            name: 'lng',
            type: 'number',
            description: 'Birth location longitude',
            required: true,
          },
        ],
        handler: async (args: { datetime_utc: string; lat: number; lng: number }) => {
          return executeCalculateChart(args);
        },
      },
      {
        name: 'getGateInfo',
        description: 'Get detailed information about a specific Human Design gate, including its name, center location, and keynotes.',
        parameters: [
          {
            name: 'gate_id',
            type: 'number',
            description: 'The gate number (1-64)',
            required: true,
          },
        ],
        handler: async (args: { gate_id: number }) => {
          return executeGetGateInfo(args);
        },
      },
      {
        name: 'getChannelInfo',
        description: 'Get detailed information about a Human Design channel by its gates or name. Returns circuit, stream, and thematic meaning.',
        parameters: [
          {
            name: 'gate_a',
            type: 'number',
            description: 'First gate of the channel',
            required: false,
          },
          {
            name: 'gate_b',
            type: 'number',
            description: 'Second gate of the channel',
            required: false,
          },
          {
            name: 'channel_id',
            type: 'string',
            description: 'Channel ID in format "gate1-gate2" (e.g., "12-22")',
            required: false,
          },
        ],
        handler: async (args: { gate_a?: number; gate_b?: number; channel_id?: string }) => {
          return executeGetChannelInfo(args);
        },
      },
      {
        name: 'getCurrentTransit',
        description: 'Get the current Human Design transit (planetary activations) for right now or a specific datetime. Shows which gates are activated by current planetary positions.',
        parameters: [
          {
            name: 'datetime_utc',
            type: 'string',
            description: 'Optional datetime in UTC ISO format. Defaults to current moment if not provided.',
            required: false,
          },
        ],
        handler: async (args: { datetime_utc?: string }) => {
          return executeGetCurrentTransit(args);
        },
      },
    ],
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
}
