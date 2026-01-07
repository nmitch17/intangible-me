/**
 * Error categories for structured error tracking
 */
export enum ErrorCategory {
  // Calculation Errors
  EPHEMERIS_ERROR = 'ephemeris_error',
  GATE_MAPPING_ERROR = 'gate_mapping_error',
  TYPE_DERIVATION_ERROR = 'type_derivation_error',
  CHANNEL_DETECTION_ERROR = 'channel_detection_error',
  CROSS_LOOKUP_ERROR = 'cross_lookup_error',

  // Input Errors
  VALIDATION_ERROR = 'validation_error',
  INVALID_COORDINATES = 'invalid_coordinates',
  INVALID_DATETIME = 'invalid_datetime',
  INVALID_TIMEZONE = 'invalid_timezone',

  // External Service Errors
  GEOCODE_ERROR = 'geocode_error',
  AI_SERVICE_ERROR = 'ai_service_error',
  DATABASE_ERROR = 'database_error',

  // System Errors
  RATE_LIMIT_ERROR = 'rate_limit_error',
  AUTH_ERROR = 'auth_error',
  WASM_LOAD_ERROR = 'wasm_load_error',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Operation names for logging and tracing
 */
export const Operation = {
  // API Operations
  API_CHART_CALCULATE: 'api.chart.calculate',
  API_TRANSIT_CALCULATE: 'api.transit.calculate',
  API_COMPOSITE_CALCULATE: 'api.composite.calculate',
  API_READING_GENERATE: 'api.reading.generate',
  API_GEOCODE: 'api.geocode',
  API_HEALTH_CHECK: 'api.health.check',

  // Calculation Operations
  CALC_DESIGN_TIME: 'calculation.designTime',
  CALC_ACTIVATIONS: 'calculation.activations',
  CALC_PLANET_POSITION: 'calculation.planetPosition',
  CALC_DERIVE_TYPE: 'calculation.deriveType',
  CALC_DERIVE_AUTHORITY: 'calculation.deriveAuthority',
  CALC_DERIVE_DEFINITION: 'calculation.deriveDefinition',
  CALC_FIND_CHANNELS: 'calculation.findChannels',
  CALC_LOOKUP_CROSS: 'calculation.lookupCross',

  // Database Operations
  DB_CHART_SAVE: 'database.chart.save',
  DB_CHART_LOAD: 'database.chart.load',
  DB_USER_LOOKUP: 'database.user.lookup',

  // Auth Operations
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_VERIFY: 'auth.verify',
} as const;

export type OperationType = (typeof Operation)[keyof typeof Operation];

/**
 * Metric names for performance tracking
 */
export const Metric = {
  // Timing metrics
  CHART_CALCULATION_DURATION: 'chart_calculation_duration_ms',
  EPHEMERIS_CALCULATION_DURATION: 'ephemeris_calculation_duration_ms',
  API_REQUEST_DURATION: 'api_request_duration_ms',
  DATABASE_QUERY_DURATION: 'database_query_duration_ms',
  AI_GENERATION_DURATION: 'ai_generation_duration_ms',

  // Counter metrics
  CHARTS_CALCULATED: 'charts_calculated_total',
  TRANSITS_CALCULATED: 'transits_calculated_total',
  COMPOSITES_CALCULATED: 'composites_calculated_total',
  AI_READINGS_GENERATED: 'ai_readings_generated_total',
  ERRORS_TOTAL: 'errors_total',
  RATE_LIMIT_HITS: 'rate_limit_hits_total',

  // Gauge metrics
  ACTIVE_USERS: 'active_users',
  CACHE_SIZE: 'cache_size',
  CACHE_HIT_RATE: 'cache_hit_rate',
} as const;

export type MetricType = (typeof Metric)[keyof typeof Metric];

/**
 * Human Design specific event properties
 */
export interface ChartEventProperties {
  type: string;
  authority: string;
  profile: string;
  definition: string;
  cross_type?: string;
  cross_quarter?: string;
  channels_count?: number;
  defined_centers_count?: number;
}

/**
 * AI/LLM event properties
 */
export interface AIEventProperties {
  model: string;
  provider: string;
  input_tokens?: number;
  output_tokens?: number;
  latency_ms: number;
  success: boolean;
  chart_type?: string;
  reading_focus?: string;
  error?: string;
}

/**
 * API request event properties
 */
export interface APIEventProperties {
  endpoint: string;
  method: string;
  status_code: number;
  duration_ms: number;
  user_id?: string;
  error?: string;
}
