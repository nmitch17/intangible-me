// ============================================================================
// CORE CHART TYPES
// ============================================================================

export type HumanDesignType = 
  | 'Manifestor' 
  | 'Generator' 
  | 'Manifesting Generator' 
  | 'Projector' 
  | 'Reflector';

export type Strategy = 
  | 'Inform' 
  | 'Wait to Respond' 
  | 'Wait for Invitation' 
  | 'Wait Lunar Cycle';

export type Authority = 
  | 'Emotional' 
  | 'Sacral' 
  | 'Splenic' 
  | 'Ego' 
  | 'Self-Projected' 
  | 'Mental' 
  | 'Lunar';

export type Definition = 
  | 'None' 
  | 'Single' 
  | 'Split' 
  | 'Triple Split' 
  | 'Quadruple Split';

export type CrossType = 
  | 'Right Angle' 
  | 'Juxtaposition' 
  | 'Left Angle';

export type Quarter = 
  | 'Initiation' 
  | 'Civilization' 
  | 'Duality' 
  | 'Mutation';

export type Circuit = 
  | 'Individual' 
  | 'Tribal' 
  | 'Collective';

export type CenterName = 
  | 'head' 
  | 'ajna' 
  | 'throat' 
  | 'g' 
  | 'ego' 
  | 'sacral' 
  | 'solar_plexus' 
  | 'spleen' 
  | 'root';

export type Planet = 
  | 'sun' 
  | 'earth' 
  | 'north_node' 
  | 'south_node' 
  | 'moon' 
  | 'mercury' 
  | 'venus' 
  | 'mars' 
  | 'jupiter' 
  | 'saturn' 
  | 'uranus' 
  | 'neptune' 
  | 'pluto';

// ============================================================================
// DATA STRUCTURES
// ============================================================================

export interface Activation {
  gate: number;
  line: number;
}

export interface Activations {
  sun: Activation;
  earth: Activation;
  north_node: Activation;
  south_node: Activation;
  moon: Activation;
  mercury: Activation;
  venus: Activation;
  mars: Activation;
  jupiter: Activation;
  saturn: Activation;
  uranus: Activation;
  neptune: Activation;
  pluto: Activation;
}

export interface Center {
  defined: boolean;
  gates: number[];
}

export interface Channel {
  gates: [number, number];
  name: string;
  circuit: Circuit;
  stream: string;
}

export interface Cross {
  name: string;
  type: CrossType;
  quarter: Quarter;
  gates: [number, number, number, number];
}

export interface GateInfo {
  name: string;
  center: CenterName;
}

export interface Circuitry {
  individual: number;
  tribal: number;
  collective: number;
}

// ============================================================================
// CHART OBJECT
// ============================================================================

export interface ChartData {
  type: HumanDesignType;
  strategy: Strategy;
  signature: string;
  not_self: string;
  authority: Authority;
  profile: string;
  definition: Definition;
  cross: Cross;
  centers: Record<CenterName, Center>;
  channels: Channel[];
  activations: {
    personality: Activations;
    design: Activations;
  };
  gates: Record<string, GateInfo>;
  circuitry: Circuitry;
}

export interface BirthData {
  datetime_utc: string;
  timezone: string;
  lat: number;
  lng: number;
}

export interface ChartResponse {
  birth: BirthData;
  chart: ChartData;
  reference?: ReferenceData;
}

// ============================================================================
// REFERENCE DATA
// ============================================================================

export interface GateReference {
  id: number;
  name: string;
  center: CenterName;
  keynotes?: string;
  description?: string;
  shadow?: string;
  gift?: string;
  siddhi?: string;
}

export interface ChannelReference {
  id: string;
  gates: [number, number];
  name: string;
  circuit: Circuit;
  stream: string;
  description?: string;
}

export interface TypeReference {
  id: HumanDesignType;
  strategy: Strategy;
  signature: string;
  not_self: string;
  description?: string;
}

export interface AuthorityReference {
  id: Authority;
  name: string;
  center?: CenterName;
  description?: string;
}

export interface ProfileReference {
  id: string;
  conscious_line: number;
  unconscious_line: number;
  name?: string;
  description?: string;
}

export interface ReferenceData {
  type?: TypeReference;
  authority?: AuthorityReference;
  profile?: ProfileReference;
  channels?: Record<string, ChannelReference>;
  gates?: Record<string, GateReference>;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CalculateChartRequest {
  datetime_utc: string;
  lat: number;
  lng: number;
}

export interface CalculateTransitRequest {
  datetime_utc?: string; // Defaults to now
  lat?: number;
  lng?: number;
}

export interface CalculateCompositeRequest {
  chart_a: CalculateChartRequest;
  chart_b: CalculateChartRequest;
}

export interface CompositeResponse {
  chart_a: ChartData;
  chart_b: ChartData;
  analysis: {
    electromagnetic: Channel[];
    compromise_gates: number[];
    shared_channels: Channel[];
    combined_definition: Definition;
  };
}
