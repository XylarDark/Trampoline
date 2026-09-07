# Trampoline — Legal, Privacy, and Human-Rights Constraints (Ontario, Canada)

> **Compiled 2026-09-07 by web research. This is not legal advice.**
>
> This document was assembled from publicly available statutes, regulator policy, and secondary commentary located via web search on 2026-09-07. It is a research memo intended to shape product design decisions. It is **not legal advice**, it is not a substitute for a retained lawyer, and it must not be relied on as the basis for shipping a feature that touches real health-derived data.
>
> **Two questions in this memo are existential to the product and require a written opinion from an Ontario privacy and employment lawyer before any real person's real health-derived data is stored:**
>
> 1. **PHIPA status** — whether Trampoline's specific data flow makes it a "recipient" under PHIPA s. 49, and whether it risks becoming a "health information network provider" under O. Reg. 329/04 s. 6.
> 2. **Human Rights Code s. 23(2)** — whether *any* employer-facing gate involving health-derived data survives the prohibition on pre-employment medical inquiry.
>
> Desk research can frame these questions accurately. It cannot settle them.
>
> **⚠️ Case-text warning.** Several judicial and tribunal decisions cited below (*Etobicoke*, *Perricone*, *Davis*, *Entrop*, *Gerred*) were read on **minicounsel.ca, a third-party case-reproduction site**, not on CanLII, the official reporters, or the courts' own sites. The quotations and holdings summarized here **must be verified against CanLII or an official source before being cited in any filing, legal submission, investor material, or public statement.** Treat every case quotation in this document as provisional.

---

## Bottom line

Trampoline's *storage* model is defensible. Trampoline's *gating* model is not — at least not on the hiring path.

The design element that creates the most legal exposure is not the database; it is the rule that a lapsed or failed health-derived check pauses or blocks job applications. Ontario human rights law treats pre-offer medical inquiry as presumptively unlawful, treats consent as no defence, and has found discrimination even where the applicant had *no actual functional limitation*.

Everything else on the list is manageable engineering and contract work.

---

## Per-question verdicts

### 1. PHIPA status: custodian, agent, or neither?

**Verdict: Neither — Trampoline is most likely a "recipient" under PHIPA s. 49, with a live risk of accidentally becoming a "health information network provider."**

**Confidence: high on custodian/agent; medium-high on recipient; medium on HINP.**

