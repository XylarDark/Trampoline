/**
 * A demonstration caseload built to argue with the schema rather than flatter
 * it.
 *
 * Every client here exists to produce one specific milestone verdict from
 * `src/engine/outcomes.ts`, and most of them produce a *failure*. That is
 * deliberate: the provider's pain is not the clean case, it is the eight
 * variations of "they worked, and I cannot prove it." A demo cohort of happy
 * paths would show a screen nobody needs.
 *
 * One status is intentionally absent. `needs_preapproval` cannot be seeded at
 * all, because the `employment_spells_attestation_needs_preapproval` check
 * constraint refuses a provider attestation with no pre-approval reference.
 * The database makes that state unreachable by design, so it is covered in
 * `src/engine/outcomes.test.ts` instead of here. Do not "fix" this by relaxing
 * the constraint.
 *
 * Dates are offsets from the moment the seed runs, so the demo shows a
 * realistic spread of due and not-yet-due checkpoints whenever it is seeded,
 * rather than rotting into a screen where everything is twelve months old.
 */
import { eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import * as schema from "./schema";
import {
  attestations,
  checkTypes,
  employmentSpells,
  organizations,
  outcomeFollowUps,
  outcomeMilestones,
  placements,
  referrals,
  restrictions,
  attestationRestrictions,
  shareLinks,
  tracks,
  users,
} from "./schema";
import type { VerificationSource } from "@/src/engine/outcomes";
import { randomShareToken } from "@/src/lib/tokens";

type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

const DAY = 24 * 60 * 60 * 1000;

/** Employers for the cohort. Kept here rather than in the reference seed data. */
const COHORT_EMPLOYERS = [
  { key: "distribution", name: "Example Distribution Co." },
  { key: "grocer", name: "Example Grocery Group" },
  { key: "hospitality", name: "Example Hospitality Ltd." },
  { key: "manufacturing", name: "Example Fabrication Inc." },
  { key: "retail", name: "Example Retail Partners" },
] as const;

type EmployerKey = (typeof COHORT_EMPLOYERS)[number]["key"];

type SpellSeed = {
  /** Days before seed time that this spell started. */
  startDaysAgo: number;
  /** Days before seed time that it ended. Null means ongoing. */
  endDaysAgo: number | null;
  weeklyHours: number;
  hourlyWage: number | null;
  subsidized?: boolean;
  verificationSource: VerificationSource;
  /** False when the document is identified but not in hand. */
  collected?: boolean;
  ssmPreApprovalRef?: string;
};

type FollowUpSeed = {
  monthsAfterJobStart: number;
  daysAgo: number;
  contactOutcome: "reached" | "no_response" | "declined_to_answer" | "unreachable";
  employed?: boolean;
  weeklyHours?: number;
};

type MilestoneSeed = {
  kind: "ies_month_1" | "ies_month_3" | "ies_month_6" | "ies_month_12" | "placement_start";
  daysAgo: number;
  cumulativeWeeks?: number;
  weeklyHoursAtMilestone?: number;
  evidenceNote: string;
};

type ClientSeed = {
  email: string;
  name: string;
  /** One sentence naming the verdict this client exists to produce. */
  demonstrates: string;
  employer: EmployerKey;
  jobTitle: string;
  nocCode: string;
  startedDaysAgo: number;
  endedDaysAgo?: number;
  endReason?: string;
  primaryJob?: boolean;
  enteredEmployedFullHours?: boolean;
  sameEmployerAsEntry?: boolean;
  attendanceDays: number;
  spells: SpellSeed[];
  followUps?: FollowUpSeed[];
  milestones?: MilestoneSeed[];
};

/**
 * Twelve clients, one per verdict the caseload screen has to be able to show.
 *
 * The `demonstrates` line on each is load-bearing during a demo: it is how you
 * answer "why is this one red?" without reading the engine aloud.
 */
export const DEMO_COHORT: ClientSeed[] = [
  {
    email: "amara.okonjo@example.invalid",
    name: "Amara Okonjo",
    demonstrates:
      "Clean claimable at months 1, 3, and 6. What every case is supposed to look like.",
    employer: "distribution",
    jobTitle: "Warehouse associate",
    nocCode: "75101",
    startedDaysAgo: 250,
    attendanceDays: 22,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: null,
        weeklyHours: 34,
        hourlyWage: 22.5,
        verificationSource: "pay_stub",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 1,
        daysAgo: 219,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 34,
      },
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 34,
      },
      {
        monthsAfterJobStart: 6,
        daysAgo: 67,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 34,
      },
    ],
    milestones: [
      { kind: "placement_start", daysAgo: 250, evidenceNote: "Offer letter, emailed by employer." },
      {
        kind: "ies_month_1",
        daysAgo: 219,
        cumulativeWeeks: 4.4,
        weeklyHoursAtMilestone: 34,
        evidenceNote: "Pay stub covering 2 Feb pay period. Five required fields present.",
      },
      {
        kind: "ies_month_3",
        daysAgo: 158,
        cumulativeWeeks: 13.1,
        weeklyHoursAtMilestone: 34,
        evidenceNote: "Pay stub covering checkpoint date.",
      },
      {
        kind: "ies_month_6",
        daysAgo: 67,
        cumulativeWeeks: 26.2,
        weeklyHoursAtMilestone: 34,
        evidenceNote: "Employment letter stating continuous employment and average weekly hours.",
      },
    ],
  },
  {
    email: "bassam.rahal@example.invalid",
    name: "Bassam Rahal",
    demonstrates:
      "Worked the hours all year, but the only thing on file is his own word. Self-report is not on the acceptable-evidence list at all.",
    employer: "grocer",
    jobTitle: "Order picker",
    nocCode: "75101",
    startedDaysAgo: 250,
    attendanceDays: 18,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: null,
        weeklyHours: 30,
        hourlyWage: 19.25,
        verificationSource: "client_self_report",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 1,
        daysAgo: 219,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 30,
      },
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 30,
      },
      {
        monthsAfterJobStart: 6,
        daysAgo: 67,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 30,
      },
    ],
  },
  {
    email: "corinne.dube@example.invalid",
    name: "Corinne Dubé",
    demonstrates:
      "Subsidized placement. Hours and paperwork are both fine and it still pays nothing, so chasing documents here is wasted effort.",
    employer: "manufacturing",
    jobTitle: "Production assistant",
    nocCode: "94106",
    startedDaysAgo: 150,
    attendanceDays: 20,
    spells: [
      {
        startDaysAgo: 150,
        endDaysAgo: null,
        weeklyHours: 35,
        hourlyWage: 23,
        subsidized: true,
        verificationSource: "pay_stub",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 1,
        daysAgo: 119,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 35,
      },
      {
        monthsAfterJobStart: 3,
        daysAgo: 58,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 35,
      },
    ],
    milestones: [
      {
        kind: "placement_start",
        daysAgo: 150,
        evidenceNote: "Initial pay stub showing zero cumulative hours.",
      },
    ],
  },
  {
    email: "devon.pritchard@example.invalid",
    name: "Devon Pritchard",
    demonstrates:
      "Half an hour a week short of the threshold. Nothing about the paperwork is wrong and the outcome is still worth nothing.",
    employer: "retail",
    jobTitle: "Sales associate",
    nocCode: "64100",
    startedDaysAgo: 250,
    attendanceDays: 15,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: null,
        weeklyHours: 19.5,
        hourlyWage: 18.5,
        verificationSource: "pay_stub",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 19.5,
      },
    ],
  },
  {
    email: "elif.kaya@example.invalid",
    name: "Elif Kaya",
    demonstrates:
      "Worked, stopped, restarted. Month 3 falls in the gap and is lost; months 1 and 6 hold. This is the case cumulative-week aggregation is undefined for.",
    employer: "hospitality",
    jobTitle: "Kitchen assistant",
    nocCode: "65201",
    startedDaysAgo: 300,
    attendanceDays: 19,
    spells: [
      {
        startDaysAgo: 300,
        endDaysAgo: 220,
        weeklyHours: 32,
        hourlyWage: 20,
        verificationSource: "pay_stub",
      },
      {
        startDaysAgo: 130,
        endDaysAgo: null,
        weeklyHours: 28,
        hourlyWage: 20.75,
        verificationSource: "employment_letter",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 1,
        daysAgo: 269,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 32,
      },
      { monthsAfterJobStart: 3, daysAgo: 209, contactOutcome: "reached", employed: false },
      {
        monthsAfterJobStart: 6,
        daysAgo: 118,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 28,
      },
    ],
    milestones: [
      {
        kind: "ies_month_1",
        daysAgo: 269,
        cumulativeWeeks: 4.4,
        weeklyHoursAtMilestone: 32,
        evidenceNote: "Pay stub covering checkpoint date.",
      },
      {
        kind: "ies_month_6",
        daysAgo: 118,
        cumulativeWeeks: 13.1,
        weeklyHoursAtMilestone: 28,
        evidenceNote:
          "Employment letter, second employment period. Cumulative weeks exclude the 90-day gap.",
      },
    ],
  },
  {
    email: "farah.nasser@example.invalid",
    name: "Farah Nasser",
    demonstrates:
      "Stopped answering the phone at month four. Three failed contact attempts are recorded, which is the effort no funder report has anywhere to put.",
    employer: "grocer",
    jobTitle: "Stock clerk",
    nocCode: "65102",
    startedDaysAgo: 250,
    endedDaysAgo: 110,
    endReason: "Left without notice",
    attendanceDays: 17,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: 110,
        weeklyHours: 30,
        hourlyWage: 19,
        verificationSource: "pay_stub",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 1,
        daysAgo: 219,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 30,
      },
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 30,
      },
      { monthsAfterJobStart: 4, daysAgo: 128, contactOutcome: "no_response" },
      { monthsAfterJobStart: 5, daysAgo: 97, contactOutcome: "no_response" },
      { monthsAfterJobStart: 6, daysAgo: 67, contactOutcome: "unreachable" },
    ],
    milestones: [
      {
        kind: "ies_month_1",
        daysAgo: 219,
        cumulativeWeeks: 4.4,
        weeklyHoursAtMilestone: 30,
        evidenceNote: "Pay stub covering checkpoint date.",
      },
      {
        kind: "ies_month_3",
        daysAgo: 158,
        cumulativeWeeks: 13.1,
        weeklyHoursAtMilestone: 30,
        evidenceNote: "Pay stub covering checkpoint date.",
      },
    ],
  },
  {
    email: "grigor.vasilev@example.invalid",
    name: "Grigor Vasilev",
    demonstrates:
      "Employer would not produce a letter, so this ran to the last resort: a caseworker attestation with a Service System Manager pre-approval reference on file.",
    employer: "manufacturing",
    jobTitle: "Machine operator",
    nocCode: "94106",
    startedDaysAgo: 250,
    attendanceDays: 21,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: null,
        weeklyHours: 24,
        hourlyWage: 21.4,
        verificationSource: "provider_attestation",
        ssmPreApprovalRef: "SSM-HN-2026-0418",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 24,
      },
      {
        monthsAfterJobStart: 6,
        daysAgo: 67,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 24,
      },
    ],
    milestones: [
      {
        kind: "ies_month_3",
        daysAgo: 158,
        cumulativeWeeks: 13.1,
        weeklyHoursAtMilestone: 24,
        evidenceNote:
          "Lead caseworker attestation. Employer declined three written requests; pre-approval SSM-HN-2026-0418 obtained before submission.",
      },
    ],
  },
  {
    email: "hana.matsuda@example.invalid",
    name: "Hana Matsuda",
    demonstrates:
      "Two part-time jobs summing to 26 hours. Job stacking is capped at 5% of clients per catchment, so this is flagged rather than counted.",
    employer: "retail",
    jobTitle: "Cashier",
    nocCode: "65100",
    startedDaysAgo: 250,
    attendanceDays: 16,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: null,
        weeklyHours: 12,
        hourlyWage: 18.2,
        verificationSource: "pay_stub",
      },
      {
        startDaysAgo: 240,
        endDaysAgo: null,
        weeklyHours: 14,
        hourlyWage: 18.2,
        verificationSource: "pay_stub",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 26,
      },
    ],
  },
  {
    email: "ibrahim.sesay@example.invalid",
    name: "Ibrahim Sesay",
    demonstrates:
      "Arrived already working 35 hours for this employer. Under the entry-state rule an outcome needs 20-plus hours with a different employer, so nothing here can ever be claimed.",
    employer: "distribution",
    jobTitle: "Shipper receiver",
    nocCode: "74201",
    startedDaysAgo: 200,
    enteredEmployedFullHours: true,
    sameEmployerAsEntry: true,
    attendanceDays: 24,
    spells: [
      {
        startDaysAgo: 200,
        endDaysAgo: null,
        weeklyHours: 35,
        hourlyWage: 24,
        verificationSource: "pay_stub",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 3,
        daysAgo: 108,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 35,
      },
    ],
  },
  {
    email: "joan.tremblay@example.invalid",
    name: "Joan Tremblay",
    demonstrates: "Started twelve days ago. Every checkpoint is still ahead of her.",
    employer: "hospitality",
    jobTitle: "Room attendant",
    nocCode: "65310",
    startedDaysAgo: 12,
    attendanceDays: 8,
    spells: [
      {
        startDaysAgo: 12,
        endDaysAgo: null,
        weeklyHours: 30,
        hourlyWage: 19.5,
        verificationSource: "offer_letter",
      },
    ],
    milestones: [
      { kind: "placement_start", daysAgo: 12, evidenceNote: "Offer letter from employer." },
    ],
  },
  {
    email: "kwame.asante@example.invalid",
    name: "Kwame Asante",
    demonstrates:
      "Thirty-four hours a week and a pay stub that would prove it, if anyone had it. Identified, not collected — the largest bucket on a real caseload.",
    employer: "distribution",
    jobTitle: "Forklift operator",
    nocCode: "75101",
    startedDaysAgo: 250,
    attendanceDays: 20,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: null,
        weeklyHours: 34,
        hourlyWage: 23.75,
        verificationSource: "pay_stub",
        collected: false,
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 34,
      },
      { monthsAfterJobStart: 6, daysAgo: 67, contactOutcome: "declined_to_answer" },
    ],
  },
  {
    email: "lucia.ferraro@example.invalid",
    name: "Lucia Ferraro",
    demonstrates:
      "Base wage recorded below general minimum wage because most of her pay is tips. Tips can count, so this needs a person to look at it rather than an automatic rejection.",
    employer: "hospitality",
    jobTitle: "Server",
    nocCode: "65200",
    startedDaysAgo: 250,
    attendanceDays: 14,
    spells: [
      {
        startDaysAgo: 250,
        endDaysAgo: null,
        weeklyHours: 30,
        hourlyWage: 15.2,
        verificationSource: "pay_stub",
      },
    ],
    followUps: [
      {
        monthsAfterJobStart: 3,
        daysAgo: 158,
        contactOutcome: "reached",
        employed: true,
        weeklyHours: 30,
      },
    ],
  },
];

