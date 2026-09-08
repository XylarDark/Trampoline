import { describe, expect, it } from "vitest";

import {
  CHECK_TYPES,
  GATES,
  LEVEL_BUNDLES,
  OPPORTUNITIES,
  RESTRICTIONS,
  checkTypeDomainMap,
} from "@/src/db/seed-data";

import { activeRestrictionCodes, isCurrent, lapsedCheckTypeKeys } from "./decay";
import { computeLevel, healthRenewalDue, levelStatuses, nextLevelGap } from "./levels";
import {
  HealthDataInEmploymentGateError,
  evaluateEmploymentGate,
  evaluateGate,
  evaluateTrainingGate,
  parseGate,
} from "./rules";
import { supportTriggers } from "./routing";
import { buildEmploymentShareView, buildFunctionalAbilitiesView, buildPersonalView } from "./share";
import type {
  AttestationResult,
  AttestationSnapshot,
  EmploymentGate,
  OpportunityRef,
  PassportSnapshot,
  TrainingGate,
} from "./types";
import { employmentGateSchema, trainingGateSchema } from "./types";

const NOW = new Date("2026-09-07T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

const domainByKey = new Map(CHECK_TYPES.map((check) => [check.key, check.domain]));

function attest(
  checkTypeKey: string,
  options: {
    result?: AttestationResult;
    issuedDaysAgo?: number;
    expiresInDays?: number;
    revokedDaysAgo?: number;
    restrictionCodes?: string[];
  } = {},
): AttestationSnapshot {
  const domain = domainByKey.get(checkTypeKey);
  if (!domain) throw new Error(`Unknown seeded check type: ${checkTypeKey}`);

  const issuedDaysAgo = options.issuedDaysAgo ?? 10;
  const expiresInDays = options.expiresInDays ?? 80;

  return {
    id: `${checkTypeKey}-${issuedDaysAgo}`,
    checkTypeKey,
    domain,
    result: options.result ?? "pass",
    issuedAt: new Date(NOW.getTime() - issuedDaysAgo * DAY),
    expiresAt: new Date(NOW.getTime() + expiresInDays * DAY),
    revokedAt:
      options.revokedDaysAgo === undefined
        ? null
        : new Date(NOW.getTime() - options.revokedDaysAgo * DAY),
    restrictionCodes: options.restrictionCodes,
  };
}

function snapshot(attestations: AttestationSnapshot[], attendanceDays?: number): PassportSnapshot {
  return {
    attestations,
    levelRequirements: LEVEL_BUNDLES,
    restrictions: RESTRICTIONS,
    checkTypeDomains: checkTypeDomainMap(),
    attendanceDays,
  };
}

const LEVEL_0 = ["medical.basic_contact"];
const LEVEL_1 = ["wellness.movement_floor", "mental.check_in"];
const LEVEL_2 = ["skills.placement_ready"];

const throughLevel2 = [...LEVEL_0, ...LEVEL_1, ...LEVEL_2];

const warehouseGate = parseGate(GATES[0].definition) as EmploymentGate;
const forkliftGate = parseGate(GATES[1].definition) as TrainingGate;

const warehouseSeat = OPPORTUNITIES[0];
const warehouseOpportunity: OpportunityRef = {
  id: warehouseSeat.key,
  title: warehouseSeat.title,
  tags: warehouseSeat.tags,
};

const forkliftSeat = OPPORTUNITIES[1];
const forkliftOpportunity: OpportunityRef = {
  id: forkliftSeat.key,
  title: forkliftSeat.title,
  tags: forkliftSeat.tags,
};

const employmentSkills = ["skills.core_skills", "skills.reliability_window"];

describe("decay", () => {
  it("treats an expired check as not current", () => {
    expect(isCurrent(attest("medical.basic_contact", { expiresInDays: -1 }), NOW)).toBe(false);
  });

  it("treats a revoked check as not current even before its expiry", () => {
    const revoked = attest("medical.basic_contact", { revokedDaysAgo: 1 });
    expect(isCurrent(revoked, NOW)).toBe(false);
  });

  it("reports a lapsed check separately from one never attested", () => {
    const lapsed = lapsedCheckTypeKeys(
      [attest("medical.basic_contact", { expiresInDays: -5 }), attest("wellness.movement_floor")],
      NOW,
    );
    expect(lapsed).toEqual(["medical.basic_contact"]);
  });

  it("collects restriction codes from current restricted passes only", () => {
    const attestations = [
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["no_lifting_over_10kg"],
      }),
      attest("mental.check_in", {
        result: "restricted",
        expiresInDays: -1,
        restrictionCodes: ["no_night_shift"],
      }),
    ];
    expect(activeRestrictionCodes(attestations, NOW)).toEqual(["no_lifting_over_10kg"]);
  });
});

