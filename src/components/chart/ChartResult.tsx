import type { ChartData, BirthData } from '@/types';
import { Card } from '@/components/ui';
import { ChartOverview } from './ChartOverview';
import { IncarnationCross } from './IncarnationCross';
import { CentersGrid } from './CentersGrid';
import { ChannelsList } from './ChannelsList';
import { ActivationsTable } from './ActivationsTable';
import { CircuitryBalance } from './CircuitryBalance';

interface ChartResultProps {
  chart: ChartData;
  birth: BirthData;
}

export function ChartResult({ chart, birth }: ChartResultProps) {
  const birthDate = new Date(birth.datetime_utc);
  const formattedDate = birthDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="space-y-6 mt-8">
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Chart calculated for {formattedDate}
      </div>

      <Card>
        <ChartOverview chart={chart} />
      </Card>

      <Card title="Incarnation Cross">
        <IncarnationCross cross={chart.cross} />
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Energy Centers">
          <CentersGrid centers={chart.centers} />
        </Card>

        <Card title="Circuitry Balance">
          <CircuitryBalance circuitry={chart.circuitry} />
        </Card>
      </div>

      <Card title="Channels">
        <ChannelsList channels={chart.channels} />
      </Card>

      <Card title="Planetary Activations">
        <ActivationsTable
          personality={chart.activations.personality}
          design={chart.activations.design}
        />
      </Card>
    </div>
  );
}
