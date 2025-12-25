/**
 * Incarnation Cross Reference Data
 * 
 * This is a partial list - full implementation needs 192+ crosses.
 * Key format: "personalitySun-personalityEarth-designSun-designEarth"
 */

export interface CrossReference {
  name: string;
  quarter: string;
  description?: string;
}

export const CROSSES: Record<string, CrossReference> = {
  // Quarter of Initiation examples
  '13-7-43-23': { name: 'Right Angle Cross of the Sphinx', quarter: 'Initiation' },
  '1-2-7-13': { name: 'Right Angle Cross of the Sphinx', quarter: 'Initiation' },
  '2-1-13-7': { name: 'Right Angle Cross of the Sphinx', quarter: 'Initiation' },
  '7-13-1-2': { name: 'Right Angle Cross of the Sphinx', quarter: 'Initiation' },
  
  '49-4-13-7': { name: 'Right Angle Cross of Explanation', quarter: 'Initiation' },
  '30-29-55-59': { name: 'Right Angle Cross of Contagion', quarter: 'Initiation' },
  '55-59-30-29': { name: 'Right Angle Cross of Contagion', quarter: 'Initiation' },
  
  // Quarter of Civilization examples
  '2-1-46-25': { name: 'Right Angle Cross of the Vessel of Love', quarter: 'Civilization' },
  '23-43-2-1': { name: 'Right Angle Cross of Explanation', quarter: 'Civilization' },
  '8-14-55-59': { name: 'Right Angle Cross of Contagion', quarter: 'Civilization' },
  '20-34-37-40': { name: 'Right Angle Cross of the Sleeping Phoenix', quarter: 'Civilization' },
  
  // Quarter of Duality examples
  '47-22-12-11': { name: 'Juxtaposition Cross of Oppression', quarter: 'Duality' },
  '6-36-12-11': { name: 'Right Angle Cross of Eden', quarter: 'Duality' },
  '46-25-15-10': { name: 'Right Angle Cross of the Vessel of Love', quarter: 'Duality' },
  
  // Quarter of Mutation examples
  '1-2-43-23': { name: 'Right Angle Cross of the Sphinx', quarter: 'Mutation' },
  '43-23-1-2': { name: 'Right Angle Cross of Explanation', quarter: 'Mutation' },
  '14-8-59-55': { name: 'Right Angle Cross of Contagion', quarter: 'Mutation' },
  '34-20-40-37': { name: 'Right Angle Cross of the Sleeping Phoenix', quarter: 'Mutation' },
  '9-16-64-63': { name: 'Right Angle Cross of Planning', quarter: 'Mutation' },
  
  // Add more crosses as needed...
};

/**
 * Get cross by gate combination
 */
export function getCross(
  personalitySun: number,
  personalityEarth: number,
  designSun: number,
  designEarth: number
): CrossReference | undefined {
  const key = `${personalitySun}-${personalityEarth}-${designSun}-${designEarth}`;
  return CROSSES[key];
}
