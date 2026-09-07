# Trampoline — Business Design Document

Working name: **Trampoline**. Subtitle: dual-rebuild readiness passport.

Source of truth for this document is the product brief. Where this document and a marketing idea disagree, the brief wins.

## 1. Problem

People who need to turn around health and career at the same time get split across apps.

- Wellness and health tools assume income is stable.
- Career and employment tools treat health as a sidebar.
- Neither side knows when the person can handle the next load: school, training, or a job.

The result is a person who is either pushed into a placement too early and collapses out of it, or held back with no way to show a school or employer that they are ready now.

## 2. Positioning

Trampoline is a **router and a progress record**.

- We do **not** compete with established medical, fitness, diet, mental-health, education, or employment services.
- For established services we are an **extra funnel**: they advertise into it, and they receive qualified, staged referrals.
- For connectivity gaps we own the **track, the gates, the proof, and the handoffs**.

### Feature test

Every proposed feature gets one question: *does an incumbent already deliver this to the end user?*

| Answer | Action |
| --- | --- |
| Yes | Integrate and send them volume. |
| No, and the user gets stuck | Build the thinnest connector that unsticks them. |

If a feature looks like competing with an incumbent, stop and ask before building it.

## 3. Product

A readiness passport — a progress track that works as a living credential.

The user levels up their life through milestones. Passing checks gauges readiness for levels of schooling and employment. Demonstrated, current progress unlocks access to training seats and jobs.

This is **not** a habit tracker with a jobs tab, and **not** a social feed.

### Actors

| Actor | What they do |
| --- | --- |
| Person | Holds the passport, completes checks, applies to gated opportunities. |
| Attestor | A partner practitioner or assessor who issues or revokes a check. |
| Org admin | Manages an organization's attestors, opportunities, and gates. |
| Funder | Workforce agency, insurer, community health, or return-to-work program tracking connection and outcomes. |

## 4. Levels

Names can change; meaning cannot. Levels are bundles of passed checks — not quiz scores, not vibes.

| Level | Name | Meaning |
| --- | --- | --- |
| 0 | Stabilize | Safety, basic medical contact, sleep and medication consistency. |
| 1 | Capacity | Show-up streak, movement floor, mental check-in, short tasks on time. |
| 2 | Trainable | Can attend a course or placement without collapsing. |
| 3 | Employable | Skills check plus reliability window plus clearance bundle. |
| 4 | Hold | 30/60/90 days in school or work without dropping the health floor. |

## 5. The four check types

Partners perform the checks. We store the attestations.

| Type | Who attests |
| --- | --- |
| Medical | Clinic, occupational health, family doctor. |
| Wellness | Gym, trainer, Y, physio, optionally a wearable. |
| Mental | Counselor, EAP, regulated provider. |
| Skills | School, employment agency, certified assessor, employer trial. |

### What we store

- Who attested.
- Pass, fail, or pass-with-restrictions.
- What it unlocks.
- Issued-at and expires-at.

### What we never store

- Full medical charts.
- Therapy notes.
- Workout programs.

Medical and mental gates require **regulated attestors**.

## 6. Unlock model

Employers and programs publish requirements as **gates**. Examples from the brief:

- Warehouse: Level 2 + lifting restriction clear + 14-day attendance.
- Trade pre-apprenticeship: Level 2 + module X + trade medical.
- Remote admin: Level 2 + computer skills + sustained-focus check.

Rules that follow from this:

- Users apply with the passport, not only a PDF resume.
- **Decay:** missed or expired checks drop access, so the record stays trustworthy.
- **Restrictions are first-class.** A restriction routes a person toward compatible work; it is not merely a failed binary "cleared" flag.
- **Cross-domain rules apply.** A health drop can pause job applications.

## 7. What we own

- Dual intake: health load and work load on one scale.
- Milestone definitions partners can pass or fail in a standard way.
- Evidence locker of attestations.
- Unlock rules engine.
- Decay and expiry.
- Employer and school share view.
- Sequencing: stabilize → capacity → direction and skills → placement → 90-day hold.
- Cross-domain rules.
- Outcomes: showed up, stayed, relapsed, hired, kept the job 90 days.

## 8. What we do not own

- Our own class schedule, calorie tracker, EMR, or LMS content.
- A resume rewriter, if local agencies already do it.
- Scraped mass job inventory to beat Indeed.
- A competing gym network.
- Any chatbot that issues medical or mental clearance.

## 9. Business model

| Payer | What they pay for |
| --- | --- |
| Vendors | Pipeline: featured placement, qualified leads, success fees. |
| Funders | Connection: workforce agencies, insurers, community health, disability and return-to-work programs. |
| Employers (later) | Reduced hiring risk, gated seats. |

Consumer-only subscriptions are a weak primary model for this user and are not the plan.

## 10. Trust, fairness, privacy

- App use can be open. **Gated opportunities require checks.**
- Mental and medical gates need regulated attestors.
- Rubrics are published. No hidden caste.
- Minimum necessary sharing.
- The share view for schools and employers carries **readiness, restrictions, and expiry only** — never diagnoses.
- Design for Canadian privacy (PIPEDA and applicable health information rules) for an Ontario launch. Keep personal health information out of the employer view.
- Attestations are append-only with revoke events, so the record has an audit trail rather than an edit history.

## 11. Success metric

Seats fill because the passport reduced hiring and training risk — not because people liked leveling.

Supporting measures live in [`../STRATEGY.md`](../STRATEGY.md).

## 12. Related documents

- [`../STRATEGY.md`](../STRATEGY.md) — short product anchor.
- [`execution-strategy.md`](execution-strategy.md) — sequencing, partner motion, revenue order, risks.