describe("levels", () => {
  it("holds Level 0 once its bundle passes", () => {
    expect(
      computeLevel(
        LEVEL_0.map((key) => attest(key)),
        LEVEL_BUNDLES,
        NOW,
      ),
    ).toBe(0);
  });

  it("reaches Level 2 when every bundle through 2 is current", () => {
    expect(
      computeLevel(
        throughLevel2.map((key) => attest(key)),
        LEVEL_BUNDLES,
        NOW,
      ),
    ).toBe(2);
  });

  it("does not skip a level when a lower bundle is missing", () => {
    const skipping = [...LEVEL_0, ...LEVEL_2].map((key) => attest(key));
    expect(computeLevel(skipping, LEVEL_BUNDLES, NOW)).toBe(0);
  });

  it("drops the held level when a Level 0 check expires", () => {
    const attestations = throughLevel2.map((key) =>
      key === "medical.basic_contact" ? attest(key, { expiresInDays: -1 }) : attest(key),
    );
    expect(computeLevel(attestations, LEVEL_BUNDLES, NOW)).toBe(0);
  });

  it("does not report a satisfied bundle as held when a lower one is open", () => {
    // Level 4's bundle is satisfied here, but Level 3's is not.
    const attestations = [...LEVEL_0, ...LEVEL_1, ...LEVEL_2, "skills.hold_90_days"].map((key) =>
      attest(key),
    );
    const statuses = levelStatuses(attestations, LEVEL_BUNDLES, NOW);

    expect(statuses[4].satisfied).toBe(true);
    expect(statuses[4].held).toBe(false);
    expect(computeLevel(attestations, LEVEL_BUNDLES, NOW)).toBe(2);
  });

  it("names the next level and what it still needs", () => {
    const gap = nextLevelGap(
      [...LEVEL_0, ...LEVEL_1].map((key) => attest(key)),
      LEVEL_BUNDLES,
      NOW,
    );
    expect(gap.nextLevel).toBe(2);
    expect(gap.missingCheckTypes).toEqual(["skills.placement_ready"]);
  });

  it("flags a lapsed health check as a renewal due", () => {
    const attestations = throughLevel2.map((key) =>
      key === "wellness.movement_floor" ? attest(key, { expiresInDays: -2 }) : attest(key),
    );
    expect(healthRenewalDue(attestations, LEVEL_BUNDLES, NOW)).toBe(true);
  });

  it("does not call a never-started check a renewal", () => {
    expect(
      healthRenewalDue(
        LEVEL_0.map((key) => attest(key)),
        LEVEL_BUNDLES,
        NOW,
      ),
    ).toBe(false);
  });
});

describe("employment gates", () => {
  it("opens on demonstrated skills and attendance", () => {
    const verdict = evaluateEmploymentGate(
      warehouseGate,
      snapshot(
        employmentSkills.map((key) => attest(key)),
        14,
      ),
      NOW,
    );
    expect(verdict.open).toBe(true);
    expect(verdict.reasons).toEqual([]);
  });

  it("stays shut when a skills check is missing", () => {
    const verdict = evaluateEmploymentGate(
      warehouseGate,
      snapshot([attest("skills.core_skills")], 14),
      NOW,
    );
    expect(verdict.open).toBe(false);
    expect(verdict.missingCheckTypes).toEqual(["skills.reliability_window"]);
  });

  it("stays shut when the attendance window is short", () => {
    const verdict = evaluateEmploymentGate(
      warehouseGate,
      snapshot(
        employmentSkills.map((key) => attest(key)),
        6,
      ),
      NOW,
    );
    expect(verdict.open).toBe(false);
    expect(verdict.reasons.join(" ")).toContain("14 days of attendance");
  });

  it("opens for someone with no health checks at all", () => {
    // The zero-exclusion case. Nothing about health is required to work.
    const verdict = evaluateEmploymentGate(
      warehouseGate,
      snapshot(
        employmentSkills.map((key) => attest(key)),
        20,
      ),
      NOW,
    );
    expect(verdict.open).toBe(true);
  });

  it("stays open when every health check has lapsed", () => {
    const attestations = [
      ...employmentSkills.map((key) => attest(key)),
      attest("medical.basic_contact", { expiresInDays: -30 }),
      attest("mental.check_in", { expiresInDays: -30 }),
      attest("wellness.movement_floor", { expiresInDays: -30 }),
    ];
    const verdict = evaluateEmploymentGate(warehouseGate, snapshot(attestations, 20), NOW);

    expect(healthRenewalDue(attestations, LEVEL_BUNDLES, NOW)).toBe(true);
    expect(verdict.open).toBe(true);
  });

  it("ignores a restriction that would block a training place", () => {
    const attestations = [
      ...employmentSkills.map((key) => attest(key)),
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["no_lifting_over_10kg"],
      }),
    ];
    const verdict = evaluateEmploymentGate(warehouseGate, snapshot(attestations, 20), NOW);

    expect(verdict.blockingRestrictions).toEqual([]);
    expect(verdict.open).toBe(true);
  });

  it("cannot be given a level requirement", () => {
    expect(() =>
      employmentGateSchema.parse({
        kind: "employment",
        requiredCheckTypes: [],
        requiredLevel: 2,
      }),
    ).toThrow();
  });

  it("cannot be given a restriction requirement", () => {
    expect(() =>
      employmentGateSchema.parse({
        kind: "employment",
        requiredCheckTypes: [],
        restrictionsMustBeClear: ["no_lifting_over_10kg"],
      }),
    ).toThrow();
  });

  it("refuses to evaluate when it names a health-domain check", () => {
    const misconfigured: EmploymentGate = {
      kind: "employment",
      requiredCheckTypes: ["medical.work_clearance"],
    };

    expect(() =>
      evaluateEmploymentGate(misconfigured, snapshot([attest("medical.work_clearance")], 20), NOW),
    ).toThrow(HealthDataInEmploymentGateError);
  });
});

