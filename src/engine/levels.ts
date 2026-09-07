/**
 * Levels are bundles of passed checks, not quiz scores. A person holds level N
 * only when every bundle from 0 through N is currently satisfied — the levels
 * are a sequence, so a lapsed Level 0 check drops the whole track.
 *
 * A level is a private routing signal: it decides which support to offer and
 * lets the person see their own progress. It is not a credential, and it is
 * never shown to an employer, because a bundle spanning medical, wellness, and
 * mental checks makes the composite a health disclosure by inference.
 */
import { currentByCheckType, isHealthDomain, satisfiedCheckTypeKeys } from "./decay";
import type { AttestationSnapshot, Level, LevelRequirementMap } from "./types";
import { LEVELS } from "./types";

export type LevelStatus = {
  level: Level;
  /** This bundle's own checks are all current. */
  satisfied: boolean;
  /** Satisfied, and so is every bundle below it. Levels are a sequence. */
  held: boolean;
  requiredCheckTypes: string[];
  missingCheckTypes: string[];
};

export function levelStatuses(
  attestations: AttestationSnapshot[],
  levelRequirements: LevelRequirementMap,
  now: Date = new Date(),
): LevelStatus[] {
  const satisfiedKeys = satisfiedCheckTypeKeys(attestations, now);
  let stillSequential = true;

  return LEVELS.map((level) => {
    const required = levelRequirements[level] ?? [];
    const missing = required.filter((key) => !satisfiedKeys.has(key));
    const satisfied = missing.length === 0;

    stillSequential = stillSequential && satisfied;

    return {
      level,
      satisfied,
      held: stillSequential,
      requiredCheckTypes: required,
      missingCheckTypes: missing,
    };
  });
}

/** Highest level whose bundle, and every bundle below it, is currently satisfied. */
export function computeLevel(
  attestations: AttestationSnapshot[],
  levelRequirements: LevelRequirementMap,
  now: Date = new Date(),
): Level {
  const statuses = levelStatuses(attestations, levelRequirements, now);
  let held: Level = 0;

  for (const status of statuses) {
    if (!status.satisfied) break;
    held = status.level;
  }

  // Level 0 is only held once its own bundle passes.
  const levelZero = statuses[0];
  if (levelZero && !levelZero.satisfied) return 0;

  return held;
}

/** What is still missing for the next level up, for the user-facing track view. */
export function nextLevelGap(
  attestations: AttestationSnapshot[],
  levelRequirements: LevelRequirementMap,
  now: Date = new Date(),
): { nextLevel: Level | null; missingCheckTypes: string[] } {
  const statuses = levelStatuses(attestations, levelRequirements, now);
  const firstUnsatisfied = statuses.find((status) => !status.satisfied);

  if (!firstUnsatisfied) return { nextLevel: null, missingCheckTypes: [] };

  return {
    nextLevel: firstUnsatisfied.level,
    missingCheckTypes: firstUnsatisfied.missingCheckTypes,
  };
}

/**
 * A health renewal is due when a medical, wellness, or mental check that the
 * person's held level depends on is no longer current.
 *
 * This signal is private to the person. It never reaches a gate, an employer,
 * or a share view: expiry triggers a reminder and an offer of support, and
 * cannot restrict access to a job. The evidence runs the other way — rapid
 * placement beats pre-employment preparation (34% vs 12% employed at 18
 * months), so withholding work while someone renews a check would make the
 * outcome worse, not safer.
 */
export function healthRenewalDue(
  attestations: AttestationSnapshot[],
  levelRequirements: LevelRequirementMap,
  now: Date = new Date(),
): boolean {
  const current = currentByCheckType(attestations, now);
  const domainByKey = new Map<string, AttestationSnapshot["domain"]>();
  for (const attestation of attestations) {
    domainByKey.set(attestation.checkTypeKey, attestation.domain);
  }

  const everAttested = new Set(attestations.map((a) => a.checkTypeKey));

  for (const level of LEVELS) {
    for (const key of levelRequirements[level] ?? []) {
      if (current.has(key)) continue;
      if (!everAttested.has(key)) continue; // never started is not a drop

      const domain = domainByKey.get(key);
      if (domain && isHealthDomain(domain)) return true;
    }
  }

  return false;
}
