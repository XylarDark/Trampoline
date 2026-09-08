# Retention-cliff validation interviews

**Status:** ready to run. Not yet run — these are four phone calls that only the founder can make.

**What this decides.** Whether proposition 1, outcome-evidence infrastructure, has a real buyer. It is the wedge, so if it fails here the rest of the plan changes shape. Four calls, weeks 1-3.

**The prior being tested.** An Ontario provider told government evaluators they had "transformed an entire department to a 'retention department' that strictly captures proof of employment," and that it detracts from client service. If that is representative, providers are already paying for this problem in staff time. If it was one unusual organization, we are solving a problem nobody has.

## Two corrections to make before dialling

Both would have made the first call go badly. Detail and sources in [`ontario-outcome-framework.md`](ontario-outcome-framework.md) and [`contacts.md`](contacts.md).

**The milestones are not 13 weeks.** That is the legacy ODSP Employment Supports framework, now scoped to First Nations sites. The live Integrated Employment Services measure is an average of **20-plus hours per week, checked at 1, 3, 6, and 12 months after job start**. Asking a provider how they prove 13 cumulative weeks would signal that we had read the wrong document.

**These four are in WCG's network, not Fedcap's.** The Fedcap Hamilton-Niagara consortium listing that names all four is a February 2020 bid-stage announcement; all four are today WCG/EOWorks providers in the Toronto catchment. Do not open with the Fedcap connection.

That second correction raises a real strategy question: if the beachhead is Hamilton-Niagara, the four best-known names are not in it. Options are to interview these four anyway as Toronto-catchment providers with the same problem, or to switch to Fedcap's current network — where **AGILEC and March of Dimes** sit on both the provider list and the WSIB assessment roster, making them attestor supply and interview target at once. Recommend doing both, starting with these four because their contact routes are verified.

## The one question

> How do you currently prove employment at the 1, 3, 6, and 12-month checkpoints, and what does it cost you?

Everything else is follow-up. Ask it early, then stop talking.

## Why they should take the call

Do not lead with the product. Lead with their number.

Hamilton-Niagara's prototype data is public: employment at 20-plus hours fell from 86% at exit to 62% at twelve months. Opening with the buyer's own published outcome is more credible than any pitch, and it signals we did the reading.

**For Community Living Toronto, use their own evaluation instead.** They published the MyJobMatch final evaluation, whose stated goal was to minimize administrative burden and which found that 23 of 48 staff responses indicated the change *added* to it. An organization that has already tried this and published a negative result is the most valuable call on the list — they know the failure modes and have no reason to be polite about them. Open by asking what they learned.

## Interview guide

Twenty-five minutes for sections 0 through 4, and **do not show the demo during them.** The goal is to find out whether we are wrong, and a milestone table shown early gets described back to us in our own vocabulary — we would hear our own framework repeated and mistake it for agreement.

**Sections 0 through 4 are the call. Section 5 happens only if they want to see it.** It is offered once, after the falsifying question has been asked and answered, and it runs only on a clear yes. A call that ends at section 4 has collected everything we came for.

**0. Which regime (2 min).** Ask first, because the rest of the guide depends on the answer.

- Is your contract under Integrated Employment Services, legacy Employment Service, or ODSP Employment Supports? Any mix?
- Is ESMS-SPM still live for you, or only CaMS?

**1. Current state (10 min).** Let them describe the process before offering any framing.

- Walk me through what happens from the day a client starts a job to the day the 6-month checkpoint is confirmed.
- Who does that work? Is it the case worker, an admin, or a dedicated role?
- When a document comes back missing a field — no wage on it, or no period covered — how often does the funder reject it, and who fixes it? Ask this rather than which document types are acceptable: we already know the acceptable list and it is encoded, so asking wastes the ten minutes. The five-field conformance test is the part no software can check.
- How often do you end up needing a provider attestation, and how long does the SSM pre-approval actually take? Has one ever been refused?
- What happens when a client stops answering the phone at month four?
- Where does it actually live: CaMS, ESCases, a spreadsheet, your own case management, or all of them?

**2. Cost (5 min).** Get to a number, even a rough one.

- Roughly how many hours a month go into this across the organization?
- Has it changed how you staff? Has anyone been hired or reassigned for it?
- What does it cost you when you cannot substantiate an outcome you know happened? **Get their number before showing them ours.** This is the exact quantity the caseload screen puts in its headline card, so their unprompted figure is the single most valuable sentence in the call, and it is uncontaminated only if asked first. Ask what they call it internally.

**3. Constraints (5 min).** This is where the idea most likely dies, so ask properly.

