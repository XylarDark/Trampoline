import { describe, expect, it } from "vitest";

import {
  CHECK_TYPES,
  LEVEL_BUNDLES,
  OPPORTUNITIES,
  RESTRICTIONS,
  UNLOCK_RULES,
} from "@/src/db/seed-data";

import { activeRestrictionCodes, isCurrent, lapsedCheckTypeKeys } from "./decay";
import { computeLevel, hasHealthFloorDrop, levelStatuses, nextLevelGap } from "./levels";
import { evaluateUnlock, parseUnlockRule } from "./rules";
import { buildShareView } from "./share";
import type {
  AttestationResult,
  AttestationSnapshot,
  OpportunityRef,
  PassportSnapshot,
} from "./types";

const NOW = new Date("2026-09-07T12:00:00Z");

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

  const day = 24 * 60 * 60 * 1000;
  const issuedDaysAgo = options.issuedDaysAgo ?? 10;
  const expiresInDays = options.expiresInDays ?? 80;

  return {
    id: `${checkTypeKey}-${issuedDaysAgo}`,
    checkTypeKey,
    domain,
    result: options.result ?? "pass",
    issuedAt: new Date(NOW.getTime() - issuedDaysAgo * day),
    expiresAt: new Date(NOW.getTime() + expiresInDays * day),
    revokedAt:
      options.revokedDaysAgo === undefined
        ? null
        : new Date(NOW.getTime() - options.revokedDaysAgo * day),
    restrictionCodes: options.restrictionCodes,
  };
}

function snapshot(
  attestations: AttestationSnapshot[],
  attendanceDays?: number,
): PassportSnapshot {
  return {
    attestations,
    levelRequirements: LEVEL_BUNDLES,
    restrictions: RESTRICTIONS,
    attendanceDays,
  };
}

const LEVEL_0 = ["medical.basic_contact"];
const LEVEL_1 = ["wellness.movement_floor", "mental.check_in"];
const LEVEL_2 = ["skills.placement_ready"];

const throughLevel2 = [...LEVEL_0, ...LEVEL_1, ...LEVEL_2];

const warehouseRule = parseUnlockRule(UNLOCK_RULES[0].definition);
const warehouseSeat = OPPORTUNITIES[0];
const warehouseOpportunity: OpportunityRef = {
  id: warehouseSeat.key,
  title: warehouseSeat.title,
  targetLevel: warehouseSeat.targetLevel,
  tags: warehouseSeat.tags,
};

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
      [
        attest("medical.basic_contact", { expiresInDays: -5 }),
        attest("wellness.movement_floor"),
      ],
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
    expect(computeLevel(LEVEL_0.map((key) => attest(key)), LEVEL_BUNDLES, NOW)).toBe(0);
  });

  it("reaches Level 2 when every bundle through 2 is current", () => {
    expect(computeLevel(throughLevel2.map((key) => attest(key)), LEVEL_BUNDLES, NOW)).toBe(2);
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
    const gap = nextLevelGap([...LEVEL_0, ...LEVEL_1].map((key) => attest(key)), LEVEL_BUNDLES, NOW);
    expect(gap.nextLevel).toBe(2);
    expect(gap.missingCheckTypes).toEqual(["skills.placement_ready"]);
  });

  it("counts a lapsed health check as a health floor drop", () => {
    const attestations = throughLevel2.map((key) =>
      key === "wellness.movement_floor" ? attest(key, { expiresInDays: -2 }) : attest(key),
    );
    expect(hasHealthFloorDrop(attestations, LEVEL_BUNDLES, NOW)).toBe(true);
  });

  it("does not call a never-started check a drop", () => {
    expect(hasHealthFloorDrop(LEVEL_0.map((key) => attest(key)), LEVEL_BUNDLES, NOW)).toBe(false);
  });
});

