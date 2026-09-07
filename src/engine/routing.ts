/**
 * Routing replaces gating.
 *
 * When a health check lapses or comes back restricted, the old design paused
 * job applications. This module is what happens instead: the same attestation
 * data triggers a clinician-to-workplace contact or an accommodation offer, the
 * two interventions with strong evidence for shortening work disability, while
 * access to work stays open throughout.
 *
 * Everything here is for the person and their own worker. No trigger, and no
 * reason string in one, is ever rendered on an employer surface.
 */
import { activeRestrictionCodes, isHealthDomain, lapsedCheckTypeKeys } from "./decay";
import { healthRenewalDue, nextLevelGap } from "./levels";
import type {
  AttestationSnapshot,
  PassportSnapshot,
  RestrictionRef,
  SupportTrigger,
} from "./types";

function domainsByCheckType(attestations: AttestationSnapshot[]): Map<string, AttestationSnapshot["domain"]> {
  const domains = new Map<string, AttestationSnapshot["domain"]>();
  for (const attestation of attestations) domains.set(attestation.checkTypeKey, attestation.domain);
  return domains;
}

function restrictionLabel(code: string, known: RestrictionRef[]): string {
  return known.find((restriction) => restriction.code === code)?.label ?? code;
}

/**
 * Support to offer this person right now. Order is stable so the person's view
 * does not reshuffle between loads.
 */
export function supportTriggers(
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): SupportTrigger[] {
  const triggers: SupportTrigger[] = [];
  const domains = domainsByCheckType(snapshot.attestations);

  // An active restriction is an accommodation conversation, not a disqualifier.
  for (const code of activeRestrictionCodes(snapshot.attestations, now)) {
    triggers.push({
      action: "accommodation_offer",
      reason: `A current check carries "${restrictionLabel(code, snapshot.restrictions)}". Ask for this to be written into the job as an accommodation.`,
    });
  }

  for (const key of lapsedCheckTypeKeys(snapshot.attestations, now)) {
    const domain = domains.get(key);
    const isHealth = domain !== undefined && isHealthDomain(domain);

    triggers.push({
      action: "renewal_reminder",
      checkTypeKey: key,
      reason: isHealth
        ? `${key} has expired. Renewing keeps your record current. It does not affect any job you can apply for.`
        : `${key} has expired. Renew it to reopen the programs that ask for it.`,
    });

    if (isHealth) {
      triggers.push({
        action: "clinician_workplace_contact",
        checkTypeKey: key,
        reason: `Offer to have the clinician who issued ${key} speak with the workplace directly. This is one of the few steps shown to shorten time off work.`,
      });
    }
  }

  if (healthRenewalDue(snapshot.attestations, snapshot.levelRequirements, now)) {
    triggers.push({
      action: "stabilization_support",
      reason:
        "A health check your track depends on has lapsed. Support is available to get it back. Your job access is unchanged.",
    });
  }

  return triggers;
}

/**
 * The person's own next step. Unlike a gate verdict, this can name health
 * checks, because it is only ever shown to the person.
 */
export function nextStep(
  snapshot: PassportSnapshot,
  now: Date = new Date(),
): { headline: string; missingCheckTypes: string[] } {
  const gap = nextLevelGap(snapshot.attestations, snapshot.levelRequirements, now);

  if (gap.nextLevel === null) {
    return { headline: "Every bundle on your track is current.", missingCheckTypes: [] };
  }

  return {
    headline: `To reach Level ${gap.nextLevel}, ${gap.missingCheckTypes.length} check(s) still to do.`,
    missingCheckTypes: gap.missingCheckTypes,
  };
}
