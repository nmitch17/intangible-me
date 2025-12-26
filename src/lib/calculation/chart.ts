/**
 * Human Design Chart Calculator
 * 
 * Derives all chart elements from planetary activations.
 */

import { calculateActivations } from './ephemeris';
import { getGateCenter, GATE_CENTERS } from './mandala';
import { CHANNELS } from '../reference/channels';
import { CROSSES } from '../reference/crosses';
import type {
  ChartData,
  ChartResponse,
  Activations,
  Center,
  Channel,
  Cross,
  CenterName,
  HumanDesignType,
  Strategy,
  Authority,
  Definition,
  CrossType,
  Quarter,
  Circuit,
  GateInfo,
  Circuitry,
} from '@/types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Collect all activated gates from both personality and design
 */
function collectGates(personality: Activations, design: Activations): Set<number> {
  const gates = new Set<number>();
  
  for (const activation of Object.values(personality)) {
    gates.add(activation.gate);
  }
  for (const activation of Object.values(design)) {
    gates.add(activation.gate);
  }
  
  return gates;
}

/**
 * Find all complete channels from activated gates
 */
function findChannels(activatedGates: Set<number>): Channel[] {
  const channels: Channel[] = [];
  
  for (const channel of CHANNELS) {
    if (activatedGates.has(channel.gates[0]) && activatedGates.has(channel.gates[1])) {
      channels.push(channel);
    }
  }
  
  return channels;
}

/**
 * Determine which centers are defined
 */
function calculateCenters(activatedGates: Set<number>, channels: Channel[]): Record<CenterName, Center> {
  const centers: Record<CenterName, Center> = {
    head: { defined: false, gates: [] },
    ajna: { defined: false, gates: [] },
    throat: { defined: false, gates: [] },
    g: { defined: false, gates: [] },
    ego: { defined: false, gates: [] },
    sacral: { defined: false, gates: [] },
    solar_plexus: { defined: false, gates: [] },
    spleen: { defined: false, gates: [] },
    root: { defined: false, gates: [] },
  };
  
  // Assign gates to centers
  for (const gate of activatedGates) {
    const center = getGateCenter(gate) as CenterName;
    if (center && centers[center]) {
      centers[center].gates.push(gate);
    }
  }
  
  // Mark centers as defined if they have a complete channel
  const definedCenters = new Set<string>();
  for (const channel of channels) {
    const centerA = getGateCenter(channel.gates[0]);
    const centerB = getGateCenter(channel.gates[1]);
    definedCenters.add(centerA);
    definedCenters.add(centerB);
  }
  
  for (const center of definedCenters) {
    if (centers[center as CenterName]) {
      centers[center as CenterName].defined = true;
    }
  }
  
  return centers;
}

/**
 * Derive Human Design Type from centers and channels
 */
function deriveType(centers: Record<CenterName, Center>, channels: Channel[]): HumanDesignType {
  const definedCenters = Object.entries(centers)
    .filter(([_, c]) => c.defined)
    .map(([name]) => name);
  
  // No defined centers = Reflector
  if (definedCenters.length === 0) {
    return 'Reflector';
  }
  
  // Check for Sacral definition
  const sacralDefined = centers.sacral.defined;
  
  if (sacralDefined) {
    // Check if there's a motor connected to throat
    const motorToThroat = channels.some(ch => {
      const centerA = getGateCenter(ch.gates[0]);
      const centerB = getGateCenter(ch.gates[1]);
      const hasThroat = centerA === 'throat' || centerB === 'throat';
      const hasMotor = ['sacral', 'solar_plexus', 'ego', 'root'].some(
        m => centerA === m || centerB === m
      );
      return hasThroat && hasMotor;
    });
    
    return motorToThroat ? 'Manifesting Generator' : 'Generator';
  }
  
  // Check for Manifestor (motor to throat, no sacral)
  const motorsToThroat = hasMotorToThroatConnection(centers, channels);
  if (motorsToThroat) {
    return 'Manifestor';
  }
  
  // Otherwise Projector
  return 'Projector';
}

/**
 * Check if there's a motor center connected to the throat
 */
function hasMotorToThroatConnection(
  centers: Record<CenterName, Center>,
  channels: Channel[]
): boolean {
  if (!centers.throat.defined) return false;
  
  const motors: CenterName[] = ['solar_plexus', 'ego', 'root'];
  
  // Build adjacency graph of defined centers
  const graph = new Map<string, Set<string>>();
  
  for (const channel of channels) {
    const centerA = getGateCenter(channel.gates[0]);
    const centerB = getGateCenter(channel.gates[1]);
    
    if (!graph.has(centerA)) graph.set(centerA, new Set());
    if (!graph.has(centerB)) graph.set(centerB, new Set());
    
    graph.get(centerA)!.add(centerB);
    graph.get(centerB)!.add(centerA);
  }
  
  // BFS from each motor to throat
  for (const motor of motors) {
    if (!centers[motor].defined) continue;
    
    const visited = new Set<string>();
    const queue = [motor as string];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === 'throat') return true;
      if (visited.has(current)) continue;
      visited.add(current);
      
      const neighbors = graph.get(current);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }
  }
  
  return false;
}

