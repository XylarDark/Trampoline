/**
 * What leaves the passport, and to whom.
 *
 * Three views, deliberately separate types rather than one view with flags:
 *
 *  - `buildEmploymentShareView` — what a hiring employer may see before an
 *    offer. Skills checks only. No level, no restrictions, no health of any
 *    kind. Ontario treats pre-offer medical inquiry as presumptively unlawful
 *    and consent is not a defence, so there is nothing to redact here: the
 *    health data never enters the object.
 *  - `buildFunctionalAbilitiesView` — after a conditional offer, and only if
 *    the person releases it. Functional restriction codes in the shape of a
 *    WSIB Functional Abilities Form, plus how to request an accommodation.
 *    No pass/fail, no level, and never a mental-domain code.
 *  - `buildPersonalView` — everything, for the person themselves.
 *
 * A pass/fail verdict on an employer surface is the thing to avoid: *Davis v.
 * Toronto* found discrimination on perceived disability where the person had no
 * actual functional limitation. Functional detail an employer can act on is
 * defensible; a score is not.
 */
import { activeRestrictionCodes, currentByCheckType } from "./decay";
import { computeLevel, levelStatuses, nextLevelGap, type LevelStatus } from "./levels";
import { supportTriggers } from "./routing";
import type {
  AttestationSnapshot,
  CheckDomain,
  Level,
  PassportSnapshot,
  RestrictionRef,
  SupportTrigger,
} from "./types";
import { EMPLOYER_FORBIDDEN_DOMAINS, LEVEL_NAMES } from "./types";

export const SHARE_SCOPES = ["skills", "functional_abilities", "personal"] as const;
export type ShareScope = (typeof SHARE_SCOPES)[number];

export type ShareableSkillsCheck = {
  checkTypeKey: string;
  label?: string;
  expiresAt: Date;
};

export type EmploymentShareView = {
  scope: "skills";
  checks: ShareableSkillsCheck[];
  /** Earliest expiry across skills checks: when this view goes stale. */
  earliestExpiry: Date | null;
  /** Verbatim, because the absence of health data is the point. */
  notice: string;
};

export type FunctionalRestriction = {
  code: string;
  label: string;
  /** Kinds of work this restriction is compatible with. */
  compatibleTags: string[];
};

export type FunctionalAbilitiesView = {
  scope: "functional_abilities";
  /** What the person can do and under what conditions. Never a verdict. */
  restrictions: FunctionalRestriction[];
  /** Date the issuing clinician expected to reassess. Not an access deadline. */
  reassessOn: Date | null;
  accommodationRequestPath: string;
  notice: string;
};

export type PersonalView = {
  scope: "personal";
  level: Level;
  levelName: string;
  levelStatuses: LevelStatus[];
  nextLevel: Level | null;
  checks: { domain: CheckDomain; checkTypeKey: string; expiresAt: Date }[];
  restrictions: FunctionalRestriction[];
  support: SupportTrigger[];
};

export class ForbiddenDomainDisclosureError extends Error {
  constructor(domain: CheckDomain) {
    super(`${domain} data cannot appear on an employer-facing view.`);
    this.name = "ForbiddenDomainDisclosureError";
  }
}

function assertEmployerSafe(attestations: AttestationSnapshot[]): void {
  for (const attestation of attestations) {
    if (EMPLOYER_FORBIDDEN_DOMAINS.includes(attestation.domain)) {
      throw new ForbiddenDomainDisclosureError(attestation.domain);
    }
  }
}

function toFunctionalRestrictions(
  codes: string[],
  known: RestrictionRef[],
): FunctionalRestriction[] {
  const byCode = new Map(known.map((restriction) => [restriction.code, restriction]));

  return codes.map((code) => ({
    code,
    label: byCode.get(code)?.label ?? code,
    compatibleTags: byCode.get(code)?.compatibleTags ?? [],
  }));
}

export function buildEmploymentShareView(
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): EmploymentShareView {
  const skillsChecks = [...currentByCheckType(snapshot.attestations, now).values()].filter(
    (attestation) => attestation.domain === "skills",
  );

  assertEmployerSafe(skillsChecks);

  const checks = skillsChecks
    .map((attestation) => ({
      checkTypeKey: attestation.checkTypeKey,
      expiresAt: attestation.expiresAt,
    }))
    .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());

  return {
    scope: "skills",
    checks,
    earliestExpiry: checks[0]?.expiresAt ?? null,
    notice:
      "This view lists demonstrated skills only. It contains no health information, and an expired check here does not mean this person is unavailable for work.",
  };
}

/**
 * Only call this after a conditional offer, and only from a share link the
 * person created for that employer. The caller owns that check; this function
 * enforces the narrower rule that mental-domain data never appears.
 */
export function buildFunctionalAbilitiesView(
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): FunctionalAbilitiesView {
  const current = [...currentByCheckType(snapshot.attestations, now).values()];
  const disclosable = current.filter(
    (attestation) => !EMPLOYER_FORBIDDEN_DOMAINS.includes(attestation.domain),
  );

  assertEmployerSafe(disclosable);

  const codes = activeRestrictionCodes(disclosable, now);
  const restricted = disclosable
    .filter((attestation) => (attestation.restrictionCodes ?? []).length > 0)
    .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());

  return {
    scope: "functional_abilities",
    restrictions: toFunctionalRestrictions(codes, snapshot.restrictions),
    reassessOn: restricted[0]?.expiresAt ?? null,
    accommodationRequestPath: "/accommodation",
    notice:
      "These are functional limits and the conditions under which this person can do the work. They are not a diagnosis and not a pass or fail. If a limit affects an essential duty, request an accommodation rather than withdrawing the offer.",
  };
}

export function buildPersonalView(
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): PersonalView {
  const current = [...currentByCheckType(snapshot.attestations, now).values()];
  const level = computeLevel(snapshot.attestations, snapshot.levelRequirements, now);

  return {
    scope: "personal",
    level,
    levelName: LEVEL_NAMES[level],
    levelStatuses: levelStatuses(snapshot.attestations, snapshot.levelRequirements, now),
    nextLevel: nextLevelGap(snapshot.attestations, snapshot.levelRequirements, now).nextLevel,
    checks: current
      .map((attestation) => ({
        domain: attestation.domain,
        checkTypeKey: attestation.checkTypeKey,
        expiresAt: attestation.expiresAt,
      }))
      .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime()),
    restrictions: toFunctionalRestrictions(
      activeRestrictionCodes(snapshot.attestations, now),
      snapshot.restrictions,
    ),
    support: supportTriggers(snapshot, now),
  };
}
