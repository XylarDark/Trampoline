# Trampoline — Execution Strategy

Companion to [`business-design.md`](business-design.md). That document says what we are; this one says what we do first and in what order.

## 1. Beachhead: Hamilton-Niagara

Ontario first, and specifically Hamilton-Niagara. The reasons are practical rather than sentimental:

- It is a former prototype catchment, so its outcome data is **published and citable** — including the collapse from 86% to 62% employment at 20-plus hours between exit and twelve months. We can open a conversation with the buyer's own numbers.
- Its Service System Manager is Fedcap Canada, whose catchment actually spans Hamilton, Haldimand-Norfolk, Niagara, Brant, and Halton. Its current provider network includes **AGILEC and March of Dimes**, which also sit on the WSIB assessment roster — provider interview and attestor supply in the same conversation.
- It sits inside the Greater Toronto and Hamilton Area, so expansion is cheap.
- Nine Service System Managers cover the whole province. That is a nine-relationship scale path, not a city-by-city grind.

Consequences that follow from the geography:

- **Privacy posture:** PIPEDA, PHIPA where health information is involved, and the Ontario Human Rights Code as a design constraint rather than a compliance afterthought. See section 3 of the business design.
- **Accessibility:** AODA, which still points at WCAG 2.0 Level AA.
- **Attestor supply:** the WSIB roster is the shortcut. March of Dimes and Agilec appear on both the assessment and employment-services lists — they are *already paid* to produce functional assessments with restrictions. We standardize and route their existing output rather than asking anyone for new work.

## 2. Sell demand before supply

Two cautionary cases decide the order of everything below.

UK Fit for Work died because referrers did not refer and employers found the recommendations unusable. The Learning and Employment Record category stalled because employers will not visit a separate site outside their applicant tracking system.

So: **get one organization to commit to consuming our output before building the attestation network that feeds it.** An attestor network with nobody reading it is the expensive way to learn this.

**One encouraging finding on the consumption side.** EOIS-CaMS is the system of record, and no public API exists — but third-party software already runs alongside it. ESCases links clients to CaMS by client reference number, supports batch import, and is coupled to a client-facing dashboard through Thrive Career Wellness, which is itself a named consortium member in another Service System Manager's bid. So the precedent for a third-party system in this workflow is not hypothetical; someone shipped it and providers use it daily. The route in is **Service System Manager procurement, not a ministry integration programme** — which makes the SSM relationship the real gate, and makes "would your funder accept a milestone evidenced through a third-party system" the highest-value question in the interview guide. That question is now a document review rather than a hypothetical, because there is a printed evidence pack to hand over.

**A second, independent reason the Service System Manager is the gate, found by building the derivation.** Reaching the hours threshold by summing concurrent jobs is permitted for only 5% of clients *per catchment*. That cap cannot be evaluated from one person's record, so a correct verdict for that class of client structurally requires catchment-level data only the SSM holds. The procurement argument and the data argument now point the same way, which is a stronger position than procurement alone.

## 3. Outreach in dependency order

### 1. Retention-cliff interviews (weeks 1-3)

Community Living Toronto, Corbrook, Springboard, and the Canadian Council on Rehabilitation and Work.

One question: *how do you currently prove employment at the 1-, 3-, 6-, and 12-month checkpoints, and what does it cost you?*

Two corrections carried from verification, both of which would have made the first call go badly. These four are in **WCG's** Toronto network, not Fedcap's — the consortium listing naming all four is a 2020 bid-stage announcement. And the milestones are not 13 cumulative weeks; that is the legacy ODSP framework, now scoped to First Nations sites. Details in [`outreach/ontario-outcome-framework.md`](outreach/ontario-outcome-framework.md).

Start with Community Living Toronto. They published an evaluation of their own attempt to reduce this exact burden and found it got worse — 23 of 48 staff responses said the change added to it. Best-informed call available, and the least likely to be polite.

**Two halves to each call now, and the order matters.** Ask the open cost question first and get their own number for work they earned and could not substantiate, before showing anything — a milestone table shown early gets described back to us in our own vocabulary and the call is wasted. Then offer the demo as a recognition test: here are eleven verdicts and twelve clients, which of these do you actually see, and which have we got wrong. The second half is where a framework error surfaces, and a framework error is more urgent than a demand answer, because it invalidates the product rather than the market.

