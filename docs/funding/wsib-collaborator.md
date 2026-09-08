# WSIB research funding — as a funded collaborator

**Status:** blocked on a question only WSIB can answer. Send the enquiry; do not plan against a competition until it replies.

**Why this one.** WSIB bars private organizations from leading a project, but funds collaborators who supply a service or resource not otherwise available to the team. That describes us precisely — and unlike most funding, it pays for exactly the thing we most need for every other conversation: evidence that our approach works.

**Why it is worth the effort even at a modest award size.** A peer-reviewed result with a named research institution behind it is worth more to the sector-council conversation, the provider conversation, and the eventual government conversation than the money is. We are buying credibility that cannot be bought any other way.

## First: there may be no competition

**No open WSIB research competition could be found, and the program page is stale.** It says "the 2026 grants competition will open in early 2026. Details will be posted here" — but the page's own last-updated date is **2025-09-17**, and no 2026 competition, dates, or call for proposals has been posted anywhere, including the public grant portal. The most recent published proposal instructions and research agenda are both for the **2025** competition.

Whether the 2026 competition opened and closed, was deferred, or was cancelled **cannot be determined from public sources.** Nor could a 2026 research agenda be found, which means every priority quoted below is from the 2025 agenda and may not carry forward.

The program is not dormant — WSIB's 2026 policy agenda commits to continued research grants for scientific reviews and to developing new grants with its occupational-disease advisory table. But the initiatives it names are **occupational-disease specific** (benzene and AML, asbestos and silica and lung cancer, diesel exhaust) rather than return-to-work. That is a real signal about where the money is pointed, and it is not at us.

## Action 1 — confirm the competition status

Send now. This is the gating question for the entire file, and it is one email. `grants@wsib.on.ca` is **confirmed current** — it appears three times on the live program page and again in the proposal instructions.

> **Subject:** Research and Grants Program — 2026 competition status and collaborator eligibility
>
> Hello,
>
> Two questions about the Research and Grants Program.
>
> First, the program page states that the 2026 grants competition would open in early 2026, but the page appears to have last been updated in September 2025 and I have not been able to find a call for proposals. Could you tell me whether that competition ran, and whether a further competition is scheduled? I would also like to be added to the email distribution list for future calls. Relatedly, is there a research agenda more recent than the 2025 one?
>
> Second, a question about collaborator eligibility. I understand a private organization cannot be the Project Lead but may be a collaborator, and that collaborators may receive project funds for a specified service or resource that is essential and not otherwise available to the team. Where a private organization would supply research infrastructure of that kind — a longitudinal record of functional restrictions and employment outcomes across multiple service providers — would that fall within the collaborator provision? I would also like to understand how that interacts with the restriction on using grant funds for software purchases.
>
> Thank you,
> [name], Trampoline

The second question deliberately raises the software-purchase restriction rather than waiting to be caught by it. See the IP and budget warnings below.

## What the terms actually are

| Item | Value |
| --- | --- |
| Maximum grant length | 2 years / 24 months |
| Maximum request | $150,000 per year, **$300,000 total** |
| 2025 competition total | Up to $2.0M |
| Process | Two stages — initial proposal, then detailed proposal **by invitation only**, peer review, panel of senior WSIB leaders, CEO approval |
| Reporting | Quarterly |

**Eligibility, verbatim:** "Private organizations are not eligible to apply for a WSIB research grant as a Project Lead. Private organizations may be identified as a partner or collaborator of an eligible applicant organization." Eligible hosts are publicly funded universities and colleges, public hospitals with a specialized research area, not-for-profits and registered charities with research capacity, Canadian NGOs with research capacity, and "other organizations that have the capability and capacity to conduct research **and are not privately owned and operated**."

A **collaborator** is defined as central to the project and providing a specific service — WSIB's own examples include statistical analysis and access to a patient population — and **may be eligible to receive project funds** where the contribution is demonstrably essential and not otherwise available to the team. Note that project advisory committee members are generally treated as collaborators and are generally *not* eligible for funds for their time.

### Two conditions to settle before contributing anything

**The IP term is aggressive.** WSIB retains "a non-exclusive, perpetual, irrevocable right to use, reproduce, display, distribute and prepare derivative works of all material produced from grant activities." Read that against contributing proprietary software as research infrastructure. It likely does not reach our pre-existing codebase, but it plainly reaches anything produced *under* the grant, and "prepare derivative works" is broad. Get legal advice on the boundary before signing, and scope our contribution so the thing we own is not the thing produced.

**That boundary is only defensible with a provable date, and it now has one.** "Pre-existing" means pre-existing on the record. As of 2026-09-07 the engine, its tests, and the provider routes are committed and pushed to `origin/main` — `src/engine/levels.ts`, `src/engine/rules.ts` and `src/db/schema.ts` in `087798e`, and `src/engine/outcomes.ts`, `src/engine/outcomes.test.ts` and `app/provider/page.tsx` in `3090288` — all before any grant conversation has been opened. Cite those SHAs, not a directory listing: the point is that GitHub attests the date, not us. Keep it that way by pushing before each conversation, so anything we contribute later is visibly later.

