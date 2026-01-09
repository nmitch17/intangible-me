import { z } from 'zod';

export const getCurrentTransitToolDefinition = {
  name: 'getCurrentTransit',
  description: 'Get the current Human Design transit (planetary activations) for right now or a specific datetime. Shows which gates are activated by current planetary positions.',
  parameters: z.object({
    datetime_utc: z.string().optional().describe('Optional datetime in UTC ISO format. Defaults to current moment if not provided.'),
  }),
};

export async function executeGetCurrentTransit({ datetime_utc }: { datetime_utc?: string }) {
  try {
    const datetime = datetime_utc || new Date().toISOString();

    // Call the internal transit API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/transit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetime_utc: datetime }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to calculate transit',
      };
    }

    const transitData = await response.json();
    return {
      success: true,
      transit: transitData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
