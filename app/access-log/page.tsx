/**
 * Consent and the access log.
 *
 * Consent under PIPEDA and PHIPA has to be specific and withdrawable, which a
 * single "share my passport" toggle is not. Each recipient gets its own link
 * with its own scope and its own expiry, the person can revoke any of them, and
 * every view is written to `share_access_log` and shown back here. If someone
 * cannot see who looked at their record, the consent was nominal.
 */
import Link from "next/link";

const DEMO_LINKS = [
  {
    id: "demo-skills",
    recipientLabel: "Example Distribution Co. (hiring)",
    scope: "skills" as const,
    createdOn: "2026-08-24",
    expiresOn: "2026-09-23",
    revokedOn: null,
    views: [
      { viewedAt: "2026-08-25 09:14", scopeServed: "skills" as const },
      { viewedAt: "2026-08-28 16:02", scopeServed: "skills" as const },
    ],
  },
  {
    id: "demo-functional",
    recipientLabel: "Example Distribution Co. (after conditional offer)",
    scope: "functional_abilities" as const,
    createdOn: "2026-09-02",
    expiresOn: "2026-09-16",
    revokedOn: null,
    views: [{ viewedAt: "2026-09-02 11:40", scopeServed: "functional_abilities" as const }],
  },
  {
    id: "demo-revoked",
    recipientLabel: "Example Employment Agency",
    scope: "skills" as const,
    createdOn: "2026-07-11",
    expiresOn: "2026-08-10",
    revokedOn: "2026-07-30",
    views: [],
  },
];

const SCOPE_LABELS: Record<"skills" | "functional_abilities" | "personal", string> = {
  skills: "Demonstrated skills only",
  functional_abilities: "Functional limits, after a conditional offer",
  personal: "Your full record",
};

export default function AccessLogPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Who can see your record</h1>
        <p className="text-sm leading-6">
          One link per recipient, each with its own scope and expiry date. You can revoke any of
          them at any time, and every view is listed below. Placeholder data; the lookup against{" "}
          <code>share_links</code> and <code>share_access_log</code> lands with the vertical slice.
        </p>
      </header>

      {DEMO_LINKS.map((link) => (
        <section key={link.id} className="space-y-2 rounded border p-4 text-sm">
          <h2 className="text-base font-medium">{link.recipientLabel}</h2>
          <dl className="space-y-1">
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-muted-foreground">Shares</dt>
              <dd>{SCOPE_LABELS[link.scope]}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-muted-foreground">Created</dt>
              <dd>{link.createdOn}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-muted-foreground">Status</dt>
              <dd>
                {link.revokedOn
                  ? `Revoked by you on ${link.revokedOn}`
                  : `Active until ${link.expiresOn}`}
              </dd>
            </div>
          </dl>

          <h3 className="pt-2 font-medium">Views</h3>
          {link.views.length === 0 ? (
            <p className="text-muted-foreground">Never opened.</p>
          ) : (
            <ul className="space-y-1">
              {link.views.map((view) => (
                <li key={view.viewedAt} className="flex flex-wrap gap-3">
                  <span>{view.viewedAt}</span>
                  <span className="text-muted-foreground">{SCOPE_LABELS[view.scopeServed]}</span>
                </li>
              ))}
            </ul>
          )}

          {!link.revokedOn && (
            <button
              type="button"
              disabled
              className="rounded border px-3 py-2 font-medium disabled:opacity-60"
            >
              Revoke this link
            </button>
          )}
        </section>
      ))}

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-medium">What is never shared</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Your mental health checks, to anyone on the hiring side, in any form.</li>
          <li>Your level, which is a private routing signal rather than a credential.</li>
          <li>Any rubric finding, clinical note, or reason behind a verdict.</li>
        </ul>
        <p>
          <Link href="/track" className="underline">
            Back to your track
          </Link>
        </p>
      </section>
    </div>
  );
}
