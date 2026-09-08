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
| Database | Postgres (Docker locally, or PGlite over TCP via `npm run db:demo`) |
| Data access | Drizzle ORM + Drizzle Kit migrations |
| Auth | Auth.js email magic link, roles in our own Postgres |
| Validation | Zod, including stored gate definitions |
| Tests | Vitest over the routing engine, plus migrations and seed against in-process Postgres (PGlite) |
| Accessibility | WCAG 2.0 Level AA, the standard AODA requires; see [Accessibility](#accessibility) for what is and is not verified |

No LLM, no chatbot clearance, no scraped job inventory.

## Run it locally

Requires Node 22+. Docker is optional: `npm run db:demo` serves PGlite over TCP on the same port and credentials the Compose service uses, so nothing downstream knows the difference.

**To show the provider demo rather than work on it,** run `npm run demo`. It does everything below that is not already done, then opens the provider caseload. `npm run demo:stop` shuts it down. Re-running is safe. It is Windows-only, being a PowerShell script.

```bash
cp .env.example .env.local     # then set AUTH_SECRET: npx auth secret
npm install
npm run db:demo                # PGlite on 127.0.0.1:5432; leave it running
```

Then, in a second terminal:

```bash
npm run db:generate            # SQL migrations from src/db/schema.ts
npm run db:migrate
npm run db:seed                # check types, level bundles, mocked gates
npm run dev                    # http://localhost:3000
```

Anything that connects to the demo database needs both of these:

```
DATABASE_URL=postgres://trampoline:trampoline@127.0.0.1:5432/trampoline
DATABASE_DRIVER=pglite
```

`127.0.0.1` and not `localhost`, because the socket server binds IPv4 only while `localhost` resolves to `::1` first on Windows. `DATABASE_DRIVER=pglite` narrows the postgres-js pool to `max: 1, prepare: false`, which is all the socket server supports — see `src/db/index.ts`. Put both in `.env.local`, which `next dev` and `db:seed` read; `db:migrate` reads only the process environment, so export `DATABASE_URL` in the shell for that step.

For Docker instead, run `npm run db:up` and leave the `.env.example` defaults alone. Or point `DATABASE_URL` at any Postgres 15+ instance and skip both.

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm test` | Engine rules, plus migrations and seed against PGlite (no Docker needed) |
| `npm run typecheck` | `tsc --noEmit`. Run a build first, or the App Router's generated route types are stale |
| `npm run lint` | ESLint, including the 34 recommended `jsx-a11y` rules |
| `npm run format` / `format:check` | Prettier over code. Markdown is excluded on purpose — see `.prettierignore` |
| `npm run check:contrast` | WCAG contrast ratios for the palette — see [Accessibility](#accessibility) |
| `npm run doctor` | Environment health check — see [Development environment](#development-environment) |
| `npm run demo` / `demo:stop` | Start or stop the whole provider demo for an interview, Windows only |
| `npm run db:demo` | PGlite over TCP on 5432, as a stand-in for Postgres |
| `npm run db:up` | Start local Postgres in Docker |
| `npm run db:generate` / `db:migrate` / `db:push` | Drizzle Kit |
| `npm run db:seed` | Idempotent seed |

## Development environment

Tooling comes from [DevEnvTemplate](https://github.com/XylarDark/DevEnvTemplate), embedded as `.devenv/`. That directory is a separate git checkout and is **gitignored**, so a fresh clone has to recreate it:

```bash
git clone https://github.com/XylarDark/DevEnvTemplate .devenv
cd .devenv; npm install; npm run build; cd ..
npm run doctor
```

Everything else it installed **is** committed: `.cursor/rules/` (with a Trampoline-specific `08-project-context.mdc`), `AGENTS.md`, `.editorconfig`, `.gitattributes`, `.prettierrc`, `.nvmrc`, and `.github/`. You only need `.devenv/` to re-run the doctor.

**Read the doctor's gap report, not its score.** It reported 100/100 before this repo had any CI at all, and stayed at exactly 100/100 after CI, Dependabot, CSP headers, a11y linting and Prettier were added. Three of its gaps also fire unconditionally and can never be closed, and it reports "No JS Unit Tests Detected" against 107 passing tests because it looks for `vitest.config.ts` and ours is `.mts`. All of this is written up in [docs/operational/automation-gaps.md](docs/operational/automation-gaps.md) so nobody chases it twice.

CI runs lint, format, build, typecheck, the tests, and the contrast check on every push and PR to `main`. `next.config.ts` sets a CSP and five other security headers; the `'unsafe-inline'` needed for App Router hydration weakens it, and the comment there records the upgrade path.

Two other files carry hard-won context: [docs/KNOWN_ERRORS.md](docs/KNOWN_ERRORS.md) for failures that already cost us time, and [docs/DOCS_LAYOUT.md](docs/DOCS_LAYOUT.md) for where new documentation belongs.

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

## Accessibility

axe-core reports **zero violations at WCAG 2.0 A/AA** (the `wcag2a` and `wcag2aa` tags, nothing wider) on all six routes: `/`, `/provider`, `/provider/<placementId>`, `/provider/<placementId>/evidence-pack`, `/track`, and `/share/<token>`. That is a narrower result than it sounds, because the harness parses server-rendered HTML in jsdom, which does no layout and never applies the Tailwind stylesheet. The following are open, not closed:

- **axe did not evaluate colour contrast.** Its `color-contrast` rule returned `incomplete` on every route — with no layout there is nothing to measure. Contrast is instead computed arithmetically from the tokens in `app/globals.css` by `npm run check:contrast`, which exits non-zero on a shortfall. That check found two real failures, since fixed: the `destructive` badge variant at 3.99:1, and `text-muted-foreground` on a full `bg-muted` at 4.34:1. All badge text is 12px, so the 4.5:1 normal-text threshold applies to every variant and none earns the 3:1 large-text exemption.
- **Print output has never been previewed.** The `@media print` rules were read in source and in compiled CSS. Nobody has pressed Ctrl+P on an evidence pack and looked at the result, which is the only way to catch a page break through a table.
- **No real browser was used.** Everything that depends on layout is unverified: rendered colour, `:focus-visible` indicators, target sizes, reflow at narrow widths, and actual hover and focus states.
- **Nothing was hydrated.** axe saw static markup only, so no client-side state — an open tooltip, a focused control, keyboard traversal — has been tested.

## Status

Read-only, and honest about which half is real.

**Real.** The engines are the asset: `decay`, `levels`, `rules`, `routing`, `share`, and `outcomes`, under 107 tests. `outcomes.ts` derives Ontario IES funded-outcome milestones from fragmentary employment spells and names why each checkpoint is or is not claimable. Evidence is attributed per employment period, so a document proves the period it covers and no other and the hours shown as worked can exceed the hours shown as evidenced — the earlier implementation let an eight-hour employer letter certify twenty-four hours of self-reported work, which would have produced an unsupportable funder claim. The three provider routes and the person-facing track and share routes read from Postgres through `src/db/queries.ts`, against a seeded cohort of 12 clients engineered so every reachable milestone verdict appears at least once, failures included.

**Not real yet.** There are no writes anywhere and no sign-in: `auth.ts` is configured but never called, and the forms in `/intake`, `/attestor`, and `/accommodation` are disabled markup. Writing to this record needs authentication and organization scoping first, so a read-only demo is the deliberate stopping point rather than an unfinished one.

Accessibility status, including the four gaps above, is in [Accessibility](#accessibility).

**This build is a prop for the provider interviews, not a bet placed ahead of them.** Showing a provider a milestone table and asking "is this what you do?" beats asking them to describe it. But the interviews are the kill test and they have not run, so if the answers contradict the milestone model then `outcomes.ts` changes — which is why it is pure, table-driven, and free of database imports. The open questions that would change it are recorded in [docs/outreach/ontario-outcome-framework.md](docs/outreach/ontario-outcome-framework.md); the one assumption with no public source, how cumulative hours aggregate across non-consecutive weeks, is a single named constant in `outcomes.ts` and is surfaced in the UI as an assumption rather than as fact.
