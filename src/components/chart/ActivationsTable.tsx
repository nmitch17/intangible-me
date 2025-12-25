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
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">
              Planet
            </th>
            <th className="text-center py-2 px-3 font-medium" style={{ color: 'var(--hd-personality)' }}>
              <span className="dark:text-gray-100">Personality</span>
            </th>
            <th className="text-center py-2 px-3 font-medium" style={{ color: 'var(--hd-design)' }}>
              Design
            </th>
          </tr>
        </thead>
        <tbody>
          {planetOrder.map((planet) => {
            const pAct = personality[planet];
            const dAct = design[planet];

            return (
              <tr key={planet} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                  {planetDisplayNames[planet]}
                </td>
                <td className="py-2 px-3 text-center font-mono text-gray-900 dark:text-gray-100">
                  {pAct.gate}.{pAct.line}
                </td>
                <td
                  className="py-2 px-3 text-center font-mono"
                  style={{ color: 'var(--hd-design)' }}
                >
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
