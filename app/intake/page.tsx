/**
 * Dual intake: health load and work load on one scale. This is the connector we
 * own — it carries two scores and nothing narrative, so it never becomes an
 * intake form for a clinic.
 */
const SCALE = [
  { value: 0, label: "0 — in crisis" },
  { value: 1, label: "1 — unstable" },
  { value: 2, label: "2 — managing" },
  { value: 3, label: "3 — steady" },
  { value: 4, label: "4 — can take more" },
];

export default function IntakePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Dual intake</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Two scores on one scale, so health load and work load can be read together. No notes, no
          diagnoses.
        </p>
      </header>

      <form className="space-y-6">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Health load right now</legend>
          {SCALE.map((step) => (
            <label key={`health-${step.value}`} className="flex items-center gap-2 text-sm">
              <input type="radio" name="healthLoad" value={step.value} disabled />
              {step.label}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Work load right now</legend>
          {SCALE.map((step) => (
            <label key={`work-${step.value}`} className="flex items-center gap-2 text-sm">
              <input type="radio" name="workLoad" value={step.value} disabled />
              {step.label}
            </label>
          ))}
        </fieldset>

        <p className="text-sm text-muted-foreground">
          Submission is not wired up yet. The dual_intakes table is in place; the vertical slice
          connects this form to it.
        </p>
      </form>
    </div>
  );
}
