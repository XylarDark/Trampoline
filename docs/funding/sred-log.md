# SR&ED contemporaneous documentation log

**Purpose.** CRA expects evidence created *as the work happened*, not reconstructed at filing time. Reconstruction is one of the most common reasons software claims are reduced or denied. This file is the primary record.

**The discipline that makes it evidence.** Git gives an entry a tamper-evident date only once it is committed, and **an entry must be committed separately from the code it describes, before that code exists.** An entry sitting uncommitted in the same working tree as the work it claims to predate proves nothing; file modification times are not evidence and can be set to anything. This was got wrong once already — see the 2026-09-07 implementation entry below, which had to record its own broken chain of custody. Commit the entry first, then do the work, then commit the work.

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
| Outcome milestone derivation from fragmentary employment spells | **No, on the evidence of the work actually done** | Implemented 2026-09-07 (`3090288`). What shipped is half-open interval containment, a sum, a threshold comparison, and a four-value priority list. The one rule with no public source was parameterised and deferred to a provider interview rather than investigated. Downgraded from "possibly" by the implementation entry below, which is the honest outcome of having done the work. |
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

### 2026-09-07 — State of the art for outcome milestone derivation, written before the work

**Why this entry exists, and why now.** The standing assessment above marks "outcome milestone derivation from fragmentary employment spells" as *possibly* eligible. The next work session implements it. Line 242 asks for the knowledge base **at the onset**, and *National R&D* failed partly because documents were not made contemporaneously — so this record is written before the first line of `src/engine/outcomes.ts` exists, not after it works.

**The technological objective.** Determine whether a funder-payable milestone can be derived from an interrupted, mixed-verification employment history such that the derivation is deterministic, explainable to the person whose money depends on it, and reproducible after retroactive correction of any underlying spell.

Note the framing discipline required by the social-sciences exclusion. The objective above is a *technology* question about derivation over incomplete records. It is **not** the question "do these milestones predict retention," which is social science, is excluded by paragraph (g), and belongs in the WSIB proposal instead. See the never-write/write-instead table earlier in this file.

**Known and publicly available as of today**, which we therefore cannot claim as advancement:

- **Bitemporal and valid-time modelling.** Textbook material. Covers as-of reconstruction and retroactive correction directly, and is the reason this area is only "possibly" eligible rather than "likely." Any claim here must show the difficulty lies beyond as-of querying.
- **Interval algebra and interval-overlap computation.** Allen's interval relations, interval trees, and sweep-line coverage over half-open ranges are all standard. Determining whether a set of spells covers a checkpoint date is a solved problem and is not claimable.
- **Time-weighted averaging over irregular intervals.** Standard practice in time-series and metering systems. Computing an average weekly-hours figure across spells of differing length is arithmetic, not research.
- **Event sourcing and append-only ledgers with derived read models.** Well documented, including recomputation from an immutable event log after a correction.
- **Rules engines returning a decision trace.** Producing a per-decision explanation from declarative rules is established practice.

**Where the difficulty may actually lie.** Each item above assumes something this problem does not supply:

1. **The aggregation rule itself is not publicly defined.** Ontario's directives specify checkpoints at 1, 3, 6, and 12 months after job start and a 20-plus-hour average threshold, but no public directive defines how "cumulative" aggregates across *non-consecutive* weeks. This is recorded as open question 3 in `docs/outreach/ontario-outcome-framework.md`. So this is not an insufficiency of *technological* knowledge — it is missing domain specification, which is obtained by asking a provider, not by experiment. **That distinction matters and cuts against eligibility here.** An interview answers it; a systematic investigation does not.
2. **Evidence admissibility is a per-spell property that interacts with the arithmetic.** A spell whose hours qualify but whose verification source is inadmissible must not contribute to a payable milestone, while still remaining visible in the record as work that happened. The interaction between an admissibility lattice and a time-weighted average is the part least covered by the known work above.
3. **Reproducibility under correction with an already-submitted claim.** A milestone asserted to a funder must remain explainable after a later spell correction changes the value it was derived from. Bitemporal modelling gives the mechanism; whether the *explanation* survives correction as well as the number does is the more interesting half.

**Honest interim assessment: likely not claimable, and item 1 is why.** The hardest part of this work is discovering an undocumented administrative rule, which is domain research rather than technological uncertainty, and CRA is explicit that circumventing a problem with available knowledge — here, asking the provider — disqualifies it. Item 2 is the only candidate that looks like genuine system uncertainty, and it is narrow.

Recorded now, in advance, precisely so the answer cannot be reverse-engineered into eligibility once the code is written and the cost is already incurred. **This is a strong candidate for pre-claim approval** rather than a self-assessed claim: put items 2 and 3 to CRA and get a determination before spending real payroll on it.