**The budget rules constrain how we could be paid.** Funds may not be used for capital expenditures or overhead; **IT hardware or software purchases may not be made unless explicitly identified in the budget**; consulting fees are prohibited outright; any external expert must be named in the proposal and budget with their role and compensation described; equipment is capped at 10% of total funds. So our line has to be written into the budget from the first draft as a named essential service — not added later, and not framed as consulting.

**On data:** WSIB administrative data can be requested for a grant project, and proposals are strengthened by showing linkage to datasets outside WSIB — which is an opening for us. But WSIB "cannot actively support recruitment or refer individuals to a program for the purpose of a grant project," so it will not supply the cohort.

## Action 2 — approach a researcher to lead

We need an eligible Project Lead with a track record in work disability. IWH is a not-for-profit and therefore an eligible host; we are not.

**One caution about IWH: it publishes no commercial partnership pathway at all.** Its four published "get involved" routes are research participation, joining a project advisory committee, adjunct scientist appointment, and the board — none of which is a route for a company to propose a partnership, and there is no named contact for one. The general route is `info@iwh.on.ca` or 416-927-2027. The advisory-committee web form is the only open intake, and worth submitting on its own merits: three to ten hours a year, and members "may also be approached to participate on research project teams."

### The best single entry point

**Dr. Rebecca Gewurtz**, Associate Professor, School of Rehabilitation Science, McMaster — `gewurtz@mcmaster.ca`.

She is the right first call because she bridges both institutions and both propositions:

- **Adjunct Scientist at IWH** *and* McMaster faculty, so one conversation reaches both.
- **Director of the IDEA (Inclusive Design for Employment Access) Social Innovation Laboratory**, funded by a New Frontiers Research Fund Transformation Grant, co-directed with an IWH senior scientist.
- Researches **the process of negotiating workplace accommodations**, work disability policy, income insecurity, and employment among people with episodic disabilities and mental illness — proposition 2, exactly.
- Studies "demand-side capacity building" to help workplaces hire and accommodate, and works through participatory action research and **co-designing solutions**, which is a methodology that has room for a software partner.
- Currently recruiting graduate students on **employment support systems**.

Her long-standing collaborator **Dr. Sandra Moll** (`molls@mcmaster.ca`) works on mental health and return to work, e-mental health, and co-design, and built an app-based peer support tool — so she has shipped software in this space. Their co-authorship network overlaps heavily with IWH, which makes **IDEA the natural single point of entry to both institutions at once.**

Note a genuine gap: no McMaster faculty member in the Department of Health Research Methods, Evidence and Impact could be identified whose primary programme is work disability. That expertise sits in the School of Rehabilitation Science. Do not spend time on HEI.

### IWH scientists, if approaching IWH directly

- **Dr. Monique Gignac**, Scientific Director — workplace communication, privacy, and **accommodation needs among people with chronic and episodic conditions**; leads ACED, and won a 2022 inclusive-design award for the **Job Demands and Accommodation Planning Tool (JDAPT)**. `mgignac@iwh.on.ca`. **Read the overlap warning below before approaching her.**
- **Dr. Dwayne Van Eerd** — prevention of work disability and implementation of workplace programmes; currently holds WSIB-funded projects on accommodation and reintegration. `dvaneerd@iwh.on.ca`.
- **Dr. Arif Jetha**, Associate Scientific Director — employment participation of workers with disabilities, and AI in work; leads a seven-year partnership on AI and quality of work. `ajetha@iwh.on.ca`.
- **Dr. Peter Smith**, President — work injury consequences using population surveys and **administrative compensation data**; published on comparative return-to-work experience in 2026.
- **Dr. Nancy Carnide** — long-term recovery and return-to-work outcomes among Ontario injured workers. `ncarnide@iwh.on.ca`.
- **Emma Irvin** — leads a systematic review of **system-based return-to-work and disability management interventions**, with a practical guide as a deliverable. No public email found; route through `info@iwh.on.ca`.

Gignac, Van Eerd, and Jetha all currently hold WSIB-funded projects, which is the most reliable signal of who can actually land one.

### Competitive warning: JDAPT

Gignac's **Job Demands and Accommodation Planning Tool** is an award-winning, academically-backed accommodation planning instrument for people with chronic and episodic conditions. That is uncomfortably close to proposition 2, and it comes with the credibility we are trying to acquire.

Treat this as an input to [`../research/competitive-landscape.md`](../research/competitive-landscape.md), not just a contact. Before pitching accommodation specification to anyone, read JDAPT and be able to say precisely what we do that it does not — most plausibly that JDAPT is a planning instrument used in a conversation while we are a durable multi-party record with expiry and revocable consent. If that distinction does not hold up, proposition 2 needs rethinking, and better to learn it from her than from a funder.

### The research question to propose

Bring a question, not a product. A researcher is not interested in our roadmap; they are interested in whether there is a publishable question with data behind it.

