import Link from "next/link";

import { CHECK_TYPES, LEVEL_BUNDLES } from "@/src/db/seed-data";
import { LEVEL_NAMES, LEVELS } from "@/src/engine/types";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Readiness passport</h1>
        <p className="text-sm leading-6">
          Health and work readiness on one record. Partners perform the checks; we hold the record,
          route people to the support a check implies, and carry the evidence a funder needs.
          Trampoline does not deliver care, training, or job inventory.
        </p>
        <p className="text-sm leading-6">
          A check that lapses or comes back restricted triggers support. It never closes a job. On
          the hiring side we carry demonstrated skills before an offer, and functional limits with
          an accommodation path after one — never a health verdict and never a score.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Levels</h2>
        <p className="text-sm text-muted-foreground">
          Private to the person. Levels decide what support to offer and let someone see their own
          progress; they are not shown to employers.
        </p>
        <ul className="space-y-1 text-sm">
          {LEVELS.map((level) => (
            <li key={level} className="flex gap-3">
              <span className="w-16 shrink-0 font-mono">L{level}</span>
              <span className="w-28 shrink-0">{LEVEL_NAMES[level]}</span>
              <span className="text-muted-foreground">{LEVEL_BUNDLES[level].join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Check types</h2>
        <ul className="space-y-2 text-sm">
          {CHECK_TYPES.map((check) => (
            <li key={check.key}>
              <span className="font-mono text-xs uppercase text-muted-foreground">
                {check.domain}
              </span>{" "}
              <span className="font-medium">{check.label}</span>
              <span className="text-muted-foreground">
                {" "}
                — valid {check.validityDays} days
                {check.requiresRegulatedAttestor ? ", regulated attestor required" : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-medium">Where things are</h2>
        <p className="text-muted-foreground">
          These routes are scaffolding. The first vertical slice — one user completes a check, opens
          a mocked seat, and the placement is recorded as funder-reportable evidence — is the next
          piece of work.
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <Link href="/intake" className="underline">
              Dual intake
            </Link>{" "}
            — health load and work load on one scale
          </li>
          <li>
            <Link href="/track" className="underline">
              Track
            </Link>{" "}
            — levels, gaps, support offered, and seats
          </li>
          <li>
            <Link href="/attestor" className="underline">
              Attestor
            </Link>{" "}
            — issue or revoke a check
          </li>
          <li>
            <Link href="/share/demo" className="underline">
              Share view
            </Link>{" "}
            — what a school or employer sees
          </li>
          <li>
            <Link href="/accommodation" className="underline">
              Accommodation
            </Link>{" "}
            — ask for a process or a job to be adjusted
          </li>
          <li>
            <Link href="/access-log" className="underline">
              Access log
            </Link>{" "}
            — per-recipient consent, revocable, with every view listed
          </li>
        </ul>
      </section>
    </div>
  );
}
