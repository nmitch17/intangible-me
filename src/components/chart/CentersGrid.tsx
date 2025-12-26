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
            className={`p-3 rounded-lg border ${
              isDefined
                ? 'border-green-500/40 bg-green-500/10'
                : 'border-dashed border-white/20 bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white text-sm">
                {centerDisplayNames[centerKey]}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  isDefined
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/10 text-white/50'
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
                    className="text-xs bg-white/10 text-white/70 px-1.5 py-0.5 rounded"
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
