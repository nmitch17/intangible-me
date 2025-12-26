import type { Channel, Circuit } from '@/types';
import { Badge } from '@/components/ui';

interface ChannelsListProps {
  channels: Channel[];
}

const circuitVariants: Record<Circuit, 'purple' | 'orange' | 'blue'> = {
  Individual: 'purple',
  Tribal: 'orange',
  Collective: 'blue',
};

export function ChannelsList({ channels }: ChannelsListProps) {
  if (channels.length === 0) {
    return (
      <p className="text-white/50 italic">
        No complete channels (Reflector design)
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {channels.map((channel) => (
        <div
          key={channel.name}
          className="flex flex-wrap items-center gap-2 p-3 bg-white/5 border border-white/10 rounded"
        >
          <span className="font-mono font-medium text-nebula-cyan">
            {channel.gates[0]}-{channel.gates[1]}
          </span>
          <span className="text-white/80">{channel.name}</span>
          <Badge variant={circuitVariants[channel.circuit]}>{channel.circuit}</Badge>
          <Badge variant="gray">{channel.stream}</Badge>
        </div>
      ))}
    </div>
  );
}
