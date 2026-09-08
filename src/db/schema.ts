/**
 * Trampoline schema.
 *
 * Four rules constrain everything here. They come from the business design and
 * from Ontario law, not from engineering taste:
 *
 *  1. No personal health information. We store who attested, the verdict, any
 *     restriction, and the dates. Never charts, therapy notes, or programs.
 *  2. Attestations are append-only. A revocation is a new row in
 *     `attestationEvents`; the attestation itself is never edited or deleted.
 *  3. An employment gate cannot express a health requirement. This is a check
 *     constraint on `gates`, not a convention, because pre-offer medical
 *     inquiry is presumptively unlawful under Human Rights Code s. 23(2).
 *  4. Expiry never restricts work. There is no column anywhere that pauses a
 *     person's job access, and `tracks.healthRenewalDueAt` is a private
 *     reminder that no employer surface reads.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  jsonb,
  numeric,
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

/**
 * Employment gates may reference skills checks only. Training gates may use a
 * level or a restriction, but only with a written safety rationale.
 */
export const gateKindEnum = pgEnum("gate_kind", ["employment", "training"]);

/** Scopes a share link can carry. `functional_abilities` is post-offer only. */
export const shareScopeEnum = pgEnum("share_scope", ["skills", "functional_abilities", "personal"]);

export const accommodationStatusEnum = pgEnum("accommodation_status", [
  "requested",
  "in_discussion",
  "provided",
  "declined",
  "withdrawn",
]);

/** Referrals are counted in both directions by Employment Ontario reporting. */
export const referralDirectionEnum = pgEnum("referral_direction", ["inbound", "outbound"]);

export const referralStatusEnum = pgEnum("referral_status", [
  "sent",
  "accepted",
  "declined",
  "placed",
  "lost_contact",
]);

/**
 * The milestones Ontario employment funding settles on. Two frameworks, kept
 * distinct on purpose, because conflating them is easy and expensive:
 *
 *  - **IES** (Integrated Employment Services) is the live regime. A Funded
 *    Outcome is an average of 20-plus hours per week at or above general
 *    minimum wage, checked at 1, 3, 6, and 12 months **after job start**.
 *    There is no 13-week measure in IES.
 *  - **ODSP Employment Supports** is the legacy regime that carries the 6- and
 *    13-cumulative-week placement measures and monthly retention fees to 33
 *    months (income support recipients) or 15 months (non-recipients). Its
 *    directive is now scoped to First Nations sites, and it is tracked in
 *    ESMS-SPM rather than CaMS.
 *
 * We model both because providers straddle the transition, and because which
 * regime a given contract sits under is a question for the provider rather
 * than something we can infer.
 */
export const milestoneKindEnum = pgEnum("milestone_kind", [
  "placement_start",
  "program_completion",
  // IES funded-outcome checkpoints, measured from job start.
  "ies_month_1",
  "ies_month_3",
  "ies_month_6",
  "ies_month_12",
  // Legacy ODSP Employment Supports.
  "odsp_weeks_6_cumulative",
  "odsp_weeks_13_cumulative",
  "odsp_retention_month",
]);

/**
 * How employment was evidenced, in the terms the funder accepts.
 *
 * The ordering is not cosmetic. Ontario's documented rule is that a provider
 * attestation is a last resort: it requires the lead caseworker's signature,
 * must satisfy a reasonable-person standard, and needs SSM pre-approval before
 * submission. Client self-report is **not** listed as acceptable evidence for
 * performance-based funding at all — which is precisely why providers spend
 * staff time chasing pay stubs, and why this table exists.
 */
export const verificationSourceEnum = pgEnum("verification_source", [
  "offer_letter",
  "initial_pay_stub",
  "pay_stub",
  "employment_letter",
  "provider_attestation",
  "client_self_report",
]);

export const followUpContactEnum = pgEnum("follow_up_contact", [
  "reached",
  "no_response",
  "declined_to_answer",
  "unreachable",
]);

