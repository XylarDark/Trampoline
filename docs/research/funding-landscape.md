# Trampoline: Ontario & Canadian Funding Landscape

> **Compiled 2026-09-07 by web research.** Every factual claim below links to a source URL that was actually retrieved during that research pass. **Intake statuses, deadlines, award sizes and eligibility rules change frequently — re-verify each program directly with the funder before acting on anything in this document.** Sources marked *(third-party)* are aggregator or consultancy sites, not funders; treat their numbers as leads to verify, not as authoritative.

---

## The single most important finding: legal form, not fit

Trampoline's biggest funding constraint is not fit — it's **legal form**. The Ontario workforce-and-disability funding stack is built to pay *service deliverers* (nonprofits, municipalities, colleges, employers), not *software vendors*. Across the 13 channels researched, a for-profit software company is outright ineligible as lead applicant in Ontario Trillium Foundation (all streams), WSIB research grants, Skills Advance Ontario's service-provider stream, and effectively in the Skills Development Fund Training Stream. The programs that *do* accept for-profits (SR&ED, IRAP, SWIF, Opportunities Fund) either fund R&D rather than deployment, or require the project to be non-commercial or multi-stakeholder.

The practical consequence: **near-term non-dilutive money comes from tax credits and R&D advisory; program money requires a partner organization to hold the agreement.** Plan accordingly.

---

## Part 1: What outcome metrics funders actually pay on

This matters more than any single grant, because it determines whether Trampoline's "readiness levels" are fundable at all. The good news is that Ontario funders pay on a small, well-documented set of numbers, and several of them map almost directly onto what a router-and-progress-record can produce.

### ODSP Employment Supports — the clearest fee schedule in Ontario

Service providers earn defined amounts at defined milestones ([ODSP directive 5.1](https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/51-employment)):

| Milestone | Payment |
|---|---|
| 6 cumulative weeks in competitive employment at minimum wage or better | $1,000 |
| 13 cumulative weeks (inclusive of the 6) | $6,000 |
| Job retention, ODSP income support recipients | 60% of chargeable monthly earnings for up to 33 months; minimum $250/month for first 15 months |
| Job retention, non-recipients | $250/month for up to 15 months |
| Self-employment business plan | $600 interim |
| $400 cumulative net business income | milestone payment |
| $800 cumulative net business income | placement payment |

