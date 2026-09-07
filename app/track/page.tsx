import { DEMO_SHARE_TOKEN, demoPassport } from "@/src/db/demo-passport";
import { OPPORTUNITIES, UNLOCK_RULES } from "@/src/db/seed-data";
import { currentByCheckType } from "@/src/engine/decay";
import { computeLevel, levelStatuses, nextLevelGap } from "@/src/engine/levels";
import { evaluateUnlock, parseUnlockRule } from "@/src/engine/rules";
import { LEVEL_NAMES } from "@/src/engine/types";
import Link from "next/link";

export default function TrackPage() {
  const now = new Date();
  const snapshot = demoPassport();

  const level = computeLevel(snapshot.attestations, snapshot.levelRequirements, now);
  const statuses = levelStatuses(snapshot.attestations, snapshot.levelRequirements, now);
  const gap = nextLevelGap(snapshot.attestations, snapshot.levelRequirements, now);
  const current = [...currentByCheckType(snapshot.attestations, now).values()];

  const gates = OPPORTUNITIES.map((seat) => {
    const ruleSeed = UNLOCK_RULES.find((rule) => rule.key === seat.unlockRuleKey);
    if (!ruleSeed) throw new Error(`Missing gate for ${seat.key}`);

    const verdict = evaluateUnlock(
      parseUnlockRule(ruleSeed.definition),
      {
        id: seat.key,
        title: seat.title,
        targetLevel: seat.targetLevel,
        tags: seat.tags,
      },
      snapshot,
      now,
    );

    return { seat, verdict };
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Level {level} — {LEVEL_NAMES[level]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Placeholder passport, computed by the rules engine. Attestations are not read from the
          database yet.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Level bundles</h2>
        <ul className="space-y-1 text-sm">
          {statuses.map((status) => (
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
        {gap.nextLevel !== null && (
          <p className="text-sm">
            Next: Level {gap.nextLevel} needs {gap.missingCheckTypes.join(", ") || "a hold period"}.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Evidence locker</h2>
        <ul className="space-y-1 text-sm">
          {current.map((attestation) => (
            <li key={attestation.id} className="flex flex-wrap gap-3">
              <span className="font-mono text-xs uppercase text-muted-foreground">
                {attestation.domain}
              </span>
              <span>{attestation.checkTypeKey}</span>
              <span className="text-muted-foreground">
                {attestation.result} · expires {attestation.expiresAt.toISOString().slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Gated opportunities</h2>
        {gates.map(({ seat, verdict }) => (
          <div key={seat.key} className="space-y-1 text-sm">
            <p className="font-medium">
              {seat.title} — {verdict.unlocked ? "unlocked" : "locked"}
            </p>
            <p className="text-muted-foreground">
              Level {seat.targetLevel} gate · tags {seat.tags.join(", ")}
            </p>
            {verdict.reasons.map((reason) => (
              <p key={reason} className="text-muted-foreground">
                {reason}
              </p>
            ))}
          </div>
        ))}
      </section>

      <p className="text-sm">
        <Link href={`/share/${DEMO_SHARE_TOKEN}`} className="underline">
          See what a school or employer would see
        </Link>
      </p>
    </div>
  );
}
