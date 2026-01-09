import { z } from 'zod';
import { CHANNELS, getChannel } from '@/lib/reference/channels';

export const getChannelInfoToolDefinition = {
  name: 'getChannelInfo',
  description: 'Get detailed information about a Human Design channel by its gates or name. Returns circuit, stream, and thematic meaning.',
  parameters: z.object({
    gate_a: z.number().min(1).max(64).optional().describe('First gate of the channel'),
    gate_b: z.number().min(1).max(64).optional().describe('Second gate of the channel'),
    channel_id: z.string().optional().describe('Channel ID in format "gate1-gate2" (e.g., "12-22")'),
  }),
};

export async function executeGetChannelInfo({ gate_a, gate_b, channel_id }: { gate_a?: number; gate_b?: number; channel_id?: string }) {
  try {
    let channel;

    if (channel_id) {
      // Parse channel_id (e.g., "12-22")
      const [a, b] = channel_id.split('-').map(Number);
      channel = getChannel(a, b);
    } else if (gate_a !== undefined && gate_b !== undefined) {
      channel = getChannel(gate_a, gate_b);
    } else {
      return {
        success: false,
        error: 'Please provide either gate_a and gate_b, or channel_id',
      };
    }

    if (!channel) {
      return {
        success: false,
        error: `Channel not found. Ensure both gates form a valid Human Design channel.`,
      };
    }

    // Channel descriptions based on circuit and stream
    const descriptions: Record<string, Record<string, string>> = {
      Individual: {
        Knowing: 'Individual circuitry focused on unique knowing and mutation. These channels bring new ideas and ways of being into the world.',
        Centering: 'Individual circuitry for empowerment and self-love. These channels connect us to our unique life force.',
        Integration: 'The integration channels are about survival, self-sufficiency, and attunement to the moment.',
      },
      Tribal: {
        Ego: 'Tribal ego circuit focused on material support, resources, and tribal agreements.',
        Defense: 'Tribal defense circuit focused on protection, nurturing, and emotional bonds within the tribe.',
      },
      Collective: {
        Logic: 'Collective logic circuit focused on patterns, formulas, and sharing understanding for the future.',
        Sensing: 'Collective sensing circuit focused on experience, reflection, and sharing stories from the past.',
      },
    };

    const circuitDesc = descriptions[channel.circuit]?.[channel.stream] ||
      `${channel.circuit} circuit, ${channel.stream} stream.`;

    return {
      success: true,
      channel: {
        gates: channel.gates,
        name: channel.name,
        circuit: channel.circuit,
        stream: channel.stream,
        description: `The Channel of ${channel.name} (${channel.gates[0]}-${channel.gates[1]}): ${circuitDesc}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Export all channels for reference
export const getAllChannels = () => CHANNELS;
