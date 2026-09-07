/**
 * Applies the generated migrations and runs the seed against an in-process
 * Postgres (PGlite), so the schema and the seed are verified without needing a
 * Docker daemon. The same migrations run against the real database.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { beforeAll, describe, expect, it } from "vitest";

import { gateDefinitionSchema } from "@/src/engine/types";

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

  it("only accepts follow-ups at the months funders report on", async () => {
    const [user] = await db
      .insert(schema.users)
      .values({ email: "follow-up-window@example.test" })
      .returning();

    await expectConstraintViolation(
      db.insert(schema.outcomeFollowUps).values({
        userId: user.id,
        monthsAfterExit: 9,
        contactedOn: new Date(),
        contactOutcome: "reached",
      }),
      "outcome_follow_ups_reported_window",
    );

    await db.insert(schema.outcomeFollowUps).values({
      userId: user.id,
      monthsAfterExit: 12,
      contactedOn: new Date(),
      contactOutcome: "reached",
      employed: true,
      weeklyHours: "22.50",
      hourlyWage: "19.00",
    });

    const rows = await db.select().from(schema.outcomeFollowUps);
    expect(rows).toHaveLength(1);
    expect(rows[0].monthsAfterExit).toBe(12);
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
      verificationSource: "employer_confirmation",
      verifiedByOrganizationId: employer.id,
      verifiedAt: new Date("2026-04-06T00:00:00Z"),
    });

    const milestone = {
      userId: user.id,
      placementId: placement.id,
      kind: "weeks_13_cumulative" as const,
      achievedOn: new Date("2026-04-06T00:00:00Z"),
      cumulativeWeeks: "13.00",
      weeklyHoursAtMilestone: "24.00",
      evidenceNote: "Employer confirmation email, 2026-04-06",
    };

    await db.insert(schema.outcomeMilestones).values(milestone);
    await expectConstraintViolation(
      db.insert(schema.outcomeMilestones).values(milestone),
      "outcome_milestones_once_per_placement",
    );
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
