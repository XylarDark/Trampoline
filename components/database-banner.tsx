/**
 * Tells the operator when the app is running against the fallback database URL.
 *
 * Adopted from Portfolio-Studio, which degrades gracefully when its environment
 * is unconfigured instead of failing at import time. The previous behaviour
 * here was a `console.warn` in `src/db/index.ts`, which nobody sees during a
 * live demo — the first symptom was a white screen and a connection error, in
 * front of the client.
 *
 * Renders nothing when `DATABASE_URL` is set, which is the normal case.
 */
export function DatabaseBanner() {
  if (process.env.DATABASE_URL) return null;

  return (
    <div
      role="status"
      className="border-b border-amber-300 bg-amber-50 px-6 py-2 text-sm text-amber-900 print:hidden dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
    >
      <span className="font-medium">DATABASE_URL is not set.</span> Falling back to the local Docker
      Postgres URL. Run <code className="font-mono">docker compose up -d</code>, then{" "}
      <code className="font-mono">npm run db:migrate &amp;&amp; npm run db:seed</code>.
    </div>
  );
}
