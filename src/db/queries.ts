/**
 * Reads for the provider surfaces, and the single place database rows become
 * engine snapshots.
 *
 * The conversion is here rather than in a page because it is exactly where
 * mistakes are cheap to make and expensive to find: Drizzle returns `numeric`
 * columns as strings to avoid float rounding, and `Number("30.00")` in three
 * different components is three chances to forget. The engine takes numbers
 * and dates, so the boundary is crossed once, here.
 *
 * Every function takes the database handle rather than importing it, so the
 * same reads run against PGlite in tests and Postgres in the app.
 */
import { asc, eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type { PlacementSnapshot, SpellSnapshot, VerificationSource } from "@/src/engine/outcomes";
import type { AttestationSnapshot, CheckDomain, PassportSnapshot } from "@/src/engine/types";

import * as schema from "./schema";
import {
  attestationRestrictions,
  attestations,
  checkTypes,
  employmentSpells,
  organizations,
  outcomeFollowUps,
  outcomeMilestones,
  placements,
  restrictions,
  shareLinks,
  tracks,
  users,
} from "./schema";
import { LEVEL_BUNDLES } from "./seed-data";

type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

/** Drizzle returns numeric as a string. Null stays null; anything else is a bug. */
function toNumber(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) throw new Error(`Expected a numeric column, got ${value}`);
  return parsed;
}

function requireNumber(value: string | null, column: string): number {
  const parsed = toNumber(value);
  if (parsed === null) throw new Error(`${column} is required and was null`);
  return parsed;
}

export type SpellRow = typeof employmentSpells.$inferSelect;
export type FollowUpRow = typeof outcomeFollowUps.$inferSelect;
export type MilestoneRow = typeof outcomeMilestones.$inferSelect;

export function toSpellSnapshot(row: SpellRow): SpellSnapshot {
  return {
    id: row.id,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    weeklyHours: requireNumber(row.weeklyHours, "weekly_hours"),
    hourlyWage: toNumber(row.hourlyWage),
    subsidized: row.subsidized,
    verificationSource: row.verificationSource as VerificationSource,
    verifiedAt: row.verifiedAt,
    ssmPreApprovalRef: row.ssmPreApprovalRef,
  };
}

export function toPlacementSnapshot(row: typeof placements.$inferSelect): PlacementSnapshot {
  return {
    id: row.id,
    startedOn: row.startedOn,
    endedOn: row.endedOn,
    primaryJob: row.primaryJob,
    enteredEmployedFullHours: row.enteredEmployedFullHours,
    sameEmployerAsEntry: row.sameEmployerAsEntry,
  };
}

export type CaseloadRow = {
  placement: PlacementSnapshot;
  spells: SpellSnapshot[];
  clientName: string;
  clientEmail: string;
  jobTitle: string;
  employerName: string | null;
  endedOn: Date | null;
};

/**
 * Every placement with its spells, in one pass.
 *
 * Deliberately loads the whole caseload rather than paginating: a caseload is
 * dozens of people, not thousands, and the headline total is a sum over all of
 * them, so a page of rows could not produce it anyway.
 */
export async function caseload(db: Database): Promise<CaseloadRow[]> {
  const rows = await db
    .select({
      placement: placements,
      clientName: users.name,
      clientEmail: users.email,
      employerName: organizations.name,
    })
    .from(placements)
    .innerJoin(users, eq(placements.userId, users.id))
    .leftJoin(organizations, eq(placements.employerOrganizationId, organizations.id))
    .orderBy(asc(users.name));

  const spellRows = await db
    .select()
    .from(employmentSpells)
    .orderBy(asc(employmentSpells.periodStart));

  const spellsByPlacement = new Map<string, SpellSnapshot[]>();
  for (const spell of spellRows) {
    const list = spellsByPlacement.get(spell.placementId) ?? [];
    list.push(toSpellSnapshot(spell));
    spellsByPlacement.set(spell.placementId, list);
  }

  return rows.map((row) => ({
    placement: toPlacementSnapshot(row.placement),
    spells: spellsByPlacement.get(row.placement.id) ?? [],
    clientName: row.clientName ?? row.clientEmail,
    clientEmail: row.clientEmail,
    jobTitle: row.placement.jobTitle,
    employerName: row.employerName,
    endedOn: row.placement.endedOn,
  }));
}

export type PlacementDetail = CaseloadRow & {
  nocCode: string | null;
  endReason: string | null;
  spellRows: SpellRow[];
  followUps: FollowUpRow[];
  milestones: MilestoneRow[];
};

