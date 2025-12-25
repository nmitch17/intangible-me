/**
 * Rave Mandala Gate Mapping
 * 
 * Maps ecliptic longitude to Human Design gates.
 * Each gate spans 5°37'30" (5.625°).
 * Each line spans 0°56'15" (0.9375°).
 * 
 * Gate 41 starts at 2°00' Aquarius (302° ecliptic longitude).
 * The Rave New Year begins when the Sun enters Gate 41.
 * 
 * Source: Verified against official Human Design gate/zodiac mappings.
 */

export interface GatePosition {
  gate: number;
  startDegree: number;  // Ecliptic longitude (0° = 0° Aries)
  endDegree: number;
  center: string;
}

/**
 * Complete gate mapping with precise degree positions.
 * Format: [gate, startDegree] where startDegree is ecliptic longitude.
 * 
 * Zodiac reference:
 * Aries: 0°-30°, Taurus: 30°-60°, Gemini: 60°-90°, Cancer: 90°-120°
 * Leo: 120°-150°, Virgo: 150°-180°, Libra: 180°-210°, Scorpio: 210°-240°
 * Sagittarius: 240°-270°, Capricorn: 270°-300°, Aquarius: 300°-330°, Pisces: 330°-360°
 */
export const GATE_POSITIONS: Array<{ gate: number; start: number; end: number }> = [
  // Aquarius (300° - 330°)
  { gate: 60, start: 296.375, end: 302.0 },     // 26°22'30" Cap - 2°00' Aqu
  { gate: 41, start: 302.0, end: 307.625 },     // 2°00' - 7°37'30" Aquarius (START CODON)
  { gate: 19, start: 307.625, end: 313.25 },    // 7°37'30" - 13°15' Aquarius
  { gate: 13, start: 313.25, end: 318.875 },    // 13°15' - 18°52'30" Aquarius
  { gate: 49, start: 318.875, end: 324.5 },     // 18°52'30" - 24°30' Aquarius
  { gate: 30, start: 324.5, end: 330.125 },     // 24°30' Aqu - 0°07'30" Pisces
  
  // Pisces (330° - 360°)
  { gate: 55, start: 330.125, end: 335.75 },    // 0°07'30" - 5°45' Pisces
  { gate: 37, start: 335.75, end: 341.375 },    // 5°45' - 11°22'30" Pisces
  { gate: 63, start: 341.375, end: 347.0 },     // 11°22'30" - 17°00' Pisces
  { gate: 22, start: 347.0, end: 352.625 },     // 17°00' - 22°37'30" Pisces
  { gate: 36, start: 352.625, end: 358.25 },    // 22°37'30" - 28°15' Pisces
  { gate: 25, start: 358.25, end: 3.875 },      // 28°15' Pis - 3°52'30" Aries
  
  // Aries (0° - 30°)
  { gate: 17, start: 3.875, end: 9.5 },         // 3°52'30" - 9°30' Aries
  { gate: 21, start: 9.5, end: 15.125 },        // 9°30' - 15°07'30" Aries
  { gate: 51, start: 15.125, end: 20.75 },      // 15°07'30" - 20°45' Aries
  { gate: 42, start: 20.75, end: 26.375 },      // 20°45' - 26°22'30" Aries
  { gate: 3, start: 26.375, end: 32.0 },        // 26°22'30" Ari - 2°00' Taurus
  
  // Taurus (30° - 60°)
  { gate: 27, start: 32.0, end: 37.625 },       // 2°00' - 7°37'30" Taurus
  { gate: 24, start: 37.625, end: 43.25 },      // 7°37'30" - 13°15' Taurus
  { gate: 2, start: 43.25, end: 48.875 },       // 13°15' - 18°52'30" Taurus
  { gate: 23, start: 48.875, end: 54.5 },       // 18°52'30" - 24°30' Taurus
  { gate: 8, start: 54.5, end: 60.125 },        // 24°30' Tau - 0°07'30" Gemini
  
  // Gemini (60° - 90°)
  { gate: 20, start: 60.125, end: 65.75 },      // 0°07'30" - 5°45' Gemini
  { gate: 16, start: 65.75, end: 71.375 },      // 5°45' - 11°22'30" Gemini
  { gate: 35, start: 71.375, end: 77.0 },       // 11°22'30" - 17°00' Gemini
  { gate: 45, start: 77.0, end: 82.625 },       // 17°00' - 22°37'30" Gemini
  { gate: 12, start: 82.625, end: 88.25 },      // 22°37'30" - 28°15' Gemini
  { gate: 15, start: 88.25, end: 93.875 },      // 28°15' Gem - 3°52'30" Cancer
  
  // Cancer (90° - 120°)
  { gate: 52, start: 93.875, end: 99.5 },       // 3°52'30" - 9°30' Cancer
  { gate: 39, start: 99.5, end: 105.125 },      // 9°30' - 15°07'30" Cancer
  { gate: 53, start: 105.125, end: 110.75 },    // 15°07'30" - 20°45' Cancer
  { gate: 62, start: 110.75, end: 116.375 },    // 20°45' - 26°22'30" Cancer
  { gate: 56, start: 116.375, end: 122.0 },     // 26°22'30" Can - 2°00' Leo
  
  // Leo (120° - 150°)
  { gate: 31, start: 122.0, end: 127.625 },     // 2°00' - 7°37'30" Leo
  { gate: 33, start: 127.625, end: 133.25 },    // 7°37'30" - 13°15' Leo
  { gate: 7, start: 133.25, end: 138.875 },     // 13°15' - 18°52'30" Leo
  { gate: 4, start: 138.875, end: 144.5 },      // 18°52'30" - 24°30' Leo
  { gate: 29, start: 144.5, end: 150.125 },     // 24°30' Leo - 0°07'30" Virgo
  
  // Virgo (150° - 180°)
  { gate: 59, start: 150.125, end: 155.75 },    // 0°07'30" - 5°45' Virgo
  { gate: 40, start: 155.75, end: 161.375 },    // 5°45' - 11°22'30" Virgo
  { gate: 64, start: 161.375, end: 167.0 },     // 11°22'30" - 17°00' Virgo
  { gate: 47, start: 167.0, end: 172.625 },     // 17°00' - 22°37'30" Virgo
  { gate: 6, start: 172.625, end: 178.25 },     // 22°37'30" - 28°15' Virgo
  { gate: 46, start: 178.25, end: 183.875 },    // 28°15' Vir - 3°52'30" Libra
  
  // Libra (180° - 210°)
  { gate: 18, start: 183.875, end: 189.5 },     // 3°52'30" - 9°30' Libra
  { gate: 48, start: 189.5, end: 195.125 },     // 9°30' - 15°07'30" Libra
  { gate: 57, start: 195.125, end: 200.75 },    // 15°07'30" - 20°45' Libra
  { gate: 32, start: 200.75, end: 206.375 },    // 20°45' - 26°22'30" Libra
  { gate: 50, start: 206.375, end: 212.0 },     // 26°22'30" Lib - 2°00' Scorpio
  
  // Scorpio (210° - 240°)
  { gate: 28, start: 212.0, end: 217.625 },     // 2°00' - 7°37'30" Scorpio
  { gate: 44, start: 217.625, end: 223.25 },    // 7°37'30" - 13°15' Scorpio
  { gate: 1, start: 223.25, end: 228.875 },     // 13°15' - 18°52'30" Scorpio
  { gate: 43, start: 228.875, end: 234.5 },     // 18°52'30" - 24°30' Scorpio
  { gate: 14, start: 234.5, end: 240.125 },     // 24°30' Sco - 0°07'30" Sagittarius
  
  // Sagittarius (240° - 270°)
  { gate: 34, start: 240.125, end: 245.75 },    // 0°07'30" - 5°45' Sagittarius
  { gate: 9, start: 245.75, end: 251.375 },     // 5°45' - 11°22'30" Sagittarius
  { gate: 5, start: 251.375, end: 257.0 },      // 11°22'30" - 17°00' Sagittarius
  { gate: 26, start: 257.0, end: 262.625 },     // 17°00' - 22°37'30" Sagittarius
  { gate: 11, start: 262.625, end: 268.25 },    // 22°37'30" - 28°15' Sagittarius
  { gate: 10, start: 268.25, end: 273.875 },    // 28°15' Sag - 3°52'30" Capricorn
  
  // Capricorn (270° - 300°)
  { gate: 58, start: 273.875, end: 279.5 },     // 3°52'30" - 9°30' Capricorn
  { gate: 38, start: 279.5, end: 285.125 },     // 9°30' - 15°07'30" Capricorn
  { gate: 54, start: 285.125, end: 290.75 },    // 15°07'30" - 20°45' Capricorn
  { gate: 61, start: 290.75, end: 296.375 },    // 20°45' - 26°22'30" Capricorn
  // Gate 60 wraps around to Aquarius (listed at top)
];

