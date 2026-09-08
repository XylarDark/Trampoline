/**
 * Gates evaluate as data. A gate is a stored `GateDefinition`, so an employer
 * or school can change requirements without a deploy.
 *
 * The employment path is narrower than the training path on purpose. An
 * `EmploymentGate` has no field that can express a health requirement, and
 * before evaluating one we strip every non-skills attestation from the
 * snapshot and refuse to run if the gate names a health-domain check type.
 * Two independent stops, because a view-layer filter is one bug away from an
 * unlawful pre-offer medical inquiry.
 */
import { activeRestrictionCodes, satisfiedCheckTypeKeys } from "./decay";
import { computeLevel } from "./levels";
import type {
  CheckDomain,
  CheckTypeDomainMap,
  EmploymentGate,
  GateDefinition,
  OpportunityRef,
  PassportSnapshot,
  RestrictionRef,
  TrainingGate,
  GateVerdict,
} from "./types";
import { EMPLOYMENT_GATE_DOMAINS, LEVEL_NAMES, gateDefinitionSchema } from "./types";

export function parseGate(definition: unknown): GateDefinition {
  return gateDefinitionSchema.parse(definition);
}

export class HealthDataInEmploymentGateError extends Error {
  constructor(readonly offendingCheckTypes: { key: string; domain: CheckDomain }[]) {
    super(
      `Employment gates may only require skills checks. Health-derived check types were named: ${offendingCheckTypes
        .map((entry) => `${entry.key} (${entry.domain})`)
        .join(", ")}.`,
    );
    this.name = "HealthDataInEmploymentGateError";
  }
}

/**
 * Refuse to evaluate an employment gate that names a health-derived check.
 * Throwing beats returning a closed verdict: a misconfigured gate is a
 * compliance defect that must surface, not silently deny someone a job.
 */
export function assertEmploymentGateScope(
  gate: EmploymentGate,
  checkTypeDomains: CheckTypeDomainMap,
): void {
  const offending = gate.requiredCheckTypes
    .map((key) => ({ key, domain: checkTypeDomains[key] }))
    .filter(
      (entry): entry is { key: string; domain: CheckDomain } =>
        entry.domain !== undefined && !EMPLOYMENT_GATE_DOMAINS.includes(entry.domain),
    );

  if (offending.length > 0) throw new HealthDataInEmploymentGateError(offending);
}

/** The snapshot an employment gate is allowed to see: skills attestations only. */
export function skillsOnlySnapshot(snapshot: PassportSnapshot): PassportSnapshot {
  return {
    ...snapshot,
    attestations: snapshot.attestations.filter((a) => a.domain === "skills"),
    // A level is a health-inclusive composite, so an employment gate gets none.
    levelRequirements: {},
    restrictions: [],
  };
}

function attendanceReason(
  required: number | undefined,
  demonstrated: number | undefined,
): string | null {
  if (!required || required <= 0) return null;
  const days = demonstrated ?? 0;
  if (days >= required) return null;
  return `Needs ${required} days of attendance; ${days} demonstrated.`;
}

/**
 * A restriction blocks a training place only when the gate names it and the
 * program's tags are not among the restriction's compatible tags. Restrictions
 * route people toward compatible programs; they are not a blacklist.
 */
function blockingRestrictions(
  activeCodes: string[],
  namedCodes: string[],
  opportunity: OpportunityRef,
  known: RestrictionRef[],
): string[] {
  const byCode = new Map(known.map((restriction) => [restriction.code, restriction]));

  return activeCodes.filter((code) => {
    if (!namedCodes.includes(code)) return false;
    const restriction = byCode.get(code);
    if (!restriction) return true;
    return !opportunity.tags.some((tag) => restriction.compatibleTags.includes(tag));
  });
}

export function evaluateEmploymentGate(
  gate: EmploymentGate,
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): GateVerdict {
  assertEmploymentGateScope(gate, snapshot.checkTypeDomains);

  const scoped = skillsOnlySnapshot(snapshot);
  const satisfied = satisfiedCheckTypeKeys(scoped.attestations, now);
  const reasons: string[] = [];

  const missingCheckTypes = gate.requiredCheckTypes.filter((key) => !satisfied.has(key));
  if (missingCheckTypes.length > 0) {
    reasons.push(`Missing or expired skills checks: ${missingCheckTypes.join(", ")}.`);
  }

  const attendance = attendanceReason(gate.attendanceDays, snapshot.attendanceDays);
  if (attendance) reasons.push(attendance);

  return {
    open: reasons.length === 0,
    reasons,
    missingCheckTypes,
    blockingRestrictions: [],
  };
}

export function evaluateTrainingGate(
  gate: TrainingGate,
  opportunity: OpportunityRef,
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): GateVerdict {
  const satisfied = satisfiedCheckTypeKeys(snapshot.attestations, now);
  const activeCodes = activeRestrictionCodes(snapshot.attestations, now);
  const reasons: string[] = [];

  if (gate.requiredLevel !== undefined) {
    const level = computeLevel(snapshot.attestations, snapshot.levelRequirements, now);
    if (level < gate.requiredLevel) {
      reasons.push(
        `Needs Level ${gate.requiredLevel} (${LEVEL_NAMES[gate.requiredLevel]}); currently Level ${level} (${LEVEL_NAMES[level]}).`,
      );
    }
  }

  const missingCheckTypes = gate.requiredCheckTypes.filter((key) => !satisfied.has(key));
  if (missingCheckTypes.length > 0) {
    reasons.push(`Missing or expired checks: ${missingCheckTypes.join(", ")}.`);
  }

  const blocking = blockingRestrictions(
    activeCodes,
    gate.restrictionsMustBeClear,
    opportunity,
    snapshot.restrictions,
  );
  if (blocking.length > 0) {
    reasons.push(`Restriction not compatible with this program: ${blocking.join(", ")}.`);
  }

  const attendance = attendanceReason(gate.attendanceDays, snapshot.attendanceDays);
  if (attendance) reasons.push(attendance);

  return {
    open: reasons.length === 0,
    reasons,
    missingCheckTypes,
    blockingRestrictions: blocking,
  };
}

export function evaluateGate(
  gate: GateDefinition,
  opportunity: OpportunityRef,
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): GateVerdict {
  return gate.kind === "employment"
    ? evaluateEmploymentGate(gate, snapshot, now)
    : evaluateTrainingGate(gate, opportunity, snapshot, now);
}

/** Every gate this person can currently open, plus why the others are shut. */
export function evaluateOpportunities(
  entries: { opportunity: OpportunityRef; gate: GateDefinition }[],
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): { opportunity: OpportunityRef; gate: GateDefinition; verdict: GateVerdict }[] {
  return entries.map(({ opportunity, gate }) => ({
    opportunity,
    gate,
    verdict: evaluateGate(gate, opportunity, snapshot, now),
  }));
}
