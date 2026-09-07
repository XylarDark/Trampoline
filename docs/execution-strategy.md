# Trampoline — Execution Strategy

Companion to [`business-design.md`](business-design.md). That document says what we are; this one says what we do first and in what order.

## 1. Geography

Ontario first. That choice sets two assumptions:

- **Privacy posture:** PIPEDA plus applicable Ontario health information rules. No personal health information in employer or school views; pointers and scoped tokens rather than health data blobs.
- **Partner assumptions:** the attestor network we can actually reach in one region — community clinics and occupational health, a Y or municipal gym and physio clinics, counseling and EAP providers, plus a college or employment agency for skills.

One region is deliberate. The passport is only credible where a real gatekeeper honours it.

## 2. Sequence for the person

```
dual intake → stabilize → capacity → direction and skills → placement → 90-day hold
```

Each arrow is a level boundary from the business design, and each boundary is crossed by passing checks that a partner issued — never by self-report alone.

## 3. MVP order

Build in this order. Do not start a later item to avoid a harder earlier one.

1. **User track + four milestone types + level calculation.** The spine. Levels computed from current, unexpired, unrevoked attestations.
2. **Attestor role.** A partner can issue and revoke a check.
3. **Evidence locker + expiry.** Append-only attestations with issued-at and expires-at, and decay when they lapse.
4. **Shareable readiness page.** Level, restrictions, expiry. Nothing clinical.
5. **Network:** 5–10 local attestors and 10–20 real seats that only open at Level 2 or 3.

Item 5 is the one that proves the model. Items 1–4 are the thin machinery that makes item 5 possible.

### First vertical slice

Before breadth, prove depth: **one user completes a check, levels up, and unlocks a mocked job.** One route through the whole system beats four half-built subsystems.

## 4. Partner motion

We approach established services as an extra funnel, not as a competitor.

| Partner type | What they get | What we ask |
| --- | --- | --- |
| Clinic / occupational health | Staged referrals, fewer inappropriate visits | Issue medical checks in a standard pass/fail/restriction form |
| Gym / physio / Y | Referred members with a defined goal | Issue wellness checks |
| Counselor / EAP | Referrals arriving at the right stage | Issue mental checks |
| School / agency / assessor | Applicants who will not drop out in week two | Issue skills checks; publish program gates |
| Employer | Candidates screened for reliability and restriction fit | Publish requirements as gates; report outcomes |

We own the track, gates, proof, and handoffs **only where the connectivity is missing.** Everything an incumbent already delivers to the end user, we integrate with and send volume to.

## 5. Revenue order

1. **Funders and agencies first** — they already pay for connection and outcome reporting, and they have budget lines for return-to-work.
2. **Vendor pipeline second** — featured placement, qualified leads, success fees, once there is user volume worth advertising into.
3. **Employer gated seats third** — once the passport has a track record of reducing hiring risk.
4. **Consumer subscriptions: not primary.** This user has the least ability to pay and the most to gain.

## 6. Risks and how we hold them

| Risk | Mitigation |
| --- | --- |
| Attestation fraud | Attestors are org-bound accounts; medical and mental checks require regulated attestors; append-only records with revoke events. |
| Over-sharing health information | Share view is level + restrictions + expiry only; scoped tokens with expiry; no charts, notes, or programs stored. |
| We start looking like a competing clinic or job board | Apply the feature test before every build; ask before adding anything an incumbent already delivers. |
| Decay tuned wrong | Validity windows are data per check type, not code, so they can be tuned without a release; too harsh strands people, too lax makes the credential worthless. |
| Gatekeepers ignore the passport | Recruit gates before scale: no new user-facing breadth until real Level 2/3 seats exist. |
| Fairness complaints about gating | Rubrics are published; restrictions route toward compatible work rather than acting as a hidden disqualifier. |

## 7. Standing decision rule

Ask before adding any feature that looks like competing with an incumbent. The default answer for delivery features is no; the default answer for connectors is "build the thinnest one that works."

## 8. Technology posture

The stack that carries this is described in [`../README.md`](../README.md). Constraints that come from this strategy rather than from engineering taste:

- Rules live as **data**, not as branching code, so partners' gates can change without a deploy.
- Attestations are **append-only** with revoke events.
- No health information blobs; pointers plus scoped tokens for share links.
- Role-based access for user, attestor, org admin, and funder.
