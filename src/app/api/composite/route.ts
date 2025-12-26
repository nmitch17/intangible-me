import { NextRequest, NextResponse } from 'next/server';
import { calculateChart, collectGates, findChannels } from '@/lib/calculation/chart';
import { getChannel } from '@/lib/reference/channels';
import type { Channel, ChartData, Definition } from '@/types';
import { z } from 'zod';

const chartRequestSchema = z.object({
  datetime_utc: z.string().datetime(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const requestSchema = z.object({
  chart_a: chartRequestSchema,
  chart_b: chartRequestSchema,
});

/**
 * Calculate definition type from connected centers
 */
function calculateCompositeDefinition(channels: Channel[]): Definition {
  if (channels.length === 0) return 'None';

  // Build graph of connected centers
  const graph = new Map<string, Set<string>>();
  const centers = new Set<string>();

  for (const channel of channels) {
    const { getGateCenter } = require('@/lib/calculation/mandala');
    const centerA = getGateCenter(channel.gates[0]);
    const centerB = getGateCenter(channel.gates[1]);

    centers.add(centerA);
    centers.add(centerB);

    if (!graph.has(centerA)) graph.set(centerA, new Set());
    if (!graph.has(centerB)) graph.set(centerB, new Set());

    graph.get(centerA)!.add(centerB);
    graph.get(centerB)!.add(centerA);
  }

  // Count connected components using DFS
  const visited = new Set<string>();
  let components = 0;

  for (const center of centers) {
    if (visited.has(center)) continue;

    components++;
    const stack = [center];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const neighbors = graph.get(current);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
  }

  switch (components) {
    case 1: return 'Single';
    case 2: return 'Split';
    case 3: return 'Triple Split';
    default: return 'Quadruple Split';
  }
}

/**
 * Analyze relationship dynamics between two charts
 */
function analyzeComposite(chartA: ChartData, chartB: ChartData) {
  // Collect gates from both charts
  const gatesA = collectGates(chartA.activations.personality, chartA.activations.design);
  const gatesB = collectGates(chartB.activations.personality, chartB.activations.design);

  // Find electromagnetic channels (one person has one gate, the other has the connecting gate)
  const electromagneticChannels: Channel[] = [];
  const { CHANNELS } = require('@/lib/reference/channels');

  for (const channel of CHANNELS) {
    const [gate1, gate2] = channel.gates;

    // A has gate1, B has gate2
    const aHasFirst = gatesA.has(gate1) && !gatesA.has(gate2);
    const bHasSecond = gatesB.has(gate2) && !gatesB.has(gate1);

    // A has gate2, B has gate1
    const aHasSecond = gatesA.has(gate2) && !gatesA.has(gate1);
    const bHasFirst = gatesB.has(gate1) && !gatesB.has(gate2);

    if ((aHasFirst && bHasSecond) || (aHasSecond && bHasFirst)) {
      electromagneticChannels.push(channel);
    }
  }

  // Find compromise gates (gates that neither has individually but appear when combined)
  const combinedGates = new Set([...gatesA, ...gatesB]);
  const allChannels = findChannels(combinedGates);
  const channelsA = findChannels(gatesA);
  const channelsB = findChannels(gatesB);

  // Gates involved in channels that only exist in composite
  const compromiseGates: number[] = [];
  for (const channel of allChannels) {
    const existsInA = channelsA.some(c =>
      c.gates[0] === channel.gates[0] && c.gates[1] === channel.gates[1]
    );
    const existsInB = channelsB.some(c =>
      c.gates[0] === channel.gates[0] && c.gates[1] === channel.gates[1]
    );

    if (!existsInA && !existsInB) {
      compromiseGates.push(...channel.gates);
    }
  }

  // Find shared channels (both have the complete channel)
  const sharedChannels: Channel[] = [];
  for (const channelA of channelsA) {
    const hasShared = channelsB.some(channelB =>
      channelA.gates[0] === channelB.gates[0] && channelA.gates[1] === channelB.gates[1]
    );
    if (hasShared) {
      sharedChannels.push(channelA);
    }
  }

  // Find dominance gates (both have the same gate)
  const dominanceGates: number[] = [];
  for (const gate of gatesA) {
    if (gatesB.has(gate)) {
      dominanceGates.push(gate);
    }
  }

  // Calculate combined definition
  const combinedDefinition = calculateCompositeDefinition(allChannels);

  return {
    electromagnetic: electromagneticChannels,
    compromise_gates: Array.from(new Set(compromiseGates)),
    dominance_gates: dominanceGates,
    shared_channels: sharedChannels,
    combined_channels: allChannels,
    combined_definition: combinedDefinition,
    companionship_analysis: {
      electromagnetic_count: electromagneticChannels.length,
      shared_channel_count: sharedChannels.length,
      dominance_gate_count: dominanceGates.length,
      compatibility_score: calculateCompatibilityScore(
        electromagneticChannels.length,
        sharedChannels.length,
        dominanceGates.length
      ),
    },
  };
}

/**
 * Simple compatibility score calculation
 */
function calculateCompatibilityScore(
  electromagneticCount: number,
  sharedCount: number,
  dominanceCount: number
): number {
  // Electromagnetic channels are highly desirable (3 points each)
  // Shared channels indicate companionship (2 points each)
  // Too many dominance gates can be challenging (-1 point each)
  const score = (electromagneticCount * 3) + (sharedCount * 2) - (dominanceCount * 0.5);
  return Math.max(0, Math.min(100, score * 2)); // Normalize to 0-100
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = requestSchema.parse(body);

    // Calculate both charts
    const chartA = await calculateChart(new Date(validated.chart_a.datetime_utc));
    const chartB = await calculateChart(new Date(validated.chart_b.datetime_utc));

    // Analyze composite
    const analysis = analyzeComposite(chartA, chartB);

    return NextResponse.json({
      chart_a: chartA,
      chart_b: chartB,
      analysis,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Composite calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
