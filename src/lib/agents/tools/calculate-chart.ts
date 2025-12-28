import { z } from 'zod';

export const calculateChartToolDefinition = {
  name: 'calculateChart',
  description: 'Calculate a Human Design chart from birth data. Returns complete chart including type, strategy, authority, profile, centers, channels, and activations.',
  parameters: z.object({
    datetime_utc: z.string().describe('Birth datetime in UTC ISO format (e.g., "1990-01-15T14:30:00Z")'),
    lat: z.number().describe('Birth location latitude'),
    lng: z.number().describe('Birth location longitude'),
  }),
};

export async function executeCalculateChart({ datetime_utc, lat, lng }: { datetime_utc: string; lat: number; lng: number }) {
  try {
    // Call the internal chart API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetime_utc, lat, lng }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to calculate chart',
      };
    }

    const chartData = await response.json();
    return {
      success: true,
      chart: chartData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
