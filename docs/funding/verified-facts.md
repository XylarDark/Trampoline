# Verified funding facts

**Verified 2026-09-07 against primary government sources.** Every figure here should be re-confirmed before it goes into an application. The "unsettled" section is as important as the rest — three items that circulate widely as fact could not be confirmed at all.

## SR&ED

### Rates and limits

| Item | Value |
| --- | --- |
| Enhanced refundable rate, CCPC | 35% on qualified expenditures up to the expenditure limit, 15% above |
| Expenditure limit | **$6M** for tax years beginning after 2024-12-15 (was $3M) |
| Taxable-capital phase-out | Begins at $15M prior-year taxable capital, nil at $75M |
| Capital expenditures | Eligible again, if made **after 2024-12-15** |
| Refundability | 100% refundable on *current* expenditures; only **40% refundable on capital** |

The 40% figure matters more than the $6M headline. As a pre-revenue company our claim is almost entirely salary, which is fully refundable — so the binding constraint is payroll, not the limit. The limit increase is close to irrelevant to us and should not appear in any pitch as though it were a benefit we capture.

### The eligibility test

CRA replaced the old five-question policy with **two requirements**, in guidelines dated 2021-08-13:

- **Why** — the work must seek a scientific or technological advancement, meaning *conceptual* knowledge, not factual knowledge like data or measurements. Uncertainty exists where it is unknown whether a result can be achieved because available knowledge is insufficient. "Available" means our own knowledge *plus* what is publicly reasonably available. **If we route around the uncertainty using known technique, the work is not eligible.** Success is irrelevant.
- **How** — a systematic investigation by experiment or analysis. CRA is explicit that *working systematically is not the same as a systematic investigation*. It requires a hypothesis, a test, logical conclusions, and **evidence kept as the work progresses**.

**Satisfy both frameworks.** The Tax Court still applies the five *Northwest Hydraulic* questions — it did so in a 2026 software case — even though CRA's published policy no longer leads with them.

### The framing that fits us: system uncertainty

CRA recognizes **"system uncertainty"** as a form of technological uncertainty: uncertainty arising "from or during the integration of technologies, the components of which are generally well known… due to unpredictable interactions between the individual components or sub-systems."

That is the strongest available framing for multi-attester reconciliation. The components — expiry dates, attestations, restriction codes — are individually unremarkable. The uncertainty is whether independent organizations' contradictory, separately-expiring assertions about one person can be resolved deterministically and explainably with no central authority and no shared clock.

CRA also lists characteristics suggesting insufficient knowledge, several of which describe our problem directly: existing design methods not applicable, too many variables or unknowns, the nature of the problem evolving, data not readily available, interlocking constraints.

### The exclusion that threatens us specifically

**Research in the social sciences or humanities is statutorily excluded**, as is routine data collection and market research.

We are a company in the employment-services sector. Every claim narrative must sit on the technology side of that line: the uncertainty in *building the system*, never the labour-market question the system helps answer. "Can restriction data predict work-disability duration" is a social-science question and is not claimable. "Can contradictory multi-attester assertions be reconciled deterministically" is a technology question and may be.

This is the single most likely reason a reviewer would reject our claim wholesale, and it is not a documentation problem — it is a framing problem that has to be right from the first entry in the log.

### Pre-claim approval — new, and the most useful thing on this page

Available since **2026-04-01**. Lets a business find out whether planned projects qualify **before starting the work or incurring the cost**.

- Eligible: CCPC or other Canadian corporation, **gross business income under $25M**, in good standing, project not previously claimed and not in litigation.
- Step 1: web form to request a case number. Existing claimants get contacted within 2 business days; everyone else within 5, by phone.
- Step 2: **Form T1322**, uploaded through My Business Account with the case number. Up to three projects per request.
- Step 3: meeting with a CRA SR&ED specialist within four weeks — **mandatory for new claimants**.
- Step 4: determination within **eight weeks**. Approval valid up to **three years**, and cuts expenditure-review processing from 180 to 90 days.

This directly answers the first open question in [`sred-log.md`](sred-log.md). Rather than documenting for a year and hoping, we can put the reconciliation work to CRA and get a three-year answer in about ten weeks. Do this before writing a line of the claimable work.

