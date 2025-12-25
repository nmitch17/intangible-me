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
      <p className="text-gray-500 dark:text-gray-400 italic">
        No complete channels (Reflector design)
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {channels.map((channel) => (
        <div
          key={channel.name}
          className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {channel.gates[0]}-{channel.gates[1]}
          </span>
          <span className="text-gray-600 dark:text-gray-300">{channel.name}</span>
          <Badge variant={circuitVariants[channel.circuit]}>{channel.circuit}</Badge>
          <Badge variant="gray">{channel.stream}</Badge>
        </div>
      ))}
    </div>
  );
}