export const satisfactionRespondentEnum = pgEnum("satisfaction_respondent", ["client", "employer"]);

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
  /** Private routing signal. Never rendered on an employer surface. */
  currentLevel: smallint("current_level").notNull().default(0),
  levelComputedAt: timestamp("level_computed_at", { withTimezone: true }),
  /**
   * Set when a health check the track depends on has lapsed. This drives a
   * reminder and an offer of support to the person. It does not, and must not,
   * restrict access to any job.
   */
  healthRenewalDueAt: timestamp("health_renewal_due_at", { withTimezone: true }),
  /**
   * Demonstrated attendance days, which some employment gates ask for. Kept on
   * the track rather than derived from a health check, because attendance is a
   * skills signal and an employment gate must never read a health one.
   */
  attendanceDays: smallint("attendance_days").notNull().default(0),
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
 * data — see `gateDefinitionSchema` in src/engine/types.ts.
 *
 * The check constraint is the hard stop: Postgres refuses to store an
 * employment gate whose definition contains a level requirement, a restriction
 * requirement, or a health-expiry pause. An application bug cannot route
 * around it, and neither can a hand-written INSERT.
 */
export const gates = pgTable(
  "gates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    label: text("label").notNull(),
    kind: gateKindEnum("kind").notNull(),
    definition: jsonb("definition").notNull(),
    /** Written bona fide safety rationale. Required for health-derived training gates. */
    safetyRationale: text("safety_rationale"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check(
      "gates_employment_is_skills_only",
      sql`${t.kind} <> 'employment' OR NOT (${t.definition} ?| array['requiredLevel', 'restrictionsMustBeClear', 'pauseOnHealthDrop'])`,
    ),
    check(
      "gates_health_derived_training_needs_rationale",
      sql`${t.kind} <> 'training'
        OR NOT (${t.definition} ?| array['requiredLevel', 'restrictionsMustBeClear'])
        OR length(coalesce(${t.safetyRationale}, '')) >= 20`,
    ),
  ],
);

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary"),
  seats: integer("seats").notNull().default(1),
  gateId: uuid("gate_id")
    .notNull()
    .references(() => gates.id),
  /** Conditions of the work, e.g. day_shift, lifting. Matched against restrictions. */
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Scoped, expiring, revocable, and issued to one named recipient so the access
 * log can answer "who saw what". A `functional_abilities` link is only ever
 * created after a conditional offer.
 */
