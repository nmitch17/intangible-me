/**
 * Audit Logging Module
 *
 * Provides immutable audit trail for calculations and important operations.
 * Essential for debugging, compliance, and calculation verification.
 */

import { createHash } from 'crypto';
import { logger } from './logger';
import { getRequestContext } from './correlation';

// ============================================================================
// CALCULATION VERSIONING
// ============================================================================

/**
 * Current calculation algorithm version
 * Increment this when making changes to calculation logic
 */
export const CALCULATION_VERSION = '1.0.0';

/**
 * Algorithm change history for traceability
 */
export const ALGORITHM_CHANGELOG: Record<string, string> = {
  '1.0.0': 'Initial release - Swiss Ephemeris WASM implementation',
};

/**
 * Get the current ephemeris version info
 */
export function getVersionInfo(): {
  calculationVersion: string;
  ephemerisLibrary: string;
  nodeVersion: string;
} {
  return {
    calculationVersion: CALCULATION_VERSION,
    ephemerisLibrary: 'sweph-wasm@2.6.9',
    nodeVersion: process.version,
  };
}

// ============================================================================
// AUDIT TRAIL TYPES
// ============================================================================

export interface AuditEntry {
  id: string;
  timestamp: string;
  operation: string;

  // Request context
  correlationId?: string;
  userId?: string;

  // Input (hashed for privacy)
  inputHash: string;

  // Calculation metadata
  calculationVersion: string;

  // Result hash for verification
  resultHash: string;

  // Performance
  durationMs: number;

  // Additional context
  metadata?: Record<string, unknown>;
}

export interface ChartAuditEntry extends AuditEntry {
  operation: 'chart_calculation';
  metadata: {
    type: string;
    authority: string;
    profile: string;
    definition: string;
    crossType: string;
  };
}

// ============================================================================
// HASHING UTILITIES
// ============================================================================

/**
 * Create a SHA-256 hash of input data
 */
export function hashInput(data: unknown): string {
  const str = JSON.stringify(data);
  return createHash('sha256').update(str).digest('hex').slice(0, 16);
}

/**
 * Create a hash of calculation result for verification
 */
export function hashResult(result: unknown): string {
  const str = JSON.stringify(result);
  return createHash('sha256').update(str).digest('hex').slice(0, 16);
}

/**
 * Generate a unique audit entry ID
 */
function generateAuditId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `audit_${timestamp}_${random}`;
}

// ============================================================================
// AUDIT LOGGING FUNCTIONS
// ============================================================================

/**
 * Log a chart calculation for audit trail
 */
export function auditChartCalculation(
  input: { datetime_utc: string; lat?: number; lng?: number },
  result: {
    type: string;
    authority: string;
    profile: string;
    definition: string;
    cross: { type: string };
  },
  durationMs: number
): ChartAuditEntry {
  const context = getRequestContext();

  const entry: ChartAuditEntry = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    operation: 'chart_calculation',
    correlationId: context?.correlationId,
    userId: context?.userId,
    inputHash: hashInput(input),
    calculationVersion: CALCULATION_VERSION,
    resultHash: hashResult({
      type: result.type,
      authority: result.authority,
      profile: result.profile,
      definition: result.definition,
    }),
    durationMs,
    metadata: {
      type: result.type,
      authority: result.authority,
      profile: result.profile,
      definition: result.definition,
      crossType: result.cross.type,
    },
  };

  // Log the audit entry
  logger.info(
    {
      audit: true,
      ...entry,
    },
    `Audit: Chart calculated - ${result.type} ${result.profile}`
  );

  return entry;
}

/**
 * Log an AI reading generation for audit trail
 */
export function auditAIGeneration(
  input: { chartHash: string; focus?: string },
  result: { model: string; tokens?: number; success: boolean },
  durationMs: number
): AuditEntry {
  const context = getRequestContext();

  const entry: AuditEntry = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    operation: 'ai_generation',
    correlationId: context?.correlationId,
    userId: context?.userId,
    inputHash: hashInput(input),
    calculationVersion: CALCULATION_VERSION,
    resultHash: hashResult({ success: result.success }),
    durationMs,
    metadata: {
      model: result.model,
      tokens: result.tokens,
      success: result.success,
      focus: input.focus,
    },
  };

  logger.info(
    {
      audit: true,
      ...entry,
    },
    `Audit: AI reading generated - ${result.model} ${result.success ? 'success' : 'failed'}`
  );

  return entry;
}

/**
 * Log an authentication event for audit trail
 */
export function auditAuthEvent(
  event: 'login' | 'logout' | 'failed_login' | 'password_reset',
  userId: string | undefined,
  metadata?: Record<string, unknown>
): AuditEntry {
  const context = getRequestContext();

  const entry: AuditEntry = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    operation: `auth_${event}`,
    correlationId: context?.correlationId,
    userId,
    inputHash: hashInput({ event, userId }),
    calculationVersion: CALCULATION_VERSION,
    resultHash: hashResult({ event }),
    durationMs: 0,
    metadata,
  };

  logger.info(
    {
      audit: true,
      ...entry,
    },
    `Audit: Auth event - ${event}`
  );

  return entry;
}

/**
 * Log a data access event for audit trail
 */
export function auditDataAccess(
  operation: 'read' | 'write' | 'delete',
  resource: string,
  resourceId: string,
  userId?: string
): AuditEntry {
  const context = getRequestContext();

  const entry: AuditEntry = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    operation: `data_${operation}`,
    correlationId: context?.correlationId,
    userId: userId || context?.userId,
    inputHash: hashInput({ resource, resourceId }),
    calculationVersion: CALCULATION_VERSION,
    resultHash: hashResult({ operation, resource }),
    durationMs: 0,
    metadata: {
      resource,
      resourceId,
    },
  };

  logger.info(
    {
      audit: true,
      ...entry,
    },
    `Audit: Data ${operation} - ${resource}:${resourceId}`
  );

  return entry;
}

// ============================================================================
// VERIFICATION UTILITIES
// ============================================================================

/**
 * Verify that a stored result matches recalculation
 * Used for periodic integrity checks
 */
export function verifyCalculationIntegrity(
  storedHash: string,
  recalculatedResult: unknown
): { valid: boolean; newHash: string } {
  const newHash = hashResult(recalculatedResult);
  return {
    valid: storedHash === newHash,
    newHash,
  };
}

/**
 * Check if current version matches stored version
 */
export function isVersionCompatible(storedVersion: string): boolean {
  const [storedMajor] = storedVersion.split('.').map(Number);
  const [currentMajor] = CALCULATION_VERSION.split('.').map(Number);
  return storedMajor === currentMajor;
}
