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
            className={`p-3 rounded-lg border-2 ${
              isDefined
                ? 'border-[var(--hd-defined)] bg-green-50 dark:bg-green-900/20'
                : 'border-dashed border-[var(--hd-undefined)] bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {centerDisplayNames[centerKey]}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  isDefined
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
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
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded"
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
