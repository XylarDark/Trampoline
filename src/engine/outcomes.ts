/**
 * Outcome milestone derivation: turn a fragmentary employment history into the
 * milestones an Ontario funder will actually settle on, and say plainly why any
 * given milestone is not payable yet.
 *
 * Governed by `docs/outreach/ontario-outcome-framework.md`. Read it before
 * changing a threshold here. Four rules from that file are load-bearing:
 *
 *  1. Checkpoints are at 1, 3, 6, and 12 months **after job start**, not after
 *     program exit.
 *  2. The threshold is 20-plus hours per week at or above general minimum wage.
 *     The directive words it as an *average*, but this module assesses it at a
 *     point in time — the hours on the spells covering the checkpoint date —
 *     because that is what `CUMULATIVE_AGGREGATION` below decided and the only
 *     reading the documented evidence test supports. Concurrent spells are
 *     summed; nothing is averaged over elapsed time.
 *  3. **Client self-report is not acceptable evidence at all**, and a provider
 *     attestation needs Service System Manager pre-approval. Evidence is
 *     attributed per spell: a document proves the spell it covers and no other.
 *  4. A **subsidized** placement earns nothing until it is unsubsidized at a
 *     checkpoint.
 *
 * This module is pure: no database imports, no clock of its own. Every function
 * takes `now` so the provider screens and the tests see the same arithmetic.
 */

/**
 * IES funded-outcome checkpoints, in months after job start.
 *
 * Data rather than literals because the interviews may correct them, and
 * because the legacy ODSP framework uses an entirely different set. Changing
 * this array changes the engine, the caseload columns, and the evidence pack
 * together.
 */
export const IES_CHECKPOINT_MONTHS = [1, 3, 6, 12] as const;
export type IesCheckpointMonth = (typeof IES_CHECKPOINT_MONTHS)[number];

/** Average weekly hours a funded outcome requires. */
export const FUNDED_OUTCOME_MIN_WEEKLY_HOURS = 20;

/**
 * Ontario general minimum wage, in dollars per hour.
 *
 * Here so a wage below it can be flagged rather than silently passing. This is
 * a rate that changes annually by regulation; confirm before any real claim.
 */
export const GENERAL_MINIMUM_WAGE = 17.6;

/**
 * How cumulative coverage is aggregated across **non-consecutive** spells.
 *
 * NO PUBLIC DIRECTIVE DEFINES THIS. It is open question 3 in
 * `docs/outreach/ontario-outcome-framework.md`, and it is the single assumption
 * in this module that we cannot source. Two readings are defensible:
 *
 *  - `continuous_at_checkpoint` — only hours in a spell covering the checkpoint
 *    date count, so a gap before the checkpoint is irrelevant as long as the
 *    person is working on the day itself.
 *  - `weighted_since_start` — hours are averaged across the whole window from
 *    job start to the checkpoint, so a gap dilutes the average.
 *
 * We default to `continuous_at_checkpoint` because the documented evidence test
 * is a document *covering the checkpoint date* (an employment letter or a pay
 * stub for that period), which implies the checkpoint is assessed at a point in
 * time rather than over the whole elapsed window.
 *
 * That is an inference, not a rule. It must be shown to the user as an
 * assumption, never as fact — see `CUMULATIVE_ASSUMPTION_NOTE`.
 */
export const CUMULATIVE_AGGREGATION: "continuous_at_checkpoint" | "weighted_since_start" =
  "continuous_at_checkpoint";

/** Displayed wherever a derived milestone is shown. Do not delete on tidy-up. */
export const CUMULATIVE_ASSUMPTION_NOTE =
  "No public directive defines how cumulative hours aggregate across non-consecutive weeks. " +
  "This view assumes a checkpoint is assessed on the spell covering that date, because the " +
  "required evidence is a document covering the checkpoint date. Confirm with your Service " +
  "System Manager before submitting a claim.";

/**
 * Evidence sources, mirroring `verificationSourceEnum` in the schema.
 *
 * Kept as a local literal union rather than imported from the schema so this
 * module stays free of database imports and testable without a connection.
 */
export type VerificationSource =
  | "offer_letter"
  | "initial_pay_stub"
  | "pay_stub"
  | "employment_letter"
  | "provider_attestation"
  | "client_self_report";

/** Sources the funder accepts outright. */
const ACCEPTABLE_SOURCES: readonly VerificationSource[] = [
  "offer_letter",
  "initial_pay_stub",
  "pay_stub",
  "employment_letter",
];

