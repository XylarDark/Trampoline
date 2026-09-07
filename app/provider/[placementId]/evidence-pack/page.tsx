/**
 * A funder submission, printable to PDF with Ctrl+P and nothing else.
 *
 * No PDF library on purpose. A print stylesheet is a dependency-free way to
 * produce a document, it stays selectable and searchable, and it degrades to a
 * readable web page. A library is only worth it when packs must be generated
 * unattended, which is not this phase.
 *
 * The pack states its assumptions in the document itself rather than in a
 * tooltip that does not print, because the piece of paper is what reaches the
 * Service System Manager.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/src/db";
import { placementDetail } from "@/src/db/queries";
import {
  CUMULATIVE_ASSUMPTION_NOTE,
  FUNDED_OUTCOME_MIN_WEEKLY_HOURS,
  cumulativeWeeks,
  describeStatus,
  evidenceStatus,
  placementCheckpoints,
} from "@/src/engine/outcomes";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "ongoing";
}

function humanise(value: string): string {
  return value.replaceAll("_", " ");
}

const EVIDENCE_COPY: Record<string, string> = {
  acceptable: "Accepted",
  not_collected: "Identified, not on file",
  needs_preapproval: "Requires SSM pre-approval",
  not_acceptable: "Not acceptable evidence",
};

export default async function EvidencePackPage({
  params,
}: PageProps<"/provider/[placementId]/evidence-pack">) {
  const { placementId } = await params;
  const detail = await placementDetail(db, placementId);
  if (!detail) notFound();

  const now = new Date();
  const checkpoints = placementCheckpoints(detail.placement, detail.spells, now);
  const weeks = cumulativeWeeks(detail.spells, detail.placement.startedOn, now);
  const claimable = checkpoints.filter((c) => c.status.tag === "claimable");

  return (
    <article className="evidence-pack space-y-6 text-sm">
      <p className="print:hidden">
        <Link href={`/provider/${placementId}`} className="underline">
          Back to the evidence timeline
        </Link>
        . Print this page, or save it as PDF, to submit.
      </p>

      <header className="space-y-1 border-b pb-4">
        <h1 className="text-xl font-semibold">Funded outcome evidence pack</h1>
        <p className="text-muted-foreground">
          Integrated Employment Services. Generated {formatDate(now)} from the record held in
          Trampoline. Every statement below is traceable to a row in the evidence table.
        </p>
      </header>

      <section aria-labelledby="client">
        <h2 id="client" className="mb-2 text-base font-semibold">
          Client and placement
        </h2>
        <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1">
          <dt className="font-medium">Client</dt>
          <dd>{detail.clientName}</dd>
          <dt className="font-medium">Employer</dt>
          <dd>{detail.employerName ?? "Not recorded"}</dd>
          <dt className="font-medium">Position</dt>
          <dd>
            {detail.jobTitle}
            {detail.nocCode ? ` (NOC ${detail.nocCode})` : ""}
          </dd>
          <dt className="font-medium">Job start</dt>
          <dd>{formatDate(detail.placement.startedOn)}</dd>
          <dt className="font-medium">Job end</dt>
          <dd>
            {detail.endedOn ? formatDate(detail.endedOn) : "Ongoing"}
            {detail.endReason ? ` — ${detail.endReason}` : ""}
          </dd>
          <dt className="font-medium">Entry state</dt>
          <dd>
            {detail.placement.enteredEmployedFullHours
              ? `Already working ${FUNDED_OUTCOME_MIN_WEEKLY_HOURS}-plus hours at intake${
                  detail.placement.sameEmployerAsEntry
                    ? ", with this same employer"
                    : ", with a different employer"
                }`
              : `Unemployed or working under ${FUNDED_OUTCOME_MIN_WEEKLY_HOURS} hours at intake`}
          </dd>
          <dt className="font-medium">Cumulative weeks</dt>
          <dd>{weeks}</dd>
        </dl>
      </section>

      <section aria-labelledby="claim">
        <h2 id="claim" className="mb-2 text-base font-semibold">
          Checkpoints claimed
        </h2>
        {claimable.length === 0 ? (
          <p>
            No checkpoint in this record currently meets the funded-outcome test. The table below
            states why for each one.
          </p>
        ) : (
          <p>
            {claimable.length} of {checkpoints.length} checkpoints are submitted as funded outcomes:{" "}
            {claimable.map((c) => `month ${c.month}`).join(", ")}.
          </p>
        )}

        <table className="mt-3 w-full border-collapse">
          <caption className="sr-only">
            Every IES checkpoint for this placement and its current verdict.
          </caption>
          <thead>
            <tr className="border-b text-left">
              <th scope="col" className="py-1 pr-3 font-medium">
                Checkpoint
              </th>
              <th scope="col" className="py-1 pr-3 font-medium">
                Date
              </th>
              <th scope="col" className="py-1 pr-3 font-medium">
                Verdict
              </th>
              <th scope="col" className="py-1 font-medium">
                Basis
              </th>
            </tr>
          </thead>
          <tbody>
            {checkpoints.map((checkpoint) => {
              const described = describeStatus(checkpoint.status);
              return (
                <tr key={checkpoint.month} className="border-b align-top">
                  <td className="py-1 pr-3">Month {checkpoint.month}</td>
                  <td className="py-1 pr-3 tabular-nums">{formatDate(checkpoint.dueOn)}</td>
                  <td className="py-1 pr-3 font-medium">{described.label}</td>
                  <td className="py-1">{described.detail}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="evidence">
        <h2 id="evidence" className="mb-2 text-base font-semibold">
          Supporting evidence
        </h2>
        <table className="w-full border-collapse">
          <caption className="sr-only">
            Employment periods with hours, wage, and the document evidencing each.
          </caption>
          <thead>
            <tr className="border-b text-left">
              <th scope="col" className="py-1 pr-3 font-medium">
                Period
              </th>
              <th scope="col" className="py-1 pr-3 font-medium">
                Hours per week
              </th>
              <th scope="col" className="py-1 pr-3 font-medium">
                Wage
              </th>
              <th scope="col" className="py-1 pr-3 font-medium">
                Document
              </th>
              <th scope="col" className="py-1 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {detail.spells.map((spell) => (
              <tr key={spell.id} className="border-b align-top">
                <td className="py-1 pr-3 tabular-nums">
                  {formatDate(spell.periodStart)} to {formatDate(spell.periodEnd)}
                  {spell.subsidized ? " (subsidized)" : ""}
                </td>
                <td className="py-1 pr-3 tabular-nums">{spell.weeklyHours}</td>
                <td className="py-1 pr-3 tabular-nums">
                  {spell.hourlyWage === null ? "Not recorded" : `$${spell.hourlyWage.toFixed(2)}`}
                </td>
                <td className="py-1 pr-3">
                  {humanise(spell.verificationSource)}
                  {spell.ssmPreApprovalRef ? ` — pre-approval ${spell.ssmPreApprovalRef}` : ""}
                </td>
                <td className="py-1">{EVIDENCE_COPY[evidenceStatus(spell)]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {detail.followUps.length > 0 ? (
        <section aria-labelledby="contact">
          <h2 id="contact" className="mb-2 text-base font-semibold">
            Follow-up contact attempts
          </h2>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Every follow-up attempt, including the ones that failed.
            </caption>
            <thead>
              <tr className="border-b text-left">
                <th scope="col" className="py-1 pr-3 font-medium">
                  Month
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  Date
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  Outcome
                </th>
                <th scope="col" className="py-1 font-medium">
                  Reported hours
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.followUps.map((followUp) => (
                <tr key={followUp.id} className="border-b">
                  <td className="py-1 pr-3 tabular-nums">{followUp.monthsAfterJobStart}</td>
                  <td className="py-1 pr-3 tabular-nums">{formatDate(followUp.contactedOn)}</td>
                  <td className="py-1 pr-3">{humanise(followUp.contactOutcome)}</td>
                  <td className="py-1 tabular-nums">{followUp.weeklyHours ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted-foreground mt-2">
            Failed attempts are included deliberately. Where a checkpoint could not be evidenced,
            these records show the effort made to obtain it.
          </p>
        </section>
      ) : null}

      <section aria-labelledby="assumptions" className="border-t pt-4">
        <h2 id="assumptions" className="mb-2 text-base font-semibold">
          Assumptions and limits
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>{CUMULATIVE_ASSUMPTION_NOTE}</li>
          <li>
            Checkpoints are measured at 1, 3, 6, and 12 months after job start, not after program
            exit.
          </li>
          <li>
            Client self-report is treated as unacceptable evidence, because it does not appear on
            the list of documents the funder accepts.
          </li>
          <li>
            A provider attestation is treated as a last resort and is only shown as accepted where
            a Service System Manager pre-approval reference is recorded against it.
          </li>
          <li>
            A document is judged on its type and on whether it is on file. The funder also requires
            five specific fields on the document itself — employer name, employee name, hours,
            wage, and the period covered — and that is not checked here. Where this pack says a
            document is accepted, it means an acceptable kind of document is recorded, not that its
            contents have been verified field by field.
          </li>
          <li>
            Hours are credited to the employment period the document covers, so a document for one
            period is not treated as evidence for another. The hours shown as worked can therefore
            exceed the hours shown as evidenced.
          </li>
          <li>
            No performance weighting or dollar value is stated anywhere in this pack. Those figures
            are not public.
          </li>
        </ul>
      </section>
    </article>
  );
}
