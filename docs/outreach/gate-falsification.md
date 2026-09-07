# The gate falsification test

**Status:** ready to run. Not yet run.

**What this decides.** Whether any platform will consume an externally-issued credential from us at all. Weeks 4-8, but bring it forward if the retention interviews stall.

## Why this test exists

Our whole record is worthless if no gatekeeper reads it. Two precedents say that is the likely failure mode, not a hypothetical one:

- **UK Fit for Work** was discontinued after referrers did not refer and employers found the recommendations unusable.
- **The Learning and Employment Record category stalled** because employers will not visit a separate site outside their applicant tracking system.

Both failed on the consumption side while having a perfectly good supply side. So before recruiting a single attestor, find out whether anyone will read the output.

## Correction: the plan named the wrong targets

Verification changed this test substantially. Read this section before running it.

**BookJane does not appear to hard-gate at all.** Its documented behaviour is credential *expiry alerting* ("Credential expiry — 2 staff — 14 days remaining") and qualification-based *matching*, not refusal. The only hard language is contractual rather than product-enforced: workers warrant that they maintain valid credentials, the obligation to keep documentation sits with the agency partner, and blocking a worker is described as a manual admin action. Running the test here would have produced a **false negative** — a platform declining because it does not gate, misread as a platform declining to accept external credentials.

BookJane also has an ownership problem. It filed a Notice of Intention under the *Bankruptcy and Insolvency Act* in April 2025 after a sale process drew no acceptable third-party bids, and in June 2025 the Ontario Superior Court approved the sale of substantially all assets to its senior secured lender. The order directed the company to change its name to exclude the BookJane brand, and **no successor entity has been publicly disclosed**. The brand continues to operate and announce partnerships, but confirm which legal entity you would be contracting with before signing anything.

**Salus by Staffy does claim refusal, in almost our own words:** the platform "refuses to let an expired document reach a shift assignment," and "If anything required for that shift expires before the shift ends, the assignment should not complete. Not a warning, not a flag. A refusal." Two caveats: the strongest claims are marketing copy rather than product documentation, and the sibling product that states enforcement most concretely is **explicitly in beta** — so the enforcement being tested may not be generally available.

**Do not blur three unrelated companies.** Salus by Staffy (Toronto, healthcare credentials, Staffy Health Inc.), SALUS Safety (Vancouver, construction safety, Salus Technologies Inc.), and Staffy's own "Salus Workforce Management" beta are different things in different provinces and sectors.

## The right primary target: SALUS Safety

Construction and skilled trades, Vancouver, founded 2018, ~39 employees, roughly $10.8M raised. It satisfies **both** halves of the test, which neither originally-named target does.

**It refuses, and says so in product documentation rather than marketing:** rules "block high-risk workflows when a qualification is expired"; "the credential check runs before the workflow opens, and the expired ticket is flagged before work starts"; expired certificates surface "at dispatch, at the gate, or at the moment the task is supposed to start," with a refresher offered "at the block screen."

**And it already exposes a public mechanism for admitting a new external credential issuer.** The developer API can "track, create, upload, and download credentials, providers, and certificate types," and the reference documents `POST /v1/certificate/provider/` — "Create a new certificate provider to assign to company certificates." Authentication is OAuth, requiring a company-owner-level account. There is an open partner program that explicitly courts integrations, an existing safety-association partner, and a deep integration with a major construction platform.

**Most striking: their public copy already argues our thesis.** "The worker profile travels with the person… **the record belongs to the worker**." "Certificates, training, and documents travel with the worker, site to site."

That cuts both ways, and the honest reading is uncomfortable: strong validation of the portability thesis, and a **build-versus-partner conflict**. They may be a partner, or they may be the company that has already built the portable-record layer for a sector with more money in it than ours. Go in wanting to know which.

Contact: `connect@salussafety.io`, (833) 937-3007. Founder and CEO **Gabe Guetta**. No named partnerships lead is published.

## What the test has already partly answered

A platform that hard-gates on expiry **already publishes an endpoint whose entire purpose is registering new external certificate issuers.** So the structural objection — "credential gating cannot admit an outside issuer" — is falsified before the first call.

What remains open is the commercial question the docs cannot answer: whether anyone would treat a *Trampoline-issued* functional attestation as a first-class credential type. That is a narrower and more answerable question than the one the plan set out to ask, and it should be asked directly.

## Secondary targets

