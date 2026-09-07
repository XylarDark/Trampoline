/**
 * Applies the generated migrations and runs the seed against an in-process
 * Postgres (PGlite), so the schema and the seed are verified without needing a
 * Docker daemon. The same migrations run against the real database.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { beforeAll, describe, expect, it } from "vitest";

import { placementCheckpoints } from "@/src/engine/outcomes";
import { gateDefinitionSchema } from "@/src/engine/types";

import { DEMO_COHORT, DEMO_SHARE_TOKEN } from "./demo-cohort";
import { caseload } from "./queries";
import * as schema from "./schema";
import { CHECK_TYPES, GATES, LEVEL_BUNDLES, OPPORTUNITIES, RESTRICTIONS } from "./seed-data";
import { runSeed } from "./seed";

let client: PGlite;
let db: ReturnType<typeof drizzle<typeof schema>>;

async function applyMigrations() {
  const migrationsDir = path.resolve("drizzle");
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  expect(files.length).toBeGreaterThan(0);

  for (const file of files) {
    const sql = readFileSync(path.join(migrationsDir, file), "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      const trimmed = statement.trim();
      if (trimmed) await client.exec(trimmed);
    }
  }
}

/**
 * Drizzle wraps the driver error, so the constraint name lives in the cause
 * chain rather than in `error.message`. Walk the chain and assert on the name:
 * these tests exist to prove which constraint fired, not that something failed.
 */
async function expectConstraintViolation(query: Promise<unknown>, constraint: string) {
  const error = await query.then(
    () => null,
    (thrown: unknown) => thrown,
  );

  expect(error, `expected ${constraint} to reject the insert`).toBeInstanceOf(Error);

  const messages: string[] = [];
  let current: unknown = error;
  while (current instanceof Error) {
    messages.push(current.message);
    current = current.cause;
  }

  expect(messages.join("\n")).toContain(constraint);
}

/** One cohort client's placement and spells, in the shape the engine takes. */
async function loadCohortPlacement(email: string) {
  const row = (await caseload(db)).find((candidate) => candidate.clientEmail === email);
  if (!row) throw new Error(`Demo cohort is missing ${email}`);
  return row;
}

beforeAll(async () => {
  client = new PGlite();
  db = drizzle(client, { schema });
  await applyMigrations();
  // Twice, so a rerun on an existing database is proven safe.
  await runSeed(db);
  await runSeed(db);
}, 60_000);

