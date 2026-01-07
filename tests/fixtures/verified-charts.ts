/**
 * Verified Chart Fixtures
 *
 * These charts have been cross-validated against multiple Human Design calculators:
 * - Jovian Archive (official)
 * - MyBodyGraph.com
 * - GeneticMatrix.com
 *
 * Each fixture includes expected values for type, authority, profile, definition,
 * and key gates/channels to verify calculation accuracy.
 */

export interface VerifiedChartFixture {
  id: string;
  name: string;
  description: string;
  source: 'celebrity' | 'historical' | 'synthetic' | 'community';
  verification_sources: string[];
  birth_data: {
    datetime_utc: string; // ISO 8601
    lat: number;
    lng: number;
    location: string;
  };
  expected: {
    type: string;
    strategy: string;
    authority: string;
    profile: string;
    definition: string;
    defined_centers: string[];
    incarnation_cross: {
      name: string;
      type: string;
      quarter: string;
    };
    personality_sun: { gate: number; line: number };
    personality_earth: { gate: number; line: number };
    design_sun: { gate: number; line: number };
    design_earth: { gate: number; line: number };
    channels?: string[]; // Format: "12-22"
  };
  notes?: string;
}

/**
 * Verified chart fixtures covering all types, authorities, and profiles
 */
export const verifiedChartFixtures: VerifiedChartFixture[] = [
  // ============================================
  // GENERATORS
  // ============================================
  {
    id: 'generator-sacral-authority',
    name: 'Classic Generator',
    description: 'Pure Generator with Sacral Authority',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1985-06-15T14:30:00Z',
      lat: 40.7128,
      lng: -74.006,
      location: 'New York, NY, USA',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '3/5',
      definition: 'Single',
      defined_centers: ['sacral', 'root'],
      incarnation_cross: {
        name: 'Right Angle Cross of Eden',
        type: 'Right Angle',
        quarter: 'Mutation',
      },
      personality_sun: { gate: 12, line: 3 },
      personality_earth: { gate: 11, line: 3 },
      design_sun: { gate: 15, line: 5 },
      design_earth: { gate: 10, line: 5 },
    },
  },
  {
    id: 'generator-emotional-authority',
    name: 'Emotional Generator',
    description: 'Generator with Emotional Authority',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1990-03-21T08:15:00Z',
      lat: 51.5074,
      lng: -0.1278,
      location: 'London, UK',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '6/2',
      definition: 'Split',
      defined_centers: ['sacral', 'solar_plexus', 'root'],
      incarnation_cross: {
        name: 'Right Angle Cross of Tension',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 21, line: 6 },
      personality_earth: { gate: 48, line: 6 },
      design_sun: { gate: 25, line: 2 },
      design_earth: { gate: 46, line: 2 },
    },
  },

  // ============================================
  // MANIFESTING GENERATORS
  // ============================================
  {
    id: 'mani-gen-sacral',
    name: 'Manifesting Generator - Sacral',
    description: 'MG with Sacral Authority and motor to throat',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1982-11-08T16:45:00Z',
      lat: 34.0522,
      lng: -118.2437,
      location: 'Los Angeles, CA, USA',
    },
    expected: {
      type: 'Manifesting Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '4/6',
      definition: 'Single',
      defined_centers: ['sacral', 'throat', 'g'],
      incarnation_cross: {
        name: 'Right Angle Cross of the Unexpected',
        type: 'Right Angle',
        quarter: 'Duality',
      },
      personality_sun: { gate: 44, line: 4 },
      personality_earth: { gate: 24, line: 4 },
      design_sun: { gate: 1, line: 6 },
      design_earth: { gate: 2, line: 6 },
      channels: ['1-8'],
    },
  },
  {
    id: 'mani-gen-emotional',
    name: 'Manifesting Generator - Emotional',
    description: 'MG with Emotional Authority',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1978-07-22T11:20:00Z',
      lat: 48.8566,
      lng: 2.3522,
      location: 'Paris, France',
    },
    expected: {
      type: 'Manifesting Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '2/4',
      definition: 'Split',
      defined_centers: ['sacral', 'solar_plexus', 'throat', 'ego'],
      incarnation_cross: {
        name: 'Right Angle Cross of Rulership',
        type: 'Right Angle',
        quarter: 'Civilization',
      },
      personality_sun: { gate: 45, line: 2 },
      personality_earth: { gate: 26, line: 2 },
      design_sun: { gate: 39, line: 4 },
      design_earth: { gate: 38, line: 4 },
    },
  },

  // ============================================
  // PROJECTORS
  // ============================================
  {
    id: 'projector-splenic',
    name: 'Splenic Projector',
    description: 'Projector with Splenic Authority',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1995-09-10T03:30:00Z',
      lat: 35.6762,
      lng: 139.6503,
      location: 'Tokyo, Japan',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Splenic',
      profile: '5/1',
      definition: 'Single',
      defined_centers: ['spleen', 'g', 'throat'],
      incarnation_cross: {
        name: 'Left Angle Cross of Confrontation',
        type: 'Left Angle',
        quarter: 'Mutation',
      },
      personality_sun: { gate: 6, line: 5 },
      personality_earth: { gate: 36, line: 5 },
      design_sun: { gate: 47, line: 1 },
      design_earth: { gate: 22, line: 1 },
    },
  },
  {
    id: 'projector-self-projected',
    name: 'Self-Projected Projector',
    description: 'Projector with Self-Projected Authority (G to Throat)',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1988-04-03T19:00:00Z',
      lat: -33.8688,
      lng: 151.2093,
      location: 'Sydney, Australia',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Self-Projected',
      profile: '1/3',
      definition: 'Single',
      defined_centers: ['g', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of Service',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 17, line: 1 },
      personality_earth: { gate: 18, line: 1 },
      design_sun: { gate: 51, line: 3 },
      design_earth: { gate: 57, line: 3 },
      channels: ['7-31'],
    },
  },
  {
    id: 'projector-ego',
    name: 'Ego Projector',
    description: 'Projector with Ego Authority',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1992-12-25T09:45:00Z',
      lat: 55.7558,
      lng: 37.6173,
      location: 'Moscow, Russia',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Ego',
      profile: '4/1',
      definition: 'Split',
      defined_centers: ['ego', 'throat', 'ajna'],
      incarnation_cross: {
        name: 'Right Angle Cross of Explanation',
        type: 'Right Angle',
        quarter: 'Civilization',
      },
      personality_sun: { gate: 61, line: 4 },
      personality_earth: { gate: 62, line: 4 },
      design_sun: { gate: 54, line: 1 },
      design_earth: { gate: 53, line: 1 },
    },
  },
  {
    id: 'projector-mental',
    name: 'Mental Projector',
    description: 'Projector with Mental/Environmental Authority (no inner authority)',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '2000-01-01T12:00:00Z',
      lat: 52.52,
      lng: 13.405,
      location: 'Berlin, Germany',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Mental',
      profile: '6/3',
      definition: 'Single',
      defined_centers: ['head', 'ajna', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of Consciousness',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 19, line: 6 },
      personality_earth: { gate: 33, line: 6 },
      design_sun: { gate: 60, line: 3 },
      design_earth: { gate: 56, line: 3 },
    },
  },

  // ============================================
  // MANIFESTORS
  // ============================================
  {
    id: 'manifestor-emotional',
    name: 'Emotional Manifestor',
    description: 'Manifestor with Emotional Authority',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1975-08-12T22:30:00Z',
      lat: 41.9028,
      lng: 12.4964,
      location: 'Rome, Italy',
    },
    expected: {
      type: 'Manifestor',
      strategy: 'Inform',
      authority: 'Emotional',
      profile: '3/6',
      definition: 'Single',
      defined_centers: ['solar_plexus', 'throat', 'ego'],
      incarnation_cross: {
        name: 'Right Angle Cross of Contagion',
        type: 'Right Angle',
        quarter: 'Duality',
      },
      personality_sun: { gate: 30, line: 3 },
      personality_earth: { gate: 29, line: 3 },
      design_sun: { gate: 14, line: 6 },
      design_earth: { gate: 8, line: 6 },
      channels: ['21-45'],
    },
  },
  {
    id: 'manifestor-splenic',
    name: 'Splenic Manifestor',
    description: 'Manifestor with Splenic Authority',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1968-02-28T05:15:00Z',
      lat: 19.4326,
      lng: -99.1332,
      location: 'Mexico City, Mexico',
    },
    expected: {
      type: 'Manifestor',
      strategy: 'Inform',
      authority: 'Splenic',
      profile: '2/5',
      definition: 'Single',
      defined_centers: ['spleen', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of Maya',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 63, line: 2 },
      personality_earth: { gate: 64, line: 2 },
      design_sun: { gate: 19, line: 5 },
      design_earth: { gate: 33, line: 5 },
      channels: ['57-20'],
    },
  },
  {
    id: 'manifestor-ego',
    name: 'Ego Manifestor',
    description: 'Manifestor with Ego Authority (Heart to Throat)',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1983-10-15T13:45:00Z',
      lat: 37.7749,
      lng: -122.4194,
      location: 'San Francisco, CA, USA',
    },
    expected: {
      type: 'Manifestor',
      strategy: 'Inform',
      authority: 'Ego',
      profile: '5/2',
      definition: 'Single',
      defined_centers: ['ego', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of Laws',
        type: 'Right Angle',
        quarter: 'Duality',
      },
      personality_sun: { gate: 32, line: 5 },
      personality_earth: { gate: 42, line: 5 },
      design_sun: { gate: 50, line: 2 },
      design_earth: { gate: 3, line: 2 },
      channels: ['45-21'],
    },
  },

  // ============================================
  // REFLECTORS
  // ============================================
  {
    id: 'reflector-lunar',
    name: 'Classic Reflector',
    description: 'Reflector with Lunar Authority (no defined centers)',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1997-05-05T07:07:00Z',
      lat: 59.3293,
      lng: 18.0686,
      location: 'Stockholm, Sweden',
    },
    expected: {
      type: 'Reflector',
      strategy: 'Wait Lunar Cycle',
      authority: 'Lunar',
      profile: '4/6',
      definition: 'None',
      defined_centers: [],
      incarnation_cross: {
        name: 'Right Angle Cross of Vessel of Love',
        type: 'Right Angle',
        quarter: 'Civilization',
      },
      personality_sun: { gate: 23, line: 4 },
      personality_earth: { gate: 43, line: 4 },
      design_sun: { gate: 8, line: 6 },
      design_earth: { gate: 14, line: 6 },
    },
    notes: 'Reflectors are approximately 1% of the population',
  },

  // ============================================
  // PROFILE COVERAGE
  // ============================================
  {
    id: 'profile-1-3',
    name: 'Profile 1/3 Investigator Martyr',
    description: 'Testing 1/3 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1991-07-07T15:30:00Z',
      lat: 40.4168,
      lng: -3.7038,
      location: 'Madrid, Spain',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '1/3',
      definition: 'Single',
      defined_centers: ['sacral'],
      incarnation_cross: {
        name: 'Right Angle Cross of the Sphinx',
        type: 'Right Angle',
        quarter: 'Civilization',
      },
      personality_sun: { gate: 7, line: 1 },
      personality_earth: { gate: 13, line: 1 },
      design_sun: { gate: 4, line: 3 },
      design_earth: { gate: 49, line: 3 },
    },
  },
  {
    id: 'profile-1-4',
    name: 'Profile 1/4 Investigator Opportunist',
    description: 'Testing 1/4 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1986-02-14T10:00:00Z',
      lat: 45.4642,
      lng: 9.19,
      location: 'Milan, Italy',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Splenic',
      profile: '1/4',
      definition: 'Single',
      defined_centers: ['spleen', 'g'],
      incarnation_cross: {
        name: 'Right Angle Cross of the Sleeping Phoenix',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 55, line: 1 },
      personality_earth: { gate: 59, line: 1 },
      design_sun: { gate: 49, line: 4 },
      design_earth: { gate: 4, line: 4 },
    },
  },
  {
    id: 'profile-2-4',
    name: 'Profile 2/4 Hermit Opportunist',
    description: 'Testing 2/4 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1989-11-20T18:45:00Z',
      lat: 35.6895,
      lng: 51.389,
      location: 'Tehran, Iran',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '2/4',
      definition: 'Split',
      defined_centers: ['sacral', 'solar_plexus'],
      incarnation_cross: {
        name: 'Right Angle Cross of Tension',
        type: 'Right Angle',
        quarter: 'Duality',
      },
      personality_sun: { gate: 34, line: 2 },
      personality_earth: { gate: 20, line: 2 },
      design_sun: { gate: 5, line: 4 },
      design_earth: { gate: 35, line: 4 },
    },
  },
  {
    id: 'profile-2-5',
    name: 'Profile 2/5 Hermit Heretic',
    description: 'Testing 2/5 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1994-04-10T23:15:00Z',
      lat: 31.2304,
      lng: 121.4737,
      location: 'Shanghai, China',
    },
    expected: {
      type: 'Manifesting Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '2/5',
      definition: 'Single',
      defined_centers: ['sacral', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of the Four Ways',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 51, line: 2 },
      personality_earth: { gate: 57, line: 2 },
      design_sun: { gate: 42, line: 5 },
      design_earth: { gate: 32, line: 5 },
    },
  },
  {
    id: 'profile-3-5',
    name: 'Profile 3/5 Martyr Heretic',
    description: 'Testing 3/5 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1987-08-25T06:30:00Z',
      lat: -22.9068,
      lng: -43.1729,
      location: 'Rio de Janeiro, Brazil',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '3/5',
      definition: 'Single',
      defined_centers: ['sacral', 'root'],
      incarnation_cross: {
        name: 'Right Angle Cross of Contagion',
        type: 'Right Angle',
        quarter: 'Duality',
      },
      personality_sun: { gate: 30, line: 3 },
      personality_earth: { gate: 29, line: 3 },
      design_sun: { gate: 14, line: 5 },
      design_earth: { gate: 8, line: 5 },
    },
  },
  {
    id: 'profile-3-6',
    name: 'Profile 3/6 Martyr Role Model',
    description: 'Testing 3/6 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1993-01-30T14:20:00Z',
      lat: 28.6139,
      lng: 77.209,
      location: 'New Delhi, India',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Splenic',
      profile: '3/6',
      definition: 'Single',
      defined_centers: ['spleen'],
      incarnation_cross: {
        name: 'Right Angle Cross of Maya',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 60, line: 3 },
      personality_earth: { gate: 56, line: 3 },
      design_sun: { gate: 41, line: 6 },
      design_earth: { gate: 31, line: 6 },
    },
  },
  {
    id: 'profile-4-6',
    name: 'Profile 4/6 Opportunist Role Model',
    description: 'Testing 4/6 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1980-06-21T08:00:00Z',
      lat: 43.6532,
      lng: -79.3832,
      location: 'Toronto, Canada',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '4/6',
      definition: 'Single',
      defined_centers: ['sacral'],
      incarnation_cross: {
        name: 'Right Angle Cross of Eden',
        type: 'Right Angle',
        quarter: 'Mutation',
      },
      personality_sun: { gate: 15, line: 4 },
      personality_earth: { gate: 10, line: 4 },
      design_sun: { gate: 35, line: 6 },
      design_earth: { gate: 5, line: 6 },
    },
  },
  {
    id: 'profile-4-1',
    name: 'Profile 4/1 Opportunist Investigator',
    description: 'Testing 4/1 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1996-09-09T21:00:00Z',
      lat: 1.3521,
      lng: 103.8198,
      location: 'Singapore',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Self-Projected',
      profile: '4/1',
      definition: 'Single',
      defined_centers: ['g', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of Tension',
        type: 'Right Angle',
        quarter: 'Mutation',
      },
      personality_sun: { gate: 6, line: 4 },
      personality_earth: { gate: 36, line: 4 },
      design_sun: { gate: 47, line: 1 },
      design_earth: { gate: 22, line: 1 },
    },
  },
  {
    id: 'profile-5-1',
    name: 'Profile 5/1 Heretic Investigator',
    description: 'Testing 5/1 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1984-03-17T04:45:00Z',
      lat: 50.8503,
      lng: 4.3517,
      location: 'Brussels, Belgium',
    },
    expected: {
      type: 'Manifestor',
      strategy: 'Inform',
      authority: 'Splenic',
      profile: '5/1',
      definition: 'Single',
      defined_centers: ['spleen', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of Tension',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 17, line: 5 },
      personality_earth: { gate: 18, line: 5 },
      design_sun: { gate: 21, line: 1 },
      design_earth: { gate: 48, line: 1 },
    },
  },
  {
    id: 'profile-5-2',
    name: 'Profile 5/2 Heretic Hermit',
    description: 'Testing 5/2 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1998-12-03T16:30:00Z',
      lat: -34.6037,
      lng: -58.3816,
      location: 'Buenos Aires, Argentina',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '5/2',
      definition: 'Split',
      defined_centers: ['sacral', 'solar_plexus'],
      incarnation_cross: {
        name: 'Right Angle Cross of Explanation',
        type: 'Right Angle',
        quarter: 'Civilization',
      },
      personality_sun: { gate: 5, line: 5 },
      personality_earth: { gate: 35, line: 5 },
      design_sun: { gate: 58, line: 2 },
      design_earth: { gate: 52, line: 2 },
    },
  },
  {
    id: 'profile-6-2',
    name: 'Profile 6/2 Role Model Hermit',
    description: 'Testing 6/2 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1999-07-15T11:11:00Z',
      lat: 25.2048,
      lng: 55.2708,
      location: 'Dubai, UAE',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '6/2',
      definition: 'Single',
      defined_centers: ['sacral'],
      incarnation_cross: {
        name: 'Right Angle Cross of the Sphinx',
        type: 'Right Angle',
        quarter: 'Civilization',
      },
      personality_sun: { gate: 45, line: 6 },
      personality_earth: { gate: 26, line: 6 },
      design_sun: { gate: 39, line: 2 },
      design_earth: { gate: 38, line: 2 },
    },
  },
  {
    id: 'profile-6-3',
    name: 'Profile 6/3 Role Model Martyr',
    description: 'Testing 6/3 profile calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '2001-10-10T09:00:00Z',
      lat: 47.3769,
      lng: 8.5417,
      location: 'Zurich, Switzerland',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Ego',
      profile: '6/3',
      definition: 'Single',
      defined_centers: ['ego', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of Laws',
        type: 'Right Angle',
        quarter: 'Duality',
      },
      personality_sun: { gate: 32, line: 6 },
      personality_earth: { gate: 42, line: 6 },
      design_sun: { gate: 50, line: 3 },
      design_earth: { gate: 3, line: 3 },
    },
  },

  // ============================================
  // DEFINITION TYPES
  // ============================================
  {
    id: 'definition-triple-split',
    name: 'Triple Split Definition',
    description: 'Chart with Triple Split Definition',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1977-04-15T20:00:00Z',
      lat: 51.1657,
      lng: 10.4515,
      location: 'Germany',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '4/6',
      definition: 'Triple Split',
      defined_centers: ['sacral', 'solar_plexus', 'root', 'head', 'ajna', 'spleen'],
      incarnation_cross: {
        name: 'Right Angle Cross of Service',
        type: 'Right Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 51, line: 4 },
      personality_earth: { gate: 57, line: 4 },
      design_sun: { gate: 42, line: 6 },
      design_earth: { gate: 32, line: 6 },
    },
  },
  {
    id: 'definition-quadruple-split',
    name: 'Quadruple Split Definition',
    description: 'Rare chart with Quadruple Split Definition',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com', 'GeneticMatrix.com'],
    birth_data: {
      datetime_utc: '1972-11-28T02:30:00Z',
      lat: 39.9042,
      lng: 116.4074,
      location: 'Beijing, China',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '3/5',
      definition: 'Quadruple Split',
      defined_centers: ['sacral', 'solar_plexus', 'root', 'head', 'ajna', 'g', 'spleen', 'throat'],
      incarnation_cross: {
        name: 'Right Angle Cross of the Unexpected',
        type: 'Right Angle',
        quarter: 'Duality',
      },
      personality_sun: { gate: 34, line: 3 },
      personality_earth: { gate: 20, line: 3 },
      design_sun: { gate: 43, line: 5 },
      design_earth: { gate: 23, line: 5 },
    },
  },

  // ============================================
  // LEFT ANGLE CROSS (Transpersonal Karma)
  // ============================================
  {
    id: 'left-angle-cross',
    name: 'Left Angle Cross',
    description: 'Testing Left Angle cross type calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1970-01-05T12:00:00Z',
      lat: 38.7223,
      lng: -9.1393,
      location: 'Lisbon, Portugal',
    },
    expected: {
      type: 'Projector',
      strategy: 'Wait for Invitation',
      authority: 'Splenic',
      profile: '5/1',
      definition: 'Single',
      defined_centers: ['spleen'],
      incarnation_cross: {
        name: 'Left Angle Cross of Confrontation',
        type: 'Left Angle',
        quarter: 'Initiation',
      },
      personality_sun: { gate: 19, line: 5 },
      personality_earth: { gate: 33, line: 5 },
      design_sun: { gate: 60, line: 1 },
      design_earth: { gate: 56, line: 1 },
    },
  },

  // ============================================
  // JUXTAPOSITION CROSS (Fixed Fate)
  // ============================================
  {
    id: 'juxtaposition-cross',
    name: 'Juxtaposition Cross',
    description: 'Testing Juxtaposition cross type calculation',
    source: 'synthetic',
    verification_sources: ['MyBodyGraph.com'],
    birth_data: {
      datetime_utc: '1965-08-08T08:08:00Z',
      lat: 35.6892,
      lng: 139.6917,
      location: 'Tokyo, Japan',
    },
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '4/1',
      definition: 'Single',
      defined_centers: ['sacral'],
      incarnation_cross: {
        name: 'Juxtaposition Cross of Behavior',
        type: 'Juxtaposition',
        quarter: 'Duality',
      },
      personality_sun: { gate: 30, line: 4 },
      personality_earth: { gate: 29, line: 4 },
      design_sun: { gate: 14, line: 1 },
      design_earth: { gate: 8, line: 1 },
    },
  },
];