export const shareLinks = pgTable("share_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  scope: shareScopeEnum("scope").notNull().default("skills"),
  /** Who this link was issued to, shown back to the person in their access log. */
  recipientLabel: text("recipient_label").notNull(),
  recipientOrganizationId: uuid("recipient_organization_id").references(() => organizations.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Append-only record of every view of a share link, surfaced to the person. */
export const shareAccessLog = pgTable("share_access_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  shareLinkId: uuid("share_link_id")
    .notNull()
    .references(() => shareLinks.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
  /** Scope actually served, so a later scope change stays auditable. */
  scopeServed: shareScopeEnum("scope_served").notNull(),
  viewerIpHash: text("viewer_ip_hash"),
  userAgent: text("user_agent"),
});

/**
 * A request to have a functional limit written into the job as an
 * accommodation. AODA IASR s. 23 requires this path to exist wherever an
 * assessment or selection process does, so it is a table, not a mailto link.
 */
export const accommodationRequests = pgTable("accommodation_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id),
  /** Restriction the person wants accommodated, when it maps to one. */
  restrictionId: uuid("restriction_id").references(() => restrictions.id),
  /** What the person asked for, in their words. Not a clinical note. */
  requestedSupport: text("requested_support").notNull(),
  status: accommodationStatusEnum("status").notNull().default("requested"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
});

// --- Outcome evidence -------------------------------------------------------
//
// This is the part funders pay on, modelled on the measures they settle
// against rather than on outcomes we find interesting.
//
// Under the live Integrated Employment Services regime, a funded outcome is an
// average of 20-plus hours per week at or above general minimum wage, checked
// at 1, 3, 6, and 12 months after job start, and evidenced by an offer letter,
// a pay stub, or an employment letter. Client self-report does not count.
//
// The referral tables serve the Service Coordination measure, which counts
// supported referrals in *and* out. Note that Service Coordination is
// documented under the legacy Employment Service quality standard; the
// equivalent IES measure is not published, so treat the referral model as
// well-founded in intent and unconfirmed in weighting.
//
// Providers prove all of this by hand today. One told government evaluators
// they had converted a whole department into a "retention department" that
// "strictly captures proof of employment", and that it detracts from client
// service. That manual cost is the wedge.

/**
 * A referral in or out. `direction` and `supported` exist because the funded
 * measure is specifically *supported* referrals, in both directions, with
 * acceptance by the receiving organization — not contacts made.
 */
export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  direction: referralDirectionEnum("direction").notNull(),
  fromOrganizationId: uuid("from_organization_id").references(() => organizations.id),
  toOrganizationId: uuid("to_organization_id")
    .notNull()
    .references(() => organizations.id),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id),
  /** Warm handoff with a named contact, as the funded measure requires. */
  supported: boolean("supported").notNull().default(true),
  status: referralStatusEnum("status").notNull().default("sent"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  /** Acceptance by the receiving org is what makes the referral countable. */
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  declinedReason: text("declined_reason"),
});

