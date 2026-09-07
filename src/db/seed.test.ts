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

import { unlockRuleDefinitionSchema } from "@/src/engine/types";

import * as schema from "./schema";
import { CHECK_TYPES, LEVEL_BUNDLES, OPPORTUNITIES, RESTRICTIONS } from "./seed-data";
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

  it("stores the gate as data the engine can parse", async () => {
    const [rule] = await db.select().from(schema.unlockRules);
    const parsed = unlockRuleDefinitionSchema.parse(rule.definition);
    expect(parsed.requiredLevel).toBe(2);
    expect(parsed.attendanceDays).toBe(14);
  });

  it("attaches the mocked seat to the employer organization", async () => {
    const rows = await db.select().from(schema.opportunities);
    expect(rows).toHaveLength(OPPORTUNITIES.length);
    expect(rows[0].targetLevel).toBe(2);

    const [employer] = await db.select().from(schema.organizations);
    expect(employer).toBeDefined();
  });
});