**Method commitment for the implementation session.** Before writing the engine, re-check the state of the art for the specific question in item 2. If prior art resolves it, apply the known answer and record the work as routine.

**Artifacts.** None yet. Next session: `src/engine/outcomes.ts`, `src/engine/outcomes.test.ts`.

**Hours.** Documentation setup. Not claimable.

---

### 2026-09-07 — Outcome milestone derivation, implemented

Follows the state-of-the-art entry above and answers its three items in order. Nothing in that entry has been edited; amending a pre-work record after the fact is the reconstruction this log exists to prevent, so the corrections are here instead.

**Chain of custody, stated first because it is a defect.** The entry above claims to have been written before `src/engine/outcomes.ts` existed. That is true, but it was never *evidenced*: the entry sat as an uncommitted modification in the same working tree as the finished code for several hours, and both were committed on the same day. File modification times ordered them correctly and file modification times are not evidence. The pre-work entry is therefore weaker than intended, and this is recorded rather than glossed because an auditor who finds it independently will discount the whole log. The rule added at the top of this file exists because of this session.

**Objective, restated unedited.** "Determine whether a funder-payable milestone can be derived from an interrupted, mixed-verification employment history such that the derivation is deterministic, explainable to the person whose money depends on it, and reproducible after retroactive correction of any underlying spell."

Not reached. Two of its three parts were never attempted.

**Item 1 — the aggregation rule. Parameterised, not resolved.** The pre-work entry predicted this would be domain research rather than technological uncertainty, and that is exactly what happened. `CUMULATIVE_AGGREGATION` is a two-member union, `continuous_at_checkpoint | weighted_since_start`, with only the first branch implemented. There is no second code path, no comparison between them, and no measurement. The choice was made by inference from the documented evidence test and is disclosed on screen as an assumption rather than a fact. This is routing around the uncertainty with available knowledge — the disqualifying pattern CRA names explicitly — and it was the right engineering decision precisely because a provider interview answers the question more cheaply than any experiment could.

**Item 2 — admissibility interacting with the arithmetic. A negative result, and the item's own hypothesis was initially implemented backwards.** The pre-work entry hypothesised that a spell "whose hours qualify but whose verification source is inadmissible must not contribute to a payable milestone, while still remaining visible in the record as work that happened." The first implementation did the opposite: it summed hours across every spell covering the checkpoint and then let the single best document anywhere in the set carry the total, so twenty-four hours backed only by a client's word were certified `claimable` by an unrelated eight-hour employment letter. A passing test asserted that behaviour, which is how it survived. It was found by audit, not by experiment, and corrected in `3090288` by attributing evidence per spell.

The correction is worth being precise about, because it is the difference between a defect and an advancement: this was a **specification error**, not a research finding. The right answer was already written down in this log before the code existed. Recovering it required reading the log, not investigating anything. What finally shipped is a filtered sum plus a four-value priority list ordered by `indexOf` — a total order over an enum, not the admissibility lattice the pre-work entry imagined interacting unpredictably with a time-weighted average. There is no unpredictable interaction, because there is no averaging and no lattice.

**Item 3 — reproducibility under correction. Not attempted.** There is no write path anywhere in the application, so no spell can be corrected and the question cannot arise. No bitemporality, no as-of query, no reconciliation of a submitted claim against a later-changed value. `outcomeMilestones` rows are seeded once and never checked against the derived verdicts. The one design decision pointing at this item — keeping the derived verdict and the recorded ledger as separate layers so a later correction cannot silently rewrite a submitted claim — is a structural choice made in advance of the problem, not an investigation of it.

**A discovery that contradicts the earlier framing.** The pre-work entry listed "time-weighted averaging over irregular intervals" among the known techniques we could not claim. It turns out we never implemented it at all: the threshold is assessed on the hours declared on the spells covering the checkpoint date, at a point in time. `cumulativeWeeks` is computed and displayed on two screens but feeds no verdict. The module docstring claimed an average "computed across spells" and was corrected in this commit to say what the code does. Recorded because the earlier entry gave a misleading impression of the work's shape.

**Method commitment from the pre-work entry: not kept.** That entry committed to re-checking the state of the art for item 2 before writing the engine. There is no record that this was done, and the honest account is that the question dissolved on contact: the implementation treats admissibility and hours as independent gates in a fixed precedence order, so the interaction the entry expected never had to be confronted.

**Approaches not tried, stated as the weakness it is.** No alternative aggregation was implemented. No two approaches were compared. Nothing was measured. No implementation was built and rejected. The 107 passing tests are **specification tests, not experiments**: they assert intended behaviour and would pass or fail identically whether or not any result was in doubt. A hypothesis test would have to be capable of telling us something we did not already believe.