describe("migrations and seed", () => {
  it("seeds the check types once, not once per run", async () => {
    const rows = await db.select().from(schema.checkTypes);
    expect(rows).toHaveLength(CHECK_TYPES.length);
  });

  it("wires every level bundle to a real check type", async () => {
    const rows = await db.select().from(schema.levelRequirements);
    expect(rows).toHaveLength(Object.values(LEVEL_BUNDLES).flat().length);
  });

  it("seeds the restrictions with their compatible tags", async () => {
    const rows = await db.select().from(schema.restrictions);
    expect(rows).toHaveLength(RESTRICTIONS.length);
    const lifting = rows.find((row) => row.code === "no_lifting_over_10kg");
    expect(lifting?.compatibleTags).toContain("light_duty");
  });

  it("stores every gate as data the engine can parse", async () => {
    const rows = await db.select().from(schema.gates);
    expect(rows).toHaveLength(GATES.length);

    for (const row of rows) {
      const parsed = gateDefinitionSchema.parse(row.definition);
      expect(parsed.kind).toBe(row.kind);
    }
  });

  it("attaches the mocked seats to the employer organization", async () => {
    const rows = await db.select().from(schema.opportunities);
    expect(rows).toHaveLength(OPPORTUNITIES.length);
    expect(rows.every((row) => row.gateId)).toBe(true);

    const [employer] = await db.select().from(schema.organizations);
    expect(employer).toBeDefined();
  });

  it("refuses to store an employment gate that carries a health requirement", async () => {
    // The check constraint, not the application, is what stops this.
    await expectConstraintViolation(
      db.insert(schema.gates).values({
        key: "illegal.employment_gate",
        label: "Illegal health gate",
        kind: "employment",
        definition: { kind: "employment", requiredCheckTypes: [], requiredLevel: 3 },
      }),
      "gates_employment_is_skills_only",
    );
  });

  it("refuses a health-derived training gate with no written safety rationale", async () => {
    await expectConstraintViolation(
      db.insert(schema.gates).values({
        key: "illegal.training_gate",
        label: "Unjustified training gate",
        kind: "training",
        definition: {
          kind: "training",
          requiredCheckTypes: [],
          restrictionsMustBeClear: ["no_lifting_over_10kg"],
        },
      }),
      "gates_health_derived_training_needs_rationale",
    );
  });

  it("keeps follow-ups inside the reportable window, measured from job start", async () => {
    const [user] = await db
      .insert(schema.users)
      .values({ email: "follow-up-window@example.test" })
      .returning();

    // 34 is past the longest ODSP retention period.
    await expectConstraintViolation(
      db.insert(schema.outcomeFollowUps).values({
        userId: user.id,
        monthsAfterJobStart: 34,
        contactedOn: new Date(),
        contactOutcome: "reached",
      }),
      "outcome_follow_ups_reported_window",
    );

    // Month 4 is not an IES checkpoint but is a legacy ODSP retention month,
    // so the window has to admit it.
    await db.insert(schema.outcomeFollowUps).values([
      {
        userId: user.id,
        monthsAfterJobStart: 4,
        contactedOn: new Date(),
        contactOutcome: "no_response",
      },
      {
        userId: user.id,
        monthsAfterJobStart: 12,
        contactedOn: new Date(),
        contactOutcome: "reached",
        employed: true,
        weeklyHours: "22.50",
        hourlyWage: "19.00",
      },
    ]);

    const rows = await db
      .select()
      .from(schema.outcomeFollowUps)
      .where(eq(schema.outcomeFollowUps.userId, user.id));
    expect(rows.map((row) => row.monthsAfterJobStart).sort((a, b) => a - b)).toEqual([4, 12]);
  });

  it("records the milestones funders settle on, once each", async () => {
    const [user] = await db
      .insert(schema.users)
      .values({ email: "milestones@example.test" })
      .returning();
    const [employer] = await db.select().from(schema.organizations);

    const [placement] = await db
      .insert(schema.placements)
      .values({
        userId: user.id,
        employerOrganizationId: employer.id,
        jobTitle: "Warehouse associate",
        startedOn: new Date("2026-01-05T00:00:00Z"),
      })
      .returning();

    await db.insert(schema.employmentSpells).values({
      placementId: placement.id,
      periodStart: new Date("2026-01-05T00:00:00Z"),
      weeklyHours: "24.00",
      hourlyWage: "18.50",
      verificationSource: "employment_letter",
      verifiedByOrganizationId: employer.id,
      verifiedAt: new Date("2026-04-06T00:00:00Z"),
    });

    const milestone = {
      userId: user.id,
      placementId: placement.id,
      kind: "ies_month_3" as const,
      achievedOn: new Date("2026-04-06T00:00:00Z"),
      weeklyHoursAtMilestone: "24.00",
      evidenceNote: "Employment letter from employer, 2026-04-06",
    };

    await db.insert(schema.outcomeMilestones).values(milestone);
    await expectConstraintViolation(
      db.insert(schema.outcomeMilestones).values(milestone),
      "outcome_milestones_once_per_placement",
    );
  });

  it("refuses a provider attestation with no SSM pre-approval reference", async () => {
    // Ontario permits a provider attestation only as a last resort, and only
    // with SSM pre-approval before submission. An attestation recorded without
    // that reference is a claim that will be rejected downstream.
    const [user] = await db
      .insert(schema.users)
      .values({ email: "attestation-evidence@example.test" })
      .returning();

    const [placement] = await db
      .insert(schema.placements)
      .values({
        userId: user.id,
        jobTitle: "Kitchen helper",
        startedOn: new Date("2026-02-02T00:00:00Z"),
      })
      .returning();

    await expectConstraintViolation(
      db.insert(schema.employmentSpells).values({
        placementId: placement.id,
        periodStart: new Date("2026-02-02T00:00:00Z"),
        weeklyHours: "21.00",
        verificationSource: "provider_attestation",
      }),
      "employment_spells_attestation_needs_preapproval",
    );

    await db.insert(schema.employmentSpells).values({
      placementId: placement.id,
      periodStart: new Date("2026-02-02T00:00:00Z"),
      weeklyHours: "21.00",
      verificationSource: "provider_attestation",
      ssmPreApprovalRef: "SSM-2026-0417",
    });

    const rows = await db
      .select()
      .from(schema.employmentSpells)
      .where(eq(schema.employmentSpells.placementId, placement.id));
    expect(rows).toHaveLength(1);
  });

  it("records a subsidized spell as subsidized, since it earns no outcome", async () => {
    const [user] = await db
      .insert(schema.users)
      .values({ email: "subsidized@example.test" })
      .returning();

    const [placement] = await db
      .insert(schema.placements)
      .values({
        userId: user.id,
        jobTitle: "Shipping assistant",
        startedOn: new Date("2026-03-02T00:00:00Z"),
      })
      .returning();

    await db.insert(schema.employmentSpells).values({
      placementId: placement.id,
      periodStart: new Date("2026-03-02T00:00:00Z"),
      weeklyHours: "30.00",
      subsidized: true,
      verificationSource: "pay_stub",
    });

    const [spell] = await db
      .select()
      .from(schema.employmentSpells)
      .where(eq(schema.employmentSpells.placementId, placement.id));

    expect(spell.subsidized).toBe(true);
    expect(placement.primaryJob).toBe(true);
  });

  it("keeps exit satisfaction on the 1-5 scale, from both sides", async () => {
    const [user] = await db
      .insert(schema.users)
      .values({ email: "satisfaction@example.test" })
      .returning();

    await db.insert(schema.exitSatisfaction).values([
      { userId: user.id, respondent: "client", score: 4 },
      { userId: user.id, respondent: "employer", score: 5, wouldUseAgain: true },
    ]);

    await expectConstraintViolation(
      db.insert(schema.exitSatisfaction).values({
        userId: user.id,
        respondent: "client",
        score: 7,
      }),
      "exit_satisfaction_score_range",
    );
  });
});

