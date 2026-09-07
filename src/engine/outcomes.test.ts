import { describe, expect, it } from "vitest";

import {
  CUMULATIVE_AGGREGATION,
  FUNDED_OUTCOME_MIN_WEEKLY_HOURS,
  IES_CHECKPOINT_MONTHS,
  addMonths,
  caseloadSummary,
  checkpointDates,
  cumulativeWeeks,
  describeStatus,
  evidenceStatus,
  hoursAtCheckpoint,
  milestoneStatus,
  placementCheckpoints,
  provableHours,
  spellCoversDate,
} from "./outcomes";
import type { PlacementSnapshot, SpellSnapshot, VerificationSource } from "./outcomes";

const JOB_START = new Date("2026-01-15T00:00:00Z");
const NOW = new Date("2027-06-01T00:00:00Z");

function placement(overrides: Partial<PlacementSnapshot> = {}): PlacementSnapshot {
  return {
    id: "placement-1",
    startedOn: JOB_START,
    endedOn: null,
    primaryJob: true,
    enteredEmployedFullHours: false,
    sameEmployerAsEntry: false,
    ...overrides,
  };
}

function spell(overrides: Partial<SpellSnapshot> = {}): SpellSnapshot {
  return {
    id: "spell-1",
    periodStart: JOB_START,
    periodEnd: null,
    weeklyHours: 32,
    hourlyWage: 21,
    subsidized: false,
    verificationSource: "pay_stub",
    verifiedAt: new Date("2026-02-01T00:00:00Z"),
    ssmPreApprovalRef: null,
    ...overrides,
  };
}

/** Checkpoint helper: the nth IES checkpoint for the standard job start. */
function checkpoint(month: (typeof IES_CHECKPOINT_MONTHS)[number]) {
  const found = checkpointDates(JOB_START).find((c) => c.month === month);
  if (!found) throw new Error(`no checkpoint at month ${month}`);
  return found;
}

describe("checkpoint dates", () => {
  it("places checkpoints 1, 3, 6, and 12 months after job start, not after exit", () => {
    expect(checkpointDates(JOB_START).map((c) => c.dueOn.toISOString().slice(0, 10))).toEqual([
      "2026-02-15",
      "2026-04-15",
      "2026-07-15",
      "2027-01-15",
    ]);
  });

  it("clamps to the end of a shorter month rather than rolling into the next one", () => {
    // A 31 January start has no 31 February checkpoint. Rolling forward would
    // move a funder deadline by three days.
    expect(addMonths(new Date("2026-01-31T00:00:00Z"), 1).toISOString().slice(0, 10)).toBe(
      "2026-02-28",
    );
    expect(addMonths(new Date("2024-01-31T00:00:00Z"), 1).toISOString().slice(0, 10)).toBe(
      "2024-02-29",
    );
  });

  it("crosses a year boundary at the twelve-month checkpoint", () => {
    expect(addMonths(new Date("2026-11-30T00:00:00Z"), 12).toISOString().slice(0, 10)).toBe(
      "2027-11-30",
    );
  });
});

describe("spell coverage and hours", () => {
  it("treats a spell as half-open: start inclusive, end exclusive", () => {
    const s = spell({ periodStart: new Date("2026-03-01"), periodEnd: new Date("2026-04-01") });
    expect(spellCoversDate(s, new Date("2026-03-01"))).toBe(true);
    expect(spellCoversDate(s, new Date("2026-03-31"))).toBe(true);
    expect(spellCoversDate(s, new Date("2026-04-01"))).toBe(false);
    expect(spellCoversDate(s, new Date("2026-02-28"))).toBe(false);
  });

  it("treats a null end date as ongoing", () => {
    expect(spellCoversDate(spell({ periodEnd: null }), new Date("2030-01-01"))).toBe(true);
  });

  it("sums concurrent spells at a checkpoint", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 12 }),
      spell({ id: "b", weeklyHours: 9.5 }),
    ];
    expect(hoursAtCheckpoint(spells, checkpoint(3).dueOn)).toBe(21.5);
  });

  it("reports zero hours when no spell covers the date", () => {
    const gap = spell({ periodStart: new Date("2026-01-15"), periodEnd: new Date("2026-02-01") });
    expect(hoursAtCheckpoint([gap], checkpoint(6).dueOn)).toBe(0);
  });
});

