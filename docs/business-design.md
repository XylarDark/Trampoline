# Trampoline — Business Design Document

Working name: **Trampoline**. Subtitle: dual-rebuild readiness record.

---

# Do this next

**What the business is, in plain terms.** People rebuilding health and income at the same time have to re-explain themselves to every new organization, because every existing record dies when they leave the organization that made it. We hold a record that survives the move, and we sell it first to employment-services providers — who are paid on client retention at 1, 3, 6, and 12 months and currently prove it by hand, chasing pay stubs from employers a year after the client stopped being their client.

**Nothing about a person's health may ever restrict their access to work.** That is a legal requirement, not a value statement, and it is enforced in the code rather than in a policy document.

## The nine things to do, in order

Items 1 and 2 are **kill tests**: they can tell us the product should not exist, and they cost only phone calls. Do them before spending money or building further.

### Now — needs no money and no incorporation

| # | Action | Where |
| --- | --- | --- |
| 1 | **Interview four providers on what retention proof costs them.** Corbrook, Community Living Toronto, CCRW, Springboard. One question: how do you evidence the 1, 3, 6, and 12-month milestones today, and what does it cost you? **This is the wedge, or there is no wedge.** | [`outreach/retention-interviews.md`](outreach/retention-interviews.md) |
| 2 | **Ask SALUS Safety what an outside issuer must prove to register as a certificate provider.** `connect@salussafety.io`. They already refuse work on expired credentials *and* publish an API endpoint for external issuers, so the structural question is half-answered — ask for the requirements list. | [`outreach/gate-falsification.md`](outreach/gate-falsification.md) |
| 3 | **Email WSIB.** `grants@wsib.on.ca`. Two questions: did the 2026 competition run, and can a private company be a funded collaborator? Their page has been stale for a year, so this may reveal there is nothing to apply to. Draft is written. | [`funding/wsib-collaborator.md`](funding/wsib-collaborator.md) |
| 4 | **Email Dr. Rebecca Gewurtz at McMaster.** `gewurtz@mcmaster.ca`. She directs the IDEA lab and is an IWH adjunct scientist, so one conversation reaches both institutions. Do not wait on item 3. Draft is written. | [`funding/wsib-collaborator.md`](funding/wsib-collaborator.md) |
| 5 | **Read JDAPT and write down what we do that it does not.** IWH's accommodation planning tool is award-winning, free, and aimed at our exact population. If the distinction does not hold up, proposition 2 needs rethinking. | [`research/competitive-landscape.md`](research/competitive-landscape.md) |

### After incorporating

**Incorporate as an Ontario CCPC.** It gates the three items below and nothing else on this page, so it is not urgent — but it is also the point of no return on the corporate form, which costs us the Ontario Trillium Foundation entirely and bars us from leading a WSIB project. We take that trade to get SR&ED, the only money on the list no committee can decline. Revisit it early if no nonprofit will hold a grant with a for-profit vendor line in it, rather than after a year of declines.

| # | Action | Where |
| --- | --- | --- |
| 6 | **Request SR&ED pre-claim approval** for the multi-attester reconciliation work — web form for a case number, then Form T1322. A written CRA determination in about eight weeks, valid three years, *before* the money is spent. Do it **before** starting that work. | [`funding/verified-facts.md`](funding/verified-facts.md) |
| 7 | **Call NRC IRAP: 1-877-994-4727.** A senior executive has to place the call; there is no web form. Expect advice and referrals for six months, not money. | [`funding/irap-and-tpon.md`](funding/irap-and-tpon.md) |
| 8 | **Register on Transfer Payment Ontario.** Completes in-session, but system access takes up to five business days. Being unregistered when a narrow call opens is an avoidable loss. | [`funding/irap-and-tpon.md`](funding/irap-and-tpon.md) |

### Once the interviews confirm the wedge

| # | Action | Where |
| --- | --- | --- |
| 9 | **Get one sector council to lead a Sectoral Workforce Innovation Fund application.** Start with Food Processing Skills Canada (`jgriffith@fpsc-ctac.com`), which has a $9.7M federal precedent and has already built credential infrastructure. Continuous intake, so no deadline pressure. | [`funding/swif-partner.md`](funding/swif-partner.md) |

## What would make us stop

Written down in advance so the answer cannot be reinterpreted later in our own favour.