This validates or kills the wedge for the price of four phone calls. It is allowed to kill it. If the answer is "it's fine, our case management handles it," the reporting thesis is wrong and we should know in week three rather than month nine.

**The demo travels now, which changes what a call can be.** `npm run db:demo` serves the database in-process over TCP, so the whole thing runs on a laptop with no Docker and no deployment. An in-person walkthrough in a provider's office is a real option where it was not before.

### 2. Workforce planning boards (weeks 2-4)

Workforce Planning Hamilton and the Niagara Workforce Planning Board. Ask for inclusion in the next Local Labour Market Plan and an introduction to the Service System Manager. Board endorsement costs them little and materially strengthens someone else's grant application, which is the position we want to be in.

### 3. Attestor supply from the WSIB roster (weeks 3-6)

Standardize what March of Dimes and Agilec already produce. Note the payer problem below before asking any clinician for anything.

### 4. The falsification test (weeks 4-8)

If a platform that *already does credential refusal* will not accept one more credential type, the portability thesis has a problem no product work can fix. This is the cheapest possible way to be proven wrong, which is why it is scheduled early rather than avoided.

**The targets changed on verification, and the test is now partly pre-answered.** BookJane turns out to only *alert* on expiry, not refuse, so testing there would have produced a false negative — and its assets were sold under court order in June 2025 with no successor entity disclosed. The primary target is now **SALUS Safety** (Vancouver, construction), which documents genuine refusal at the block screen *and* publishes an API endpoint whose purpose is registering external certificate issuers. That endpoint falsifies the structural objection before the first call, leaving the narrower commercial question: would anyone treat a Trampoline attestation as a first-class credential type?

Their marketing also already argues our thesis — "the record belongs to the worker" — which is validation and a build-versus-partner problem in one sentence. See [`outreach/gate-falsification.md`](outreach/gate-falsification.md).

### 5. Clinical partner and hardest audience (weeks 6-10)

Youth Wellness Hubs Ontario's Lift Program, and the CAMH-led Individual Placement and Support network.

Expect the zero-exclusion objection immediately — IPS has a zero-exclusion rule, and our original design violated it outright. The routing reframe is the answer, and this is the audience that will test whether the answer is real. If it survives here it survives anywhere.

### 6. Integration rails, not rebuilds

Credivera for verifiable credential lifecycle, Certn for verification through an API into existing applicant tracking systems, MyCreds for education credentials. Building our own issuance layer would fail our own feature test.

Add **SALUS Safety's certificate-provider API** to this list. It is the only Canadian gating platform found with a documented, public mechanism for admitting an outside credential issuer, which makes it a candidate rail rather than only a test subject. **Labourly** is a second precedent, having already admitted a third-party verification provider through its Certn partnership.

## 4. Capital

**Structure: stay a for-profit Canadian-controlled private corporation, and win program money through partner-held grants.** The workforce funding stack mostly pays service deliverers rather than software vendors — Ontario Trillium Foundation excludes for-profits from every stream, WSIB bars private organizations as project lead, Skills Advance Ontario's service-provider stream has no for-profit category, and the Skills Development Fund Training Stream confirms a for-profit vendor cannot be lead applicant. But SR&ED, the only money with no gatekeeper, requires the corporate form. Take the tax credit ourselves; let nonprofits and associations hold the grants.

One correction to that generalization: **the federal Sectoral Workforce Innovation Fund does accept for-profit applicants.** Our reason for wanting a partner there is capacity, not eligibility — participant volume and multi-province reach — which is a better position to negotiate from and should be stated honestly when we do.

### Reachable now, no gatekeeper

