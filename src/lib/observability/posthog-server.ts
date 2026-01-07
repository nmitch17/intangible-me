import { PostHog } from 'posthog-node';
import { getRequestContext } from './correlation';

/**
 * Server-side PostHog client
 * Configured for serverless environments with immediate flushing
 */
let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  if (!process.env.POSTHOG_API_KEY) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1, // Flush immediately in serverless
      flushInterval: 0,
    });
  }

  return posthogClient;
}

/**
 * Custom event names for the Human Design platform
 */
export const PostHogEvent = {
  // Calculation Events
  CHART_CALCULATED: 'chart_calculated',
  TRANSIT_CALCULATED: 'transit_calculated',
  COMPOSITE_CALCULATED: 'composite_calculated',

  // AI Events (LLM Analytics)
  AI_READING_REQUESTED: 'ai_reading_requested',
  AI_READING_COMPLETED: 'ai_reading_completed',
  AI_READING_FAILED: 'ai_reading_failed',

  // User Journey Events
  CHART_SAVED: 'chart_saved',
  CHART_SHARED: 'chart_shared',
  READING_VIEWED: 'reading_viewed',

  // Error Events
  CALCULATION_ERROR: 'calculation_error',
  VALIDATION_ERROR: 'validation_error',
  API_ERROR: 'api_error',

  // System Events
  HEALTH_CHECK: 'health_check',
  RATE_LIMIT_HIT: 'rate_limit_hit',

  // Feature Usage
  FEATURE_USED: 'feature_used',
} as const;

export type PostHogEventType = (typeof PostHogEvent)[keyof typeof PostHogEvent];

/**
 * Capture an event with automatic context injection
 */
export function captureEvent(
  distinctId: string,
  event: PostHogEventType | string,
  properties?: Record<string, unknown>
): void {
  const posthog = getPostHogServer();
  if (!posthog) return;

  const context = getRequestContext();
  const enrichedProperties = {
    ...properties,
    ...(context && {
      $correlation_id: context.correlationId,
      $request_id: context.requestId,
      service: context.service,
      operation: context.operation,
    }),
  };

  posthog.capture({
    distinctId,
    event,
    properties: enrichedProperties,
  });
}

/**
 * Capture a chart calculation event
 */
export function captureChartCalculation(
  distinctId: string,
  chartData: {
    type: string;
    authority: string;
    profile: string;
    definition: string;
    calculationTimeMs: number;
  }
): void {
  captureEvent(distinctId, PostHogEvent.CHART_CALCULATED, {
    type: chartData.type,
    authority: chartData.authority,
    profile: chartData.profile,
    definition: chartData.definition,
    calculation_time_ms: chartData.calculationTimeMs,
    $set: { last_chart_type: chartData.type },
  });
}

/**
 * Capture an AI/LLM generation event
 */
export function captureAIGeneration(
  distinctId: string,
  data: {
    model: string;
    provider: string;
    inputTokens?: number;
    outputTokens?: number;
    latencyMs: number;
    success: boolean;
    chartType?: string;
    readingFocus?: string;
    error?: string;
  }
): void {
  const posthog = getPostHogServer();
  if (!posthog) return;

  // Use PostHog's built-in LLM event format
  posthog.capture({
    distinctId,
    event: '$ai_generation',
    properties: {
      $ai_model: data.model,
      $ai_provider: data.provider,
      $ai_input_tokens: data.inputTokens,
      $ai_output_tokens: data.outputTokens,
      $ai_latency_ms: data.latencyMs,
      $ai_success: data.success,
      $ai_error: data.error,
      chart_type: data.chartType,
      reading_focus: data.readingFocus,
    },
  });
}

/**
 * Capture an error event
 */
export function captureError(
  distinctId: string,
  error: Error,
  context?: Record<string, unknown>
): void {
  const posthog = getPostHogServer();
  if (!posthog) return;

  posthog.capture({
    distinctId,
    event: '$exception',
    properties: {
      $exception_message: error.message,
      $exception_type: error.name,
      $exception_stack_trace_raw: error.stack,
      ...context,
    },
  });
}

/**
 * Identify a user with properties
 */
export function identifyUser(
  distinctId: string,
  properties?: Record<string, unknown>
): void {
  const posthog = getPostHogServer();
  if (!posthog) return;

  posthog.identify({
    distinctId,
    properties,
  });
}

/**
 * Check if a feature flag is enabled
 */
export async function isFeatureEnabled(
  flagKey: string,
  distinctId: string,
  defaultValue = false
): Promise<boolean> {
  const posthog = getPostHogServer();
  if (!posthog) return defaultValue;

  try {
    return await posthog.isFeatureEnabled(flagKey, distinctId) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Get feature flag variant
 */
export async function getFeatureFlag(
  flagKey: string,
  distinctId: string
): Promise<string | boolean | undefined> {
  const posthog = getPostHogServer();
  if (!posthog) return undefined;

  try {
    return await posthog.getFeatureFlag(flagKey, distinctId);
  } catch {
    return undefined;
  }
}

/**
 * Shutdown PostHog client (call on server shutdown)
 */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}