/**
 * `not_collected` is the common case and the reason this product exists: the
 * caseworker knows which document would prove the checkpoint and does not have
 * it. The source is acceptable; the paper is not on file.
 */
export type EvidenceStatus =
  | "acceptable"
  | "not_collected"
  | "needs_preapproval"
  | "not_acceptable";

/**
 * A continuous stretch of work at known hours. Mirrors `employmentSpells`.
 *
 * `periodEnd: null` means ongoing. Hours are a number here rather than the
 * schema's numeric string, so callers convert at the boundary.
 */
export type SpellSnapshot = {
  id: string;
  periodStart: Date;
  periodEnd: Date | null;
  weeklyHours: number;
  hourlyWage: number | null;
  subsidized: boolean;
  verificationSource: VerificationSource;
  /** Null means the document is identified but not yet in hand. */
  verifiedAt: Date | null;
  ssmPreApprovalRef: string | null;
};

/** Mirrors the parts of `placements` the derivation needs. */
export type PlacementSnapshot = {
  id: string;
  startedOn: Date;
  endedOn: Date | null;
  primaryJob: boolean;
  /**
   * True when the client was already working 20-plus hours at intake. The
   * funded outcome then requires 20-plus hours with a *new* employer, so this
   * changes the verdict rather than decorating it.
   */
  enteredEmployedFullHours: boolean;
  /** Set when this placement is with the same employer the person entered on. */
  sameEmployerAsEntry: boolean;
};

/**
 * Why a checkpoint is or is not payable. Ordered loosely by how far the
 * provider is from being able to claim, but consumers must switch on the tag
 * rather than compare order.
 */
export type MilestoneStatus =
  /**
   * Hours met, evidence acceptable, nothing blocking. Claim it.
   *
   * `weeklyHours` is hours *worked* at the checkpoint, consistent with every
   * other tag. It means at least the threshold is evidenced, not that every
   * worked hour is — `provableHours` is the number the documents cover.
   */
  | { tag: "claimable"; weeklyHours: number; evidenceSource: VerificationSource }
  /** The checkpoint date has not arrived. */
  | { tag: "not_due_yet"; dueOn: Date }
  /** No spell covers the checkpoint date at all. */
  | { tag: "no_employment"; dueOn: Date }
  /** Working, but under the average-hours threshold. */
  | { tag: "below_threshold"; weeklyHours: number; shortfall: number }
  /** Hours met but the wage is under general minimum wage. */
  | { tag: "below_minimum_wage"; hourlyWage: number }
  /** Hours met, but nothing on file evidences the checkpoint. */
  | { tag: "evidence_missing"; weeklyHours: number }
  /** Hours met, but the only evidence is a source the funder rejects. */
  | { tag: "evidence_unacceptable"; weeklyHours: number; source: VerificationSource }
  /** Provider attestation on file without the required SSM pre-approval. */
  | { tag: "needs_preapproval"; weeklyHours: number }
  /** Hours met but the employer is still receiving financial supports. */
  | { tag: "subsidized_not_payable"; weeklyHours: number }
  /** Threshold met only by summing concurrent jobs, which is capped per catchment. */
  | { tag: "stacking_uncounted"; weeklyHours: number; spellCount: number }
  /** Entered already working 20-plus hours, so this employer cannot count. */
  | { tag: "needs_new_employer" };

/** A derived checkpoint: the month, its date, and the verdict. */
export type CheckpointResult = {
  month: IesCheckpointMonth;
  dueOn: Date;
  status: MilestoneStatus;
};

/**
 * Add whole months to a date, clamping to the end of a shorter target month.
 *
 * A job starting 31 January has no 31 February checkpoint. Naive date
 * arithmetic silently rolls that into March and moves the checkpoint a day or
 * three, which shifts a funder deadline.
 */
export function addMonths(from: Date, months: number): Date {
  const result = new Date(from.getTime());
  const targetMonth = result.getUTCMonth() + months;
  const dayOfMonth = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(targetMonth);

  const daysInTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();

  result.setUTCDate(Math.min(dayOfMonth, daysInTargetMonth));
  return result;
}

/** The four IES checkpoint dates for a placement, measured from job start. */
export function checkpointDates(startedOn: Date): { month: IesCheckpointMonth; dueOn: Date }[] {
  return IES_CHECKPOINT_MONTHS.map((month) => ({
    month,
    dueOn: addMonths(startedOn, month),
  }));
}

