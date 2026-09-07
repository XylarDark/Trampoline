/**
 * Engine inputs.
 *
 * The engine is deliberately free of database access. It takes a snapshot of
 * attestations and rule data and returns levels and unlock verdicts, so the
 * rules can be tested without Postgres and evaluated anywhere.
 */
import { z } from "zod";

export const CHECK_DOMAINS = ["medical", "wellness", "mental", "skills"] as const;
export type CheckDomain = (typeof CHECK_DOMAINS)[number];

/** Domains that make up the health floor. A drop here can pause applications. */
export const HEALTH_DOMAINS: readonly CheckDomain[] = ["medical", "wellness", "mental"];

export type AttestationResult = "pass" | "fail" | "restricted";

export const LEVELS = [0, 1, 2, 3, 4] as const;
export type Level = (typeof LEVELS)[number];

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

export const unlockRuleDefinitionSchema = z.object({
  requiredLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  /** Check type keys that must be current on top of the level bundle. */
  requiredCheckTypes: z.array(z.string()).default([]),
  /** Restriction codes that disqualify unless compatible with the opportunity tags. */
  restrictionsMustBeClear: z.array(z.string()).default([]),
  /** Consecutive days of demonstrated attendance, e.g. 14 for a warehouse gate. */
  attendanceDays: z.number().int().nonnegative().optional(),
  /** When true, a health floor drop pauses applications through this gate. */
  pauseOnHealthDrop: z.boolean().default(true),
});

export type UnlockRuleDefinition = z.infer<typeof unlockRuleDefinitionSchema>;

export type OpportunityRef = {
  id: string;
  title: string;
  targetLevel: Level;
  tags: string[];
};

/** Everything the engine needs about one person at one moment. */
export type PassportSnapshot = {
  attestations: AttestationSnapshot[];
  levelRequirements: LevelRequirementMap;
  restrictions: RestrictionRef[];
  /** Consecutive attendance days demonstrated, when a gate asks for it. */
  attendanceDays?: number;
};

export type UnlockVerdict = {
  unlocked: boolean;
  /** Plain reasons, safe to show a user or a gatekeeper. Never clinical. */
  reasons: string[];
  missingCheckTypes: string[];
  blockingRestrictions: string[];
  applicationsPaused: boolean;
};
