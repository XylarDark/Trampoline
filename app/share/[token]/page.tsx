/**
 * The share view a school or employer opens. Readiness, restrictions, expiry.
 * No diagnoses, no rubric findings, no check history.
 */
import { DEMO_SHARE_TOKEN, demoPassport } from "@/src/db/demo-passport";
import { buildShareView } from "@/src/engine/share";
import { LEVEL_NAMES } from "@/src/engine/types";
import { notFound } from "next/navigation";

export default async function SharePage({ params }: PageProps<"/share/[token]">) {
  const { token } = await params;

  // Token lookup against `share_links` lands with the vertical slice.
  if (token !== DEMO_SHARE_TOKEN) notFound();

  const now = new Date();
  const view = buildShareView(demoPassport(), now);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase text-muted-foreground">Readiness passport</p>
        <h1 className="text-2xl font-semibold">
          Level {view.level} — {view.levelName}
        </h1>
        {view.nextLevel !== null && (
          <p className="text-sm text-muted-foreground">
            Working toward Level {view.nextLevel} ({LEVEL_NAMES[view.nextLevel]}).
          </p>
        )}
        {view.applicationsPaused && (
          <p className="text-sm">Applications are paused while a health check is renewed.</p>
        )}
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Restrictions</h2>
        {view.restrictions.length === 0 ? (
          <p className="text-sm text-muted-foreground">None recorded.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {view.restrictions.map((restriction) => (
              <li key={restriction.code}>
                <span className="font-medium">{restriction.label}</span>
                <span className="text-muted-foreground">
                  {" "}
                  — compatible with {restriction.compatibleTags.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Current checks</h2>
        <ul className="space-y-1 text-sm">
          {view.checks.map((check) => (
            <li key={check.checkTypeKey} className="flex flex-wrap gap-3">
              <span className="font-mono text-xs uppercase text-muted-foreground">
                {check.domain}
              </span>
              <span className="text-muted-foreground">
                valid to {check.expiresAt.toISOString().slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
        {view.earliestExpiry && (
          <p className="text-sm text-muted-foreground">
            This view goes stale on {view.earliestExpiry.toISOString().slice(0, 10)} unless the
            person renews.
          </p>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Shows readiness, restrictions, and expiry only. Trampoline does not share diagnoses,
        clinical notes, or assessment detail.
      </p>
    </div>
  );
}
