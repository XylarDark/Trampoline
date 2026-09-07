/**
 * Idempotent seed: check types, level bundles, restrictions, the mocked
 * employment and training gates, and the partner organizations that would
 * issue checks.
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
  GATES,
  LEVEL_BUNDLES,
  OPPORTUNITIES,
  RESTRICTIONS,
  SEED_ORGANIZATIONS,
  checkTypeDomainMap,
} from "./seed-data";
import { assertEmploymentGateScope, parseGate } from "@/src/engine/rules";
import { seedDemoCohort } from "./demo-cohort";
import * as schema from "./schema";
import {
  checkTypes,
  gates,
  levelRequirements,
  opportunities,
  organizations,
  restrictions,
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
  for (const gate of GATES) {
    // Parse before insert: the schema refuses a health requirement on an
    // employment gate, and we would rather find out here than in Postgres.
    const definition = parseGate(gate.definition);

    if (definition.kind === "employment") {
      assertEmploymentGateScope(definition, checkTypeDomainMap());
    }

    const values = {
      key: gate.key,
      label: gate.label,
      kind: definition.kind,
      definition,
      safetyRationale:
        definition.kind === "training" ? (definition.safetyRationale ?? null) : null,
    };

    await db
      .insert(gates)
      .values(values)
      .onConflictDoUpdate({ target: gates.key, set: values });
  }

  const employerId = orgIds.get("employer");
  if (!employerId) throw new Error("Seed employer organization missing.");

  for (const seat of OPPORTUNITIES) {
    const [gate] = await db.select().from(gates).where(eq(gates.key, seat.gateKey)).limit(1);
    if (!gate) throw new Error(`Opportunity references unknown gate: ${seat.gateKey}`);

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
      gateId: gate.id,
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
  const cohort = await seedDemoCohort(db, orgIds);

  return {
    checkTypes: CHECK_TYPES.length,
    levelRequirements: Object.values(LEVEL_BUNDLES).flat().length,
    restrictions: RESTRICTIONS.length,
    organizations: SEED_ORGANIZATIONS.length,
    gates: GATES.length,
    opportunities: OPPORTUNITIES.length,
    cohort,
  };
}

async function main() {
  const { db } = await import("./index");
  const counts = await runSeed(db);

  console.log(
    `Seeded ${counts.checkTypes} check types, ${counts.levelRequirements} level requirements, ` +
      `${counts.restrictions} restrictions, ${counts.organizations} organizations, ` +
      `${counts.gates} gates, ${counts.opportunities} mocked opportunities, ` +
      `${counts.cohort.created} of ${counts.cohort.clients} demo clients.`,
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