/** Whether a spell covers a date. Half-open: start inclusive, end exclusive. */
export function spellCoversDate(spell: SpellSnapshot, date: Date): boolean {
  if (spell.periodStart.getTime() > date.getTime()) return false;
  if (!spell.periodEnd) return true;
  return spell.periodEnd.getTime() > date.getTime();
}

/** Spells covering a checkpoint date. More than one means concurrent jobs. */
export function spellsAtDate(spells: SpellSnapshot[], date: Date): SpellSnapshot[] {
  return spells.filter((spell) => spellCoversDate(spell, date));
}

/**
 * Average weekly hours credited at a date.
 *
 * Concurrent spells are summed, because job stacking is what the funder counts
 * when it counts at all. Whether stacking is *allowed* is a separate question
 * answered by `milestoneStatus`, since the 5% cap is per catchment and cannot
 * be decided from one person's record.
 */
export function hoursAtCheckpoint(spells: SpellSnapshot[], date: Date): number {
  return spellsAtDate(spells, date).reduce((total, spell) => total + spell.weeklyHours, 0);
}

/**
 * Cumulative weeks worked from job start to a date, counting only time actually
 * covered by a spell. Gaps do not count, and concurrent spells are not double
 * counted, so this is union coverage rather than a sum of spell lengths.
 */
export function cumulativeWeeks(spells: SpellSnapshot[], from: Date, to: Date): number {
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const windowStart = from.getTime();
  const windowEnd = to.getTime();
  if (windowEnd <= windowStart) return 0;

  const intervals = spells
    .map((spell) => ({
      start: Math.max(spell.periodStart.getTime(), windowStart),
      end: Math.min(spell.periodEnd?.getTime() ?? windowEnd, windowEnd),
    }))
    .filter((interval) => interval.end > interval.start)
    .sort((a, b) => a.start - b.start);

  let covered = 0;
  let cursor = Number.NEGATIVE_INFINITY;

  for (const interval of intervals) {
    const start = Math.max(interval.start, cursor);
    if (interval.end > start) {
      covered += interval.end - start;
      cursor = interval.end;
    }
  }

  return Number((covered / MS_PER_WEEK).toFixed(2));
}

/**
 * Whether a single spell's verification source would satisfy the funder.
 *
 * `client_self_report` is not merely weak, it is absent from the list of
 * acceptable evidence — which is the entire business case for this product.
 */
export function evidenceStatus(spell: SpellSnapshot): EvidenceStatus {
  if (ACCEPTABLE_SOURCES.includes(spell.verificationSource)) {
    return spell.verifiedAt ? "acceptable" : "not_collected";
  }
  if (spell.verificationSource === "provider_attestation") {
    return spell.ssmPreApprovalRef ? "acceptable" : "needs_preapproval";
  }
  return "not_acceptable";
}

/** Evidence problems, hardest to fix last. Only used to break ties. */
const EVIDENCE_SEVERITY: readonly EvidenceStatus[] = [
  "acceptable",
  "not_collected",
  "needs_preapproval",
  "not_acceptable",
];

/**
 * Hours a funder would actually credit: those on spells whose document is
 * already acceptable.
 *
 * A document proves the spell it covers and no other. Summing every covering
 * spell and then reporting the single best document anywhere in the set let an
 * eight-hour employment letter certify twenty-four hours backed only by the
 * client's word — an unsupportable claim against the provider's own contract,
 * and precisely the failure this engine exists to prevent.
 */
export function provableHours(spells: SpellSnapshot[]): number {
  return Number(
    spells
      .filter((spell) => evidenceStatus(spell) === "acceptable")
      .reduce((total, spell) => total + spell.weeklyHours, 0)
      .toFixed(2),
  );
}

type EvidenceProblem = Exclude<EvidenceStatus, "acceptable">;

/**
 * The blocker standing in front of the largest block of unprovable hours.
 *
 * Ranked by hours rather than by severity, because the provider's next action
 * is whichever document unlocks the most hours. Severity only breaks ties.
 *
 * No public directive says which disqualifier a Service System Manager records
 * when several apply to one checkpoint, so this precedence is ours — see the
 * open questions in `docs/outreach/ontario-outcome-framework.md`.
 */
