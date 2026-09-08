# Automation gaps

**Purpose:** track things that cannot be set or verified reliably via API, CLI,
or stable automation, so we can prioritise fixes rather than rediscovering the
limit each time.

Procedure: identify → verify access → document here → re-check on upgrade. See
[automation-standards.mdc](../../.cursor/rules/automation-standards.mdc).

Fields: **Date**, **Area**, **What is needed**, **Why automation fails**,
**Interim**, **Follow-up**.

---

## The doctor's stack detector misses `vitest.config.mts`

- **Date:** 2026-09-07
- **Area:** `.devenv/` DevEnvTemplate stack detection
- **What is needed:** the gap report should recognise that this repo has a real
  Vitest suite.
- **Why automation fails:** two independent code paths disagree.
  `stack-detector.ts` line 413 reads `deps.vitest` from `package.json` and
  correctly lists Vitest under `technologies`. Its `detectTesting()` at line
  1130 separately looks for a config file, but the list is
  `['vitest.config.ts', 'vitest.config.js']` — no `.mts`. So
  `tooling.testing.frameworks` stays empty, and `gap-analyzer.ts` reads
  precisely that field via `hasTestingFramework()`. Result: "No JS Unit Tests
  Detected" against 107 passing tests.
- **Interim:** ignore that specific gap. `npm test` is the authority.
- **Follow-up:** add `.mts` and `.mjs` to `vitestConfigs` upstream and sync
  back. Do **not** rename our config to `.ts` to satisfy the detector — the
  `.mts` extension is load-bearing (see [KNOWN_ERRORS.md](../KNOWN_ERRORS.md)).

## Three of the doctor's gaps are unconditional reminders, not checks

- **Date:** 2026-09-07
- **Area:** `.devenv/` DevEnvTemplate gap analysis
- **What is needed:** a gap list that shrinks when we fix the gap.
- **Why automation fails:** these three entries in `gap-analyzer.ts` fire on
  stack detection alone and inspect nothing, so they can never be closed:
  - **"CSP Headers Not Verified"** — emitted whenever Next.js is detected. We
    now set a full CSP and five other security headers in `next.config.ts`, and
    it still reports. The name is honest: *not verified*, not *not present*.
  - **"Accessibility Tooling Not Detected"** — emitted for any React, Next.js,
    or Vue project. We have `eslint-plugin-jsx-a11y` with all 34 recommended
    rules passing, and it still reports.
  - **"Dependency Health Check Needed"** — emitted for any Node project. We have
    `.github/dependabot.yml` and an audit job in CI, and it still reports.
- **Interim:** treat these three as a standing checklist to re-confirm by hand,
  not as open work. Verify with `npm run lint`, the CI config, and a header
  check against a running server, not with the gap count.
- **Follow-up:** make them conditional upstream, or drop them.

## The doctor's health score does not reconcile with its own gap list

- **Date:** 2026-09-07
- **Area:** `.devenv/` DevEnvTemplate health scoring
- **What is needed:** a health score we can track over time.
- **Why automation fails:** the first run scored this repo 100/100 across all
  five categories, including "CI/CD pipeline configured", while the same run
  reported 20 gaps and the repo had no `.github/` directory at all. After we
  added CI, Dependabot, CSP headers, a11y linting and Prettier, the score was
  still exactly 100/100 and the gap count moved 20 → 19. The score is constant,
  so it measures nothing we can act on.
- **Interim:** treat `gaps-report.md` as the useful artifact and disregard the
  headline score. Do not quote the score to anyone.
- **Follow-up:** fix the scorer upstream, or drop the score from our workflow.

## Google Docs cannot be updated through an API we have

- **Date:** 2026-09-07
- **Area:** mirroring `docs/business-design.md` to the shared Google Doc
- **What is needed:** replace the Doc's contents when the markdown changes.
- **Why automation fails:** no Google Docs API credentials are configured, and
  the Docs editing surface is a canvas, so synthetic keyboard events such as
  `Ctrl+A` do not register against it.
- **Interim, for a full re-mirror:** convert the markdown to HTML, serve it from
  a temporary local HTTP server, select all via the Docs **Edit → Select all**
  menu item, and paste through a CDP `DataTransfer`. Slow and manual to
  supervise, and it rewrites the whole document to change one line.
- **Interim, for a targeted edit — prefer this:** drive the Docs UI menus
  instead of the keyboard. Click into the text to place the cursor, then
  right-click for the context menu, whose items *are* exposed to the
  accessibility tree even though the document body is canvas. Deleting one
  table row this way took two clicks and touched nothing else. Menu-driven
  editing is the reliable path; keyboard shortcuts against the canvas are not.
- **Follow-up:** provision Google Docs API credentials, or move the canonical
  business document out of Google Docs entirely.

## Ontario funded-outcome rules cannot be verified from published sources

- **Date:** 2026-09-07
- **Area:** `src/engine/outcomes.ts`
- **What is needed:** confirmation of how concurrent employment spells aggregate
  toward the 20-hour IES threshold.
- **Why automation fails:** this is not a tooling gap. The rule is not published
  in a form we can cite, so no amount of scraping resolves it.
- **Interim:** encoded as the `CUMULATIVE_AGGREGATION` assumption and flagged as
  a risk everywhere it matters.
- **Follow-up:** it is a scripted question in the interview guide
  ([retention-interviews.md](../outreach/retention-interviews.md)). A Service
  System Manager answering it settles the matter.
