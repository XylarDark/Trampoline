# What Ontario actually measures, and how it must be evidenced

**Verified 2026-09-07.** This file exists because the plan's milestone set was drawn from the wrong framework, and the correction changed the schema. Read it before writing anything that touches outcome reporting.

## The finding

The plan specified milestones at "6 and 13 cumulative weeks, retention to 15 and 33 months, 20-plus hours, employment within 60 days of program completion." Those are **legacy ODSP Employment Supports** measures, tracked in ESMS-SPM, and the directive carrying them is now scoped to First Nations sites.

**The live regime is Integrated Employment Services, and it has no 13-week measure at all.**

## Integrated Employment Services — the live definition

A **Funded Outcome** is defined by entry state:

- Client enters unemployed, or working under 20 hours per week on average: outcome achieved at **an average of at least 20 hours per week**, at Ontario general minimum wage or better. Tips and commission may count.
- Client enters already working 20-plus hours: outcome requires 20-plus hours **with a new employer**. A client who achieves an outcome then loses the job reverts to this second definition.

Checkpoints and payment: performance-based funding is paid at **1, 3, 6, and 12 months after job start**. Not after program exit — after the job starts. Our schema anchors follow-ups to job start for this reason.

Further documented rules that affect the data model:

- Employment must be in Ontario, with an employer licensed to operate in Ontario, and is assessed on the client's **primary job**. Hence `placements.primaryJob`.
- **Job stacking** — two or more concurrent jobs summing to 20-plus hours — is permitted for up to 5% of clients per catchment at each checkpoint. A cap at catchment level, which means we can record stacking but must not assume it counts.
- **Subsidized placements earn nothing** until the employer stops receiving employer financial supports and the client achieves an unsubsidized outcome at the next checkpoint. Hence `employmentSpells.subsidized`.
- Self-employment outcome: net business income equivalent to 20 hours per week at general minimum wage, for four weeks.

## Evidence rules — the actual product problem

This is the part worth reading twice, because it is where the manual cost comes from.

**Proof of start date:** an offer letter or email from the employer; an initial pay stub showing zero cumulative hours and pay; or a pay stub showing a change to 20-plus hours per week average.

**Proof of employment at each checkpoint:** an employment letter from the employer stating continuous employment and average weekly hours; or a pay stub covering the checkpoint date. Photographs and emailed copies are acceptable provided they show **employer name, client name, payment date, pay period, and hours worked** — five fields, and a document missing any of them fails.

**Provider attestation is a last resort.** It is accepted only when all options to obtain documents are exhausted, must be signed by the lead employment caseworker on the client's action plan, must satisfy a reasonable-person standard, and requires the provider to report every instance to the Service System Manager **and obtain pre-approval before submitting**. Hence the `employment_spells_attestation_needs_preapproval` constraint.

**Client self-report is not listed as acceptable evidence at all.**

That last line is the whole business case. The person is the only party with an incentive to help, and their word is worth nothing to the funder. So a provider must extract a document from an employer who has no obligation to provide one, four times per client, up to a year after the client stopped being their client.

## The documented burden

Sector-level and well-sourced. None of it is a claim any one of our four interview targets has made about itself, so treat it as an interview hypothesis rather than a position to attribute.

- "Enhanced targets tracking, **proof of job retention collection**, and inputting data into **multiple databases**" have increased the burden, "leading to staff burnout and dissatisfaction. While performance-based funding incentivizes job retention, it does not allocate sufficient funds for operational costs associated with additional administrative work." — First Work, *A Year in Transition*
- "Elevated tracking and reporting requirements are **doubling — or even tripling** — the administrative burden," producing "a **triple burden of reporting**" across CaMS, new SSM tools, and providers' own databases. — same source
- "Another service provider group noted that they have **transformed an entire department to a 'retention department' that strictly captures proof of employment** … This, in combination with other additional administrative duties, has increasingly detracted their group from providing quality services to their clients." — the suppressed third-party evaluation, quoted in Maytree/ODEN, *Early signs of trouble*
- Low-touch clients are the worst case: "someone helped you with your resume and gave you a job posting and then for 12 months they want your paystub." And: "The absolute intrusion of privacy is forcing us to get proof of employment from our clients. **We've lost clients over that.**" — First Work