/** One placement with its full evidence chain. Null when the id is unknown. */
export async function placementDetail(
  db: Database,
  placementId: string,
): Promise<PlacementDetail | null> {
  const [row] = await db
    .select({
      placement: placements,
      clientName: users.name,
      clientEmail: users.email,
      employerName: organizations.name,
    })
    .from(placements)
    .innerJoin(users, eq(placements.userId, users.id))
    .leftJoin(organizations, eq(placements.employerOrganizationId, organizations.id))
    .where(eq(placements.id, placementId))
    .limit(1);

  if (!row) return null;

  const spellRows = await db
    .select()
    .from(employmentSpells)
    .where(eq(employmentSpells.placementId, placementId))
    .orderBy(asc(employmentSpells.periodStart));

  const followUps = await db
    .select()
    .from(outcomeFollowUps)
    .where(eq(outcomeFollowUps.placementId, placementId))
    .orderBy(asc(outcomeFollowUps.monthsAfterJobStart));

  const milestones = await db
    .select()
    .from(outcomeMilestones)
    .where(eq(outcomeMilestones.placementId, placementId))
    .orderBy(asc(outcomeMilestones.achievedOn));

  return {
    placement: toPlacementSnapshot(row.placement),
    spells: spellRows.map(toSpellSnapshot),
    spellRows,
    followUps,
    milestones,
    clientName: row.clientName ?? row.clientEmail,
    clientEmail: row.clientEmail,
    jobTitle: row.placement.jobTitle,
    nocCode: row.placement.nocCode,
    employerName: row.employerName,
    endedOn: row.placement.endedOn,
    endReason: row.placement.endReason,
  };
}

/**
 * A person's passport, in the shape the level, share, and routing engines take.
 *
 * Restrictions are joined per attestation rather than fetched per row, because
 * `activeRestrictionCodes` needs them attached to the attestation that carries
 * them — a restriction detached from its expiry date would outlive the finding
 * it came from.
 */
export async function passportForUser(
  db: Database,
  userId: string,
): Promise<PassportSnapshot | null> {
  const [track] = await db.select().from(tracks).where(eq(tracks.userId, userId)).limit(1);
  if (!track) return null;

  const rows = await db
    .select({
      attestation: attestations,
      checkTypeKey: checkTypes.key,
      domain: checkTypes.domain,
    })
    .from(attestations)
    .innerJoin(checkTypes, eq(attestations.checkTypeId, checkTypes.id))
    .where(eq(attestations.userId, userId))
    .orderBy(asc(attestations.issuedAt));

  const restrictionRows = await db
    .select({
      attestationId: attestationRestrictions.attestationId,
      code: restrictions.code,
    })
    .from(attestationRestrictions)
    .innerJoin(restrictions, eq(attestationRestrictions.restrictionId, restrictions.id));

  const codesByAttestation = new Map<string, string[]>();
  for (const row of restrictionRows) {
    const list = codesByAttestation.get(row.attestationId) ?? [];
    list.push(row.code);
    codesByAttestation.set(row.attestationId, list);
  }

  const snapshots: AttestationSnapshot[] = rows.map((row) => ({
    id: row.attestation.id,
    checkTypeKey: row.checkTypeKey,
    domain: row.domain as CheckDomain,
    result: row.attestation.result,
    issuedAt: row.attestation.issuedAt,
    expiresAt: row.attestation.expiresAt,
    // Revocation is recorded as an `attestation_events` row rather than a
    // column, and no write path issues one yet. Reading the event stream lands
    // with the attestor console.
    revokedAt: null,
    restrictionCodes: codesByAttestation.get(row.attestation.id),
  }));

  const restrictionRefs = await db.select().from(restrictions);

  const domains = new Map<string, CheckDomain>();
  for (const row of await db.select().from(checkTypes)) {
    domains.set(row.key, row.domain as CheckDomain);
  }

  return {
    attestations: snapshots,
    levelRequirements: LEVEL_BUNDLES,
    restrictions: restrictionRefs.map((row) => ({
      code: row.code,
      label: row.label,
      compatibleTags: row.compatibleTags ?? [],
    })),
    checkTypeDomains: Object.fromEntries(domains),
    attendanceDays: track.attendanceDays,
  };
}

export type ShareLinkTarget = {
  userId: string;
  scope: "skills" | "functional_abilities";
  recipientLabel: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

/**
 * Resolve a share token.
 *
 * Null covers unknown, expired, revoked, and `personal` alike, so the caller
 * has one branch and cannot accidentally treat "expired" as a softer failure
 * than "never existed". A `personal` link is the person's own view of their
 * record and is never served through the share route.
 */
export async function shareLinkByToken(
  db: Database,
  token: string,
): Promise<ShareLinkTarget | null> {
  const [row] = await db.select().from(shareLinks).where(eq(shareLinks.token, token)).limit(1);
  if (!row) return null;
  if (row.revokedAt) return null;
  if (row.expiresAt.getTime() <= Date.now()) return null;
  if (row.scope === "personal") return null;

  return {
    userId: row.userId,
    scope: row.scope,
    recipientLabel: row.recipientLabel,
    expiresAt: row.expiresAt,
    revokedAt: row.revokedAt,
  };
}

/** A person's own share links, for the "what others can see" list. */
export async function shareLinksForUser(db: Database, userId: string) {
  return db
    .select()
    .from(shareLinks)
    .where(eq(shareLinks.userId, userId))
    .orderBy(asc(shareLinks.createdAt));
}

/** The featured demo client, so the person-facing routes have someone to show. */
export async function featuredUserId(db: Database, email: string): Promise<string | null> {
  const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return row?.id ?? null;
}
