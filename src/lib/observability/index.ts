// Logger
export { logger, createLogger, LogLevel, Service, type ServiceType } from './logger';

// Correlation / Request Context
export {
  getRequestContext,
  getCorrelationId,
  withRequestContext,
  withRequestContextAsync,
  getContextualLogger,
  extractCorrelationId,
  getDuration,
  type RequestContext,
} from './correlation';

// PostHog Server
export {
  getPostHogServer,
  PostHogEvent,
  captureEvent,
  captureChartCalculation,
  captureAIGeneration,
  captureError,
  identifyUser,
  isFeatureEnabled,
  getFeatureFlag,
  shutdownPostHog,
  type PostHogEventType,
} from './posthog-server';

// Events and Metrics
export {
  ErrorCategory,
  Operation,
  Metric,
  type OperationType,
  type MetricType,
  type ChartEventProperties,
  type AIEventProperties,
  type APIEventProperties,
} from './events';