- **If providers say retention proof is cheap or already solved,** the wedge is gone. Fall back to accommodation specification, which has its own evidence base and a different payer.
- **If two or more gating platforms refuse an external issuer in principle** — not "not yet," not "come back with customers" — then we are not a portable credential and must stop describing ourselves as one. The outcome-evidence and accommodation propositions both survive without portability.

## The one number that says it worked

A provider stops manually chasing retention proof, and their 12-month retention figure moves. Not seats gated, not levels earned.

---

This document supersedes the original brief where the two disagree. The brief described a gating product: checks that unlock training seats and jobs, with a health drop pausing applications. Four independent research streams — [evidence and economics](research/evidence-and-economics.md), [legal and privacy](research/legal-and-privacy.md), [competitive landscape](research/competitive-landscape.md), and [funding](research/funding-landscape.md) — each rejected that one mechanic, for different reasons. Section 4 records what replaced it and why.

## 1. Problem

People who need to turn around health and career at the same time get split across apps.

- Wellness and health tools assume income is stable.
- Career and employment tools treat health as a sidebar.
- The person ends up as the integration layer, re-explaining their situation to every new organization.

Two failures are specific enough to build against.

**The retention cliff.** Ontario's own prototype data shows employment at 20-plus hours falling from 86% at exit to 62% at twelve months. Providers prove those milestones manually, and the funding depends on the proof rather than on the outcome being visible.

**The unmet accommodation.** 35.4% of employed Canadians with disabilities report an accommodation need that is not met. The interventions that work — clinician-to-workplace contact, a concrete accommodation offer — are among the few with strong evidence for shortening work disability, and they are largely unoperationalized.

## 2. Positioning

Trampoline is a **router and an evidence record**.

- We do **not** compete with established medical, fitness, mental-health, education, or employment services.
- For established services we are an extra funnel and a reporting relief: they receive staged referrals and stop hand-assembling outcome proof.
- For connectivity gaps we own the record, the routing, the handoffs, and the evidence trail.

### Feature test

Every proposed feature gets one question: *does an incumbent already deliver this to the end user?*

| Answer | Action |
| --- | --- |
| Yes | Integrate and send them volume. |
| No, and the user gets stuck | Build the thinnest connector that unsticks them. |

If a feature looks like competing with an incumbent, stop and ask before building it. This test is why we integrate with Credivera, MyCreds, and Certn rather than issuing credentials ourselves.

### The gap we are actually filling

Most components of this product already exist. What does not exist is a record that survives leaving the organization that created it. Every incumbent readiness record requires a container the person is already inside:

| Record | Container it requires |
| --- | --- |
| Cority, Avetta | An employer or contractor engagement |
| WSIB Functional Abilities Form | An open claim |
| TELUS Health | A benefits plan |
| MyCreds | An institution |
| CaMS | An open action plan |

Our population is between containers. That is the unserved gap, and it is a trust and coordination problem more than an engineering one.

**One qualification, found late and worth keeping visible.** SALUS Safety, a Canadian construction-safety platform, already markets a worker-held portable record in almost our own words — "the record belongs to the worker" — and publishes an API for registering outside credential issuers. So cross-container persistence is not an unclaimed idea; it is unclaimed *for our population*, in a sector with less money in it than construction. That is a thinner moat than the table above suggests, and it is why item 2 in the action list is a kill test rather than a partnership call.

## 3. Design rules that are not negotiable

These come from Ontario law and from the evidence base, not from engineering taste. Each is enforced in code rather than left to reviewers, and the enforcement points are named so a future change cannot quietly undo them.

**R1. No health-derived requirement on the hiring path, in any form.**
Human Rights Code s. 23(2) makes pre-offer medical inquiry presumptively unlawful, and consent is not a defence (*Etobicoke*). `EmploymentGate` in [`src/engine/types.ts`](../src/engine/types.ts) has no field able to express one, the schema is strict so a definition carrying `requiredLevel` fails rather than parsing with the field ignored, and a check constraint on the `gates` table refuses the row outright.

**R2. Mental health never reaches an employer surface.**
Not the verdict, not the existence of the check, and not a composite score it feeds. `EMPLOYER_FORBIDDEN_DOMAINS` is enforced in [`src/engine/share.ts`](../src/engine/share.ts), which throws rather than redacts.

**R3. Expiry triggers support; it never restricts work.**
There is no column anywhere that pauses job access. `healthRenewalDue` in [`src/engine/levels.ts`](../src/engine/levels.ts) is a private nudge to the person. This follows the evidence: rapid placement beats pre-employment preparation, 34% versus 12% employed at 18 months.

