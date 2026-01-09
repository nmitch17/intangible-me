import type { Center, CenterName } from '@/types';

interface CentersGridProps {
  centers: Record<CenterName, Center>;
}

const centerDisplayNames: Record<CenterName, string> = {
  head: 'Head',
  ajna: 'Ajna',
  throat: 'Throat',
  g: 'G (Identity)',
  ego: 'Ego/Heart',
  sacral: 'Sacral',
  solar_plexus: 'Solar Plexus',
  spleen: 'Spleen',
  root: 'Root',
};

const centerOrder: CenterName[] = [
  'head',
  'ajna',
  'throat',
  'g',
  'ego',
  'sacral',
  'solar_plexus',
  'spleen',
  'root',
];

export function CentersGrid({ centers }: CentersGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {centerOrder.map((centerKey) => {
        const center = centers[centerKey];
        const isDefined = center.defined;

        return (
          <div
            key={centerKey}
            className={`p-3 rounded-xl border ${
              isDefined
                ? 'border-green-300 bg-green-50'
                : 'border-dashed border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-deep-cosmos text-sm">
                {centerDisplayNames[centerKey]}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isDefined
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isDefined ? 'Defined' : 'Open'}
              </span>
            </div>
            {center.gates.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {center.gates.map((gate) => (
                  <span
                    key={gate}
                    className="text-xs bg-deep-cosmos/10 text-deep-cosmos/70 px-1.5 py-0.5 rounded"
                  >
                    {gate}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
