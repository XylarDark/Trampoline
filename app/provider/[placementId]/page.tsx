/**
 * One client's evidence timeline: what they worked, what proves it, who was
 * contacted, and which milestones are already recorded.
 *
 * The failed follow-up attempts are shown at the same weight as the successful
 * ones. On a real caseload the unanswered calls are most of the work and the
 * reason a checkpoint gets lost, and a screen that only listed the successes
 * would misrepresent the job back to the person doing it.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/src/db";
import { placementDetail } from "@/src/db/queries";
import {
  CUMULATIVE_ASSUMPTION_NOTE,
  cumulativeWeeks,
  evidenceStatus,
  placementCheckpoints,
} from "@/src/engine/outcomes";
import type { EvidenceStatus } from "@/src/engine/outcomes";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "ongoing";
}

function sourceLabel(source: string): string {
  return source.replaceAll("_", " ");
}

/** Evidence acceptability, with a glyph so the verdict is not colour-only. */
const EVIDENCE_COPY: Record<EvidenceStatus, { glyph: string; label: string }> = {
  acceptable: { glyph: "✓", label: "Accepted by the funder" },
  not_collected: { glyph: "?", label: "Acceptable, not on file" },
  needs_preapproval: { glyph: "!", label: "Needs SSM pre-approval" },
  not_acceptable: { glyph: "✕", label: "Not acceptable evidence" },
};

const CONTACT_COPY: Record<string, string> = {
  reached: "Reached",
  no_response: "No response",
  declined_to_answer: "Declined to answer",
  unreachable: "Unreachable",
};

export default async function PlacementDetailPage({
  params,
}: PageProps<"/provider/[placementId]">) {
  const { placementId } = await params;
  const detail = await placementDetail(db, placementId);
  if (!detail) notFound();

  const now = new Date();
  const checkpoints = placementCheckpoints(detail.placement, detail.spells, now);
  const weeks = cumulativeWeeks(detail.spells, detail.placement.startedOn, now);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/provider" className="text-muted-foreground text-sm underline">
          Back to caseload
        </Link>
        <h1 className="text-2xl font-semibold">{detail.clientName}</h1>
        <p className="text-muted-foreground text-sm">
          {detail.jobTitle} at {detail.employerName ?? "an employer not recorded"}
          {detail.nocCode ? ` (NOC ${detail.nocCode})` : ""}. Started{" "}
          {formatDate(detail.placement.startedOn)}
          {detail.endedOn ? `, ended ${formatDate(detail.endedOn)}` : ""}
          {detail.endReason ? ` — ${detail.endReason}` : ""}.
        </p>
        <p className="text-sm">
          <Link href={`/provider/${placementId}/evidence-pack`} className="underline">
            Open the printable evidence pack
          </Link>
        </p>
      </div>

      {detail.placement.enteredEmployedFullHours ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Entry state</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            This client entered already working 20-plus hours per week
            {detail.placement.sameEmployerAsEntry
              ? " for this same employer, so no checkpoint here can produce a funded outcome. An outcome requires 20-plus hours with a different employer."
              : ", so an outcome requires 20-plus hours with this new employer — which this placement is."}
          </CardContent>
        </Card>
      ) : null}

      <section aria-labelledby="checkpoints" className="space-y-3">
        <h2 id="checkpoints" className="text-lg font-semibold">
          Checkpoints
        </h2>
        <Table>
          <TableCaption>
            {weeks} cumulative weeks worked since job start. {CUMULATIVE_ASSUMPTION_NOTE}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Checkpoint</TableHead>
              <TableHead scope="col">Date</TableHead>
              <TableHead scope="col">Verdict</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkpoints.map((checkpoint) => (
              <TableRow key={checkpoint.month}>
                <TableCell className="font-medium">Month {checkpoint.month}</TableCell>
                <TableCell className="tabular-nums">{formatDate(checkpoint.dueOn)}</TableCell>
                <TableCell>
                  <StatusBadge status={checkpoint.status} showDetail />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Separator />

      <section aria-labelledby="spells" className="space-y-3">
        <h2 id="spells" className="text-lg font-semibold">
          Employment periods and evidence
        </h2>
        <Table>
          <TableCaption>
            Spells are kept separate rather than collapsed into one start and end date, so a person
            who worked, stopped, and restarted still has a checkpoint assessed on the right period.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Period</TableHead>
              <TableHead scope="col">Hours per week</TableHead>
              <TableHead scope="col">Wage</TableHead>
              <TableHead scope="col">Evidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detail.spells.map((spell) => {
              const status = evidenceStatus(spell);
              const copy = EVIDENCE_COPY[status];
              return (
                <TableRow key={spell.id}>
                  <TableCell className="tabular-nums">
                    {formatDate(spell.periodStart)} to {formatDate(spell.periodEnd)}
                    {spell.subsidized ? (
                      <span className="block text-xs font-medium">Subsidized</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="tabular-nums">{spell.weeklyHours}</TableCell>
                  <TableCell className="tabular-nums">
                    {spell.hourlyWage === null ? "Not recorded" : `$${spell.hourlyWage.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="font-medium">
                      <span aria-hidden="true">{copy.glyph}</span> {copy.label}
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      {sourceLabel(spell.verificationSource)}
                      {spell.ssmPreApprovalRef ? `, pre-approval ${spell.ssmPreApprovalRef}` : ""}
                      {spell.verifiedAt ? `, on file ${formatDate(spell.verifiedAt)}` : ""}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <Separator />

      <section aria-labelledby="follow-ups" className="space-y-3">
        <h2 id="follow-ups" className="text-lg font-semibold">
          Follow-up contact
        </h2>
        {detail.followUps.length === 0 ? (
          <p className="text-muted-foreground text-sm">No follow-up attempts recorded yet.</p>
        ) : (
          <Table>
            <TableCaption>
              Attempts that failed are listed alongside the ones that succeeded. Months are counted
              from job start, not from program exit.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Month</TableHead>
                <TableHead scope="col">Contacted</TableHead>
                <TableHead scope="col">Outcome</TableHead>
                <TableHead scope="col">Reported hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.followUps.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell className="tabular-nums">{followUp.monthsAfterJobStart}</TableCell>
                  <TableCell className="tabular-nums">{formatDate(followUp.contactedOn)}</TableCell>
                  <TableCell>
                    {CONTACT_COPY[followUp.contactOutcome] ?? followUp.contactOutcome}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {followUp.weeklyHours ?? (followUp.employed === false ? "Not employed" : "—")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <Separator />

      <section aria-labelledby="ledger" className="space-y-3">
        <h2 id="ledger" className="text-lg font-semibold">
          Recorded milestones
        </h2>
        {detail.milestones.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nothing recorded against this placement yet. A milestone is written once, with the
            evidence that supported it, so a later correction to a spell does not silently rewrite
            a claim already submitted.
          </p>
        ) : (
          <Table>
            <TableCaption>
              Recorded once each, with the evidence as stated at the time.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Milestone</TableHead>
                <TableHead scope="col">Achieved</TableHead>
                <TableHead scope="col">Weeks</TableHead>
                <TableHead scope="col">Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.milestones.map((milestone) => (
                <TableRow key={milestone.id}>
                  <TableCell className="font-medium">{sourceLabel(milestone.kind)}</TableCell>
                  <TableCell className="tabular-nums">{formatDate(milestone.achievedOn)}</TableCell>
                  <TableCell className="tabular-nums">{milestone.cumulativeWeeks ?? "—"}</TableCell>
                  <TableCell className="text-sm">{milestone.evidenceNote ?? "Not recorded"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
