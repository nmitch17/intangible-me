import type { Circuitry } from '@/types';

interface CircuitryBalanceProps {
  circuitry: Circuitry;
}

export function CircuitryBalance({ circuitry }: CircuitryBalanceProps) {
  const total = circuitry.individual + circuitry.tribal + circuitry.collective;

  if (total === 0) {
    return (
      <p className="text-deep-cosmos/50 italic">
        No channels defined
      </p>
    );
  }

  const circuits = [
    { name: 'Individual', count: circuitry.individual, color: 'var(--hd-individual)' },
    { name: 'Tribal', count: circuitry.tribal, color: 'var(--hd-tribal)' },
    { name: 'Collective', count: circuitry.collective, color: 'var(--hd-collective)' },
  ];

  return (
    <div className="space-y-4">
      {circuits.map((circuit) => {
        const percentage = total > 0 ? (circuit.count / total) * 100 : 0;

        return (
          <div key={circuit.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-deep-cosmos/80">{circuit.name}</span>
              <span className="text-deep-cosmos/50 font-mono text-xs">
                {circuit.count} channel{circuit.count !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="h-2 bg-deep-cosmos/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: circuit.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