/**
 * Checks and a share link for the first client, so the person-facing track and
 * share routes tell the same story as the provider caseload rather than
 * rendering a separate invented person.
 */
const FEATURED_CLIENT_EMAIL = DEMO_COHORT[0].email;

const FEATURED_ATTESTATIONS: {
  checkTypeKey: string;
  orgKey: string;
  daysUntilExpiry: number;
  restrictionCodes?: string[];
}[] = [
  { checkTypeKey: "medical.basic_contact", orgKey: "clinic", daysUntilExpiry: 300 },
  { checkTypeKey: "wellness.movement_floor", orgKey: "wellness", daysUntilExpiry: 60 },
  { checkTypeKey: "mental.check_in", orgKey: "mental", daysUntilExpiry: 90 },
  { checkTypeKey: "skills.placement_ready", orgKey: "skills", daysUntilExpiry: 150 },
  { checkTypeKey: "skills.reliability_window", orgKey: "skills", daysUntilExpiry: 100 },
  {
    checkTypeKey: "medical.work_clearance",
    orgKey: "clinic",
    daysUntilExpiry: 120,
    restrictionCodes: ["no_night_shift"],
  },
];

/** Stable token so the demo share URL does not change on every reseed. */
export const DEMO_SHARE_TOKEN = "demo-skills-view";

