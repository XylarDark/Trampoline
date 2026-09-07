# Trampoline

A dual-rebuild readiness passport: one staged record of demonstrated readiness for people turning around health and work at the same time.

Trampoline is a **router and a progress record**. Partners perform the checks; we store the attestations, compute the level, apply the gates and expiry, and hand off. We do not deliver care, training, or job inventory, and we do not compete with the services that do.

## Documents

- [`STRATEGY.md`](STRATEGY.md) — product anchor
- [`docs/business-design.md`](docs/business-design.md) — Business Design Document
- [`docs/execution-strategy.md`](docs/execution-strategy.md) — Execution Strategy
- Working copy in Google Docs: [Trampoline](https://docs.google.com/document/d/12s0NPs5q3-KztS-PZRuVCB9UfBer1T4X_GZYNA8ZOCM/edit) (the files above are the source of truth)

## Stack

| Piece | Choice |
| --- | --- |
| App | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui, plain operational styling |
| Database | Postgres (Docker locally) |
| Data access | Drizzle ORM + Drizzle Kit migrations |
| Auth | Auth.js email magic link, roles in our own Postgres |
| Validation | Zod, including stored unlock-rule definitions |
| Tests | Vitest over the rules engine, plus migrations and seed against in-process Postgres (PGlite) |

No LLM, no chatbot clearance, no scraped job inventory.

## Run it locally

Requires Node 22+ and Docker.

```bash
cp .env.example .env.local     # then set AUTH_SECRET: npx auth secret
npm install
npm run db:up                  # Postgres via docker-compose
npm run db:generate            # SQL migrations from src/db/schema.ts
npm run db:migrate
npm run db:seed                # check types, level bundles, mocked Level 2 seat
npm run dev                    # http://localhost:3000
```

Without Docker, point `DATABASE_URL` at any Postgres 15+ instance and skip `db:up`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm test` | Engine rules, plus migrations and seed against PGlite (no Docker needed) |
| `npm run db:up` | Start local Postgres |
| `npm run db:generate` / `db:migrate` / `db:push` | Drizzle Kit |
| `npm run db:seed` | Idempotent seed |

## Layout

```
app/                    routes: overview, intake, track, attestor, share/[token]
src/db/schema.ts        Drizzle schema — all models from the business design
src/db/seed-data.ts     check types, level bundles, restrictions, mocked gate
src/db/seed.ts          idempotent seed script
src/engine/levels.ts    level from current, unrevoked, unexpired attestations
src/engine/decay.ts     currency and expiry
src/engine/rules.ts     unlock evaluation from stored rule data
src/engine/share.ts     the school and employer view
auth.ts                 Auth.js configuration
drizzle/                generated migrations
```

`npm test` applies `drizzle/` and runs the seed against an in-process Postgres, so the schema and seed stay verified on machines without Docker.

## Rules the code has to keep

These come from [`docs/business-design.md`](docs/business-design.md), not from engineering preference:

- **No personal health information.** We store who attested, the verdict, any restriction, and the dates. Never charts, therapy notes, or workout programs.
- **Attestations are append-only.** Revocation is a row in `attestation_events`; the attestation is never edited or deleted.
- **Rules live as data.** Gates are stored `unlock_rules.definition` payloads validated by Zod, so a partner's requirements can change without a deploy.
- **Levels are bundles of passed checks.** They are sequential: a lapsed Level 0 check drops the track.
- **Restrictions route, they do not exclude.** A restriction carries the opportunity tags it is compatible with.
- **The share view carries level, restrictions, and expiry only.**

## Status

Foundation only. The routes are scaffolding with a placeholder passport, and the rules engine is real and tested. The next piece of work is the first vertical slice: one user completes a check, levels up, and unlocks the mocked seat.