**R4. No pass or fail on an employer surface.**
*Davis v. Toronto* found discrimination on perceived disability where the person had no actual functional limitation. Post-offer employers receive functional limits and an accommodation path — content they can lawfully act on — never a score.

**R5. Levels are private routing, not a credential.**
A level bundles medical, wellness, and mental checks, so publishing it discloses health by inference. Levels decide what support to offer and let the person track themselves.

**R6. Person-mediated ingestion only.**
No clinic-to-platform pipe. This keeps us clear of PHIPA s. 49 recipient constraints and of "health information network provider" status under O. Reg. 329/04 s. 6.

**R7. Consent is per recipient, scoped, and revocable, with an access log the person can read.**
A single share-everything toggle is not specific consent under PIPEDA or PHIPA. Every view writes to `share_access_log` and is shown back to the person.

**R8. Health-derived requirements survive only for training, and only with a written rationale.**
`TrainingGate` may reference a level or a restriction, but the schema and a second check constraint both require a stated bona fide safety rationale of substance. A forklift course whose practical exam requires lifting test loads qualifies. A warehouse job does not.

## 4. What changed from the original brief, and why

| Original mechanic | Now | Why |
| --- | --- | --- |
| Warehouse gate: Level 2 + lifting restriction clear + 14-day attendance | Employment gate: skills checks + attendance. The lifting restriction moved to the forklift *course*, and on the hiring side becomes a post-offer accommodation. | R1, R8. The original is the textbook unlawful pre-offer inquiry. |
| A health drop pauses job applications | A health drop triggers a renewal reminder, an offer of clinician-to-workplace contact, and stabilization support | R3, and the rapid-placement evidence. |
| Share view carries level, restrictions, expiry | Two views: skills only pre-offer; functional limits plus accommodation path post-offer | R2, R4. |
| Levels are a living credential shown to gatekeepers | Levels are private routing | R5. |
| Outcomes table: showed up, stayed, relapsed, hired, kept 90 days | Referrals with acceptance, placements, employment spells with hours and wage, funder milestones, follow-ups, satisfaction | No funder pays on our categories; they pay on theirs. |

What survived: the append-only attestation model, the expiry and decay logic, the restriction model, the published rubrics, the dual intake, and the levels engine. The data model was close to right; what it *did* was wrong.

## 5. Product

A durable record of demonstrated progress, plus the routing that record makes possible.

Three propositions, each with evidence and a named payer.

**1. Outcome-evidence infrastructure — the wedge.** Under the live Integrated Employment Services regime a funded outcome is an average of 20-plus hours per week at or above minimum wage, checked at 1, 3, 6, and 12 months after job start, and evidenced by an offer letter, a pay stub, or an employment letter. Client self-report does not count, and a provider attestation needs Service System Manager pre-approval. So a provider must extract a document from an employer with no obligation to supply one, four times per client, up to a year after that client stopped being their client. The manual cost is documented in the government's own evaluation.

The referral tables serve the Service Coordination measure, which counts supported referrals in *and* out — including referrals made *to* the provider. Carry the caveat: that measure sits in the legacy Employment Service quality standard and the equivalent IES weighting is not public. See [`outreach/ontario-outcome-framework.md`](outreach/ontario-outcome-framework.md) for the full framework, the evidence rules, and what is still unconfirmed.

**2. Accommodation specification.** Our restriction model, rendered in Functional Abilities Form style and released post-offer with a request path, operationalizes two of the few strongly-evidenced levers for cutting work-disability duration. Readiness certification has no comparable evidence base; this does.

Contested, and we should say so. The Institute for Work & Health's **JDAPT** is an award-winning, peer-reviewed, free accommodation planning tool built for people with chronic and episodic conditions — our population, named. The distinction we are relying on is that JDAPT is a *planning instrument* used inside one conversation, while we are a *durable multi-party record* with expiry, per-recipient revocable consent, and evidence that survives the person changing providers. Different object, adjacent purpose. Item 5 in the action list exists to test that claim before a funder tests it for us; the best available outcome is that JDAPT specifies the accommodation and we are the record it writes to.

**3. Cross-container persistence.** Section 2 above.

This is **not** a habit tracker with a jobs tab, not a social feed, and no longer a credential that decides who may work.

### Actors

