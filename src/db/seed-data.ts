/**
 * Seed definitions for the check types, the level bundles, restrictions, and
 * the mocked gates. Kept separate from the seed script so tests exercise the
 * same data the app runs on.
 *
 * Note what the warehouse example looks like now. It used to require Level 2
 * and a clear lifting restriction, which made a medical finding decide whether
 * someone could apply for a job. The employment gate asks for demonstrated
 * skills and attendance only; the lifting restriction moved to the training
 * gate, where a documented safety rationale justifies it, and on the hiring
 * side it becomes an accommodation to negotiate after an offer.
 */
import type { CheckDomain, EmploymentGate, Level, TrainingGate } from "@/src/engine/types";

export type CheckTypeSeed = {
  key: string;
  domain: CheckDomain;
  label: string;
  rubricSummary: string;
  validityDays: number;
  requiredAttestorKind: "clinic" | "wellness" | "mental" | "skills" | "school" | "employer";
  requiresRegulatedAttestor: boolean;
};

export const CHECK_TYPES: CheckTypeSeed[] = [
  {
    key: "medical.basic_contact",
    domain: "medical",
    label: "Basic medical contact",
    rubricSummary:
      "A clinician confirms the person has an active medical contact and a workable medication and sleep routine.",
    validityDays: 365,
    requiredAttestorKind: "clinic",
    requiresRegulatedAttestor: true,
  },
  {
    key: "medical.work_clearance",
    domain: "medical",
    label: "Work clearance",
    rubricSummary:
      "Occupational health or a family doctor confirms fitness for work, listing any restrictions.",
    validityDays: 180,
    requiredAttestorKind: "clinic",
    requiresRegulatedAttestor: true,
  },
  {
    key: "wellness.movement_floor",
    domain: "wellness",
    label: "Movement floor",
    rubricSummary:
      "A gym, trainer, or physio confirms the person meets a baseline of sustained physical activity.",
    validityDays: 90,
    requiredAttestorKind: "wellness",
    requiresRegulatedAttestor: false,
  },
  {
    key: "mental.check_in",
    domain: "mental",
    label: "Mental check-in",
    rubricSummary:
      "A counselor, EAP, or regulated provider confirms the person is engaged and stable enough for the next load.",
    validityDays: 120,
    requiredAttestorKind: "mental",
    requiresRegulatedAttestor: true,
  },
  {
    key: "skills.reliability_window",
    domain: "skills",
    label: "Reliability window",
    rubricSummary:
      "A school, agency, or employer confirms short tasks completed on time across a defined window.",
    validityDays: 120,
    requiredAttestorKind: "skills",
    requiresRegulatedAttestor: false,
  },
  {
    key: "skills.placement_ready",
    domain: "skills",
    label: "Placement ready",
    rubricSummary:
      "An assessor confirms the person can attend a course or placement without collapsing.",
    validityDays: 180,
    requiredAttestorKind: "skills",
    requiresRegulatedAttestor: false,
  },
  {
    key: "skills.core_skills",
    domain: "skills",
    label: "Core skills check",
    rubricSummary: "A certified assessor or employer trial confirms the role's core skills.",
    validityDays: 365,
    requiredAttestorKind: "skills",
    requiresRegulatedAttestor: false,
  },
  {
    key: "skills.hold_90_days",
    domain: "skills",
    label: "90-day hold",
    rubricSummary:
      "A school or employer confirms 90 days attended without the health floor dropping.",
    validityDays: 365,
    requiredAttestorKind: "employer",
    requiresRegulatedAttestor: false,
  },
];

/** Level bundles. Levels are sequential: holding a level requires every bundle below it. */
export const LEVEL_BUNDLES: Record<Level, string[]> = {
  0: ["medical.basic_contact"],
  1: ["wellness.movement_floor", "mental.check_in"],
  2: ["skills.placement_ready"],
  3: ["medical.work_clearance", "skills.core_skills", "skills.reliability_window"],
  4: ["skills.hold_90_days"],
};

export type RestrictionSeed = {
  code: string;
  label: string;
  compatibleTags: string[];
};

export const RESTRICTIONS: RestrictionSeed[] = [
  {
    code: "no_lifting_over_10kg",
    label: "No lifting over 10 kg",
    compatibleTags: ["seated", "remote", "light_duty"],
  },
  {
    code: "no_night_shift",
    label: "No night shift",
    compatibleTags: ["day_shift", "remote"],
  },
  {
    code: "graduated_hours",
    label: "Graduated hours",
    compatibleTags: ["part_time", "remote", "light_duty"],
  },
];

export type GateSeed = {
  key: string;
  label: string;
  definition: EmploymentGate | TrainingGate;
  safetyRationale?: string;
};

export const GATES: GateSeed[] = [
  {
    key: "warehouse.entry",
    label: "Warehouse entry",
    definition: {
      kind: "employment",
      requiredCheckTypes: ["skills.core_skills", "skills.reliability_window"],
      attendanceDays: 14,
    },
  },
  {
    key: "forklift.course",
    label: "Forklift certification course",
    definition: {
      kind: "training",
      requiredCheckTypes: ["skills.placement_ready"],
      restrictionsMustBeClear: ["no_lifting_over_10kg"],
      attendanceDays: 0,
      safetyRationale:
        "The certifying body's practical examination requires unaided handling of test loads above 10 kg, so the restriction is a bona fide requirement of the assessment itself rather than of the work.",
    },
  },
];

export type OpportunityKind = "employment" | "training";

export type OpportunitySeed = {
  key: string;
  title: string;
  summary: string;
  seats: number;
  gateKey: string;
  tags: string[];
};

export const OPPORTUNITIES: OpportunitySeed[] = [
  {
    key: "mock.warehouse_associate",
    title: "Warehouse associate (mocked seat)",
    summary:
      "Placeholder employer seat used to exercise the employment gate. Replace with a real posting before any launch.",
    seats: 2,
    gateKey: "warehouse.entry",
    tags: ["day_shift", "lifting"],
  },
  {
    key: "mock.forklift_course",
    title: "Forklift certification course (mocked seat)",
    summary:
      "Placeholder training seat. Exercises the one gate kind allowed to consider a restriction, and only with a written rationale.",
    seats: 6,
    gateKey: "forklift.course",
    tags: ["day_shift", "lifting"],
  },
];

export const SEED_ORGANIZATIONS = [
  { key: "clinic", name: "Example Community Clinic", kind: "clinic" as const, regulated: true },
  { key: "wellness", name: "Example Y", kind: "wellness" as const, regulated: false },
  {
    key: "mental",
    name: "Example Counselling Services",
    kind: "mental" as const,
    regulated: true,
  },
  { key: "skills", name: "Example Employment Agency", kind: "skills" as const, regulated: false },
  { key: "employer", name: "Example Distribution Co.", kind: "employer" as const, regulated: false },
];

/** Map of level bundles in the shape the engine expects. */
export function levelRequirementMap(): Record<Level, string[]> {
  return LEVEL_BUNDLES;
}

/** Check type key to domain. The engine needs this to keep employment gates skills-only. */
export function checkTypeDomainMap(): Record<string, CheckDomain> {
  return Object.fromEntries(CHECK_TYPES.map((checkType) => [checkType.key, checkType.domain]));
}
