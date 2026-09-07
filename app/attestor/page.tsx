/**
 * Attestor stub. Issuing writes an `attestations` row plus an `issued` event;
 * revoking writes a `revoked` event and never edits the original row.
 */
import { CHECK_TYPES } from "@/src/db/seed-data";

export default function AttestorPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Issue a check</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          For partner attestors. Record the verdict and any restriction — not the findings behind
          it. Medical and mental checks require a regulated attestor.
        </p>
      </header>

      <form className="space-y-5">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Person</span>
          <input
            type="email"
            placeholder="person@example.com"
            disabled
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">Check type</span>
          <select disabled className="w-full rounded border px-3 py-2">
            {CHECK_TYPES.map((check) => (
              <option key={check.key} value={check.key}>
                {check.label} ({check.domain}, {check.validityDays} days)
              </option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-2 text-sm">
          <legend className="font-medium">Verdict</legend>
          {["pass", "restricted", "fail"].map((result) => (
            <label key={result} className="flex items-center gap-2">
              <input type="radio" name="result" value={result} disabled />
              {result}
            </label>
          ))}
        </fieldset>

        <p className="text-sm text-muted-foreground">
          Not wired up yet. Attestor sign-in and the issue and revoke actions land with the vertical
          slice.
        </p>
      </form>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-medium">Published rubrics</h2>
        <ul className="space-y-2">
          {CHECK_TYPES.map((check) => (
            <li key={check.key}>
              <span className="font-medium">{check.label}</span>
              <span className="text-muted-foreground"> — {check.rubricSummary}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
