<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trampoline — agent notes

One employment record that follows a person between services. The working wedge
is **outcome evidence**: deriving Ontario IES funded-outcome milestones from
fragmentary employment spells, and showing a provider which checkpoints they
have earned but cannot prove.

Trampoline is **not** a readiness certifier. Nothing here gates a person's access
to work on a score, a level, or a health fact.

## Stack

Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 + shadcn,
Drizzle ORM on Postgres, Auth.js email magic link, Zod, Vitest.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Tests | `npm test` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Format | `npm run format` / `npm run format:check` |
| Contrast check | `npm run check:contrast` |
| Run the whole demo for an interview | `npm run demo` / `npm run demo:stop` |
| Local database, no Docker | `npm run db:demo` |
| Local database, Docker | `npm run db:up` |
| Environment health check | `npm run doctor` |

PowerShell is the shell here. Chain with `;`, not `&&`.

## Things that are easy to get wrong

- **Hours worked and hours provable are different numbers.** A `claimable`
  verdict reports hours worked; `provableHours` is what the documents cover.
- **A document evidences the employment period it covers, and no other.**
- **Attestations are append-only.** Never update or delete one.
- **`CUMULATIVE_AGGREGATION` is an unverified assumption**, not a sourced rule.
- **`src/engine/` is pure.** No database or network access there.
- **The 12-client demo cohort is synthetic.** Never call it pilot data.
- **Commit docs separately from code.** `docs/funding/sred-log.md` is a
  contemporaneous record and its value depends on provable dates.

## Where things live

- `.cursor/rules/08-project-context.mdc` — the long form of the above
- `docs/DOCS_LAYOUT.md` — where new docs belong
- `docs/KNOWN_ERRORS.md` — recurring errors and their fixes
- `docs/operational/automation-gaps.md` — what could not be automated
- `.devenv/` — embedded [DevEnvTemplate](https://github.com/XylarDark/DevEnvTemplate)
  doctor, gitignored. Run `npm run doctor` from the repo root.
