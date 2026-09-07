import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/src/db";
import { DEMO_COHORT } from "@/src/db/demo-cohort";
import { featuredUserId, passportForUser, shareLinksForUser } from "@/src/db/queries";
import { GATES, OPPORTUNITIES } from "@/src/db/seed-data";
import { evaluateGate, parseGate } from "@/src/engine/rules";
import { nextStep } from "@/src/engine/routing";
import { buildPersonalView } from "@/src/engine/share";

export const dynamic = "force-dynamic";

export default async function TrackPage() {
  const now = new Date();

  // No sign-in yet, so the route shows the featured seeded client — the same
  // person the provider caseload opens with, rather than a separate invention.
  const userId = await featuredUserId(db, DEMO_COHORT[0].email);
  const snapshot = userId ? await passportForUser(db, userId) : null;
  if (!snapshot) notFound();

  const links = await shareLinksForUser(db, userId!);

  const view = buildPersonalView(snapshot, now);
  const step = nextStep(snapshot, now);

  const seats = OPPORTUNITIES.map((seat) => {
    const gateSeed = GATES.find((gate) => gate.key === seat.gateKey);
    if (!gateSeed) throw new Error(`Missing gate for ${seat.key}`);

    const gate = parseGate(gateSeed.definition);
    const verdict = evaluateGate(
      gate,
      { id: seat.key, title: seat.title, tags: seat.tags },
      snapshot,
      now,
    );

    return { seat, gate, verdict };
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Level {view.level} — {view.levelName}
        </h1>
        <p className="text-sm text-muted-foreground">
          This page is yours. Your level is a private routing signal, not a credential: it decides
          what support to offer you, and no employer ever sees it.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Level bundles</h2>
        <ul className="space-y-1 text-sm">
          {view.levelStatuses.map((status) => (
            <li key={status.level} className="flex gap-3">
              <span className="w-10 shrink-0 font-mono">L{status.level}</span>
              <span className="w-20 shrink-0">{status.held ? "held" : "open"}</span>
              <span className="text-muted-foreground">
                {status.missingCheckTypes.length > 0
                  ? `needs ${status.missingCheckTypes.join(", ")}`
                  : status.requiredCheckTypes.join(", ")}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm">{step.headline}</p>
      </section>

      {view.support.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Support available to you</h2>
          <p className="text-sm text-muted-foreground">
            An expired or restricted check triggers an offer of help. It never closes a job to you.
          </p>
          <ul className="space-y-2 text-sm">
            {view.support.map((trigger, index) => (
              <li key={`${trigger.action}-${index}`} className="space-y-1">
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  {trigger.action.replaceAll("_", " ")}
                </span>
                <p>{trigger.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Evidence locker</h2>
        <ul className="space-y-1 text-sm">
          {view.checks.map((check) => (
            <li key={check.checkTypeKey} className="flex flex-wrap gap-3">
              <span className="font-mono text-xs uppercase text-muted-foreground">
                {check.domain}
              </span>
              <span>{check.checkTypeKey}</span>
              <span className="text-muted-foreground">
                expires {check.expiresAt.toISOString().slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Seats</h2>
        {seats.map(({ seat, gate, verdict }) => (
          <div key={seat.key} className="space-y-1 text-sm">
            <p className="font-medium">
              {seat.title} — {verdict.open ? "open" : "not yet"}
            </p>
            <p className="text-muted-foreground">
              {gate.kind === "employment"
                ? "Employment gate: skills and attendance only."
                : "Training gate: may consider a restriction, with a written safety rationale."}{" "}
              Tags {seat.tags.join(", ")}.
            </p>
            {verdict.reasons.map((reason) => (
              <p key={reason} className="text-muted-foreground">
                {reason}
              </p>
            ))}
            {verdict.blockingRestrictions.length > 0 && (
              <p>
                <Link
                  href={`/accommodation?opportunity=${seat.key}&restriction=${verdict.blockingRestrictions[0]}`}
                  className="underline"
                >
                  Request an accommodation for this
                </Link>
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-medium">What others can see</h2>
        <p className="text-muted-foreground">
          Each link carries its own scope. A skills link cannot be widened into a functional
          abilities one by editing the address, so releasing your functional limits is always a
          separate decision you make after a conditional offer.
        </p>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.id}>
              <Link href={`/share/${link.token}`} className="underline">
                {link.scope === "skills"
                  ? "The skills view an employer gets before an offer"
                  : "The functional abilities view, only after a conditional offer"}
              </Link>
              <span className="text-muted-foreground">
                {" "}
                — issued to {link.recipientLabel}, expires{" "}
                {link.expiresAt.toISOString().slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/access-log" className="underline">
            Who has looked at your record
          </Link>
        </p>
      </section>
    </div>
  );
}
