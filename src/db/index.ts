import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/** Same default as drizzle.config.ts, so a local Docker Postgres works unconfigured. */
const LOCAL_DEFAULT = "postgres://trampoline:trampoline@localhost:5432/trampoline";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set; falling back to the local Docker Postgres URL.");
}

const connectionString = process.env.DATABASE_URL ?? LOCAL_DEFAULT;

// postgres-js connects lazily, and Next.js dev reloads would otherwise open a
// new pool on every recompile.
const globalForDb = globalThis as unknown as { trampolineSql?: ReturnType<typeof postgres> };

const sql = globalForDb.trampolineSql ?? postgres(connectionString, { max: 5 });
if (process.env.NODE_ENV !== "production") globalForDb.trampolineSql = sql;

export const db = drizzle(sql, { schema });
export { schema };
