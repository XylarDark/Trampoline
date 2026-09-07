import Link from "next/link";

import { CHECK_TYPES, LEVEL_BUNDLES } from "@/src/db/seed-data";
import { LEVEL_NAMES, LEVELS } from "@/src/engine/types";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Readiness passport</h1>
        <p className="text-sm leading-6">
          Health and work readiness on one record. Partners perform the checks; the passport carries
          the level, the restrictions, and the expiry date. Trampoline does not deliver care,
          training, or job inventory.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Levels</h2>
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
          These routes are scaffolding. The first vertical slice — one user completes a check, levels
          up, and unlocks a mocked seat — is the next piece of work.
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
            — levels, gaps, and gated opportunities
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
        </ul>
      </section>
    </div>
  );
}
