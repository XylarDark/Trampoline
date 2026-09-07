/**
 * The provider caseload: every placement, every IES checkpoint, and one number
 * at the top saying how much of it is earned and unprovable.
 *
 * `force-dynamic` because this reads Postgres directly rather than through
 * `fetch`, so Next has nothing to key a cache on and would otherwise try to
 * prerender the route at build time, when no database exists. Next 16 without
 * the `cacheComponents` flag uses the classic model documented in
 * `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`.
 */
import Link from "next/link";

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
import { caseload } from "@/src/db/queries";
import {
  CUMULATIVE_ASSUMPTION_NOTE,
  FUNDED_OUTCOME_MIN_WEEKLY_HOURS,
  IES_CHECKPOINT_MONTHS,
  caseloadSummary,
  placementCheckpoints,
} from "@/src/engine/outcomes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Provider caseload — Trampoline",
  description: "IES funded-outcome checkpoints across a caseload, with the evidence gap named.",
};

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function ProviderCaseloadPage() {
  const rows = await caseload(db);
  const now = new Date();
  const summary = caseloadSummary(rows, now);

  const derived = rows.map((row) => ({
    ...row,
    checkpoints: placementCheckpoints(row.placement, row.spells, now),
  }));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Provider caseload</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Integrated Employment Services funded-outcome checkpoints at {IES_CHECKPOINT_MONTHS.join(", ")}{" "}
          months after job start. A funded outcome needs an average of{" "}
          {FUNDED_OUTCOME_MIN_WEEKLY_HOURS}-plus hours per week at general minimum wage or better,
          evidenced by a document the funder accepts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Earned, not provable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tabular-nums">{summary.earnedNotProvable}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Checkpoints where the person worked the hours and the evidence on file will not
              support a claim. Subsidized checkpoints are excluded, because no document fixes those.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Claimable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tabular-nums">{summary.claimable}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Hours, wage, and acceptable evidence all in place.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Checkpoints reached</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tabular-nums">{summary.checkpointsDue}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Across {summary.placements} placements. Future checkpoints are excluded.
            </p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableCaption>
          One row per placement. Select a name for the evidence timeline behind each verdict.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Client</TableHead>
            <TableHead scope="col">Employer</TableHead>
            {IES_CHECKPOINT_MONTHS.map((month) => (
              <TableHead key={month} scope="col">
                Month {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {derived.map((row) => (
            <TableRow key={row.placement.id}>
              <TableCell>
                <Link href={`/provider/${row.placement.id}`} className="font-medium underline">
                  {row.clientName}
                </Link>
                <span className="text-muted-foreground block text-xs">
                  {row.jobTitle}, started {formatDate(row.placement.startedOn)}
                  {row.endedOn ? `, ended ${formatDate(row.endedOn)}` : ""}
                </span>
              </TableCell>
              <TableCell className="text-sm">{row.employerName ?? "Not recorded"}</TableCell>
              {row.checkpoints.map((checkpoint) => (
                <TableCell key={checkpoint.month}>
                  <StatusBadge status={checkpoint.status} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Separator />

      <section aria-labelledby="caveats" className="max-w-2xl space-y-4 text-sm">
        <h2 id="caveats" className="text-base font-semibold">
          What this screen does not know
        </h2>

        <div className="space-y-1">
          <h3 className="font-medium">Cumulative weeks across a gap</h3>
          <p className="text-muted-foreground">{CUMULATIVE_ASSUMPTION_NOTE}</p>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium">How much a checkpoint is worth</h3>
          <p className="text-muted-foreground">
            No dollar figure or performance weighting appears anywhere on this screen. The
            Integrated Employment Services performance-management weightings are not published,
            so any percentage here would be invented. Ask your Service System Manager for your
            contract&apos;s figures.
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium">The benefits cliff, which this does not solve</h3>
          <p className="text-muted-foreground">
            The 20-hour threshold above collides with ODSP&apos;s claw-back of 75 cents on every
            dollar earned over $1,000 a month. For a client on income support, the hours that make
            a checkpoint payable to you can leave them worse off. Trampoline records the outcome; it
            does not change that arithmetic, and a caseworker still has to have that conversation.
          </p>
        </div>
      </section>
    </div>
  );
}