**One new open question, which is not an advancement.** Where several disqualifiers apply to the same checkpoint, the engine reports one, and the precedence is ours — no public directive says which reason a Service System Manager records. The same is true of which blocker to name when hours are unprovable across several spells; the code names the one standing in front of the most hours. Both are inventions to be checked with a provider, added to the open questions in `docs/outreach/ontario-outcome-framework.md`.

**Eligibility assessment: not claimable, and the implementation makes the case weaker than the pre-work entry left it.** That entry judged the work likely ineligible because the hard part was discovering an undocumented administrative rule. The code confirms it and adds three points against. The undefined rule was parameterised and deferred rather than investigated. The one item resembling system uncertainty was not investigated either — the code first implemented the inverse of the stated hypothesis, and its correction was specification recovery rather than research. The reproducibility item was never reached. Everything that shipped is standard technique: half-open interval containment, a filtered sum, a threshold comparison, a priority list, a switch statement for display copy, and month arithmetic with end-of-month clamping. That last one — a job starting 31 January has no 31 February checkpoint — is a well-known date-arithmetic pitfall documented in every date library. It is a bug avoided, not an advancement.

**Consequence for the pre-claim approval plan.** Pre-claim approval covers *planned* work only, so this module is permanently outside that route; the money is spent. Scope the T1322 request to multi-attester reconciliation alone, which is unstarted, and drop items 2 and 3 of the earlier entry from it. Filing them now would ask CRA to rule on work already done and self-assessed as ineligible.

**Artifacts.** `src/engine/outcomes.ts`, `src/engine/outcomes.test.ts`. Commit `3090288`, which also carries the per-spell attribution correction and the docstring fix. The pre-work entry is in `7ab5210`, committed before the code but in the same working tree, per the chain-of-custody note above.

**Hours.** Not tracked for this session, which is itself a gap. Sessions from here are to be recorded per person at the time.

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
- Seed data and demo fixtures, including `src/db/demo-cohort.ts` and the twelve synthetic clients.
- The three provider routes under `app/provider/` and all their markup, `components/status-badge.tsx` and the shadcn primitives, `src/db/queries.ts`, and `drizzle/0001_cohort_entry_state.sql`.
- Outcome milestone derivation, `src/engine/outcomes.ts`. Assessed in full in the 2026-09-07 implementation entry and moved here.
- All documentation, strategy, and research writing.
- `scripts/demo-db.ts`, the PGlite-over-TCP demo database. Recorded here rather than as claimable work, and the reasoning matters. This is the one artifact of the session with a genuine observation-hypothesis-verification loop: `PGLiteSocketServer`'s error path detaches its handler and thereby removes the very `close` listener that frees the connection slot, so slots leak until every new connection is accepted and instantly destroyed, surfacing at the client as a bare `ECONNRESET` with no protocol error. Diagnosing that took real work. It is nonetheless **not claimable** — it is a workaround for a defect in a third-party dependency, in demo infrastructure rather than in the product, and the resolution was reasonably predictable once the cause was visible. An obstacle is not an uncertainty.

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

**Scope the request to reconciliation alone.** An earlier plan was to submit outcome milestone derivation alongside it. That work was implemented on 2026-09-07 and self-assessed as not claimable, and pre-claim approval covers planned work only, so including it would ask CRA to rule on money already spent on work we have written down as ineligible — which invites scrutiny of the rest of the request. One project, unstarted, honestly framed.

### Still open for a specialist

1. Are the salaries of a founder-operator doing eligible work claimable in a pre-revenue CCPC with no payroll yet, and what has to be in place *before* the work to make them claimable later? Unchanged, and still the most consequential unknown, since salary is essentially the entire claim.
2. Choice of **traditional versus proxy** overhead method. The proxy amount replaces actual overhead and counts only toward qualified expenditures for ITC purposes. For a claim that is almost all salary, this choice probably matters more than the cloud question.
3. **Ontario's provincial credits** — the Ontario Innovation Tax Credit and Ontario R&D Tax Credit stack on federal SR&ED, and there is an unconfirmed indication Ontario remains tied to the old $3M limit. Close this before modelling any combined recovery rate.
4. Whether our claim narrative sits safely clear of the **social sciences exclusion**. Ask the specialist to read the framing table above adversarially, as a reviewer looking for a reason to reject.

## Related

- [`irap-and-tpon.md`](irap-and-tpon.md) — IRAP advisor request and TPON registration
- [`../execution-strategy.md`](../execution-strategy.md) — capital section
- [`../research/funding-landscape.md`](../research/funding-landscape.md) — the underlying funding research