describe("unlock rules", () => {
  it("opens the mocked warehouse seat at Level 2 with attendance met", () => {
    const verdict = evaluateUnlock(
      warehouseRule,
      warehouseOpportunity,
      snapshot(throughLevel2.map((key) => attest(key)), 14),
      NOW,
    );
    expect(verdict.unlocked).toBe(true);
    expect(verdict.reasons).toEqual([]);
  });

  it("keeps the seat shut below Level 2", () => {
    const verdict = evaluateUnlock(
      warehouseRule,
      warehouseOpportunity,
      snapshot([...LEVEL_0, ...LEVEL_1].map((key) => attest(key)), 14),
      NOW,
    );
    expect(verdict.unlocked).toBe(false);
    expect(verdict.reasons[0]).toContain("Needs Level 2");
  });

  it("keeps the seat shut when the attendance window is short", () => {
    const verdict = evaluateUnlock(
      warehouseRule,
      warehouseOpportunity,
      snapshot(throughLevel2.map((key) => attest(key)), 6),
      NOW,
    );
    expect(verdict.unlocked).toBe(false);
    expect(verdict.reasons.join(" ")).toContain("14 days of attendance");
  });

  it("blocks on a lifting restriction the seat cannot accommodate", () => {
    const attestations = [
      ...throughLevel2.map((key) => attest(key)),
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["no_lifting_over_10kg"],
      }),
    ];
    const verdict = evaluateUnlock(
      warehouseRule,
      warehouseOpportunity,
      snapshot(attestations, 14),
      NOW,
    );
    expect(verdict.blockingRestrictions).toEqual(["no_lifting_over_10kg"]);
    expect(verdict.unlocked).toBe(false);
  });

  it("lets a restriction through when the opportunity tags are compatible", () => {
    const attestations = [
      ...throughLevel2.map((key) => attest(key)),
      attest("medical.work_clearance", {
        result: "restricted",
        restrictionCodes: ["no_night_shift"],
      }),
    ];
    const dayShiftRule = parseUnlockRule({
      ...UNLOCK_RULES[0].definition,
      restrictionsMustBeClear: ["no_night_shift"],
    });
    const verdict = evaluateUnlock(
      dayShiftRule,
      warehouseOpportunity,
      snapshot(attestations, 14),
      NOW,
    );
    expect(verdict.blockingRestrictions).toEqual([]);
    expect(verdict.unlocked).toBe(true);
  });

  it("pauses applications when a health check lapses", () => {
    const attestations = throughLevel2.map((key) =>
      key === "mental.check_in" ? attest(key, { expiresInDays: -1 }) : attest(key),
    );
    const verdict = evaluateUnlock(
      warehouseRule,
      warehouseOpportunity,
      snapshot(attestations, 14),
      NOW,
    );
    expect(verdict.applicationsPaused).toBe(true);
    expect(verdict.unlocked).toBe(false);
  });

  it("rejects a malformed stored rule instead of guessing", () => {
    expect(() => parseUnlockRule({ requiredLevel: 9 })).toThrow();
  });
});

describe("share view", () => {
  it("exposes level, restrictions, and expiry without clinical detail", () => {
    const attestations = [
      ...throughLevel2.map((key) => attest(key, { expiresInDays: 40 })),
      attest("medical.work_clearance", {
        result: "restricted",
        expiresInDays: 20,
        restrictionCodes: ["graduated_hours"],
      }),
    ];

    const view = buildShareView(snapshot(attestations), NOW);

    expect(view.level).toBe(2);
    expect(view.levelName).toBe("Trainable");
    expect(view.restrictions).toEqual([
      {
        code: "graduated_hours",
        label: "Graduated hours",
        compatibleTags: ["part_time", "remote", "light_duty"],
      },
    ]);
    expect(view.earliestExpiry?.toISOString()).toBe(
      new Date(NOW.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    );

    const serialized = JSON.stringify(view);
    for (const check of CHECK_TYPES) {
      expect(serialized).not.toContain(check.rubricSummary);
    }
  });
});
