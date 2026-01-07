import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';
import { createLogger, type ServiceType } from './logger';
import type { Logger } from 'pino';

/**
 * Request context stored in AsyncLocalStorage for automatic propagation
 */
export interface RequestContext {
  correlationId: string;
  requestId: string;
  userId?: string;
  sessionId?: string;
  startTime: number;
  service: ServiceType;
  operation: string;
}

/**
 * AsyncLocalStorage instance for request context
 * This allows us to access request context anywhere in the call stack
 * without explicitly passing it through every function
 */
const requestContextStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Get the current request context
 */
export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

/**
 * Get or generate a correlation ID
 */
export function getCorrelationId(): string {
  const context = getRequestContext();
  return context?.correlationId || uuidv4();
}

/**
 * Run a function within a request context
 */
export function withRequestContext<T>(
  context: Partial<RequestContext> & { service: ServiceType; operation: string },
  fn: () => T
): T {
  const fullContext: RequestContext = {
    correlationId: context.correlationId || uuidv4(),
    requestId: context.requestId || uuidv4(),
    userId: context.userId,
    sessionId: context.sessionId,
    startTime: context.startTime || Date.now(),
    service: context.service,
    operation: context.operation,
  };

  return requestContextStorage.run(fullContext, fn);
}

/**
 * Run an async function within a request context
 */
export async function withRequestContextAsync<T>(
  context: Partial<RequestContext> & { service: ServiceType; operation: string },
  fn: () => Promise<T>
): Promise<T> {
  const fullContext: RequestContext = {
    correlationId: context.correlationId || uuidv4(),
    requestId: context.requestId || uuidv4(),
    userId: context.userId,
    sessionId: context.sessionId,
    startTime: context.startTime || Date.now(),
    service: context.service,
    operation: context.operation,
  };

  return requestContextStorage.run(fullContext, fn);
}

/**
 * Get a logger with the current request context
 */
export function getContextualLogger(): Logger {
  const context = getRequestContext();

  if (context) {
    return createLogger({
      correlationId: context.correlationId,
      requestId: context.requestId,
      userId: context.userId,
      service: context.service,
      operation: context.operation,
    });
  }

  return createLogger({});
}

/**
 * Extract correlation ID from request headers
 */
export function extractCorrelationId(headers: Headers): string {
  return (
    headers.get('x-correlation-id') ||
    headers.get('x-request-id') ||
    uuidv4()
  );
}

/**
 * Calculate duration from request start
 */
export function getDuration(): number {
  const context = getRequestContext();
  if (context) {
    return Date.now() - context.startTime;
  }
  return 0;
}
