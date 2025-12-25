/**
 * Swiss Ephemeris Wrapper (WebAssembly)
 *
 * Calculates planetary positions for Human Design chart generation.
 * Uses sweph-wasm which is Swiss Ephemeris compiled to WebAssembly.
 */

import SwissEPH from 'sweph-wasm';
import { longitudeToGateLine } from './mandala';
import type { Activations, Planet } from '@/types';

// Singleton instance - initialized lazily
let sweInstance: SwissEPH | null = null;

/**
 * Get or initialize the Swiss Ephemeris instance
 */
async function getSwe(): Promise<SwissEPH> {
  if (!sweInstance) {
    sweInstance = await SwissEPH.init();
  }
  return sweInstance;
}

/**
 * Convert Date to Julian Day
 */
async function dateToJulianDay(date: Date): Promise<number> {
  const swe = await getSwe();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  return swe.swe_julday(year, month, day, hour, swe.SE_GREG_CAL);
}

/**
 * Get planetary position at a given Julian Day
 */
async function getPlanetPosition(julianDay: number, planet: number): Promise<number> {
  const swe = await getSwe();

  // swe_calc_ut returns array: [longitude, latitude, distance, lonSpd, latSpd, distSpd]
  const result = swe.swe_calc_ut(julianDay, planet, swe.SEFLG_SWIEPH | swe.SEFLG_SPEED);

  // Index 0 is longitude
  return result[0];
}

/**
 * Calculate the Design time (88 solar arc before birth)
 *
 * This finds the exact moment when the Sun was 88 behind its birth position.
 */
async function calculateDesignTime(birthJulianDay: number): Promise<number> {
  const swe = await getSwe();
  const birthSunLongitude = await getPlanetPosition(birthJulianDay, swe.SE_SUN);
  const targetLongitude = (birthSunLongitude - 88 + 360) % 360;

  // Approximate: Sun moves ~1 per day, so 88 ≈ 88 days
  let searchJD = birthJulianDay - 88;

  // Binary search to find exact moment
  let low = searchJD - 5;
  let high = searchJD + 5;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const sunLong = await getPlanetPosition(mid, swe.SE_SUN);

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
async function getActivations(julianDay: number): Promise<Activations> {
  const swe = await getSwe();

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
    const longitude = await getPlanetPosition(julianDay, code);
    const { gate, line } = longitudeToGateLine(longitude);
    activations[name] = { gate, line };
  }

  // North Node
  const northNodeLong = await getPlanetPosition(julianDay, swe.SE_TRUE_NODE);
  const northNode = longitudeToGateLine(northNodeLong);
  activations.north_node = northNode;

  // South Node is always opposite (180)
  const southNodeLong = (northNodeLong + 180) % 360;
  const southNode = longitudeToGateLine(southNodeLong);
  activations.south_node = southNode;

  // Earth is always opposite Sun (180)
  const sunLong = await getPlanetPosition(julianDay, swe.SE_SUN);
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
  const birthJD = await dateToJulianDay(birthDateUtc);
  const designJD = await calculateDesignTime(birthJD);

  const personality = await getActivations(birthJD);
  const design = await getActivations(designJD);

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
  const jd = await dateToJulianDay(dateUtc);
  return getActivations(jd);
}
