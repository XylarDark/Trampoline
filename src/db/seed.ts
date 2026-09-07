/**
 * Idempotent seed: check types, level bundles, restrictions, the mocked
 * warehouse gate, and the partner organizations that would issue checks.
 *
 * Run with: npm run db:seed
 *
 * `runSeed` takes the database handle rather than importing it, so the same
 * routine can run against any Postgres the driver layer hands it.
 */
import { eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import {
  CHECK_TYPES,
  LEVEL_BUNDLES,
  OPPORTUNITIES,
  RESTRICTIONS,
  SEED_ORGANIZATIONS,
  UNLOCK_RULES,
} from "./seed-data";
import * as schema from "./schema";
import {
  checkTypes,
  levelRequirements,
  opportunities,
  organizations,
  restrictions,
  unlockRules,
} from "./schema";
import type { Level } from "@/src/engine/types";

type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

async function seedCheckTypes(db: Database) {
  for (const check of CHECK_TYPES) {
    await db
      .insert(checkTypes)
      .values({
        key: check.key,
        domain: check.domain,
        label: check.label,
        rubricSummary: check.rubricSummary,
        validityDays: check.validityDays,
        requiredAttestorKind: check.requiredAttestorKind,
        requiresRegulatedAttestor: check.requiresRegulatedAttestor,
      })
      .onConflictDoUpdate({
        target: checkTypes.key,
        set: {
          label: check.label,
          rubricSummary: check.rubricSummary,
          validityDays: check.validityDays,
          requiredAttestorKind: check.requiredAttestorKind,
          requiresRegulatedAttestor: check.requiresRegulatedAttestor,
        },
      });
  }
}

async function seedLevelBundles(db: Database) {
  for (const [level, keys] of Object.entries(LEVEL_BUNDLES)) {
    for (const key of keys) {
      const [check] = await db.select().from(checkTypes).where(eq(checkTypes.key, key)).limit(1);
      if (!check) throw new Error(`Level bundle references unknown check type: ${key}`);

      await db
        .insert(levelRequirements)
        .values({ level: Number(level) as Level, checkTypeId: check.id })
        .onConflictDoNothing();
    }
  }
}

async function seedRestrictions(db: Database) {
  for (const restriction of RESTRICTIONS) {
    await db
      .insert(restrictions)
      .values(restriction)
      .onConflictDoUpdate({
        target: restrictions.code,
        set: { label: restriction.label, compatibleTags: restriction.compatibleTags },
      });
  }
}

async function seedOrganizations(db: Database) {
  const ids = new Map<string, string>();

  for (const org of SEED_ORGANIZATIONS) {
    const [existing] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.name, org.name))
      .limit(1);

    if (existing) {
      ids.set(org.key, existing.id);
      continue;
    }

    const [inserted] = await db
      .insert(organizations)
      .values({ name: org.name, kind: org.kind, regulated: org.regulated })
      .returning();
    ids.set(org.key, inserted.id);
  }

  return ids;
}

async function seedGates(db: Database, orgIds: Map<string, string>) {
  for (const rule of UNLOCK_RULES) {
    await db
      .insert(unlockRules)
      .values({ key: rule.key, label: rule.label, definition: rule.definition })
      .onConflictDoUpdate({
        target: unlockRules.key,
        set: { label: rule.label, definition: rule.definition },
      });
  }

  const employerId = orgIds.get("employer");
  if (!employerId) throw new Error("Seed employer organization missing.");

  for (const seat of OPPORTUNITIES) {
    const [rule] = await db
      .select()
      .from(unlockRules)
      .where(eq(unlockRules.key, seat.unlockRuleKey))
      .limit(1);
    if (!rule) throw new Error(`Opportunity references unknown gate: ${seat.unlockRuleKey}`);

    const [existing] = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.title, seat.title))
      .limit(1);
    if (existing) continue;

    await db.insert(opportunities).values({
      organizationId: employerId,
      title: seat.title,
      summary: seat.summary,
      seats: seat.seats,
      targetLevel: seat.targetLevel,
      unlockRuleId: rule.id,
      tags: seat.tags,
    });
  }
}

export async function runSeed(db: Database) {
  await seedCheckTypes(db);
  await seedLevelBundles(db);
  await seedRestrictions(db);
  const orgIds = await seedOrganizations(db);
  await seedGates(db, orgIds);

  return {
    checkTypes: CHECK_TYPES.length,
    levelRequirements: Object.values(LEVEL_BUNDLES).flat().length,
    restrictions: RESTRICTIONS.length,
    organizations: SEED_ORGANIZATIONS.length,
    gates: UNLOCK_RULES.length,
    opportunities: OPPORTUNITIES.length,
  };
}

async function main() {
  const { db } = await import("./index");
  const counts = await runSeed(db);

  console.log(
    `Seeded ${counts.checkTypes} check types, ${counts.levelRequirements} level requirements, ` +
      `${counts.restrictions} restrictions, ${counts.organizations} organizations, ` +
      `${counts.gates} gate, ${counts.opportunities} mocked opportunity.`,
  );
  process.exit(0);
}

// Only run when invoked directly, not when imported by a test or another script.
if (process.argv[1]?.includes("seed")) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
