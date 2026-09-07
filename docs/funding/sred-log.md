# SR&ED contemporaneous documentation log

**Purpose.** CRA expects evidence created *as the work happened*, not reconstructed at filing time. Reconstruction is one of the most common reasons software claims are reduced or denied. This file is the primary record; it is committed to git, so every entry carries a tamper-evident timestamp and a diff.

**Company:** Trampoline (working name). Ontario CCPC.
**Fiscal year:** to be set on incorporation.
**Log opened:** 2026-09-07.

## The test this log has to satisfy

CRA applies **two requirements**, both mandatory, under guidelines dated 2021-08-13 that replaced the older five-question policy:

- **Why** — the work must seek an advancement in *conceptual* knowledge, where it is unknown whether a result can be achieved because available knowledge is insufficient. Available means ours *plus* what is publicly reasonably available. **Routing around the uncertainty with known technique disqualifies the work.** Success is irrelevant.
- **How** — a systematic investigation by experiment or analysis. CRA is explicit that **working systematically is not the same as a systematic investigation**: it requires a hypothesis, a test, logical conclusions, and evidence kept as the work progresses.

The five-question framework is not dead. **The Tax Court still applies the *Northwest Hydraulic* questions**, including in a 2026 software case, so a defensible file satisfies both formulations. Full detail and citations in [`verified-facts.md`](verified-facts.md).

### The framing to use: system uncertainty

CRA recognizes **"system uncertainty"** — uncertainty arising "from or during the integration of technologies, the components of which are generally well known… due to unpredictable interactions between the individual components or sub-systems."

**Frame every entry this way where it honestly applies.** Our components are individually unremarkable: expiry dates, attestations, restriction codes. The uncertainty is in their interaction — whether independent organizations' contradictory, separately-expiring assertions about one person resolve deterministically with no central authority and no shared clock.

### The exclusion that could void the whole claim

**Research in the social sciences or humanities is statutorily excluded.** So is routine data collection, and market research.

We are an employment-services company, which puts us permanently one careless sentence away from writing ourselves out of eligibility. **Every entry must state a technology question, never a labour-market one.**

| Never write this | Write this instead |
| --- | --- |
| Can restriction data predict work-disability duration? | Can contradictory multi-attester assertions be reconciled deterministically? |
| Do accommodations improve retention? | Can a gate return an explainable verdict while structurally denied part of the record? |
| Which milestone framework do providers need? | Can milestones be derived reproducibly from fragmentary spells after retroactive correction? |

The left column is our research agenda and it is genuinely valuable — it belongs in the [WSIB proposal](wsib-collaborator.md), which welcomes exactly that kind of question. It must never appear in this log or on a T661.

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

### 2026-09-07 — State of the art at project onset

**Why this entry exists.** T661 line 242 asks for the **existing knowledge base at the onset of the project and its shortcomings**. Case law shows that failing to lead evidence on the state of the art is fatal, that uncertainty is judged **objectively** against what a competent professional would know rather than what our team happened not to know, and that **the onus is on the taxpayer**. This record has to be made now, dated, before the work — not reconstructed later when its date is worth nothing.

**Known and publicly available as of today**, which we therefore cannot claim as advancement:

- Bitemporal and valid-time data modelling, including retroactive correction and as-of reconstruction. Well-studied, textbook-documented, and directly applicable to expiry tracking. Any uncertainty in the milestone-derivation area has to be shown to lie *beyond* this, which is why that area is only marked "possibly" below.
- Verifiable credentials, decentralized identifiers, and credential revocation and status lists. Public standards with reference implementations, covering issuance, expiry, holder-mediated presentation, and selective disclosure.
- CRDTs and multi-writer conflict resolution, where writers are cooperative and converge on a shared value.
- Policy and rules engines evaluating declarative rules against a fact base, and returning a decision trace.
- Attribute-based access control and purpose-based disclosure, including field-level redaction by audience.

**Where we believe the shortcoming lies.** Each body of work above assumes something our problem denies:

1. Credential standards assume an **authoritative issuer per credential**. They specify how to verify who said something and whether it has expired, but not how to resolve two current, validly-issued, mutually contradictory assertions about the same functional capacity from two independent assessors with equal standing. The standards' answer is that this is out of scope for the verifier.
2. Conflict-resolution work assumes writers are **cooperative and want to converge**. Our attestors are unaware of each other, have no protocol, no shared clock, and no incentive to agree. Divergence is the normal state, not a fault to be repaired.
3. Rules engines assume the evaluator can **see the fact base**. Ours is structurally forbidden from seeing part of it — permanently, by law, not by configuration — and must still produce a verdict a person can act on and challenge.

Whether these three constraints in combination admit a deterministic, explainable resolution, and what it must give up, is the open question. **Whether a competent professional in the field could resolve it from known practice is exactly what we do not yet know** — and that admission is the honest state of things today. It is also the question to put to CRA under pre-claim approval rather than to answer ourselves.

**Method for keeping this current.** Before opening any new eligible-work entry, re-check the state of the art in that specific area and record what was found, including anything that *resolves* the problem. Finding prior art that answers our question is a legitimate and important outcome of this log: it means the work is routine, we should apply the known answer, and we should not claim it.

**Eligibility assessment:** not itself claimable work. This is the required foundation for line 242 on every subsequent entry.

**Hours.** Not applicable — recorded as part of documentation setup.

---

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

## Open questions

### Resolved since this log opened

- **The figures.** Expenditure limit, refundable rate, and capital eligibility are confirmed in [`verified-facts.md`](verified-facts.md). Note that the $6M limit is close to irrelevant to us: our claim is almost all salary, which is 100% refundable, so payroll is the binding constraint. Do not present the limit increase as a benefit we capture.
- **Cloud costs: still unsettled, and not by us.** No CRA policy names cloud computing at all. The argument rests on inference, and CRA's overhead policy pulls the other way by treating internet service as non-incremental ordinary business expense. Raise it in the pre-claim approval application. Do not budget for it.

### Question 1, now answerable directly — put it to CRA

Does multi-attester reconciliation meet the uncertainty test on its own, or only once we have documented failed approaches?

**Pre-claim approval, available since 2026-04-01, converts this from a judgement call into a written determination.** Eligible with gross business income under $25M, up to three projects per request, determination within **eight weeks**, valid **three years**, and it also cuts expenditure-review processing from 180 days to 90.

The sequence: web form for a case number → Form **T1322** uploaded via My Business Account → a specialist meeting within four weeks, **mandatory for first-time claimants** → determination.

This is the right move and it inverts the original plan. Rather than documenting for a year on the hope that reconciliation qualifies, submit the reconciliation project for pre-claim approval and get a three-year answer in roughly ten weeks. The state-of-the-art entry above plus the standing assessment table is most of the T1322 input already.

Do this **before** starting the reconciliation work in earnest, since the whole point of the service is a determination before costs are incurred.

### Still open for a specialist

1. Are the salaries of a founder-operator doing eligible work claimable in a pre-revenue CCPC with no payroll yet, and what has to be in place *before* the work to make them claimable later? Unchanged, and still the most consequential unknown, since salary is essentially the entire claim.
2. Choice of **traditional versus proxy** overhead method. The proxy amount replaces actual overhead and counts only toward qualified expenditures for ITC purposes. For a claim that is almost all salary, this choice probably matters more than the cloud question.
3. **Ontario's provincial credits** — the Ontario Innovation Tax Credit and Ontario R&D Tax Credit stack on federal SR&ED, and there is an unconfirmed indication Ontario remains tied to the old $3M limit. Close this before modelling any combined recovery rate.
4. Whether our claim narrative sits safely clear of the **social sciences exclusion**. Ask the specialist to read the framing table above adversarially, as a reviewer looking for a reason to reject.

## Related

- [`irap-and-tpon.md`](irap-and-tpon.md) — IRAP advisor request and TPON registration
- [`../execution-strategy.md`](../execution-strategy.md) — capital section
- [`../research/funding-landscape.md`](../research/funding-landscape.md) — the underlying funding research
