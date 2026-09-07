import Link from "next/link";

import { DEMO_SHARE_TOKEN, demoPassport } from "@/src/db/demo-passport";
import { GATES, OPPORTUNITIES } from "@/src/db/seed-data";
import { evaluateGate, parseGate } from "@/src/engine/rules";
import { nextStep } from "@/src/engine/routing";
import { buildPersonalView } from "@/src/engine/share";

export default function TrackPage() {
  const now = new Date();
  const snapshot = demoPassport();

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
          what support to offer you, and no employer ever sees it. Attestations are not read from
          the database yet.
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
        <p>
          <Link href={`/share/${DEMO_SHARE_TOKEN}`} className="underline">
            The skills view an employer gets before an offer
          </Link>
        </p>
        <p>
          <Link href={`/share/${DEMO_SHARE_TOKEN}?scope=functional_abilities`} className="underline">
            The functional abilities view, only after a conditional offer
          </Link>
        </p>
        <p>
          <Link href="/access-log" className="underline">
            Who has looked at your record
          </Link>
        </p>
      </section>
    </div>
  );
}
