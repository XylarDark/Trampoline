# Trampoline: Competitive and Adjacency Scan

> **Note on provenance and currency.** This report was compiled on **2026-09-07** by web research. Every factual claim is linked to a source that was actually returned in search results at that time. Figures, funding amounts, adoption counts, program statuses, contract holders, and pilot dates change frequently — **re-verify anything you intend to use in a funding application, grant submission, or investor pitch** before relying on it. Nothing here is a substitute for primary confirmation with the named organizations.

---

## Bottom line

No one is selling exactly what Trampoline describes. But almost every *component* of it is already shipped and commoditized by someone, and the one place the whole model exists end-to-end — staged health-based work capacity, with restrictions, with expiry, gating access to programs — is a government monopoly in Australia.

The real risk this scan surfaced is not a competitor. It is that:

1. The closest historical attempt at Trampoline's exact wedge — the UK's **Fit for Work** service — died of demand-side indifference in 2018, and the specific reasons it died map directly onto Trampoline's dependency structure.
2. The best-evidenced employment model for Trampoline's target population — **Individual Placement and Support (IPS)** — explicitly rejects readiness gating as a founding principle.
3. The gate mechanic, the attestation-with-expiry data structure, and even the verdict-only privacy architecture are all already commercial products. The engineering is the easy part, which should worry rather than reassure.

What is genuinely unbuilt is **aggregation across containers for people who have none**. Every existing readiness record requires the person to already be inside a container — an employer, a claim, a benefits plan, a contractor engagement, a shift roster, an institution, an open case file. Trampoline's population is, by definition, outside all of them.

---

## 1. Skills passports, digital credentials, and Learning & Employment Records

### Ontario Skills Passport (OSP) — ADJACENT

