import type { Activations, Planet } from '@/types';

interface ActivationsTableProps {
  personality: Activations;
  design: Activations;
}

const planetOrder: Planet[] = [
  'sun',
  'earth',
  'north_node',
  'south_node',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
];

const planetDisplayNames: Record<Planet, string> = {
  sun: 'Sun',
  earth: 'Earth',
  north_node: 'North Node',
  south_node: 'South Node',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
  pluto: 'Pluto',
};

export function ActivationsTable({ personality, design }: ActivationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-deep-cosmos/10">
            <th className="text-left py-2 px-3 font-mono text-xs uppercase tracking-wider text-deep-cosmos/50">
              Planet
            </th>
            <th className="text-center py-2 px-3 font-mono text-xs uppercase tracking-wider text-deep-cosmos">
              Personality
            </th>
            <th className="text-center py-2 px-3 font-mono text-xs uppercase tracking-wider text-red-500">
              Design
            </th>
          </tr>
        </thead>
        <tbody>
          {planetOrder.map((planet) => {
            const pAct = personality[planet];
            const dAct = design[planet];

            return (
              <tr key={planet} className="border-b border-deep-cosmos/5">
                <td className="py-2 px-3 text-deep-cosmos/70">
                  {planetDisplayNames[planet]}
                </td>
                <td className="py-2 px-3 text-center font-mono text-deep-cosmos">
                  {pAct.gate}.{pAct.line}
                </td>
                <td className="py-2 px-3 text-center font-mono text-red-500">
                  {dAct.gate}.{dAct.line}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
