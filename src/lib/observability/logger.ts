import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Structured logger using Pino
 * - JSON format in production for log aggregation
 * - Pretty printing in development for readability
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
  base: {
    env: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.0.0',
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Create a child logger with additional context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log levels for different operations
 */
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

/**
 * Service identifiers for log categorization
 */
export const Service = {
  API: 'api',
  CALCULATION: 'calculation',
  EPHEMERIS: 'ephemeris',
  DATABASE: 'database',
  AI: 'ai',
  AUTH: 'auth',
  GEOCODE: 'geocode',
} as const;

export type ServiceType = (typeof Service)[keyof typeof Service];