A free bilingual web resource from the Ontario government describing Essential Skills and work habits (working safely, reliability, teamwork), with self-assessment tools, work plans, and transition plans. Crucially, its own facilitator materials state the OSP Work Plan "complements, but does not replace, mandatory documentation for Employment Ontario programs" ([skillszone.ca facilitator guide](https://www.skillszone.ca/welcome_newcomers/Facilitators%20Guide%20for%20Newcomers%20Videos_EN.pdf), [SkillsZone](https://www.skillszone.ca/), [SkillsZONE for learners](https://skillszone.ca/index_osp_learners.html), [Canadian Hearing Services overview](https://www.chs.ca/page/ontario-skills-passport)).

- **What it does:** describes and lets learners self-assess essential skills and work habits; produces work plans and transition plans.
- **Who pays:** the Province of Ontario.
- **Who the user is:** learners, job seekers, counsellors, job developers, teachers.
- **Verdict: ADJACENT.** It is self-assessed, not third-party attested, has no expiry, and gates nothing. Useful as shared vocabulary and a legitimacy reference, not a competitor.

Note also that Ontario already uses the word "Passport" for an unrelated developmental-disability funding program ([ontario.ca](http://www.ontario.ca/page/passport-program-adults-developmental-disability)), which is a naming collision worth knowing about in this market.

### MyCreds / MesCertif (ARUCC, technology by Parchment) — PARTIAL OVERLAP (integrate)

Canada's sector-owned national digital credential network. As of July 2025, 131 publicly funded institutions were active, representing 58% of Canada's public colleges, universities and institutes; it carries transcripts, diplomas, certificates, micro-credentials and badges in a learner-held wallet, and supports issuance, management and **revocation** ([newswire release](https://www.newswire.ca/news-releases/mycreds-r-reaches-majority-adoption-across-canada-s-public-colleges-institutes-universities-817365257.html), [Parchment](https://www.parchment.com/en-ca/solutions-my-creds/), [University Affairs](https://universityaffairs.ca/news/new-digital-wallet-puts-students-credentials-at-their-fingertips/), [MyCreds sign-in guide](https://mycreds.ca/how-to-sign-in-to-mycreds/)).

- **What it does:** learner-held wallet for official academic documents, instantly shareable with employers, institutions, government and licensing bodies.
- **Who pays:** institutions, and learners buy share credits to view and share documents ([Okanagan College student guide](https://www.okanagancollege.ca/sites/default/files/2026-06/mycreds-students-guide_jn_v.01.pdf)).
- **Who the user is:** post-secondary learners and graduates; receiving employers and institutions.
- **Verdict: PARTIAL OVERLAP (integrate).** This is the education rail. It carries nothing about health, restrictions, or functional capacity, and its revocation model is fraud-driven rather than time-decay-driven. If Trampoline needs a school or training credential, this is where to fetch it rather than reissue it.

### Credivera (Canada) — PARTIAL OVERLAP (integrate)

Verifiable digital credentials with explicit credential lifecycle management "from issuance to expiration," source-verified against issuing bodies, aligned to DIACC's Pan-Canadian Trust Framework, and positioned around Ontario's new "As of Right" labour mobility regime and site-access workflows ([Credivera labour mobility](https://www.credivera.com/labour-mobility), [skilled trades article](https://www.credivera.com/resources/articles/skilled-trades-the-value-of-verifiable-credentials-for-employers/), [labour mobility blog](https://www.credivera.com/blog/labour-mobility-in-canada-as-of-right-from-policy-to-practice)).

Ontario's As of Right rules came into force January 1, 2026 across 50+ non-health regulators ([Ontario Newsroom](https://news.ontario.ca/en/backgrounder/1006892/regulations-and-statutes-in-force-as-of-january-1-2026)), and there is reportedly no operational central API linking those regulators ([The Modern Regulator](https://themodernregulator.com/canada-regulatory-coordination-13-regulators/)).

- **What it does:** issues, manages and verifies cryptographically signed credentials with defined expiry; intake and verification workflows for regulators and employers.
- **Who pays:** regulators, professional associations, institutions, employers.
- **Who the user is:** credential holders (professionals, tradespeople) and verifying organizations.
- **Verdict: PARTIAL OVERLAP (integrate).** This is the closest Canadian company to Trampoline's credential substrate. Building an in-house verifiable-credential issuance layer instead of using theirs would violate Trampoline's own feature test.

### Velocity Network Foundation — ADJACENT (potential rail)

Blockchain-based verifiable career credentials, with over 1 million wallet installs, 2 million+ credentials issued, and 130+ active organizations including HireRight, Cisive, Randstad, UKG and Korn Ferry ([Velocity traction page](https://velocity-network.gitbook.io/velocity-network/our-vision-in-action/editor-1), [mainnet launch](https://www.velocitynetwork.foundation/velocity-network-foundation-has-announced-its-successful-launch-of-velocity-network-mainnet-internet-of-careers)).

- **What it does:** decentralized public utility for issuing and verifying career credentials.
- **Who pays:** node-operating HCM vendors, staffing firms, employers.
- **Who the user is:** individuals holding career credentials; employers verifying them.
- **Verdict: ADJACENT.**

### California Career Passport — ADJACENT (precedent)

A state-run Learning and Employment Record, with a pilot demonstration running June 17 to August 24, 2026, combining transcripts with verified skills earned through military service, job training and other routes, so employers can see a validated record of demonstrated ability ([Governor of California](https://www.gov.ca.gov/2026/06/17/californias-career-passport-to-connect-qualified-workers-to-employment-with-or-without-a-four-year-degree/)).

- **What it does:** consolidates academic records with skills earned outside the classroom into a shareable, verified record.
- **Who pays:** the State of California.
- **Who the user is:** California workers, especially those without four-year degrees; employers.
- **Verdict: ADJACENT.** An important precedent that governments now build these directly — both a validation of the concept and a displacement risk.

### ACT WorkKeys National Career Readiness Certificate (US) — PARTIAL OVERLAP conceptually, NOT RELEVANT competitively in Canada

The closest existing thing to Trampoline's *staged levels* concept: a portable credential awarded at Bronze, Silver, Gold and Platinum from three assessments, with substantial state-level adoption (Louisiana has issued 307,362 NCRCs since 2006; Vermont requires WorkKeys of CTE students) ([ACT NCRC indicator](https://www.act.org/ncrc-indicator), [Fall 2025 indicator update](https://www.act.org/content/dam/act/unsecured/documents/Fall-2025-Updates-ACT-Progress-Toward-Career-Readiness-Indicator.pdf), [ACT industry insights](https://industryinsights.act.org/2025/10/states-find-success-using-act-workkeys-and-ncrc-for-student-and-economic-success)).

Watch the erosion signal: at least one workforce centre announced it will stop offering WorkKeys after June 25, 2026 "due to a statewide decline in utilization by employers and increasing costs" ([Workforce Center notice](https://www.facebook.com/WorkforceCenter/posts/due-to-a-statewide-decline-in-utilization-by-employers-and-increasing-costs-the-/1448510207304961/)).

- **What it does:** assesses foundational workplace skills and issues a tiered portable certificate.
- **Who pays:** states, school districts, workforce boards, and job seekers.
- **Who the user is:** students and job seekers; employers as recognizers.
- **Verdict: PARTIAL OVERLAP conceptually, NOT RELEVANT competitively in Canada.** But the demand decay is a warning about staged readiness credentials generally.

### The LER adoption evidence — the most important finding in this section, and it is bad news

1EdTech's 2025 research found adoption remains fragmented, employers "struggle to find, trust, or interpret" credential data and revert to degrees and resumes when it is unclear ([1EdTech LER reports](https://www.1edtech.org/workstream/credentials/ler-reports), [HRTech Edge summary](https://hrtechedge.com/e-learning/1edtech-research-reveals-why-digital-credentials-havent-delivered-on-skills-based-hiring/)).

Brookings, citing Aspen Institute work, is blunter: credential providers are "designing products for which there is unclear demand," employers were "not engaged at all" or "only marginally consulted" in developing many LER platforms, and employers are not asking their HR system vendors to ingest LERs, so it hasn't happened ([Brookings](https://www.brookings.edu/articles/exploring-the-disconnect-digital-credentials-and-employer-demand/)).

An LER messaging guide adds the operational detail that matters most to Trampoline: employers indicated "limited willingness to visit separate websites for individual profiles outside of applicant tracking systems" ([Messaging Guide](https://issuelab.org/permalink/resource/43721)).

### Direct answer: does anything already store third-party-attested readiness for hiring?

For **education and licensure**, yes — several things do (MyCreds, Credivera, Velocity, Merit). For **health and functional readiness**, no consumer-held record exists. That data lives inside employer occupational health systems, inside workers' compensation claims, and on paper forms. **That asymmetry is the core finding of this report.**

### Non-Canadian "passport" precedents — ADJACENT

- **Māori and Pasifika Trades Training Work Readiness Passport (NZ)** is genuinely third-party attested: each passport is signed off by an independent advisor called a Navigator whose "reputation is on the line with every Work Readiness Passport they grant" ([MPTT infographic](https://www.maoripasifikatrades.co.nz/wp-content/uploads/2017/05/MPTT-Passport-Infographic.pdf)).
- **This-Ability Employability Passport (UK)** ran an explicitly three-stage model — "Ready, Willing and Able," "World of Work," "Good to Go" ([CRESR final report](https://doi.org/10.7190/cresr.2024.5099525876)).
- **MORAL Passport to Employment (EU, Erasmus+)** issues stackable micro-credentials across 20 key skills ([Euroguidance](https://euroguidance.eu/moral-key-skills-micro-credentials-a-passport-to-employment-and-inclusion)).
- **Skills Builder My Employment Passport (UK)** targets young people with learning disabilities and autism ([Skills Builder](https://www.skillsbuilder.org/global/programmes/my-employment-passport-gold-offer)).

All are curriculum-and-sign-off programs; none carry health verdicts or expiry. **Verdict: ADJACENT precedents.**

---

## 2. Employment readiness assessment in Canadian employment services — the hardest structural constraint

This is where the feature test bites hardest, and not because of a competing product.

### Common Assessment Tool (CAt) — NOT RELEVANT as competitor, but a hard adoption blocker

A mandatory digital intake questionnaire administered by Integrated Employment Services providers and Social Assistance delivery agents. Module 1 informs a life-stabilization action plan; Module 2 informs the Employment Ontario Employment Action Plan; for EO-only clients the provider administers both. It streams clients by service intensity and checks the case management system for an existing active Employment Action Plan before allowing a new assessment ([Common Assessment and ICM Business Process Guide](https://london.ca/sites/default/files/2024-03/est-business-process-guide-common-assessment-en-integrated-case-management-en%20%2857%29.pdf), [CA Reference Guide](https://london.ca/sites/default/files/2024-03/common-assessment-reference-guide-en.pdf)).

### EOIS-CaMS — NOT RELEVANT as competitor, but a hard adoption blocker

The Employment Ontario Information System Case Management System. Common Assessment submission creates the client profile and assigns the unique client reference number; "Common Assessment is a mandatory element"; an Employment Action Plan can only be associated to a single Common Assessment record ([EOIS-CaMS Service Provider User Guide](https://london.ca/sites/default/files/2024-03/EOIS-CaMS-Chapter-8I-Service-Plan-Management-IES-EAP-w-Appendix-Q4-2022-23-Release-1%20%281%29.pdf)). EOIS also includes EOIS-APPR and EOIS-SP Connect ([Employment Ontario Partners' Gateway](https://eopg.labour.gov.on.ca/en/resources/employment-ontario-information-systems/)). Social assistance runs on SAMS, and the two action plans are linked digitally for Integrated Case Management.

### ESCases — NOT RELEVANT as competitor, but a hard adoption blocker

A third mandated layer at the Service System Manager level. Provider standard operating procedures require that within 24 hours of CaMS entry, staff open ESCases and link the client using the CaMS client reference number ([Service Provider SOPs](https://london.ca/sites/default/files/2024-05/Service%20Provider%20Standard%20Operating%20Procedures.pdf)).

**Combined verdict on CAt, CaMS and ESCases: NOT RELEVANT as competitors, but they are a hard adoption blocker.** A frontline Employment Ontario worker already does CAt, then CaMS, then ESCases for every client, under a 24-hour SLA. Any fourth system is a fourth system. Trampoline's realistic path into this channel is not "adopt our app" but "we consume your CaMS reference number and hand you back something you currently cannot get" — and even that likely requires the Service System Manager, not the frontline provider, to say yes.

### The Service System Managers — ADJACENT (best channel partners)

Integrated Employment Services is now live across all 15 catchment areas under nine Service System Managers:

- **WCG Services** — Peel, York, Ottawa, Toronto
- **Fedcap Canada** — Hamilton-Niagara, Halton
- **EmployNext, powered by Serco** — Kingston-Pembroke, Kitchener-Waterloo-Barrie, Northwest
- **Fleming College** (Muskoka Kawarthas Employment Services) — Muskoka-Kawarthas
- **Collège Boréal** — Northeast
- **Regional Municipality of Durham** — Durham
- **London Regional Employment Services** — London
- **Windsor Regional Employment Network** — Windsor-Sarnia
- **Employment Services Peninsula Huron-Perth-Bruce-Grey** — Stratford-Bruce Peninsula

Sources: [First Work 2025 report](https://firstwork.org/wp-content/uploads/2025/10/EST_REPORT_2025_FINAL.pdf), [WCG SSM page](https://wcgservices.com/our-programs/employment-ontario-service-system-manager/), [WCG Toronto](https://wcgservices.com/toronto-integrated-employment-services/), [Ontario ADM memo on Phase 1 SSMs](https://eopg.labour.gov.on.ca/wp-content/uploads/2025/01/est-adm-memo-eo-network-phase1-ssms-selection-en.pdf), [Fedcap Hamilton-Niagara](https://fedcapgroup.org/news/a-consortium-led-by-fedcap-inc-selected-as-service-system-manager-for-employment-services-in-the-hamilton-niagara-area).

- **Who pays:** the Ministry of Labour, Immigration, Training and Skills Development.
- **Who the user is:** service providers and, downstream, job seekers.
- **Verdict: ADJACENT (best channel partners).** Nine decision-makers cover the entire province.

### First Work's 2025 evaluation — the strongest available evidence that a gap exists

Among surveyed Employment Service Providers:

- **55% disagreed** that the new IES model significantly reduces barriers to employment.
- **60% disagreed** that case management is more efficient and well-organized.
- **74% reported no change** in housing support; **74% no change** in daycare/childcare support.
- **51% reported longer wait times** before clients receive services.
- Only **37%** noted moderate improvement in access to mental health services.
- Service System Managers themselves acknowledged some clients are streamed into Stream A or B when they should have been in Stream C.
- Providers specifically flagged that mis-streaming happens with **"high-needs male youth who underreport mental health"** at assessment.

Source: [First Work, "What's Working, What's Not," 2025](https://firstwork.org/wp-content/uploads/2025/10/EST_REPORT_2025_FINAL.pdf).

That last point is the closest thing in this entire scan to a validated demand signal for an objective, third-party-attested health readiness record: **the system's own operators say self-report is producing wrong placements for exactly Trampoline's target population.**

---

## 3. Occupational health, fitness-for-duty and clearance platforms

### Cority (formerly Medgate) — PARTIAL OVERLAP (integrate)

Toronto, founded 1985, rebranded from Medgate in 2017 after a $100M+ investment from Norwest Venture Partners, Georgian Partners and BMO, later backed by Thoma Bravo ([Medgate rebrand](https://www.cority.com/news-media/medgate-rebrands-as-cority/), [GlobeNewswire](https://www.globenewswire.com/news-release/2017/06/21/1027158/0/en/Medgate-Rebrands-as-Cority.html), [Globe and Mail on the recapitalization](https://www.theglobeandmail.com/report-on-business/streetwise/bmo-georgian-partners-in-100-million-deal-to-help-toronto-niche-software-firm-consolidate-market/article29362661/), [CB Insights](https://www.cbinsights.com/company/cority), [Cority 2017 results](https://www.cority.com/news-media/cority-solidifies-leadership-in-ehsq-market-with-record-2017-results/)).

The product explicitly tracks **"absences, work restrictions, and modified duties,"** runs configurable medical surveillance programs with **automated alerts to ensure timely testing**, and automates pre-placement health screening ([occupational health solutions](https://www.cority.com/health-cloud/occupational-health-solutions/), [health cloud](https://www.cority.com/health-cloud/), [feature blog](https://www.cority.com/blog/features-to-look-for-in-a-top-occupational-health-solution/)).

- **What it does:** enterprise occupational health record — clinical case management, restrictions and modified duties, medical surveillance with renewal alerts, pre-placement screening.
- **Who pays:** large employers.
- **Who the user is:** occupational health nurses and clinicians — not the worker.
- **Verdict: PARTIAL OVERLAP (integrate).** This is the most important "already delivers it" finding on the health side. Cority already stores who attested, restrictions, and renewal timing. The distinction that saves Trampoline's thesis is scope: Cority's record is **employer-owned and employment-contingent**. It exists because you have a job at a company that bought Cority, and it evaporates when you don't. Trampoline's population, by definition, doesn't have that job yet.

### XcelABLE Performance360 — PARTIAL OVERLAP

Post-offer employment testing, fit-for-duty evaluations and FCEs where **"employers receive only a medically guided clearance or non-clearance outcome,"** all health information stored offsite in clinical environments separate from employer HR systems, with the medical team rather than the employer issuing the decision ([Performance 360](https://xcelable.com/performance-360/), [post-offer testing](https://xcelable.com/post-offer-employment-testing/), [FCEs](https://xcelable.com/functional-capacity-evaluations/)).

- **What it does:** clinician-overseen job-readiness testing with verdict-only disclosure to the employer.
- **Who pays:** employers.
- **Who the user is:** HR teams and occupational health professionals; the tested worker is the subject.
- **Verdict: PARTIAL OVERLAP.** Note carefully: this is **Trampoline's exact privacy architecture, already commercialized**. Verdict-only disclosure with clinical data held elsewhere is not a novel design.

### WorkCare — ADJACENT

FCEs plus pre-placement, DOT, respirator clearance and fit testing, hearing conservation, HAZMAT, maritime medical surveillance and independent medical evaluations across a US provider network ([WorkCare FCE blog](https://workcare.com/resources/blog/functional-capacity-evaluations-fces-insights-for-safe-compliant-work-assignments/)).

- **Who pays:** employers. **Who the user is:** employers and their occupational health teams.
- **Verdict: ADJACENT.**

### Turn — PARTIAL OVERLAP

Combines occupational health screening (pre-employment physicals, DOT, immunizations, sanctions) with criminal background checks, education and employment verification in one candidate workflow across 10,000+ clinic locations, with candidate self-scheduling ([Turn healthcare screening](https://turn.ai/healthcare-screening/)).

- **Who pays:** employers. **Who the user is:** hiring teams; candidates self-schedule.
- **Verdict: PARTIAL OVERLAP** — this is the "clearance plus screening in one router" model, in the US, employer-paid.

### Humanforce — ADJACENT

Compliance management with configurable expiry alerts at 90, 60, 30 and 7 days and **"automatic shift restrictions — expired credentials block rostering"** ([Humanforce](https://www.humanforce.com/products/hr/compliance-management)).

- **Who pays:** employers with frontline workforces. **Who the user is:** rostering and compliance managers.
- **Verdict: ADJACENT.**

### Do these already carry restriction and expiry data to employers?

**Yes — but only inside a single employment relationship, and mostly as a binary clearance at a single point in time.** Nothing here follows the person between employers, and nothing here recognizes an attestation issued by a gym, a counsellor, or a school.

---

## 4. Return-to-work and disability management in Canada

### TELUS Health (formerly LifeWorks / Morneau Shepell) — PARTIAL OVERLAP (integrate / potential channel)

End-to-end absence and disability case management: telephonic assessment establishing a return-to-work date, detailed review to "determine the employees' abilities, type of workplace accommodation, benefits eligibility, and timelines for return to work," and a network of assessors, specialized clinics and healthcare providers ([TELUS Health absence and disability management](https://www.telus.com/en/health/employers/absence-management/absence-disability-management), [leave and disability management](https://www.telushealth.com/en-us/solutions/leave-and-disability-management)).

- **What it does:** administers disability and leave claims and coordinates safe, timely return to work.
- **Who pays:** employers and insurers.
- **Who the user is:** the employer's HR/benefits function; the absent employee is the subject.
- **Verdict: PARTIAL OVERLAP (integrate / potential channel).** Same data, opposite population — TELUS serves people who currently have an employer and a benefits plan.

### Lifemark — ADJACENT (ideal attesting partner)

Functional Abilities Evaluations and Cognitive Abilities Evaluations, job-site assessments, graduated return-to-work schedules coordinated with employer and physician. The FAE "establishes an outline of what physical level of work you are able to perform" and identifies required job modifications or restrictions ([Lifemark FAE](https://www.lifemark.ca/services/fae), [Lifemark return to work](https://www.lifemark.ca/index%2ephp/services/return-to-work)).

- **Who pays:** WSIB/WCB, insurers, employers, legal representatives.
- **Who the user is:** the injured worker as subject; the requesting payer as recipient.
- **Verdict: ADJACENT (ideal attesting partner).**

### The WSIB provider roster — ADJACENT (pre-built partner list)

For vocational, functional and cognitive assessments, job coaching and specialized ergonomic assessments: **Agilec, AGS Rehab Solutions, Bayshore HealthCare, Insight Advantage, Lifemark Health, March of Dimes, Rehabilitation Network, Santé Circle Health, Trillium Health Partners.**

For employment services (job search support, retraining, work experience, job retention): **Agilec, CBI Workplace Solutions, Insight Advantage, Lifemark Health Corp, March of Dimes, Rehabilitation Network, VPI.**

Source: [WSIB service providers](https://www.wsib.ca/en/businesses/return-work/service-providers).

- **Who pays:** WSIB. **Who the user is:** injured workers with active claims.
- **Verdict: ADJACENT — these are partners, not competitors.**

### WSIB Functional Abilities Form (FAF) — PARTIAL OVERLAP (template to copy, not reinvent)

The closest thing in Canada to Trampoline's core data object, and it already exists. It communicates functional abilities and restrictions from a health professional to an employer, **deliberately excludes diagnostic and confidential medical information**, and requires the worker to sign a release before information goes to the employer ([CCOHS on Functional Abilities Evaluation](https://www.ccohs.ca/oshanswers/psychosocial/rtw/rtw_abilities.html), [RIDM on the WSIB FAF](https://ridm.net/what-is-the-wsib-functional-abilities-form/)).

- **Who pays:** WSIB / employers. **Who the user is:** employers planning accommodation; the worker consents to release.
- **Verdict: PARTIAL OVERLAP — and a template Trampoline should copy rather than reinvent.** Its limitation is precisely the gap: it is claim-scoped, paper-scoped, and single-employer-scoped. There is no persistent, worker-held version.

### Bardavon Health Innovations (US) — PARTIAL OVERLAP

Workers' compensation MSK platform with 40,000+ directly contracted outpatient therapy providers, the bNOTES clinical guidance system, the Bardavon Index predictive models, and notably **XRTS, "a unique work readiness program designed to ensure that an injured worker is physically ready to perform their job tasks safely."** Employers get visibility into return-to-work times, claims costs and outlier cases ([Bardavon injury recovery](https://www.bardavon.com/injury-recovery/), [homepage](https://www.bardavon.com/), [ten years blog](https://www.bardavon.com/blog/ten-years-dedicated-to-movement-health/), [Bardavon Index](https://www.bardavon.com/blog/the-bardavon-index-how-does-it-inform-better-treatment-decisions/), [Bardavon Analytics launch](https://www.globenewswire.com/news-release/2021/09/30/2306383/0/en/Bardavon-Analytics-Creates-Modern-Way-to-Manage-Workers-Compensation.html)).

- **Who pays:** payers, adjusters, employers in workers' compensation.
- **Who the user is:** injured workers as patients; adjusters and case managers as data consumers.
- **Verdict: PARTIAL OVERLAP** — again claim-scoped and payer-funded.

---

## 5. Supported and gated employment models — where Trampoline faces a genuine intellectual challenge

### Individual Placement and Support (IPS) — ADJACENT, and the strongest objection to Trampoline's design

IPS is the evidence-based supported employment standard, and one of its eight core principles is **zero exclusion**: *"People are not excluded on the basis of readiness, diagnoses, symptoms, substance use history, psychiatric hospitalizations, homelessness, level of disability, or legal system involvement."* IPS uses rapid job search "rather than assessments, training, & counseling," with first face-to-face employer contact within 30 days ([IPS Employment Center](https://ipsworks.org/index.php/what-is-ips/)).

The Ontario HIV Treatment Network's evidence review describes IPS as the "place-then-train" successor that outperforms pre-vocational training programs, with assessment that is "continuous and based on real work experiences" ([OHTN rapid response](https://www.ohtn.on.ca/rapid-response-51-effectiveness-and-key-features-of-employment-support-program/)).

**This is the most substantive objection to Trampoline in the entire scan, and it is not competitive — it is evidentiary.** A staged readiness ladder in which a person must clear Level 0 Stabilize before reaching Level 2 Trainable is, structurally, the train-then-place model that IPS displaced on the strength of outcome evidence. Expect this objection from every clinical and mental-health employment partner approached.

The defensible reframing: Trampoline's gates are **employer-published job requirements that already exist and are currently invisible**, not **service-provider-imposed prerequisites for receiving help**. That argument must be made explicitly and in writing.

- **Who pays:** provincial health ministries and community mental health funders.
- **Who the user is:** people with serious mental illness and substance use challenges.
- **Verdict: ADJACENT.**

### Lift Program at Youth Wellness Hubs Ontario / CAMH "What works for work?" — ADJACENT (best-aligned Canadian pilot partner)

A pan-Canadian implementation of IPS in integrated youth service hubs, embedding an employment specialist in the mental health treatment team, launched across hubs including Foundry and ACCESS Open Minds and reaching 700+ youth aged 12–25 across 12 hubs ([YWHO Lift](https://youthhubs.ca/index%2ephp/lift-program-ywho), [CAMH announcement](https://www.camh.ca/en/camh-news-and-stories/initiative-to-help-young-people-with-mental-health-challenges-find-employment)).

- **Who pays:** health system funders and philanthropic partners.
- **Who the user is:** youth with mental health and/or substance use challenges.
- **Verdict: ADJACENT — the single best-aligned Canadian pilot partner**, and also the toughest audience for gating.

### Implementation fidelity is weak in Canada — a real opening

A study of 20 supported employment programs across BC, Quebec and Ontario found the IPS model "not being consistently implemented," with some agencies adopting it without formal training and others rejecting core provisions such as time-unlimited support ([CMHA Ontario](https://ontario.cmha.ca/news/supported-employment-for-people-with-serious-mental-illness-not-fully-implemented-in-canada/)).

### Canadian employment social enterprises that already stage people into work — ADJACENT (best design partners)

- **Building Up** (Toronto) — non-profit social enterprise, 16-week paid pre-apprenticeship, nearly 800 people trained, in-house case managers, tradespeople and counsellors. Notably runs "a thorough 4+ month assessment overseen by experienced site supervisors" plus a one-week free trial before referring candidates to employers ([mission](https://buildingup.ca/about/mission), [training](https://www.buildingup.ca/training), [CBC](https://www.cbc.ca/news/science/building-up-green-jobs-social-enterprise-1.6911073)).
- **EMBERS** (Vancouver) — registered charity since 2001 operating EMBERS Staffing, described as "one of Canada's largest employment social enterprises," covering the full continuum from pre-employment to sustainable employment ([EMBERS about](https://www.emberscanada.org/about-us)).
- **Eva's Initiatives YSEP** (Toronto) — 20-week Youth Succeeding in Employment Program: 5 paid weeks of pre-employment work plus CPR, Food Handler, Smart Serve and workplace health and safety certifications, then 15 weeks of placement ([Eva's](https://www.evas.ca/blog/employment-training-builds-skills-offers-experience/)).

- **Who pays:** a mix of contract revenue, government funding and philanthropy.
- **Who the user is:** people facing barriers to employment — newcomers, racialized people, women, people leaving incarceration, homeless youth.
- **Verdict: ADJACENT — best design partners.** These organizations already run informal staged readiness with real attestations. Building Up's four-month supervisor assessment is a hand-built version of Trampoline's Level 2-to-3 transition, and it currently exists as institutional knowledge rather than a portable record.

### Recovery-Friendly Workplace programs (US) — ADJACENT

State and NGO employer-recognition programs promoting fair-chance hiring, accommodation and supported employment for people with substance use disorder ([Recovery-Ready Workplace Toolkit](https://facesandvoicesofrecovery.org/wp-content/uploads/Documents/2023-11-14-Recovery-Ready-Workplace-Toolkit.pdf), [RFW Maine](https://rfwmaine.org/about-rfw/)).

- **Who pays:** states, employers, foundations. **Who the user is:** employers, and workers in or seeking recovery.
- **Verdict: ADJACENT** — they create employer demand but publish no machine-readable requirements.

---

## 6. Workforce screening, credential verification, and gated marketplaces

### Avetta Worker Management / Workforce by Avetta — NEAR-DIRECT COMPETITOR on mechanics, NOT RELEVANT on population

The closest existing implementation of Trampoline's core mechanic anywhere. Workers see each role as **"Work Ready" if all requirements are current and valid, or "not Work Ready" if any requirement is expired, missing, or otherwise non-compliant**; they receive "Expiring Soon" alerts; they can complete the qualifying training in-app to clear the requirement; and badge scanning and turnstile "Tap to Access" enforce entry so "only qualified workers are cleared to work on site" ([Workforce by Avetta app documentation](https://pegasusnet.atlassian.net/wiki/spaces/WFMS/pages/2931720235), [Avetta Worker Management solution brief](https://pages.avetta.com/rs/752-BVH-753/images/Worker-Management-Solution-Brief.pdf?version=1)).

- **Who pays:** hiring clients (site operators) and contractors.
- **Who the user is:** contractor workers, contractor admins, and site safety managers.
- **Verdict: NEAR-DIRECT COMPETITOR on mechanics, NOT RELEVANT on population.** It serves industrial contractors, not people rebuilding health and employment.

### ISNetworld — ADJACENT

Worker-level training and qualification management, 2.8 million employee training records, SCORM training delivery with configurable renewal dates and expiration notifications; a lapse in standing suspends site access ([ISNetworld](https://www.isnetworld.com/en/worker-level-training-qualifications), [ISN/Avetta facility manager guide](https://millfac.com/blog/isnetworld-avetta-guide)).

### Veriforce — ADJACENT

Maintains operator qualification records "at the individual employee and task level" for DOT-regulated pipeline work ([platform comparison](https://drake-fs.com/news/isnetworld-vs-avetta-vs-veriforce/)).

- **Who pays (both):** hiring clients and contractors. **Who the user is:** contractor workforces.
- **Verdict: ADJACENT.**

### Salus by Staffy / Staffy Workforce Scheduling — NEAR-DIRECT COMPETITOR on the gate, in Canada

Toronto, founded 2015, 20,000+ vetted healthcare workers. Credential verification is enforced inside the scheduling engine in real time: **"If a credential expires or a background check is pending, the system automatically blocks the worker and assigns the next compliant professional."** Their own writing states the design principle in terms Trampoline would recognize: *"If anything required for that shift expires before the shift ends, the assignment should not complete. Not a warning, not a flag. A refusal."* They verify licences against issuing registrars and handle RN, RPN and PSW credentials, TB tests, N95 fit-testing, BLS/ACLS, WHMIS and crisis intervention training ([Salus](https://salusworkforcemanagement.staffy.com/), [credential management blog](https://staffy.com/blog/healthcare-credential-management-should-be-boring/), [licence tracking blog](https://staffy.com/blog/how-to-track-200-nurse-licenses-without-a-spreadsheet/)).

- **Who pays:** healthcare and long-term care operators.
- **Who the user is:** independent healthcare workers and operator schedulers.
- **Verdict: NEAR-DIRECT COMPETITOR on the gate, in Canada** — and simultaneously the best demand-side integration target in long-term care.

### BookJane J360 — ADJACENT (channel)

Care-sector workforce platform with credential expiry alerts, qualification-matched shift bidding, cross-location swaps with qualification matching and full audit trail, used by 1,200+ care organizations across Canada, the US and the UK, with HRIS and payroll integrations ([BookJane](https://www.bookjane.com/), [pricing and features](https://www.bookjane.com/pricing/)).

- **Who pays:** care operators. **Who the user is:** schedulers and care staff.
- **Verdict: ADJACENT (channel).**

### Certn — PARTIAL OVERLAP (integrate)

Victoria, BC. Background checks in 195 countries plus a Credential Verification API that validates a candidate's professional credential or licence through the issuing institution or authorised data source, available in Canada and the US for HR use, with out-of-the-box integrations to Greenhouse, Lever and Workday ([Certn](https://certn.co/), [Certn US](https://certn.co/us/), [credential verification docs](https://docs.certn.co/api/guides/checks/credential-verification), [API reference](https://centric-api-docs.certn.co/reference/check-CREDENTIAL_VERIFICATIONS_1.md)).

- **Who pays:** employers. **Who the user is:** talent acquisition teams; candidates consent and submit.
- **Verdict: PARTIAL OVERLAP (integrate).** This is Trampoline's verification connector, already built and API-first.

### Merit — NEAR-DIRECT COMPETITOR on architecture

Sunnyvale, backed by Andreessen Horowitz, Snowflake and ServiceNow. A "flexible, permission-driven graph management system" for verified digital credentials, with real-time verification used to **"control scene access, disperse program benefits, validate credentials,"** plus workforce development connecting job seekers to quality jobs, and a Verified Forms Engine that auto-populates names, licence numbers and expiration dates. Nearly 3,000 organizations have issued 3.3 million merits, engaging over 550,000 individuals ([Merit platform launch](https://www.businesswire.com/news/home/20240627510200/en/New-Merit-Platform-Opens-Door-for-the-Next-Wave-of-Digital-Transformation-in-Government), [Snowflake partnership](https://www.businesswire.com/news/home/20230606005165/en/Merit-Brings-Seamless-Data-Sharing-and-Real-Time-Verification-to-Snowflakes-Government-Education-Data-Cloud), [Verified Forms Engine](https://martechseries.com/analytics/customer-identity-management/merit-introduces-custom-forms-tool-for-organizations-to-bring-verified-data-into-existing-workflows/)).

- **Who pays:** US state and local government agencies.
- **Who the user is:** credential holders, licensees, emergency responders, program beneficiaries.
- **Verdict: NEAR-DIRECT COMPETITOR on architecture** — attestation graph plus eligibility gating plus expiry is exactly Trampoline's data model, sold to US government. It carries no health or functional-capacity semantics and has no Canadian presence found in this scan.

### Honest Jobs — ADJACENT (closest working analog to restriction-based routing)

US fair-chance hiring platform: 225,000+ justice-involved job seekers, 350,000+ fair-chance job opportunities, a job board available inside most US jails and prisons. Its **"Conflix"** feature analyzes a job description against a candidate's convictions and gives the job seeker a visual indication when a conviction would directly conflict with the job duties, aligned to EEOC guidance ([for employers](https://www.honestjobs.com/for-employers), [about](https://www.honestjobs.com/about-honest-jobs), [for job seekers](https://www.honestjobs.com/for-job-seekers)).

- **Who pays:** employers (placement and platform fees), with free access for job seekers.
- **Who the user is:** people with criminal records; fair-chance employers.
- **Verdict: ADJACENT — and the closest working analog to "restrictions are first-class and route people to compatible work."** Same routing logic, legal restrictions instead of medical ones. Also demonstrates the barrier-holder-facing side of this market can sustain a venture.

### Aspire Technologies — NOT RELEVANT

Military licence portability with reciprocity-law-generated checklists and a portable document wallet for military families and veterans ([merits.com digital credentialing](https://www.merits.com/digital-credentialing)).

- **Who pays:** US state licensing boards. **Who the user is:** military spouses, veterans, servicemembers.
- **Verdict: NOT RELEVANT.**

---

## 7. Closest international analogs, including one that is essentially Trampoline run by a government

### Australia's Employment Services Assessment (ESAt) and Job Capacity Assessment (JCA) — DIRECT ANALOG (public sector, not a purchasable product)

This is the closest full-system analog to Trampoline that exists anywhere.

- Assessments are conducted by **health and allied health professionals within Services Australia**, who have access to current and previous medical and disability status and can liaise with treating doctors and relevant health professionals.
- They identify barriers, **work capacity in hour bandwidths**, and interventions that may improve capacity — including both **baseline work capacity** and **work capacity within 2 years, with intervention**.
- **A JCA generally remains current and valid for 2 years** unless there is a significant change to the person's circumstances affecting impairment or work capacity. *That is Trampoline's expiry-and-decay rule, in statute.*
- **A copy of the report is made available to the person's employment services provider** (the JCA copy excluding impairment information). *That is Trampoline's attestation-sharing rule.*
- It **gates program access**: a person must have a recommended referral to Disability Employment Services in an ESAt before receiving DES supports, and is eligible only if assessed able to work **at least 8 and no more than 29 hours per week**. For DSP recipients under 35, the ESAt establishes a bandwidth of 0–7 or 8+ hours per week.
- Assessed **partial capacity to work** then adjusts mutual obligation requirements: someone assessed at 15–29 hours per week can fully meet requirements with 30 hours per fortnight of approved activities and **cannot be penalised for refusing work of more than 15 hours per week**.

Sources: [ESAt definition](https://guides.dss.gov.au/social-security-guide/1/1/e/104), [JCA definition](https://guides.dss.gov.au/social-security-guide/1/1/j/10), [DES Program Guideline v11](https://www.dss.gov.au/system/files/documents/2025-06/disability-employment-services-program-guideline-v11.pdf), [partial capacity mutual obligations](https://guides.dss.gov.au/social-security-guide/3/11/7), [CoAct participant guide](https://coact.org.au/your-employment-services-assessments-esat-guide/).

- **Who pays:** the Australian Government.
- **Who the user is:** income support recipients and job seekers with health barriers; employment services providers as downstream recipients of the report.
- **Verdict: DIRECT ANALOG (public sector, not a purchasable product).**

**What this means for Trampoline.** Everything in the model — staged capacity, restrictions, expiry, gating — is operating at national scale. Two things distinguish Trampoline: Australia's version uses a **single state assessor** rather than a network of clinics, gyms, counsellors and schools; and it is **welfare-eligibility infrastructure**, so the gate determines benefits rather than unlocking training seats and jobs. But Trampoline cannot claim the concept is unproven, and should not claim it is novel.

### UK WorkWell — ADJACENT (best public-sector model of the router thesis)

An integrated early-intervention work-and-health support service delivered through **15 of 42 Integrated Care Boards** from October 2024, supporting approximately **25,000 people in its first 14 months**, now expanding across all of England from **November 2026** with **up to £259 million over three years** targeting **up to 250,000 people**.

It is explicitly a **router**: personalised early support connecting people to physiotherapy, mental health interventions, workplace adjustment advice and employer liaison, plus financial and debt advice, housing support, smoking cessation, fitness programmes and other local groups. Referral can come from a GP, Jobcentre Plus, an employer, other local services, or self-referral, and it is voluntary and open regardless of benefit entitlement.

Sources: [WorkWell overview](https://www.gov.uk/government/publications/workwell), [national expansion announcement](https://www.gov.uk/government/news/expansion-of-support-scheme-to-help-thousands-of-people-back-into-work), [pilot management information, Oct 2024 – Mar 2026](https://www.gov.uk/government/publications/workwell-pilot-management-information-from-1-october-2024-to-31-march-2026/workwell-pilot-management-information-from-1-october-2024-to-31-march-2026).

**Two details from the official statistics matter most to Trampoline.** GP and primary care is the largest referral route into WorkWell; the share referred by **employers is explicitly small**, with the department noting difficulty getting employers to refer. And **47% of all WorkWell starts list a mental health condition** as their primary health-related barrier to work.

- **Who pays:** DWP and DHSC, via Integrated Care Boards.
- **Who the user is:** people with a disability or health condition, in work or out of work.
- **Verdict: ADJACENT — the best public-sector model of Trampoline's router thesis, and evidence that the health-side referral flywheel works while the employer-side one does not.**

### UK fit note reform pilots (2026) — ADJACENT

Four pilots in England covering up to **100,000 appointments** with **£3 million** in the first year, testing replacement of the fit note with personalised "stay in work" and "return to work" plans. In Birmingham and Solihull, and in Coventry and Warwickshire, GPs issue a fit note but also refer to support services; in **Cornwall and the Isles of Scilly, and Lancashire and South Cumbria, GPs refer patients directly to support services without issuing a fit note at all.** Fit notes are currently issued **more than 11 million times a year**.

Sir Charlie Mayfield's *Keep Britain Working* review found the system **"not working as intended,"** with most GPs lacking the training and time to assess someone's ability to work, and found fit notes were **often a barrier to contact between employers and employees** ([GOV.UK](https://www.gov.uk/government/news/broken-fit-note-system-to-be-overhauled), [BBC](https://www.bbc.co.uk/news/articles/cy82pxlmmyno)).

- **Who pays:** the UK Government / NHS.
- **Who the user is:** sick or injured workers, GPs, and employers.
- **Verdict: ADJACENT — direct evidence that the incumbent health-to-work attestation instrument is considered broken by its own government.**

---

## The strongest DIRECT or NEAR-DIRECT competitors, and exactly which pillar each has already shipped

There is **no direct competitor**. There are **five near-direct** ones, each of which has already shipped a different one of Trampoline's pillars, plus two honourable mentions.

1. **Australia's ESAt/JCA system — has already shipped the entire conceptual model.** Clinician-assessed staged work capacity in hour bandwidths, restrictions, two-year validity, report shared with the employment services provider, and hard program eligibility gating (8–29 hours for DES). It is a state monopoly, welfare-linked, and not a product — but it means the model is proven and unpatentable in concept. ([ESAt](https://guides.dss.gov.au/social-security-guide/1/1/e/104), [JCA](https://guides.dss.gov.au/social-security-guide/1/1/j/10), [DES Guideline](https://www.dss.gov.au/system/files/documents/2025-06/disability-employment-services-program-guideline-v11.pdf))

2. **Avetta Worker Management — has already shipped the gate.** Per-role requirement sets, a binary Work Ready / not Work Ready status computed from currency, expiring-soon warnings, in-app remediation training, and physical access enforcement at turnstiles. ([Workforce by Avetta](https://pegasusnet.atlassian.net/wiki/spaces/WFMS/pages/2931720235), [solution brief](https://pages.avetta.com/rs/752-BVH-753/images/Worker-Management-Solution-Brief.pdf?version=1))

3. **Salus by Staffy — has already shipped the gate in Canada, in healthcare.** Hard refusal on expiry inside the scheduling engine, verification against issuing registrars, 20,000+ workers on the marketplace side. ([Salus](https://salusworkforcemanagement.staffy.com/), [credential blog](https://staffy.com/blog/healthcare-credential-management-should-be-boring/))

4. **Merit — has already shipped the underlying architecture.** A permissioned attestation graph with real-time eligibility verification, licence expiry handling, and access control, at roughly 3.3 million credentials — though sold to US government and carrying no health semantics. ([Merit platform](https://www.businesswire.com/news/home/20240627510200/en/New-Merit-Platform-Opens-Door-for-the-Next-Wave-of-Digital-Transformation-in-Government))

5. **Cority — has already shipped the health payload.** Attesting clinician, work restrictions, modified duties, and medical surveillance programs with automated retest alerts — for large employers, employer-owned. ([Cority occupational health](https://www.cority.com/health-cloud/occupational-health-solutions/), [feature blog](https://www.cority.com/blog/features-to-look-for-in-a-top-occupational-health-solution/))

**Honourable mentions:**

- **XcelABLE Performance360 — has already shipped the privacy architecture.** Clearance verdict only to the employer, clinical data held offsite in clinical environments separate from employer HR systems, clinician rather than employer issuing the decision. ([Performance 360](https://xcelable.com/performance-360/))
- **WSIB Functional Abilities Form — has already shipped the data object, in Ontario, on paper.** Attested restrictions, diagnosis excluded, worker-consented release. ([CCOHS](https://www.ccohs.ca/oshanswers/psychosocial/rtw/rtw_abilities.html), [RIDM](https://ridm.net/what-is-the-wsib-functional-abilities-form/))

---

## The genuine unserved gap

Stated as narrowly as the evidence supports:

> **Every existing readiness record is scoped to a container the person must already be inside, and Trampoline's population is outside all of them.**

- Cority's record requires an employer who bought Cority.
- The WSIB Functional Abilities Form requires an open claim.
- TELUS Health requires a benefits plan.
- Bardavon requires a workers' compensation case.
- Avetta and ISNetworld require a contractor engagement.
- Salus and BookJane require being on a shift marketplace roster.
- MyCreds requires an enrolling institution.
- EOIS-CaMS requires an open Employment Action Plan with a specific service provider.

Someone simultaneously rebuilding health and employment — no current employer, no active claim, not yet enrolled — has no container, and therefore no record.

**Three specific consequences that no incumbent addresses:**

1. **No cross-domain aggregation.** A physiotherapy clearance, a counsellor's attestation, a fitness assessment and a training completion cannot currently sit in one record with one computed status. Each incumbent covers exactly one domain.
2. **No survival across transitions.** When a claim closes or a job ends, the restriction history does not travel with the person. Building Up's four-month supervisor assessment, Eva's certification stack, and a WSIB Functional Abilities Evaluation all produce genuine third-party judgments that evaporate at the container boundary.
3. **No published, machine-readable employer or training-provider requirements for this population.** Avetta and Staffy prove employers will publish requirement sets when the requirements are safety-regulatory and the employer is already paying for compliance. Nobody has done it for graduated health-based work capacity in general hiring.

### Caveat: the gap is smaller than it first appears

Be honest about this.

- **The gate mechanic is commodity software** — Avetta, ISNetworld, Veriforce, Salus, BookJane, Humanforce all ship it.
- **The attestation-with-expiry data structure is commodity software** — Certn, Credivera, MyCreds, Merit all ship it.
- **The verdict-only privacy model is commodity** — XcelABLE ships it.
- **The staged-levels idea is old**, and in the WorkKeys case is showing demand erosion, with at least one workforce centre dropping it in June 2026 for declining employer utilization.

What is genuinely unbuilt is the **aggregation across containers for people who have none** — and that is a coordination and trust problem, not a technology problem. **The engineering is the easy part, which should worry rather than reassure.**

---

## Evidence this has been tried and failed

### UK Fit for Work (2015–2018) — the direct precedent, and it failed for reasons that map onto Trampoline's exact risk profile

Launched in September 2015, Fit for Work let GPs *and employers* refer employees absent four weeks or longer for a **free occupational health assessment producing a Return to Work Plan**. It was scrapped in England and Wales on **31 March 2018** and in Scotland on **31 May 2018**, with the government blaming **low referral rates**. The helpline, website and web chat continued; the referral and return-to-work assessment element ceased.

**The specific failure numbers:**

- **65% of more than 400 GPs surveyed had not referred a single patient** to the service in the preceding year. ([Personnel Today](https://www.personneltoday.com/hr/fit-work-service-scrapped-workplace-health-policy-overhaul/), [People Management](https://www.peoplemanagement.co.uk/article/1746722/right-to-scrap-fit-for-work%20scheme))
- **Three out of five GPs were unsure whether it was effective** at reducing long-term sickness absence, and **15% described it as very ineffective.** ([People Management](https://www.peoplemanagement.co.uk/article/1746722/right-to-scrap-fit-for-work%20scheme))
- **Only 21 HR professionals** in a Willis Towers Watson study reported having used it. ([Personnel Today](https://www.personneltoday.com/hr/fit-work-service-scrapped-workplace-health-policy-overhaul/))
- **41% of referred employees in England and Wales, and 46% in Scotland, dropped out before assessment.** ([process evaluation research summary](http://sro.sussex.ac.uk/id/eprint/76794), [Personnel Today lessons](https://www.personneltoday.com/hr/228315/))
- The service **could not make contact with roughly 1,500 referred employees** between October 2015 and December 2016 using the contact details supplied or collected. ([Personnel Today lessons](https://www.personneltoday.com/hr/228315/))
- **Employers, not GPs, were the largest source of referrals** — GP referral rates were depressed by low awareness of the service and its benefits. ([Personnel Today lessons](https://www.personneltoday.com/hr/228315/))
- **Recommendations weren't actionable in real workplaces.** Employers reported recommendations **"could not be delivered within their work context or were not practicable,"** and if a Return to Work Plan's recommendations weren't taken up within a few months of referral, **they were unlikely ever to be implemented.** ([Personnel Today lessons](https://www.personneltoday.com/hr/228315/), [process evaluation](http://sro.sussex.ac.uk/id/eprint/76794))
- **A national service could not understand local occupational context.** RehabWorks' clinical director attributed the failure to the difficulty a national service has in understanding specific occupational issues and liaising with individual employers about return-to-work strategy. ([People Management](https://www.peoplemanagement.co.uk/article/1746722/right-to-scrap-fit-for-work%20scheme))
- **One third of employees (33%) felt they did not have a choice** in their referral. ([process evaluation](http://sro.sussex.ac.uk/id/eprint/76794))
- Underlying DWP research found GPs **do not see themselves as having occupational health expertise**, wanted an independent expert who could "provide specific advice on what the patient can and cannot do at work," and warned that any new service **"would need to place as little additional administrative pressure on GPs as possible."** ([DWP research report 820](https://assets.publishing.service.gov.uk/media/5a7af70d40f0b66eab99dee5/rrep820.pdf))

**Read those against Trampoline's design.** The failure was not the assessment or the data model — it was that **referrers didn't refer, participants dropped out before assessment, and employers found the resulting recommendations unusable in their actual workplace.** Trampoline depends on partners issuing attestations (referrers), individuals completing checks (participants), and employers publishing and honouring gates (usability). All three failed for Fit for Work.

**Trampoline's one structural advantage over Fit for Work:** its gates are **employer-authored**, so the employer defines what is practicable rather than receiving external recommendations they then reject. That is a real difference, and it should be the centre of the pitch.

### The LER employer-engagement stall

The second body of failure evidence is the Learning and Employment Record category's demand-side collapse:

- Despite years of investment, **adoption remains fragmented**; employers "struggle to find, trust, or interpret" credential data and **revert to familiar signals like degrees and resumes** when it is unclear or lacks validated evidence. ([1EdTech](https://www.1edtech.org/workstream/credentials/ler-reports), [HRTech Edge](https://hrtechedge.com/e-learning/1edtech-research-reveals-why-digital-credentials-havent-delivered-on-skills-based-hiring/))
- Credential Engine counts **over one million digital credentials offered by almost 60,000 providers** in the US alone — so supply is not the constraint. ([Brookings](https://www.brookings.edu/articles/exploring-the-disconnect-digital-credentials-and-employer-demand/))
- Aspen Institute research, cited by Brookings, concluded providers are **"designing products for which there is unclear demand,"** that LER messaging to employers is **"vague and unlikely to inspire continued interest at scale,"** and that employers are **"not engaged at all"** or **"only marginally consulted"** in developing many LER products and platforms. ([Brookings](https://www.brookings.edu/articles/exploring-the-disconnect-digital-credentials-and-employer-demand/))
- Employers **are not demanding that HR system vendors incorporate LER ingestion**, "and so this has not (yet) happened." The challenge is described as cultural, not only technical. ([Brookings](https://www.brookings.edu/articles/exploring-the-disconnect-digital-credentials-and-employer-demand/))
- Employers indicated **"limited willingness to visit separate websites for individual profiles outside of applicant tracking systems."** ([Messaging Guide](https://issuelab.org/permalink/resource/43721))

**That last quote is a specific product constraint: if Trampoline is a destination site, employers will not go there.**

### Secondary erosion signal

At least one US workforce centre announced it will stop offering the WorkKeys assessment after June 25, 2026, citing "a statewide decline in utilization by employers and increasing costs" — a warning that even the most established staged work-readiness credential is losing employer pull in some markets. ([Workforce Center notice](https://www.facebook.com/WorkforceCenter/posts/due-to-a-statewide-decline-in-utilization-by-employers-and-increasing-costs-the-/1448510207304961/))

---

## Best integration and distribution partners rather than competitors

### Distribution into the target population, in priority order

1. **The nine Ontario Service System Managers** — **WCG Services** (Peel, York, Ottawa, Toronto), **Fedcap Canada** (Hamilton-Niagara, Halton), **EmployNext powered by Serco** (Kingston-Pembroke, Kitchener-Waterloo-Barrie, Northwest), **Collège Boréal** (Northeast), **Fleming College / Muskoka Kawarthas Employment Services** (Muskoka-Kawarthas), **Regional Municipality of Durham** (Durham), **London Regional Employment Services** (London), **Windsor Regional Employment Network** (Windsor-Sarnia), and **Employment Services Peninsula Huron-Perth-Bruce-Grey** (Stratford-Bruce Peninsula). Nine relationships cover the entire province, and only they can authorize anything alongside CAt, CaMS and ESCases. ([First Work 2025](https://firstwork.org/wp-content/uploads/2025/10/EST_REPORT_2025_FINAL.pdf), [WCG](https://wcgservices.com/our-programs/employment-ontario-service-system-manager/), [Fedcap](https://fedcapgroup.org/news/a-consortium-led-by-fedcap-inc-selected-as-service-system-manager-for-employment-services-in-the-hamilton-niagara-area))

2. **Youth Wellness Hubs Ontario's Lift Program and the CAMH-led IPS network** — already integrating employment specialists into clinical teams, already serving the right population. Expect the IPS zero-exclusion objection here first, which makes them the best early test of whether Trampoline's framing survives contact with clinical partners. ([YWHO Lift](https://youthhubs.ca/index%2ephp/lift-program-ywho), [CAMH](https://www.camh.ca/en/camh-news-and-stories/initiative-to-help-young-people-with-mental-health-challenges-find-employment))

3. **Employment social enterprises: Building Up, EMBERS, Eva's Initiatives** — they already run multi-stage readiness with real attestations held informally. Building Up's four-month supervisor assessment and one-week employer trial is a manual version of Trampoline's Level 2-to-3 handoff. ([Building Up](https://buildingup.ca/about/mission), [EMBERS](https://www.emberscanada.org/about-us), [Eva's](https://www.evas.ca/blog/employment-training-builds-skills-offers-experience/))

### Attestation issuers (supply side) — the WSIB roster

The WSIB-approved provider roster already produces exactly the artifact Trampoline wants to store, in a standardized restrictions-only format, under an existing consent-and-release norm:

**Assessment providers (vocational, functional, cognitive, ergonomic):** Agilec · AGS Rehab Solutions · Bayshore HealthCare · Insight Advantage · Lifemark Health · March of Dimes · Rehabilitation Network · Santé Circle Health · Trillium Health Partners

**Employment services providers:** Agilec · CBI Workplace Solutions · Insight Advantage · Lifemark Health Corp · March of Dimes · Rehabilitation Network · VPI

Source: [WSIB service providers](https://www.wsib.ca/en/businesses/return-work/service-providers)

### Technical rails — build the connector, not the thing

- **Credivera** for verifiable credential issuance and lifecycle management in Canada. ([Credivera](https://www.credivera.com/labour-mobility))
- **Certn** for credential verification and background checks via API into existing applicant tracking systems. ([Certn credential verification](https://docs.certn.co/api/guides/checks/credential-verification))
- **MyCreds** for education and micro-credential records. ([MyCreds via Parchment](https://www.parchment.com/en-ca/solutions-my-creds/))
- **Cority** as the enterprise occupational health issuer, if a data-sharing arrangement is achievable. ([Cority](https://www.cority.com/health-cloud/occupational-health-solutions/))

### Demand side — gate consumers

**Salus by Staffy** and **BookJane** already enforce credential gates for Canadian long-term care and healthcare shifts, and already hold the operator relationships. They are the fastest realistic path to a live gate honouring a Trampoline attestation.

**Note the strategic implication:** if Trampoline cannot persuade a platform that already performs hard credential refusal to accept one more credential type, the thesis has a problem that no amount of product work will fix.

### One partner-selection principle the evidence strongly supports

Given that Fit for Work died on referral volume and LERs are stalling on employer engagement: **prove the demand side first.** Get one employer or one training provider to publish a requirement set and honour it *before* building the attestation network to satisfy it.

---

## Sources

- https://www.skillszone.ca/
- https://www.skillszone.ca/welcome_newcomers/Facilitators%20Guide%20for%20Newcomers%20Videos_EN.pdf
- https://skillszone.ca/index_osp_learners.html
- https://www.chs.ca/page/ontario-skills-passport
- http://www.ontario.ca/page/passport-program-adults-developmental-disability
- https://www.parchment.com/en-ca/solutions-my-creds/
- https://www.newswire.ca/news-releases/mycreds-r-reaches-majority-adoption-across-canada-s-public-colleges-institutes-universities-817365257.html
- https://universityaffairs.ca/news/new-digital-wallet-puts-students-credentials-at-their-fingertips/
- https://mycreds.ca/how-to-sign-in-to-mycreds/
- https://www.okanagancollege.ca/sites/default/files/2026-06/mycreds-students-guide_jn_v.01.pdf
- https://london.ca/sites/default/files/2024-03/est-business-process-guide-common-assessment-en-integrated-case-management-en%20%2857%29.pdf
- https://london.ca/sites/default/files/2024-03/EOIS-CaMS-Chapter-8I-Service-Plan-Management-IES-EAP-w-Appendix-Q4-2022-23-Release-1%20%281%29.pdf
- https://london.ca/sites/default/files/2024-03/common-assessment-reference-guide-en.pdf
- https://london.ca/sites/default/files/2024-05/Service%20Provider%20Standard%20Operating%20Procedures.pdf
- https://eopg.labour.gov.on.ca/en/resources/employment-ontario-information-systems/
- https://eopg.labour.gov.on.ca/wp-content/uploads/2025/01/est-adm-memo-eo-network-phase1-ssms-selection-en.pdf
- https://firstwork.org/wp-content/uploads/2025/10/EST_REPORT_2025_FINAL.pdf
- https://wcgservices.com/our-programs/employment-ontario-service-system-manager/
- https://wcgservices.com/toronto-integrated-employment-services/
- https://fedcapgroup.org/news/a-consortium-led-by-fedcap-inc-selected-as-service-system-manager-for-employment-services-in-the-hamilton-niagara-area
- https://www.cority.com/health-cloud/occupational-health-solutions/
- https://www.cority.com/health-cloud/
- https://www.cority.com/blog/features-to-look-for-in-a-top-occupational-health-solution/
- https://www.cority.com/news-media/medgate-rebrands-as-cority/
- https://www.cority.com/news-media/cority-solidifies-leadership-in-ehsq-market-with-record-2017-results/
- https://www.globenewswire.com/news-release/2017/06/21/1027158/0/en/Medgate-Rebrands-as-Cority.html
- https://www.cbinsights.com/company/cority
- https://www.theglobeandmail.com/report-on-business/streetwise/bmo-georgian-partners-in-100-million-deal-to-help-toronto-niche-software-firm-consolidate-market/article29362661/
- https://www.humanforce.com/products/hr/compliance-management
- https://xcelable.com/performance-360/
- https://xcelable.com/post-offer-employment-testing/
- https://xcelable.com/functional-capacity-evaluations/
- https://workcare.com/resources/blog/functional-capacity-evaluations-fces-insights-for-safe-compliant-work-assignments/
- https://turn.ai/healthcare-screening/
- https://www.telus.com/en/health/employers/absence-management/absence-disability-management
- https://www.telushealth.com/en-us/solutions/leave-and-disability-management
- https://www.wsib.ca/en/businesses/return-work/service-providers
- https://www.lifemark.ca/services/fae
- https://www.lifemark.ca/index%2ephp/services/return-to-work
- https://www.ccohs.ca/oshanswers/psychosocial/rtw/rtw_abilities.html
- https://ridm.net/what-is-the-wsib-functional-abilities-form/
- https://www.bardavon.com/
- https://www.bardavon.com/injury-recovery/
- https://www.bardavon.com/blog/ten-years-dedicated-to-movement-health/
- https://www.bardavon.com/blog/the-bardavon-index-how-does-it-inform-better-treatment-decisions/
- https://www.globenewswire.com/news-release/2021/09/30/2306383/0/en/Bardavon-Analytics-Creates-Modern-Way-to-Manage-Workers-Compensation.html
- https://ipsworks.org/index.php/what-is-ips/
- https://youthhubs.ca/index%2ephp/lift-program-ywho
- https://www.camh.ca/en/camh-news-and-stories/initiative-to-help-young-people-with-mental-health-challenges-find-employment
- https://ontario.cmha.ca/news/supported-employment-for-people-with-serious-mental-illness-not-fully-implemented-in-canada/
- https://www.ohtn.on.ca/rapid-response-51-effectiveness-and-key-features-of-employment-support-program/
- https://buildingup.ca/about/mission
- https://www.buildingup.ca/training
- https://www.cbc.ca/news/science/building-up-green-jobs-social-enterprise-1.6911073
- https://www.emberscanada.org/about-us
- https://www.evas.ca/blog/employment-training-builds-skills-offers-experience/
- https://certn.co/
- https://certn.co/us/
- https://docs.certn.co/api/guides/checks/credential-verification
- https://centric-api-docs.certn.co/reference/check-CREDENTIAL_VERIFICATIONS_1.md
- https://salusworkforcemanagement.staffy.com/
- https://staffy.com/blog/healthcare-credential-management-should-be-boring/
- https://staffy.com/blog/how-to-track-200-nurse-licenses-without-a-spreadsheet/
- https://www.bookjane.com/
- https://www.bookjane.com/pricing/
- https://www.isnetworld.com/en/worker-level-training-qualifications
- https://pages.avetta.com/rs/752-BVH-753/images/Worker-Management-Solution-Brief.pdf?version=1
- https://pegasusnet.atlassian.net/wiki/spaces/WFMS/pages/2931720235
- https://drake-fs.com/news/isnetworld-vs-avetta-vs-veriforce/
- https://millfac.com/blog/isnetworld-avetta-guide
- https://www.businesswire.com/news/home/20240627510200/en/New-Merit-Platform-Opens-Door-for-the-Next-Wave-of-Digital-Transformation-in-Government
- https://www.businesswire.com/news/home/20230606005165/en/Merit-Brings-Seamless-Data-Sharing-and-Real-Time-Verification-to-Snowflakes-Government-Education-Data-Cloud
- https://martechseries.com/analytics/customer-identity-management/merit-introduces-custom-forms-tool-for-organizations-to-bring-verified-data-into-existing-workflows/
- https://www.merits.com/digital-credentialing
- https://www.honestjobs.com/for-employers
- https://www.honestjobs.com/about-honest-jobs
- https://www.honestjobs.com/for-job-seekers
- https://www.credivera.com/labour-mobility
- https://www.credivera.com/resources/articles/skilled-trades-the-value-of-verifiable-credentials-for-employers/
- https://www.credivera.com/blog/labour-mobility-in-canada-as-of-right-from-policy-to-practice
- https://themodernregulator.com/canada-regulatory-coordination-13-regulators/
- https://news.ontario.ca/en/backgrounder/1006892/regulations-and-statutes-in-force-as-of-january-1-2026
- https://www.velocitynetwork.foundation/velocity-network-foundation-has-announced-its-successful-launch-of-velocity-network-mainnet-internet-of-careers
- https://velocity-network.gitbook.io/velocity-network
- https://velocity-network.gitbook.io/velocity-network/our-vision-in-action/editor-1
- https://www.1edtech.org/workstream/credentials/ler-reports
- https://hrtechedge.com/e-learning/1edtech-research-reveals-why-digital-credentials-havent-delivered-on-skills-based-hiring/
- https://www.brookings.edu/articles/exploring-the-disconnect-digital-credentials-and-employer-demand/
- https://issuelab.org/permalink/resource/43721
- https://www.gov.ca.gov/2026/06/17/californias-career-passport-to-connect-qualified-workers-to-employment-with-or-without-a-four-year-degree/
- https://www.act.org/ncrc-indicator
- https://www.act.org/content/dam/act/unsecured/documents/Fall-2025-Updates-ACT-Progress-Toward-Career-Readiness-Indicator.pdf
- https://industryinsights.act.org/2025/10/states-find-success-using-act-workkeys-and-ncrc-for-student-and-economic-success
- https://www.facebook.com/WorkforceCenter/posts/due-to-a-statewide-decline-in-utilization-by-employers-and-increasing-costs-the-/1448510207304961/
- https://www.gov.uk/government/publications/workwell
- https://www.gov.uk/government/news/expansion-of-support-scheme-to-help-thousands-of-people-back-into-work
- https://www.gov.uk/government/publications/workwell-pilot-management-information-from-1-october-2024-to-31-march-2026/workwell-pilot-management-information-from-1-october-2024-to-31-march-2026
- https://www.gov.uk/government/news/broken-fit-note-system-to-be-overhauled
- https://www.bbc.co.uk/news/articles/cy82pxlmmyno
- https://www.personneltoday.com/hr/fit-work-service-scrapped-workplace-health-policy-overhaul/
- https://www.personneltoday.com/hr/228315/
- https://www.peoplemanagement.co.uk/article/1746722/right-to-scrap-fit-for-work%20scheme
- http://sro.sussex.ac.uk/id/eprint/76794
- https://assets.publishing.service.gov.uk/media/5a7af70d40f0b66eab99dee5/rrep820.pdf
- https://guides.dss.gov.au/social-security-guide/1/1/e/104
- https://guides.dss.gov.au/social-security-guide/1/1/j/10
- https://guides.dss.gov.au/social-security-guide/3/11/7
- https://www.dss.gov.au/system/files/documents/2025-06/disability-employment-services-program-guideline-v11.pdf
- https://coact.org.au/your-employment-services-assessments-esat-guide/
- https://www.maoripasifikatrades.co.nz/wp-content/uploads/2017/05/MPTT-Passport-Infographic.pdf
- https://doi.org/10.7190/cresr.2024.5099525876
- https://euroguidance.eu/moral-key-skills-micro-credentials-a-passport-to-employment-and-inclusion
- https://www.skillsbuilder.org/global/programmes/my-employment-passport-gold-offer
- https://facesandvoicesofrecovery.org/wp-content/uploads/Documents/2023-11-14-Recovery-Ready-Workplace-Toolkit.pdf
- https://rfwmaine.org/about-rfw/
