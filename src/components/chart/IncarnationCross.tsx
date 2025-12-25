import type { Cross } from '@/types';
import { Badge } from '@/components/ui';

interface IncarnationCrossProps {
  cross: Cross;
}

export function IncarnationCross({ cross }: IncarnationCrossProps) {
  const gateLabels = ['Personality Sun', 'Personality Earth', 'Design Sun', 'Design Earth'];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {cross.name}
        </span>
        <Badge variant="purple">{cross.type}</Badge>
        <Badge variant="blue">Quarter of {cross.quarter}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {cross.gates.map((gate, index) => (
          <Badge key={index} variant="gray">
            {gateLabels[index]}: Gate {gate}
          </Badge>
        ))}
      </div>
    </div>
  );
}
