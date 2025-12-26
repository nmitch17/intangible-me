/**
 * Swiss Ephemeris Wrapper
 * 
 * Calculates planetary positions for Human Design chart generation.
 * Uses the swisseph npm package which wraps the Swiss Ephemeris C library.
 */

import swisseph from 'swisseph';
import { longitudeToGateLine } from './mandala';
import type { Activation, Activations, Planet } from '@/types';

// Planet constants from Swiss Ephemeris
const SE_SUN = 0;
const SE_MOON = 1;
const SE_MERCURY = 2;
const SE_VENUS = 3;
const SE_MARS = 4;
const SE_JUPITER = 5;
const SE_SATURN = 6;
const SE_URANUS = 7;
const SE_NEPTUNE = 8;
const SE_PLUTO = 9;
const SE_TRUE_NODE = 11; // North Node

// Calculation flags
const SEFLG_SWIEPH = 2; // Use Swiss Ephemeris
const SEFLG_SPEED = 256; // Include speed

/**
 * Convert Date to Julian Day
 */
function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  
  const result = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
  return result;
}

/**
 * Get planetary position at a given Julian Day
 */
function getPlanetPosition(julianDay: number, planet: number): number {
  const result = swisseph.swe_calc_ut(julianDay, planet, SEFLG_SWIEPH | SEFLG_SPEED) as {
    longitude: number;
    latitude: number;
    distance: number;
    longitudeSpeed: number;
    latitudeSpeed: number;
    distanceSpeed: number;
    rflag: number;
    error?: string;
  };

  if (result.error) {
    throw new Error(`Ephemeris calculation error: ${result.error}`);
  }

  return result.longitude;
}

/**
 * Calculate the Design time (88° solar arc before birth)
 * 
 * This finds the exact moment when the Sun was 88° behind its birth position.
 */
function calculateDesignTime(birthJulianDay: number): number {
  const birthSunLongitude = getPlanetPosition(birthJulianDay, SE_SUN);
  const targetLongitude = (birthSunLongitude - 88 + 360) % 360;
  
  // Approximate: Sun moves ~1° per day, so 88° ≈ 88 days
  let searchJD = birthJulianDay - 88;
  
  // Binary search to find exact moment
  let low = searchJD - 5;
  let high = searchJD + 5;
  
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const sunLong = getPlanetPosition(mid, SE_SUN);
    
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
function getActivations(julianDay: number): Activations {
  const planets: Array<{ name: Planet; code: number }> = [
    { name: 'sun', code: SE_SUN },
    { name: 'moon', code: SE_MOON },
    { name: 'mercury', code: SE_MERCURY },
    { name: 'venus', code: SE_VENUS },
    { name: 'mars', code: SE_MARS },
    { name: 'jupiter', code: SE_JUPITER },
    { name: 'saturn', code: SE_SATURN },
    { name: 'uranus', code: SE_URANUS },
    { name: 'neptune', code: SE_NEPTUNE },
    { name: 'pluto', code: SE_PLUTO },
  ];
  
  const activations: Partial<Activations> = {};
  
  for (const { name, code } of planets) {
    const longitude = getPlanetPosition(julianDay, code);
    const { gate, line } = longitudeToGateLine(longitude);
    activations[name] = { gate, line };
  }
  
  // North Node
  const northNodeLong = getPlanetPosition(julianDay, SE_TRUE_NODE);
  const northNode = longitudeToGateLine(northNodeLong);
  activations.north_node = northNode;
  
  // South Node is always opposite (180°)
  const southNodeLong = (northNodeLong + 180) % 360;
  const southNode = longitudeToGateLine(southNodeLong);
  activations.south_node = southNode;
  
  // Earth is always opposite Sun (180°)
  const sunLong = getPlanetPosition(julianDay, SE_SUN);
  const earthLong = (sunLong + 180) % 360;
  const earth = longitudeToGateLine(earthLong);
  activations.earth = earth;
  
  return activations as Activations;
}

/**
 * Calculate both Personality and Design activations
 */
export function calculateActivations(birthDateUtc: Date): {
  personality: Activations;
  design: Activations;
  designTime: Date;
} {
  const birthJD = dateToJulianDay(birthDateUtc);
  const designJD = calculateDesignTime(birthJD);
  
  const personality = getActivations(birthJD);
  const design = getActivations(designJD);
  
  // Convert design JD back to Date
  const designResult = swisseph.swe_revjul(designJD, swisseph.SE_GREG_CAL);
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
export function calculateTransits(dateUtc: Date = new Date()): Activations {
  const jd = dateToJulianDay(dateUtc);
  return getActivations(jd);
}
