/**
 * Swiss Ephemeris Wrapper
 *
 * Calculates planetary positions for Human Design chart generation.
 * Uses sweph-wasm, a WebAssembly implementation of Swiss Ephemeris
 * that works across all platforms including serverless environments.
 */

import SwissEPH from 'sweph-wasm';
import { longitudeToGateLine } from './mandala';
import type { Activation, Activations, Planet } from '@/types';
import { readFileSync } from 'fs';
import path from 'path';

// Singleton instance of SwissEPH
let sweInstance: SwissEPH | null = null;
let initPromise: Promise<SwissEPH> | null = null;

/**
 * Initialize SwissEPH WASM module (singleton pattern)
 * Uses WASM file from public directory via filesystem read
 * Thread-safe: prevents race conditions with concurrent initialization
 */
async function getSwe(): Promise<SwissEPH> {
  if (sweInstance) return sweInstance;

  if (!initPromise) {
    initPromise = (async () => {
      // Read WASM file from public directory (works in both dev and Vercel)
      const wasmPath = path.join(process.cwd(), 'public', 'swisseph.wasm');
      const wasmBuffer = readFileSync(wasmPath);

      // Create a data URL from the WASM buffer
      const wasmBase64 = wasmBuffer.toString('base64');
      const wasmDataUrl = `data:application/wasm;base64,${wasmBase64}`;

      sweInstance = await SwissEPH.init(wasmDataUrl);
      return sweInstance;
    })();
  }

  return initPromise;
}

// Calculation flags
const SEFLG_SWIEPH = 2; // Use Swiss Ephemeris
const SEFLG_SPEED = 256; // Include speed

/**
 * Convert Date to Julian Day
 */
function dateToJulianDay(swe: SwissEPH, date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  return swe.swe_julday(year, month, day, hour, swe.SE_GREG_CAL);
}

/**
 * Get planetary position at a given Julian Day
 * Returns longitude in degrees
 */
function getPlanetPosition(swe: SwissEPH, julianDay: number, planet: number): number {
  const result = swe.swe_calc_ut(julianDay, planet, SEFLG_SWIEPH | SEFLG_SPEED);
  // Result is array: [longitude, latitude, distance, lonSpeed, latSpeed, distSpeed]
  return result[0];
}

/**
 * Calculate the Design time (88° solar arc before birth)
 *
 * This finds the exact moment when the Sun was 88° behind its birth position.
 */
function calculateDesignTime(swe: SwissEPH, birthJulianDay: number): number {
  const birthSunLongitude = getPlanetPosition(swe, birthJulianDay, swe.SE_SUN);
  const targetLongitude = (birthSunLongitude - 88 + 360) % 360;

  // Approximate: Sun moves ~1° per day, so 88° ≈ 88 days
  let searchJD = birthJulianDay - 88;

  // Binary search to find exact moment
  let low = searchJD - 5;
  let high = searchJD + 5;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const sunLong = getPlanetPosition(swe, mid, swe.SE_SUN);

    // Calculate angular difference
    let diff = sunLong - targetLongitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.0001) {
      return mid;
    }

    if (diff > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Get all planetary activations for a given Julian Day
 */
function getActivations(swe: SwissEPH, julianDay: number): Activations {
  const planets: Array<{ name: Planet; code: number }> = [
    { name: 'sun', code: swe.SE_SUN },
    { name: 'moon', code: swe.SE_MOON },
    { name: 'mercury', code: swe.SE_MERCURY },
    { name: 'venus', code: swe.SE_VENUS },
    { name: 'mars', code: swe.SE_MARS },
    { name: 'jupiter', code: swe.SE_JUPITER },
    { name: 'saturn', code: swe.SE_SATURN },
    { name: 'uranus', code: swe.SE_URANUS },
    { name: 'neptune', code: swe.SE_NEPTUNE },
    { name: 'pluto', code: swe.SE_PLUTO },
  ];

  const activations: Partial<Activations> = {};

  for (const { name, code } of planets) {
    const longitude = getPlanetPosition(swe, julianDay, code);
    const { gate, line } = longitudeToGateLine(longitude);
    activations[name] = { gate, line };
  }

  // North Node
  const northNodeLong = getPlanetPosition(swe, julianDay, swe.SE_TRUE_NODE);
  const northNode = longitudeToGateLine(northNodeLong);
  activations.north_node = northNode;

  // South Node is always opposite (180°)
  const southNodeLong = (northNodeLong + 180) % 360;
  const southNode = longitudeToGateLine(southNodeLong);
  activations.south_node = southNode;

  // Earth is always opposite Sun (180°)
  const sunLong = getPlanetPosition(swe, julianDay, swe.SE_SUN);
  const earthLong = (sunLong + 180) % 360;
  const earth = longitudeToGateLine(earthLong);
  activations.earth = earth;

  return activations as Activations;
}

/**
 * Calculate both Personality and Design activations
 */
export async function calculateActivations(birthDateUtc: Date): Promise<{
  personality: Activations;
  design: Activations;
  designTime: Date;
}> {
  const swe = await getSwe();

  const birthJD = dateToJulianDay(swe, birthDateUtc);
  const designJD = calculateDesignTime(swe, birthJD);

  const personality = getActivations(swe, birthJD);
  const design = getActivations(swe, designJD);

  // Convert design JD back to Date
  const designResult = swe.swe_revjul(designJD, swe.SE_GREG_CAL);
  const designTime = new Date(Date.UTC(
    designResult.year,
    designResult.month - 1,
    designResult.day,
    Math.floor(designResult.hour),
    Math.floor((designResult.hour % 1) * 60),
    Math.floor(((designResult.hour % 1) * 60 % 1) * 60)
  ));

  return { personality, design, designTime };
}

/**
 * Calculate current transit positions
 */
export async function calculateTransits(dateUtc: Date = new Date()): Promise<Activations> {
  const swe = await getSwe();
  const jd = dateToJulianDay(swe, dateUtc);
  return getActivations(swe, jd);
}
