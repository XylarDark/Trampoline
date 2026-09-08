#!/usr/bin/env node

/**
 * Trampoline's hardening gate: the one-time, repo-wide check run when features and taste are
 * locked and the product is about to be deployed.
 *
 * `verify.mjs` answers "is the tree sound right now" and is meant to be cheap enough to run
 * constantly. This answers "is this safe to put in front of real people", and is meant to be run
 * once per release. It therefore includes the things verify deliberately leaves out: a full
 * `next build`, the dependency audit that CI runs `continue-on-error`, registry signatures, a
 * secret scan, and a check that no placeholder credential is about to ship.
 *
 * It cannot clear this project for real health data. That gate is the 13 preconditions in
 * docs/research/legal-and-privacy.md, most of which are legal rather than technical, and it is
 * printed here rather than duplicated.
 *
 * Usage:
 *   npm run preflight            run every stage, report evidence
 *   npm run preflight -- --json  machine-readable evidence
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runStage, summarize } from "./pipeline.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_PATH = path.join(REPO_ROOT, ".devenv", "preflight-report.json");

/** True when `gitleaks` is on PATH. Absence makes the secret scan `not run`, never a pass. */
function hasGitleaks() {
  const probe = spawnSync("gitleaks", ["version"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  return !probe.error && probe.status === 0;
}

const STAGES = [
  {
    id: "verify",
    title: "Verify pipeline",
    proves: "Types, lint, the Vitest suite, and theme contrast are all sound.",
    command: "node",
    args: ["scripts/verify.mjs", "--json"],
    evidence: ({ stdout }) => {
      const report = parseJsonReport(stdout);
      if (!report?.summary) return null;

      return report.verified
        ? `${report.summary.passed} of ${report.summary.total} verify stages passed with evidence`
        : null;
    },
  },
  {
    id: "build",
    title: "Production build",
    proves: "A full `next build` succeeds, which verify.mjs skips for speed.",
    command: "npm",
    args: ["run", "build"],
    evidence: ({ stdout, stderr }) => {
      const combined = `${stdout}\n${stderr}`;
      const routes = combined.match(/Route \(app\)/);
      return routes ? "next build produced the route manifest" : null;
    },
  },
  {
    id: "audit",
    title: "Dependency audit",
    proves: "No known vulnerability at high severity or above in the dependency tree.",
    // Blocking here on purpose. The `audit` job in .github/workflows/ci.yml runs this
    // continue-on-error, which means CI reports the finding and merges anyway. That is a
    // reasonable default while shaping and the wrong one at a release gate.
    command: "npm",
    args: ["audit", "--audit-level=high"],
    evidence: ({ stdout, stderr }) => {
      const found = `${stdout}\n${stderr}`.match(/found (\d+) vulnerabilit/i);
      return found ? `${found[1]} vulnerabilities at high or above` : null;
    },
  },
  {
    id: "signatures",
    title: "Registry signatures",
    proves: "Installed packages match what the registry signed, so the supply chain is intact.",
    command: "npm",
    args: ["audit", "signatures"],
    evidence: ({ stdout, stderr }) => {
      const verified = `${stdout}\n${stderr}`.match(
        /(\d+) packages? have verified registry signatures/i,
      );
      return verified ? `${verified[1]} packages have verified registry signatures` : null;
    },
  },
  {
    id: "secrets",
    title: "Secret scan",
    proves: "No credential is committed anywhere in the history gitleaks scanned.",
    command: "gitleaks",
    args: ["detect", "--no-banner", "--redact"],
    available: hasGitleaks,
    unavailableDetail:
      "gitleaks is not installed, so no secret scan ran. This is NOT a pass: nothing else in " +
      "this project scans for committed credentials. Install it (winget install gitleaks, " +
      "brew install gitleaks) and run preflight again.",
    evidence: ({ stdout, stderr }) => {
      // gitleaks writes its summary to stderr. Insisting on the count rather than trusting the
      // exit code is the point: a scanner that found nothing because it scanned nothing exits
      // zero too.
      const combined = `${stdout}\n${stderr}`;
      const leaks = combined.match(/(\d+) leaks? found/i);
      if (leaks) return `${leaks[1]} leaks found`;

      return /no leaks found/i.test(combined) ? "0 leaks found" : null;
    },
  },
  {
    id: "placeholders",
    title: "Placeholder credentials",
    proves: "No environment file still carries a fake value copied from .env.example.",
    command: "node",
    args: ["scripts/check-placeholder-credentials.mjs"],
    evidence: ({ stdout, stderr }) => {
      const combined = `${stdout}\n${stderr}`;
      const checked = combined.match(/Checked (\d+) variables/);
      const findings = combined.match(/PLACEHOLDER CREDENTIALS: (\d+)/);

      // Both numbers are required. The count of findings alone would read as a pass on a run that
      // compared nothing, which is exactly what happens when no environment file is present.
      if (!checked || !findings || findings[1] !== "0") return null;

      return `${checked[1]} variables checked, 0 placeholders in use`;
    },
  },
];

/**
 * Pull a pretty-printed JSON report out of mixed output. Tools log around their report, so this
 * tries each line that begins a JSON object rather than assuming the first brace starts it.
 *
 * @param {string} stdout Captured output.
 * @returns {object|null} The parsed report, or null when there is none.
 */
function parseJsonReport(stdout) {
  const lines = stdout.split("\n").map((line) => line.trimEnd());
  const starts = lines.flatMap((line, i) => (line === "{" ? [i] : []));
  const ends = lines.flatMap((line, i) => (line === "}" ? [i] : [])).reverse();

  for (const start of starts) {
    for (const end of ends) {
      if (end <= start) continue;

      try {
        return JSON.parse(lines.slice(start, end + 1).join("\n"));
      } catch {
        // Not the report's extent - a tool logged before or after it. Keep looking.
      }
    }
  }

  return null;
}

/**
 * Controls a release depends on that no command in this repository can observe.
 *
 * The legal preconditions are referenced, not restated. There are 13 of them, most need a lawyer
 * rather than a developer, and a summary here would go stale against the document that owns them.
 */
const REQUIRES_SIGN_OFF = [
  "The 13 preconditions in docs/research/legal-and-privacy.md, which gate storing one real " +
    "person's real health-derived data. Seven are legal or organizational and cannot be " +
    "satisfied by any change to this repository",
  "The CSP still uses `unsafe-inline` on script-src. next.config.ts says to move to the " +
    "nonce-based policy before this handles real client data; that is a gate item, not a TODO",
  "Security headers as served: CSP and HSTS on a response from the running deployment, not as " +
    "configured in a file. Middleware order, a proxy, or a CDN can drop them",
  "Branch protection rules and required status checks (GitHub settings, not repository files)",
  "Environment approval rules and deployment gates",
  "Secrets configured in GitHub Actions or the hosting platform, and who can read them",
  "Whether the deployed build was made from this commit of this tree",
  "Secret rotation, and that production secrets are separate from every other environment",
  "That a rollback has been tested, not merely described",
  "Runtime behavior against real Postgres; the seed tests run on in-process PGlite",
];

function main() {
  const asJson = process.argv.slice(2).includes("--json");
  const results = [];

  if (!asJson) {
    console.log("\nHardening preflight. Every stage runs; none is skipped on an earlier failure,");
    console.log("because at release time you want the whole list, not the first item on it.\n");
  }

  for (const stage of STAGES) {
    if (!asJson) process.stdout.write(`  ${stage.title}... `);

    const result = runStage(stage, REPO_ROOT);
    results.push(result);

    if (!asJson) {
      const seconds = (result.durationMs / 1000).toFixed(1);
      console.log(
        result.status === "passed"
          ? `passed  (${result.evidence}, ${seconds}s)`
          : `${result.status.toUpperCase()}  (${seconds}s)`,
      );
    }
  }

  const { failed, notRun, passed, verified, counts } = summarize(results);

  const report = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    platform: process.platform,
    // `cleared` is the gate's verdict on what it could check. It is never a statement about the
    // sign-off list below, which no run of this command can satisfy.
    cleared: verified,
    summary: counts,
    stages: results,
    requiresHumanSignOff: REQUIRES_SIGN_OFF.map((item) => ({ item, status: "requires sign-off" })),
  };

  try {
    fs.mkdirSync(path.dirname(EVIDENCE_PATH), { recursive: true });
    fs.writeFileSync(EVIDENCE_PATH, JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`Warning: could not write evidence to ${EVIDENCE_PATH}: ${error.message}`);
  }

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.cleared ? 0 : 1;
    return;
  }

  console.log("");

  for (const result of [...failed, ...notRun]) {
    console.log(`${result.title} ${result.status.toUpperCase()}:`);
    console.log(`  command: ${result.command}`);
    if (result.detail) {
      console.log(
        result.detail
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n"),
      );
    }
    console.log("");
  }

  console.log("A human owns these. No run of this command can clear them:");
  for (const item of REQUIRES_SIGN_OFF) console.log(`  [ ] ${item}`);
  console.log("");
  console.log("Work them with the hardening pass in .agents/skills/secure-coding/SKILL.md.\n");

  if (report.cleared) {
    console.log(
      `Preflight cleared ${passed.length} of ${results.length} stages with evidence. ` +
        "The sign-off list above is still open.",
    );
  } else {
    console.log(
      `Preflight did not clear: ${passed.length} of ${results.length} stages passed. ` +
        `Evidence in ${path.relative(REPO_ROOT, EVIDENCE_PATH)}.`,
    );
  }

  // `not run` and `inconclusive` block just as a failure does. The gate's whole premise is that
  // silence is not evidence, so a missing scanner cannot be the reason a release proceeds.
  process.exitCode = report.cleared ? 0 : 1;
}

main();
