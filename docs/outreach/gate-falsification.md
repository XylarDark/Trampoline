# The gate falsification test

**Status:** ready to run. Not yet run.

**What this decides.** Whether any platform will consume an externally-issued credential from us at all. Weeks 4-8, but bring it forward if the retention interviews stall.

## Why this test exists

Our whole record is worthless if no gatekeeper reads it. Two precedents say that is the likely failure mode, not a hypothetical one:

- **UK Fit for Work** was discontinued after referrers did not refer and employers found the recommendations unusable.
- **The Learning and Employment Record category stalled** because employers will not visit a separate site outside their applicant tracking system.

Both failed on the consumption side while having a perfectly good supply side. So before recruiting a single attestor, find out whether anyone will read the output.

## Why these targets specifically

Salus by Staffy and BookJane already enforce hard credential gates in Canadian care settings: they refuse shift assignment when a credential is missing or expired. That makes them the fairest possible test subject, and it is what makes this a real experiment rather than a survey.

They have already:

- built the concept of a credential with an expiry date,
- accepted that expiry should block work,
- and paid the product cost of enforcing it.

Every objection about the *idea* is pre-answered. If they still will not accept one more externally-issued credential type, the objection is to external issuance itself — and that is a problem no amount of product work fixes. That is the finding we want, cheap and early.

## The hypothesis, stated so it can fail

**H:** A platform that already refuses work on credential expiry will accept an additional credential type issued and verified by a third party, provided verification is programmatic and liability is clear.

**Falsified if:** two or more such platforms decline in principle, for reasons unrelated to our maturity — for example "we only accept credentials we verify ourselves," "our clients require single-source verification," or "the liability of relying on an outside attestation is unacceptable."

**Not falsified by:** "not now," "come back with customers," or "we'd need SOC 2." Those are stage objections, and stage objections are normal. Record them, but do not read them as the answer.

The distinction matters, because it is the one most likely to be blurred in our own favour when the calls go badly.

## The ask

Deliberately small. We are buying information, not a partnership.

> You already block a shift when a certification lapses. We hold a different kind of credential — a functional or skills attestation issued by an assessor, with an expiry date and any restrictions attached. Would your platform ever consume a credential type it did not issue or verify itself? And if not, what is the blocker: verification, liability, or client requirements?

Twenty minutes. No demo, no deck. Ask which of the three blockers it is, and take the answer.

## Outreach sequence

1. Partnerships or integrations contact if one is published; otherwise the general enquiry route.
2. If nothing comes back in ten days, approach a product lead directly on LinkedIn with the same three-sentence ask.
3. Run both targets in parallel. One decline is an anecdote; two is a finding.
4. Then repeat with any additional Canadian platform enforcing credential-expiry refusal, to get to three or four data points before drawing a conclusion.

See [`contacts.md`](contacts.md) for verified contact routes.

## Email draft

Short on purpose. A long email from an unknown company reads as a pitch and gets filed.

> **Subject:** Question about credential sources in your compliance gating
>
> Hello —
>
> Your platform blocks a shift assignment when a worker's certification has lapsed. I am building a record of a different credential type — functional and skills attestations issued by external assessors, each with an expiry date and any restrictions attached — for people moving between health services and employment services in Ontario.
>
> I am trying to find out whether the credential-gating model can accept an outside issuer at all, and I would rather learn that from someone who has already built it than guess.
>
> Would you have twenty minutes? One question: would your platform ever consume a credential it did not issue or verify itself, and if not, is the blocker verification, liability, or what your clients require?
>
> No pitch, and nothing to sell you at this stage.
>
> — [name], Trampoline

## Tracker

| Platform | Contact route | Contacted | Response | Blocker named | Reading |
| --- | --- | --- | --- | --- | --- |
| Salus by Staffy | | | | | |
| BookJane | | | | | |
| | | | | | |
| | | | | | |

## If the thesis is falsified

Do not quietly reinterpret the result. The honest response is that Trampoline is not a portable credential and should stop describing itself as one. What would remain:

- **The outcome-evidence wedge**, which does not require any gatekeeper to read a credential. It only requires a provider to want its own reporting automated.
- **Accommodation specification**, which is consumed by a person and an employer in a conversation, not by a platform through an API.

Both survive without portability. That is worth knowing before building the attestor network, which is the whole point of running this in week 4 rather than year 2.

## Related

- [`retention-interviews.md`](retention-interviews.md) — the other cheap kill test
- [`../research/competitive-landscape.md`](../research/competitive-landscape.md) — the Fit for Work and Learning and Employment Record precedents