describe("training gates", () => {
  it("blocks on a restriction the program cannot accommodate", () => {
    const attestations = [
      ...throughLevel2.map((key) => attest(key)),
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["no_lifting_over_10kg"],
      }),
    ];
    const verdict = evaluateTrainingGate(
      forkliftGate,
      forkliftOpportunity,
      snapshot(attestations, 14),
      NOW,
    );
    expect(verdict.blockingRestrictions).toEqual(["no_lifting_over_10kg"]);
    expect(verdict.open).toBe(false);
  });

  it("lets a restriction through when the program tags are compatible", () => {
    const attestations = [
      ...throughLevel2.map((key) => attest(key)),
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["no_night_shift"],
      }),
    ];
    const dayShiftGate = trainingGateSchema.parse({
      ...GATES[1].definition,
      restrictionsMustBeClear: ["no_night_shift"],
    });
    const verdict = evaluateTrainingGate(
      dayShiftGate,
      forkliftOpportunity,
      snapshot(attestations, 14),
      NOW,
    );
    expect(verdict.blockingRestrictions).toEqual([]);
    expect(verdict.open).toBe(true);
  });

  it("requires a written safety rationale before it may use a restriction", () => {
    expect(() =>
      trainingGateSchema.parse({
        kind: "training",
        requiredCheckTypes: [],
        restrictionsMustBeClear: ["no_lifting_over_10kg"],
      }),
    ).toThrow(/safety rationale/i);
  });

  it("needs no rationale when it asks only for skills", () => {
    const gate = trainingGateSchema.parse({
      kind: "training",
      requiredCheckTypes: ["skills.placement_ready"],
    });
    expect(gate.safetyRationale).toBeUndefined();
  });

  it("rejects a malformed stored gate instead of guessing", () => {
    expect(() => parseGate({ kind: "training", requiredLevel: 9 })).toThrow();
    expect(() => parseGate({ requiredLevel: 2 })).toThrow();
  });
});

describe("routing", () => {
  it("offers a clinician-to-workplace contact when a health check lapses", () => {
    const attestations = throughLevel2.map((key) =>
      key === "mental.check_in" ? attest(key, { expiresInDays: -1 }) : attest(key),
    );
    const triggers = supportTriggers(snapshot(attestations), NOW);

    expect(triggers.map((trigger) => trigger.action)).toContain("clinician_workplace_contact");
    expect(triggers.map((trigger) => trigger.action)).toContain("renewal_reminder");
  });

  it("turns a restriction into an accommodation offer", () => {
    const attestations = [
      ...throughLevel2.map((key) => attest(key)),
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["graduated_hours"],
      }),
    ];
    const triggers = supportTriggers(snapshot(attestations), NOW);

    expect(triggers[0].action).toBe("accommodation_offer");
    expect(triggers[0].reason).toContain("accommodation");
  });

  it("tells the person a lapsed health check does not affect job access", () => {
    const attestations = [
      ...employmentSkills.map((key) => attest(key)),
      attest("medical.basic_contact", { expiresInDays: -1 }),
    ];
    const triggers = supportTriggers(snapshot(attestations), NOW);
    const reminder = triggers.find((trigger) => trigger.action === "renewal_reminder");

    expect(reminder?.reason).toContain("does not affect any job");
  });
});