/** A person starting work or a program. One placement can span many spells. */
export const placements = pgTable("placements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  employerOrganizationId: uuid("employer_organization_id").references(() => organizations.id),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id),
  referralId: uuid("referral_id").references(() => referrals.id),
  jobTitle: text("job_title").notNull(),
  /** National Occupational Classification code, which funder reporting asks for. */
  nocCode: text("noc_code"),
  startedOn: timestamp("started_on", { withTimezone: true }).notNull(),
  endedOn: timestamp("ended_on", { withTimezone: true }),
  endReason: text("end_reason"),
  /**
   * A funded outcome is assessed on the client's primary job. Concurrent jobs
   * summing to 20-plus hours are allowed only for a capped share of a
   * catchment's clients, so which job is primary has to be recorded, not
   * guessed.
   */
  primaryJob: boolean("primary_job").notNull().default(true),
  /**
   * Entry state at intake. A client who arrives already working 20-plus hours
   * only achieves a funded outcome with a **new** employer, so entry state
   * decides payability and cannot be inferred from the spells alone.
   */
  enteredEmployedFullHours: boolean("entered_employed_full_hours").notNull().default(false),
  /** True when this placement is with the employer the client entered on. */
  sameEmployerAsEntry: boolean("same_employer_as_entry").notNull().default(false),
  /** Set when the placement came through a gate, for pilot analysis. */
  gateId: uuid("gate_id").references(() => gates.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * A continuous stretch of employment at known hours and wage. Milestones count
 * cumulative weeks and checkpoint averages, so a person who works, stops, and
 * restarts needs the spells kept separate rather than a single start and end
 * date.
 */
export const employmentSpells = pgTable(
  "employment_spells",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    placementId: uuid("placement_id")
      .notNull()
      .references(() => placements.id, { onDelete: "cascade" }),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    /** Average hours per week over the period. The 20-hour threshold is an average. */
    weeklyHours: numeric("weekly_hours", { precision: 5, scale: 2 }).notNull(),
    hourlyWage: numeric("hourly_wage", { precision: 7, scale: 2 }),
    /**
     * True while an employer is receiving employer financial supports. No
     * funded outcome is payable until the placement is unsubsidized, so a
     * spell that omits this produces a claim the funder will reject.
     */
    subsidized: boolean("subsidized").notNull().default(false),
    verificationSource: verificationSourceEnum("verification_source").notNull(),
    verifiedByOrganizationId: uuid("verified_by_organization_id").references(
      () => organizations.id,
    ),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    /** SSM pre-approval reference. Mandatory for a provider attestation. */
    ssmPreApprovalRef: text("ssm_pre_approval_ref"),
  },
  (t) => [
    check(
      "employment_spells_attestation_needs_preapproval",
      sql`${t.verificationSource} <> 'provider_attestation' OR ${t.ssmPreApprovalRef} IS NOT NULL`,
    ),
  ],
);

/**
 * A funder-payable milestone, recorded once with the evidence that supports
 * it. `cumulativeWeeks` and `weeklyHoursAtMilestone` are stored rather than
 * recomputed so a claim stays reproducible after later corrections.
 */
export const outcomeMilestones = pgTable(
  "outcome_milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    placementId: uuid("placement_id").references(() => placements.id, { onDelete: "cascade" }),
    kind: milestoneKindEnum("kind").notNull(),
    achievedOn: timestamp("achieved_on", { withTimezone: true }).notNull(),
    cumulativeWeeks: numeric("cumulative_weeks", { precision: 6, scale: 2 }),
    weeklyHoursAtMilestone: numeric("weekly_hours_at_milestone", { precision: 5, scale: 2 }),
    /** How it was proven, e.g. "employer confirmation email, 2026-11-02". */
    evidenceNote: text("evidence_note"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("outcome_milestones_once_per_placement").on(t.userId, t.placementId, t.kind)],
);

/**
 * Follow-up contact, measured in months **after job start** rather than after
 * program exit — IES checkpoints are anchored to the job, not to the exit.
 *
 * The window is 1 to 33 rather than an enumerated list. IES checks at 1, 3, 6,
 * and 12; legacy ODSP retention runs month by month to 33 (income support
 * recipients) or 15 (non-recipients). An enumerated list looked tidier and
 * would have made monthly ODSP retention unrecordable.
 *
 * This table also holds the attempts that fail. "Client stopped answering the
 * phone at month four" is the operational reality that costs providers the
 * outcome, and a schema that only records successful contacts cannot show
 * anyone where the effort went.
 */
export const outcomeFollowUps = pgTable(
  "outcome_follow_ups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    placementId: uuid("placement_id").references(() => placements.id, { onDelete: "set null" }),
    monthsAfterJobStart: smallint("months_after_job_start").notNull(),
    contactedOn: timestamp("contacted_on", { withTimezone: true }).notNull(),
    contactOutcome: followUpContactEnum("contact_outcome").notNull(),
    employed: boolean("employed"),
    weeklyHours: numeric("weekly_hours", { precision: 5, scale: 2 }),
    hourlyWage: numeric("hourly_wage", { precision: 7, scale: 2 }),
    inEducationOrTraining: boolean("in_education_or_training"),
  },
  (t) => [
    unique("outcome_follow_ups_once_per_window").on(t.userId, t.placementId, t.monthsAfterJobStart),
    check("outcome_follow_ups_reported_window", sql`${t.monthsAfterJobStart} BETWEEN 1 AND 33`),
  ],
);

/**
 * Exit satisfaction from both sides. Service quality is a scored measure in
 * Ontario employment funding, and the employer half is what a Sectoral
 * Workforce Innovation Fund application has to evidence.
 */
export const exitSatisfaction = pgTable(
  "exit_satisfaction",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    placementId: uuid("placement_id").references(() => placements.id, { onDelete: "set null" }),
    respondent: satisfactionRespondentEnum("respondent").notNull(),
    /** 1-5, the scale Ontario service quality reporting uses. */
    score: smallint("score").notNull(),
    wouldUseAgain: boolean("would_use_again"),
    comment: text("comment"),
    collectedAt: timestamp("collected_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("exit_satisfaction_score_range", sql`${t.score} BETWEEN 1 AND 5`)],
);

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
