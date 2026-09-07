# SR&ED contemporaneous documentation log

**Purpose.** CRA expects evidence created *as the work happened*, not reconstructed at filing time. Reconstruction is one of the most common reasons software claims are reduced or denied. This file is the primary record; it is committed to git, so every entry carries a tamper-evident timestamp and a diff.

**Company:** Trampoline (working name). Ontario CCPC.
**Fiscal year:** to be set on incorporation.
**Log opened:** 2026-09-07.

## How to keep this log

One entry per work session on anything that might be eligible. Write it the same day. An entry is worth keeping only if it answers all five of these:

1. **What were we trying to achieve?** A technological objective, not a business one. "Let providers report retention" is a business objective. "Determine whether conflicting attestations from independent attestors can be reconciled deterministically without a central authority" is a technological one.
2. **What was uncertain?** Specifically: why couldn't this be resolved by someone competent in the field applying known practice? If the answer is "we just hadn't looked it up yet," it is not uncertainty and does not belong in a claim.
3. **What did we try?** The hypothesis, the experiment, the iteration. Include the approaches that failed — failed attempts are the strongest evidence of systematic investigation, and claims are weakened by logs that only record successes.
4. **What did we learn?** The advancement, even if the advancement is "this approach cannot work because X."
5. **Who, how long, and what does it point to?** Person, hours, and the commit SHAs or files, so the claim ties to artifacts.

Also record the routine work, in the excluded section. A log that claims everything is less credible than one that draws the line itself, and the exclusions are what an auditor checks first.

## Standing assessment of where uncertainty plausibly lives

Written up front so entries can be honest rather than opportunistic. To be reviewed with a specialist before any claim is filed.

| Area | Plausibly eligible | Reasoning |
| --- | --- | --- |
| Multi-attester expiry and restriction reconciliation | Likely | Independent organizations issue overlapping, contradictory, and separately-expiring assertions about the same person with no central authority and no shared clock. Determining whether a deterministic, explainable resolution exists — and what it must give up — is not answerable from known practice. |
| Gate evaluation under conflicting and partially-visible evidence | Possibly | A gate must return an explainable verdict while being structurally denied access to part of the record. Whether explainability survives mandatory partial blindness is a real question. |
| Outcome milestone derivation from fragmentary employment spells | Possibly | Cumulative-week milestones over interrupted spells with mixed-quality verification, reproducible after retroactive correction. Bitemporal data is well-studied, so the uncertainty may be lower than it looks. |
| Next.js app, routes, forms, styling | No | Routine application of known practice. |
| Drizzle schema, migrations, Auth.js integration | No | Standard configuration of existing tools. |
| Accessibility conformance work | No | Applying a published standard. |

## Entries

### 2026-09-07 — Structural enforcement of a legal constraint in the type system and the database

**Objective.** Determine whether a legal prohibition — an employment gate may not consider health-derived data — can be made *structurally unexpressible* rather than merely checked, such that no application-layer defect can produce a prohibited evaluation.

**Uncertainty.** Low to none, in candour. This is systems design applying known technique: a discriminated union, strict schema parsing, and a database check constraint. The interesting part was the discovery below, but discovery is not the same as technological uncertainty.

**What was tried.** Three layers, each chosen after rejecting a weaker option:

1. View-layer filtering — rejected. One refactor away from leaking, and the leak would be silent.
2. A single validated schema with a `kind` field — rejected. Optional fields on a shared type stay reachable in code.
3. A discriminated union where `EmploymentGate` has no field capable of expressing a health requirement, plus a Postgres check constraint refusing the row, plus a runtime assertion that throws when a gate names a health-domain check type.

**What was learned.** One finding worth recording, because it changed the design: Zod's default object behaviour *strips* unknown keys rather than rejecting them. A stored gate definition carrying `requiredLevel` therefore parsed successfully with the field silently discarded, which is exactly the failure mode this work exists to prevent — the gate would have behaved differently than its author wrote it, with nothing surfacing. Resolved with `.strict()` on both gate schemas. Two tests now cover it.

Also learned that throwing is the correct response to a misconfigured employment gate, rather than returning a closed verdict. A closed verdict is indistinguishable from a legitimate denial and would quietly cost someone a job; an exception surfaces the defect.

**Eligibility assessment:** **Not claimable.** Routine engineering, recorded here for completeness and because the exclusions matter to the log's credibility.

**Artifacts.** `src/engine/types.ts`, `src/engine/rules.ts`, `src/db/schema.ts` (`gates_employment_is_skills_only`), `src/engine/engine.test.ts`, `src/db/seed.test.ts`. Commit: `b60d986`.

**Hours.** To be recorded per person once the team exists.

---

### Template for the next entry

```
### YYYY-MM-DD — Short title

**Objective.** Technological, not commercial.

**Uncertainty.** Why known practice does not resolve this.

**What was tried.** Hypothesis, experiments, and the approaches that failed.

**What was learned.** The advancement, including negative results.

**Eligibility assessment.** Claimable / not claimable / needs specialist review, with reasoning.

**Artifacts.** Files and commit SHAs.

**Hours.** Person and hours.
```

## Excluded as routine (running list)

Kept deliberately. An auditor asks what you left out.

- Next.js scaffold, routing, layout, Tailwind styling, and all page markup.
- Drizzle schema definition, migration generation, and Auth.js email magic-link setup.
- Vitest and PGlite test harness configuration.
- WCAG 2.0 AA conformance work and the axe-core verification.
- Seed data and demo fixtures.
- All documentation, strategy, and research writing.

## Open questions for a specialist

1. Does multi-attester reconciliation meet the uncertainty test on its own, or only once we have documented failed approaches? (Current view: we need the failed approaches first, which means the log matters more than the argument.)
2. Are the salaries of a founder-operator doing eligible work claimable in a pre-revenue CCPC with no payroll yet, and what has to be in place *before* the work to make them claimable later?
3. Confirm the current expenditure limit, refundable rate, capital-expenditure eligibility date, and cloud-cost treatment against the CRA source before relying on any figure. See [`irap-and-tpon.md`](irap-and-tpon.md) for the verified figures once confirmed.

## Related

- [`irap-and-tpon.md`](irap-and-tpon.md) — IRAP advisor request and TPON registration
- [`../execution-strategy.md`](../execution-strategy.md) — capital section
- [`../research/funding-landscape.md`](../research/funding-landscape.md) — the underlying funding research
