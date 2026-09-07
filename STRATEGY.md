---
name: Trampoline
last_updated: 2026-09-07
---

# Trampoline Strategy

Working name. Trampoline is routing and outcome-evidence infrastructure for people rebuilding health and income at the same time. We are not a service provider, and we are not a readiness certifier.

## Target problem

People who have to turn around their health and their income at the same time get split across apps: wellness tools assume income is stable, career tools treat health as a sidebar. So the person carries the coordination themselves, and the organizations around them carry a reporting burden nobody funds.

Two specific failures, both evidenced in [`docs/research/`](docs/research/):

- **The retention cliff.** In a former Ontario prototype catchment, employment at 20-plus hours fell from 86% at program exit to 62% at twelve months. Providers prove those milestones by hand; one told government evaluators they had converted a whole department into a "retention department" that "strictly captures proof of employment," and said it detracts from client service.
- **The unmet accommodation.** 35.4% of employed Canadians with disabilities have an accommodation need that is not met. Clinician-to-workplace contact and accommodation offers are among the very few interventions with *strong* evidence for shortening work disability, and almost nothing operationalizes them.

## Our approach

We hold one durable record of what a person has demonstrated, and we use it to route: to the support a check implies, to a program that fits, to an employer with the accommodation already specified. Established services perform the checks and we store their attestations. What we own is the connective tissue — the record, the routing, the handoffs, and the evidence trail.

The decisive change from our first design: **a check that lapses or comes back restricted triggers support; it never withholds access to work.** That is not a softening. It is what the evidence says. Roughly 28 randomized trials and two Cochrane reviews favour rapid placement over pre-employment preparation — 34% versus 12% employed at 18 months — and prevocational training did not beat standard community care. A gate that makes someone finish getting well before they may work makes the outcome worse.

It is also what the law says. Ontario treats pre-offer medical inquiry as presumptively unlawful under Human Rights Code s. 23(2), consent is not a defence (*Etobicoke*), and *Davis v. Toronto* found discrimination on perceived disability where the person had no actual functional limitation. Our highest-risk feature and our least-evidenced feature were the same feature.

## Who it's for

**Primary:** the person rebuilding both at once. They are hiring Trampoline to stop re-explaining their situation to every new organization, and to get the adjustment they need written into the job rather than discovered after they start.

**Secondary:** the provider and the funder. A provider is hiring Trampoline to stop proving 13 cumulative weeks of employment by hand. A funder is hiring it to see referrals, placements, and retention as they happen instead of in a year-end survey their own evaluators flagged for selection bias.

## Key metrics

- **Milestones evidenced without manual chasing** — 6- and 13-week and retention milestones captured as a by-product of the record. This is the wedge, so it is the first metric.
- **Supported referrals accepted, in and out** — Employment Ontario's Service Coordination measure counts exactly this, in both directions. We are a referral router, which makes it the tightest product-to-funded-metric fit available to us.
- **Accommodations specified and provided** — restrictions that became a written workplace adjustment rather than a quiet rejection.
- **Retention at 12 months** — the number that collapsed from 86% to 62%. If we do not move it, we have built reporting software.
- **Zero health-derived hiring blocks** — an audit metric, expected to stay at zero permanently.

## Tracks

### Outcome evidence

Referrals with acceptance, placements, employment spells with hours and wage, milestones, follow-ups at the months funders report on, and satisfaction from both the client and the employer.

_Why it serves the approach:_ it is the only part with a named payer today. No Ontario funder pays for readiness certification; they pay for placements, retention milestones, and referrals.

### Accommodation routing

The restriction model rendered in the shape of a WSIB Functional Abilities Form, released after a conditional offer, with a request path attached.

_Why it serves the approach:_ it converts our restriction data into one of the few interventions with a strong evidence base, and it is administrative and legal value to an employer rather than persuasion.

### Cross-container persistence

The record itself, and the fact that it survives leaving any single organization.

_Why it serves the approach:_ every existing readiness record needs a container the person is already inside. Cority needs an employer, the Functional Abilities Form needs an open claim, TELUS Health needs a benefits plan, Avetta needs a contractor engagement, MyCreds needs an institution, CaMS needs an open action plan. Our population has no container. That is the genuine unserved gap, and it is a trust and coordination problem more than an engineering one.

## Not working on

- **Any health-derived gate on the hiring path, in any form.** Permanent.
- A mental health signal on any employer-visible surface, including by inference through a composite score.
- Our own clinic, gym network, class schedule, calorie tracker, EMR, LMS content, or resume rewriter.
- Our own verifiable-credential issuance layer, education credential store, or background check service. Credivera, MyCreds, and Certn exist; integrating is the thinner connector.
- Scraped mass job inventory to compete with Indeed, or a destination site employers must visit outside their applicant tracking system. The Learning and Employment Record category stalled on exactly that.
- Any chatbot that issues medical or mental-health clearance.
- Consumer subscription as the primary business model.

## Marketing

**One-liner:** One record that follows you between services, so the next organization starts where the last one left off.

**Key message:** Partners perform the checks; the record carries the proof, the accommodation, and the evidence a funder needs. Nothing about your health decides whether you can work.

## Honest risks

- **The wedge may be the whole product.** If automated retention proof is what people will pay for, the passport is a feature of a reporting tool rather than the reverse. The validation interviews are allowed to reach that conclusion.
- **Better information may not change employer behaviour.** A verified quality signal raised callbacks 10 points for everyone and left the 25-point disability gap intact; a wage-subsidy offer moved nothing. Our employer value has to be administrative and legal, not persuasive.
- **The benefits cliff may dominate.** ODSP claws back 75 cents per dollar above $1,000 per month and drives documented deliberate underworking, which collides with the 20-hour funding threshold. No record fixes that, and we should say so.
- **Two questions need a lawyer, not more research:** our status under PHIPA, and whether any employer-facing health disclosure survives Code s. 23(2) even post-offer.
