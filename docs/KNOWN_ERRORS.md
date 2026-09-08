# Known errors and fixes

**Purpose:** one place to record recurring or expensive mistakes so we do not
pay for them twice. Append new entries; do not delete history. If an entry stops
applying, add an "addressed" note rather than removing it.

**When to add an entry:** after you debug a non-obvious failure and have a
verified fix.

Fields: **Symptom** (what failed), **Cause** (root cause), **Fix** (exact
change), **Prevention** (test, rule, or doc that stops a recurrence).

---

## Tooling and environment

### Zod silently strips unknown keys, so bad rule payloads pass validation

- **Symptom:** tests asserting that a malformed employment gate `toThrow` failed,
  because validation accepted the payload instead of rejecting it.
- **Cause:** Zod object schemas strip unknown keys by default. A typo in a rule
  key was quietly dropped rather than surfacing as an error.
- **Fix:** added `.strict()` to `employmentGateSchema` and `trainingGateSchema`
  in `src/engine/types.ts`.
- **Prevention:** any schema validating an authored rule payload must be
  `.strict()`. Silent acceptance of a typo'd gate is a correctness risk, not a
  convenience.

### Drizzle hides database constraint errors inside `error.cause`

- **Symptom:** tests asserting a check-constraint violation could not match the
  error message; the thrown error's own message was generic.
- **Cause:** Drizzle wraps the driver error, nesting the real Postgres error one
  or more levels down the `cause` chain.
- **Fix:** `expectConstraintViolation` in `src/db/seed.test.ts` walks the whole
  `cause` chain before asserting.
- **Prevention:** never assert on `error.message` alone for database errors.

### `vitest.config.ts` fails to parse

- **Symptom:** Vitest reported an ESM syntax error reading its own config.
- **Cause:** the config uses ESM syntax but the `.ts` extension resolved to CJS
  under this project's module settings.
- **Fix:** renamed to `vitest.config.mts`.
- **Prevention:** keep the `.mts` extension. See the related detector gap in
  [operational/automation-gaps.md](operational/automation-gaps.md).

### `tsc --noEmit` reports type errors on App Router route files

- **Symptom:** typecheck fails on `app/**/page.tsx` params or search-params
  types, with no obvious error in the source.
- **Cause:** Next.js generates route types into `.next/types`. They are stale or
  absent until a build runs.
- **Fix:** run `npx next build` once, then re-run the typecheck.
- **Prevention:** in CI, build before typechecking, or accept that a clean
  checkout needs one build first.

### PGlite socket server drops connections with `ECONNRESET`

- **Symptom:** `npm run db:seed` against `npm run db:demo` failed partway with
  `ECONNRESET`, sometimes taking the server process down.
- **Cause:** several defects at once. PGlite serves one query at a time and does
  not support prepared statements; the socket server leaked connection slots;
  and inbound sockets had no `error` listener, so a client disconnect became an
  unhandled exception.
- **Fix:** in `scripts/demo-db.ts`, set `maxConnections: 10`, added a 2-second
  reaper for leaked slots, attached an `error` listener to every inbound socket,
  and added an `uncaughtException` backstop scoped to `ECONNRESET`, `EPIPE`, and
  `ECONNABORTED` only. In `src/db/index.ts`, set `max: 1, prepare: false` when
  `DATABASE_DRIVER=pglite`.
- **Prevention:** the backstop is deliberately narrow. Do not widen it to catch
  all exceptions — that would hide real bugs.

### `db:demo` refuses connections when `DATABASE_URL` says `localhost`

- **Symptom:** `npm run db:demo` reports the server is listening, but
  `db:migrate`, `db:seed`, and the app all fail to connect. It reads as though
  the database never started.
- **Cause:** the PGlite socket server binds IPv4 only. On Windows, `localhost`
  resolves to `::1` before `127.0.0.1`, so the client dials an address nothing
  is listening on. `.env.example` ships the Docker default, which uses
  `localhost` and is correct for Docker.