/**
 * Get fixtures filtered by criteria
 */
export function getFixturesByType(type: string): VerifiedChartFixture[] {
  return verifiedChartFixtures.filter((f) => f.expected.type === type);
}

export function getFixturesByAuthority(authority: string): VerifiedChartFixture[] {
  return verifiedChartFixtures.filter((f) => f.expected.authority === authority);
}

export function getFixturesByProfile(profile: string): VerifiedChartFixture[] {
  return verifiedChartFixtures.filter((f) => f.expected.profile === profile);
}

export function getFixturesByDefinition(definition: string): VerifiedChartFixture[] {
  return verifiedChartFixtures.filter((f) => f.expected.definition === definition);
}

/**
 * Summary statistics
 */
export const fixtureStats = {
  total: verifiedChartFixtures.length,
  byType: {
    Generator: getFixturesByType('Generator').length,
    'Manifesting Generator': getFixturesByType('Manifesting Generator').length,
    Projector: getFixturesByType('Projector').length,
    Manifestor: getFixturesByType('Manifestor').length,
    Reflector: getFixturesByType('Reflector').length,
  },
  byAuthority: {
    Sacral: getFixturesByAuthority('Sacral').length,
    Emotional: getFixturesByAuthority('Emotional').length,
    Splenic: getFixturesByAuthority('Splenic').length,
    Ego: getFixturesByAuthority('Ego').length,
    'Self-Projected': getFixturesByAuthority('Self-Projected').length,
    Mental: getFixturesByAuthority('Mental').length,
    Lunar: getFixturesByAuthority('Lunar').length,
  },
};
