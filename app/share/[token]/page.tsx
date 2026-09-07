/**
 * The view a school or employer opens.
 *
 * Two scopes, and the difference matters legally. The default `skills` scope is
 * what a hiring employer sees before an offer: demonstrated skills and nothing
 * else, because pre-offer medical inquiry is presumptively unlawful in Ontario.
 * The `functional_abilities` scope is released by the person after a
 * conditional offer and carries functional limits with an accommodation path —
 * never a diagnosis, never a pass or fail, never a level.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/src/db";
import { passportForUser, shareLinkByToken } from "@/src/db/queries";
import { buildEmploymentShareView, buildFunctionalAbilitiesView } from "@/src/engine/share";

export const dynamic = "force-dynamic";

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export default async function SharePage({ params, searchParams }: PageProps<"/share/[token]">) {
  const { token } = await params;
  const query = await searchParams;

  // Unknown, expired, and revoked all resolve to null and all render a 404.
  // An expired link must not explain that it was once valid, since that alone
  // confirms a person is on the system to whoever holds the URL.
  const link = await shareLinkByToken(db, token);
  if (!link) notFound();

  const snapshot = await passportForUser(db, link.userId);
  if (!snapshot) notFound();

  // The link's own scope is the ceiling. A query parameter can ask for the
  // narrower skills view but can never widen a skills link into a functional
  // abilities one, which is the whole point of scoping the token.
  const postOffer =
    link.scope === "functional_abilities" && query.scope !== "skills";
  const now = new Date();

  // Writing the `share_access_log` row lands with the write paths. The read
  // here is deliberately side-effect free until that write is authenticated.

  if (postOffer) {
    const view = buildFunctionalAbilitiesView(snapshot, now);

    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Functional abilities · released after a conditional offer
          </p>
          <h1 className="text-2xl font-semibold">Conditions for doing the work</h1>
          <p className="text-sm text-muted-foreground">
            Issued to {link.recipientLabel}. This link stops working on {formatDate(link.expiresAt)}.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Functional limits</h2>
          {view.restrictions.length === 0 ? (
            <p className="text-sm text-muted-foreground">None recorded.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {view.restrictions.map((restriction) => (
                <li key={restriction.code}>
                  <span className="font-medium">{restriction.label}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    — suited to {restriction.compatibleTags.join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {view.reassessOn && (
            <p className="text-sm text-muted-foreground">
              The issuing clinician expected to reassess by {formatDate(view.reassessOn)}. That is a
              review date, not a deadline on this person&apos;s employment.
            </p>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">If a limit affects an essential duty</h2>
          <p className="text-sm">
            <Link href={view.accommodationRequestPath} className="underline">
              Start an accommodation discussion
            </Link>
          </p>
        </section>

        <p className="text-xs text-muted-foreground">{view.notice}</p>
      </div>
    );
  }

  const view = buildEmploymentShareView(snapshot, now);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase text-muted-foreground">
          Demonstrated skills · shared by the person
        </p>
        <h1 className="text-2xl font-semibold">Verified skills checks</h1>
        <p className="text-sm text-muted-foreground">
          Issued to {link.recipientLabel}. This link stops working on {formatDate(link.expiresAt)}.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Current checks</h2>
        {view.checks.length === 0 ? (
          <p className="text-sm text-muted-foreground">None current.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {view.checks.map((check) => (
              <li key={check.checkTypeKey} className="flex flex-wrap gap-3">
                <span>{check.checkTypeKey}</span>
                <span className="text-muted-foreground">
                  valid to {formatDate(check.expiresAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {view.earliestExpiry && (
          <p className="text-sm text-muted-foreground">
            The earliest of these lapses on {formatDate(view.earliestExpiry)}.
          </p>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Accommodation</h2>
        <p className="text-sm">
          If any part of your assessment or selection process needs to be adjusted for this
          candidate,{" "}
          <Link href="/accommodation" className="underline">
            request an accommodation
          </Link>
          .
        </p>
      </section>

      <p className="text-xs text-muted-foreground">{view.notice}</p>
    </div>
  );
}