| Source | What it gives | Action |
| --- | --- | --- |
| SR&ED | 35% refundable on current expenditures, **100% refundable** for a CCPC. Limit now $6M, which is irrelevant to us — our claim is almost all salary, so payroll is the binding constraint. Capital ITC is only 40% refundable. | Contemporaneous documentation, already open. Document the genuinely uncertain work, not routine build. |
| **SR&ED pre-claim approval** | A **written CRA determination in ~8 weeks, valid 3 years**, before incurring the cost — and expenditure reviews cut from 180 to 90 days | New since 2026-04-01, and the highest-value procedural item in the whole scan. Web form for a case number, then Form T1322. Do it **before** starting the reconciliation work. |
| NRC IRAP | Advisory, warm referrals, and a 12-18 month funding horizon | **No web form.** A senior executive calls 1-877-994-4727. Pre-revenue is not a bar. Treat it as a six-month relationship, and ask what the Canada Innovation Corporation transition means for a relationship starting now. |
| Transfer Payment Ontario | Access to programs that route exclusively through it | Register now. Registration completes in-session but **access takes up to 5 business days**, so being unregistered when a narrow call opens is an avoidable loss. |

What SR&ED can actually claim: multi-attester expiry and restriction reconciliation, and gate evaluation under conflicting attestations, framed as CRA's **"system uncertainty"** — well-known components with unpredictable interactions. Not the Next.js app.

**Narrowed by our own contemporaneous record, which is the point of keeping one.** Outcome milestone derivation was on that list as "possibly eligible." It has now been built, and the [SR&ED log](funding/sred-log.md) assesses it as **not claimable**: the hard part was discovering an undocumented administrative rule, which is domain research obtained by asking a provider rather than by experiment, and the one part that resembled system uncertainty was never actually investigated. So reconciliation is the only surviving candidate, it is unstarted, and the pre-claim request should name it alone. Writing the assessment before the work is what made this narrowing cheap instead of embarrassing.

**And a hard constraint that cuts across our own research agenda: social sciences research is statutorily excluded from SR&ED.** "Can restriction data predict duration" is not claimable and belongs in the WSIB proposal. "Can contradictory multi-attester assertions be reconciled deterministically" is claimable and belongs on the T661. The two narratives must never appear in the same document. Cloud costs are unsettled — no CRA source names them — so do not budget for them.

### Needs a partner to hold it

| Source | Size and timing | Our role |
| --- | --- | --- |
| Sectoral Workforce Innovation Fund | Continuous intake since 2026-08-25, up to $10M over 36 months, 25% private cost share, digitization eligible | Shared sector infrastructure in a sector council's Statement of Interest. **We are in fact eligible to lead** — for-profits are named applicants — but we would fail the multi-employer and multi-province tests and the 100/500 participant minimums, and could be deprioritized for duplicating existing digital workforce platforms. A council fails none of those. Best-timed opportunity found. Prioritize the six new **Workforce Alliance** delivery organizations, who are effectively pre-vetted leads. |
| WSIB Research and Grants | Up to $150K/year to $300K over 24 months, **but no open competition and the program page has been stale since 2025-09-17** | Funded collaborator supplying an essential service not otherwise available. We cannot lead. First action is an enquiry to grants@wsib.on.ca to find out whether the 2026 competition ran, was deferred, or was cancelled — it cannot be determined publicly. Our proposed question is verbatim a 2025 WSIB priority: identifying those at risk of duration beyond 3 and 6 months. Note WSIB claims perpetual irrevocable derivative-works rights over material produced under a grant. |
| Ontario Trillium Foundation Grow | Closes 2026-11-04 | A purchased-technology line in a nonprofit's budget. |
| Realize Capital Partners | Tuesday office hours | Highest value per unit effort in the whole funding scan. Ask which portfolio intermediary backs Ontario workforce or health-equity technology. Raven's Community-Driven Outcomes Contracts, where government pays only for what works, are the closest structural match to our revenue thesis anywhere. |

### Not yet

FedDev Business Scale-up (needs 5 full-time employees, two years of statements, 50% match). Ontario Centre of Innovation Collaborate 2 Commercialize (two years incorporated, five Ontario staff). Skills Development Fund Training Stream (closed; be TPON-registered with a lead applicant lined up for Round 7). Verify with the Health Innovation Pathway concierge whether an attestation registry is in scope or excluded as a health information system before spending proposal effort there.

## 5. MVP order

