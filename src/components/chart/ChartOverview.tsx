import type { ChartData } from '@/types';

interface ChartOverviewProps {
  chart: ChartData;
}

export function ChartOverview({ chart }: ChartOverviewProps) {
  const metrics = [
    { label: 'Type', value: chart.type },
    { label: 'Strategy', value: chart.strategy },
    { label: 'Authority', value: chart.authority },
    { label: 'Profile', value: chart.profile },
    { label: 'Definition', value: chart.definition },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white/5 border border-white/10 p-4 rounded-lg text-center"
        >
          <p className="text-xs font-mono text-nebula-cyan uppercase tracking-wider mb-1">
            {metric.label}
          </p>
          <p className="text-lg font-semibold text-white">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
