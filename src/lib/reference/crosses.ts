/**
 * Incarnation Cross Reference Data
 *
 * Complete list of 192+ incarnation crosses with their gate combinations.
 * Each cross has 4 gates: [Personality Sun, Personality Earth, Design Sun, Design Earth]
 */

export type CrossType = 'Right Angle' | 'Left Angle' | 'Juxtaposition';
export type Quarter = 'Initiation' | 'Civilization' | 'Duality' | 'Mutation';

export interface CrossReference {
  name: string;
  type: CrossType;
  quarter: Quarter;
  description?: string;
}

/**
 * All incarnation crosses indexed by gate combination
 * Key format: "personalitySun-personalityEarth-designSun-designEarth"
 */
export const CROSSES: Record<string, CrossReference> = {
  // ============================================================================
  // QUARTER OF INITIATION (Purpose fulfilled through Impact)
  // Gates 13, 7, 1, 2, 49, 4, 43, 23, 30, 29, 55, 59, 37, 40, 63, 22, 36, 25
  // ============================================================================

  // Right Angle Cross of the Sphinx (13/7)
  '13-7-1-2': { name: 'Right Angle Cross of the Sphinx 1', type: 'Right Angle', quarter: 'Initiation' },
  '7-13-2-1': { name: 'Right Angle Cross of the Sphinx 2', type: 'Right Angle', quarter: 'Initiation' },
  '1-2-13-7': { name: 'Right Angle Cross of the Sphinx 3', type: 'Right Angle', quarter: 'Initiation' },
  '2-1-7-13': { name: 'Right Angle Cross of the Sphinx 4', type: 'Right Angle', quarter: 'Initiation' },

  // Left Angle Cross of the Sphinx
  '13-7-43-23': { name: 'Left Angle Cross of the Sphinx 1', type: 'Left Angle', quarter: 'Initiation' },
  '7-13-23-43': { name: 'Left Angle Cross of the Sphinx 2', type: 'Left Angle', quarter: 'Initiation' },

  // Juxtaposition Cross of Listening
  '13-7-13-7': { name: 'Juxtaposition Cross of Listening', type: 'Juxtaposition', quarter: 'Initiation' },

  // Right Angle Cross of Explanation (49/4)
  '49-4-13-7': { name: 'Right Angle Cross of Explanation 1', type: 'Right Angle', quarter: 'Initiation' },
  '4-49-7-13': { name: 'Right Angle Cross of Explanation 2', type: 'Right Angle', quarter: 'Initiation' },
  '13-7-49-4': { name: 'Right Angle Cross of Explanation 3', type: 'Right Angle', quarter: 'Initiation' },
  '7-13-4-49': { name: 'Right Angle Cross of Explanation 4', type: 'Right Angle', quarter: 'Initiation' },

  // Left Angle Cross of Explanation
  '49-4-30-29': { name: 'Left Angle Cross of Explanation 1', type: 'Left Angle', quarter: 'Initiation' },
  '4-49-29-30': { name: 'Left Angle Cross of Explanation 2', type: 'Left Angle', quarter: 'Initiation' },

  // Juxtaposition Cross of Principles
  '49-4-49-4': { name: 'Juxtaposition Cross of Principles', type: 'Juxtaposition', quarter: 'Initiation' },

  // Right Angle Cross of Contagion (30/29)
  '30-29-55-59': { name: 'Right Angle Cross of Contagion 1', type: 'Right Angle', quarter: 'Initiation' },
  '29-30-59-55': { name: 'Right Angle Cross of Contagion 2', type: 'Right Angle', quarter: 'Initiation' },
  '55-59-30-29': { name: 'Right Angle Cross of Contagion 3', type: 'Right Angle', quarter: 'Initiation' },
  '59-55-29-30': { name: 'Right Angle Cross of Contagion 4', type: 'Right Angle', quarter: 'Initiation' },

  // Left Angle Cross of Contagion
  '30-29-37-40': { name: 'Left Angle Cross of Contagion 1', type: 'Left Angle', quarter: 'Initiation' },
  '29-30-40-37': { name: 'Left Angle Cross of Contagion 2', type: 'Left Angle', quarter: 'Initiation' },

  // Juxtaposition Cross of Feelings
  '30-29-30-29': { name: 'Juxtaposition Cross of Feelings', type: 'Juxtaposition', quarter: 'Initiation' },

  // Right Angle Cross of the Sleeping Phoenix (37/40)
  '37-40-63-22': { name: 'Right Angle Cross of the Sleeping Phoenix 1', type: 'Right Angle', quarter: 'Initiation' },
  '40-37-22-63': { name: 'Right Angle Cross of the Sleeping Phoenix 2', type: 'Right Angle', quarter: 'Initiation' },
  '63-22-37-40': { name: 'Right Angle Cross of the Sleeping Phoenix 3', type: 'Right Angle', quarter: 'Initiation' },
  '22-63-40-37': { name: 'Right Angle Cross of the Sleeping Phoenix 4', type: 'Right Angle', quarter: 'Initiation' },

  // Left Angle Cross of the Sleeping Phoenix
  '37-40-36-25': { name: 'Left Angle Cross of the Sleeping Phoenix 1', type: 'Left Angle', quarter: 'Initiation' },
  '40-37-25-36': { name: 'Left Angle Cross of the Sleeping Phoenix 2', type: 'Left Angle', quarter: 'Initiation' },

  // Juxtaposition Cross of Bargains
  '37-40-37-40': { name: 'Juxtaposition Cross of Bargains', type: 'Juxtaposition', quarter: 'Initiation' },

  // Right Angle Cross of Maya (36/25)
  '36-25-63-22': { name: 'Right Angle Cross of Maya 1', type: 'Right Angle', quarter: 'Initiation' },
  '25-36-22-63': { name: 'Right Angle Cross of Maya 2', type: 'Right Angle', quarter: 'Initiation' },
  '63-22-36-25': { name: 'Right Angle Cross of Maya 3', type: 'Right Angle', quarter: 'Initiation' },
  '22-63-25-36': { name: 'Right Angle Cross of Maya 4', type: 'Right Angle', quarter: 'Initiation' },

  // Left Angle Cross of Maya
  '36-25-6-59': { name: 'Left Angle Cross of Maya 1', type: 'Left Angle', quarter: 'Initiation' },
  '25-36-59-6': { name: 'Left Angle Cross of Maya 2', type: 'Left Angle', quarter: 'Initiation' },

  // Juxtaposition Cross of Crisis
  '36-25-36-25': { name: 'Juxtaposition Cross of Crisis', type: 'Juxtaposition', quarter: 'Initiation' },

  // ============================================================================
  // QUARTER OF CIVILIZATION (Purpose fulfilled through Form)
  // Gates 2, 1, 23, 43, 8, 14, 55, 59, 19, 24, 27, 50, 3, 60, 42, 32, 21, 48
  // ============================================================================

  // Right Angle Cross of the Vessel of Love (2/1)
  '2-1-23-43': { name: 'Right Angle Cross of the Vessel of Love 1', type: 'Right Angle', quarter: 'Civilization' },
  '1-2-43-23': { name: 'Right Angle Cross of the Vessel of Love 2', type: 'Right Angle', quarter: 'Civilization' },
  '23-43-2-1': { name: 'Right Angle Cross of the Vessel of Love 3', type: 'Right Angle', quarter: 'Civilization' },
  '43-23-1-2': { name: 'Right Angle Cross of the Vessel of Love 4', type: 'Right Angle', quarter: 'Civilization' },

  // Left Angle Cross of the Vessel of Love
  '2-1-8-14': { name: 'Left Angle Cross of the Vessel of Love 1', type: 'Left Angle', quarter: 'Civilization' },
  '1-2-14-8': { name: 'Left Angle Cross of the Vessel of Love 2', type: 'Left Angle', quarter: 'Civilization' },

  // Juxtaposition Cross of Now
  '2-1-2-1': { name: 'Juxtaposition Cross of Now', type: 'Juxtaposition', quarter: 'Civilization' },

  // Right Angle Cross of Contribution (8/14)
  '8-14-55-59': { name: 'Right Angle Cross of Contribution 1', type: 'Right Angle', quarter: 'Civilization' },
  '14-8-59-55': { name: 'Right Angle Cross of Contribution 2', type: 'Right Angle', quarter: 'Civilization' },
  '55-59-8-14': { name: 'Right Angle Cross of Contribution 3', type: 'Right Angle', quarter: 'Civilization' },
  '59-55-14-8': { name: 'Right Angle Cross of Contribution 4', type: 'Right Angle', quarter: 'Civilization' },

  // Left Angle Cross of Contribution
  '8-14-19-24': { name: 'Left Angle Cross of Contribution 1', type: 'Left Angle', quarter: 'Civilization' },
  '14-8-24-19': { name: 'Left Angle Cross of Contribution 2', type: 'Left Angle', quarter: 'Civilization' },

  // Juxtaposition Cross of Contribution
  '8-14-8-14': { name: 'Juxtaposition Cross of Contribution', type: 'Juxtaposition', quarter: 'Civilization' },

  // Right Angle Cross of Service (19/24)
  '19-24-27-50': { name: 'Right Angle Cross of Service 1', type: 'Right Angle', quarter: 'Civilization' },
  '24-19-50-27': { name: 'Right Angle Cross of Service 2', type: 'Right Angle', quarter: 'Civilization' },
  '27-50-19-24': { name: 'Right Angle Cross of Service 3', type: 'Right Angle', quarter: 'Civilization' },
  '50-27-24-19': { name: 'Right Angle Cross of Service 4', type: 'Right Angle', quarter: 'Civilization' },

  // Left Angle Cross of Service
  '19-24-3-60': { name: 'Left Angle Cross of Service 1', type: 'Left Angle', quarter: 'Civilization' },
  '24-19-60-3': { name: 'Left Angle Cross of Service 2', type: 'Left Angle', quarter: 'Civilization' },

  // Juxtaposition Cross of Sensitivity
  '19-24-19-24': { name: 'Juxtaposition Cross of Sensitivity', type: 'Juxtaposition', quarter: 'Civilization' },

  // Right Angle Cross of the Unexpected (3/60)
  '3-60-42-32': { name: 'Right Angle Cross of the Unexpected 1', type: 'Right Angle', quarter: 'Civilization' },
  '60-3-32-42': { name: 'Right Angle Cross of the Unexpected 2', type: 'Right Angle', quarter: 'Civilization' },
  '42-32-3-60': { name: 'Right Angle Cross of the Unexpected 3', type: 'Right Angle', quarter: 'Civilization' },
  '32-42-60-3': { name: 'Right Angle Cross of the Unexpected 4', type: 'Right Angle', quarter: 'Civilization' },

  // Left Angle Cross of the Unexpected
  '3-60-21-48': { name: 'Left Angle Cross of the Unexpected 1', type: 'Left Angle', quarter: 'Civilization' },
  '60-3-48-21': { name: 'Left Angle Cross of the Unexpected 2', type: 'Left Angle', quarter: 'Civilization' },

  // Juxtaposition Cross of Innovation
  '3-60-3-60': { name: 'Juxtaposition Cross of Innovation', type: 'Juxtaposition', quarter: 'Civilization' },

  // Right Angle Cross of Rulership (21/48)
  '21-48-42-32': { name: 'Right Angle Cross of Rulership 1', type: 'Right Angle', quarter: 'Civilization' },
  '48-21-32-42': { name: 'Right Angle Cross of Rulership 2', type: 'Right Angle', quarter: 'Civilization' },
  '42-32-21-48': { name: 'Right Angle Cross of Rulership 3', type: 'Right Angle', quarter: 'Civilization' },
  '32-42-48-21': { name: 'Right Angle Cross of Rulership 4', type: 'Right Angle', quarter: 'Civilization' },

  // Left Angle Cross of Rulership
  '21-48-38-28': { name: 'Left Angle Cross of Rulership 1', type: 'Left Angle', quarter: 'Civilization' },
  '48-21-28-38': { name: 'Left Angle Cross of Rulership 2', type: 'Left Angle', quarter: 'Civilization' },

  // Juxtaposition Cross of Control
  '21-48-21-48': { name: 'Juxtaposition Cross of Control', type: 'Juxtaposition', quarter: 'Civilization' },

  // ============================================================================
  // QUARTER OF DUALITY (Purpose fulfilled through Bonding)
  // Gates 47, 22, 12, 11, 6, 36, 25, 46, 17, 18, 58, 52, 39, 53, 62, 56, 31, 33
  // ============================================================================

  // Right Angle Cross of Eden (47/22)
  '47-22-12-11': { name: 'Right Angle Cross of Eden 1', type: 'Right Angle', quarter: 'Duality' },
  '22-47-11-12': { name: 'Right Angle Cross of Eden 2', type: 'Right Angle', quarter: 'Duality' },
  '12-11-47-22': { name: 'Right Angle Cross of Eden 3', type: 'Right Angle', quarter: 'Duality' },
  '11-12-22-47': { name: 'Right Angle Cross of Eden 4', type: 'Right Angle', quarter: 'Duality' },

  // Left Angle Cross of Eden
  '47-22-6-36': { name: 'Left Angle Cross of Eden 1', type: 'Left Angle', quarter: 'Duality' },
  '22-47-36-6': { name: 'Left Angle Cross of Eden 2', type: 'Left Angle', quarter: 'Duality' },

  // Juxtaposition Cross of Oppression
  '47-22-47-22': { name: 'Juxtaposition Cross of Oppression', type: 'Juxtaposition', quarter: 'Duality' },

  // Right Angle Cross of Education (6/36)
  '6-36-25-46': { name: 'Right Angle Cross of Education 1', type: 'Right Angle', quarter: 'Duality' },
  '36-6-46-25': { name: 'Right Angle Cross of Education 2', type: 'Right Angle', quarter: 'Duality' },
  '25-46-6-36': { name: 'Right Angle Cross of Education 3', type: 'Right Angle', quarter: 'Duality' },
  '46-25-36-6': { name: 'Right Angle Cross of Education 4', type: 'Right Angle', quarter: 'Duality' },

  // Left Angle Cross of Education
  '6-36-17-18': { name: 'Left Angle Cross of Education 1', type: 'Left Angle', quarter: 'Duality' },
  '36-6-18-17': { name: 'Left Angle Cross of Education 2', type: 'Left Angle', quarter: 'Duality' },

  // Juxtaposition Cross of Conflict
  '6-36-6-36': { name: 'Juxtaposition Cross of Conflict', type: 'Juxtaposition', quarter: 'Duality' },

  // Right Angle Cross of the Four Ways (17/18)
  '17-18-58-52': { name: 'Right Angle Cross of the Four Ways 1', type: 'Right Angle', quarter: 'Duality' },
  '18-17-52-58': { name: 'Right Angle Cross of the Four Ways 2', type: 'Right Angle', quarter: 'Duality' },
  '58-52-17-18': { name: 'Right Angle Cross of the Four Ways 3', type: 'Right Angle', quarter: 'Duality' },
  '52-58-18-17': { name: 'Right Angle Cross of the Four Ways 4', type: 'Right Angle', quarter: 'Duality' },

  // Left Angle Cross of the Four Ways
  '17-18-39-53': { name: 'Left Angle Cross of the Four Ways 1', type: 'Left Angle', quarter: 'Duality' },
  '18-17-53-39': { name: 'Left Angle Cross of the Four Ways 2', type: 'Left Angle', quarter: 'Duality' },

  // Juxtaposition Cross of Opinions
  '17-18-17-18': { name: 'Juxtaposition Cross of Opinions', type: 'Juxtaposition', quarter: 'Duality' },

  // Right Angle Cross of Tension (39/53)
  '39-53-62-56': { name: 'Right Angle Cross of Tension 1', type: 'Right Angle', quarter: 'Duality' },
  '53-39-56-62': { name: 'Right Angle Cross of Tension 2', type: 'Right Angle', quarter: 'Duality' },
  '62-56-39-53': { name: 'Right Angle Cross of Tension 3', type: 'Right Angle', quarter: 'Duality' },
  '56-62-53-39': { name: 'Right Angle Cross of Tension 4', type: 'Right Angle', quarter: 'Duality' },

  // Left Angle Cross of Tension
  '39-53-31-33': { name: 'Left Angle Cross of Tension 1', type: 'Left Angle', quarter: 'Duality' },
  '53-39-33-31': { name: 'Left Angle Cross of Tension 2', type: 'Left Angle', quarter: 'Duality' },

  // Juxtaposition Cross of Provocation
  '39-53-39-53': { name: 'Juxtaposition Cross of Provocation', type: 'Juxtaposition', quarter: 'Duality' },

  // Right Angle Cross of Influence (31/33)
  '31-33-62-56': { name: 'Right Angle Cross of Influence 1', type: 'Right Angle', quarter: 'Duality' },
  '33-31-56-62': { name: 'Right Angle Cross of Influence 2', type: 'Right Angle', quarter: 'Duality' },
  '62-56-31-33': { name: 'Right Angle Cross of Influence 3', type: 'Right Angle', quarter: 'Duality' },
  '56-62-33-31': { name: 'Right Angle Cross of Influence 4', type: 'Right Angle', quarter: 'Duality' },

  // Left Angle Cross of Influence
  '31-33-15-10': { name: 'Left Angle Cross of Influence 1', type: 'Left Angle', quarter: 'Duality' },
  '33-31-10-15': { name: 'Left Angle Cross of Influence 2', type: 'Left Angle', quarter: 'Duality' },

  // Juxtaposition Cross of Influence
  '31-33-31-33': { name: 'Juxtaposition Cross of Influence', type: 'Juxtaposition', quarter: 'Duality' },

  // ============================================================================
  // QUARTER OF MUTATION (Purpose fulfilled through Transformation)
  // Gates 44, 1, 43, 23, 34, 20, 16, 9, 5, 26, 11, 10, 46, 25, 15, 52, 35, 45
  // ============================================================================

  // Right Angle Cross of the Four Ways (44/1)
  '44-1-43-23': { name: 'Right Angle Cross of the Four Ways 1', type: 'Right Angle', quarter: 'Mutation' },
  '1-44-23-43': { name: 'Right Angle Cross of the Four Ways 2', type: 'Right Angle', quarter: 'Mutation' },
  '43-23-44-1': { name: 'Right Angle Cross of the Four Ways 3', type: 'Right Angle', quarter: 'Mutation' },
  '23-43-1-44': { name: 'Right Angle Cross of the Four Ways 4', type: 'Right Angle', quarter: 'Mutation' },

  // Left Angle Cross of the Four Ways (Mutation)
  '44-1-34-20': { name: 'Left Angle Cross of the Four Ways 1', type: 'Left Angle', quarter: 'Mutation' },
  '1-44-20-34': { name: 'Left Angle Cross of the Four Ways 2', type: 'Left Angle', quarter: 'Mutation' },

  // Juxtaposition Cross of Alertness
  '44-1-44-1': { name: 'Juxtaposition Cross of Alertness', type: 'Juxtaposition', quarter: 'Mutation' },

  // Right Angle Cross of the Alpha (34/20)
  '34-20-16-9': { name: 'Right Angle Cross of the Alpha 1', type: 'Right Angle', quarter: 'Mutation' },
  '20-34-9-16': { name: 'Right Angle Cross of the Alpha 2', type: 'Right Angle', quarter: 'Mutation' },
  '16-9-34-20': { name: 'Right Angle Cross of the Alpha 3', type: 'Right Angle', quarter: 'Mutation' },
  '9-16-20-34': { name: 'Right Angle Cross of the Alpha 4', type: 'Right Angle', quarter: 'Mutation' },

  // Left Angle Cross of the Alpha
  '34-20-5-26': { name: 'Left Angle Cross of the Alpha 1', type: 'Left Angle', quarter: 'Mutation' },
  '20-34-26-5': { name: 'Left Angle Cross of the Alpha 2', type: 'Left Angle', quarter: 'Mutation' },

  // Juxtaposition Cross of Charisma
  '34-20-34-20': { name: 'Juxtaposition Cross of Charisma', type: 'Juxtaposition', quarter: 'Mutation' },

  // Right Angle Cross of Planning (5/26)
  '5-26-11-10': { name: 'Right Angle Cross of Planning 1', type: 'Right Angle', quarter: 'Mutation' },
  '26-5-10-11': { name: 'Right Angle Cross of Planning 2', type: 'Right Angle', quarter: 'Mutation' },
  '11-10-5-26': { name: 'Right Angle Cross of Planning 3', type: 'Right Angle', quarter: 'Mutation' },
  '10-11-26-5': { name: 'Right Angle Cross of Planning 4', type: 'Right Angle', quarter: 'Mutation' },

  // Left Angle Cross of Planning
  '5-26-46-25': { name: 'Left Angle Cross of Planning 1', type: 'Left Angle', quarter: 'Mutation' },
  '26-5-25-46': { name: 'Left Angle Cross of Planning 2', type: 'Left Angle', quarter: 'Mutation' },

  // Juxtaposition Cross of the Trickster
  '5-26-5-26': { name: 'Juxtaposition Cross of the Trickster', type: 'Juxtaposition', quarter: 'Mutation' },

  // Right Angle Cross of Extremes (46/25)
  '46-25-15-52': { name: 'Right Angle Cross of Extremes 1', type: 'Right Angle', quarter: 'Mutation' },
  '25-46-52-15': { name: 'Right Angle Cross of Extremes 2', type: 'Right Angle', quarter: 'Mutation' },
  '15-52-46-25': { name: 'Right Angle Cross of Extremes 3', type: 'Right Angle', quarter: 'Mutation' },
  '52-15-25-46': { name: 'Right Angle Cross of Extremes 4', type: 'Right Angle', quarter: 'Mutation' },

  // Left Angle Cross of Extremes
  '46-25-35-45': { name: 'Left Angle Cross of Extremes 1', type: 'Left Angle', quarter: 'Mutation' },
  '25-46-45-35': { name: 'Left Angle Cross of Extremes 2', type: 'Left Angle', quarter: 'Mutation' },

  // Juxtaposition Cross of Determination
  '46-25-46-25': { name: 'Juxtaposition Cross of Determination', type: 'Juxtaposition', quarter: 'Mutation' },

  // Right Angle Cross of Consciousness (35/45)
  '35-45-15-52': { name: 'Right Angle Cross of Consciousness 1', type: 'Right Angle', quarter: 'Mutation' },
  '45-35-52-15': { name: 'Right Angle Cross of Consciousness 2', type: 'Right Angle', quarter: 'Mutation' },
  '15-52-35-45': { name: 'Right Angle Cross of Consciousness 3', type: 'Right Angle', quarter: 'Mutation' },
  '52-15-45-35': { name: 'Right Angle Cross of Consciousness 4', type: 'Right Angle', quarter: 'Mutation' },

  // Left Angle Cross of Consciousness
  '35-45-12-11': { name: 'Left Angle Cross of Consciousness 1', type: 'Left Angle', quarter: 'Mutation' },
  '45-35-11-12': { name: 'Left Angle Cross of Consciousness 2', type: 'Left Angle', quarter: 'Mutation' },

  // Juxtaposition Cross of Desire
  '35-45-35-45': { name: 'Juxtaposition Cross of Desire', type: 'Juxtaposition', quarter: 'Mutation' },

  // ============================================================================
  // Additional Right Angle Crosses
  // ============================================================================

  // Right Angle Cross of Penetration (51/57)
  '51-57-54-61': { name: 'Right Angle Cross of Penetration 1', type: 'Right Angle', quarter: 'Initiation' },
  '57-51-61-54': { name: 'Right Angle Cross of Penetration 2', type: 'Right Angle', quarter: 'Initiation' },
  '54-61-51-57': { name: 'Right Angle Cross of Penetration 3', type: 'Right Angle', quarter: 'Initiation' },
  '61-54-57-51': { name: 'Right Angle Cross of Penetration 4', type: 'Right Angle', quarter: 'Initiation' },

  // Right Angle Cross of Wishes (54/61)
  '54-61-54-61': { name: 'Right Angle Cross of Wishes 1', type: 'Right Angle', quarter: 'Initiation' },
  '61-54-61-54': { name: 'Right Angle Cross of Wishes 2', type: 'Right Angle', quarter: 'Initiation' },

  // Right Angle Cross of Dominion (45/26)
  '45-26-15-10': { name: 'Right Angle Cross of Dominion 1', type: 'Right Angle', quarter: 'Mutation' },
  '26-45-10-15': { name: 'Right Angle Cross of Dominion 2', type: 'Right Angle', quarter: 'Mutation' },

  // Right Angle Cross of Laws (38/28)
  '38-28-57-51': { name: 'Right Angle Cross of Laws 1', type: 'Right Angle', quarter: 'Duality' },
  '28-38-51-57': { name: 'Right Angle Cross of Laws 2', type: 'Right Angle', quarter: 'Duality' },
  '57-51-38-28': { name: 'Right Angle Cross of Laws 3', type: 'Right Angle', quarter: 'Duality' },
  '51-57-28-38': { name: 'Right Angle Cross of Laws 4', type: 'Right Angle', quarter: 'Duality' },

  // Right Angle Cross of the Vessel (50/27)
  '50-27-3-60': { name: 'Right Angle Cross of the Vessel 1', type: 'Right Angle', quarter: 'Civilization' },
  '27-50-60-3': { name: 'Right Angle Cross of the Vessel 2', type: 'Right Angle', quarter: 'Civilization' },

  // Right Angle Cross of Demands (9/16)
  '9-16-5-26': { name: 'Right Angle Cross of Demands 1', type: 'Right Angle', quarter: 'Mutation' },
  '16-9-26-5': { name: 'Right Angle Cross of Demands 2', type: 'Right Angle', quarter: 'Mutation' },

  // Right Angle Cross of Informing (64/63)
  '64-63-24-19': { name: 'Right Angle Cross of Informing 1', type: 'Right Angle', quarter: 'Civilization' },
  '63-64-19-24': { name: 'Right Angle Cross of Informing 2', type: 'Right Angle', quarter: 'Civilization' },
  '24-19-64-63': { name: 'Right Angle Cross of Informing 3', type: 'Right Angle', quarter: 'Civilization' },
  '19-24-63-64': { name: 'Right Angle Cross of Informing 4', type: 'Right Angle', quarter: 'Civilization' },

  // Right Angle Cross of Dedication (15/10)
  '15-10-35-45': { name: 'Right Angle Cross of Dedication 1', type: 'Right Angle', quarter: 'Mutation' },
  '10-15-45-35': { name: 'Right Angle Cross of Dedication 2', type: 'Right Angle', quarter: 'Mutation' },

  // Right Angle Cross of Masks (13/14)
  '13-14-2-1': { name: 'Right Angle Cross of Masks 1', type: 'Right Angle', quarter: 'Initiation' },
  '14-13-1-2': { name: 'Right Angle Cross of Masks 2', type: 'Right Angle', quarter: 'Initiation' },

  // Right Angle Cross of Revolution (49/19)
  '49-19-4-24': { name: 'Right Angle Cross of Revolution 1', type: 'Right Angle', quarter: 'Initiation' },
  '19-49-24-4': { name: 'Right Angle Cross of Revolution 2', type: 'Right Angle', quarter: 'Initiation' },

  // Right Angle Cross of Identification (7/8)
  '7-8-1-14': { name: 'Right Angle Cross of Identification 1', type: 'Right Angle', quarter: 'Initiation' },
  '8-7-14-1': { name: 'Right Angle Cross of Identification 2', type: 'Right Angle', quarter: 'Initiation' },

  // Right Angle Cross of Individualism (40/37)
  '40-37-64-63': { name: 'Right Angle Cross of Individualism 1', type: 'Right Angle', quarter: 'Initiation' },
  '37-40-63-64': { name: 'Right Angle Cross of Individualism 2', type: 'Right Angle', quarter: 'Initiation' },

  // Right Angle Cross of Doubt (63/64)
  '63-64-37-40': { name: 'Right Angle Cross of Doubt 1', type: 'Right Angle', quarter: 'Initiation' },
  '64-63-40-37': { name: 'Right Angle Cross of Doubt 2', type: 'Right Angle', quarter: 'Initiation' },

  // Juxtaposition Crosses (64 total, one for each gate)
  '1-2-1-2': { name: 'Juxtaposition Cross of Self-Expression', type: 'Juxtaposition', quarter: 'Civilization' },
  '3-60-3-60': { name: 'Juxtaposition Cross of Innovation', type: 'Juxtaposition', quarter: 'Civilization' },
  '4-49-4-49': { name: 'Juxtaposition Cross of Formulization', type: 'Juxtaposition', quarter: 'Initiation' },
  '5-26-5-26': { name: 'Juxtaposition Cross of the Trickster', type: 'Juxtaposition', quarter: 'Mutation' },
  '6-36-6-36': { name: 'Juxtaposition Cross of Conflict', type: 'Juxtaposition', quarter: 'Duality' },
  '7-13-7-13': { name: 'Juxtaposition Cross of the Alpha', type: 'Juxtaposition', quarter: 'Initiation' },
  '8-14-8-14': { name: 'Juxtaposition Cross of Contribution', type: 'Juxtaposition', quarter: 'Civilization' },
  '9-16-9-16': { name: 'Juxtaposition Cross of Focus', type: 'Juxtaposition', quarter: 'Mutation' },
  '10-15-10-15': { name: 'Juxtaposition Cross of Behavior', type: 'Juxtaposition', quarter: 'Mutation' },
  '11-12-11-12': { name: 'Juxtaposition Cross of Ideas', type: 'Juxtaposition', quarter: 'Duality' },
  '12-11-12-11': { name: 'Juxtaposition Cross of Education', type: 'Juxtaposition', quarter: 'Duality' },
  '14-8-14-8': { name: 'Juxtaposition Cross of Prosperity', type: 'Juxtaposition', quarter: 'Civilization' },
  '15-10-15-10': { name: 'Juxtaposition Cross of Extremes', type: 'Juxtaposition', quarter: 'Mutation' },
  '16-9-16-9': { name: 'Juxtaposition Cross of Experimentation', type: 'Juxtaposition', quarter: 'Mutation' },
  '17-18-17-18': { name: 'Juxtaposition Cross of Opinions', type: 'Juxtaposition', quarter: 'Duality' },
  '18-17-18-17': { name: 'Juxtaposition Cross of Correction', type: 'Juxtaposition', quarter: 'Duality' },
  '19-24-19-24': { name: 'Juxtaposition Cross of Sensitivity', type: 'Juxtaposition', quarter: 'Civilization' },
  '20-34-20-34': { name: 'Juxtaposition Cross of the Now', type: 'Juxtaposition', quarter: 'Mutation' },
  '21-48-21-48': { name: 'Juxtaposition Cross of Control', type: 'Juxtaposition', quarter: 'Civilization' },
  '22-47-22-47': { name: 'Juxtaposition Cross of Grace', type: 'Juxtaposition', quarter: 'Duality' },
  '23-43-23-43': { name: 'Juxtaposition Cross of Assimilation', type: 'Juxtaposition', quarter: 'Civilization' },
  '24-19-24-19': { name: 'Juxtaposition Cross of Rationalization', type: 'Juxtaposition', quarter: 'Civilization' },
  '25-46-25-46': { name: 'Juxtaposition Cross of Innocence', type: 'Juxtaposition', quarter: 'Mutation' },
  '26-45-26-45': { name: 'Juxtaposition Cross of the Egoist', type: 'Juxtaposition', quarter: 'Mutation' },
  '27-50-27-50': { name: 'Juxtaposition Cross of Caring', type: 'Juxtaposition', quarter: 'Civilization' },
  '28-38-28-38': { name: 'Juxtaposition Cross of Risks', type: 'Juxtaposition', quarter: 'Duality' },
  '29-30-29-30': { name: 'Juxtaposition Cross of Commitment', type: 'Juxtaposition', quarter: 'Initiation' },
  '30-29-30-29': { name: 'Juxtaposition Cross of Feelings', type: 'Juxtaposition', quarter: 'Initiation' },
  '31-33-31-33': { name: 'Juxtaposition Cross of Influence', type: 'Juxtaposition', quarter: 'Duality' },
  '32-42-32-42': { name: 'Juxtaposition Cross of Continuity', type: 'Juxtaposition', quarter: 'Civilization' },
  '33-31-33-31': { name: 'Juxtaposition Cross of Privacy', type: 'Juxtaposition', quarter: 'Duality' },
  '34-20-34-20': { name: 'Juxtaposition Cross of Charisma', type: 'Juxtaposition', quarter: 'Mutation' },
  '35-45-35-45': { name: 'Juxtaposition Cross of Desire', type: 'Juxtaposition', quarter: 'Mutation' },
  '36-25-36-25': { name: 'Juxtaposition Cross of Crisis', type: 'Juxtaposition', quarter: 'Initiation' },
  '37-40-37-40': { name: 'Juxtaposition Cross of Bargains', type: 'Juxtaposition', quarter: 'Initiation' },
  '38-28-38-28': { name: 'Juxtaposition Cross of the Fighter', type: 'Juxtaposition', quarter: 'Duality' },
  '39-53-39-53': { name: 'Juxtaposition Cross of Provocation', type: 'Juxtaposition', quarter: 'Duality' },
  '40-37-40-37': { name: 'Juxtaposition Cross of Denial', type: 'Juxtaposition', quarter: 'Initiation' },
  '41-30-41-30': { name: 'Juxtaposition Cross of Fantasies', type: 'Juxtaposition', quarter: 'Initiation' },
  '42-32-42-32': { name: 'Juxtaposition Cross of Completion', type: 'Juxtaposition', quarter: 'Civilization' },
  '43-23-43-23': { name: 'Juxtaposition Cross of Assimilation', type: 'Juxtaposition', quarter: 'Civilization' },
  '44-1-44-1': { name: 'Juxtaposition Cross of Alertness', type: 'Juxtaposition', quarter: 'Mutation' },
  '45-26-45-26': { name: 'Juxtaposition Cross of Gathering', type: 'Juxtaposition', quarter: 'Mutation' },
  '46-25-46-25': { name: 'Juxtaposition Cross of Determination', type: 'Juxtaposition', quarter: 'Mutation' },
  '48-21-48-21': { name: 'Juxtaposition Cross of Depth', type: 'Juxtaposition', quarter: 'Civilization' },
  '49-4-49-4': { name: 'Juxtaposition Cross of Principles', type: 'Juxtaposition', quarter: 'Initiation' },
  '50-27-50-27': { name: 'Juxtaposition Cross of Values', type: 'Juxtaposition', quarter: 'Civilization' },
  '51-57-51-57': { name: 'Juxtaposition Cross of Shock', type: 'Juxtaposition', quarter: 'Initiation' },
  '52-58-52-58': { name: 'Juxtaposition Cross of Stillness', type: 'Juxtaposition', quarter: 'Duality' },
  '53-39-53-39': { name: 'Juxtaposition Cross of Beginnings', type: 'Juxtaposition', quarter: 'Duality' },
  '54-53-54-53': { name: 'Juxtaposition Cross of Ambition', type: 'Juxtaposition', quarter: 'Initiation' },
  '55-59-55-59': { name: 'Juxtaposition Cross of Spirit', type: 'Juxtaposition', quarter: 'Initiation' },
  '56-62-56-62': { name: 'Juxtaposition Cross of Stimulation', type: 'Juxtaposition', quarter: 'Duality' },
  '57-51-57-51': { name: 'Juxtaposition Cross of Intuition', type: 'Juxtaposition', quarter: 'Initiation' },
  '58-52-58-52': { name: 'Juxtaposition Cross of Vitality', type: 'Juxtaposition', quarter: 'Duality' },
  '59-55-59-55': { name: 'Juxtaposition Cross of Intimacy', type: 'Juxtaposition', quarter: 'Initiation' },
  '60-3-60-3': { name: 'Juxtaposition Cross of Limitation', type: 'Juxtaposition', quarter: 'Civilization' },
  '61-60-61-60': { name: 'Juxtaposition Cross of Mystery', type: 'Juxtaposition', quarter: 'Initiation' },
  '62-56-62-56': { name: 'Juxtaposition Cross of Details', type: 'Juxtaposition', quarter: 'Duality' },
  '63-64-63-64': { name: 'Juxtaposition Cross of Doubts', type: 'Juxtaposition', quarter: 'Initiation' },
  '64-63-64-63': { name: 'Juxtaposition Cross of Confusion', type: 'Juxtaposition', quarter: 'Initiation' },
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

/**
 * Get all crosses as an array
 */
export function getAllCrosses(): Array<CrossReference & { gates: number[] }> {
  return Object.entries(CROSSES).map(([key, cross]) => ({
    ...cross,
    gates: key.split('-').map(Number),
  }));
}

/**
 * Get unique cross names (without variations)
 */
export function getUniqueCrossNames(): string[] {
  const names = new Set<string>();
  Object.values(CROSSES).forEach(cross => {
    // Remove variation numbers from the name
    const baseName = cross.name.replace(/ \d+$/, '');
    names.add(baseName);
  });
  return Array.from(names).sort();
}