function blockingEvidence(
  spells: SpellSnapshot[],
): { status: EvidenceProblem; spell: SpellSnapshot } | null {
  const unproven = spells
    .map((spell) => ({ status: evidenceStatus(spell), spell }))
    .filter(
      (entry): entry is { status: EvidenceProblem; spell: SpellSnapshot } =>
        entry.status !== "acceptable",
    );

  if (unproven.length === 0) return null;

  return unproven.reduce((worst, entry) => {
    if (entry.spell.weeklyHours !== worst.spell.weeklyHours) {
      return entry.spell.weeklyHours > worst.spell.weeklyHours ? entry : worst;
    }
    return EVIDENCE_SEVERITY.indexOf(entry.status) > EVIDENCE_SEVERITY.indexOf(worst.status)
      ? entry
      : worst;
  });
}

/**
 * Derive one checkpoint verdict.
 *
 * Order matters and encodes the funder's own precedence. A subsidized
 * placement is reported as subsidized rather than as an evidence problem,
 * because chasing a pay stub for it would be wasted work — which is exactly
 * the waste this product exists to prevent.
 */
export function milestoneStatus(
  placement: PlacementSnapshot,
  spells: SpellSnapshot[],
  checkpoint: { month: IesCheckpointMonth; dueOn: Date },
  now: Date = new Date(),
): MilestoneStatus {
  const { dueOn } = checkpoint;

  if (dueOn.getTime() > now.getTime()) return { tag: "not_due_yet", dueOn };

  // Entry state is decided before anything else: if the client was already
  // working full hours and this is the same employer, no amount of hours or
  // evidence makes it a funded outcome.
  if (placement.enteredEmployedFullHours && placement.sameEmployerAsEntry) {
    return { tag: "needs_new_employer" };
  }

  const covering = spellsAtDate(spells, dueOn);
  if (covering.length === 0) return { tag: "no_employment", dueOn };

  const weeklyHours = Number(
    covering.reduce((total, spell) => total + spell.weeklyHours, 0).toFixed(2),
  );

  if (weeklyHours < FUNDED_OUTCOME_MIN_WEEKLY_HOURS) {
    return {
      tag: "below_threshold",
      weeklyHours,
      shortfall: Number((FUNDED_OUTCOME_MIN_WEEKLY_HOURS - weeklyHours).toFixed(2)),
    };
  }

  // Subsidized work earns nothing, so report that before sending anyone to
  // collect documents for it.
  if (covering.some((spell) => spell.subsidized)) {
    return { tag: "subsidized_not_payable", weeklyHours };
  }

  // Threshold reached only by summing concurrent jobs. Permitted for up to 5%
  // of clients per catchment, which is a cap we cannot evaluate from one
  // record — so flag rather than count.
  const singleSpellMeetsThreshold = covering.some(
    (spell) => spell.weeklyHours >= FUNDED_OUTCOME_MIN_WEEKLY_HOURS,
  );
  if (covering.length > 1 && !singleSpellMeetsThreshold) {
    return { tag: "stacking_uncounted", weeklyHours, spellCount: covering.length };
  }

  const wage = covering.find((spell) => spell.hourlyWage !== null)?.hourlyWage ?? null;
  if (wage !== null && wage < GENERAL_MINIMUM_WAGE) {
    return { tag: "below_minimum_wage", hourlyWage: wage };
  }

  // Only evidenced hours can carry a claim. Worked hours still decide whether
  // the outcome was *earned*, which is the number `earnedNotProvable` reports:
  // the person did the work, and the paper is what is missing.
  if (provableHours(covering) < FUNDED_OUTCOME_MIN_WEEKLY_HOURS) {
    const blocker = blockingEvidence(covering);
    if (!blocker || blocker.status === "not_collected") {
      return { tag: "evidence_missing", weeklyHours };
    }
    if (blocker.status === "needs_preapproval") {
      return { tag: "needs_preapproval", weeklyHours };
    }
    return { tag: "evidence_unacceptable", weeklyHours, source: blocker.spell.verificationSource };
  }

  // Non-empty because the threshold above is only reachable with one.
  const proven = covering
    .filter((spell) => evidenceStatus(spell) === "acceptable")
    .reduce((most, spell) => (spell.weeklyHours > most.weeklyHours ? spell : most));

  return {
    tag: "claimable",
    weeklyHours,
    evidenceSource: proven.verificationSource,
  };
}

/** Every checkpoint for one placement. */
export function placementCheckpoints(
  placement: PlacementSnapshot,
  spells: SpellSnapshot[],
  now: Date = new Date(),
): CheckpointResult[] {
  return checkpointDates(placement.startedOn).map((checkpoint) => ({
    month: checkpoint.month,
    dueOn: checkpoint.dueOn,
    status: milestoneStatus(placement, spells, checkpoint, now),
  }));
}