- Would your funder accept a milestone evidenced through a third-party system? ESCases already links to CaMS by client reference number, so the precedent exists — has that changed what is possible? If section 5 happens, put the printed evidence pack in their hands and turn this into a document review rather than a hypothetical: would your SSM accept *this piece of paper* as the submission, or must the milestone originate in CaMS?
- Who would have to approve introducing something like that — you, your SSM, or the ministry?
- Is client consent for follow-up contact something you already collect, and does it travel if the client leaves your program?

One quote to keep in mind here: a provider told researchers that "the absolute intrusion of privacy is forcing us to get proof of employment from our clients. We've lost clients over that." If the conversation reaches that, say plainly that our access log and per-recipient consent exist for exactly this reason — and be accurate about scope, because those controls currently sit on the person-facing views only. Nothing on the three provider screens surfaces a consent record or writes to the access log, and whether generating an evidence pack should be logged is an open decision. Do not describe it as solved.

**4. The falsifying question (5 min).** Ask it plainly and take the answer at face value.

- If a tool populated all of this from the record you already keep, would you pay for it, or is this just part of the job? Say unprompted that nothing writes yet and there is no sign-in — "captured as a by-product" is what we are aiming at, not what exists, and overstating it here poisons the answer we came for.
- What would you rather we build instead?

**5. Recognition test (10 min, only on their yes, and only after section 4).** Offer it once, in these terms: "I have a screen built from the directives. Ten minutes, and what I want is for you to tell me where it's wrong." Then take the first answer they give.

**Anything short of a clear yes is a no.** Hesitation, running out of time, "another time", or "send it over and I'll look" all end section 5. Thank them and close. Do not ask a second time, do not talk them into it, and do not send screenshots, a recording, or a link afterwards as a substitute — an unaccompanied screen invites exactly the misreadings the live walk-through exists to prevent, and we would learn nothing from it. Their interest is the only thing that makes this section worth running: a provider watching out of politeness produces agreement, and agreement is what we are trying not to collect.

If they say yes, navigate straight to the provider caseload. Do not show the home page — it links to the passport, levels, and health-check surfaces this call is deliberately staying away from. Say at the outset that these are twelve synthetic people, that nothing writes, and that it is running on this laptop.

**Getting it on screen** is one command: `npm run demo` from the repo root starts the database and the app and opens the provider caseload directly, which is also how it avoids passing through the home page. Run it before dialling, since a cold start takes about a minute. `npm run demo:stop` shuts it down afterwards.

**Whoever is reading the screen aloud should have [`demo-screen-briefing.md`](demo-screen-briefing.md) open beside this section.** It explains what every number and badge on the screen means, which client shows which verdict, and what to say to the questions the demo reliably provokes — written for someone who did not build it. The asks below stay here; the reading of the answers is there.

| Ask | The client it hangs on |
| --- | --- |
| Read the Month 3 column aloud. Which of these verdicts do you recognise, and which make no sense? | the whole cohort — ten of the eleven verdicts are seeded |
| This client stopped answering at month four. Three attempts are recorded and month 6 is lost. Does that effort have anywhere to go in CaMS today, or does it just vanish? | Farah Nasser |
| She worked 30 hours all year and the only thing on file is her own word. How common is that, and what do you do about it? | Bassam Rahal |
| 34 hours a week and a pay stub that exists but nobody has collected. Is this your largest bucket? | Kwame Asante |
| 19.5 hours. Has the funder ever accepted a rounding? | Devon Pritchard |
| Has anyone here ever chased a pay stub for a placement that could never have paid? | Corinne Dubé, subsidized |
| Her base wage is under minimum because she is mostly on tips. Does the funder reject that automatically, or does a person look at it? | Lucia Ferraro |
| The employer refused a letter three times, so this ran to a caseworker attestation with an SSM pre-approval reference. How long did yours take? | Grigor Vasilev |
| Month 3 falls in a gap between two jobs, so we score it lost. Would your SSM agree, or does the earlier work still count? | Elif Kaya — this tests our one unsourced assumption directly |
| Would your SSM accept this printed pack as the submission, or must the milestone originate in CaMS? | any client, printed |

The Elif Kaya question is the most valuable one on the page. No public directive defines how cumulative hours aggregate across non-consecutive weeks; we guessed, and the guess is visible on screen as an assumption. One provider contradicting it is worth more than any amount of further reading.

## What counts as validation, and what counts as a kill

Decide this before making the calls, so the interpretation is not retrofitted to whatever we hear.

