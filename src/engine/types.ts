/**
 * Engine inputs.
 *
 * The engine is deliberately free of database access. It takes a snapshot of
 * attestations and rule data and returns routing and gate verdicts, so the
 * rules can be tested without Postgres and evaluated anywhere.
 *
 * Two legal constraints are encoded as types rather than left to reviewers.
 * See docs/research/legal-and-privacy.md for the sources.
 *
 *  1. An employment gate cannot reference health-derived data. Ontario treats
 *     pre-offer medical inquiry as presumptively unlawful (Human Rights Code
 *     s. 23(2)), and consent is not a defence. `EmploymentGate` therefore has
 *     no field capable of expressing a health requirement.
 *  2. Mental health never reaches an employer surface - not the verdict, not
 *     the existence of the check, and not a composite score derived from it.
 */
import { z } from "zod";

export const CHECK_DOMAINS = ["medical", "wellness", "mental", "skills"] as const;
export type CheckDomain = (typeof CHECK_DOMAINS)[number];

/** Health-derived domains. Unreadable by employment gates, by construction. */
export const HEALTH_DOMAINS: readonly CheckDomain[] = ["medical", "wellness", "mental"];

/** The only domain an employment gate may evaluate. */
export const EMPLOYMENT_GATE_DOMAINS: readonly CheckDomain[] = ["skills"];

/**
 * Domains that may never appear on any employer-facing surface, in any form.
 * Mental health is absolute: a dated "mental check-in: pass" discloses a
 * Code-protected ground before any offer exists, and carries no functional
 * content an employer could lawfully act on.
 */
export const EMPLOYER_FORBIDDEN_DOMAINS: readonly CheckDomain[] = ["mental"];

export type AttestationResult = "pass" | "fail" | "restricted";

export const LEVELS = [0, 1, 2, 3, 4] as const;
export type Level = (typeof LEVELS)[number];

export const levelSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

/**
 * Levels are a private routing signal, not a credential. They exist to decide
 * what support to trigger, and are never shown to an employer: a composite
 * score derived partly from health data is exactly the unexplainable artifact
 * Ontario's human rights regulator has warned about in hiring.
 */
export const LEVEL_NAMES: Record<Level, string> = {
  0: "Stabilize",
  1: "Capacity",
  2: "Trainable",
  3: "Employable",
  4: "Hold",
};

export type CheckTypeRef = {
  key: string;
  domain: CheckDomain;
  label?: string;
};

/** Check type key to domain. The engine needs this to enforce gate scope. */
export type CheckTypeDomainMap = Record<string, CheckDomain>;

/**
 * One attestation as the engine sees it. `revokedAt` is derived from the
 * attestation's events by the caller; the stored row itself never changes.
 */
export type AttestationSnapshot = {
  id: string;
  checkTypeKey: string;
  domain: CheckDomain;
  result: AttestationResult;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  /** Restriction codes carried by a `restricted` pass. */
  restrictionCodes?: string[];
};

/** Which check type keys each level requires. Level 0 is the first bundle. */
export type LevelRequirementMap = Partial<Record<Level, string[]>>;

export type RestrictionRef = {
  code: string;
  label?: string;
  /** Opportunity tags this restriction is compatible with. */
  compatibleTags: string[];
};

/**
 * A hiring gate. Deliberately cannot express a health requirement: there is no
 * `requiredLevel`, no `restrictionsMustBeClear`, and no health-expiry field.
 * Adding one would reintroduce the single highest-risk feature in the product.
 */
export const employmentGateSchema = z
  .object({
    kind: z.literal("employment"),
    /** Skills-domain check type keys only. Enforced at evaluation time. */
    requiredCheckTypes: z.array(z.string()).default([]),
    /** Demonstrated attendance days, e.g. 14. Not health-derived. */
    attendanceDays: z.number().int().nonnegative().optional(),
  })
  // Strict, not stripping. A gate someone wrote with `requiredLevel` on it
  // should fail loudly rather than quietly behave differently than intended.
  .strict();

/**
 * A training or program gate. May reference health-derived data only where the
 * program has a documented bona fide safety requirement, which
 * `safetyRationale` forces the publisher to state in writing.
 */
export const trainingGateSchema = z
  .object({
    kind: z.literal("training"),
    requiredCheckTypes: z.array(z.string()).default([]),
    requiredLevel: levelSchema.optional(),
    restrictionsMustBeClear: z.array(z.string()).default([]),
    attendanceDays: z.number().int().nonnegative().optional(),
    /** Written justification, required whenever health-derived fields are used. */
    safetyRationale: z.string().min(20).optional(),
  })
  .strict()
  .superRefine((gate, ctx) => {
    const usesHealthDerivedRequirement =
      gate.requiredLevel !== undefined || gate.restrictionsMustBeClear.length > 0;

    if (usesHealthDerivedRequirement && !gate.safetyRationale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["safetyRationale"],
        message:
          "A training gate that uses a readiness level or a restriction must state a documented bona fide safety rationale.",
      });
    }
  });

export const gateDefinitionSchema = z.discriminatedUnion("kind", [
  employmentGateSchema,
  trainingGateSchema,
]);

export type EmploymentGate = z.infer<typeof employmentGateSchema>;
export type TrainingGate = z.infer<typeof trainingGateSchema>;
export type GateDefinition = z.infer<typeof gateDefinitionSchema>;

export type OpportunityRef = {
  id: string;
  title: string;
  tags: string[];
};

/** Everything the engine needs about one person at one moment. */
export type PassportSnapshot = {
  attestations: AttestationSnapshot[];
  levelRequirements: LevelRequirementMap;
  restrictions: RestrictionRef[];
  checkTypeDomains: CheckTypeDomainMap;
  /** Consecutive attendance days demonstrated, when a gate asks for it. */
  attendanceDays?: number;
};

export type GateVerdict = {
  open: boolean;
  /** Plain reasons, safe to show a person or a gatekeeper. Never clinical. */
  reasons: string[];
  missingCheckTypes: string[];
  blockingRestrictions: string[];
};

/**
 * Support the routing engine recommends. This replaces gating: a lapsed or
 * restricted health check triggers a clinician-to-workplace contact or an
 * accommodation offer - the two levers with strong evidence for reducing work
 * disability duration - rather than withholding access to anything.
 */
export const SUPPORT_ACTIONS = [
  "clinician_workplace_contact",
  "accommodation_offer",
  "renewal_reminder",
  "stabilization_support",
] as const;

export type SupportAction = (typeof SUPPORT_ACTIONS)[number];

export type SupportTrigger = {
  action: SupportAction;
  /** Why it fired, in plain language for the person. */
  reason: string;
  /** Check type that triggered it, for the person's own view only. */
  checkTypeKey?: string;
};
