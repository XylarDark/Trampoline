/**
 * The share view for schools and employers: readiness, restrictions, expiry.
 * Not diagnoses. Everything this module returns is safe to show a gatekeeper —
 * if a field would not survive that test, it does not belong in the return type.
 */
import { activeRestrictionCodes, currentByCheckType } from "./decay";
import { computeLevel, hasHealthFloorDrop, nextLevelGap } from "./levels";
import type { Level, PassportSnapshot, RestrictionRef } from "./types";
import { LEVEL_NAMES } from "./types";

export type ShareableCheck = {
  /** Domain only — never the specific finding. */
  domain: string;
  checkTypeKey: string;
  expiresAt: Date;
};

export type ReadinessShareView = {
  level: Level;
  levelName: string;
  checks: ShareableCheck[];
  restrictions: { code: string; label: string; compatibleTags: string[] }[];
  /** Earliest expiry across current checks: when this view goes stale. */
  earliestExpiry: Date | null;
  applicationsPaused: boolean;
  nextLevel: Level | null;
};

export function buildShareView(
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): ReadinessShareView {
  const current = [...currentByCheckType(snapshot.attestations, now).values()];
  const byCode = new Map<string, RestrictionRef>(
    snapshot.restrictions.map((restriction) => [restriction.code, restriction]),
  );

  const checks = current
    .map((attestation) => ({
      domain: attestation.domain,
      checkTypeKey: attestation.checkTypeKey,
      expiresAt: attestation.expiresAt,
    }))
    .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());

  const level = computeLevel(snapshot.attestations, snapshot.levelRequirements, now);

  return {
    level,
    levelName: LEVEL_NAMES[level],
    checks,
    restrictions: activeRestrictionCodes(snapshot.attestations, now).map((code) => ({
      code,
      label: byCode.get(code)?.label ?? code,
      compatibleTags: byCode.get(code)?.compatibleTags ?? [],
    })),
    earliestExpiry: checks[0]?.expiresAt ?? null,
    applicationsPaused: hasHealthFloorDrop(snapshot.attestations, snapshot.levelRequirements, now),
    nextLevel: nextLevelGap(snapshot.attestations, snapshot.levelRequirements, now).nextLevel,
  };
}
