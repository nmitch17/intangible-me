import { pgTable, text, timestamp, boolean, integer, jsonb, real } from 'drizzle-orm/pg-core';

// ============================================================================
// BETTER-AUTH TABLES
// ============================================================================

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// ============================================================================
// HUMAN DESIGN TABLES
// ============================================================================

// User's saved charts
export const charts = pgTable('charts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  birthDatetimeUtc: timestamp('birth_datetime_utc').notNull(),
  birthTimezone: text('birth_timezone').notNull(),
  birthLat: real('birth_lat').notNull(),
  birthLng: real('birth_lng').notNull(),
  birthLocation: text('birth_location'),
  
  // Computed chart data (cached)
  type: text('type').notNull(),
  strategy: text('strategy').notNull(),
  authority: text('authority').notNull(),
  profile: text('profile').notNull(),
  definition: text('definition').notNull(),
  crossName: text('cross_name').notNull(),
  crossType: text('cross_type').notNull(),
  crossQuarter: text('cross_quarter').notNull(),
  
  // Full chart data as JSON
  chartData: jsonb('chart_data').notNull(),
  
  // Metadata
  isOwner: boolean('is_owner').notNull().default(false), // Is this the user's own chart?
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Practitioner clients (for practitioner OS)
export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  practitionerId: text('practitioner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chartId: text('chart_id').notNull().references(() => charts.id, { onDelete: 'cascade' }),
  email: text('email'),
  phone: text('phone'),
  notes: text('notes'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Session notes for practitioners
export const sessionNotes = pgTable('session_notes', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  practitionerId: text('practitioner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionDate: timestamp('session_date').notNull(),
  notes: text('notes'),
  topics: text('topics').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Chat history for "chat with your chart"
export const chatHistory = pgTable('chat_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chartId: text('chart_id').references(() => charts.id, { onDelete: 'set null' }),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ============================================================================
// REFERENCE DATA TABLES (optional - can also use static JSON)
// ============================================================================

export const gates = pgTable('gates', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  center: text('center').notNull(),
  keynotes: text('keynotes'),
  description: text('description'),
  shadow: text('shadow'),
  gift: text('gift'),
  siddhi: text('siddhi'),
});

export const channels = pgTable('channels', {
  id: text('id').primaryKey(), // e.g., "12-22"
  gateA: integer('gate_a').notNull(),
  gateB: integer('gate_b').notNull(),
  name: text('name').notNull(),
  circuit: text('circuit').notNull(),
  stream: text('stream').notNull(),
  description: text('description'),
});