describe("cumulative weeks", () => {
  it("counts only covered time, so a gap does not count", () => {
    const spells = [
      spell({ id: "a", periodStart: new Date("2026-01-01"), periodEnd: new Date("2026-01-15") }),
      spell({ id: "b", periodStart: new Date("2026-02-01"), periodEnd: new Date("2026-02-15") }),
    ];
    expect(cumulativeWeeks(spells, new Date("2026-01-01"), new Date("2026-03-01"))).toBe(4);
  });

  it("does not double count overlapping concurrent spells", () => {
    const spells = [
      spell({ id: "a", periodStart: new Date("2026-01-01"), periodEnd: new Date("2026-01-29") }),
      spell({ id: "b", periodStart: new Date("2026-01-08"), periodEnd: new Date("2026-01-22") }),
    ];
    expect(cumulativeWeeks(spells, new Date("2026-01-01"), new Date("2026-02-01"))).toBe(4);
  });

  it("clips to the requested window", () => {
    const spells = [spell({ periodStart: new Date("2025-01-01"), periodEnd: null })];
    expect(cumulativeWeeks(spells, new Date("2026-01-01"), new Date("2026-01-29"))).toBe(4);
  });

  it("returns zero for an inverted window", () => {
    expect(cumulativeWeeks([spell()], new Date("2026-03-01"), new Date("2026-01-01"))).toBe(0);
  });

  it("documents its aggregation assumption rather than hiding it", () => {
    // Guards the named constant. If this flips, the UI note must change with it.
    expect(CUMULATIVE_AGGREGATION).toBe("continuous_at_checkpoint");
  });
});

describe("evidence acceptability", () => {
  const cases: [VerificationSource, string][] = [
    ["offer_letter", "acceptable"],
    ["initial_pay_stub", "acceptable"],
    ["pay_stub", "acceptable"],
    ["employment_letter", "acceptable"],
  ];

  it.each(cases)("accepts %s once the document is on file", (source, expected) => {
    expect(evidenceStatus(spell({ verificationSource: source }))).toBe(expected);
  });

  it("treats an acceptable source with no document on file as not collected", () => {
    expect(evidenceStatus(spell({ verificationSource: "pay_stub", verifiedAt: null }))).toBe(
      "not_collected",
    );
  });

  it("rejects client self-report, which the framework does not list as evidence at all", () => {
    expect(evidenceStatus(spell({ verificationSource: "client_self_report" }))).toBe(
      "not_acceptable",
    );
  });

  it("requires pre-approval for a bare provider attestation", () => {
    expect(evidenceStatus(spell({ verificationSource: "provider_attestation" }))).toBe(
      "needs_preapproval",
    );
  });

  it("accepts a provider attestation once pre-approved by the SSM", () => {
    expect(
      evidenceStatus(
        spell({ verificationSource: "provider_attestation", ssmPreApprovalRef: "SSM-2026-118" }),
      ),
    ).toBe("acceptable");
  });
});

describe("provable hours", () => {
  it("credits only the spells whose document is on file", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 24, verificationSource: "client_self_report" }),
      spell({ id: "b", weeklyHours: 8, verificationSource: "employment_letter" }),
    ];
    expect(hoursAtCheckpoint(spells, checkpoint(3).dueOn)).toBe(32);
    expect(provableHours(spells)).toBe(8);
  });

  it("credits nothing when no document is on file", () => {
    expect(provableHours([spell({ verifiedAt: null })])).toBe(0);
  });

  it("counts a pre-approved provider attestation", () => {
    const attested = spell({
      verificationSource: "provider_attestation",
      ssmPreApprovalRef: "SSM-2026-118",
    });
    expect(provableHours([attested])).toBe(32);
  });
});

describe("evidence not yet collected", () => {
  it("reports the hours as worked but unprovable", () => {
    expect(milestoneStatus(placement(), [spell({ verifiedAt: null })], checkpoint(3), NOW)).toEqual({
      tag: "evidence_missing",
      weeklyHours: 32,
    });
  });

  it("will not let a small collected document carry a large uncollected spell", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 22, verifiedAt: null }),
      spell({ id: "b", weeklyHours: 6, verificationSource: "employment_letter" }),
    ];
    expect(milestoneStatus(placement(), spells, checkpoint(3), NOW)).toEqual({
      tag: "evidence_missing",
      weeklyHours: 28,
    });
  });

  it("names the blocker in front of the most unprovable hours", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 22, verificationSource: "client_self_report" }),
      spell({ id: "b", weeklyHours: 6, verifiedAt: null }),
    ];
    expect(milestoneStatus(placement(), spells, checkpoint(3), NOW).tag).toBe(
      "evidence_unacceptable",
    );
  });

  it("names the uncollected document when that is where the hours are", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 6, verificationSource: "client_self_report" }),
      spell({ id: "b", weeklyHours: 22, verifiedAt: null }),
    ];
    expect(milestoneStatus(placement(), spells, checkpoint(3), NOW).tag).toBe("evidence_missing");
  });

  it("is claimable once the evidenced spells alone clear the threshold", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 22, verificationSource: "employment_letter" }),
      spell({ id: "b", weeklyHours: 6, verifiedAt: null }),
    ];
    expect(milestoneStatus(placement(), spells, checkpoint(3), NOW)).toEqual({
      tag: "claimable",
      weeklyHours: 28,
      evidenceSource: "employment_letter",
    });
  });
});