describe("demo cohort", () => {
  it("seeds every client exactly once across two seed runs", async () => {
    for (const client of DEMO_COHORT) {
      const rows = await db.select().from(schema.users).where(eq(schema.users.email, client.email));
      expect(rows, `${client.email} should exist exactly once`).toHaveLength(1);
    }
  });

  it("gives every client a placement with an employer and a supported referral", async () => {
    for (const client of DEMO_COHORT) {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, client.email));

      const rows = await db
        .select()
        .from(schema.placements)
        .where(eq(schema.placements.userId, user.id));

      expect(rows, `${client.email} should have one placement`).toHaveLength(1);
      expect(rows[0].employerOrganizationId).not.toBeNull();
      expect(rows[0].referralId).not.toBeNull();
      expect(rows[0].jobTitle).toBe(client.jobTitle);
    }
  });

  it("produces every milestone status the caseload screen can render", async () => {
    const seen = new Set<string>();

    for (const client of DEMO_COHORT) {
      const { placement, spells } = await loadCohortPlacement(client.email);
      for (const checkpoint of placementCheckpoints(placement, spells)) {
        seen.add(checkpoint.status.tag);
      }
    }

    // `needs_preapproval` is absent on purpose: the
    // `employment_spells_attestation_needs_preapproval` constraint makes it
    // unreachable from the database, so it is covered in the engine tests.
    const expected = [
      "claimable",
      "not_due_yet",
      "no_employment",
      "below_threshold",
      "below_minimum_wage",
      "evidence_missing",
      "evidence_unacceptable",
      "subsidized_not_payable",
      "stacking_uncounted",
      "needs_new_employer",
    ];

    expect([...seen].sort()).toEqual([...expected].sort());
  });

  it("records the failed contact attempts, not just the successful ones", async () => {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "farah.nasser@example.invalid"));

    const followUps = await db
      .select()
      .from(schema.outcomeFollowUps)
      .where(eq(schema.outcomeFollowUps.userId, user.id));

    const failed = followUps.filter((row) => row.contactOutcome !== "reached");
    expect(failed).toHaveLength(3);
    expect(failed.map((row) => row.contactOutcome)).toContain("unreachable");
  });

  it("carries an SSM pre-approval reference on the one attestation-evidenced spell", async () => {
    const { spells } = await loadCohortPlacement("grigor.vasilev@example.invalid");
    const attested = spells.filter((s) => s.verificationSource === "provider_attestation");

    expect(attested).toHaveLength(1);
    expect(attested[0].ssmPreApprovalRef).toBe("SSM-HN-2026-0418");
  });

  it("gives the featured client a passport and a share link, so one story spans both views", async () => {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, DEMO_COHORT[0].email));

    const checks = await db
      .select()
      .from(schema.attestations)
      .where(eq(schema.attestations.userId, user.id));
    expect(checks).toHaveLength(6);

    const links = await db
      .select()
      .from(schema.shareLinks)
      .where(eq(schema.shareLinks.userId, user.id));
    expect(links).toHaveLength(2);
    expect(links.map((link) => link.token)).toContain(DEMO_SHARE_TOKEN);

    // The generated token is 24 random bytes rendered as hex.
    const generated = links.find((link) => link.token !== DEMO_SHARE_TOKEN);
    expect(generated?.token).toMatch(/^[0-9a-f]{48}$/);
  });
});
