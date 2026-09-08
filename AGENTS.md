<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trampoline — agent instructions

One employment record that follows a person between services. The working wedge is **outcome
evidence**: deriving Ontario Integrated Employment Services (IES) funded-outcome milestones from
fragmentary employment spells, and showing a provider which checkpoints they have earned but
cannot prove.

Trampoline is **not** a readiness certifier. Nothing here gates a person's access to work on a
score, a level, or a health fact.

This file is the canonical, always-loaded context. Everything else loads on demand:

- **`.cursor/rules/*.mdc`** — glob-scoped only. They load when you open a matching file
  (TypeScript, markdown, JSON/YAML, shell, frontend frameworks).
- **`.agents/skills/<name>/SKILL.md`** — procedural knowledge. Each stays dormant until its
  `description` matches your task. Read one when its trigger applies.
- **`docs/`** — reference material. Start at `docs/DOCS_LAYOUT.md` for where things belong.

Do not add always-applied rules. Context loaded on every turn measurably degrades accuracy, so the
budget for this file is roughly 200 lines and the always-apply rule count is zero.

**A skill's `description` is always-loaded too.** Only the body is deferred; every description is
read each turn to decide relevance. Ten skills currently cost about 600 tokens per turn on top of
this file's ~1,900, so the always-on budget is roughly 2,500 tokens in total. Adding a skill is a
permanent charge against it. Before adding one, prefer extending an existing skill, and keep the
`description` to a single sentence naming the trigger.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict.
- Tailwind v4 + shadcn primitives in `components/ui/`.
- Drizzle ORM against Postgres; migrations in `drizzle/`.
- Auth.js email magic link with the Drizzle adapter.
- Zod for rule payloads and share-token claims.
- Vitest for the engine and the seed.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Tests | `npm test` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Format | `npm run format` / `npm run format:check` |
| Contrast check | `npm run check:contrast` |
| Everything, with evidence | `npm run verify` |
| Run the whole demo for an interview | `npm run demo` / `npm run demo:stop` |
| Local database, no Docker | `npm run db:demo` |
| Local database, Docker | `npm run db:up` |
| Repository health check | `npm run doctor` |

**Pass script flags after `--`.** `npm run doctor -- --fix` forwards the flag to the doctor;
`npm run doctor --fix` gives it to npm instead, which silently ignores it.

## Layout

- `src/engine/` — pure functions, no I/O. `outcomes.ts` (IES milestones), `levels.ts`, `rules.ts`,
  `decay.ts`, `routing.ts`, `share.ts`, `types.ts`.
- `src/db/` — schema, queries, seed, and the 12-client demo cohort.
- `app/` — App Router routes. `app/provider/` is the built surface.
- `components/` — shared UI over shadcn primitives.
- `docs/` — see `docs/DOCS_LAYOUT.md`.
- `.devenv/` — embedded [DevEnvTemplate](https://github.com/XylarDark/DevEnvTemplate) doctor,
  gitignored. Run `npm run doctor` from the repo root.

## Rules that are load-bearing

These encode decisions that cost real research. Do not relax them casually.

- **A document evidences the employment period it covers, and no other.** One spell's evidence may
  never certify another spell's hours. Enforced in `provableHours` and by a database check
  constraint (design rule R9).
- **Hours worked and hours provable are different numbers.** A `claimable` verdict reports hours
  worked; `provableHours` is what the documents cover. Never collapse the two.
- **Attestations are append-only.** Never update or delete an attestation row.
- **`CUMULATIVE_AGGREGATION` is an assumption, not a sourced rule.** It sums concurrent spells at a
  point in time, is unverified with the ministry, and is flagged as a risk. Do not build on it as
  if it were settled.
- **`src/engine/` stays pure.** No database or network access there. It is tested as pure functions
  and must remain so.
- **The 12-client demo cohort is synthetic.** `src/db/demo-cohort.ts` holds fabricated clients.
  Never describe it as pilot data, in code, docs, or outreach.

## Legal and accessibility constraints

- **PHIPA / PIPEDA / Ontario Human Rights Code.** Health facts must not reach an employer surface.
  Employer-facing disclosure is governed by share links only.
- **AODA / WCAG 2.0 AA.** UI changes must keep contrast passing. Run `npm run check:contrast` after
  touching `app/globals.css` or a variant.

## SR&ED contemporaneity

`docs/funding/sred-log.md` is a contemporaneous record. Commit **documentation separately from the
code it describes**, and commit the log entry before or alongside the work, never long after. The
log's value depends on provable dates.

## Working agreements

**Verify, don't assume.** Read a file before editing it. Run the type checker, tests, and linter
before claiming work is done — `npm run verify` runs them in order and reports evidence for each.
When you assert something about the repo, base it on file contents.

**Finish what you start.** No `TODO` without an issue reference, no placeholder implementations, no
committing a known-broken state. If you must defer, say so explicitly and explain why.

**Be idempotent.** Any script that creates a file or resource must check first, reuse or skip if it
already exists, and log which it did. Re-running must not duplicate or destroy.

**Clean up.** Delete one-off diagnostic scripts and scratch files before reporting a task complete.

**Record failures.** When a build, test, or lint step fails, note the cause and the fix in
`docs/KNOWN_ERRORS.md`. Check it before making similar changes. If the cause is a tool that cannot
be scripted, record it in `docs/operational/automation-gaps.md` instead.

**Plan multi-file work.** For changes spanning several modules, or that touch architecture or public
APIs, propose a short plan before editing. See the `plan-first` skill.

## Conventions

- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`,
  `style`, `ci`). Imperative mood, first line under 72 characters, no emoji.
- **Keep `app/page.tsx` free of readiness-certifier language.**
- **Docs:** place new documents per `docs/DOCS_LAYOUT.md`.

## Security baseline

- Never commit secrets. `.env` and `.env.*` are gitignored; `.env.example` carries placeholders
  only. `.env.local` holds real local values and must stay out of commits.
- Validate anything crossing a trust boundary. Drizzle parameterizes queries — keep it that way.
- Never log credentials, tokens, or personal data. Health facts are personal data here.
- Treat changes to MCP configuration as production changes: review the server command and args, not
  just the name. Reference credentials as `${env:NAME}`; never inline them. Start from
  `.cursor/mcp.json.example` and read `docs/guides/mcp-hygiene.md`.

## Windows and PowerShell

PowerShell is the shell here.

- Chain commands with `;`, never `&&`.
- Build paths with `path.join`; never hardcode separators.
- Check a path exists before navigating to it.
- Keep commit messages ASCII. Non-ASCII text elsewhere must be valid UTF-8.
