# IRAP advisor and Transfer Payment Ontario registration

**Status:** two actions, both doable in week 1, both with no gatekeeper and no deadline pressure.

These are grouped because they share a property that makes them easy to defer and expensive to have deferred: neither pays anything now, and both take months to become useful. The cost of doing them late is that a narrow opportunity opens and we are not eligible to answer it.

Verified figures, form numbers, phone numbers, and procedural steps are recorded in [`verified-facts.md`](verified-facts.md). Nothing in this file should be relied on as current without checking there first.

## Action 1 — request an NRC IRAP Industrial Technology Advisor

**There is no web form. Call 1-877-994-4727, and a senior executive of the company has to be the one calling** — NRC's process specifies that. The contact centre decides whether we are ready to meet a client engagement advisor, who *may* then refer us to an Industrial Technology Advisor. Any site offering an online "IRAP application" is not the official route.

**Why now.** No form, no deadline, no competition. The advisor relationship is the product: it takes months to mature, the funding horizon behind it is a year or more, and it is the best source of warm referrals into the rest of the ecosystem. Starting the clock costs one phone call.

**Realistic expectation.** Treat it as a six-month relationship with a 12-18 month funding horizon. NRC's own language is a warning against expecting otherwise: the relationship "typically starts with advice and referrals before any funding is provided," and being invited to submit a proposal "does not guarantee funding." Anyone expecting money this quarter will be disappointed and will stop returning the advisor's calls, which wastes the only asset here.

The one part of the process that *is* fast is the end: once NRC has a complete proposal, decisions come in 20 business days for contributions up to $50K and 30 for $50K-$500K, with 2024-25 averages of 9 and 20 days. Everything slow happens before that, and none of it is documented anywhere official.

**Two things to know going in.** Pre-revenue is not a bar — there is no revenue floor in the eligibility criteria, and the corporate-form test (incorporated, for-profit, up to 500 employees) is one an Ontario CCPC passes. And **IRAP is scheduled to be folded into the Canada Innovation Corporation no later than 2026-27**, which is inside our horizon. Ask the advisor what that means for a relationship starting now; it is a fair question and their answer will be more useful than speculation.

**What to have ready before calling.** An advisor's first job is to decide whether we are a real company doing real technical work. Two minutes of clear answers:

- What the software does, in one sentence, without the word "platform."
- What is technically hard about it — the multi-attester reconciliation problem, not the CRUD.
- Who is on the team, and what is incorporated.
- What we are trying to reach: a read-only demo derives funded-outcome verdicts today; the pilot adds writes, sign-in, and a provider actually collecting documents. Naming that gap precisely is more useful to an advisor than either fact on its own, because it shows we know which half is unbuilt.

**Keep this separate from what can be shown, and do not let the two narratives borrow each other's language.** The milestone demo exists and demonstrates delivery capability, but it is routine engineering and [our own SR&ED log](sred-log.md) says so in writing. IRAP's test is technology development and commercialization potential, not CRA's technological uncertainty — so work that is unclaimable for SR&ED is still a perfectly good signal to an IRAP advisor. Show the demo here; do not put it on a T661.

NRC also names the documents it will want: CRA business number, business plan, recent financial statements, ownership structure, and résumés or profiles for the management and technical team. The team profiles are the item most likely to be missing, and the one that most directly answers the "is this a real company" question.

**What to ask for, in order.** The advisory relationship first, funding second. Asking for money on call one marks us as a grant-chaser.

1. An assessment of whether the technical work is the kind IRAP supports.
2. Introductions: which providers, which regional bodies, which other programs.
3. An honest read on whether we are too early, and what would make us not too early.
4. Only then, what funding streams exist and what the sequence looks like.

**A specific question worth asking.** Our revenue thesis depends on public-sector buyers who cannot easily be sold to as a startup. Ask the advisor directly whether they have seen that model work in Ontario, and who did it. That is the question an advisor can answer and a search engine cannot.