**WorkSitePass** — construction, worker-held credential wallet, certificates "verified against the issuing authority, not taken on faith," expiry alerts at 90/30/7 days, and explicit portability: "certifications live in a wallet on the worker's phone — they keep them across employers." Gating strength is readiness visibility rather than documented automatic refusal, so it is a weaker test case. Note a jurisdictional oddity: a third-party profile says Ottawa, founded 2025, while its own privacy policy says it is incorporated under the laws of Quebec. `support@worksitepass.ca`.

**Labourly** — skilled trades and industrial staffing, London Ontario, a product of Resonant Solutions. Gates at *shortlist* rather than shift: candidates "must upload proof of necessary certifications in order to be shortlisted," drawn from a database of ~1,600 trade licences, with 90-day renewal notices. Most useful precedent for us: it **partnered with Certn**, a third-party background-check provider, in 2023 — an existing example of admitting an outside verification source. `info@labourly.ca`.

Deliberately excluded: Procore and Deputy are not Canadian, and Deputy's own copy concedes it surfaces "a warning during schedule creation," not a refusal.

## The hypothesis, stated so it can fail

**H:** A platform that already refuses work on credential expiry will accept an additional credential type issued and verified by a third party, provided verification is programmatic and liability is clear.

**Falsified if:** two or more such platforms decline in principle, for reasons unrelated to our maturity — for example "we only accept credentials we verify ourselves," "our clients require single-source verification," or "the liability of relying on an outside attestation is unacceptable."

**Not falsified by:** "not now," "come back with customers," or "we'd need SOC 2." Those are stage objections, and stage objections are normal. Record them, but do not read them as the answer.

The distinction matters, because it is the one most likely to be blurred in our own favour when the calls go badly.

## The ask

Deliberately small. We are buying information, not a partnership.

> You already block a shift when a certification lapses. We hold a different kind of credential — a functional or skills attestation issued by an assessor, with an expiry date and any restrictions attached. Would your platform ever consume a credential type it did not issue or verify itself? And if not, what is the blocker: verification, liability, or client requirements?

Twenty minutes. No demo, no deck. Ask which of the three blockers it is, and take the answer.

**The provider milestone demo is not relevant here and must not enter these calls.** It answers a provider's reporting question; this call is about whether a gatekeeper platform will consume a credential it did not issue. Bringing it in would answer a question nobody asked and turn an information-buying call into a pitch.

**With SALUS Safety, ask a sharper version,** because their API already answers the structural question:

> Your API has an endpoint for creating a certificate provider. What does an organization have to be, or prove, before you would let it register as one — and has anyone outside a recognized safety association ever done it?

That converts a yes/no into a requirements list, which is far more useful. And ask the build-versus-partner question outright: given that their own copy says the record belongs to the worker, do they intend to extend the portable record beyond construction safety tickets?

## Outreach sequence

1. Partnerships or integrations contact if one is published; otherwise the general enquiry route.
2. If nothing comes back in ten days, approach a product lead directly on LinkedIn with the same three-sentence ask.
3. **Run SALUS Safety and Salus by Staffy in parallel** — different sectors, both claiming refusal. One decline is an anecdote; two is a finding.
4. Add Labourly third, since its Certn partnership makes it the most likely yes and therefore the best check on a run of noes.
5. Skip BookJane until a successor entity is identifiable. It does not gate, so it cannot falsify anything.

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

| Platform | Gates? | Contact route | Contacted | Response | Blocker named | Reading |
| --- | --- | --- | --- | --- | --- | --- |
| SALUS Safety | Yes, documented | connect@salussafety.io | | | | |
| Salus by Staffy | Claimed, beta | site enquiry | | | | |
| Labourly | At shortlist | info@labourly.ca | | | | |
| WorkSitePass | Visibility only | support@worksitepass.ca | | | | |
| BookJane | **No** — skip | n/a, entity unclear | n/a | n/a | n/a | Would give a false negative |

## If the thesis is falsified

Do not quietly reinterpret the result. The honest response is that Trampoline is not a portable credential and should stop describing itself as one. What would remain:

- **The outcome-evidence wedge**, which does not require any gatekeeper to read a credential. It only requires a provider to want its own reporting automated. **This is now the built proposition rather than the theoretical fallback:** a derivation engine, three provider screens, and a printable funder submission exist and run. So falsifying portability costs considerably less than this section assumed when it was written — there is something to fall back to, not just a plan to fall back to.
- **Accommodation specification**, which is consumed by a person and an employer in a conversation, not by a platform through an API.

Both survive without portability. That is worth knowing before building the attestor network, which is the whole point of running this in week 4 rather than year 2.

## Related

- [`retention-interviews.md`](retention-interviews.md) — the other cheap kill test
- [`../research/competitive-landscape.md`](../research/competitive-landscape.md) — the Fit for Work and Learning and Employment Record precedents