The original ordering rule here was "do not start a later item to avoid a harder earlier one." That rule has been replaced by the actual constraint the build ran into, which is more useful: **read surfaces can be built in any order; every write-shaped item is gated on authentication and organization scoping.** That single dependency, not sequencing discipline, explains the shape of what exists.

### What is built

1. **The record and the routing engine.** Done. Attestations with expiry and revocation, levels computed from current evidence, support triggers, all under test.
2. **Outcome evidence derivation.** Done, read-only, against a seeded cohort. A pure engine derives the four funded-outcome checkpoints per placement and names why each is or is not payable, with three provider surfaces over it: a caseload table, a per-client evidence timeline, and a print-ready funder pack. This was the wedge and it moved up from last place.
3. **The two employer views and the access log.** Rendering from real rows — skills pre-offer, functional abilities post-offer, with recipient and expiry shown. Creating and revoking a link is not built.

### What is not, and why

Everything remaining needs a write path, so all of it sits behind the same two dependencies:

4. **Sign-in and organization scoping.** The gating dependency for everything below, and no longer deferrable. The caseload currently returns every placement in the database to anyone who loads the page, which is acceptable in a synthetic demo and disqualifying with one real client in it.
5. **Outcome evidence capture.** The literal "capture" half of item 2: writes, plus an import path from the provider's existing system. Batch import by client reference number is the documented precedent, so that is the shape to build.
6. **Attestor role.** A partner issues and revokes a check. Carries the revocation-event write with it — revocation is modelled as an `attestation_events` row that no code path currently writes.
7. **Accommodation request path.** The route exists and is linked from every gate, but as disabled markup. A surface, not yet a path.
8. **One provider using items 5 and 6 for real reporting.** Proves the model. Cannot start before item 4.

### Vertical slices

**Shipped:** a seeded placement, through the derivation engine, to a printable funder evidence pack. Not the slice this section originally described — nobody completes a check and no seat is opened, because nothing writes — but it is one clean route through the part with a payer, and it is demonstrable on a laptop.

**Next:** the first write. One caseworker signs in, records one employment spell against one placement, and sees the checkpoint verdict change. That single route forces authentication, organization scoping, and an audit trail into existence, which is most of item 4.

## 6. Partner motion

We approach established services as an extra funnel and a reporting relief, not as a competitor.

| Partner type | What they get | What we ask |
| --- | --- | --- |
| Provider inside an SSM consortium | Retention and referral milestones evidenced without manual chasing | React to the derived caseload and tell us which verdicts are wrong; tell us what their funder actually settles on. **Not** "use the record for reporting" — they cannot, because nothing writes and there is no import path from their existing system. Batch import by client reference number is the missing MVP item that would change this ask. |
| Clinic / occupational health | Staged referrals, fewer inappropriate visits | Issue medical checks in a standard verdict-plus-restriction form |
| Gym / physio / Y | Referred members with a defined goal | Issue wellness checks |
| Counselor / EAP | Referrals arriving at the right stage | Issue mental checks — private routing only, never employer-visible |
| School / agency / assessor | Applicants who will not drop out in week two | Issue skills checks; publish program gates with rationales |
| Employer | Accommodation specified up front, and an audit trail | Publish requirements as skills-only gates; confirm employment milestones |

## 7. The pilot that proves it

One Ontario pre-apprenticeship cohort.

The ministry has already written the numbers into a funding contract — 80% program completion and 80% post-program transition, against roughly 47% provincial apprenticeship completion — and it already collects 3-, 6-, and 12-month follow-up. Providers below the target are at funding risk, which makes them motivated buyers.

**The measurement infrastructure is not quite free, and the gap is worth naming before a proposal claims otherwise.** Integrated Employment Services pays at 1, 3, 6, and 12 months; the pre-apprenticeship contract collects three of those four. Month 1 is measurement we would have to add ourselves, and it is the checkpoint closest to job start, where a placement is least stable.

Design: randomize at the **individual** level within a single provider, Trampoline-enabled versus usual process.

**No arm blocks anyone from a seat or a job.** The treatment arm uses attestations to trigger clinician-to-workplace contact and accommodation offers — the two strongly-evidenced levers — with placement available regardless of readiness.

A pre/post design will be dismissed as a selection effect by anyone who knows this field. The government's own evaluators flagged exactly that bias in their survey results, so proposing it would signal we had not read them.

