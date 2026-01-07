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

// Events
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

// Metrics
export {
  metrics,
  recordChartCalculation,
  recordTransitCalculation,
  recordCompositeCalculation,
  recordAIGeneration,
  recordAPIRequest,
  recordDatabaseQuery,
  recordRateLimitHit,
  recordError,
  updateCacheMetrics,
  startTimer,
} from './metrics';

// Audit
export {
  CALCULATION_VERSION,
  ALGORITHM_CHANGELOG,
  getVersionInfo,
  hashInput,
  hashResult,
  auditChartCalculation,
  auditAIGeneration,
  auditAuthEvent,
  auditDataAccess,
  verifyCalculationIntegrity,
  isVersionCompatible,
  type AuditEntry,
  type ChartAuditEntry,
} from './audit';

// Alerting
export {
  AlertThresholds,
  AlertRules,
  SLATargets,
  checkAlertConditions,
  getPostHogAlertConfig,
  type AlertRule,
} from './alerting';
