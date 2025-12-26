import { NextRequest, NextResponse } from 'next/server';
import { CHANNELS, getChannel } from '@/lib/reference/channels';
import type { ChannelReference } from '@/types';

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
    const circuit = searchParams.get('circuit');
    const stream = searchParams.get('stream');
    const gates = searchParams.get('gates'); // Format: "gate1-gate2" or "gate1,gate2"
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '36');

    let channels = CHANNELS.map(toChannelReference);

    // Filter by circuit if specified
    if (circuit) {
      channels = channels.filter(c => c.circuit.toLowerCase() === circuit.toLowerCase());
    }

    // Filter by stream if specified
    if (stream) {
      channels = channels.filter(c => c.stream.toLowerCase() === stream.toLowerCase());
    }

    // Filter by specific gate pair if specified
    if (gates) {
      const gateParts = gates.includes('-') ? gates.split('-') : gates.split(',');
      if (gateParts.length === 2) {
        const gate1 = parseInt(gateParts[0].trim());
        const gate2 = parseInt(gateParts[1].trim());
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
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChannels = channels.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedChannels,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Channels reference error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