**Our proposed question is almost verbatim a WSIB priority.** The 2025 agenda lists, under "All injuries": *"How can those at risk of experiencing a duration beyond 3-months and 6 months be identified?"*

So propose: *Can functional restriction data, recorded at the point of assessment and carried across service providers, identify workers at risk of work-disability duration beyond three and six months earlier than current practice?* — adopting WSIB's three-and-six-month framing rather than our own vaguer "prolonged."

Why this question and not another:

- It matches a named WSIB priority in WSIB's own words, which is the difference between a proposal that fits the agenda and one that argues with it.
- It needs longitudinal, cross-provider, individual-level restriction and outcome data — which nobody has, because every existing record is trapped in a container the person has to stay inside.
- It is answerable with observational data, so it does not depend on our pilot completing first.
- It is not a question about our software. If the answer is no, that is still publishable, and we would want to know.

Other 2025 priorities worth knowing: tools and services that build **employer capacity** to support return-to-work; tools for return-to-work after workplace mental health injuries; and for injuries beyond six months, the unique challenges of that population. All from the 2025 agenda — confirm against a current one if the reply to Action 1 produces one.

**A framing caution that also applies to SR&ED.** This is a social-science research question. That is correct and welcome for WSIB, and it is **statutorily excluded from SR&ED**. Keep the two narratives separate: the WSIB proposal asks whether restriction data predicts duration; the SR&ED claim asks whether contradictory multi-attester assertions can be reconciled deterministically. Never let one document do both jobs. See [`verified-facts.md`](verified-facts.md).

### The approach email

> **Subject:** Cross-provider functional restriction data — possible research collaboration
>
> Dear Dr. Gewurtz,
>
> I am building a record that carries functional restrictions and employment outcomes with a person as they move between health and employment services in Ontario — deliberately not tied to a single employer, claim, or program, because our population is usually between all three. The design rule is that nothing health-derived can restrict access to work; health information triggers support and specifies accommodation, and that is all.
>
> That produces a data shape I have not found elsewhere: individual-level restriction and outcome data, longitudinal, across multiple providers. I think it may support a question WSIB has named as a priority — whether restriction data recorded at assessment can identify risk of work-disability duration beyond three and six months earlier than current practice.
>
> WSIB cannot fund a private organization as Project Lead but can fund a collaborator supplying something essential and not otherwise available. I am looking for a researcher who would find the question worth leading, and your work on negotiating workplace accommodations and on employment support systems is the closest fit I have found.
>
> Two things I would rather say up front than have you discover. We have no data yet, so anything here is prospective — though there is a working read-only prototype I can show you, which derives Ontario's funded-outcome milestones from an employment record and is honest on screen about the one aggregation rule no public directive defines. And I am aware of the JDAPT work at IWH; I would genuinely like to understand whether what I am building is complementary to it or redundant with it, and I would rather be told the latter early.
>
> Would a short conversation be useful?
>
> [name], Trampoline

The last two paragraphs are not throat-clearing. A cold approach from a company to an academic reads as a request for endorsement unless it visibly invites a negative answer — and naming the adjacent academic tool ourselves is the difference between looking informed and looking like we did not check.

## What we can and cannot offer honestly

**Can offer:** a deterministic, reproducible operationalisation of Ontario's funded-outcome definitions. It is a pure function with no hidden state and an injected clock, so the same record always produces the same verdict, and the one rule with no public source is isolated in a single named constant a reviewer can flip to test sensitivity. That is a measurement instrument rather than an application feature, and it is the part of this a methodologist will care about. Plus the data structure and schema, our design rules and privacy posture, and access to the pilot cohort if the pre-apprenticeship pilot proceeds.

**Cannot offer, and must not imply:** existing data. We have none. Any proposal is prospective, and saying so up front is the only way this relationship survives contact with reality.

The demo cohort is twelve synthetic fixtures at `@example.invalid` addresses, each engineered to produce one verdict. Say so the moment the screen is shown. A researcher who discovers it afterwards will not distinguish "demo" from "fabricated data," and would be right not to.

## Sequencing note

Both actions are independent of the retention interviews, so they can run in week 1 in parallel. Action 1 costs nothing and its answer determines whether there is a competition at all — but **do not gate Action 2 on it.** A researcher relationship takes months to build and is worth having regardless of WSIB's calendar; there are other funders for the same question, and Gewurtz is worth knowing whether or not WSIB ever reopens.

## Tracker

| Action | Sent | Response | Next step |
| --- | --- | --- | --- |
| WSIB competition status and collaborator eligibility | | | |
| Rebecca Gewurtz, McMaster / IDEA — primary approach | | | |
| Sandra Moll, McMaster — if Gewurtz declines | | | |
| IWH advisory committee web form | | | |
| Read JDAPT and write the differentiation | | | |

## Related

- [`../execution-strategy.md`](../execution-strategy.md) — capital section
- [`swif-partner.md`](swif-partner.md) — the other partner-held opportunity
- [`../research/funding-landscape.md`](../research/funding-landscape.md)