describe("milestone status", () => {
  it("is claimable when hours, wage, and evidence all hold", () => {
    expect(milestoneStatus(placement(), [spell()], checkpoint(3), NOW)).toEqual({
      tag: "claimable",
      weeklyHours: 32,
      evidenceSource: "pay_stub",
    });
  });

  it("is not due yet before the checkpoint date arrives", () => {
    const status = milestoneStatus(placement(), [spell()], checkpoint(12), new Date("2026-08-01"));
    expect(status.tag).toBe("not_due_yet");
  });

  it("reports no employment when the person had stopped by the checkpoint", () => {
    const stopped = spell({ periodEnd: new Date("2026-03-01") });
    expect(milestoneStatus(placement(), [stopped], checkpoint(6), NOW).tag).toBe("no_employment");
  });

  it("reports the shortfall at 19.5 hours rather than rounding it up", () => {
    expect(milestoneStatus(placement(), [spell({ weeklyHours: 19.5 })], checkpoint(3), NOW)).toEqual(
      { tag: "below_threshold", weeklyHours: 19.5, shortfall: 0.5 },
    );
  });

  it("treats exactly 20 hours as meeting the threshold", () => {
    const status = milestoneStatus(
      placement(),
      [spell({ weeklyHours: FUNDED_OUTCOME_MIN_WEEKLY_HOURS })],
      checkpoint(3),
      NOW,
    );
    expect(status.tag).toBe("claimable");
  });

  it("blocks a subsidized placement even when hours and evidence are perfect", () => {
    expect(milestoneStatus(placement(), [spell({ subsidized: true })], checkpoint(3), NOW)).toEqual({
      tag: "subsidized_not_payable",
      weeklyHours: 32,
    });
  });

  it("reports subsidy before evidence, so nobody chases a document that cannot pay", () => {
    const status = milestoneStatus(
      placement(),
      [spell({ subsidized: true, verificationSource: "client_self_report" })],
      checkpoint(3),
      NOW,
    );
    expect(status.tag).toBe("subsidized_not_payable");
  });

  it("rejects a checkpoint evidenced only by client self-report", () => {
    expect(
      milestoneStatus(
        placement(),
        [spell({ verificationSource: "client_self_report" })],
        checkpoint(3),
        NOW,
      ),
    ).toEqual({ tag: "evidence_unacceptable", weeklyHours: 32, source: "client_self_report" });
  });

  it("flags a provider attestation without pre-approval", () => {
    expect(
      milestoneStatus(
        placement(),
        [spell({ verificationSource: "provider_attestation" })],
        checkpoint(3),
        NOW,
      ),
    ).toEqual({ tag: "needs_preapproval", weeklyHours: 32 });
  });

  it("clears once the attestation carries a pre-approval reference", () => {
    const status = milestoneStatus(
      placement(),
      [spell({ verificationSource: "provider_attestation", ssmPreApprovalRef: "SSM-2026-118" })],
      checkpoint(3),
      NOW,
    );
    expect(status.tag).toBe("claimable");
  });

  it("flags stacking when only the sum of concurrent jobs clears the threshold", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 12 }),
      spell({ id: "b", weeklyHours: 14 }),
    ];
    expect(milestoneStatus(placement(), spells, checkpoint(3), NOW)).toEqual({
      tag: "stacking_uncounted",
      weeklyHours: 26,
      spellCount: 2,
    });
  });

  it("does not flag stacking when one job alone clears the threshold", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 30 }),
      spell({ id: "b", weeklyHours: 6 }),
    ];
    expect(milestoneStatus(placement(), spells, checkpoint(3), NOW).tag).toBe("claimable");
  });

  it("requires a new employer when the client entered already working full hours", () => {
    expect(
      milestoneStatus(
        placement({ enteredEmployedFullHours: true, sameEmployerAsEntry: true }),
        [spell()],
        checkpoint(3),
        NOW,
      ),
    ).toEqual({ tag: "needs_new_employer" });
  });

  it("allows the outcome once that client moves to a different employer", () => {
    const status = milestoneStatus(
      placement({ enteredEmployedFullHours: true, sameEmployerAsEntry: false }),
      [spell()],
      checkpoint(3),
      NOW,
    );
    expect(status.tag).toBe("claimable");
  });

  it("holds the new-employer rule ahead of the due date check only after the date passes", () => {
    const status = milestoneStatus(
      placement({ enteredEmployedFullHours: true, sameEmployerAsEntry: true }),
      [spell()],
      checkpoint(12),
      new Date("2026-08-01"),
    );
    expect(status.tag).toBe("not_due_yet");
  });

  it("flags a wage under general minimum wage", () => {
    const status = milestoneStatus(placement(), [spell({ hourlyWage: 15 })], checkpoint(3), NOW);
    expect(status).toEqual({ tag: "below_minimum_wage", hourlyWage: 15 });
  });

  it("does not let one document evidence hours it does not cover", () => {
    const spells = [
      spell({ id: "a", weeklyHours: 24, verificationSource: "client_self_report" }),
      spell({ id: "b", weeklyHours: 8, verificationSource: "employment_letter" }),
    ];
    const status = milestoneStatus(placement(), spells, checkpoint(3), NOW);
    expect(status).toEqual({
      tag: "evidence_unacceptable",
      weeklyHours: 32,
      source: "client_self_report",
    });
  });

  it("recovers a broken employment history if a later spell covers the checkpoint", () => {
    const spells = [
      spell({ id: "a", periodStart: JOB_START, periodEnd: new Date("2026-03-01") }),
      spell({ id: "b", periodStart: new Date("2026-06-01"), periodEnd: null }),
    ];
    const results = placementCheckpoints(placement(), spells, NOW).map((r) => r.status.tag);
    expect(results).toEqual(["claimable", "no_employment", "claimable", "claimable"]);
  });
});

