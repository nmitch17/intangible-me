import { NextRequest, NextResponse } from 'next/server';
import { CHANNELS, getChannel } from '@/lib/reference/channels';
import type { ChannelReference } from '@/types';
import { z } from 'zod';

/**
 * Query parameter validation schema
 */
const queryParamsSchema = z.object({
  circuit: z.enum(['Individual', 'Tribal', 'Collective']).optional(),
  stream: z.string().optional(),
  gates: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(36),
});

/**
 * Convert Channel to ChannelReference format
 */
function toChannelReference(channel: typeof CHANNELS[0]): ChannelReference {
  return {
    id: `${channel.gates[0]}-${channel.gates[1]}`,
    gates: channel.gates,
    name: channel.name,
    circuit: channel.circuit,
    stream: channel.stream,
  };
}

/**
 * GET /api/reference/channels
 * Returns all channels with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = queryParamsSchema.parse({
      circuit: searchParams.get('circuit'),
      stream: searchParams.get('stream'),
      gates: searchParams.get('gates'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    let channels = CHANNELS.map(toChannelReference);

    // Filter by circuit if specified
    if (params.circuit) {
      channels = channels.filter(c => c.circuit === params.circuit);
    }

    // Filter by stream if specified
    if (params.stream) {
      channels = channels.filter(c => c.stream.toLowerCase() === params.stream!.toLowerCase());
    }

    // Filter by specific gate pair if specified
    if (params.gates) {
      const gateParts = params.gates.includes('-') ? params.gates.split('-') : params.gates.split(',');
      if (gateParts.length === 2) {
        const gate1 = parseInt(gateParts[0].trim());
        const gate2 = parseInt(gateParts[1].trim());

        // Validate that parsing succeeded
        if (isNaN(gate1) || isNaN(gate2)) {
          return NextResponse.json(
            { error: 'Invalid gate numbers in gates parameter' },
            { status: 400 }
          );
        }

        const channel = getChannel(gate1, gate2);
        if (channel) {
          return NextResponse.json({
            data: [toChannelReference(channel)],
            pagination: {
              page: 1,
              limit: 1,
              total: 1,
              total_pages: 1,
            },
          });
        } else {
          return NextResponse.json({
            data: [],
            pagination: {
              page: 1,
              limit: 1,
              total: 0,
              total_pages: 0,
            },
          });
        }
      }
    }

    // Pagination
    const total = channels.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedChannels = channels.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedChannels,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        total_pages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Channels reference error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