| Actor | What they do |
| --- | --- |
| Person | Holds the record, completes checks, applies to anything they like, releases scoped views, requests accommodations. |
| Attestor | A partner practitioner or assessor who issues or revokes a check. |
| Org admin | Manages an organization's attestors, opportunities, and gates. |
| Provider | Uses the record to evidence referrals, placements, and retention milestones without manual chasing. |
| Funder | Receives milestone evidence as a by-product of service delivery rather than a year-end survey. |

## 6. Levels

Names can change; meaning cannot. Levels are bundles of passed checks — not quiz scores, not vibes — and per R5 they are private to the person.

| Level | Name | Meaning |
| --- | --- | --- |
| 0 | Stabilize | Safety, basic medical contact, sleep and medication consistency. |
| 1 | Capacity | Show-up streak, movement floor, mental check-in, short tasks on time. |
| 2 | Trainable | Can attend a course or placement without collapsing. |
| 3 | Employable | Skills check plus reliability window plus clearance bundle. |
| 4 | Hold | 90 days in school or work without dropping the health floor. |

"Employable" is a routing label for the person's own view. It has never been, and must not become, a permission to work.

## 7. The four check types

Partners perform the checks. We store the attestations.

| Type | Who attests | Where it may be used |
| --- | --- | --- |
| Medical | Clinic, occupational health, family doctor | Private routing; post-offer functional limits; training gates with a rationale |
| Wellness | Gym, trainer, Y, physio | Private routing |
| Mental | Counselor, EAP, regulated provider | Private routing only. Never employer-visible, in any form |
| Skills | School, employment agency, certified assessor, employer trial | Everywhere, including employment gates |

### What we store

Who attested, the verdict (pass, fail, or pass-with-restrictions), any restriction codes, issued-at, and expires-at.

### What we never store

Full medical charts, therapy notes, workout programs, or the findings behind a verdict.

Medical and mental checks require **regulated attestors**. Note the open commercial problem in [`execution-strategy.md`](execution-strategy.md): uninsured third-party forms get billed to the patient, and a financially precarious person cannot pay a clinician per attestation.

## 8. Routing model, which replaces the unlock model

Employers and programs publish requirements as **gates**, and gates come in two kinds that are structurally different objects.

**Employment gates** may ask for demonstrated skills and attendance. That is the whole surface. Someone with no health checks at all, or with every health check lapsed, passes an employment gate exactly as anyone else does.

**Training gates** may additionally consider a level or a restriction, but only with a written safety rationale tied to the program's own requirements.

What a failed, lapsed, or restricted check does instead of blocking:

| Signal | Routing action |
| --- | --- |
| Health check lapsed | Renewal reminder, plus an offer of clinician-to-workplace contact |
| Active restriction | Accommodation offer, and matching toward compatible work |
| Level bundle incomplete | Stabilization support, and the person's own next step |
| Restriction blocks a *training* place | Accommodation request path, reachable from the gate itself |

Rules that follow:

- **Decay keeps the record honest, not restrictive.** An expired check stops counting as current evidence. It does not close a door.
- **Restrictions are first-class and route rather than exclude.** A restriction carries the tags of work it suits.
- **Every gate that can turn someone away links to the accommodation path.** Required by AODA IASR s. 23 for any assessment or selection process.

## 9. What we own

- The record: append-only attestations with expiry, revocation, and restrictions.
- Dual intake: health load and work load on one scale.
- Milestone definitions partners can attest against in a standard way.
- The routing engine: what support a signal triggers.
- Accommodation specification and the request path.
- Two employer views, and the consent and access log around them.
- Outcome evidence: referrals with acceptance, placements, employment spells, funder milestones, follow-ups, satisfaction.

## 10. What we do not own

- Our own class schedule, calorie tracker, EMR, LMS content, gym network, or resume rewriter.
- Verifiable-credential issuance, education credential storage, or background checks. Integrate with Credivera, MyCreds, Certn.
- Scraped mass job inventory, or a destination site an employer must visit outside their applicant tracking system.
- Any chatbot that issues medical or mental clearance.
- Any product that decides whether a person may work.

## 11. Business model

| Payer | What they pay for | Status |
| --- | --- | --- |
| Providers | Automated evidence for referrals, placements, and retention milestones | The wedge. Validate first. |
| Funders and Service System Managers | Service Coordination and retention reporting as a by-product of delivery | Follows the provider relationship. |
| Sector bodies | Shared infrastructure inside a Sectoral Workforce Innovation Fund proposal they lead | Wants a partner to lead — see the correction below. |
| Employers | Accommodation specification and audit trail — administrative and legal value | Later, and never persuasion-based. |
| Consumers | Not primary. This user has the least ability to pay. | Not planned. |