describe("caseload summary", () => {
  it("counts paperwork-blocked outcomes as earned but not provable", () => {
    const rows = [
      { placement: placement({ id: "p1" }), spells: [spell()] },
      {
        placement: placement({ id: "p2" }),
        spells: [spell({ verificationSource: "client_self_report" })],
      },
      {
        placement: placement({ id: "p3" }),
        spells: [spell({ verificationSource: "provider_attestation" })],
      },
    ];

    const summary = caseloadSummary(rows, NOW);
    expect(summary.placements).toBe(3);
    expect(summary.checkpointsDue).toBe(12);
    expect(summary.claimable).toBe(4);
    expect(summary.earnedNotProvable).toBe(8);
  });

  it("excludes subsidized checkpoints from earned-but-not-provable, since no document fixes them", () => {
    const rows = [{ placement: placement(), spells: [spell({ subsidized: true })] }];
    const summary = caseloadSummary(rows, NOW);
    expect(summary.earnedNotProvable).toBe(0);
    expect(summary.byTag.subsidized_not_payable).toBe(4);
  });

  it("counts an empty caseload without dividing by zero", () => {
    const summary = caseloadSummary([], NOW);
    expect(summary).toMatchObject({ placements: 0, checkpointsDue: 0, earnedNotProvable: 0 });
  });
});

describe("status descriptions", () => {
  it("gives every status a label and a detail", () => {
    const statuses = [
      milestoneStatus(placement(), [spell()], checkpoint(3), NOW),
      milestoneStatus(placement(), [spell()], checkpoint(12), new Date("2026-08-01")),
      milestoneStatus(placement(), [spell({ periodEnd: new Date("2026-03-01") })], checkpoint(6), NOW),
      milestoneStatus(placement(), [spell({ weeklyHours: 19.5 })], checkpoint(3), NOW),
      milestoneStatus(placement(), [spell({ hourlyWage: 15 })], checkpoint(3), NOW),
      milestoneStatus(placement(), [spell({ verifiedAt: null })], checkpoint(3), NOW),
      milestoneStatus(
        placement(),
        [spell({ verificationSource: "client_self_report" })],
        checkpoint(3),
        NOW,
      ),
      milestoneStatus(
        placement(),
        [spell({ verificationSource: "provider_attestation" })],
        checkpoint(3),
        NOW,
      ),
      milestoneStatus(placement(), [spell({ subsidized: true })], checkpoint(3), NOW),
      milestoneStatus(
        placement(),
        [spell({ id: "a", weeklyHours: 12 }), spell({ id: "b", weeklyHours: 14 })],
        checkpoint(3),
        NOW,
      ),
      milestoneStatus(
        placement({ enteredEmployedFullHours: true, sameEmployerAsEntry: true }),
        [spell()],
        checkpoint(3),
        NOW,
      ),
    ];

    for (const status of statuses) {
      const described = describeStatus(status);
      expect(described.label.length).toBeGreaterThan(0);
      expect(described.detail.length).toBeGreaterThan(0);
    }
  });

  it("names self-report explicitly, because that is the sentence the provider needs", () => {
    const status = milestoneStatus(
      placement(),
      [spell({ verificationSource: "client_self_report" })],
      checkpoint(3),
      NOW,
    );
    expect(describeStatus(status).detail).toContain("client self-report is not acceptable");
  });
});