**Note what "planned" costs us, because it has already cost us something.** Outcome milestone derivation was implemented on 2026-09-07 and is therefore permanently outside this route; the money is spent and no determination can be sought. Our own log assesses it as not claimable anyway, so nothing was lost that we wanted — but the lesson generalizes. Multi-attester reconciliation is the only remaining candidate that is still unstarted, so it is the only thing the T1322 should name. Submitting work already done alongside it would invite scrutiny of the whole request.

Note the First-Time Claimant Advisory Service is a different thing: post-filing, mandatory only if CRA selects us, and it makes no eligibility determinations.

### Forms and deadlines

Form **T661** plus Schedule **T2SCH31**, both filed with the T2. Deadline is **18 months after fiscal year end** (12 months after the T2 due date). CRA does not accept changes after the deadline and recommends filing at least **90 days early** so missing information can still be fixed.

The narrative word limits define what to write: line 242 (350 words) the uncertainty, including **the state of the knowledge base at project onset and why it was insufficient**; line 244 (700 words) the work performed; line 246 (350 words) the advancement achieved or attempted.

### Why software claims fail

From decided cases, not commentary:

- **Routine engineering.** "There is no technological uncertainty if the resolution of the problem is reasonably predictable using standard procedure or routine engineering." A 2026 case allowed one software project and rejected another on this basis, while explicitly acknowledging the company "faced many obstacles." Obstacles are not uncertainty.
- **Uncertainty is judged objectively** — against what a competent professional in the field would know, not what our team happened not to know. Failing to lead evidence on the state of the art is fatal, and the onus is on the taxpayer.
- **Trial and error is not experimentation.** A claim was denied where the approach was trial-and-error with no evidence of testing results.
- **No contemporaneous record.** A 2020 case failed because the taxpayer "was unable to show that a detailed record of the hypotheses tested and results was kept as the work progressed," and the documents were not made contemporaneously.

### Documentation CRA names as acceptable

Dated, signed, specific to the work. Must show what was done, who was involved, when, and how the expenditure was calculated. CRA's list includes: project planning documents, experimentation plans, design documents, project records, **design, system architecture, and source code**, records of trial runs, progress reports, **minutes of project meetings and virtual meeting chats**, **whiteboard drawings**, test protocols and results, time sheets and activity records, payroll records, invoices.

Our git history plus a dated weekly technical entry covers most of this natively, and the **dated state-of-the-art record** that line 242 asks for now exists twice in [`sred-log.md`](sred-log.md) — once for the project at onset and once for outcome milestone derivation specifically. That gap is closed.

**The remaining gap was never documents, it was discipline — and it is now half closed.** Git history is contemporaneous evidence only if the work is committed as it happens, and a log entry carries a tamper-evident date only once it is committed *separately from and before* the code it describes. This was got wrong on 2026-09-07: a state-of-the-art entry written before the work sat uncommitted in the same working tree as the finished code for hours, which left the ordering resting on file modification times. Modification times are not evidence.

Later the same day the whole tree was committed and pushed, docs in separate commits from code, so from that point every entry carries a date attested by GitHub rather than asserted by our own machine. **What that fixes is the future, not the past.** The one entry written before its code still has no ordering evidence and never will. Treat the rule as the actual documentation requirement — write the entry, commit it alone, push it, then work — because the documents were never the hard part. The closure is recorded in [`sred-log.md`](sred-log.md) under "Commit discipline established", including what it does not repair.

## Ontario provincial credits — an open gap

Not researched, and material. The Ontario Innovation Tax Credit and Ontario Research and Development Tax Credit stack on federal SR&ED. There is an unconfirmed indication that Ontario's credit remains tied to the old $3M expenditure limit, and that only British Columbia had announced alignment with the federal changes. **Close this before modelling any combined recovery rate.**

## NRC IRAP