/**
 * Derive Strategy from Type
 */
function deriveStrategy(type: HumanDesignType): Strategy {
  switch (type) {
    case 'Manifestor': return 'Inform';
    case 'Generator': return 'Wait to Respond';
    case 'Manifesting Generator': return 'Wait to Respond';
    case 'Projector': return 'Wait for Invitation';
    case 'Reflector': return 'Wait Lunar Cycle';
  }
}

/**
 * Derive Signature from Type
 */
function deriveSignature(type: HumanDesignType): string {
  switch (type) {
    case 'Manifestor': return 'Peace';
    case 'Generator': return 'Satisfaction';
    case 'Manifesting Generator': return 'Satisfaction';
    case 'Projector': return 'Success';
    case 'Reflector': return 'Surprise';
  }
}

/**
 * Derive Not-Self Theme from Type
 */
function deriveNotSelf(type: HumanDesignType): string {
  switch (type) {
    case 'Manifestor': return 'Anger';
    case 'Generator': return 'Frustration';
    case 'Manifesting Generator': return 'Frustration';
    case 'Projector': return 'Bitterness';
    case 'Reflector': return 'Disappointment';
  }
}

/**
 * Derive Authority from defined centers
 */
function deriveAuthority(centers: Record<CenterName, Center>, type: HumanDesignType): Authority {
  // Reflectors always have Lunar authority
  if (type === 'Reflector') return 'Lunar';
  
  // Authority hierarchy
  if (centers.solar_plexus.defined) return 'Emotional';
  if (centers.sacral.defined) return 'Sacral';
  if (centers.spleen.defined) return 'Splenic';
  if (centers.ego.defined && centers.throat.defined) return 'Ego';
  if (centers.g.defined && centers.throat.defined) return 'Self-Projected';
  
  return 'Mental';
}

/**
 * Calculate Profile from Sun lines
 */
function calculateProfile(personality: Activations, design: Activations): string {
  return `${personality.sun.line}/${design.sun.line}`;
}

/**
 * Derive Cross Type from Profile
 */
function deriveCrossType(profile: string): CrossType {
  const rightAngle = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6'];
  const juxtaposition = ['4/1'];
  
  if (rightAngle.includes(profile)) return 'Right Angle';
  if (juxtaposition.includes(profile)) return 'Juxtaposition';
  return 'Left Angle';
}

/**
 * Calculate Definition Type (connectivity of centers)
 */