// Build sequence array for backwards compatibility
export const GATE_SEQUENCE: number[] = [
  41, 19, 13, 49, 30,  // Aquarius
  55, 37, 63, 22, 36, 25,  // Pisces
  17, 21, 51, 42, 3,  // Aries
  27, 24, 2, 23, 8,  // Taurus
  20, 16, 35, 45, 12, 15,  // Gemini
  52, 39, 53, 62, 56,  // Cancer
  31, 33, 7, 4, 29,  // Leo
  59, 40, 64, 47, 6, 46,  // Virgo
  18, 48, 57, 32, 50,  // Libra
  28, 44, 1, 43, 14,  // Scorpio
  34, 9, 5, 26, 11, 10,  // Sagittarius
  58, 38, 54, 61, 60,  // Capricorn
];

// Center assignments for each gate
export const GATE_CENTERS: Record<number, string> = {
  // G Center (Identity)
  1: 'g', 2: 'g', 7: 'g', 10: 'g', 13: 'g', 15: 'g', 25: 'g', 46: 'g',
  // Sacral Center
  3: 'sacral', 5: 'sacral', 9: 'sacral', 14: 'sacral', 27: 'sacral', 29: 'sacral', 34: 'sacral', 42: 'sacral', 59: 'sacral',
  // Solar Plexus (Emotional)
  6: 'solar_plexus', 22: 'solar_plexus', 30: 'solar_plexus', 36: 'solar_plexus', 37: 'solar_plexus', 49: 'solar_plexus', 55: 'solar_plexus',
  // Spleen
  18: 'spleen', 28: 'spleen', 32: 'spleen', 44: 'spleen', 48: 'spleen', 50: 'spleen', 57: 'spleen',
  // Ego/Heart
  21: 'ego', 26: 'ego', 40: 'ego', 51: 'ego',
  // Ajna
  4: 'ajna', 11: 'ajna', 17: 'ajna', 24: 'ajna', 43: 'ajna', 47: 'ajna',
  // Head
  61: 'head', 63: 'head', 64: 'head',
  // Throat
  8: 'throat', 12: 'throat', 16: 'throat', 20: 'throat', 23: 'throat', 31: 'throat', 33: 'throat', 35: 'throat', 45: 'throat', 56: 'throat', 62: 'throat',
  // Root
  19: 'root', 38: 'root', 39: 'root', 41: 'root', 52: 'root', 53: 'root', 54: 'root', 58: 'root', 60: 'root',
};

