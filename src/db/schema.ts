/**
 * Trampoline schema.
 *
 * Two rules constrain everything here, and they come from the business design
 * rather than from engineering taste:
 *
 *  1. No personal health information. We store who attested, the verdict, any
 *     restriction, and the dates. Never charts, therapy notes, or programs.
 *  2. Attestations are append-only. A revocation is a new row in
 *     `attestationEvents`; the attestation itself is never edited or deleted.
 */
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "attestor", "org_admin", "funder"]);

export const orgKindEnum = pgEnum("org_kind", [
  "vendor",
  "school",
  "employer",
  "funder",
  "clinic",
  "wellness",
  "mental",
  "skills",
]);

/** The four check types from the brief. Partners perform them; we store attestations. */
export const checkDomainEnum = pgEnum("check_domain", ["medical", "wellness", "mental", "skills"]);

/** `restricted` is a pass that carries a restriction, not a soft failure. */
export const attestationResultEnum = pgEnum("attestation_result", ["pass", "fail", "restricted"]);

export const attestationEventKindEnum = pgEnum("attestation_event_kind", ["issued", "revoked"]);

export const referralStatusEnum = pgEnum("referral_status", [
  "sent",
  "accepted",
  "declined",
  "placed",
]);

export const outcomeKindEnum = pgEnum("outcome_kind", [
  "showed_up",
  "stayed",
  "relapsed",
  "hired",
  "kept_90_days",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  kind: orgKindEnum("kind").notNull(),
  /** Regulated attestors are required for medical and mental gates. */
  regulated: boolean("regulated").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull(),
  },
  (t) => [unique("memberships_user_org_unique").on(t.userId, t.organizationId, t.role)],
);

/** One track per person. `currentLevel` is denormalized; the engine is the authority. */
export const tracks = pgTable("tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  currentLevel: smallint("current_level").notNull().default(0),
  levelComputedAt: timestamp("level_computed_at", { withTimezone: true }),
  /** Set when a cross-domain rule pauses applications, e.g. a health floor drop. */
  applicationsPausedAt: timestamp("applications_paused_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Health load and work load on one scale. This is the connector we own; it is
 * not an intake form for a clinic, so it carries scores only, no narrative.
 */
export const dualIntakes = pgTable("dual_intakes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  healthLoad: smallint("health_load").notNull(),
  workLoad: smallint("work_load").notNull(),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
});

export const checkTypes = pgTable("check_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  domain: checkDomainEnum("domain").notNull(),
  label: text("label").notNull(),
  /** Rubrics are published: no hidden caste. */
  rubricSummary: text("rubric_summary").notNull(),
  rubricUrl: text("rubric_url"),
  /** Validity window is data so decay can be tuned without a release. */
  validityDays: integer("validity_days").notNull(),
  requiredAttestorKind: orgKindEnum("required_attestor_kind").notNull(),
  requiresRegulatedAttestor: boolean("requires_regulated_attestor").notNull().default(false),
});

/** Which check types bundle into each level. Data, not branching code. */
export const levelRequirements = pgTable(
  "level_requirements",
  {
    level: smallint("level").notNull(),
    checkTypeId: uuid("check_type_id")
      .notNull()
      .references(() => checkTypes.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.level, t.checkTypeId] })],
);

export const restrictions = pgTable("restrictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  label: text("label").notNull(),
  /** Opportunity tags this restriction is compatible with. Routes, does not exclude. */
  compatibleTags: text("compatible_tags").array().notNull().default([]),
});

/** Append-only. Never update or delete a row here; write an attestationEvent. */
export const attestations = pgTable("attestations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  checkTypeId: uuid("check_type_id")
    .notNull()
    .references(() => checkTypes.id),
  attestorUserId: uuid("attestor_user_id")
    .notNull()
    .references(() => users.id),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  result: attestationResultEnum("result").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const attestationEvents = pgTable("attestation_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  attestationId: uuid("attestation_id")
    .notNull()
    .references(() => attestations.id, { onDelete: "cascade" }),
  kind: attestationEventKindEnum("kind").notNull(),
  actorUserId: uuid("actor_user_id")
    .notNull()
    .references(() => users.id),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  /** Short operational reason, e.g. "re-assessed". Not a clinical note. */
  reason: text("reason"),
});

export const attestationRestrictions = pgTable(
  "attestation_restrictions",
  {
    attestationId: uuid("attestation_id")
      .notNull()
      .references(() => attestations.id, { onDelete: "cascade" }),
    restrictionId: uuid("restriction_id")
      .notNull()
      .references(() => restrictions.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.attestationId, t.restrictionId] })],
);

/**
 * A gate, published by a school or employer. `definition` holds the rule as
 * data — see `unlockRuleDefinitionSchema` in src/engine/types.ts.
 */
export const unlockRules = pgTable("unlock_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  definition: jsonb("definition").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary"),
  seats: integer("seats").notNull().default(1),
  targetLevel: smallint("target_level").notNull(),
  unlockRuleId: uuid("unlock_rule_id")
    .notNull()
    .references(() => unlockRules.id),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Scoped, expiring token. The share view carries level, restrictions, expiry. */
export const shareLinks = pgTable("share_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  scope: text("scope").notNull().default("readiness"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fromOrganizationId: uuid("from_organization_id").references(() => organizations.id),
  toOrganizationId: uuid("to_organization_id")
    .notNull()
    .references(() => organizations.id),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id),
  status: referralStatusEnum("status").notNull().default("sent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const outcomes = pgTable("outcomes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id),
  kind: outcomeKindEnum("kind").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- Auth.js tables (email magic link; identity stays in our Postgres) ---

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