## Action 2 — register on Transfer Payment Ontario

**Why now.** Several Ontario programs route exclusively through TPON. The registration itself completes in-session, but **system access is a separate request that takes up to five business days** — and one ministry program guide advises allowing two weeks for the whole enrolment, so plan against the longer figure. Being unregistered when a narrow call opens is an entirely avoidable loss, and it is the kind of loss that is invisible until it happens.

Search the registry before registering. If Trampoline already appears, join the existing profile rather than creating a duplicate.

**Specifically relevant to us:** the Skills Development Fund Training Stream routes exclusively through TPON, **and a for-profit software vendor is not an eligible lead applicant** — eligibility runs to employers, non-profits, associations, unions, municipalities, and hospitals, with colleges only as co-applicants. Round 6 closed 2025-10-01 and no Round 7 has been announced. So the sequence when it reopens is *be registered* and *have a lead applicant lined up*, and the second of those is now a confirmed requirement rather than a preference. Neither can be done inside a short application window.

**Prerequisites.** Registration needs company identifiers that only exist after incorporation, so this action is gated on the corporate form being in place. If incorporation has not happened, that is the actual first step, and it is also the prerequisite for SR&ED.

See [`verified-facts.md`](verified-facts.md) for the exact registration steps, required identifiers, and expected validation time.

## Sequencing against everything else

| Order | Action | Blocked by |
| --- | --- | --- |
| 0 | Commit the working tree, docs separately from code | Nothing. Costs one minute. Until it is done, the SR&ED log's dated entries and the pre-existing-IP boundary in [`wsib-collaborator.md`](wsib-collaborator.md) are both unevidenced. |
| 1 | Incorporate (Ontario CCPC) | Nothing. Gates SR&ED, TPON, and IRAP. |
| 2 | Open the [SR&ED log](sred-log.md) | Nothing — already written, before incorporation, deliberately. But only evidenced once committed; see row 0. |
| 3 | Call for an IRAP advisor | Incorporation, for the business number and financials |
| 4 | Register on TPON | Incorporation |
| 5 | [SR&ED pre-claim approval](verified-facts.md) request | Incorporation. ~10 weeks to a 3-year answer. |
| 6 | [WSIB status enquiry](wsib-collaborator.md) | Nothing. One email, and it may reveal there is no competition. |
| 7 | [Retention interviews](../outreach/retention-interviews.md) | Nothing. The most informative thing on this list. |
| 8 | [Researcher approach](wsib-collaborator.md) | Nothing, and explicitly *not* blocked on WSIB's calendar. |
| 9 | [Sector council approach](swif-partner.md) | Interviews, and board endorsement |

The one addition worth calling out is row 5. **SR&ED pre-claim approval did not exist when this plan was written** — it opened 2026-04-01 — and it converts the largest open question in [`sred-log.md`](sred-log.md) from a year of hopeful documentation into a written CRA determination in roughly ten weeks, valid for three years. It is the highest-value procedural item in this file.

The ordering principle: anything with no gatekeeper and a long lead time goes first, because its only cost is the calendar. Anything requiring us to be credible goes after the work that makes us credible.

## Note on the corporate form

Staying a for-profit CCPC is a deliberate trade, not a default. It costs us access to Ontario Trillium Foundation entirely, bars us from leading a WSIB project, and excludes us from Skills Advance Ontario's service-provider stream. It buys SR&ED, which is the only money on the list that no committee can decline.

The resolution is that partners hold the grants and we hold the tax credit. If that turns out not to work — if no nonprofit will hold a grant with a for-profit vendor line — the corporate form is the thing to revisit, and it should be revisited early rather than after a year of declines.

## Related

- [`sred-log.md`](sred-log.md) — contemporaneous documentation, already open
- [`verified-facts.md`](verified-facts.md) — current figures and procedures with sources
- [`../execution-strategy.md`](../execution-strategy.md) — capital section