const GATE_ARC = 5.625; // degrees per gate (5°37'30")
const LINE_ARC = 0.9375; // degrees per line (0°56'15")

/**
 * Convert ecliptic longitude to gate and line.
 * Uses binary search on the verified gate positions.
 */
export function longitudeToGateLine(longitude: number): { gate: number; line: number } {
  // Normalize longitude to 0-360
  let normalizedLong = ((longitude % 360) + 360) % 360;
  
  // Find the gate that contains this longitude
  for (const pos of GATE_POSITIONS) {
    let start = pos.start;
    let end = pos.end;
    
    // Handle wrap-around (e.g., gate 25: 358.25° to 3.875°)
    if (end < start) {
      if (normalizedLong >= start || normalizedLong < end) {
        return calculateLine(normalizedLong, pos.gate, start, end);
      }
    } else {
      if (normalizedLong >= start && normalizedLong < end) {
        return calculateLine(normalizedLong, pos.gate, start, end);
      }
    }
  }
  
  // Fallback (should not reach here with correct data)
  console.warn(`Could not find gate for longitude: ${longitude}`);
  return { gate: 41, line: 1 };
}

/**
 * Calculate line within a gate
 */
function calculateLine(longitude: number, gate: number, start: number, end: number): { gate: number; line: number } {
  let positionInGate: number;
  
  if (end < start) {
    // Handle wrap-around
    if (longitude >= start) {
      positionInGate = longitude - start;
    } else {
      positionInGate = (360 - start) + longitude;
    }
  } else {
    positionInGate = longitude - start;
  }
  
  const line = Math.floor(positionInGate / LINE_ARC) + 1;
  return { gate, line: Math.min(Math.max(line, 1), 6) };
}

/**
 * Get the center for a gate
 */
export function getGateCenter(gate: number): string {
  return GATE_CENTERS[gate] || 'unknown';
}

/**
 * Build complete gate position table with centers
 */
export function buildGatePositions(): GatePosition[] {
  return GATE_POSITIONS.map(pos => ({
    gate: pos.gate,
    startDegree: pos.start,
    endDegree: pos.end,
    center: GATE_CENTERS[pos.gate],
  }));
}