Structure: a for-profit Canadian-controlled private corporation, because SR&ED requires it and SR&ED is the only money with no gatekeeper. Program grants are mostly held by nonprofit and association partners, because the workforce funding stack largely pays service deliverers rather than software vendors — the Ontario Trillium Foundation excludes for-profits outright, WSIB bars them as project lead, and a for-profit vendor cannot lead a Skills Development Fund Training Stream application.

**One correction to that generalization, because it changes how we negotiate.** For-profits *are* eligible applicants for the federal Sectoral Workforce Innovation Fund. We want a sector council to lead for reasons of capacity, not eligibility: we would fail the multi-employer and multi-province tests and the 100-participant regional minimum, and could be deprioritized for duplicating an existing digital workforce platform. A council fails none of those. Say that plainly when approaching one — anyone can check the eligibility page in thirty seconds, and being caught overstating a constraint ends the conversation.

Full detail, verified figures, and what remains unconfirmed in [`funding/verified-facts.md`](funding/verified-facts.md) and [`execution-strategy.md`](execution-strategy.md).

**A discipline the corporate structure imposes on our own writing.** SR&ED statutorily excludes social sciences research, and we are an employment-services company — which puts us permanently one careless sentence from voiding the claim. "Can restriction data predict work-disability duration" is a social-science question: it is genuinely valuable, it is nearly verbatim a WSIB research priority, and it must never appear in an SR&ED claim. "Can contradictory multi-attester assertions be reconciled deterministically" is a technology question and is the claimable one. The two narratives cannot share a document, and the [SR&ED log](funding/sred-log.md) carries the framing table that keeps them apart.

## 12. Trust, fairness, privacy

- **Everything in section 3 is a privacy control as much as a legal one.** Start there.
- Rubrics are published. No hidden caste.
- Minimum-necessary disclosure, per recipient, time-limited, revocable, with an access log the person can read and no bulk export.
- Attestations are append-only with revoke events, so the record has an audit trail rather than an edit history.
- **AI disclosure.** Since January 1, 2026, Ontario employers with 25 or more employees must disclose AI used to screen, assess, or select. Our level computation plausibly meets the definition and the duty follows the employer, so we supply the disclosure language rather than leaving them to write it.
- **WCAG 2.0 Level AA** from the first page, regardless of headcount — the Ontario standard is still 2.0, not 2.2.

## 13. Success metric

A provider stops manually chasing retention proof, and the 12-month retention number moves. Not seats gated, and not levels earned.

Supporting measures live in [`../STRATEGY.md`](../STRATEGY.md).

## 14. Related documents

**Anchors**

- [`../STRATEGY.md`](../STRATEGY.md) — short product anchor.
- [`execution-strategy.md`](execution-strategy.md) — beachhead, outreach order, capital, and the pilot.
- [`research/`](research/) — the four research streams behind sections 3 and 4.

**Execution, one file per action above**

| Action | Document |
| --- | --- |
| 1 — provider interviews | [`outreach/retention-interviews.md`](outreach/retention-interviews.md) |
| 2 — gate falsification | [`outreach/gate-falsification.md`](outreach/gate-falsification.md) |
| 3, 4 — WSIB and the researcher | [`funding/wsib-collaborator.md`](funding/wsib-collaborator.md) |
| 6 — SR&ED | [`funding/sred-log.md`](funding/sred-log.md), [`funding/verified-facts.md`](funding/verified-facts.md) |
| 7, 8 — IRAP and TPON | [`funding/irap-and-tpon.md`](funding/irap-and-tpon.md) |
| 9 — sector council | [`funding/swif-partner.md`](funding/swif-partner.md) |
| Contact details for all of the above | [`outreach/contacts.md`](outreach/contacts.md) |

**Reference**

- [`outreach/ontario-outcome-framework.md`](outreach/ontario-outcome-framework.md) — what the funder actually measures and how it must be evidenced. Read before any provider conversation.
- [`funding/verified-facts.md`](funding/verified-facts.md) — primary-sourced figures, and an explicit list of what is *not* confirmed. Nothing from the research should be quoted to an outside party without checking here first.