The last quote is the one to sit with. The current process costs providers clients. That is a stronger argument for our product than any efficiency claim, and it is also a warning: whatever we build must not become one more thing that makes the person feel surveilled. Our access log and per-recipient consent are the answer to that, and they should be in the demo, not a footnote.

### Community Living Toronto has already tried this

Their own published MyJobMatch evaluation, whose stated goal was to "minimize administrative burden," found that "most ES staff reported that the change may have actually made things more challenging and added to their overall administrative burden. A total of 23/48 (48%) response were consistent with this interpretation."

An organization that has attempted this and published a negative result is the single best interview on the list. They know the failure modes, and they have no reason to be polite about them.

## System of record, and the integration precedent

**EOIS-CaMS is the system of record.** Providers are obligated to enter all IES information into it.

But third-party software already runs alongside it. One SSM's standard operating procedures name three systems providers work in: CAT, EOIS-CaMS, and **ESCases**, described as CaMS integration. The documented workflow is: complete the common assessment, obtain the client reference number from CaMS, then "within 24 hours, open ESCases and link the client to CaMS using the client reference number." **Batch import** by client reference number is supported. ESCases is coupled to Thrive Career Wellness, whose action-plan items sync to a client-facing dashboard, and Thrive is a named consortium member in another SSM bid.

Two conclusions:

1. **The integration precedent exists.** A third-party system linking to CaMS by client reference number, with batch import and a client-facing surface, is not hypothetical — someone shipped it and providers use it daily.
2. **The route in is SSM procurement, not a ministry API.** No public EOIS-CaMS API or integration specification exists. Which means the SSM relationship is the gate, and "would your funder accept a milestone evidenced through a third-party system" is the highest-value question in the interview guide.

## Performance measures — and one correction

The **Service Coordination** measure that our referral model targets, counting supported referrals into, during, and at exit from service — including formalized referrals *made to* the provider by another organization — belongs to the **legacy Employment Service** quality standard, where it is 25% within a 40% Customer Service component (Effectiveness 50%, Efficiency 10%).

Under IES, roughly 20% of an SSM's allocation is performance-based, weighted toward longer retention. Prototype-era per-client outcome values ranged from $344 total for the least-supported stream to $3,230 for the most-supported.

**The current IES performance management framework weightings are not public.** The framework document, the incentive and consequence framework, and current targets sit behind a partner login. So: our referral model is well-founded in intent and **unconfirmed in weighting**. Do not quote a percentage to a funder.

## Open questions only a provider can answer

Ask these in the interviews. Each one is a real fork in the product.

1. Which regime is your contract actually under — IES, legacy ES, or ODSP Employment Supports? A mixed transition is documented, and legacy outcomes explicitly do not count toward IES performance funding.
2. Is ESMS-SPM still live for you, or only for First Nations sites?
3. How does "cumulative" aggregate for non-consecutive weeks? No public directive defines it.
4. Would your funder accept a milestone evidenced through a third-party system, given ESCases already links to CaMS?
5. Who approves that — you, your SSM, or the ministry?

## Caveats on this file

- The most detailed public source is one Service System Manager's implementation guidelines. Milestone definitions and evidence rules are likely ministry-set and consistent across catchments, but attestation workflows, ESCases usage, and approval timelines are catchment-specific. Confirm anything operational directly.
- The legacy Employment Service guidelines are dated 2017 but were re-posted in April 2025, which leaves it genuinely unclear which providers are still measured on the old quality standard.
- The ODSP directives are internally ambiguous: the First Nations scope banner sits on a page updated March 2026 that retains the full 6/13-week and 15/33-month framework, and a 2024-25 ministry service-objectives document still describes the retention fee structure.

## Related

- [`contacts.md`](contacts.md)
- [`retention-interviews.md`](retention-interviews.md)
- [`../../src/db/schema.ts`](../../src/db/schema.ts) — the outcome-evidence tables this file governs