function calculateDefinition(centers: Record<CenterName, Center>, channels: Channel[]): Definition {
  const definedCenters = Object.entries(centers)
    .filter(([_, c]) => c.defined)
    .map(([name]) => name);
  
  if (definedCenters.length === 0) return 'None';
  
  // Build graph and find connected components
  const graph = new Map<string, Set<string>>();
  
  for (const channel of channels) {
    const centerA = getGateCenter(channel.gates[0]);
    const centerB = getGateCenter(channel.gates[1]);
    
    if (!graph.has(centerA)) graph.set(centerA, new Set());
    if (!graph.has(centerB)) graph.set(centerB, new Set());
    
    graph.get(centerA)!.add(centerB);
    graph.get(centerB)!.add(centerA);
  }
  
  // Count connected components using DFS
  const visited = new Set<string>();
  let components = 0;
  
  for (const center of definedCenters) {
    if (visited.has(center)) continue;
    
    components++;
    const stack = [center];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      
      const neighbors = graph.get(current);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && definedCenters.includes(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
  }
  
  switch (components) {
    case 1: return 'Single';
    case 2: return 'Split';
    case 3: return 'Triple Split';
    default: return 'Quadruple Split';
  }
}

/**
 * Look up Incarnation Cross
 */
function lookupCross(personality: Activations, design: Activations, profile: string): Cross {
  const gates: [number, number, number, number] = [
    personality.sun.gate,
    personality.earth.gate,
    design.sun.gate,
    design.earth.gate,
  ];
  
  const crossType = deriveCrossType(profile);
  
  // Look up in cross reference data
  const crossKey = gates.join('-');
  const crossData = CROSSES[crossKey];
  
  if (crossData) {
    return {
      name: crossData.name,
      type: crossType,
      quarter: crossData.quarter as Quarter,
      gates,
    };
  }
  
  // Fallback if not found in reference
  return {
    name: `${crossType} Cross of Gates ${gates.join('/')}`,
    type: crossType,
    quarter: determineQuarter(personality.sun.gate),
    gates,
  };
}

/**
 * Determine Quarter from Personality Sun gate
 */
function determineQuarter(sunGate: number): Quarter {
  // Quarters are determined by gate position in the Mandala
  // This is a simplified mapping - should be expanded with full data
  const initiationGates = [13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24];
  const civilizationGates = [2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33];
  const dualityGates = [7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44];
  const mutationGates = [1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19];
  
  if (initiationGates.includes(sunGate)) return 'Initiation';
  if (civilizationGates.includes(sunGate)) return 'Civilization';
  if (dualityGates.includes(sunGate)) return 'Duality';
  return 'Mutation';
}

/**
 * Calculate circuitry breakdown
 */
function calculateCircuitry(channels: Channel[]): Circuitry {
  const counts = { individual: 0, tribal: 0, collective: 0 };
  
  for (const channel of channels) {
    const circuit = channel.circuit.toLowerCase() as keyof Circuitry;
    if (counts[circuit] !== undefined) {
      counts[circuit]++;
    }
  }
  
  return counts;
}

/**
 * Build gates info object
 */
function buildGatesInfo(activatedGates: Set<number>): Record<string, GateInfo> {
  const gates: Record<string, GateInfo> = {};
  
  for (const gate of activatedGates) {
    gates[gate.toString()] = {
      name: getGateName(gate),
      center: getGateCenter(gate) as CenterName,
    };
  }
  
  return gates;
}

/**
 * Get gate name (simplified - should use reference data)
 */
function getGateName(gate: number): string {
  // This should be replaced with lookup from reference data
  const gateNames: Record<number, string> = {
    1: 'Self-Expression', 2: 'Direction', 3: 'Ordering', 4: 'Formulization',
    5: 'Waiting', 6: 'Friction', 7: 'Self in Interaction', 8: 'Contribution',
    9: 'Focus', 10: 'Self-Love', 11: 'Ideas', 12: 'Caution',
    13: 'Listening', 14: 'Power Skills', 15: 'Extremes', 16: 'Skills',
    17: 'Opinions', 18: 'Correction', 19: 'Wanting', 20: 'Now',
    21: 'Hunter', 22: 'Openness', 23: 'Assimilation', 24: 'Rationalization',
    25: 'Spirit of Self', 26: 'Egoist', 27: 'Caring', 28: 'Game Player',
    29: 'Perseverance', 30: 'Feelings', 31: 'Leading', 32: 'Continuity',
    33: 'Privacy', 34: 'Power', 35: 'Change', 36: 'Crisis',
    37: 'Friendship', 38: 'Fighter', 39: 'Provocation', 40: 'Aloneness',
    41: 'Contraction', 42: 'Growth', 43: 'Insight', 44: 'Alertness',
    45: 'Gatherer', 46: 'Love of Body', 47: 'Realizing', 48: 'Depth',
    49: 'Principles', 50: 'Values', 51: 'Shock', 52: 'Stillness',
    53: 'Starting', 54: 'Ambition', 55: 'Abundance', 56: 'Stimulation',
    57: 'Intuitive Clarity', 58: 'Joy', 59: 'Sexuality', 60: 'Limitation',
    61: 'Mystery', 62: 'Details', 63: 'Doubt', 64: 'Confusion',
  };
  
  return gateNames[gate] || `Gate ${gate}`;
}

// ============================================================================
// MAIN CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate complete Human Design chart from birth data
 */
export async function calculateChart(birthDateUtc: Date): Promise<ChartData> {
  // Calculate planetary activations
  const { personality, design } = await calculateActivations(birthDateUtc);
  
  // Collect all activated gates
  const activatedGates = collectGates(personality, design);
  
  // Find complete channels
  const channels = findChannels(activatedGates);
  
  // Calculate centers
  const centers = calculateCenters(activatedGates, channels);
  
  // Derive type
  const type = deriveType(centers, channels);
  
  // Derive other elements
  const strategy = deriveStrategy(type);
  const signature = deriveSignature(type);
  const notSelf = deriveNotSelf(type);
  const authority = deriveAuthority(centers, type);
  const profile = calculateProfile(personality, design);
  const definition = calculateDefinition(centers, channels);
  const cross = lookupCross(personality, design, profile);
  const circuitry = calculateCircuitry(channels);
  const gates = buildGatesInfo(activatedGates);
  
  return {
    type,
    strategy,
    signature,
    not_self: notSelf,
    authority,
    profile,
    definition,
    cross,
    centers,
    channels,
    activations: { personality, design },
    gates,
    circuitry,
  };
}

/**
 * Full chart response with birth data
 */
export async function generateChartResponse(
  datetimeUtc: string,
  lat: number,
  lng: number,
  timezone?: string
): Promise<ChartResponse> {
  const birthDate = new Date(datetimeUtc);
  const chart = await calculateChart(birthDate);
  
  return {
    birth: {
      datetime_utc: datetimeUtc,
      timezone: timezone || 'UTC',
      lat,
      lng,
    },
    chart,
  };
}