A "health information custodian" is defined by an enumerated list in [PHIPA s. 3(1)](https://www.ontario.ca/laws/statute/04p03) — health care practitioners, group practices, hospitals, labs, pharmacies, and similar. A software company storing attestations is not on that list. **Trampoline is not a custodian.**

Trampoline is also **not an "agent."** The [statutory definition](https://www.ontario.ca/laws/statute/04p03) requires acting *for the purposes of the custodian, and not the agent's own purposes*, with the custodian's authorization. The [IPC's Guide to PHIPA](https://www.ipc.on.ca/sites/default/files/legacy/Resources/hguide-e.pdf) frames agency the same way. Trampoline stores data for the *individual's* purposes (and its own commercial purposes), not to carry out a clinic's work. Agency does not fit — and you should not want it to, because under [PHIPA Decision 205](https://decisia.lexum.com/ipc-cipvp/phipa/en/521302/1/document.do) the custodian remains accountable for its agent's breaches, which would make clinics unwilling to sign.

What Trampoline probably *is* depends entirely on data flow direction, and **this is the single most consequential architectural decision in the whole product**:

- **If a clinic transmits the attestation to Trampoline**, Trampoline becomes a recipient of personal health information disclosed by a custodian. [PHIPA s. 49(1)](https://www.ontario.ca/laws/statute/04p03) then restricts Trampoline to using or disclosing that information *only* for the purpose for which the custodian was authorized to disclose it, or to carry out a statutory or legal duty; s. 49(2) forbids using or disclosing more than reasonably necessary. The IPC confirmed in [PHIPA Decision 230](https://decisions.ipc.on.ca/ipc-cipvp/phipa/en/521515/1/document.do) that non-custodians who come into possession of PHI from a custodian are bound by s. 49, and noted the stakes under that section "are high." The [IPC Guide](https://www.ipc.on.ca/sites/default/files/legacy/Resources/hguide-e.pdf) names employers and insurers as typical recipients. The [OCSWSSW privacy toolkit](https://www.ocswssw.org/wp-content/uploads/OCSWSSW-PHIPA-Toolkit-ENG_FINAL-3.pdf) summarizes the same rules.
- **If the individual gives their own attestation to Trampoline**, the position is materially better. The [IPC Guide](https://www.ipc.on.ca/sites/default/files/legacy/Resources/hguide-e.pdf) states that none of the recipient restrictions apply to the individual, and that the recipient rules do not prevent use or disclosure for a purpose the individual has consented to.

**Design implication:** make the person the courier. Have the clinic hand the attestation to the patient; have the patient submit it to Trampoline. This is not cosmetic — it changes which statutory regime constrains your product roadmap.

**Two traps worth naming:**

**The HINP trap.** [O. Reg. 329/04 s. 6](https://www.ontario.ca/laws/regulation/r04329) defines a "health information network provider" as a person who provides services to two or more custodians where the services are provided *primarily to enable the custodians to use electronic means to disclose PHI to one another* — expressly "whether or not the person is an agent." If Trampoline evolves into a pipe between clinics, occupational health, and employer-side clinicians, it acquires breach-notification duties, a duty to publish a plain-language description of its services and safeguards, and public transparency obligations. Keep attestation flow strictly person-mediated and one-directional to stay clear of this.

**The consent trap on the clinic's side.** The IPC's [Circle of Care](https://www.ipc.on.ca/sites/default/files/legacy/Resources/circle-of-care.pdf) guidance is explicit that custodians *cannot* rely on implied consent to disclose PHI to a person or organization that is not a custodian, regardless of purpose. Every clinic-side disclosure into Trampoline needs documented express consent. Your partner onboarding must make this the clinic's problem, in writing.

**Lockbox / consent directives.** The [IPC's Lock-box Fact Sheet](https://www.ipc.on.ca/sites/default/files/legacy/Resources/fact-08-e.pdf) explains that PHIPA is consent-based and individuals may withhold or withdraw consent under s. 20(2), and may give express instructions under ss. 37(1)(a), 38(1)(a) and 50(1)(e). The [IPC FAQ](https://www.ipc.on.ca/sites/default/files/legacy/2015/11/phipa-faq.pdf) adds that withdrawal is not retroactive. Lockbox rules bind *custodians*, not Trampoline directly — but Trampoline should mirror the concept: per-attestation, per-recipient revocation, and an honest UI statement that revocation cannot claw back what a viewer already saw.

---

### 2. Is a no-diagnosis pass/fail verdict "personal health information"?

**Verdict: Yes, almost certainly.**

**Confidence: high on the statutory reading; medium on the absence of an on-point IPC decision — I found no IPC guidance addressing the WSIB Functional Abilities Form specifically.**

[PHIPA s. 4(1)](https://www.ontario.ca/laws/statute/04p03) defines PHI as identifying information that "relates to the physical or mental health of the individual" or "relates to the providing of health care to the individual." **There is no diagnosis threshold anywhere in the definition.** A clinician's verdict that a named person is or is not fit for work relates to that person's health and arises from the provision of health care. It is PHI.

Two additional wrinkles from the same section: s. 4(3) sweeps in *non*-health identifying information contained in a record that also contains PHI — so Trampoline's issuer name, timestamps, and expiry fields sitting alongside the verdict are all in scope. And s. 4(4)'s employee-record carve-out applies only to records held by a custodian about its own employees, so it does not help Trampoline.

**The WSIB Functional Abilities Form is the right analogue, and it is instructive mostly for how *narrow* it is.**

WSIB states the FAF is completed by the treating health professional and gives employer and worker "a common frame of reference about the worker's functional abilities," and that employer-designed alternatives "should not request diagnostic or confidential information, and should be limited to functional information" ([WSIB, Functional Abilities Form](https://www.wsib.ca/en/functional-abilities-form)). The archived operational policy is blunter: "The FAF does not contain either clinical or diagnostic information," and "Neither employers nor employer representatives may disclose the information contained in an FAF except to a person assisting the workplace parties in meeting their WR obligations" ([WSIB operational policy](https://www.wsib.ca/en/operational-policy-manual/functional-abilities-form-work-reintegration-archived-november-30-2020)). The completion guide instructs that "For privacy reasons, diagnostic information must never be provided on this form" and that the worker must sign consent ([FAF Guide](https://www.wsib.ca/sites/default/files/2024-09/10779a_202408_fafguide_web.pdf)). WSIB's practitioner page confirms only regulated health care practitioners may complete it ([WSIB, commonly used forms](https://www.wsib.ca/en/commonly-used-forms-form-8-form-cms8-and-faf)). For non-injury employers, WSIB limits disclosure to "functional abilities, technical and transferable skills, and/or accommodation needs" ([WSIB, Disclosure of Claim File Information](https://www.wsib.ca/en/operational-policy-manual/disclosure-claim-file-information-employers-no-issue-dispute)).

**But note what the FAF is *not*.** It operates inside a statutory return-to-work scheme, between parties already in an employment relationship, about an accepted workplace injury, with a legislated purpose. It is a *re-entry* instrument, not a *screening* instrument. Trampoline borrowing the FAF's redaction discipline is smart. Trampoline citing the FAF as authority for showing health-derived verdicts to prospective employers is a category error, and I would expect opposing counsel to say so.

**Also note what the FAF doesn't contain: a pass/fail verdict.** It contains graded functional descriptors — lift, walk, stand. A binary "pass/fail" carries strictly *more* stigma per bit than the FAF does, because "fail" is an unqualified adverse judgment about a person, whereas "20 lb lifting limit" is a fact about a task.

---

### 3. Federal privacy law status in 2026

**Verdict: PIPEDA is still the operative federal private-sector law. Reform has not passed.**

**Confidence: high — confirmed against Parliament's own records.**

Bill C-27 (which would have enacted the CPPA) died on prorogation on January 6, 2025 ([Gowling WLG](https://gowlingwlg.com/en-ae/insights-resources/articles/2025/federal-privacy-reform)). Its successor, **Bill C-36, the Protecting Privacy and Consumer Data Act**, received first reading on **June 15, 2026**. Parliament's [LEGISinfo record](https://www.parl.ca/LegisInfo/en/bill/45-1/C-36) shows status "At second reading in the House of Commons" with **no second-reading activity recorded**, and the [bill text](https://www.parl.ca/DocumentViewer/en/45-1/bill/C-36/first-reading) confirms the first-reading date. ISED's [backgrounder](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/government-of-canada-introduces-legislation-to-protect-canadians-privacy-in-the-digital-age.html) describes the new Digital Safety and Data Protection Commission of Canada. Commentary notes C-36's coming into force is tied by order in council to establishing that Commission, which itself depends on separate legislation ([Bill C-36: A Third Attempt](https://www.mondaq.com/canada/privacy-protection/1804890/bill-c-36-a-third-attempt-at-federal-private-sector-privacy-reform)).

**Build to PIPEDA. Do not design around C-36.**

Under PIPEDA today:

- **Appropriate purposes.** [Section 5(3)](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-5.html): an organization may collect, use or disclose personal information "only for purposes that a reasonable person would consider are appropriate in the circumstances." This is the provision that matters most to you, for reasons in Q5.
- **Consent.** Meaningful consent is required absent an exception; the OPC has published seven guiding principles ([OPC, Privacy in the Workplace](https://www.priv.gc.ca/en/privacy-topics/employers-and-employees/02_05_d_17/)).
- **Breach reporting.** [Section 10.1](https://laws-lois.justice.gc.ca/eng/acts/p-8.6/FullText.html/) requires reporting to the Commissioner and notifying individuals where a breach creates a "real risk of significant harm," with sensitivity and probability of misuse as express factors. The OPC's [guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/privacy-breaches-at-your-business/gd_pb_201810/) sets out the two-tier assessment and requires records of *all* breaches, reportable or not. Health information sits at the sensitive end, so assume nearly any Trampoline breach is reportable.

**The gap you must understand.** PIPEDA governs *Trampoline*, because Trampoline handles personal information in commercial activity. It does **not** govern what a provincially regulated Ontario employer does with employee information — Ontario has no general private-sector privacy statute, and PIPEDA's employee-information provisions reach only federal works and undertakings ([Blakes/JD Supra](https://www.jdsupra.com/legalnews/new-ontario-consultation-on-private-7110587/); [Gowling WLG](https://gowlingwlg.com/en/insights-resources/articles/2022/new-era-of-privacy-rights-in-ontario-workplaces)). So the moment a readiness level lands in an Ontario employer's ATS, it enters a statutory vacuum. Your contracts are the only control. Design accordingly: minimize what crosses that boundary, because you cannot regulate what happens after it does.

---

### 4. Ontario Human Rights Code: pre-offer vs. post-conditional-offer

**Verdict: Gating job access on health-derived checks is high-risk and, on the current design, likely unlawful.**

**Confidence: high on the policy position; medium-high on outcome, since I found no case on a platform of exactly this shape. A lawyer is genuinely required here — this is the question that decides whether the product ships as designed.**

The OHRC's position is unambiguous: medical questions "asked as part of the application screening process, violate subsection 23(2) of the Code," and "any medical assessment to verify or determine an individual's ability to perform the essential duties of a job, should only take place after a conditional offer of employment is made, preferably in writing" ([OHRC, Employment applications](https://www.ohrc.on.ca/en/policy-employment-related-medical-information/employment-applications); same text in the [full policy PDF](https://www.ohrc.on.ca/sites/default/files/attachments/Policy_on_employment-related_medical_information.pdf)). The OHRC repeats this in [Requesting job-related sensitive information](https://www.ohrc.on.ca/en/iv-human-rights-issues-all-stages-employment/6-requesting-job-related-sensitive-information), adding that where testing occurs, employers "should only get information from medical testing on the applicant's ability to perform the essential job duties and any restrictions that may limit this ability." The [HIV/AIDS policy](https://www.ohrc.on.ca/en/book/export/html/2454) states the rule as a numbered list, including that pre-offer employment-related medical examinations or inquiries "are prohibited under subsection 23 (2) of the Code."

**Three further exposures specific to Trampoline's mechanics:**

**Constructive discrimination.** [Code s. 11](https://www.ontario.ca/laws/statute/90h19.) catches a facially neutral "requirement, qualification or factor" that excludes a group identified by a prohibited ground, unless it is reasonable and bona fide *and* the group's needs cannot be accommodated short of undue hardship. A "readiness level" is exactly such a factor. The OHRC explains that s. 11 combined with s. 9 reaches adverse-effect discrimination ([OHRC, Duty to accommodate](http://www.ohrc.on.ca/en/policy-ableism-and-discrimination-based-disability/8-duty-accommodate); [Policy and guidelines on disability](https://www.ohrc.on.ca/sites/default/files/attachments/Policy_and_guidelines_on_disability_and_the_duty_to_accommodate.pdf)). Note that under [s. 17](https://www.ontario.ca/laws/statute/90h19.), no one may be found incapable of essential duties unless their needs cannot be accommodated without undue hardship — and undue hardship is confined to cost, outside funding, and health and safety ([OHRC, Undue hardship](http://www.ohrc.on.ca/en/book/export/html/18941)). An automated expiry rule performs none of that individualized analysis.

**Perceived disability is enough.** In [Davis v. Toronto (City), 2011 HRTO 806](https://www.minicounsel.ca/hrto/2011/806) *(⚠️ third-party case text — verify on CanLII)*, a conditional firefighter offer was withdrawn over a prior knee injury; the Tribunal found the City "discriminated against the complainant when it denied him employment... at least partly because of a disability or perceived disability," and that the s. 17 defence failed because the City had not established incapability of the essential duties — despite medical evidence of no functional limitation. **This is the case that should worry you most**, because a "fail" or "expired" badge is a machine for manufacturing perceived disability at scale, detached from any individualized assessment. (Earlier stages: [2008 HRTO 15](https://www.minicounsel.ca/hrto/2008/15), [2005 HRTO 7](https://www.minicounsel.ca/hrto/2005/7).)

**Trampoline's own liability.** The Code reaches services and contracts, not only employment — [s. 3](https://www.ontario.ca/laws/statute/90h19.) protects the right to contract on equal terms. Trampoline may be named as a respondent alongside its employer customers rather than sitting safely behind them. Do not assume you are merely infrastructure.

**Two adjacent Ontario obligations that bite a hiring platform directly.** Since **January 1, 2026**, employers with 25+ employees must disclose in publicly advertised job postings any use of AI to "screen, assess or select" applicants, where AI is defined broadly as "a machine-based system that, for explicit or implicit objectives, infers from the input it receives in order to generate outputs such as predictions, content, recommendations or decisions" ([ontario.ca ESA guide](https://www.ontario.ca/document/your-guide-employment-standards-act-0/requirements-related-publicly-advertised-job); [O. Reg. 476/24](https://www.ontario.ca/laws/regulation/r24476); [Hicks Morley](https://hicksmorley.com/2025/12/16/new-year-new-rules-ontario-job-posting-requirements-take-effect-january-1-2026/)). Trampoline's staged readiness computation plausibly falls inside that definition, and the obligation sits on the employer even when a third party does the screening. Counsel have noted the definition is broad and undefined at the edges ([Osler](https://www.osler.com/en/insights/blogs/employment-and-labour-law-blog/working-for-workers-four-artificial-intelligence-disclosure-requirement/)). Separately, the OHRC warned in its [Bill 149 submission](https://www.ohrc.on.ca/en/news-center/ontario-human-rights-commission-submission-standing-committee-social-policy-regarding) that AI tools infer "race, disability, age and other Code grounds" from proxy data and that hiring decisions then rest on discriminatory proxies. **Trampoline does not need to infer disability by proxy — it would be gating on a direct signal, which is worse.**

---

### 5. Does consent cure it?

**Verdict: No. Not under human rights law, and not under privacy law either.**

**Confidence: high.**

**Human rights.** The Supreme Court held in [Ontario Human Rights Commission v. Etobicoke](https://www.minicounsel.ca/scc/1982/15) *(⚠️ third-party case text — verify on CanLII)* that the Code "has been enacted by the Legislature of the Province of Ontario for the benefit of the community at large and of its individual members and clearly falls within that category of enactment which may not be waived or varied by private contract; therefore this argument cannot receive effect." The HRTO applied the principle in [Perricone v. Fabco Plastics, 2010 HRTO 1655](https://www.minicounsel.ca/hrto/2010/1655) *(⚠️ third-party case text — verify on CanLII)*: "It would be contrary to public policy to permit individuals to relinquish their future right to be treated in accordance with the Code, and any agreement purporting to have that effect will be null and void." The OHRC states the same, describing human rights legislation as "a floor beneath which the parties cannot contract out" ([OHRC, Resolving human rights issues](https://www.ohrc.on.ca/en/iv-human-rights-issues-all-stages-employment/12-resolving-human-rights-issues-workplace)). Settling a *past* claim is permitted; prospectively consenting to an unlawful inquiry is not.

**Economic pressure.** The same OHRC page lists among the factors for setting aside a release whether the person "was subject to such significant economic pressure that his or her consent was negated due to duress," and whether psychological or emotional pressure had that effect. **Trampoline's user is by definition rebuilding health and employment simultaneously — the population where a duress argument is strongest, not weakest.**

**Privacy.** Consent cannot rescue an inappropriate purpose. In [PIPEDA Findings #2022-001 (Tim Hortons)](https://www.priv.gc.ca/en/opc-actions-and-decisions/investigations/investigations-into-businesses/2022/pipeda-2022-001/), the OPC held that "Users cannot provide consent when the purpose for the collection, use and disclosure of personal information is not appropriate, reasonable or legitimate within the meaning of the Acts." That is [s. 5(3)](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-5.html) doing independent work. Canada's federal, provincial and territorial privacy commissioners have jointly warned that adopting privacy-invasive technologies in employment management "can lead to significant and measurable impacts on employees' careers — like job compensation, promotion, or termination" ([FPT joint resolution](https://www.priv.gc.ca/en/about-the-opc/what-we-do/provincial-and-territorial-collaboration/joint-resolutions-with-provinces-and-territories/res_231005_02)). CSA Group research funded in this space notes that "unequal power between employers and employees" means "workers might not be making full and free choices" ([CSA Group](https://www.csagroup.org/wp-content/uploads/CSA-Group-Research-Exercising-Privacy-Policy-Options-Privacy-for-Wellness-Wearables.pdf)).

**Practical consequence:** every consent screen you build is a compliance artifact for the *storage* question and worth building well — and is worth approximately nothing as a defence to the *gating* question. Do not let a good consent flow create false confidence.

---

### 6. Can regulated professionals issue these attestations?

**Verdict: Physicians can, and in some circumstances must — but the format you want may not be one they can defensibly sign, and someone has to pay.**

**Confidence: high for physicians and psychotherapists; low for psychologists and nurses, which I did not research and you should not assume.**

Under the CPSO's [Third Party Medical Reports](https://www.cpso.on.ca/Physicians/Policies-Guidance/Policies/Third-Party-Medical-Reports) policy, treating physicians "must provide... third party medical reports about their current and former patients when requested," and such reports must be "comprehensive and relevant; fair, objective, and non-partisan; transparent, accurate, and clear; and timely." Deadlines are 45 days for reports not requiring an independent medical examination and 60 days where an IME is required ([CPSO Dialogue](https://dialogue.cpso.on.ca/articles/third-party-medical-reports)). The policy also requires disclosure of conflicts of interest and documented consent ([Rosen Sunshine summary](https://www.rosensunshine.com/blog/m2nfkzboktgcf55vj8i7ws66oe1p23)).

**Three specific frictions.**

**Format.** CPSO requires reports to "state any limitations (whether due to availability of documentation or because it is beyond your expertise/experience)" and to state findings objectively ([OMA summary of the policy](https://www.oma.org/practice-professional-support/running-your-practice/operations-and-practice-management/doctors-notes/)). A checkbox that collapses a clinical judgment into "pass" strips exactly the qualifications the College requires. Your form must carry a free-text limitations field and must not force a binary.

**Billing.** These are uninsured services. The OMA notes notes and forms "can be billed directly to the patient," and warns clinicians to counsel patients that a clearance note "will be vague, and the note is not covered as an insured service." WSIB's model is instructive on who pays: WSIB pays for its own standard form, but where an employer uses its own form "the employer must pay the health professional directly" ([WSIB](https://www.wsib.ca/en/functional-abilities-form)). **Trampoline is an employer-style custom form.** If you do not solve the payer question, you have built a product that bills a financially precarious person for the privilege of applying to jobs. That is a business-model problem before it is a legal one, and it will read badly to a regulator.

**Policy headwind.** Since **October 28, 2024**, Ontario employers are prohibited from requiring a certificate from a qualified health practitioner as evidence of entitlement to ESA sick leave ([ontario.ca ESA guide](http://www.ontario.ca/document/your-guide-employment-standards-act-0/sick-leave); [Cassels](https://cassels.com/insights/working-for-workers-five-act-2024-receives-royal-assent/)). The prohibition doesn't cover accommodation or return-to-work documentation ([Blaney McMurtry](https://www.blaney.com/articles/employment-update-restrictions-on-employer-sick-note-requests-in-canada-nov-2025)), so it does not bar Trampoline directly. But the legislative direction of travel is *away* from routine employer-driven medical paperwork, and the OMA notes CPSO has confirmed a self-attestation form may be offered in lieu of a clearance note. A product whose core loop generates more third-party medical forms is swimming against the current — which matters for partner recruitment and for how a regulator or journalist frames you.

**Psychotherapists.** CRPO registrants must provide a report or certificate "within a reasonable time... unless there is reasonable cause not to do so," must indicate whether they are giving opinion, objective fact, or a summary of client-provided information, must obtain express consent, disclose only relevant information, and give the client an opportunity to review before submission ([CRPO Standard 5.2](https://crpo.ca/practice-standards/record-keeping-documentation/requests-for-reports/); [CRPO on consent](https://crpo.ca/resource-articles/obtaining-consent-to-release-information/)). CRPO also warns registrants to assess whether a request is within their competence and to "take care not to disclose more information than is necessary" ([Can I write a letter for my client?](https://crpo.ca/resource-articles/can-i-write-a-letter-for-my-client/)). **The requirement to distinguish opinion from fact is directly incompatible with an unlabelled pass/fail token.**

**I did not research the College of Psychologists and Behavioural Analysts or the College of Nurses of Ontario.** Do not assume their rules mirror CPSO's.

---

### 7. Mental health specifically

**Verdict: A "mental check-in" pass/fail is inherently high-risk and should not exist in employer-facing form.**

**Confidence: high.**

The OHRC's mental health policy states that accommodation providers "should limit requests for information to those related to the nature of the limitation or restriction," and that only in a rare case where more is legitimately needed may they ask the *nature* of the illness or condition — "as opposed to a medical diagnosis." It adds that "Generally, the accommodation provider does not have the right to know a person's confidential medical information, such as the cause of the disability, diagnosis, symptoms, or treatment," and warns against demanding more because of "its own impressionistic view of what a mental health disability or addiction disability should 'look like'" ([OHRC, Duty to accommodate — mental health](https://www.ohrc.on.ca/en/policy-preventing-discrimination-based-mental-health-disabilities-and-addictions/13-duty)). Practitioner commentary aligns: employers are entitled to nature of illness, prognosis, restrictions, and the basis for conclusions — but generally not diagnosis, symptoms, or clinical notes ([HTW Law](https://www.htwlaw.ca/amp/a-legal-analysis-on-the-medical-documentation-in-disability-cases-and-the-duty-to-accommodate); [Siskinds](https://www.siskinds.com/what-can-you-ask-for-in-a-medical-certificate/)).

**Trampoline's problem is not that a "mental check-in" leaks a diagnosis. It is that the existence of the check leaks the ground.** A physical FAF-style restriction ("no lifting over 20 lb") tells an employer about a task. A "mental check-in: pass," dated and expiring, tells an employer that this person is under mental health assessment — which is disclosure of a Code-protected characteristic before any offer exists, with no functional content that an employer could lawfully act on anyway.

There is also **no defensible clinical instrument here**. The FAF works because physical function decomposes into measurable, job-relevant primitives that a clinician can attest to and a court can review. "Mentally ready for work" does not decompose that way, and CRPO's own standards require registrants to separate opinion from fact and stay within competence. You would be asking clinicians to sign something the discipline does not support.

**Recommendation: delete the mental health check from any employer-visible surface entirely.** Not redact — delete. If it exists at all, it should be a private self-tracking feature that no gate can read and no share link can expose, ever, including by inference from a readiness level that silently incorporates it.

---

### 8. AODA and WCAG

**Verdict: Binding at 50+ employees; below that, strongly advisable and effectively expected.**

**Confidence: high on the core rule; low on the specific next reporting deadline.**

[O. Reg. 191/11 s. 14](https://www.ontario.ca/laws/regulation/110191/v2) requires designated public sector organizations and large organizations to make internet websites and web content conform to **WCAG 2.0 Level AA**, with the deadline for large organizations of **January 1, 2021**. Ontario confirms this applies to "a business or non-profit organization with 50 or more employees," covers content published after January 1, 2012, and excludes success criteria 1.2.4 (live captions) and 1.2.5 (pre-recorded audio descriptions) ([ontario.ca, How to make websites accessible](https://www.ontario.ca/page/how-make-websites-accessible), updated July 31, 2025). Organizations under 50 employees "are not required under the IASR to follow these website accessibility requirements, but are encouraged to do so" ([ontario.ca](https://www.ontario.ca/page/when-public-websites-are-not-accessible)).

**The standard is still WCAG 2.0 AA — Ontario has not adopted 2.1 or 2.2**, though many organizations target the newer versions voluntarily ([DigitalA11Y](https://www.digitala11y.com/compliance/aoda/) — vendor source, treat as commentary). The AODA's original goal of a fully accessible Ontario by 2025 passed without universal compliance; I did not find a 2025–2026 amendment changing the WCAG reference, and you should verify that independently before relying on it.

**More important for you than WCAG: the AODA employment standard.** [O. Reg. 191/11 ss. 22–24](https://www.ontario.ca/laws/regulation/110191/v2) require every employer to notify employees and the public about the availability of accommodation in recruitment processes (s. 22); to notify job applicants, when individually selected to participate in "an assessment or selection process," that accommodations are available in relation to the materials or processes used, and to provide suitable accommodation on request (s. 23); and to notify successful applicants of accommodation policies when making offers (s. 24). **Trampoline's gate flow is an assessment or selection process.** Build the s. 23 accommodation notice and request path into the gate UI itself — an accessible design that offers no way to request accommodation *from the gate* fails the more important half of this standard.

Reporting obligations apply to organizations with 20+ employees every three years ([ontario.ca](https://www.ontario.ca/page/when-public-websites-are-not-accessible)); I saw a December 31, 2026 date cited for the next private-sector filing ([EqualWeb](https://www.equalweb.com/platform/standards/aoda.html)) but **could not confirm it against a government source — verify before diarizing.**

Design at WCAG 2.0 AA from day one regardless of headcount. A readiness platform for people with disabilities that is itself inaccessible is the kind of fact that turns a complaint into a story.

---

### 9. Canadian precedent on health/wellness-gated employment platforms

**Verdict: I found no Canadian regulatory action, complaint, or reported controversy squarely on an employment platform that scored, ranked, or gated people using health, wellness, or disability data.**

**Confidence: medium — this is an absence-of-evidence finding after targeted searching, not a clean bill of health.**

**Treat the absence as *novelty risk*, not safety.** Trampoline would be an early mover in a space regulators have signalled interest in but not yet adjudicated, which means you would be the test case rather than the beneficiary of one.

The closest analogues, all pointing the same direction:

- **[Entrop v. Imperial Oil, 2000 CanLII 16800 (ON CA)](https://www.minicounsel.ca/oca/2000/16800)** *(⚠️ third-party case text — verify on CanLII)* — mandatory disclosure of past substance abuse was struck down; the Court held that "Requiring an employee to disclose a past substance abuse problem, no matter how far in the past, is an unreasonable requirement," and that the employer failed to show mandatory disclosure, automatic reassignment and reinstatement were reasonably necessary. Directly on point for an expiry-driven disclosure regime.
- **TTC random drug and alcohol testing struck down, August 2026** — the arbitrator found employees had a reasonable expectation of privacy, that the evidentiary record did not establish random testing materially advanced safety, and that the program contravened Charter s. 8 and the collective agreement ([Hicks Morley](https://hicksmorley.com/2026/08/10/arbitrator-strikes-down-ttcs-random-drug-and-alcohol-testing-program/)). The reasoning — compelling objective, insufficient evidence that the intrusive mechanism achieves it — transfers cleanly to health gates.
- **[Davis](https://www.minicounsel.ca/hrto/2011/806)** *(⚠️ third-party case text — verify on CanLII)* — discussed above; the perceived-disability screening case.
- **[Gerred v. Toronto Transit Commission, 2016 HRTO 1674](https://www.minicounsel.ca/hrto/2016/1674)** *(⚠️ third-party case text — verify on CanLII)* — conditional offer put on hold pending medical clearance; application ultimately dismissed as an abuse of process for failure to produce medical documents, so it does **not** stand for the proposition that such holds are lawful.
- **[Grandinetti v. Ontario Lottery and Gaming](https://www.grosman.com/blog/disability-accommodation/ontario-lottery-gamings-revocation-of-job-offer-not-discrimination/)** — offer rescission upheld where the applicant could not establish a factual link between the adverse action and a Code ground; illustrates that the causal link must be pleaded, not merely asserted.
- **OHRC drug and alcohol testing policy** — notes testing "can reveal information about a person's health other than drug or alcohol use" ([OHRC](https://www.ohrc.on.ca/sites/default/files/Policy%20on%20drug%20and%20alcohol%20testing_revised_2016_accessible_1.pdf)).
- **Regulatory signalling** — the OHRC and Law Commission of Ontario's [Human Rights AI Impact Assessment](https://www.ohrc.on.ca/en/human-rights-ai-impact-assessment) covers "Employment (including but not limited to hiring, referral, job screening...)" and assesses whether an AI system accommodates people with disabilities; the OHRC has urged government to require disclosure of "how data associated with personal characteristics of the applicant may be used" ([Bill 149 submission](https://www.ohrc.on.ca/en/news-center/ontario-human-rights-commission-submission-standing-committee-social-policy-regarding)) and continues to press on AI-driven screening bias ([Informing Canada's renewed AI Strategy](https://www.ohrc.on.ca/en/informing-canadas-renewed-ai-strategy)).
- **Employer benefits-app backlash** — Google reversed a policy requiring employees to share personal data with a third-party AI tool to access health benefits ([Canadian HR Reporter](https://www.hrreporter.com/focus-areas/automation-ai/googles-policy-reversal-highlights-privacy-risks-of-benefits-apps/393661)). Reputational precedent for conditioning a benefit on health-data sharing, even where arguably lawful.

**Run the OHRC/LCO Human Rights AI Impact Assessment on Trampoline before launch.** It is free, it is the regulator's own instrument, and having completed it is materially better than not having done so if you are ever asked.

---

## Ranked legal risks and the design fix for each

### 1. Gating job applications on health-derived checks — likely unlawful pre-employment medical inquiry and disability discrimination

The OHRC treats pre-offer medical inquiry as violating [s. 23(2)](https://www.ohrc.on.ca/en/policy-employment-related-medical-information/employment-applications), consent is no defence ([Etobicoke](https://www.minicounsel.ca/scc/1982/15)), and adverse action on perceived disability without individualized incapability analysis fails [s. 17](https://www.minicounsel.ca/hrto/2011/806).

**Fix: remove medical and mental health gates from the hiring path entirely.** Job opportunities gate on skills checks only. Health-derived checks are confined to training/education access (where a *bona fide*, documented program safety requirement exists) and to private self-tracking. **This is the change that most reduces total legal exposure, and no lesser change substitutes for it.**

### 2. "Lapsed health check pauses job applications"

An automated adverse employment consequence triggered by health-record staleness, with no individualized assessment and no accommodation analysis — the fact pattern [Entrop](https://www.minicounsel.ca/oca/2000/16800) and [Davis](https://www.minicounsel.ca/hrto/2011/806) punish.

**Fix: expiry never restricts job access.** Let expiry drive a private nudge to the person. If a specific employer has a genuine post-offer currency requirement, that is a conversation between employer and candidate after the offer, not a state transition in your database.

### 3. Mental health check-ins visible to employers

Discloses a Code-protected ground before any offer, with no functional content an employer may lawfully act on ([OHRC](https://www.ohrc.on.ca/en/policy-preventing-discrimination-based-mental-health-disabilities-and-addictions/13-duty)), and no defensible clinical instrument behind a binary verdict ([CRPO 5.2](https://crpo.ca/practice-standards/record-keeping-documentation/requests-for-reports/)).

**Fix: no mental health signal ever reaches an employer surface** — not the verdict, not the existence of the check, not a readiness level computed from it. Enforce at the data layer, not the view layer.

### 4. Employer-facing view carries a verdict rather than functional restrictions

The FAF conveys graded functional information and never diagnosis or pass/fail ([WSIB](https://www.wsib.ca/en/operational-policy-manual/functional-abilities-form-work-reintegration-archived-november-30-2020)); OHRC limits employers to ability to perform essential duties and restrictions ([OHRC](https://www.ohrc.on.ca/en/iv-human-rights-issues-all-stages-employment/6-requesting-job-related-sensitive-information)).

**Fix: kill pass/fail on the employer surface.** Post-conditional-offer, show only functional restriction codes in FAF style, tied to essential duties, plus an accommodation-request path. Drop "readiness level" from employer view — it is an unexplainable composite score derived from health data, which is the exact artifact the OHRC's [Bill 149 submission](https://www.ohrc.on.ca/en/news-center/ontario-human-rights-commission-submission-standing-committee-social-policy-regarding) targets.

### 5. Custodian-to-platform data pipe triggering PHIPA s. 49 and possible HINP status

[s. 49](https://www.ontario.ca/laws/statute/04p03) locks Trampoline's permitted uses to the clinic's original disclosure purpose; [O. Reg. 329/04 s. 6](https://www.ontario.ca/laws/regulation/r04329) can pull you in as a network provider.

**Fix: person-mediated ingestion only.** Clinic gives the attestation to the patient; the patient submits it. No clinic-to-employer routing, ever. Written express consent captured on the clinic side, per the [Circle of Care](https://www.ipc.on.ca/sites/default/files/legacy/Resources/circle-of-care.pdf) rule that implied consent cannot support disclosure to a non-custodian.

### 6. Trampoline named as a respondent in its own right

The Code reaches services and contracts ([s. 3](https://www.ontario.ca/laws/statute/90h19.)), and s. 11 with s. 9 reaches adverse-effect discrimination ([OHRC](http://www.ohrc.on.ca/en/policy-ableism-and-discrimination-based-disability/8-duty-accommodate)).

**Fix:** contractually prohibit customers from using Trampoline data in pre-offer decisions; make health-derived fields technically unavailable pre-offer; log every employer view; audit for gate configurations that function as pre-offer screens and refuse to serve them.

### 7. ESA AI-disclosure exposure passed through to employer customers

Since January 1, 2026, employers with 25+ employees must disclose AI used to screen, assess or select ([ontario.ca](https://www.ontario.ca/document/your-guide-employment-standards-act-0/requirements-related-publicly-advertised-job); [O. Reg. 476/24](https://www.ontario.ca/laws/regulation/r24476)), and the obligation follows the employer even when a third party performs the screening.

**Fix:** publish a plain statement of whether readiness computation meets the ESA definition, supply customers with disclosure language, and complete the [OHRC/LCO Human Rights AI Impact Assessment](https://www.ohrc.on.ca/en/human-rights-ai-impact-assessment).

### 8. Breach exposure on inherently sensitive data

[PIPEDA s. 10.1](https://laws-lois.justice.gc.ca/eng/acts/p-8.6/FullText.html/) plus [OPC guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/privacy-breaches-at-your-business/gd_pb_201810/); health data sits at the top of the sensitivity scale, so assume most incidents are reportable.

**Fix:** encryption at rest and in transit, no health numbers ([PHIPA s. 34](https://www.ontario.ca/laws/statute/04p03) sharply restricts non-custodian collection of health numbers), short retention with hard deletion, a breach register covering all incidents, and a tested response runbook.

### 9. Accessibility failures

[O. Reg. 191/11 ss. 14, 22–24](https://www.ontario.ca/laws/regulation/110191/v2).

**Fix:** WCAG 2.0 AA from day one regardless of headcount, and build the s. 23 accommodation-request path into the gate UI itself.

### 10. The post-disclosure void

Ontario has no private-sector privacy statute covering employee information at provincially regulated employers ([JD Supra](https://www.jdsupra.com/legalnews/new-ontario-consultation-on-private-7110587/); [Gowling](https://gowlingwlg.com/en/insights-resources/articles/2022/new-era-of-privacy-rights-in-ontario-workplaces)).

**Fix:** time-limited share links, no download or export, watermarked views, contractual no-retention terms mirroring the [WSIB FAF restriction](https://www.wsib.ca/en/operational-policy-manual/functional-abilities-form-work-reintegration-archived-november-30-2020) that recipients may not further disclose except to those assisting with return-to-work obligations, and disclosure to the person of exactly who viewed what and when.

---

## The single highest-risk feature

**The health gate on the hiring path — concretely, the rule that an expired or failed medical or mental health check pauses or blocks job applications.**

That one rule combines every element that Ontario law treats as prohibited:

- a medical inquiry operating **before any conditional offer**;
- an **automated adverse employment consequence** based on health status;
- **no individualized assessment** of ability to perform essential duties;
- **no accommodation analysis** before exclusion;
- and a **consent screen that cannot save any of it**.

Remove it and Trampoline becomes a defensible product with manageable compliance work. Keep it and every other fix is decoration.

---

## What must be true before you store one real person's real health-derived data

### Legal preconditions

1. **A written opinion from an Ontario privacy and employment lawyer** on (a) whether the specific data flow makes Trampoline a PHIPA s. 49 recipient or an O. Reg. 329/04 health information network provider, and (b) whether any employer-facing gate involving health-derived data survives Code s. 23(2). These two questions are genuinely beyond what desk research can settle, and both are existential to the design.
2. **Medical and mental health gates removed from the hiring path** in code, not policy — the fields must be unreadable by hiring-side gates at the data layer.
3. **Person-mediated ingestion only**, with the clinic-to-platform pipe removed from the architecture.
4. **A completed [Human Rights AI Impact Assessment](https://www.ohrc.on.ca/en/human-rights-ai-impact-assessment)**, dated and retained.
5. **Written express consent captured at the clinic**, satisfying the [Circle of Care](https://www.ipc.on.ca/sites/default/files/legacy/Resources/circle-of-care.pdf) rule against implied consent for disclosure to non-custodians — with your partner agreement placing that duty on the clinic and requiring proof.
6. **A resolved payer model.** If the person pays out of pocket for every attestation ([OMA](https://www.oma.org/practice-professional-support/running-your-practice/operations-and-practice-management/doctors-notes/)), you have a fairness problem that will surface as a regulatory and reputational one.
7. **Attestation forms reviewed against CPSO and CRPO requirements**, carrying a limitations field and an opinion-versus-fact designation, with no forced binary.

### Technical preconditions

8. **Granular, per-recipient, revocable consent**, with expiring share links, no export, and an honest statement that revocation cannot retract what was already viewed.
9. **A complete access log** surfaced to the person: who viewed what, when.
10. **Encryption at rest and in transit; no health numbers; documented retention with hard deletion; a breach register covering all incidents and a tested s. 10.1 response runbook.**
11. **WCAG 2.0 AA verified**, with the IASR s. 23 accommodation-request path built into the gate UI.

### Organizational preconditions

12. **Customer contracts** prohibiting pre-offer use of health-derived data, prohibiting retention and onward disclosure, and permitting audit and termination.
13. **A pilot with synthetic data and paid consenting testers** before any production health data exists — with the explicit goal of finding out whether people feel coerced. If they do, the consent is not meaningful and the [duress analysis](https://www.ohrc.on.ca/en/iv-human-rights-issues-all-stages-employment/12-resolving-human-rights-issues-workplace) has already begun to run against you.

---

## Scope limits and unverified items

### Not researched — do not assume these are covered

- **College of Psychologists and Behavioural Analysts of Ontario (CPBAO)** — rules on third-party reports and employer forms. Do not assume they mirror CPSO's.
- **College of Nurses of Ontario (CNO)** — same.
- **Occupational Health and Safety Act (Ontario)** and sector-specific statutory fitness-for-duty requirements for safety-sensitive trades. These may create genuine *bona fide* occupational requirement exceptions that would be worth designing for, and they were not examined.
- **The common-law tort of intrusion upon seclusion** as it might apply to Trampoline or its employer customers.
- **Quebec Law 25, Alberta PIPA, and BC PIPA** — relevant only if Trampoline operates outside Ontario, which was outside this scope.
- **PHIPA offence and penalty provisions (s. 72 and related)** — the existence of offence provisions is noted but specific penalties were not verified.
- **Contractual and insurance implications** (E&O coverage, cyber coverage, indemnity allocation with partner clinics).

### Requires verification against primary sources

- **All case texts.** *Etobicoke*, *Perricone*, *Davis* (2005/2008/2011), *Entrop*, and *Gerred* were read on **minicounsel.ca**, a third-party case-reproduction site. **Verify every quotation and holding on CanLII or an official reporter before citing anywhere.**
- **AODA compliance-reporting deadline.** The December 31, 2026 date for the next private-sector filing came from a vendor page ([EqualWeb](https://www.equalweb.com/platform/standards/aoda.html)) and could not be confirmed against a Government of Ontario source. The three-year cycle for 20+ employee organizations *is* confirmed by [ontario.ca](https://www.ontario.ca/page/when-public-websites-are-not-accessible).
- **Whether any 2025–2026 amendment changed the WCAG reference in O. Reg. 191/11.** No such amendment was found, but absence of a search hit is not confirmation.
- **Whether the IPC has issued guidance specifically on the WSIB Functional Abilities Form** or on functional-abilities information as PHI. None was found; the conclusion in Q2 rests on the statutory text of PHIPA s. 4(1), not on regulator guidance.
- **Bill C-36 status** should be re-checked at [LEGISinfo](https://www.parl.ca/LegisInfo/en/bill/45-1/C-36) before any decision that depends on it; Parliament was scheduled to resume sittings on September 21, 2026, and second reading may proceed shortly after this memo's date.
- **Vendor and law-firm commentary** cited throughout (DigitalA11Y, EqualWeb, HRXconnect, Recording Law, staffingjournal.ca, blackline.legal, and similar) is secondary and was used for orientation only. Every load-bearing proposition in this memo is also supported by a statute, regulation, regulator policy, or Parliament record.

---

## Sources

### PHIPA and Ontario health privacy

- https://www.ontario.ca/laws/statute/04p03
- https://www.ontario.ca/laws/regulation/r04329
- https://www.ipc.on.ca/sites/default/files/legacy/Resources/hguide-e.pdf
- https://www.ipc.on.ca/sites/default/files/legacy/Resources/circle-of-care.pdf
- https://www.ipc.on.ca/sites/default/files/legacy/Resources/fact-08-e.pdf
- https://www.ipc.on.ca/sites/default/files/legacy/2015/11/phipa-faq.pdf
- https://decisions.ipc.on.ca/ipc-cipvp/phipa/en/521515/1/document.do
- https://decisia.lexum.com/ipc-cipvp/phipa/en/521302/1/document.do
- https://www.ocswssw.org/wp-content/uploads/OCSWSSW-PHIPA-Toolkit-ENG_FINAL-3.pdf

### WSIB Functional Abilities Form

- https://www.wsib.ca/en/functional-abilities-form
- https://www.wsib.ca/en/operational-policy-manual/functional-abilities-form-work-reintegration-archived-november-30-2020
- https://www.wsib.ca/en/operational-policy-manual/disclosure-claim-file-information-employers-no-issue-dispute
- https://www.wsib.ca/sites/default/files/2024-09/10779a_202408_fafguide_web.pdf
- https://www.wsib.ca/en/commonly-used-forms-form-8-form-cms8-and-faf

### Federal privacy law

- https://laws-lois.justice.gc.ca/eng/acts/P-8.6/section-5.html
- https://laws-lois.justice.gc.ca/eng/acts/p-8.6/FullText.html/
- https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/privacy-breaches-at-your-business/gd_pb_201810/
- https://www.priv.gc.ca/en/opc-actions-and-decisions/investigations/investigations-into-businesses/2022/pipeda-2022-001/
- https://www.priv.gc.ca/en/about-the-opc/what-we-do/provincial-and-territorial-collaboration/joint-resolutions-with-provinces-and-territories/res_231005_02
- https://www.priv.gc.ca/en/privacy-topics/employers-and-employees/02_05_d_17/
- https://www.parl.ca/LegisInfo/en/bill/45-1/C-36
- https://www.parl.ca/DocumentViewer/en/45-1/bill/C-36/first-reading
- https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/government-of-canada-introduces-legislation-to-protect-canadians-privacy-in-the-digital-age.html
- https://gowlingwlg.com/en-ae/insights-resources/articles/2025/federal-privacy-reform
- https://www.mondaq.com/canada/privacy-protection/1804890/bill-c-36-a-third-attempt-at-federal-private-sector-privacy-reform
- https://www.jdsupra.com/legalnews/new-ontario-consultation-on-private-7110587/
- https://gowlingwlg.com/en/insights-resources/articles/2022/new-era-of-privacy-rights-in-ontario-workplaces

### Ontario Human Rights Code, OHRC policy, and cases

- https://www.ontario.ca/laws/statute/90h19.
- https://www.ohrc.on.ca/en/policy-employment-related-medical-information/employment-applications
- https://www.ohrc.on.ca/sites/default/files/attachments/Policy_on_employment-related_medical_information.pdf
- https://www.ohrc.on.ca/en/iv-human-rights-issues-all-stages-employment/6-requesting-job-related-sensitive-information
- https://www.ohrc.on.ca/en/iv-human-rights-issues-all-stages-employment/12-resolving-human-rights-issues-workplace
- https://www.ohrc.on.ca/en/book/export/html/2454
- https://www.ohrc.on.ca/en/policy-preventing-discrimination-based-mental-health-disabilities-and-addictions/13-duty
- http://www.ohrc.on.ca/en/policy-ableism-and-discrimination-based-disability/8-duty-accommodate
- https://www.ohrc.on.ca/sites/default/files/attachments/Policy_and_guidelines_on_disability_and_the_duty_to_accommodate.pdf
- http://www.ohrc.on.ca/en/book/export/html/18941
- https://www.ohrc.on.ca/sites/default/files/Policy%20on%20ableism%20and%20discrimination%20based%20on%20disability_accessible_2016.pdf
- https://www.ohrc.on.ca/sites/default/files/Policy%20on%20drug%20and%20alcohol%20testing_revised_2016_accessible_1.pdf
- https://www.minicounsel.ca/scc/1982/15 *(⚠️ third-party case reproduction — verify on CanLII)*
- https://www.minicounsel.ca/hrto/2010/1655 *(⚠️ third-party case reproduction — verify on CanLII)*
- https://www.minicounsel.ca/hrto/2011/806 *(⚠️ third-party case reproduction — verify on CanLII)*
- https://www.minicounsel.ca/hrto/2008/15 *(⚠️ third-party case reproduction — verify on CanLII)*
- https://www.minicounsel.ca/hrto/2005/7 *(⚠️ third-party case reproduction — verify on CanLII)*
- https://www.minicounsel.ca/hrto/2016/1674 *(⚠️ third-party case reproduction — verify on CanLII)*
- https://www.minicounsel.ca/oca/2000/16800 *(⚠️ third-party case reproduction — verify on CanLII)*
- https://www.grosman.com/blog/disability-accommodation/ontario-lottery-gamings-revocation-of-job-offer-not-discrimination/
- https://www.htwlaw.ca/amp/a-legal-analysis-on-the-medical-documentation-in-disability-cases-and-the-duty-to-accommodate
- https://www.siskinds.com/what-can-you-ask-for-in-a-medical-certificate/

### Regulated health professionals

- https://www.cpso.on.ca/Physicians/Policies-Guidance/Policies/Third-Party-Medical-Reports
- https://dialogue.cpso.on.ca/articles/third-party-medical-reports
- https://www.rosensunshine.com/blog/m2nfkzboktgcf55vj8i7ws66oe1p23
- https://www.oma.org/practice-professional-support/running-your-practice/operations-and-practice-management/doctors-notes/
- https://crpo.ca/practice-standards/record-keeping-documentation/requests-for-reports/
- https://crpo.ca/resource-articles/can-i-write-a-letter-for-my-client/
- https://crpo.ca/resource-articles/obtaining-consent-to-release-information/

### Employment standards, sick notes, job postings, AI disclosure

- http://www.ontario.ca/document/your-guide-employment-standards-act-0/sick-leave
- https://cassels.com/insights/working-for-workers-five-act-2024-receives-royal-assent/
- https://www.blaney.com/articles/employment-update-restrictions-on-employer-sick-note-requests-in-canada-nov-2025
- https://www.ontario.ca/document/your-guide-employment-standards-act-0/requirements-related-publicly-advertised-job
- https://www.ontario.ca/laws/regulation/r24476
- https://hicksmorley.com/2025/12/16/new-year-new-rules-ontario-job-posting-requirements-take-effect-january-1-2026/
- https://www.osler.com/en/insights/blogs/employment-and-labour-law-blog/working-for-workers-four-artificial-intelligence-disclosure-requirement/

### AODA and accessibility

- https://www.ontario.ca/laws/regulation/110191/v2
- https://www.ontario.ca/page/how-make-websites-accessible
- https://www.ontario.ca/page/when-public-websites-are-not-accessible
- https://www.digitala11y.com/compliance/aoda/
- https://www.equalweb.com/platform/standards/aoda.html

### AI, algorithmic screening, and workplace health data

- https://www.ohrc.on.ca/en/human-rights-ai-impact-assessment
- https://www.ohrc.on.ca/en/news-center/ontario-human-rights-commission-submission-standing-committee-social-policy-regarding
- https://www.ohrc.on.ca/en/informing-canadas-renewed-ai-strategy
- https://www.csagroup.org/wp-content/uploads/CSA-Group-Research-Exercising-Privacy-Policy-Options-Privacy-for-Wellness-Wearables.pdf
- https://www.hrreporter.com/focus-areas/automation-ai/googles-policy-reversal-highlights-privacy-risks-of-benefits-apps/393661
- https://hicksmorley.com/2026/08/10/arbitrator-strikes-down-ttcs-random-drug-and-alcohol-testing-program/
