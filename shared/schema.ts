import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  uuid, 
  timestamp, 
  boolean, 
  integer, 
  decimal,
  date,
  time,
  jsonb,
  varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Agencies table (multi-tenant root)
export const agencies = pgTable("agencies", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  inviteCode: varchar("invite_code", { length: 20 }).unique(),
  whatsappCredits: integer("whatsapp_credits").default(100),
  subscriptionStatus: text("subscription_status").default('trial'),
  subscriptionPlan: text("subscription_plan").default('basic'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Users table (agency staff)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  agencyId: uuid("agency_id").notNull().references(() => agencies.id),
  authUserId: uuid("auth_user_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default('consultant'),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Candidates table (TAs/LSAs)
export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  dbsStatus: text("dbs_status").default('pending'),
  dbsExpiryDate: date("dbs_expiry_date"),
  qualifications: jsonb("qualifications").default(sql`'[]'`),
  experienceYears: integer("experience_years").default(0),
  specializations: text("specializations").array().default(sql`'{}'`),
  availability: text("availability").default('full_time'),
  transportMethod: text("transport_method"),
  maxTravelDistance: integer("max_travel_distance").default(10),
  hourlyRateMin: decimal("hourly_rate_min", { precision: 5, scale: 2 }),
  hourlyRateMax: decimal("hourly_rate_max", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Candidate-agencies junction table
export const candidateAgencies = pgTable("candidate_agencies", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  candidateId: uuid("candidate_id").notNull().references(() => candidates.id),
  agencyId: uuid("agency_id").notNull().references(() => agencies.id),
  status: text("status").default('active'),
  assignedConsultantId: uuid("assigned_consultant_id").references(() => users.id),
  registrationDate: timestamp("registration_date", { withTimezone: true }).defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Auth tokens table (for magic links)
export const authTokens = pgTable("auth_tokens", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  candidateId: uuid("candidate_id").notNull().references(() => candidates.id),
  token: text("token").notNull().unique(),
  tokenType: text("token_type").default('magic_link'),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  isUsed: boolean("is_used").default(false),
  metadata: jsonb("metadata").default(sql`'{}'`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas for form validation
export const insertAgencySchema = createInsertSchema(agencies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCandidateSignupSchema = insertCandidateSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertAuthTokenSchema = createInsertSchema(authTokens).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type Agency = typeof agencies.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

export type CandidateSignup = z.infer<typeof insertCandidateSignupSchema>;

export type InsertAuthToken = z.infer<typeof insertAuthTokenSchema>;
export type AuthToken = typeof authTokens.$inferSelect;
