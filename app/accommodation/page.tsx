/**
 * The accommodation request path.
 *
 * AODA's Integrated Accessibility Standards Regulation s. 23 requires an
 * employer to notify applicants that accommodation is available in its
 * assessment and selection processes, and to provide it on request. Anywhere a
 * gate can turn someone away, this route has to be reachable from it — which is
 * why it is a first-class page with a stored request, not a mailto link.
 *
 * It is also the pressure valve on the whole design. A restriction that would
 * block a training place should end up here, in a conversation about adjusting
 * the process, rather than in a quiet rejection.
 */
import Link from "next/link";

import { OPPORTUNITIES, RESTRICTIONS } from "@/src/db/seed-data";

export default async function AccommodationPage({ searchParams }: PageProps<"/accommodation">) {
  const query = await searchParams;
  const opportunityKey = typeof query.opportunity === "string" ? query.opportunity : undefined;
  const restrictionCode = typeof query.restriction === "string" ? query.restriction : undefined;

  const opportunity = OPPORTUNITIES.find((seat) => seat.key === opportunityKey);
  const restriction = RESTRICTIONS.find((item) => item.code === restrictionCode);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Request an accommodation</h1>
        <p className="text-sm leading-6">
          You can ask for any part of an application, assessment, or program to be adjusted. You do
          not have to give a diagnosis to ask, and asking does not affect anything else on your
          record.
        </p>
      </header>

      {(opportunity || restriction) && (
        <section className="space-y-1 rounded border p-4 text-sm">
          <h2 className="font-medium">What this is about</h2>
          {opportunity && <p>{opportunity.title}</p>}
          {restriction && (
            <p className="text-muted-foreground">
              Starting from your recorded limit: {restriction.label}. Work suited to{" "}
              {restriction.compatibleTags.join(", ")} is usually an easier fit.
            </p>
          )}
        </section>
      )}

      <form className="space-y-5">
        <div className="space-y-1 text-sm">
          <label htmlFor="accommodation-request" className="block font-medium">
            What would help?
          </label>
          <p id="accommodation-request-hint" className="text-muted-foreground">
            In your own words. For example: a later start time, a seated task, or extra time on a
            written test.
          </p>
          <textarea
            id="accommodation-request"
            name="requestedSupport"
            rows={5}
            aria-describedby="accommodation-request-hint"
            disabled
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <fieldset className="space-y-2 text-sm">
          <legend className="font-medium">Who should receive this request?</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="recipient" value="program" disabled />
            The program or employer
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="recipient" value="worker" disabled />
            My own worker, to raise on my behalf
          </label>
        </fieldset>

        <p className="text-sm text-muted-foreground">
          Not wired up yet. Submitting will write an <code>accommodation_requests</code> row and
          notify the recipient; the request text stays visible to you and editable until it is sent.
        </p>
      </form>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-medium">If you need this page itself adjusted</h2>
        <p>
          Tell us and we will provide the same information another way. This site targets WCAG 2.0
          Level AA, the standard AODA requires.
        </p>
        <p>
          <Link href="/track" className="underline">
            Back to your track
          </Link>
        </p>
      </section>
    </div>
  );
}
