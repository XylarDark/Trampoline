/**
 * Placeholder passport used by the stub pages so the routes render before the
 * vertical slice wires them to Postgres. Delete this file once attestations are
 * read from the database.
 */
import type { AttestationSnapshot, PassportSnapshot } from "@/src/engine/types";

import { CHECK_TYPES, LEVEL_BUNDLES, RESTRICTIONS } from "./seed-data";

const DAY = 24 * 60 * 60 * 1000;

const domainByKey = new Map(CHECK_TYPES.map((check) => [check.key, check.domain]));

function demoAttestation(
  key: string,
  daysUntilExpiry: number,
  restrictionCodes?: string[],
): AttestationSnapshot {
  const domain = domainByKey.get(key);
  if (!domain) throw new Error(`Unknown check type: ${key}`);

  const now = Date.now();
  return {
    id: `demo-${key}`,
    checkTypeKey: key,
    domain,
    result: restrictionCodes ? "restricted" : "pass",
    issuedAt: new Date(now - 14 * DAY),
    expiresAt: new Date(now + daysUntilExpiry * DAY),
    revokedAt: null,
    restrictionCodes,
  };
}

export function demoPassport(): PassportSnapshot {
  return {
    attestations: [
      demoAttestation("medical.basic_contact", 300),
      demoAttestation("wellness.movement_floor", 60),
      demoAttestation("mental.check_in", 90),
      demoAttestation("skills.placement_ready", 150),
      demoAttestation("medical.work_clearance", 120, ["no_night_shift"]),
    ],
    levelRequirements: LEVEL_BUNDLES,
    restrictions: RESTRICTIONS,
    attendanceDays: 16,
  };
}

export const DEMO_SHARE_TOKEN = "demo";
