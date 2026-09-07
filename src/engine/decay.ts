/**
 * Decay: a check counts only while it is current. Missed or expired checks drop
 * access so the record stays trustworthy.
 */
import type { AttestationSnapshot, CheckDomain } from "./types";
import { HEALTH_DOMAINS } from "./types";

/** Current means issued, not revoked, and not past its expiry. */
export function isCurrent(attestation: AttestationSnapshot, now: Date = new Date()): boolean {
  if (attestation.revokedAt && attestation.revokedAt.getTime() <= now.getTime()) return false;
  if (attestation.issuedAt.getTime() > now.getTime()) return false;
  return attestation.expiresAt.getTime() > now.getTime();
}

/** A `restricted` pass still satisfies its check type; a `fail` does not. */
export function isSatisfying(attestation: AttestationSnapshot): boolean {
  return attestation.result === "pass" || attestation.result === "restricted";
}

export function currentAttestations(
  attestations: AttestationSnapshot[],
  now: Date = new Date(),
): AttestationSnapshot[] {
  return attestations.filter((a) => isCurrent(a, now));
}

/**
 * The newest satisfying, current attestation per check type key. A later fail
 * does not erase an earlier pass, but the most recent verdict wins for a key.
 */
export function currentByCheckType(
  attestations: AttestationSnapshot[],
  now: Date = new Date(),
): Map<string, AttestationSnapshot> {
  const newest = new Map<string, AttestationSnapshot>();

  for (const attestation of currentAttestations(attestations, now)) {
    const existing = newest.get(attestation.checkTypeKey);
    if (!existing || attestation.issuedAt.getTime() > existing.issuedAt.getTime()) {
      newest.set(attestation.checkTypeKey, attestation);
    }
  }

  for (const [key, attestation] of newest) {
    if (!isSatisfying(attestation)) newest.delete(key);
  }

  return newest;
}

export function satisfiedCheckTypeKeys(
  attestations: AttestationSnapshot[],
  now: Date = new Date(),
): Set<string> {
  return new Set(currentByCheckType(attestations, now).keys());
}

/** Restriction codes carried by the person's current, satisfying checks. */
export function activeRestrictionCodes(
  attestations: AttestationSnapshot[],
  now: Date = new Date(),
): string[] {
  const codes = new Set<string>();
  for (const attestation of currentByCheckType(attestations, now).values()) {
    for (const code of attestation.restrictionCodes ?? []) codes.add(code);
  }
  return [...codes];
}

/** Check types that lapsed rather than never having been attested. */
export function lapsedCheckTypeKeys(
  attestations: AttestationSnapshot[],
  now: Date = new Date(),
): string[] {
  const satisfied = satisfiedCheckTypeKeys(attestations, now);
  const lapsed = new Set<string>();

  for (const attestation of attestations) {
    if (satisfied.has(attestation.checkTypeKey)) continue;
    if (!isSatisfying(attestation)) continue;
    if (!isCurrent(attestation, now)) lapsed.add(attestation.checkTypeKey);
  }

  return [...lapsed];
}

export function isHealthDomain(domain: CheckDomain): boolean {
  return HEALTH_DOMAINS.includes(domain);
}