## 8. Risks and how we hold them

| Risk | How we hold it |
| --- | --- |
| Reintroducing a health gate under pressure from an employer who wants one | It is not a policy, it is a type and two check constraints. An employment gate carrying a health requirement fails to parse and fails to insert. |
| The wedge is the whole product | The week 1-3 interviews are allowed to conclude this. If so, we are a reporting tool with a record attached, and we say so. |
| Employer behaviour does not change | Sell administrative and legal value — accommodation specification, audit trail, AI disclosure language — not persuasion. Verified quality signals left the 25-point disability callback gap intact. |
| Attestor payment | Uninsured third-party forms are billed to the patient, and our user cannot pay per attestation. WSIB's own rule is that when an employer uses a custom form, the employer pays the clinician. **Solve this before recruiting attestors.** |
| The benefits cliff | ODSP claws back 75 cents per dollar above $1,000/month, colliding with the 20-hour funding threshold. We cannot fix it and should not imply we can. |
| Attestation fraud | Attestors are org-bound accounts; medical and mental checks require regulated attestors; append-only records with revoke events. |
| Over-sharing health information | Two scoped views, mental domain unreachable, per-recipient revocable links, access log, no export. |
| Decay tuned wrong | Validity windows are data per check type, so they tune without a release. Since expiry no longer restricts access, the cost of getting this wrong is now a stale record rather than a stranded person. |
| We start looking like a competing clinic or job board | Apply the feature test before every build; ask before adding anything an incumbent already delivers. |
| Gatekeepers ignore the record | The falsification test in week 4-8 is designed to surface this before we scale. |
| **A wrong `claimable` verdict causes a provider to submit an invalid claim against their own funding contract** | This is our liability surface now, created by shipping a derivation. The evidence pack prints the basis for every verdict and lists its own assumptions and limits, so a provider can check us rather than trust us. One such defect has already happened and been fixed: an eight-hour employer letter was certifying twenty-four hours backed only by the client's word, and a passing test was asserting it. Found by audit, not by the test suite — so verdict logic gets adversarial review, not just coverage. |
| **The cumulative-aggregation assumption has no public source and changes verdicts** | Isolated in one named constant, disclosed on every screen and in the printed pack as an assumption rather than a fact, and now an explicit interview question rather than a footnote. If a provider contradicts it, one demo client's month-3 verdict flips and we will have learned it for the price of a phone call. |
| **The provider caseload has no organization scoping** | Acceptable while every client is synthetic; disqualifying the moment one is real. It is item 4 in the MVP order and blocks any pilot. Do not put real data behind this screen first and add scoping second. |
| **A demo cohort mistaken for real data** | Twelve synthetic fixtures at `@example.invalid` addresses, each engineered to produce one verdict. Say so the moment the screen is shown. A partner or researcher who discovers it later cannot distinguish "demo" from "fabricated," and would be right not to try. |

## 9. Standing decision rule

Ask before adding any feature that looks like competing with an incumbent. The default answer for delivery features is no; the default for connectors is "build the thinnest one that works."

And a second rule, from the research: **before adding anything that reads health data, name the surface it appears on.** If the answer is a hiring surface, the answer is no, and no amount of consent changes it.

## 10. Technology posture

The stack is described in [`../README.md`](../README.md). Constraints that come from this strategy rather than from engineering taste:

- The legal design rules in section 3 of the business design are enforced by types and database constraints, not conventions.
- Gates live as **data**, not branching code, so a partner's requirements change without a deploy.
- Attestations are **append-only** with revoke events.
- No health information blobs; scoped tokens for share links.
- Outcome tables mirror what funders settle on, so a claim stays reproducible after later corrections. The derived verdict and the recorded ledger are separate layers for exactly this reason.
- A document evidences the employment period it covers and no other, so hours worked and hours evidenced are distinct numbers and the product never claims more paper than it holds.

**One item moved out of this list, because stating it as a constraint was misleading.** Role-based access for person, attestor, org admin, provider, and funder does not exist at runtime; the demo has no access control at all. It is the next thing to build, not a property the system has, and it is item 4 in the MVP order above.