Providers can earn at most **two times** their negotiated job-placement target in milestone payments. Funding flows monthly in advance but is *earned* only on outcomes, and is subject to reconciliation and recovery ([directive 5.1](https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/51-employment); [2023–24 MCCSS service objectives](https://www.ontario.ca/document/mccss-service-objectives-social-assistance-0/services-delivered-job-retention-and)).

The tracked data points are precisely dates and earnings: the dates a client hit 6 and 13 cumulative weeks, hourly wage per month, whether the client is working at **15 months** and at **33 months**, and monthly net business income ([directive 6.4](https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/64-performance)). This is recorded in the ESMS Service Provider Module, which is what actually triggers payment.

### Integrated Employment Services (the SSM model) — enrollment-weighted, 12-month horizon

Under the SSM model, subcontracted providers see a materially different schedule. The ODE Network's [Tangled in Red Tape](https://www.odenetwork.com/wp-content/uploads/2024/06/Tangled-In-Red-Tape.pdf) documents the post-transition payment points as:

| Payment point | Amount |
|---|---|
| New jobseeker enrollment | $2,000 |
| Job placement (1 month) | $300 |
| Retention at 3 months | $600 |
| Retention at 6 months | $900 |
| Retention at 12 months | $1,200 |
| **12-month performance-based subtotal** | **$5,000** |

That $5,000 compares against $9,125–$15,125 under the legacy ODSP-ES specifications — a roughly **45% reduction** in per-client incentive revenue. About 40% of available incentives are front-loaded at enrollment, and there are **no incentives for retention beyond 12 months**, nor for wage increases or advancement.

Two design details will shape Trampoline's product: the **"20 hour rule"** (no performance incentive unless the placement is 20+ hours/week) and the absence of any partial credit for part-time work. Providers report this pushes them away from clients with disabilities and significant barriers ([Tangled in Red Tape](https://www.odenetwork.com/wp-content/uploads/2024/06/Tangled-In-Red-Tape.pdf); [ODE summary of the third-party evaluation](https://www.odenetwork.com/wp-content/uploads/2026/02/Early-signs-of-trouble-EST-evaluation.pdf)).

### EST evaluation benchmark numbers

The third-party evaluation of Employment Services Transformation gives the benchmark numbers a funder will compare Trampoline against ([Maytree-hosted EST evaluation report](https://maytree.com/wp-content/uploads/Final-EST-Evaluation-Report.pdf)):

- Share in a permanent job: **78% at exit rising to 81% at 12 months**
- Employed 20+ hours/week: **86% at exit, declining to 62% at 12 months** (87% at some point during the year)
- Average hourly wage: **$18.60 at exit, $19.60 at 12 months**
- Employment rates for social-assistance-referred clients who completed pre-employment services: **56% at 3 months**, versus 48% at 3 months in matched comparison communities

That 86%→62% collapse in hours between exit and 12 months is, bluntly, the single best commercial argument Trampoline has. It is a documented, quantified, funder-acknowledged failure mode in exactly the space a staged readiness record addresses.

### Legacy Employment Ontario framework — the weighting model

The Employment Service Performance Management System sets a Provincial Service Quality Standard across seven core measures in three weighted dimensions ([ES Program Guidelines](https://eopg.labour.gov.on.ca/wp-content/uploads/2025/04/es-guidelines-2017-en.pdf)):

| Dimension | Weight | Core measures |
|---|---|---|
| Effectiveness | **50%** | Participant Suitability (15%) plus service impact (employment/career path, training/education outcomes) |
| Customer Service | **40%** | Customer Satisfaction (15%, a 1–5 "would you recommend" from both clients *and employers* at exit) plus Service Coordination |
| Efficiency | **10%** | Activity levels in assisted services and workshops |

Note the Service Coordination measure specifically: it counts **supported referrals in and out**, with four indicators ([data integrity guide](https://eopg.labour.gov.on.ca/wp-content/uploads/2025/01/es-training-manual-data-integrity-en.pdf); [participant guide](https://eopg.labour.gov.on.ca/wp-content/uploads/2025/04/es-best-practices-participant-guide-en.pdf)). Trampoline is a referral router. **This is a core measure that Trampoline directly improves and can evidence** — arguably the tightest product-to-metric fit in the whole landscape.

### Ontario Works — outcome-based with recovery risk

Ontario Works program delivery funding is split: the 50/50 portion is expenditure-based, while the portion subject to provincial upload is **outcomes-based, with up to 15% recoverable for non-achievement** at the end of the multi-year business cycle ([OW directive 11.3](https://www.ontario.ca/document/ontario-works-policy-directives/113-cost-sharing)). Delivery sites negotiate against four outcome measures totalling 1,000 weighted points, with no single earnings/employment outcome permitted more than 600 points. The measures include the percentage of adults with participation requirements who have a proper Action Plan created, the percentage referred to Employment Ontario, and cases that exited to employment ([2026–27 MCCSS service objectives](https://www.ontario.ca/document/2026-2027-mccss-service-objectives-social-assistance/ontario-works-administration)).

Since November 10, 2025, employment-ready OW applicants are **automatically referred** to Employment Ontario via a readiness assessment embedded in the provincial digital application ([City of Brantford report](https://pub-brantford.escribemeetings.com/filestream.ashx?DocumentId=30995)). The province has already built a readiness-assessment-to-referral pipe. Trampoline should position as complementary to it, downstream, and multi-attester — not as a competitor.

### Skills Development Fund — the ministry's headline metric

Through Rounds 1–5, the SDF Training Stream reports having helped more than 120,000 participants **find employment within 60 days of completing their program** ([Ontario Newsroom, August 25, 2026](https://news.ontario.ca/en/release/1007932/ontario_investing_48_million_to_protect_and_train_workers_in_simcoe_and_surrounding_area)). "Employment within 60 days of program completion" is the number SDF applications are judged on.

### WSIB — duration thresholds

WSIB's research priorities explicitly ask how to identify people **at risk of claim duration beyond 3 months and 6 months**, and what tools and services build employer capacity to support return-to-work outcomes ([2025 Research and Grants Agenda](https://www.wsib.ca/en/2025-research-and-grants-agenda)). Duration-beyond-3-months and duration-beyond-6-months are the WSIB-side metrics.

### Consolidated: the metrics Trampoline must emit natively

Every one of these appears in at least one funder's payment or reporting schedule above:

- Enrollment date
- Referral in and out, with destination and acceptance
- Placement date
- 6-week and 13-week cumulative employment flags
- Employment status at 1, 3, 6, 12, 15 and 33 months
- Weekly hours, with a 20-hour threshold flag
- Hourly wage and monthly chargeable earnings
- Employment within 60 days of program completion
- Claim/case duration past 3 months and past 6 months
- Exit satisfaction from **both** the client and the employer

---

## Part 2: Tier A — realistically winnable within 6 months by a tiny unfunded team

Only three items qualify, and two are tax/advisory rather than grants. This is a realistic assessment, not a pessimistic one.

### A1. SR&ED investment tax credit

- **Funder / administering body:** Canada Revenue Agency
- **What it funds:** eligible R&D expenditures, retroactively, as a refundable tax credit
- **Eligibility:** most Canadian-controlled private corporations (CCPCs). For-profit corporations qualify; this is the enhanced-rate regime designed for them
- **Award size:** **35% refundable ITC** on qualified expenditures up to an expenditure limit that **doubled from $3 million to $6 million** for tax years beginning after December 15, 2024, making the maximum refundable credit **$2.1 million annually** ([CRA](https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program/sred-claim/investment-tax-credit.html)). Credit on current expenditures is 100% refundable up to the limit; capital expenditures are 40% refundable
- **Cost-share / matching:** none
- **Intake status as of 2026:** always available; filed with the corporate return, no window. Phase-out thresholds rose to **$15 million–$75 million** of taxable capital, and CCPCs may now **elect a gross-revenue averaging method instead** — which matters specifically for early-stage firms with little revenue ([BDO](https://www.bdo.ca/insights/sr-ed-program-enhancements-and-updates-draft-legislation-released); [KPMG](https://kpmg.com/ca/en/insights/2026/02/canadas-sr-and-ed-program-enters-a-new-era.html))
- **Effort and timeline:** low-to-moderate, and the only item here with essentially no rejection-by-eligibility risk. Capital expenditures were reinstated, reversing the 2012 policy, and KPMG lists **fees for software and cloud space used for development** among newly eligible costs, with software and AI named as a benefiting sector ([KPMG](https://kpmg.com/ca/en/insights/2026/02/canadas-sr-and-ed-program-enters-a-new-era.html))
- **Next concrete action:** Start contemporaneous SR&ED documentation **now** for the technically uncertain parts of the build — the attestation-verdict state machine, expiry/restriction reconciliation across multiple independent attesters, and gate evaluation logic. Routine CRUD and UI work will not qualify
- **Evidence required:** technical narratives establishing genuine uncertainty and systematic investigation, plus time-tracking allocating developer hours to specific SR&ED projects

### A2. NRC IRAP advisory relationship

- **Funder / administering body:** National Research Council Canada, Industrial Research Assistance Program
- **What it funds:** advisory services first; project contributions later
- **Eligibility:** **incorporated, for-profit, operating in Canada; up to 500 FTE; developing and commercializing innovative technology-driven products or services; ready to create economic benefits in Canada** ([NRC](https://www.nrc.canada.ca/en/support-technology-innovation/financial-support-technology-innovation); [NRC IRAP brochure, 2026](https://publications.gc.ca/collections/collection_2026/cnrc-nrc/NR16-208-2026-eng.pdf)). Nonprofits are ineligible
- **Award size:** advisory services are unpriced; contribution funding is set per project. Third-party guidance notes companies typically co-fund roughly 20–25% of eligible project costs ([Enno Consulting](https://enno.ca/nrc-irap-canada-innovation-funding-guide/), *third-party*)
- **Cost-share / matching:** typically 20–25% company contribution on funded projects ([Enno Consulting](https://enno.ca/nrc-irap-canada-innovation-funding-guide/), *third-party*)
- **Intake status as of 2026:** **no application form and no intake deadline.** Access runs entirely through an assigned Industrial Technology Advisor. NRC states plainly that the relationship "typically starts with advice and referrals before any funding is provided" ([NRC](https://www.nrc.canada.ca/en/support-technology-innovation/financial-support-technology-innovation)). Third-party guidance describes the ITA as both gatekeeper and advocate ([Enno](https://enno.ca/nrc-irap-canada-innovation-funding-guide/); [GrantHub](https://granthub.ca/guide/nrc-industrial-research-assistance-program), both *third-party*)
- **Effort and timeline:** treat as a **6-month relationship-building play with a 12–18 month funding horizon**, not a 6-month money play. The ITA is also the best single source of warm referrals into other programs
- **Next concrete action:** Call **1-877-994-4727** or email **info@nrc-cnrc.gc.ca** to request an ITA assignment
- **Evidence required:** CRA business number, business plan, recent financial statements, ownership structure, and team résumés ([NRC](https://www.nrc.canada.ca/en/support-technology-innovation/financial-support-technology-innovation))

### A3. WSIB Health and Safety Excellence program — as a distribution channel, not a grant

- **Funder / administering body:** WSIB Ontario
- **What it funds:** premium rebates to **employers**, not vendors. **Trampoline cannot receive HSEp money** — this is a commercial channel, not a funding source
- **Eligibility:** employers with an active WSIB account and at least one paid employee ([WSIB](https://www.wsib.ca/en/healthandsafety)). Only **Schedule 1** businesses paying premiums can receive rebates; Schedule 2 businesses cannot ([program manual](https://healthandsafety.wsib.ca/sites/default/files/2024-12/HSEp_ProgramManualENG_2025FINAL.pdf))
- **Award size:** **$1,000 on action-plan approval**, plus a per-topic rebate scaled to prior-year premiums. WSIB reports small businesses average about $9,000/year and large businesses about $40,000/year ([WSIB](https://www.wsib.ca/en/healthandsafety)). Per-topic rebates by premium band run from **$2,000 at the $1–$50,000 band up to $50,000 at $5,000,001+**, capped at **200% of the previous year's reported premiums** per action plan ([NORCAT](https://www.norcat.org/advisory/wsib-excellence.html), *third-party approved provider*; [Safety Training and Consulting](https://safetytrainingandconsulting.ca/wsib-excellence/), *third-party approved provider*)
- **Cost-share / matching:** employers pay approved-provider fees; WSIB states rebates and incentives are typically higher than provider fees ([WSIB](https://www.wsib.ca/en/healthandsafety))
- **Intake status as of 2026:** ongoing. Employers register with a WSIB-approved provider, select from **41 topics across three levels**, have 12 months to complete topics, and submit evidence for validation. Rebates are paid quarterly after validation ([WSIB FAQ](https://www.wsib.ca/en/health-and-safety-excellence-program-frequently-asked-questions); [WSIB](https://www.wsib.ca/en/healthandsafety))
- **Effort and timeline:** low for Trampoline — this is a partnership conversation, not an application
- **Next concrete action:** Contact one or two WSIB-approved program providers (for example NORCAT) and ask whether an attestation-and-restriction tracking record helps their members produce validation evidence for return-to-work-related topics
- **Evidence required:** a demonstration that Trampoline's record output maps to specific HSEp topic validation requirements
- **Flag:** this is revenue strategy, not grant strategy. Do not put it in a funding plan as a grant

---

## Part 3: Tier B — winnable with a named partner as applicant or co-applicant

This is where the real money is, and every item requires someone else to hold the agreement or co-sign it.

### B1. Sectoral Workforce Innovation Fund (SWIF) — the best-timed opportunity in this report

- **Funder / administering body:** Employment and Social Development Canada, under the Sectoral Workforce Development Program
- **What it funds:** projects responding to skilled labour shortages in priority sectors. Explicitly includes **faster training approaches, micro-credentials, skills assessments, targeted certification programs** ([ESDC news release](https://www.canada.ca/en/employment-social-development/news/2026/08/the-government-of-canada-is-launching-a-call-for-proposals-under-the-sectoral-workforce-innovation-fund-to-support-workforce-projects-across-key-se.html)). Eligible costs include **digitization costs such as adapting existing training, curricula and other resources to an online platform**, computer services, professional fees, wages, purchase or rental of computers, and overhead up to **15%** of ESDC's contribution ([Who can apply](https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/who-can-apply.html))
- **Eligibility:** **for-profit organizations are eligible.** But the who-can-apply page attaches a decisive condition to both nonprofit and for-profit applicants: **"funding recipients cannot represent the interests of a single enterprise. Eligible initiatives must represent a collaborative effort among multiple stakeholders that share common workforce needs or skills gaps."** The same page states that **"workforce intermediaries, sector councils and convening organizations that can aggregate employer demand and coordinate workforce solutions across sectors or regions are encouraged to participate"** ([Who can apply](https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/who-can-apply.html)). Also eligible: Indigenous organizations, provincial/territorial governments, post-secondary and training institutions, agencies, Crown corporations, and municipal governments
- **Award size:** up to **$10,000,000 per project**, maximum **36 months** ([Overview](https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/overview.html))
- **Cost-share / matching:** at least **25% from the private sector**; ESDC pays up to **75%** of total project cost, which is also the stacking limit for all government funding combined. In-kind contributions count if valued at fair market value ([Prepare to apply](https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/prepare-application.html))
- **Intake status as of 2026:** **OPEN.** Announced August 28, 2026; continuous intake **open since August 25, 2026 at 1:00 p.m. EDT, until funds are exhausted** ([news release](https://www.canada.ca/en/employment-social-development/news/2026/08/the-government-of-canada-is-launching-a-call-for-proposals-under-the-sectoral-workforce-innovation-fund-to-support-workforce-projects-across-key-se.html); [How to apply](https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/apply.html))
- **Effort and timeline:** two stages. Stage one is a **Statement of Interest** (form EMP5741, 17 pages) emailed to `EDSC.DGOP.FIMS-SWIF.POB.ESDC@servicecanada.gc.ca`; only successful SOIs are invited to submit a full proposal, and **responses are only provided to those selected** ([How to apply](https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/apply.html); [form catalogue](https://catalogue.servicecanada.gc.ca/content/EForms/en/Detail.html?Form=EMP5741)). Realistically: SOI in weeks, full proposal and decision in many months
- **Next concrete action:** Recruit a **convening organization** — a sector council, industry association, or workforce planning board — to lead an SOI in one sector with a documented labour shortage and a high injury/absence rate (long-term care and construction are the obvious candidates given SDF's stated priorities). Trampoline appears as the shared readiness-and-referral infrastructure, not as the applicant's product
- **Evidence required:** named multi-employer consortium with letters, aggregated vacancy data for the target occupations, at least 25% private cash or valued in-kind, and outcome targets expressed as placements and retention
- **Flag:** the predecessor Sectoral Workforce Solutions Program excluded **"products that only one organization uses"** and **"human resources tools developed solely for one employer's use"** ([helloDarwin program guide](https://hellodarwin.com/business-aid/programs/sectoral-workforce-solutions-program), *third-party*). Structure the deliverable as shared sector infrastructure with multiple attesting partners, or expect an eligibility problem

### B2. Opportunities Fund for Persons with Disabilities

- **Funder / administering body:** Employment and Social Development Canada
- **What it funds:** helping persons with disabilities prepare for, find and keep employment, and helping employers build inclusive workplaces
- **Eligibility:** **for-profits are eligible — conditionally.** The list includes "for-profit organizations (if nature and intent of the activity in its proposal is non commercial, not intended to generate profit, and supports program priorities and objectives)" ([Apply for funding](https://www.canada.ca/en/employment-social-development/services/funding/disability-opportunity-national-regional.html)). The applicant guide repeats this and adds that **project activities must go beyond your organization's normal activities** ([Applicant guide](https://www.canada.ca/en/employment-social-development/services/funding/disability-opportunity-national-regional/applicant-guide.html)). Also eligible: not-for-profits, municipal governments, educational institutions and school boards, Indigenous organizations, and provincial/territorial entities with ministerial approval. That non-commercial condition is a genuine obstacle for a commercial SaaS product — a for-profit can hold the grant, but not to fund building and selling its platform
- **Award size:** up to **$15,000,000** over up to **3 years (36 months)**, split into a National component (3+ provinces/territories) and a Regional component (1–2). One proposal per component ([Apply for funding](https://www.canada.ca/en/employment-social-development/services/funding/disability-opportunity-national-regional.html)). Calibrate expectations to actual awards: one recent Ontario-relevant example was **$1.6 million to serve 97 persons with disabilities** ([ESDC](https://www.newswire.ca/news-releases/government-of-canada-invests-in-skills-training-for-youth-and-persons-with-disabilities-869811603.html))
- **Cost-share / matching:** not stated as a fixed requirement; the application collects contributions from named partner sources ([Applicant guide](https://www.canada.ca/en/employment-social-development/services/funding/disability-opportunity-national-regional/applicant-guide.html))
- **Intake status as of 2026:** **closed.** The most recent call for proposals ran **May 30 to July 22, 2022** ([Healthy Aging CORE mirror of the CFP](https://healthyagingcore.ca/funding-opportunities/apply-for-funding-opportunities-fund-for-persons-with-disabilities-national-or-regional-component)). But the forward outlook is unusually good: annual funding has been **stabilized at $105 million starting in 2027–28** through the 2026 Spring Economic Update, described by the government as **doubling** annual funding for disability-inclusive employment supports ([ESDC news release, July 2026](https://www.canada.ca/en/employment-social-development/news/2026/07/government-of-canada-invests-over-15-million-to-help-remove-employment-barriers-for-youth-and-persons-with-disabilities.html); [Parliamentary Secretary statement](https://www.newswire.ca/news-releases/parliamentary-secretary-church-shares-canada-s-commitment-to-ensure-the-full-inclusion-of-persons-with-disabilities-at-the-united-nations-829776235.html)). The Fund currently provides nearly $100 million per year through fiscal 2026–27 ([Employment Strategy](https://www.canada.ca/en/employment-social-development/programs/disability-inclusion-action-plan/employment-strategy.html))
- **Effort and timeline:** a full ESDC proposal; assume a multi-month drafting effort and a decision cycle measured in seasons. A 2027 play
- **Next concrete action:** Identify two or three current Opportunities Fund recipients in Ontario and approach them as the applicant of record for a future call, with Trampoline as the measurement-and-referral layer
- **Evidence required:** a named disability-serving organization, participant volume targets, and a design where Trampoline's role is infrastructure the funder is buying for the sector rather than a product being commercialized. An evaluation found every $1 invested yields **$1.31 in return** ([ESDC](https://www.newswire.ca/news-releases/government-of-canada-invests-in-skills-training-for-youth-and-persons-with-disabilities-869811603.html)) — mirror that benefit-cost framing

### B3. WSIB Research and Grants Program — collaborator, not lead

- **Funder / administering body:** WSIB Ontario, under section 159(5) of the *Workplace Safety and Insurance Act*
- **What it funds:** practical research and training studies that strengthen Ontario's workers' compensation system. Priorities: how we work, how we approach health and safety, and how we support return-to-work and recovery ([Research and Grants Program](https://www.wsib.ca/en/research-and-grants-program); [Proposal instructions](https://www.wsib.ca/en/research-and-grants-program-proposal-instructions))
- **Eligibility:** **hard wall, stated explicitly — "Private organizations are not eligible to apply for a WSIB research grant as a Project Lead. Private organizations may be identified as a partner or collaborator of an eligible applicant organization."** Eligible leads are publicly funded universities or colleges, public hospitals with a specialized research area, not-for-profit or registered charitable organizations with research capability, Canadian NGOs with research capability, and "other organizations that have the capability and capacity to conduct research and are not privately owned and operated" ([Proposal instructions](https://www.wsib.ca/en/research-and-grants-program-proposal-instructions)). The workable path is the collaborator role: **"Collaborators may be eligible to receive project funds for specified services or resources if it can be demonstrated that their contribution is essential to the work being undertaken and not otherwise available to the project team"**
- **Award size:** the 2025 competition awarded up to **$2.0 million total**, with a maximum of **$150,000 per year for a total of $300,000** over up to 24 months; grants are not renewed for the same purpose ([Proposal instructions](https://www.wsib.ca/en/research-and-grants-program-proposal-instructions))
- **Cost-share / matching:** none stated. Note that Project Lead, Secondary Lead and Co-Applicants are **not eligible to receive salary support** from a WSIB grant
- **Intake status as of 2026:** **uncertain.** The WSIB page states the **2026 grants competition "will open in early 2026,"** with details to be posted there ([Research and Grants Program](https://www.wsib.ca/en/research-and-grants-program)). As of 2026-09-07 the page still carried that forward-looking language and I could not confirm whether the 2026 competition opened, is open, or has closed. WSIB's 2026 policy agenda confirms it will keep supporting research grants for scientific reviews through the WorkSafe Ontario Fund ([policy agenda](https://www.wsib.ca/en/wsib-policy-agenda-2026))
- **Effort and timeline:** two-staged. The prior cycle ran initial proposals due October 11, 2024, invited detailed proposals by February 14, 2025, peer review in March, and executive approval in May 2025 — roughly a **seven-month decision cycle** ([Proposal instructions](https://www.wsib.ca/en/research-and-grants-program-proposal-instructions)). Quarterly progress reporting is required
- **Next concrete action:** Email **grants@wsib.on.ca** to confirm the 2026/2027 competition timing, then approach the Institute for Work & Health or an Ontario university occupational health researcher to lead a proposal on early identification of prolonged-duration risk, with Trampoline as a funded collaborator supplying the attestation and restriction dataset
- **Evidence required:** an eligible academic or nonprofit Project Lead, plus a demonstration that Trampoline's data is essential and not otherwise available. WSIB administrative data can be requested for a grant project, and proposals are strengthened by linking it to external datasets ([2025 Agenda](https://www.wsib.ca/en/2025-research-and-grants-agenda))
- **Two constraints to design around:** **"The WSIB cannot actively support recruitment or refer individuals to a program for the purpose of a grant project"** — you cannot count on WSIB to fill a pilot cohort. And training grants **"are not intended to replace or supplement the professional vocational rehabilitation services provided through the WSIB Work Reintegration program"** ([2025 Agenda](https://www.wsib.ca/en/2025-research-and-grants-agenda); [Proposal instructions](https://www.wsib.ca/en/research-and-grants-program-proposal-instructions))

### B4. Ontario Skills Development Fund, Training Stream

- **Funder / administering body:** Ministry of Labour, Immigration, Training and Skills Development
- **What it funds:** innovative projects addressing challenges to hiring, training or retaining workers, including apprentices. Applications must show focus on in-demand and key growth target sectors and occupations ([SDF Training Stream](https://www.ontario.ca/page/skills-development-fund-training-stream?redirect_id=page%2Fskills-development-fund&redirect_year=2025))
- **Eligibility:** eligible primary applicants are **employers in Ontario**, minister-approved non-college apprenticeship training delivery agents, **non-profit organizations** including Indigenous Band offices and ISET agreement holders, professional/industry/employer associations, trade unions or union-affiliated organizations, municipalities, DSSABs, CMSMs, and hospitals. Educational organizations — school boards, colleges, universities, Indigenous Institutes, career colleges — are eligible only **as co-applicants** ([SDF Training Stream](https://www.ontario.ca/page/skills-development-fund-training-stream?redirect_id=page%2Fskills-development-fund&redirect_year=2025)). Round 6 also named service system managers among eligible organizations ([Ontario Newsroom](https://news.ontario.ca/en/release/1006247/ontario-investing-260-million-to-protect-and-train-workers))
- **Award size:** Round 6 provided **$260 million** across the round; individual projects vary widely (a recent regional announcement covered $4.8 million across three projects) ([Ontario Newsroom](https://news.ontario.ca/en/release/1006247/ontario-investing-260-million-to-protect-and-train-workers); [Ontario Newsroom, Simcoe](https://news.ontario.ca/en/release/1007932/ontario_investing_48_million_to_protect_and_train_workers_in_simcoe_and_surrounding_area))
- **Cost-share / matching:** not stated as a fixed provincial requirement in the pages retrieved; Round 6 is funded exclusively by the Government of Ontario ([Ontario Newsroom](https://news.ontario.ca/en/release/1007932/ontario_investing_48_million_to_protect_and_train_workers_in_simcoe_and_surrounding_area))
- **Intake status as of 2026:** **closed, with Round 7 not yet announced.** Round 6 opened July 29, 2025 and closed **October 1, 2025** ([Ontario Newsroom](https://news.ontario.ca/en/release/1006247/ontario-investing-260-million-to-protect-and-train-workers); [SDF Training Stream](https://www.ontario.ca/page/skills-development-fund-training-stream?redirect_id=page%2Fskills-development-fund&redirect_year=2025)). **But Round 7 is funded and expected.** Between January and May 2025 Ontario committed an additional $805 million over three years, of which **$705 million is allocated across Rounds 6, 7 and 8, expected to occur between 2025/26 and 2027/28** ([Auditor General performance audit](https://www.auditor.on.ca/en/content/specialreports/specialreports/en25/AR-PA_SDF-TS_en25.pdf)). At Public Accounts on December 1, 2025, the Deputy Minister stated the ministry is building a program dashboard with KPIs tied to government priorities and value-for-money metrics, with **"full implementation expected by summer 2026, prior to the launch of round 7"** ([committee transcript](https://www.ola.org/en/legislative-business/committees/public-accounts/parliament-44/transcripts/committee-transcript-2025-dec-01)). Round 6 results were still being announced as recently as **August 25, 2026** ([Ontario Newsroom](https://news.ontario.ca/en/release/1007932/ontario_investing_48_million_to_protect_and_train_workers_in_simcoe_and_surrounding_area)). Ontario has not published a fixed schedule for the next round ([GrantHub](https://granthub.ca/guide/skills-development-fund-ontario), *third-party*)
- **Effort and timeline:** substantial. Applications go through Transfer Payment Ontario and Service Provider Connect, with an eligibility check gate before the form opens ([Applicant Support Guide](https://forms.mgcs.gov.on.ca/dataset/5f0dd16c-f826-4cc4-822e-42e82c78b991/resource/87f8c53b-8e3a-4772-8fa0-a3665d81314e/download/2025-26-applicant-support-guide_en.pdf)). Round 6 ran roughly nine to thirteen months from close to project announcements
- **Next concrete action:** Now, before Round 7 opens, register the organization on **Transfer Payment Ontario** so Trampoline can be added to a partner's application without delay, and start conversations with two or three prospective lead applicants
- **Evidence required:** a lead applicant in a priority sector, participant targets, and a credible plan to hit employment-within-60-days-of-completion
- **Flag:** a for-profit software vendor is not a listed category. "Employers in Ontario" is technically open to you as an employer, but the program funds training *of workers* in priority sectors responsive to employers' needs. **A nonprofit, association, employer, or SSM must hold this**

### B5. Skills Advance Ontario

- **Funder / administering body:** Ontario MLITSD with the Government of Canada, under the Canada–Ontario Workforce Tariff Response initiative, **more than $228 million** ([Skills Advance Ontario](https://www.ontario.ca/page/skills-advance-ontario))
- **What it funds:** sector-based workforce development partnerships between employers and employment/training service providers — employment and training services spanning entry-level through medium- and high-skilled roles, including training for workers on reduced hours
- **Eligibility:** two streams, and the for-profit answer differs by stream. The **employer-led stream** accepts employers on active EI Work-Sharing agreements, with new or incumbent employees requiring upskilling or reskilling that could prevent job losses, or with workforce development needs in high-potential sectors — and successful employer recipients **must work with an educational institution** (publicly funded post-secondary, registered career college, district school board, or Indigenous Institute). The **service-provider-led stream** is limited to nonprofits and social agencies, municipalities, DSSABs, CMSMs, unions, professional/industry/sector associations, chambers of commerce or boards of trade, publicly assisted colleges/universities/Indigenous Institutes, career colleges, and district school boards ([Skills Advance Ontario](https://www.ontario.ca/page/skills-advance-ontario))
- **Award size:** not published as a per-project ceiling on the program page
- **Cost-share / matching:** not stated as a fixed requirement on the program page
- **Intake status as of 2026:** **OPEN — open intake, no set deadline, until all program funds are allocated.** Submitted through Transfer Payment Ontario, assessed on an ongoing basis. Page updated March 31, 2026 ([Skills Advance Ontario](https://www.ontario.ca/page/skills-advance-ontario)). This is the most accessible live Ontario intake in this report
- **Effort and timeline:** moderate; rolling assessment means no fixed wait, but TPON registration must be completed first
- **Next concrete action:** Approach a **local or regional Chamber of Commerce or a sector association** in a tariff-affected sector as lead applicant, with Trampoline positioned as the readiness-and-referral tracking layer that produces the program's outcome reporting. Chambers are named eligible applicants, are used to convening employers, and rarely have in-house measurement capacity
- **Evidence required:** an eligible lead applicant, a named educational-institution training partner if employer-led, identified job vacancies or advancement opportunities in Ontario, and participant eligibility screening. Participants must be 18+, Ontario residents, legally entitled to work in Canada, and connected to EI, an EI Work-Sharing agreement, or an employer affected by tariffs and global market shifts
- **Flag, explicit:** ineligible transfer payment recipients are **private consultants, consultant lobbyists, and any organization that is not a valid legal entity** ([Skills Advance Ontario](https://www.ontario.ca/page/skills-advance-ontario)). A for-profit software vendor is not in the service-provider list and risks being read as a private consultant. **A nonprofit, association, chamber, college, or employer must hold this agreement**

### B6. Ontario Trillium Foundation — for-profits categorically ineligible

- **Funder / administering body:** Ontario Trillium Foundation
- **What it funds:** direct community-based programs and services in Ontario across four sectors: sports and recreation, arts and culture, environment, and human and social services ([Seed](https://otf.ca/our-grants/community-investments-grants/seed-grant))
- **Eligibility:** **Trampoline cannot apply to any OTF stream.** Across Seed, Grow and Capital, applicants must be a CRA-registered charity or foundation, a not-for-profit corporation without share capital, a Chartered Community Council under the Métis Nation of Ontario, a First Nation, or a municipality of 20,000 or fewer, and must have been registered or incorporated and actively operating for at least **12 months** ([Seed](https://otf.ca/our-grants/community-investments-grants/seed-grant); [Grow](https://otf.ca/our-grants/community-investments-grants/grow-grant); [Capital](https://otf.ca/our-grants/community-investments-grants/capital-grant); [Seed application questions](https://otf.ca/resources/community-investments-grant-resources/seed-grant-application-resources/seed-grant-application-questions)). For the Youth Opportunities Fund System Innovations grant, ineligible lead organizations explicitly include **for-profit businesses**, along with individuals, municipalities, universities, schools, hospitals and religious institutions ([fundsforNGOs summary of the call](https://www2.fundsforngos.org/innovation/open-call-for-system-innovations-grants-program-in-canada/), *third-party*); the lead must be an incorporated nonprofit for at least **5 years** with a clear mandate and track record serving youth aged 12–29 ([YOF System Innovations](https://otf.ca/our-grants/youth-opportunities-fund/system-innovations-grant))
- **Award size:** Grow grants range **$100,000 to $600,000**, requesting $50,000–$200,000 per year for 2 or 3 years ([Grow](https://otf.ca/our-grants/community-investments-grants/grow-grant)). YOF System Innovations funds **up to $1,250,000 over five years ($250,000/year)** for collaboratives of two or more organizations, minimum 2-year and maximum 5-year term ([YOF System Innovations](https://otf.ca/our-grants/youth-opportunities-fund/system-innovations-grant))
- **Cost-share / matching:** not required as cash match, but Grow and Capital require proof of ownership or a lease with a minimum of 5 years remaining at the application deadline ([Capital](https://otf.ca/our-grants/community-investments-grants/capital-grant))
- **Intake status as of 2026** ([OTF deadlines](https://otf.ca/our-grants/grant-application-deadlines)):

| Stream | Status |
|---|---|
| Capital | Feb 4 – Mar 4, 2026 — **closed** |
| Seed | Jul 22 – Aug 19, 2026 — **closed** |
| **Grow** | **Oct 7 – Nov 4, 2026 — open** |
| **Sector** | **Step 1: Sept 23 – Oct 14, 2026; Step 2: Oct 15 – Dec 2, 2026** |
| **YOF System Innovations** | **Opens Sept 23, 2026**; coaching call by Feb 17, 2027; org info by Feb 24, 2027; application by Mar 10, 2027 |
| YOF Youth/Family Innovations | EOI Apr 15, 2026; application Jul 8, 2026 — **closed** |

  Seed grants require project start dates between **December 1, 2026 and June 1, 2027** ([Seed application questions](https://otf.ca/resources/community-investments-grant-resources/seed-grant-application-resources/seed-grant-application-questions)).

- **Effort and timeline:** moderate for Grow; substantial for YOF System Innovations, which requires a mandatory pre-application coaching call
- **Next concrete action:** Approach a partner-eligible nonprofit about the **Grow grant closing November 4, 2026** or the **YOF System Innovations grant opening September 23, 2026**, where Trampoline is a line item in *their* budget as purchased technology and evaluation infrastructure. YOF System Innovations is the better structural fit — it funds collaboratives addressing systemic issues — but the 5-year incorporation requirement and March 2027 deadline make it a 2027 play
- **Evidence required:** a nonprofit lead with the requisite incorporation history, a signed collaborative agreement, and itemized quotes for technology line items (OTF flags missing or undated quotes as a common failure)

### B7. Social Finance Fund via intermediaries — repayable capital, not a grant

- **Funder / administering body:** ESDC, deployed through three wholesalers: **Realize Capital Partners** (a subsidiary of Toronto-based Rally Assets), **Boann Social Impact**, and **Fonds de finance sociale – CAP Finance** (Quebec only) ([Social Finance Fund](https://www.canada.ca/en/employment-social-development/programs/social-innovation-social-finance/social-finance-fund.html); [Realize about](https://realizecapitalpartners.ca/about/))
- **What it funds:** repayable investment capital for social purpose organizations to grow, innovate and enhance social and environmental impact. **$755 million** overall, with up to **$400 million** invested over the first five years into social finance intermediaries, who then invest in SPOs ([Social Finance Fund](https://www.canada.ca/en/employment-social-development/programs/social-innovation-social-finance/social-finance-fund.html))
- **Eligibility:** **Trampoline may qualify as an SPO.** Realize Capital Partners describes the SFF as supporting "charities, nonprofits, social enterprises, co-operatives, **companies** and other social purpose organizations" ([Realize about](https://realizecapitalpartners.ca/about/)). Third-party analysis states for-profit businesses with a primary social or environmental mission are eligible, that social outcomes must be the primary focus rather than incidental to commercial activity, that applicants must demonstrate capacity to repay, and that the **Common Impact Data Standard** must be adopted ([GrantCompass](https://grantcompass.ca/grants/social-finance-fund), *third-party*)
- **Award size:** third-party sources cite **$25,000–$5,000,000 per SPO** as repayable below-market-rate investment via intermediaries, with a second tranche of **$282.5 million** available 2026–2030 ([GrantCompass](https://grantcompass.ca/grants/social-finance-fund), *third-party*)
- **Cost-share / matching:** not a grant match; wholesalers are expected to match federal capital with private capital. Realize Fund I raised **$141.7 million privately against $135 million in federal seed capital** for a total of **$276.7 million** ([Globe and Mail](https://www.theglobeandmail.com/business/article-realize-capital-partners-closes-social-impact-investing-fund/))
- **Intake status as of 2026:** ongoing. **Critical mechanic:** you do not apply to ESDC or to a wholesaler for capital. Wholesalers invest in intermediaries; **intermediaries invest in SPOs.** Realize Fund I reached **final close in Q2 2026** and has made 24 investments worth $111 million across 23 funds ([realizecapitalpartners.ca](https://realizecapitalpartners.ca/); [Globe and Mail](https://www.theglobeandmail.com/business/article-realize-capital-partners-closes-social-impact-investing-fund/)). Wholesaler reporting on Social Equity Lens Investment data begins in 2026 ([SFF results and updates](https://www.canada.ca/en/employment-social-development/programs/social-innovation-social-finance/social-finance-fund/results-updates.html))
- **Effort and timeline:** an investment due-diligence process, not a grant application. Months
- **Next concrete action:** Realize Capital Partners runs a **"Product Submission"** intake and holds **office hours every Tuesday** for prospective applicants ([realizecapitalpartners.ca](https://realizecapitalpartners.ca/)). Book a Tuesday slot to ask which intermediary in their portfolio invests in early-stage workforce or health-equity technology in Ontario, then approach that intermediary directly. This is the highest-value single phone call in this report relative to effort
- **Evidence required:** a demonstrable primary social mission, repayment capacity, and impact measurement aligned to the Common Impact Data Standard
- **Named Ontario-connected impact investors surfaced:** Rally Assets and its subsidiary Realize Capital Partners, both Toronto-based ([Realize about](https://realizecapitalpartners.ca/about/)); Realize's confirmed commitments include **Amplify Capital Fund III**, **Lumira Cancer Breakthrough Fund**, **Raven Indigenous Opportunities Fund I**, **PaceZero Sustainable Credit Fund II**, and **Maple Bridge Ventures**, which invests in immigrant-led startups ([Globe and Mail](https://www.theglobeandmail.com/business/article-realize-capital-partners-closes-social-impact-investing-fund/); [Altss profile](https://altss.com/profile/realize-capital-partners), *third-party*). Limited partners include the **McConnell Foundation**, **Trottier Family Foundation**, **RBC**, **Roynat Capital**, **RockCreek Canada** and **Concordia University** ([Globe and Mail](https://www.theglobeandmail.com/business/article-realize-capital-partners-closes-social-impact-investing-fund/)). Notably, the **Raven Indigenous Outcomes Fund** explicitly targets **workforce development** among its intersecting sectors and structures Community-Driven Outcomes Contracts — pay-for-success deals where "government only pays for what works" ([Raven Impact Foundation](https://riif.ca/outcomes/)). An outcomes contract is the single closest structural match to Trampoline's revenue thesis anywhere in this report
- **Flag:** this is repayable investment capital requiring demonstrated repayment capacity, and the social mission must be primary rather than incidental. It is not grant money

### B8. Ontario Health Technology Accelerator Fund (HTAF) and the Health Innovation Pathway

- **Funder / administering body:** Ontario Health / Ontario Ministry of Health
- **What it funds:** adoption of new health technologies. HTAF addresses evidence gaps and adoption models, split into two streams: one for evidence generation and one focused on **boosting adoption of technologies backed by robust evidence, redesigning models of care, and drawing roadmaps for real day-to-day use in Ontario** ([Innovation Factory interview with the Ministry's Health Innovation Policy Branch](https://innovationfactory.ca/beyond-the-pilot-the-journey-to-provincial-scale-via-ontarios-health-innovation-pathway/))
- **Eligibility:** the Health Innovation Pathway is a **single window** welcoming applications from companies, innovators, clinicians, health service providers, patients, researchers, government and supply chain partners ([Ontario Health](https://ontariohealth.ca/system/health-innovation-pathway)). The bar for provincial entry is **TRL 8 maturity**, regulatory approval or a clear path where required, and evidence of impact ([Innovation Factory](https://innovationfactory.ca/beyond-the-pilot-the-journey-to-provincial-scale-via-ontarios-health-innovation-pathway/))
- **Award size:** third-party summaries describe a **$12 million fund** with a first cohort in September 2025 funding four projects from **$500,000 to $5 million** ([GrantCompass HTAF](https://grantcompass.ca/grants/ontario-health-technology-accelerator-fund), *third-party*); another lists the range as $1.5M–$5M ([GrantCompass Ontario R&D](https://grantcompass.ca/ontario-rd-innovation-grants.html), *third-party*)
- **Cost-share / matching:** not stated in retrieved sources
- **Intake status as of 2026:** rolling intake per third-party sources; Ontario Health's Pathway page was last updated June 12, 2026 ([Ontario Health](https://ontariohealth.ca/system/health-innovation-pathway); [GrantCompass](https://grantcompass.ca/ontario-digital-grants.html), *third-party*)
- **Effort and timeline:** requires a signed health care organization partnership and clinical validation evidence; months
- **Next concrete action:** Contact the Health Innovation Pathway concierge via [ontariohealth.ca](https://ontariohealth.ca/system/health-innovation-pathway) with a one-paragraph description and one direct question: is a non-clinical attestation registry in scope, or excluded as a health information system? A five-minute answer saves months
- **Evidence required:** TRL 8+, a signed agreement with an Ontario hospital, health authority or recognized health care organization, and demonstrated value to Ontario patients and the health budget
- **Two significant flags.** Third-party sources state HTAF **funds health service providers to purchase technology, not the company directly** — meaning a hospital or health authority holds the money. And the same sources list **health information systems (HIS) as out of scope**, alongside pharma, vaccines and infrastructure ([GrantCompass](https://grantcompass.ca/ontario-digital-grants.html), *third-party*). A record system storing attestations, verdicts and expiry dates could plausibly be classified as an HIS. **Verify directly with the Innovation Concierge before investing any proposal effort**

### B9. Local Workforce Planning Boards — co-sponsors and evidence partners, not funders

- **Funder / administering body:** Ministry of Labour, Immigration, Training and Skills Development, via the Local Board Program, which is an Employment Ontario project **funded in part by the Government of Canada and the Government of Ontario** ([Workforce WindsorEssex](https://www.workforcewindsoressex.com/workforce-windsoressex-launches-2025-26-community-labour-market-plan-march-12-2026/))
- **What it funds:** there are **26 workforce planning areas** across Ontario, all funded by MLITSD, conducting local research and working with community partners on local labour market projects ([Eastern Workforce Innovation Board](https://www.workforcedev.ca/ontario-workforce-boards/))
- **Eligibility:** boards are the funded entities; Trampoline would be a partner or co-sponsor
- **Award size:** nothing found indicates these boards hold discretionary grant budgets of consequence. **Set expectations accordingly** — their value is credibility, convening power, and local labour market data for someone else's application
- **Cost-share / matching:** n/a
- **Intake status as of 2026:** boards publish annual Local Labour Market Plans on a continuing cycle ([Workforce WindsorEssex](https://www.workforcewindsoressex.com/workforce-windsoressex-launches-2025-26-community-labour-market-plan-march-12-2026/); [Workforce Planning Board of Grand Erie](https://workforceplanningboard.org/local-labour-market-plan-2026-now-live/))
- **Effort and timeline:** low. A meeting and a follow-up
- **Next concrete action:** Meet your regional planning board, ask to be included as a partner in their next Local Labour Market Plan cycle, and ask for an introduction to your SSM
- **Evidence required:** minimal. The Grand Erie 2025/26 plan recommends hearing directly from jobseekers about needed supports and then investing in them, and ensuring jobseekers know about and use existing community supports across employment services, schools, training programs and literacy agencies ([Grand Erie](https://workforceplanningboard.org/local-labour-market-plan-2026-now-live/)) — language a Trampoline pilot can be written directly into. A board endorsement is cheap to obtain and materially strengthens an SDF, SAO or SWIF application led by someone else

### B10. Private insurers and group benefits — paid pilots, not grants

- **Funder / administering body:** private disability insurers and group benefits carriers. There is **no grant program** here, but there is documented and current appetite for exactly Trampoline's problem space
- **What it funds:** condition-specific and digital interventions inside the group disability block, evaluated on return-to-work outcomes
- **Eligibility:** vendor partnership; no formal eligibility criteria published
- **Award size:** commercial pilot terms; not published
- **Cost-share / matching:** n/a
- **Intake status as of 2026:** active. **Manulife** launched a 2026 pilot with **Osara Health** called **Cancer Coach**, available to **select Manulife Group Benefits members with disability coverage**, including **return-to-work planning** and app-based symptom logging and progress tracking. Manulife's Head of Group Benefits stated the pilot will be evaluated on member health, cost and experience, with **return-to-work results — particularly duration and transition — a key part of the assessment**, before any decision to scale beyond disability into broader group benefits ([Benefits and Pensions Monitor](https://www.benefitsandpensionsmonitor.com/benefits/group-health/manulife-tests-cancer-support-platform-focused-on-recovery-return-to-work/393316); [Newswire](https://www.newswire.ca/news-releases/manulife-canada-partners-with-osara-health-to-bring-personalized-cancer-support-to-canadians-838357423.html); [Insurance Business](https://www.insurancebusinessmag.com/ca/news/group-benefits/manulife-osara-health-launch-cancer-coaching-pilot-for-group-benefits-members-569889.aspx)). The pilot is tied to the **Manulife Longevity Institute**. **Sun Life** has a track record of research-partnered disability management pilots, including a virtual CBT approach run in partnership with the **University of Regina**, described as a first in the industry, and a planned pilot of virtual independent medical examinations ([Sun Life disability paper](https://www.sunlife.ca/static/slf/Innovations%20in%20Absence%20and%20Disability%20Management/Disability%20BrightPaper%20PDF8445%20E.pdf))
- **Effort and timeline:** a commercial sales cycle with a clinical-evidence gate; 6–18 months
- **Next concrete action:** Approach the **Manulife Longevity Institute** and Sun Life's group benefits innovation team with a **defined-segment pilot proposal** measured on absence duration and sustained return-to-work at 3, 6 and 12 months. Do not ask for a grant; propose a paid pilot on a named cohort
- **Evidence required:** at minimum a retrospective analysis or single-site pilot showing duration or hours-retention improvement. Note what Osara brought to the table: **more than 11 published clinical studies** ([Newswire](https://www.newswire.ca/news-releases/manulife-canada-partners-with-osara-health-to-bring-personalized-cancer-support-to-canadians-838357423.html)). That is the entry price

### B11. WSIB Work Reintegration vendor roster — a procurement and partnership path

- **Funder / administering body:** WSIB Ontario
- **What it funds:** WSIB contracts a defined set of named providers to deliver assessment, job coaching and employment services to people with claims
- **Eligibility:** WSIB contracts directly with these vendors; Trampoline's path is partnership with them, not direct listing
- **Award size:** per-service contracted rates; not published
- **Cost-share / matching:** n/a
- **Intake status as of 2026:** the roster is live and was updated **April 24, 2026**. For vocational, functional and cognitive assessments, job coaching and specialized ergonomic assessments: **Agilec, AGS Rehab Solutions, Bayshore HealthCare, Insight Advantage, Lifemark Health, March of Dimes, Rehabilitation Network, Santé Circle Health, and Trillium Health Partners.** For employment services — job search support, retraining, work experience, and help keeping a new job: **Agilec, CBI Workplace Solutions, Insight Advantage, Lifemark Health Corp, March of Dimes, Rehabilitation Network, and VPI** ([WSIB Service providers](https://www.wsib.ca/en/businesses/return-work/service-providers)). Several also appear in WSIB's programs of care with their own contracted provider directories ([WSIB health care programs](https://www.wsib.ca/en/healthcareprograms); [interdisciplinary team directory](https://www.wsib.ca/en/interdisciplinary-team-program-care-provider-directory); [mental health program of care directory](https://www.wsib.ca/en/mentalhealthprogramofcareproviderdirectory))
- **Effort and timeline:** low to moderate; direct business development
- **Next concrete action:** Approach two or three of these named vendors — **March of Dimes** and **Agilec** are the most obvious given their dual presence on both lists — as **attestation-issuing partners** rather than as customers. They already produce functional assessments with restrictions; Trampoline standardizes and routes the output. They can also serve as co-applicant or letter-of-support partners for WSIB or ESDC applications
- **Evidence required:** an integration story that reduces their reporting burden rather than adding to it
- **Why this matters:** this is a short, named list of organizations **already paid by WSIB to perform assessments** — in other words, exactly the attesters Trampoline needs, already funded to do the attesting

---

## Part 4: Tier C — premature

### C1. Ontario Skills Development Fund, Capital Stream

- **Funder:** Ontario MLITSD. **What it funds:** technical planning costs (SEED pathway) and construction, upgrade or conversion of training centres (GROW pathway)
- **Eligibility:** primary applicants are employers in Ontario, minister-approved apprenticeship training delivery agents, non-profits including Indigenous band offices and ISET holders, professional/industry/employer associations, unions, municipalities, hospitals, DSSABs and CMSMs; educational organizations apply as partners ([Capital Stream](https://www.ontario.ca/page/skills-development-fund-capital-stream))
- **Award size:** Round 2 launched with over **$74 million** available ([Ontario Newsroom](https://news.ontario.ca/en/release/1005423/applications-now-open-for-next-round-of-skills-development-fund))
- **Intake status:** **open** with **continuous intake since November 29, 2024, no set deadline, until all program funds are allocated**, assessed on a rolling basis ([Capital Stream](https://www.ontario.ca/page/skills-development-fund-capital-stream))
- **Why premature:** it funds buildings and equipment. **Training costs are not eligible under the Capital Stream, and equipment and buildings are not eligible under the Training Stream** ([GrantHub](https://granthub.ca/guide/skills-development-fund-ontario), *third-party*; [common application mistakes](https://forms.mgcs.gov.on.ca/dataset/ccb151bc-f926-48d1-a9c9-5a41d00478a1/resource/69cb8996-dc99-4f77-9301-fd536ff68ad9/download/sdf-capital-stream-common-application-mistakes-english.pdf)). Software is not the point of this stream. Skip it

### C2. FedDev Ontario Business Scale-up and Productivity

- **Funder:** Federal Economic Development Agency for Southern Ontario. **What it funds:** business scale-up, technology commercialization, productivity improvement and market diversification
- **Eligibility:** incorporated for-profit businesses in southern Ontario. Applications require **two years of externally prepared annual financial statements** plus the most recent interim statement, with audit or review engagement preferred, and a business may only submit **one application at a time** across all FedDev programs ([FedDev how to apply](https://feddev-ontario.canada.ca/en/funding-southern-ontario/funding-businesses-southern-ontario-how-apply); [what we support](https://feddev-ontario.canada.ca/en/funding-southern-ontario/funding-businesses-southern-ontario-what-we-support))
- **Award size:** third-party sources describe interest-free repayable contributions of **$125,000 to $10,000,000** ([GrantCompass](https://grantcompass.ca/grants/feddev-ontario-business-scale-up-and-productivity), *third-party*)
- **Cost-share:** third-party sources cite a minimum of **5 full-time employees** and matching funding for at least **50%** of eligible project costs ([GrantCompass](https://grantcompass.ca/grants/feddev-ontario-business-scale-up-and-productivity), *third-party*); one guide puts typical coverage at ~35% of eligible costs ([GovMoney](https://govmoney.ca/blog/feddev-ontario-bsp-guide), *third-party*)
- **Intake status:** FedDev states it is accepting applications ([what we support](https://feddev-ontario.canada.ca/en/funding-southern-ontario/funding-businesses-southern-ontario-what-we-support))
- **Why premature:** one guide characterises BSP as built for revenue-generating growth-stage businesses with project budgets in the **$2–30 million** range and practical revenue of $500,000+, explicitly **"not built for early-stage operators or sub-million-dollar projects"** ([GovMoney](https://govmoney.ca/blog/feddev-ontario-bsp-guide), *third-party*). A tiny unfunded team cannot meet the employee count, the financial statement history, or the match. Revisit at Series A scale
- **FedDev's other current streams are also poor fits:** funding for **not-for-profit and community development organizations** that help businesses grow, a **Regional Tariff Response Initiative**, and two streams — **Build Communities Strong Fund – Local Impact** and the **Regional Defence Investment Initiative** — whose **intakes are paused**; plus an Economic Development Initiative for official language minority communities. FedDev's catchment runs from Cornwall to Windsor across 37 census divisions ([FedDev funding for southern Ontario](https://feddev-ontario.canada.ca/en/funding-southern-ontario))

### C3. OCI Collaborate 2 Commercialize (C2C)

- **Funder:** Ontario Centre of Innovation, in partnership with NSERC (Alliance Advantage). **What it funds:** academia–industry collaboration to solve an industry problem and commercialize IP developed at Ontario colleges, universities and research hospitals
- **Eligibility:** the industry partner must be a for-profit company **incorporated in Ontario for a minimum of two years with five full-time equivalent employees in Ontario**, with operations and/or R&D in Ontario and capacity to commercialize. The research partner must be a principal investigator at an Ontario publicly funded university or research hospital, or an applied research officer at a publicly funded college ([OCI C2C](https://www.oc-innovation.ca/programs/collaborate-2-commercialize/))
- **Award size:** third-party sources cite **$20,000–$150,000** covering 50% of eligible project costs ([GrantCompass](https://grantcompass.ca/grants/oci-collaborate-2-commercialize), *third-party*)
- **Cost-share:** third-party sources state the industry partner must provide **50% cash** co-funding ([GrantCompass](https://grantcompass.ca/grants/oci-collaborate-2-commercialize), *third-party*)
- **Intake status:** targeted calls. An **AI-focused call is open July 15 to September 15, 2026**; the C2C Alliance Advantage stream runs on a rolling basis during the 2026–27 fiscal year ([OCI C2C](https://www.oc-innovation.ca/programs/collaborate-2-commercialize/); [University of Guelph research alert](https://www.uoguelph.ca/research/alerts/content/nserc-alliance-advantage-oci-c2c-defense-and-dual-use-and-ai-calls)). Access requires contacting an OCI Business Development Manager, who responds within two business days; once deemed eligible, the application stays open 90 days ([rolling intake process](https://www.uoguelph.ca/research/alerts/content/ontario-centre-innovation-oci-collaborate-2-commercialize-program-rolling-intake))
- **Why premature:** the two-year Ontario incorporation and five-Ontario-FTE thresholds disqualify a tiny new team. Revisit when you clear both
- **Note a discrepancy:** two sources give different closing dates for the defence and dual-use call — September 15 versus July 31, 2026 ([University of Guelph](https://www.uoguelph.ca/research/alerts/content/nserc-alliance-advantage-oci-c2c-defense-and-dual-use-and-ai-calls); [OCI LinkedIn](https://www.linkedin.com/posts/ontario-centre-of-innovation_c2c-ai-defencetech-activity-7483143539204489216--cT6)). Both agree the AI call runs July 15 to September 15, 2026. Confirm dates with OCI directly when you qualify

### C4. Skills for Success (ESDC)

- **Funder:** ESDC. **What it funds:** foundational and transferable skills training design and delivery, assessment and training tool development, and research into skills development for underrepresented groups ([Skills for Success program page](https://www.canada.ca/en/employment-social-development/programs/skills-success.html))
- **Eligibility:** the last solicited call listed eligible applicants as **non-governmental organizations, not-for-profit organizations and academic institutions, and provinces and territories** — **for-profits were not listed** ([Solicited call](https://www.canada.ca/en/employment-social-development/services/funding/skills-success.html))
- **Award size:** Training and Tools Stream up to **$10,000,000**; Research and Innovation Stream up to **$7,500,000**; the solicited call permitted up to **$75,000,000 per project** over a maximum 5 years ([ESDC funding programs](https://www.canada.ca/en/employment-social-development/services/funding/programs.html); [Solicited call](https://www.canada.ca/en/employment-social-development/services/funding/skills-success.html))
- **Cost-share:** the solicited call required at least 50% of funding supports to serve under-represented groups; no cash match stated ([Solicited call](https://www.canada.ca/en/employment-social-development/services/funding/skills-success.html))
- **Intake status:** **closed.** Both the Training and Tools Stream and the Research and Innovation Stream show as closed ([Skills for Success program page](https://www.canada.ca/en/employment-social-development/programs/skills-success.html)). Most funding flows through periodic Calls for Concepts and Calls for Proposals rather than continuous intake, though the program occasionally solicits proposals outside the CFC process and will accept **unsolicited submissions that are national in scope** ([Funding overview](https://www.canada.ca/en/employment-social-development/services/funding/literacy-skills.html))
- **Why premature:** closed, and for-profits were excluded from the most recent call. Monitor; do not plan around it

### C5. Ready, Willing and Able

- **Funder:** ESDC via the Opportunities Fund. **What it is:** not a funding source you can apply to — a delivery program
- **Eligibility:** n/a. RWA is a national partnership between **Inclusion Canada and the Autism Alliance of Canada**, free to employers, operating in every province and territory, and does not use wage subsidies ([Deductly program summary](https://www.deductly.ca/programs/ready-willing-able), *third-party*)
- **Award size:** Budget 2022 provided a **$30 million, five-year investment** enabling delivery to 2027, amended up from an initial $20 million ([Autism Alliance of Canada](https://autismalliance.ca/rwa-expansion/))
- **Intake status:** **funding expires March 31, 2027.** Inclusion Canada is seeking **$50 million in the fall budget** to continue, and the federal government had not confirmed renewal at time of reporting ([CKLB analysis by Inclusion Canada and Autism Alliance](https://cklbradio.com/2026/08/19/analysis-finding-work-opportunities-for-northerners-with-intellectual-disabilities-and-autism/); [CBC](https://www.cbc.ca/news/canada/north/job-market-intellectual-disabilities-nwt-canada-funding-9.7328439?cmp=rss); [Yahoo News Canada](https://ca.news.yahoo.com/yellowknife-family-fears-job-program-005803834.html))
- **Why premature:** an organization fighting for its own renewal will not fund your pilot. RWA has helped fill over **6,300 jobs since 2014** ([CKLB](https://cklbradio.com/2026/08/19/analysis-finding-work-opportunities-for-northerners-with-intellectual-disabilities-and-autism/)) — revisit if and when renewal is announced, since a renewed RWA would need exactly the outcome-tracking Trampoline provides

### C6. Investment Readiness Program — ended

- **Funder:** ESDC. **Status: ENDED.** The IRP pilot (2019–2021, $50 million) and renewed IRP (2021–2024, $50 million) totalled $100 million and **ended March 31, 2024**, having received over 3,900 applications and distributed over **$57 million to 1,160 social purpose organizations** ([Canada.ca](https://www.canada.ca/en/employment-social-development/programs/social-innovation-social-finance/investment-readiness.html))
- **Why premature:** it no longer exists. Note for context that over 45% of beneficiaries used IRP funds to grow or launch a new service or business venture — the kind of capacity grant that no longer exists federally. The Social Finance Fund (B7) is the surviving instrument

### C7. "Social Innovation and Investment Fund" (Ontario) — could not be verified

- I searched this by name and **could not verify that an Ontario program by this name exists.** The closest real instruments are the federal Social Finance Fund and the completed Investment Readiness Program, both above. The only entities matching the name were a Toronto Metropolitan University student fund capped at **$5,000** for TMU students ([TMU](https://www.torontomu.ca/social-innovation/student-funding/siaf/)) and a European fund of the same acronym
- **Treat the name as unverified and do not cite it in any application**

### C8. Community bonds

- **Funder / facilitator:** Tapestry Community Capital, a nonprofit. **What it funds:** community-owned land or infrastructure projects
- **Eligibility:** **structurally unavailable to Trampoline.** Tapestry works **with non-profits, charities, and co-operatives** ([Tapestry](https://tapestrycapital.ca/raise-capital/)). Its Spring 2026 program targets eight organizations in sports and recreation, healthcare, affordable housing and faith-based communities, seeking to raise a **minimum of $2 million** in community bonds within 8–12 months, with an existing community of supporters and a project team of at least three people
- **Award size:** Tapestry has helped issuers raise over **$129 million from more than 4,000 investors** ([Tapestry about](https://tapestrycapital.ca/about-us/)) and launched the **$30 million Weave Community Capital Fund**, a national private credit fund lending to community bond issuers ([Future of Good](https://futureofgood.co/first-canada-wide-lending-fund-for-community-bonds-launches/); [Tapestry / CMHC announcement](https://tapestrycapital.ca/tapestry-community-capital-cmhc-housing-supply-challenge-finalist/))
- **Intake status:** Spring 2026 program open to eight organizations; priority to projects serving equity-deserving groups ([Tapestry](https://tapestrycapital.ca/raise-capital/))
- **Why premature:** this is a path for a nonprofit partner, not for a for-profit — though a nonprofit partner raising community bonds could conceivably purchase Trampoline as project infrastructure. The Canadian Coalition for Community Capital is advocating 2026 policy reforms including registered-account eligibility for community investments up to $20,000 and a Community Capital Tax Credit ([Tapestry LinkedIn](https://ca.linkedin.com/company/tapestry-capital))

### C9. ODSP Employment Supports as a direct contract

- **Funder:** Ministry of Children, Community and Social Services. **What it funds:** employment supports delivered to eligible people with disabilities, paid on the milestone schedule in Part 1
- **Eligibility:** ODSP-ES is delivered through a network of third-party service providers, with **regional offices responsible for developing and negotiating funding agreements and contracting with community-based service providers** ([directive 5.1](https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/51-employment)). Selection criteria include expertise and **demonstrated history of obtaining successful employment outcomes for people with disabilities**, a strong customer service track record, demonstrated compliance with accessibility laws, willingness to work or merge with other agencies, and a cost-effective delivery model. Nothing in the directive categorically bars a private company, and the province's own policy literature notes that disability supports are delivered by both not-for-profit organizations and private businesses ([Caledon/Maytree](https://maytree.com/wp-content/uploads/CaledonPDF-1105ENG.pdf))
- **Award size:** the milestone schedule in Part 1, negotiated against annual regional targets
- **Intake status:** ongoing regional contracting; no published open call
- **Why premature:** you are being asked for a demonstrated history of employment outcomes, and you do not have one. Note also that a person receiving Ontario Works financial assistance is **not eligible** for ODSP employment supports ([directive 2.1](https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/21-program); [O. Reg. 223/98](https://www.ontario.ca/laws/regulation/980223); [ODSP Act s.33](https://www.ontario.ca/laws/statute/97o25b/v13)) — a segmentation rule Trampoline's routing logic must encode. Service providers also **may not charge employment supports clients for services** ([2026–27 job placement objectives](https://www.ontario.ca/document/2026-2027-mccss-service-objectives-social-assistance/job-placement))

### C10. Becoming an SSM subcontractor

Premature this year, but this is the destination. Ontario is divided into **15 catchment areas** for Employment Services Transformation ([Ontario Data Catalogue](https://data.ontario.ca/en/dataset/employment-service-program-financials-2022-23/resource/134efc5d-8606-49cd-b132-cfed20e3fd35)).

**Confirmed Service System Managers:**

| Region | Service System Manager |
|---|---|
| Region of Peel | WCG, part of the APM Group |
| Hamilton-Niagara | Consortium led by Fedcap |
| Muskoka-Kawarthas | Fleming College |
| York | WCG |
| Halton | Fedcap Inc. |
| Stratford-Bruce Peninsula | Corporation of the County of Bruce, leading a consortium with Grey, Huron and the City of Stratford |
| Toronto | International APM Group Pty Ltd. and WCG International Consultants Ltd. |
| Northeast Ontario | Collège Boréal d'arts appliqués et de technologie |
| Northwest Ontario | Serco Canada Inc. |

Sources: [Ontario Newsroom, 2020 prototype announcement](https://news.ontario.ca/mol/en/2020/02/ontario-moving-ahead-with-the-reform-of-employment-services.html); [ADM Memo on Phase 1 SSM selection](https://eopg.labour.gov.on.ca/wp-content/uploads/2025/01/est-adm-memo-eo-network-phase1-ssms-selection-en.pdf); [Ontario Newsroom, final expansion](https://news.ontario.ca/en/release/1005088/province-empowering-ontarians-to-secure-rewarding-careers).

The remaining **Phase 2 catchment areas are Durham, London, Ottawa, Windsor-Sarnia and Kitchener-Waterloo-Barrie**, competed beginning April 2022 with contracts expected December 2022 ([ADM memo](https://eopg.labour.gov.on.ca/wp-content/uploads/2025/01/est-adm-memo-eo-network-phase1-ssms-selection-en.pdf); [Employment Services Transformation Q&A](https://www.planningboard.ca/wp-content/uploads/2022/09/Apr-25-2022-phase1-ssms-announcement-en.pdf)). **See the caveats section — the Phase 2 SSM names could not be verified from a primary government source.**

Note that the Fedcap-led Hamilton-Niagara consortium includes two former Employment Ontario service providers (**Canadian Council on Rehabilitation and Work**, **Operation Springboard**) and two former ODSP Employment Supports providers (**Corbrook**, **Community Living Toronto**) ([Ontario Newsroom, 2020](https://news.ontario.ca/mol/en/2020/02/ontario-moving-ahead-with-the-reform-of-employment-services.html)). Those four are natural first conversations: they live inside the SSM structure and feel the 20-hour rule and the 12-month cliff directly.

**Why premature:** SSM subcontractors are paid on the incentive schedule in Part 1, and providers report that operational funding and per-client incentives are **lower** under the new model, with agencies laying off staff and one reporting a budget reduced to roughly **$80,000 against doubled targets** ([Tangled in Red Tape](https://www.odenetwork.com/wp-content/uploads/2024/06/Tangled-In-Red-Tape.pdf)). Squeezed subcontractors are poor first customers for new software. Sell to the SSM, or to a funder buying on the subcontractor's behalf, rather than to the subcontractor.

### C11. Pre-Apprenticeship Training Program

Noted for completeness because it has a live window — the ministry accepts applications **starting September 22, 2026, closing October 27, 2026 at 11:59 p.m. EST**, via TPON and SP-Connect ([program guidelines](https://forms.mgcs.gov.on.ca/en/dataset/1c808860-adfb-451b-a3fe-3e9a82681e18/resource/4dfa3831-e533-4d0a-9983-45caa0ec4e0b/download/pre-apprenticeship-2026-27-guidelines-en-final.pdf)). It funds no-cost technical and employability training for new entrants to the skilled trades. Not a Trampoline fit, but a useful reminder that Ontario runs frequent narrow calls through TPON — a further argument for registering there now.

---

## Part 5: Explicit for-profit eligibility flags

| Program | For-profit as lead applicant? | Who must hold it instead |
|---|---|---|
| Ontario Trillium Foundation — all streams | **No.** Charities, nonprofits, First Nations, small municipalities only; YOF explicitly excludes for-profit businesses | Registered charity or incorporated nonprofit (12 months for Seed/Grow/Capital; **5 years** for YOF System Innovations) |
| WSIB Research and Grants | **No** as Project Lead — stated explicitly. Yes as partner or collaborator, and collaborators may receive project funds | University, college, public hospital with a research area, nonprofit or charity with research capacity, or Canadian NGO |
| Skills Advance Ontario, service-provider stream | **No.** Not a listed category; private consultants explicitly ineligible | Nonprofit, municipality, DSSAB, CMSM, union, association, chamber of commerce, college, career college, or school board |
| SDF Training Stream | **Not as a software vendor.** "Employers in Ontario" are eligible but the program funds worker training in priority sectors | Employer, nonprofit, association, union, municipality, DSSAB, CMSM, hospital, TDA, or SSM |
| SDF Capital Stream | Employers eligible, but scope is buildings and equipment | n/a — wrong stream regardless |
| Opportunities Fund | **Conditionally yes** — only if the activity is non-commercial, not intended to generate profit, and beyond your normal activities | Safer with a disability-serving nonprofit as applicant |
| Sectoral Workforce Innovation Fund | **Yes**, but recipients cannot represent a single enterprise; must be a multi-stakeholder collaborative | Convening organization, sector council, or association as lead |
| Skills for Success (last solicited call) | **Not listed** — NGOs, nonprofits, academic institutions, provinces and territories only | Nonprofit or academic institution |
| Social Finance Fund | Yes, if a genuine social purpose organization with social outcomes as the primary focus and repayment capacity | n/a — but accessed via intermediaries, and it is repayable |
| Community bonds (Tapestry) | **No.** Nonprofits, charities and co-operatives only | Nonprofit or co-operative partner |
| HTAF | Companies may apply via the Pathway, but third-party sources indicate health service providers receive the funds, and HIS may be out of scope | Ontario hospital or health service provider — **verify scope first** |
| WSIB Health and Safety Excellence | **No** — rebates go to Schedule 1 employers, not vendors | n/a — this is a channel, not funding |
| NRC IRAP | **Yes** — must be incorporated and for-profit; nonprofits are ineligible | n/a |
| SR&ED | **Yes** — enhanced refundable rate designed for CCPCs | n/a |
| FedDev BSP | **Yes**, but requires 5+ FTE, two years of statements, and a substantial match | n/a — revisit at scale |
| OCI C2C | **Yes**, but requires 2 years Ontario incorporation and 5 Ontario FTEs, plus an academic partner | n/a — revisit at scale |
| ODSP-ES direct contract | Not barred, but requires demonstrated employment-outcome history | Established provider with a track record |

---

## Part 6: The 90-day plan

**Do now, alone, no partner needed:**

1. Register the corporation on **Transfer Payment Ontario**. Multiple Ontario programs route exclusively through TPON and SP-Connect, registration requires ministry approval, and being unregistered when Round 7 or a narrow call opens is an avoidable loss.
2. Start **SR&ED contemporaneous documentation**. This is the largest realistic non-dilutive number and it accrues from today.
3. Request an **NRC IRAP ITA** by phone (**1-877-994-4727**). Free advice, plus warm referrals.
4. Email **grants@wsib.on.ca** to establish the 2026/2027 competition timing.
5. Book a **Tuesday office hours slot with Realize Capital Partners** and ask which intermediary in their portfolio invests in Ontario workforce or health-equity technology.
6. Email the **Health Innovation Pathway concierge** the single scope question about attestation registries versus health information systems.

**Do now, requires outreach:**

7. Approach **March of Dimes** and **Agilec** — both on WSIB's assessment and employment-services vendor lists — as attestation-issuing partners.
8. Approach **Corbrook**, **Community Living Toronto**, **Canadian Council on Rehabilitation and Work** or **Operation Springboard**, all inside the Fedcap Hamilton-Niagara consortium, about the 12-month retention cliff.
9. Meet your **regional workforce planning board** and ask for inclusion in the next Local Labour Market Plan and an introduction to your SSM.
10. Identify one **convening organization** — sector council, industry association, or chamber — willing to lead a **SWIF Statement of Interest** with Trampoline as shared sector infrastructure. This is the largest live opportunity and it is open now on continuous intake.

**Build into the product immediately,** because every one of these funders will ask for it: enrollment date; referral in and out with destination and acceptance; placement date; 6-week and 13-week cumulative employment flags; employment status at 1/3/6/12/15/33 months; weekly hours with a 20-hour threshold flag; hourly wage and monthly chargeable earnings; employment within 60 days of program completion; case duration past 3 and 6 months; and exit satisfaction from both the client and the employer.

---

## Caveats: three unconfirmed items

1. **Phase 2 Service System Manager names.** The Phase 2 catchment areas — **Durham, London, Ottawa, Windsor-Sarnia and Kitchener-Waterloo-Barrie** — were competed beginning April 2022, but **I was not able to verify the Phase 2 SSM names from a primary government source.** Search results offered names, but I could not trace them to an authoritative page, so they are not asserted in this document. Confirm these directly before any outreach.

2. **Whether the WSIB 2026 grants competition opened.** The WSIB Research and Grants page still carried the forward-looking statement that the **"2026 grants competition will open in early 2026"** as of 2026-09-07. **I could not confirm whether the 2026 competition opened, is open, or has closed.** Email grants@wsib.on.ca to establish actual timing.

3. **No Ontario program called the "Social Innovation and Investment Fund" could be verified.** Searching that name returned only a Toronto Metropolitan University student fund capped at $5,000 and a European fund sharing the acronym. The closest real instruments are the federal Social Finance Fund and the completed Investment Readiness Program. **Do not cite this program name in any application.**

A fourth, minor discrepancy worth noting: two sources give different closing dates for OCI's defence and dual-use C2C call — September 15 versus July 31, 2026. Both agree the AI call runs July 15 to September 15, 2026. Since Trampoline does not yet meet C2C's two-year and five-FTE thresholds, this affects no recommendation, but confirm dates with OCI directly when you do qualify.

---

## Sources

Sources marked *(third-party)* are aggregator, consultancy, approved-provider or news sites, not funders. They were used only where a government page did not state an award size or cost-share. Verify any number drawn from them before relying on it in an application.

### Ontario Skills Development Fund
- https://www.ontario.ca/page/skills-development-fund-training-stream?redirect_id=page%2Fskills-development-fund&redirect_year=2025
- https://www.ontario.ca/page/skills-development-fund-capital-stream
- https://news.ontario.ca/en/release/1006247/ontario-investing-260-million-to-protect-and-train-workers
- https://news.ontario.ca/en/release/1005423/applications-now-open-for-next-round-of-skills-development-fund
- https://news.ontario.ca/en/release/1007932/ontario_investing_48_million_to_protect_and_train_workers_in_simcoe_and_surrounding_area
- https://www.auditor.on.ca/en/content/specialreports/specialreports/en25/AR-PA_SDF-TS_en25.pdf
- https://www.ola.org/en/legislative-business/committees/public-accounts/parliament-44/transcripts/committee-transcript-2025-dec-01
- https://forms.mgcs.gov.on.ca/dataset/5f0dd16c-f826-4cc4-822e-42e82c78b991/resource/87f8c53b-8e3a-4772-8fa0-a3665d81314e/download/2025-26-applicant-support-guide_en.pdf
- https://forms.mgcs.gov.on.ca/dataset/ccb151bc-f926-48d1-a9c9-5a41d00478a1/resource/69cb8996-dc99-4f77-9301-fd536ff68ad9/download/sdf-capital-stream-common-application-mistakes-english.pdf
- https://forms.mgcs.gov.on.ca/en/dataset/2729cbd2-a168-4a7c-b667-cbaa7ddbdc74/resource/4ca3ef40-52e9-46d3-a8d5-dfae89eff652/download/tpon_submitting_for_funding.pdf
- https://granthub.ca/guide/skills-development-fund-ontario *(third-party)*

### Employment Ontario, Employment Services Transformation and Skills Advance Ontario
- https://www.ontario.ca/page/skills-advance-ontario
- https://news.ontario.ca/mol/en/2020/02/ontario-moving-ahead-with-the-reform-of-employment-services.html
- https://news.ontario.ca/en/release/1005088/province-empowering-ontarians-to-secure-rewarding-careers
- https://eopg.labour.gov.on.ca/wp-content/uploads/2025/01/est-adm-memo-eo-network-phase1-ssms-selection-en.pdf
- https://www.planningboard.ca/wp-content/uploads/2022/09/Apr-25-2022-phase1-ssms-announcement-en.pdf
- https://data.ontario.ca/en/dataset/employment-service-program-financials-2022-23/resource/134efc5d-8606-49cd-b132-cfed20e3fd35
- https://eopg.labour.gov.on.ca/wp-content/uploads/2025/04/es-guidelines-2017-en.pdf
- https://eopg.labour.gov.on.ca/wp-content/uploads/2025/01/es-training-manual-data-integrity-en.pdf
- https://eopg.labour.gov.on.ca/wp-content/uploads/2025/04/es-best-practices-participant-guide-en.pdf
- https://eopg.labour.gov.on.ca/en/programs/get-set-skills-education-and-training/guidelines/service-provider-guidelines/
- https://cesba.com/wp-content/uploads/2020/10/LBS-Service-Provdier-Guidelines-2016-1.pdf
- https://maytree.com/wp-content/uploads/Final-EST-Evaluation-Report.pdf
- https://www.odenetwork.com/wp-content/uploads/2024/06/Tangled-In-Red-Tape.pdf
- https://www.odenetwork.com/wp-content/uploads/2026/02/Early-signs-of-trouble-EST-evaluation.pdf
- https://firstwork.org/wp-content/uploads/2022/05/First-Work-Report-A-Year-in-Transition-Ontarios-Employment-Services-Transformation.pdf
- https://forms.mgcs.gov.on.ca/en/dataset/1c808860-adfb-451b-a3fe-3e9a82681e18/resource/4dfa3831-e533-4d0a-9983-45caa0ec4e0b/download/pre-apprenticeship-2026-27-guidelines-en-final.pdf

### WSIB
- https://www.wsib.ca/en/healthandsafety
- https://www.wsib.ca/en/health-and-safety-excellence-program-frequently-asked-questions
- https://healthandsafety.wsib.ca/sites/default/files/2024-12/HSEp_ProgramManualENG_2025FINAL.pdf
- https://www.norcat.org/advisory/wsib-excellence.html *(third-party, approved provider)*
- https://safetytrainingandconsulting.ca/wsib-excellence/ *(third-party, approved provider)*
- https://www.wsib.ca/en/research-and-grants-program
- https://www.wsib.ca/en/research-and-grants-program-proposal-instructions
- https://www.wsib.ca/en/2025-research-and-grants-agenda
- https://wsibgrants.smapply.ca/
- https://www.wsib.ca/en/wsib-policy-agenda-2026
- https://www.wsib.ca/en/businesses/return-work/service-providers
- https://www.wsib.ca/en/document/vocational-and-functional-assessment-and-job-coaching-services
- https://www.wsib.ca/en/healthcareprograms
- https://www.wsib.ca/en/interdisciplinary-team-program-care-provider-directory
- https://www.wsib.ca/en/mentalhealthprogramofcareproviderdirectory
- https://hellodarwin.com/business-aid/programs/wsib-research-and-grants-program *(third-party)*

### ODSP Employment Supports and Ontario Works
- https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/51-employment
- https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/64-performance
- https://www.ontario.ca/document/ontario-disability-support-program-policy-directives-employment-supports/21-program
- https://www.ontario.ca/document/mccss-service-objectives-social-assistance-0/services-delivered-job-retention-and
- https://www.ontario.ca/document/2026-2027-mccss-service-objectives-social-assistance/ontario-works-administration
- https://www.ontario.ca/document/2025-2026-mccss-service-objectives-social-assistance/ontario-works-program-delivery
- https://www.ontario.ca/document/2026-2027-mccss-service-objectives-social-assistance/job-placement
- https://www.ontario.ca/document/ontario-works-policy-directives/113-cost-sharing
- https://www.ontario.ca/laws/regulation/980223
- https://www.ontario.ca/laws/statute/97o25b/v13
- https://pub-brantford.escribemeetings.com/filestream.ashx?DocumentId=30995
- https://maytree.com/wp-content/uploads/CaledonPDF-1105ENG.pdf
- https://www.ontariowithoutbarriers.ca/post/unlocking-your-potential-a-comprehensive-guide-to-odsp-employment-supports-for-individuals-with-dis *(third-party)*

### Ontario Trillium Foundation
- https://otf.ca/our-grants/grant-application-deadlines
- https://otf.ca/our-grants/community-investments-grants/seed-grant
- https://otf.ca/our-grants/community-investments-grants/grow-grant
- https://otf.ca/our-grants/community-investments-grants/capital-grant
- https://otf.ca/resources/community-investments-grant-resources/seed-grant-application-resources/seed-grant-application-questions
- https://otf.ca/our-grants/youth-opportunities-fund/system-innovations-grant
- https://otf.ca/systems-innovations-application-questions
- https://www2.fundsforngos.org/innovation/open-call-for-system-innovations-grants-program-in-canada/ *(third-party)*
- https://grantedai.com/grants/system-innovations-grant-youth-opportunities-fund-ontario-trillium-foundation-2bf8aa10 *(third-party)*

### Federal — Employment and Social Development Canada
- https://www.canada.ca/en/employment-social-development/news/2026/08/the-government-of-canada-is-launching-a-call-for-proposals-under-the-sectoral-workforce-innovation-fund-to-support-workforce-projects-across-key-se.html
- https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/overview.html
- https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/who-can-apply.html
- https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/apply.html
- https://www.canada.ca/en/employment-social-development/services/funding/sectoral-workforce-innovation-fund/prepare-application.html
- https://catalogue.servicecanada.gc.ca/content/EForms/en/Detail.html?Form=EMP5741
- https://www.canada.ca/en/employment-social-development/services/funding/disability-opportunity-national-regional.html
- https://www.canada.ca/en/employment-social-development/services/funding/disability-opportunity-national-regional/applicant-guide.html
- https://healthyagingcore.ca/funding-opportunities/apply-for-funding-opportunities-fund-for-persons-with-disabilities-national-or-regional-component
- https://www.canada.ca/en/employment-social-development/programs/disability-inclusion-action-plan/employment-strategy.html
- https://www.canada.ca/en/employment-social-development/news/2026/07/government-of-canada-invests-over-15-million-to-help-remove-employment-barriers-for-youth-and-persons-with-disabilities.html
- https://www.newswire.ca/news-releases/government-of-canada-invests-in-skills-training-for-youth-and-persons-with-disabilities-869811603.html
- https://www.newswire.ca/news-releases/parliamentary-secretary-church-shares-canada-s-commitment-to-ensure-the-full-inclusion-of-persons-with-disabilities-at-the-united-nations-829776235.html
- https://disabilityinsider.com/2026/06/15/accessibility/canada-pledges-inclusion-of-persons-with-disabilities-at-un/ *(third-party)*
- https://www.canada.ca/en/employment-social-development/programs/skills-success.html
- https://www.canada.ca/en/employment-social-development/services/funding/literacy-skills.html
- https://www.canada.ca/en/employment-social-development/services/funding/skills-success.html
- https://www.canada.ca/en/employment-social-development/services/funding/programs.html
- https://hellodarwin.com/business-aid/programs/sectoral-workforce-solutions-program *(third-party)*
- https://hellodarwin.com/business-aid/programs/opportunities-fund-for-persons-with-disabilities-national-or-regional-component *(third-party)*
- https://ircc.com/news/the-government-of-canada-is-launching-a-call-for-proposals-under-the-sectoral *(third-party)*

### Ready, Willing and Able
- https://cklbradio.com/2026/08/19/analysis-finding-work-opportunities-for-northerners-with-intellectual-disabilities-and-autism/
- https://autismalliance.ca/rwa-expansion/
- https://www.cbc.ca/news/canada/north/job-market-intellectual-disabilities-nwt-canada-funding-9.7328439?cmp=rss
- https://ca.news.yahoo.com/yellowknife-family-fears-job-program-005803834.html
- https://www.deductly.ca/programs/ready-willing-able *(third-party)*

### FedDev Ontario
- https://feddev-ontario.canada.ca/en/funding-southern-ontario
- https://feddev-ontario.canada.ca/en/funding-southern-ontario/funding-businesses-southern-ontario-how-apply
- https://feddev-ontario.canada.ca/en/funding-southern-ontario/funding-businesses-southern-ontario-what-we-support
- https://grantcompass.ca/grants/feddev-ontario-business-scale-up-and-productivity *(third-party)*
- https://govmoney.ca/blog/feddev-ontario-bsp-guide *(third-party)*
- https://fairgrantwriting.ca/grant/business-scale-up-and-productivity-bsp-government-loan-for-southern-ontario-3/ *(third-party)*

### NRC IRAP and SR&ED
- https://www.nrc.canada.ca/en/support-technology-innovation/financial-support-technology-innovation
- https://publications.gc.ca/collections/collection_2026/cnrc-nrc/NR16-208-2026-eng.pdf
- https://enno.ca/nrc-irap-canada-innovation-funding-guide/ *(third-party)*
- https://granthub.ca/guide/nrc-industrial-research-assistance-program *(third-party)*
- https://hellodarwin.com/business-aid/programs/nrc-irap-support-for-clean-technology *(third-party)*
- https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program/sred-claim/investment-tax-credit.html
- https://kpmg.com/ca/en/insights/2026/02/canadas-sr-and-ed-program-enters-a-new-era.html
- https://www.bdo.ca/insights/sr-ed-program-enhancements-and-updates-draft-legislation-released
- https://www.sreducation.ca/ecpc-sred-refundable-credit/ *(third-party)*
- https://www.boast.ai/en-ca/resources/guides/the-complete-guide-to-sred-tax-credits-2026 *(third-party)*

### Ontario Centre of Innovation and health technology
- https://www.oc-innovation.ca/programs/collaborate-2-commercialize/
- https://www.uoguelph.ca/research/alerts/content/nserc-alliance-advantage-oci-c2c-defense-and-dual-use-and-ai-calls
- https://www.uoguelph.ca/research/alerts/content/ontario-centre-innovation-oci-collaborate-2-commercialize-program-rolling-intake
- https://www.linkedin.com/posts/ontario-centre-of-innovation_c2c-ai-defencetech-activity-7483143539204489216--cT6 *(third-party)*
- https://ontariohealth.ca/system/health-innovation-pathway
- https://innovationfactory.ca/beyond-the-pilot-the-journey-to-provincial-scale-via-ontarios-health-innovation-pathway/
- https://grantcompass.ca/grants/oci-collaborate-2-commercialize *(third-party)*
- https://grantcompass.ca/grants/ontario-health-technology-accelerator-fund *(third-party)*
- https://grantcompass.ca/ontario-digital-grants.html *(third-party)*
- https://grantcompass.ca/ontario-rd-innovation-grants.html *(third-party)*
- https://hellodarwin.com/business-aid/organizations/ontario-centre-of-innovation *(third-party)*

### Social finance and impact investing
- https://www.canada.ca/en/employment-social-development/programs/social-innovation-social-finance/social-finance-fund.html
- https://www.canada.ca/en/employment-social-development/programs/social-innovation-social-finance/social-finance-fund/results-updates.html
- https://www.canada.ca/en/employment-social-development/programs/social-innovation-social-finance/investment-readiness.html
- https://realizecapitalpartners.ca/
- https://realizecapitalpartners.ca/about/
- https://www.theglobeandmail.com/business/article-realize-capital-partners-closes-social-impact-investing-fund/
- https://riif.ca/outcomes/
- https://tapestrycapital.ca/raise-capital/
- https://tapestrycapital.ca/about-us/
- https://tapestrycapital.ca/tapestry-community-capital-cmhc-housing-supply-challenge-finalist/
- https://ca.linkedin.com/company/tapestry-capital *(third-party)*
- https://futureofgood.co/first-canada-wide-lending-fund-for-community-bonds-launches/ *(third-party)*
- https://futureofgood.co/explainer-what-realize-fund-is-final-close-says-about-the-state-of-canadas-social-finance/ *(third-party)*
- https://grantcompass.ca/grants/social-finance-fund *(third-party)*
- https://altss.com/profile/realize-capital-partners *(third-party)*
- https://www.torontomu.ca/social-innovation/student-funding/siaf/
- https://www.heerlaw.com/innovation-funding *(third-party)*

### Workforce planning boards
- https://www.workforcedev.ca/ontario-workforce-boards/
- https://www.workforcewindsoressex.com/workforce-windsoressex-launches-2025-26-community-labour-market-plan-march-12-2026/
- https://workforceplanningboard.org/local-labour-market-plan-2026-now-live/

### Insurers and disability management
- https://www.newswire.ca/news-releases/manulife-canada-partners-with-osara-health-to-bring-personalized-cancer-support-to-canadians-838357423.html
- https://www.benefitsandpensionsmonitor.com/benefits/group-health/manulife-tests-cancer-support-platform-focused-on-recovery-return-to-work/393316
- https://www.insurancebusinessmag.com/ca/news/group-benefits/manulife-osara-health-launch-cancer-coaching-pilot-for-group-benefits-members-569889.aspx
- https://www.sunlife.ca/static/slf/Innovations%20in%20Absence%20and%20Disability%20Management/Disability%20BrightPaper%20PDF8445%20E.pdf
- https://www.sunlife.com/en/newsroom/news-releases/
