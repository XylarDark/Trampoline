/**
 * Unlock rules evaluate as data. A gate is a stored `UnlockRuleDefinition`, so
 * an employer or school can change requirements without a deploy.
 */
import { activeRestrictionCodes, satisfiedCheckTypeKeys } from "./decay";
import { computeLevel, hasHealthFloorDrop } from "./levels";
import type {
  OpportunityRef,
  PassportSnapshot,
  RestrictionRef,
  UnlockRuleDefinition,
  UnlockVerdict,
} from "./types";
import { LEVEL_NAMES, unlockRuleDefinitionSchema } from "./types";

export function parseUnlockRule(definition: unknown): UnlockRuleDefinition {
  return unlockRuleDefinitionSchema.parse(definition);
}

/**
 * A restriction blocks an opportunity only when the gate names it and the
 * opportunity's tags are not among the restriction's compatible tags.
 * Restrictions route people toward compatible work; they are not a blacklist.
 */
function blockingRestrictions(
  activeCodes: string[],
  rule: UnlockRuleDefinition,
  opportunity: OpportunityRef,
  known: RestrictionRef[],
): string[] {
  const byCode = new Map(known.map((restriction) => [restriction.code, restriction]));

  return activeCodes.filter((code) => {
    if (!rule.restrictionsMustBeClear.includes(code)) return false;
    const restriction = byCode.get(code);
    if (!restriction) return true;
    return !opportunity.tags.some((tag) => restriction.compatibleTags.includes(tag));
  });
}

export function evaluateUnlock(
  rule: UnlockRuleDefinition,
  opportunity: OpportunityRef,
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): UnlockVerdict {
  const level = computeLevel(snapshot.attestations, snapshot.levelRequirements, now);
  const satisfied = satisfiedCheckTypeKeys(snapshot.attestations, now);
  const activeCodes = activeRestrictionCodes(snapshot.attestations, now);

  const reasons: string[] = [];

  if (level < rule.requiredLevel) {
    reasons.push(
      `Needs Level ${rule.requiredLevel} (${LEVEL_NAMES[rule.requiredLevel]}); currently Level ${level} (${LEVEL_NAMES[level]}).`,
    );
  }

  const missingCheckTypes = rule.requiredCheckTypes.filter((key) => !satisfied.has(key));
  if (missingCheckTypes.length > 0) {
    reasons.push(`Missing or expired checks: ${missingCheckTypes.join(", ")}.`);
  }

  const blocking = blockingRestrictions(activeCodes, rule, opportunity, snapshot.restrictions);
  if (blocking.length > 0) {
    reasons.push(`Restriction not compatible with this opportunity: ${blocking.join(", ")}.`);
  }

  if (rule.attendanceDays && rule.attendanceDays > 0) {
    const demonstrated = snapshot.attendanceDays ?? 0;
    if (demonstrated < rule.attendanceDays) {
      reasons.push(
        `Needs ${rule.attendanceDays} days of attendance; ${demonstrated} demonstrated.`,
      );
    }
  }

  const healthDrop = hasHealthFloorDrop(snapshot.attestations, snapshot.levelRequirements, now);
  const applicationsPaused = rule.pauseOnHealthDrop && healthDrop;
  if (applicationsPaused) {
    reasons.push("Applications paused: a health check lapsed. Renew it to resume.");
  }

  return {
    unlocked: reasons.length === 0,
    reasons,
    missingCheckTypes,
    blockingRestrictions: blocking,
    applicationsPaused,
  };
}

/** Opportunities this person can currently open, plus why the others are shut. */
export function evaluateOpportunities(
  entries: { opportunity: OpportunityRef; rule: UnlockRuleDefinition }[],
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): { opportunity: OpportunityRef; verdict: UnlockVerdict }[] {
  return entries.map(({ opportunity, rule }) => ({
    opportunity,
    verdict: evaluateUnlock(rule, opportunity, snapshot, now),
  }));
}