/**
 * Statuses where the work was done but the money is not collectable yet, and a
 * document would fix it.
 *
 * `subsidized_not_payable` is deliberately excluded: no document changes it, so
 * counting it as recoverable would overstate what the provider can act on.
 */
const RECOVERABLE_TAGS: readonly MilestoneStatus["tag"][] = [
  "evidence_missing",
  "evidence_unacceptable",
  "needs_preapproval",
];

export type CaseloadSummary = {
  placements: number;
  checkpointsDue: number;
  claimable: number;
  /** Hours met, blocked only by paperwork. The number that sells the product. */
  earnedNotProvable: number;
  byTag: Record<MilestoneStatus["tag"], number>;
};

/** Totals across a caseload, for the provider screen headline. */
export function caseloadSummary(
  rows: { placement: PlacementSnapshot; spells: SpellSnapshot[] }[],
  now: Date = new Date(),
): CaseloadSummary {
  const byTag = {
    claimable: 0,
    not_due_yet: 0,
    no_employment: 0,
    below_threshold: 0,
    below_minimum_wage: 0,
    evidence_missing: 0,
    evidence_unacceptable: 0,
    needs_preapproval: 0,
    subsidized_not_payable: 0,
    stacking_uncounted: 0,
    needs_new_employer: 0,
  } satisfies Record<MilestoneStatus["tag"], number>;

  let checkpointsDue = 0;
  let claimable = 0;
  let earnedNotProvable = 0;

  for (const row of rows) {
    for (const checkpoint of placementCheckpoints(row.placement, row.spells, now)) {
      const tag = checkpoint.status.tag;
      byTag[tag] += 1;
      if (tag !== "not_due_yet") checkpointsDue += 1;
      if (tag === "claimable") claimable += 1;
      if (RECOVERABLE_TAGS.includes(tag)) earnedNotProvable += 1;
    }
  }

  return {
    placements: rows.length,
    checkpointsDue,
    claimable,
    earnedNotProvable,
    byTag,
  };
}

/** Plain-language label and the action it implies. For the UI, not for logic. */
export function describeStatus(status: MilestoneStatus): { label: string; detail: string } {
  switch (status.tag) {
    case "claimable":
      return {
        label: "Claimable",
        detail: `${status.weeklyHours} hrs/week, evidenced by ${status.evidenceSource.replaceAll("_", " ")}.`,
      };
    case "not_due_yet":
      return {
        label: "Not due yet",
        detail: `Checkpoint falls on ${status.dueOn.toISOString().slice(0, 10)}.`,
      };
    case "no_employment":
      return {
        label: "Not employed",
        detail: "No employment spell covers this checkpoint date.",
      };
    case "below_threshold":
      return {
        label: "Below threshold",
        detail: `${status.weeklyHours} hrs/week, ${status.shortfall} short of the 20-hour average.`,
      };
    case "below_minimum_wage":
      return {
        label: "Below minimum wage",
        detail: `Recorded at $${status.hourlyWage.toFixed(2)}/hr, under general minimum wage.`,
      };
    case "evidence_missing":
      return {
        label: "Evidence not collected",
        detail: `${status.weeklyHours} hrs/week worked. An acceptable document is identified but not on file.`,
      };
    case "evidence_unacceptable":
      return {
        label: "Evidence not accepted",
        detail:
          status.source === "client_self_report"
            ? `${status.weeklyHours} hrs/week worked, but client self-report is not acceptable evidence.`
            : `${status.weeklyHours} hrs/week worked, evidenced only by ${status.source.replaceAll("_", " ")}.`,
      };
    case "needs_preapproval":
      return {
        label: "Needs SSM pre-approval",
        detail: `${status.weeklyHours} hrs/week worked. A provider attestation requires pre-approval before submission.`,
      };
    case "subsidized_not_payable":
      return {
        label: "Subsidized",
        detail: `${status.weeklyHours} hrs/week, but no outcome is payable while the employer receives financial supports.`,
      };
    case "stacking_uncounted":
      return {
        label: "Job stacking",
        detail: `${status.weeklyHours} hrs/week across ${status.spellCount} concurrent jobs. Permitted for up to 5% of clients per catchment, so confirm before claiming.`,
      };
    case "needs_new_employer":
      return {
        label: "Needs a new employer",
        detail:
          "Client entered already working 20-plus hours, so an outcome requires 20-plus hours with a different employer.",
      };
  }
}