- **There is no web form.** The official route is phone-first: a senior executive of the business calls **1-877-994-4727**. The contact centre decides whether we are ready to meet a client engagement advisor, who may then refer us to an Industrial Technology Advisor. Any third-party site offering an "IRAP application form" is not the official route.
- Eligibility: incorporated, for-profit, operating in Canada, **up to 500 full-time employees**, developing and commercializing innovative technology, positioned to create Canadian economic benefit. **No revenue floor** — pre-revenue is not a stated bar. Excluded: ULCs, LLCs, sole proprietorships, partnerships, co-operatives. An Ontario CCPC qualifies.
- Have ready: CRA business number, business plan, recent financial statements, ownership structure, and résumés for the management and technical team.
- Service standards: enquiry response within 5 business days. Funding decisions within 20 business days for contributions of $50K or less, 30 for $50K-$500K (2024-25 actual averages: 9 and 20 days).
- Not funded: day-to-day operating costs, non-technical or purely commercial activity, work done outside Canada, research with limited commercialization potential.
- **NRC never describes advisory services as "free"** — it says advice and connections are provided, and funding only "in some cases." Our own documents should not overstate this either.
- **Planning item: IRAP is to be integrated into the Canada Innovation Corporation no later than 2026-27.** That is inside our horizon. NRC says IRAP remains with NRC until then.

**No official contribution range exists.** The widely-circulated figures — "$75K-$200K typical for first-time applicants," "80% of salary costs," named sub-streams with dollar totals — come from consultancy and grant-marketing sites and could not be confirmed on nrc.canada.ca. Do not rely on them, and do not repeat them to anyone.

## Transfer Payment Ontario

- Registration **completes in-session**: create an Ontario.ca Login, search first to avoid duplicate registration, then seven steps ending in a confirmation page.
- **What gets processed is system access,** not the registration: "up to five business days," and Ontario advises registering well before any deadline. One ministry program guide advises allowing up to two weeks for the whole enrolment; plan against the longer figure.
- Required: CRA **business number** (or complete the CRA Program Account Checklist if none), legal name as on the articles of incorporation, operating name, and **at least two contacts** including one senior contact with signing authority.
- **Tax Compliance Verification is not universally required** — only where cumulative provincial funding in the prior year was $10M or more, or the agreement is worth $10M or more in any year. Not a concern for us; the attestation is still part of the profile.
- Support: TPON Client Care, 1-855-216-3090, TPONCC@ontario.ca, weekdays 8:30-17:00.

**Skills Development Fund Training Stream:** routes through TPON, and **a for-profit software vendor is not an eligible lead applicant.** Eligibility runs to employers, non-profits, associations, unions, municipalities, hospitals and similar; colleges and career colleges only as co-applicants. Round 6 closed 2025-10-01 and **no Round 7 has been announced**. Our route is as a technology partner to an eligible lead — which was the plan, but the eligibility rule is now confirmed rather than assumed.

## Unsettled — do not budget against these

1. **Cloud computing eligibility for SR&ED.** No CRA policy, guideline, or glossary entry names cloud computing, hosting, SaaS, or IaaS. The eligibility argument is an inference from two CRA statements: that current expenditures after 2024-12-15 for the *right to use* property may qualify, and that overhead must be directly related and incremental. Pulling the other way, CRA explicitly treats internet service as a non-incremental ordinary business expense and a dedicated telecommunications line as an equipment lease — a reviewer could reason straight from that analogy to our always-on hosting bill. Secondary sources conflict: one large accounting firm lists cloud space as eligible, a specialist vendor calls it "a gray area." **Raise it in the pre-claim approval application. Do not treat it as certain.**
2. **The legislative citation for the $6M limit and capital reinstatement.** Multiple secondary sources attribute both to a bill receiving Royal Assent on 2026-03-26. The *figures* are confirmed directly by CRA; only the bill number and date are unverified.
3. **WSIB's 2026 competition status.** See [`wsib-collaborator.md`](wsib-collaborator.md). The page asserts a competition opening in early 2026 but was last updated 2025-09-17, and no call, dates, or cancellation notice exists anywhere. Whether it opened and closed, was deferred, or was cancelled cannot be determined from public sources.

## Related

- [`sred-log.md`](sred-log.md) — contemporaneous documentation
- [`irap-and-tpon.md`](irap-and-tpon.md) — sequencing
- [`swif-partner.md`](swif-partner.md), [`wsib-collaborator.md`](wsib-collaborator.md)