- **Fix:** use `127.0.0.1` in `DATABASE_URL` whenever the database is `db:demo`,
  and set `DATABASE_DRIVER=pglite`. `.env.example` now carries this warning.
- **Prevention:** this is the most likely thing to break a demo run shortly
  before a provider interview, so the runbook in
  [business-design.md](business-design.md) calls it out and says to rehearse a
  day ahead.

### A check script reported failures but exited 0

- **Symptom:** `scripts/contrast-check.mjs` printed contrast failures while the
  command still succeeded, so CI would have passed a broken theme.
- **Cause:** the script never set a non-zero exit code.
- **Fix:** added `process.exit(failures > 0 ? 1 : 0)`.
- **Prevention:** every script wired into `package.json` as a check must exit
  non-zero on failure. Verify by deliberately breaking it once.

### `.env.example` was never committed

- **Symptom:** the file existed locally but was absent from the repo, so a fresh
  clone had no environment template.
- **Cause:** `.gitignore` contained `.env*`, which matches `.env.example` too.
- **Fix:** added a `!.env.example` negation in `.gitignore` and committed the
  file.
- **Prevention:** after adding any `.env*` ignore pattern, run
  `git check-ignore -v .env.example` to confirm the template still tracks.

### A blank `AUTH_EMAIL_SERVER` broke the build, and CI could not see it

- **Symptom:** `npm run build` failed collecting page data for
  `/api/auth/[...nextauth]`, with "Nodemailer requires a `server`
  configuration". CI built the same commit successfully.
- **Cause:** `auth.ts` read `process.env.AUTH_EMAIL_SERVER ?? { jsonTransport:
  true }`. `.env.example` ships that variable blank and instructs you to leave it
  blank, but a blank variable is an empty string, and `??` only falls back on
  `null` or `undefined`. So the documented local setup was the one that broke.
  CI has no `.env.local`, so there the variable really was `undefined` and the
  fallback applied — the bug could only reproduce where an env file existed.
- **Fix:** `||` instead of `??` for both Nodemailer options in `auth.ts`.
- **Prevention:** use `||` for any optional environment variable; `??` is only
  correct when a blank value is meaningfully different from an absent one. More
  generally, a green CI run is not evidence that the app builds for a developer:
  CI runs without the env file that developers are told to create.

---

## PowerShell

This repo is developed on Windows PowerShell. These bite repeatedly.

### Heredoc syntax silently fails

- **Symptom:** `git commit -F - <<'MSG'` does not produce the intended message.
- **Cause:** PowerShell has no POSIX heredoc.
- **Fix:** write the message to a temp file and use `git commit -F <file>`.

### Braces in git revision syntax get mangled

- **Symptom:** `git rev-parse --abbrev-ref main@{upstream}` fails.
- **Cause:** PowerShell interprets `{...}` before git sees it.
- **Fix:** avoid brace revision syntax. Compare explicitly:
  `git fetch -q origin; git rev-parse HEAD origin/main`.

### Command chaining

- Use `;`, not `&&`. `&&` is not a valid statement separator in the PowerShell
  versions in use here.

---

## Product correctness

### One spell's document certified another spell's hours

- **Symptom:** the milestone engine returned `claimable` for a client whose
  qualifying hours were mostly unevidenced, because a small well-documented job
  sat alongside a large undocumented one.
- **Cause:** `milestoneStatus` summed hours across all covering spells, then
  picked the single best-evidenced spell to report. Admissibility and hours were
  computed independently.
- **Fix:** per-spell attribution. `provableHours` sums only spells whose evidence
  is acceptable; `blockingEvidence` names the blocker in front of the most
  unprovable hours. A database check constraint backs this up.
- **Prevention:** design rule **R9 — a document evidences the employment period
  it covers, and no other.** This is recorded in
  [business-design.md](business-design.md) and
  `.cursor/rules/08-project-context.mdc`. A wrong `claimable` verdict is a
  liability, not a cosmetic bug.

---

## Related

- [operational/automation-gaps.md](operational/automation-gaps.md) — what
  automation cannot do yet
- `.cursor/rules/05-error-handling.mdc` — defensive coding and where to record
  errors