async function upsertUser(db: Database, email: string, name: string) {
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return existing.id;

  const [inserted] = await db
    .insert(users)
    .values({ email, name, emailVerified: new Date() })
    .returning();
  return inserted.id;
}

async function upsertOrganization(db: Database, name: string) {
  const [existing] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.name, name))
    .limit(1);
  if (existing) return existing.id;

  const [inserted] = await db
    .insert(organizations)
    .values({ name, kind: "employer", regulated: false })
    .returning();
  return inserted.id;
}

function at(now: number, daysAgo: number): Date {
  return new Date(now - daysAgo * DAY);
}

async function seedFeaturedPassport(db: Database, userId: string, orgIds: Map<string, string>) {
  // The attestor is the organization's own account. A real console would have
  // named clinicians; the demo needs one row per organization, not a directory.
  for (const seed of FEATURED_ATTESTATIONS) {
    const [checkType] = await db
      .select()
      .from(checkTypes)
      .where(eq(checkTypes.key, seed.checkTypeKey))
      .limit(1);
    if (!checkType)
      throw new Error(`Demo cohort references unknown check type: ${seed.checkTypeKey}`);

    const organizationId = orgIds.get(seed.orgKey);
    if (!organizationId) throw new Error(`Demo cohort references unknown org: ${seed.orgKey}`);

    const attestorUserId = await upsertUser(
      db,
      `attestor.${seed.orgKey}@example.invalid`,
      `${seed.orgKey} attestor`,
    );

    const now = Date.now();
    const [attestation] = await db
      .insert(attestations)
      .values({
        userId,
        checkTypeId: checkType.id,
        attestorUserId,
        organizationId,
        result: seed.restrictionCodes ? "restricted" : "pass",
        issuedAt: at(now, 14),
        expiresAt: new Date(now + seed.daysUntilExpiry * DAY),
      })
      .returning();

    for (const code of seed.restrictionCodes ?? []) {
      const [restriction] = await db
        .select()
        .from(restrictions)
        .where(eq(restrictions.code, code))
        .limit(1);
      if (!restriction) throw new Error(`Demo cohort references unknown restriction: ${code}`);

      await db
        .insert(attestationRestrictions)
        .values({ attestationId: attestation.id, restrictionId: restriction.id })
        .onConflictDoNothing();
    }
  }

  const [existingLink] = await db
    .select()
    .from(shareLinks)
    .where(eq(shareLinks.token, DEMO_SHARE_TOKEN))
    .limit(1);

  if (!existingLink) {
    await db.insert(shareLinks).values({
      userId,
      token: DEMO_SHARE_TOKEN,
      scope: "skills",
      recipientLabel: "Example Distribution Co. — hiring",
      expiresAt: new Date(Date.now() + 30 * DAY),
    });

    // A second, unrelated link with a real random token, so the access log and
    // the token generator are both exercised by the seed.
    await db.insert(shareLinks).values({
      userId,
      token: randomShareToken(),
      scope: "functional_abilities",
      recipientLabel: "Example Distribution Co. — accommodation discussion",
      expiresAt: new Date(Date.now() + 14 * DAY),
    });
  }
}