describe("employer-facing views", () => {
  const attestations = [
    ...throughLevel2.map((key) => attest(key, { expiresInDays: 40 })),
    attest("skills.core_skills", { expiresInDays: 200 }),
    attest("medical.work_clearance", {
      result: "restricted",
      expiresInDays: 20,
      restrictionCodes: ["graduated_hours"],
    }),
  ];

  it("shows a hiring employer skills only, with no health data of any kind", () => {
    const view = buildEmploymentShareView(snapshot(attestations), NOW);
    const serialized = JSON.stringify(view);

    expect(view.checks.map((check) => check.checkTypeKey).sort()).toEqual([
      "skills.core_skills",
      "skills.placement_ready",
    ]);

    for (const domain of ["medical", "wellness", "mental"]) {
      expect(serialized).not.toContain(domain);
    }
    for (const restriction of RESTRICTIONS) {
      expect(serialized).not.toContain(restriction.code);
    }
  });

  it("carries no level, no verdict, and no pause on either employer view", () => {
    const preOffer = JSON.stringify(buildEmploymentShareView(snapshot(attestations), NOW));
    const postOffer = JSON.stringify(buildFunctionalAbilitiesView(snapshot(attestations), NOW));

    for (const serialized of [preOffer, postOffer]) {
      expect(serialized).not.toContain("level");
      expect(serialized).not.toContain("Trainable");
      expect(serialized).not.toContain("paused");
      expect(serialized).not.toContain('"pass"');
      expect(serialized).not.toContain('"fail"');
    }
  });

  it("gives a post-offer employer functional limits and an accommodation path", () => {
    const view = buildFunctionalAbilitiesView(snapshot(attestations), NOW);

    expect(view.restrictions).toEqual([
      {
        code: "graduated_hours",
        label: "Graduated hours",
        compatibleTags: ["part_time", "remote", "light_duty"],
      },
    ]);
    expect(view.accommodationRequestPath).toBe("/accommodation");
    expect(view.reassessOn?.toISOString()).toBe(new Date(NOW.getTime() + 20 * DAY).toISOString());
  });

  it("never leaks a mental-domain restriction to a post-offer employer", () => {
    const withMentalRestriction = [
      ...attestations,
      attest("mental.check_in", {
        result: "restricted",
        restrictionCodes: ["no_night_shift"],
      }),
    ];
    const view = buildFunctionalAbilitiesView(snapshot(withMentalRestriction), NOW);

    expect(view.restrictions.map((restriction) => restriction.code)).toEqual(["graduated_hours"]);
    expect(JSON.stringify(view)).not.toContain("no_night_shift");
  });

  it("keeps rubric text out of every employer view", () => {
    const serialized = [
      JSON.stringify(buildEmploymentShareView(snapshot(attestations), NOW)),
      JSON.stringify(buildFunctionalAbilitiesView(snapshot(attestations), NOW)),
    ].join(" ");

    for (const check of CHECK_TYPES) {
      expect(serialized).not.toContain(check.rubricSummary);
    }
  });
});

describe("personal view", () => {
  it("gives the person their level, their health checks, and their support", () => {
    const attestations = [
      ...throughLevel2.map((key) => attest(key)),
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["graduated_hours"],
      }),
    ];
    const view = buildPersonalView(snapshot(attestations), NOW);

    expect(view.level).toBe(2);
    expect(view.levelName).toBe("Trainable");
    expect(view.checks.map((check) => check.domain)).toContain("mental");
    expect(view.support.map((trigger) => trigger.action)).toContain("accommodation_offer");
  });
});

describe("seeded gates", () => {
  it("keeps every seeded employment gate to skills checks only", () => {
    const domains = checkTypeDomainMap();

    for (const seed of GATES) {
      const gate = parseGate(seed.definition);
      if (gate.kind !== "employment") continue;

      for (const key of gate.requiredCheckTypes) {
        expect(domains[key]).toBe("skills");
      }
    }
  });

  it("evaluates every seeded opportunity without throwing", () => {
    for (const seat of OPPORTUNITIES) {
      const seed = GATES.find((gate) => gate.key === seat.gateKey);
      expect(seed).toBeDefined();

      const verdict = evaluateGate(
        parseGate(seed!.definition),
        { id: seat.key, title: seat.title, tags: seat.tags },
        snapshot(
          throughLevel2.map((key) => attest(key)),
          20,
        ),
        NOW,
      );
      expect(verdict).toHaveProperty("open");
    }
  });

  it("keeps the warehouse seat and the forklift course pointed at different gate kinds", () => {
    expect(warehouseGate.kind).toBe("employment");
    expect(forkliftGate.kind).toBe("training");
    expect(warehouseOpportunity.tags).toContain("lifting");
  });
});
