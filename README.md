# Trampoline

One durable record of demonstrated progress for people turning around health and work at the same time, plus the routing and outcome evidence that record makes possible.

Trampoline is a **router and an evidence record**. Partners perform the checks; we store the attestations, route people to the support a check implies, and carry the evidence a funder settles on. We do not deliver care, training, or job inventory, and we do not compete with the services that do.

**Nothing about a person's health decides whether they can work.** A check that lapses or comes back restricted triggers support; it never withholds access. That constraint is enforced by types and database constraints rather than by convention — see "Rules the code has to keep" below.

## Documents

- [`STRATEGY.md`](STRATEGY.md) — product anchor
- [`docs/business-design.md`](docs/business-design.md) — Business Design Document, including the non-negotiable design rules
- [`docs/execution-strategy.md`](docs/execution-strategy.md) — beachhead, outreach order, capital, and the pilot
- [`docs/research/`](docs/research/) — the four research streams behind the current design
- [`docs/outreach/`](docs/outreach/) — interview guides, contact sheets, and trackers
- [`docs/funding/`](docs/funding/) — SR&ED log, IRAP and TPON steps, and partner-held grant materials
- Working copy in Google Docs: [Trampoline](https://docs.google.com/document/d/12s0NPs5q3-KztS-PZRuVCB9UfBer1T4X_GZYNA8ZOCM/edit) (the files above are the source of truth)

## Stack

| Piece | Choice |
| --- | --- |
| App | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui, plain operational styling |
| Database | Postgres (Docker locally) |
| Data access | Drizzle ORM + Drizzle Kit migrations |
| Auth | Auth.js email magic link, roles in our own Postgres |
| Validation | Zod, including stored gate definitions |
| Tests | Vitest over the routing engine, plus migrations and seed against in-process Postgres (PGlite) |
| Accessibility | WCAG 2.0 Level AA, the standard AODA requires; verified with axe-core |

No LLM, no chatbot clearance, no scraped job inventory.

## Run it locally

Requires Node 22+ and Docker.

```bash
cp .env.example .env.local     # then set AUTH_SECRET: npx auth secret
npm install
npm run db:up                  # Postgres via docker-compose
npm run db:generate            # SQL migrations from src/db/schema.ts
npm run db:migrate
npm run db:seed                # check types, level bundles, mocked gates
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
app/                    routes: overview, intake, track, attestor,
                        share/[token], accommodation, access-log
src/db/schema.ts        Drizzle schema, including the gate check constraints
src/db/seed-data.ts     check types, level bundles, restrictions, mocked gates
src/db/seed.ts          idempotent seed script
src/engine/decay.ts     currency and expiry
src/engine/levels.ts    level from current, unrevoked, unexpired attestations
src/engine/rules.ts     employment and training gate evaluation
src/engine/routing.ts   what a lapsed or restricted check triggers
src/engine/share.ts     the three views: skills, functional abilities, personal
auth.ts                 Auth.js configuration
drizzle/                generated migrations
```

`npm test` applies `drizzle/` and runs the seed against an in-process Postgres, so the schema and seed stay verified on machines without Docker.

## Rules the code has to keep

These come from Ontario law and from the evidence base by way of [`docs/business-design.md`](docs/business-design.md) section 3, not from engineering preference. Each has an enforcement point, because a rule a future change can quietly undo is not a rule.

| Rule | Enforced by |
| --- | --- |
| No health-derived requirement on the hiring path | `EmploymentGate` has no field for one; the Zod schema is strict; the `gates_employment_is_skills_only` check constraint rejects the row; `evaluateEmploymentGate` throws on a health-domain check type |
| Mental health never reaches an employer surface | `EMPLOYER_FORBIDDEN_DOMAINS`, asserted in `src/engine/share.ts`, which throws rather than redacts |
| Expiry triggers support, never restricts work | No column exists to pause access; `healthRenewalDue` is a private nudge |
| No pass or fail on an employer surface | The employer view types have no verdict and no level field |
| A training gate may use health data only with a written rationale | `trainingGateSchema.superRefine` plus `gates_health_derived_training_needs_rationale` |
| No personal health information stored | We store who attested, the verdict, any restriction, and the dates. Never charts, therapy notes, or workout programs |
| Attestations are append-only | Revocation is a row in `attestation_events`; the attestation is never edited or deleted |
| Gates live as data | Stored `gates.definition` payloads validated by Zod, so a partner's requirements change without a deploy |
| Restrictions route, they do not exclude | A restriction carries the tags of work it suits |
| Consent is per recipient, scoped, revocable, and logged | `share_links` with a named recipient plus `share_access_log`, surfaced at `/access-log` |
| Accommodation is reachable from any gate | `/accommodation`, linked from every gate that can turn someone away (AODA IASR s. 23) |

## Status

Foundation only. The routes are scaffolding over a placeholder record; the routing engine is real and tested (48 tests), and all pages pass axe-core WCAG 2.0 A/AA with zero violations.

The next piece of work is the first vertical slice: one person completes a check, opens a mocked seat, and the placement is recorded as funder-reportable evidence.