/**
 * Seed the cohort. Idempotent on client email: an existing client is skipped
 * whole rather than patched, because half-updating an evidence chain would
 * produce a record that is neither the old story nor the new one.
 */
export async function seedDemoCohort(db: Database, orgIds: Map<string, string>) {
  const providerId = orgIds.get("skills");
  if (!providerId) throw new Error("Demo cohort needs the skills organization to act as provider.");

  const employerIds = new Map<string, string>();
  for (const employer of COHORT_EMPLOYERS) {
    employerIds.set(employer.key, await upsertOrganization(db, employer.name));
  }

  const now = Date.now();
  let created = 0;

  for (const client of DEMO_COHORT) {
    const [existing] = await db.select().from(users).where(eq(users.email, client.email)).limit(1);
    if (existing) continue;

    const userId = await upsertUser(db, client.email, client.name);
    created += 1;

    await db
      .insert(tracks)
      .values({ userId, currentLevel: 2, attendanceDays: client.attendanceDays })
      .onConflictDoNothing();

    const employerId = employerIds.get(client.employer)!;

    const [referral] = await db
      .insert(referrals)
      .values({
        userId,
        direction: "outbound",
        fromOrganizationId: providerId,
        toOrganizationId: employerId,
        supported: true,
        status: "placed",
        sentAt: at(now, client.startedDaysAgo + 21),
        acceptedAt: at(now, client.startedDaysAgo + 7),
      })
      .returning();

    const [placement] = await db
      .insert(placements)
      .values({
        userId,
        employerOrganizationId: employerId,
        referralId: referral.id,
        jobTitle: client.jobTitle,
        nocCode: client.nocCode,
        startedOn: at(now, client.startedDaysAgo),
        endedOn: client.endedDaysAgo ? at(now, client.endedDaysAgo) : null,
        endReason: client.endReason ?? null,
        primaryJob: client.primaryJob ?? true,
        enteredEmployedFullHours: client.enteredEmployedFullHours ?? false,
        sameEmployerAsEntry: client.sameEmployerAsEntry ?? false,
      })
      .returning();

    for (const spell of client.spells) {
      const collected = spell.collected ?? true;
      await db.insert(employmentSpells).values({
        placementId: placement.id,
        periodStart: at(now, spell.startDaysAgo),
        periodEnd: spell.endDaysAgo === null ? null : at(now, spell.endDaysAgo),
        weeklyHours: spell.weeklyHours.toFixed(2),
        hourlyWage: spell.hourlyWage === null ? null : spell.hourlyWage.toFixed(2),
        subsidized: spell.subsidized ?? false,
        verificationSource: spell.verificationSource,
        verifiedByOrganizationId: collected ? providerId : null,
        verifiedAt: collected ? at(now, Math.max(spell.startDaysAgo - 30, 1)) : null,
        ssmPreApprovalRef: spell.ssmPreApprovalRef ?? null,
      });
    }

    for (const followUp of client.followUps ?? []) {
      await db.insert(outcomeFollowUps).values({
        userId,
        placementId: placement.id,
        monthsAfterJobStart: followUp.monthsAfterJobStart,
        contactedOn: at(now, followUp.daysAgo),
        contactOutcome: followUp.contactOutcome,
        employed: followUp.employed ?? null,
        weeklyHours: followUp.weeklyHours?.toFixed(2) ?? null,
      });
    }

    for (const milestone of client.milestones ?? []) {
      await db.insert(outcomeMilestones).values({
        userId,
        placementId: placement.id,
        kind: milestone.kind,
        achievedOn: at(now, milestone.daysAgo),
        cumulativeWeeks: milestone.cumulativeWeeks?.toFixed(2) ?? null,
        weeklyHoursAtMilestone: milestone.weeklyHoursAtMilestone?.toFixed(2) ?? null,
        evidenceNote: milestone.evidenceNote,
      });
    }

    if (client.email === FEATURED_CLIENT_EMAIL) {
      await seedFeaturedPassport(db, userId, orgIds);
    }
  }

  return { clients: DEMO_COHORT.length, created, employers: COHORT_EMPLOYERS.length };
}
