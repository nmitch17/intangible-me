import { NextRequest, NextResponse } from 'next/server';
import { calculateTransits } from '@/lib/calculation/ephemeris';
import { calculateChart, findChannels, collectGates } from '@/lib/calculation/chart';
import { z } from 'zod';

const requestSchema = z.object({
  datetime_utc: z.string().datetime().optional(),
  natal_chart: z.object({
    datetime_utc: z.string().datetime(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = requestSchema.parse(body);

    // Use current time if not specified
    const transitDate = validated.datetime_utc
      ? new Date(validated.datetime_utc)
      : new Date();

    const activations = await calculateTransits(transitDate);

    const response: any = {
      datetime_utc: transitDate.toISOString(),
      activations,
    };

    // If natal chart provided, calculate temporary channels
    if (validated.natal_chart) {
      const natalChart = await calculateChart(new Date(validated.natal_chart.datetime_utc));
      const natalGates = new Set<number>();

      // Collect natal gates
      for (const activation of Object.values(natalChart.activations.personality)) {
        natalGates.add(activation.gate);
      }
      for (const activation of Object.values(natalChart.activations.design)) {
        natalGates.add(activation.gate);
      }

      // Collect transit gates
      const transitGates = new Set<number>();
      for (const activation of Object.values(activations)) {
        transitGates.add(activation.gate);
      }

      // Combine gates to find temporary channels
      const combinedGates = new Set([...natalGates, ...transitGates]);
      const allChannels = findChannels(combinedGates);
      const natalChannels = findChannels(natalGates);

      // Find channels that only exist with transits
      const temporaryChannels = allChannels.filter(channel => {
        return !natalChannels.some(nc =>
          nc.gates[0] === channel.gates[0] && nc.gates[1] === channel.gates[1]
        );
      });

      response.natal_overlay = {
        temporary_channels: temporaryChannels,
        natal_gates: Array.from(natalGates),
        transit_gates: Array.from(transitGates),
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Transit calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