| Signal | Reading |
| --- | --- |
| Three or four describe a named person or role whose job is substantially retention proof | **Strong validation.** Build the wedge. |
| They quantify hours or cost without being pushed for a number | **Strong validation.** There is a budget line to displace. |
| Two or more say the milestone must originate in the ministry's system of record and cannot come from elsewhere | **Serious constraint,** though the ESCases precedent suggests it is surmountable through SSM procurement. We are a feeder into CaMS, not a system of record. Rework the integration story before building. |
| "It's a nuisance but our case management handles it" from three or more | **Kill the wedge.** Proposition 1 is not the way in. Re-run this exercise against accommodation specification instead. |
| Enthusiasm with no hours, no cost, and no named owner | **Treat as a no.** Interest is not a budget. |
| Shown the milestone table, two or more say a verdict is wrong in a way we cannot fix | **Framework error, and more urgent than the demand question.** It invalidates the product rather than the market. Stop and re-derive before building anything further. |
| They answer the aggregation question and contradict our assumption | **A direct hit on the one rule we could not source.** Change the constant, and one demo client's month-3 verdict flips. This is a success, not a setback — it is the cheapest correction available. |
| They recognise the screen immediately: "that's our spreadsheet" | **Strong validation.** Recognition cannot be manufactured to be polite the way enthusiasm can. |

The third and fourth rows are live possibilities, not defensive hedging. The plan says the interviews should be allowed to conclude that the wedge is the whole product — or that it is not a product at all.

## What not to do on these calls

- Do not describe levels, or a passport, or a readiness score. It invites the gating conversation we have deliberately left behind, and it is not what this call is about. If section 5 happens, this is a navigation instruction as well as a talking-point one: go straight to the provider caseload, because the home page links to the track and share views that render exactly these things.
- Do not show the demo to anyone who has not asked to see it. It is offered once in section 5 and shown only on a clear yes, never as a way to fill silence, rescue a flat call, or answer a question they did not ask.
- Do not let the demo imply more than exists. Read-only, no sign-in, a local database, and twelve synthetic people — say it before they ask, not after.
- Do not promise integration with CaMS or any ministry system. We do not know yet whether that is permitted.
- Do not ask them to be a design partner on call one. Ask for the facts; earn the second call.
- Do not mention health checks at all unless they raise accommodation first.

## Targets

All four are Integrated Employment Services providers in WCG's Toronto catchment. Verified contact routes in [`contacts.md`](contacts.md) — re-check every name immediately before calling.

| Organization | Why them |
| --- | --- |
| Community Living Toronto | **Call first.** They published an evaluation of their own attempt to reduce this exact burden, and found it got worse. Best-informed and least likely to be polite. Contact: Jonathan Bradshaw, Director of Advocacy & Strategic Partnerships. |
| Corbrook | Long-standing supported-employment provider with deep experience of the population and of funder reporting. Route through the CEO, per their own site. |
| Springboard | Employment services for a justice-involved and barriered population — closest to our user. Note the 2014 rebrand from "Operation Springboard". |
| CCRW | National scope and a policy voice. Useful as a validator, and later as a possible grant-holding partner for the WSIB or Trillium routes. Expect a policy-framed conversation rather than an operational one. |

Consider adding **AGILEC** and **March of Dimes** as a fifth and sixth call. Both are in Fedcap's current Hamilton-Niagara network *and* on the WSIB assessment roster, so they are simultaneously a provider interview and the attestor-supply conversation.

## Tracker

Fill in as calls happen. Keep the verbatim answer to the one question — the exact words are more useful later than a summary.

| Org | Contact | Date | Regime (IES/legacy/ODSP) | Who owns outcome proof | Hours/month | Third-party evidence acceptable? | Would they pay? | Their name for "earned, not provable" | Verdict they said we got wrong | Would they submit the printed pack? | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Community Living Toronto | | | | | | | | | | | |
| Corbrook | | | | | | | | | | | |
| Springboard | | | | | | | | | | | |
| CCRW | | | | | | | | | | | |

## After the calls

Write the conclusion into [`../execution-strategy.md`](../execution-strategy.md) section 5 — including if the conclusion is that the MVP order was wrong. Then decide whether to keep building the outcome tables or to pivot the wedge to accommodation specification.

## Related

- [`ontario-outcome-framework.md`](ontario-outcome-framework.md) — **read before the first call.** What the funder measures and how it must be evidenced
- [`demo-screen-briefing.md`](demo-screen-briefing.md) — **read before section 5.** What is on the caseload screen and what each part provokes
- [`contacts.md`](contacts.md) — verified contact routes
- [`gate-falsification.md`](gate-falsification.md) — the other early test that can kill a thesis cheaply
- [`../research/evidence-and-economics.md`](../research/evidence-and-economics.md) — the retention-cliff and buyer-economics evidence
