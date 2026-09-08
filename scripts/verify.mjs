#!/usr/bin/env node

/**
 * Runs Trampoline's verification pipeline in dependency order and records what each stage proved.
 *
 * The distinction this tool exists to make: an exit code says "something failed", while evidence
 * says "the suite ran 107 tests and all passed". Only the second lets anyone else check the claim.
 *
 * Ordering matters. A type error makes every later result meaningless, so the pipeline stops at
 * the first failure and reports the remaining stages as NOT RUN rather than letting silence read
 * as success.
 *
 * `next build` is deliberately excluded. It is slow enough that including it would discourage
 * running the pipeline at all; run it before shipping instead.
 *
 * Usage:
 *   npm run verify              stop at the first failing stage
 *   npm run verify -- --all     run every stage regardless of failures
 *   npm run verify -- --json    machine-readable evidence
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVIDENCE_PATH = path.join(REPO_ROOT, '.devenv', 'verify-report.json');

/**
 * Each stage names what passing it actually demonstrates, and extracts a specific number or fact
 * from the output. `evidence` returns a human-readable string, or null when the output did not
 * contain what was expected — which is itself worth reporting.
 */
const STAGES = [
  {
    id: 'typecheck',
    title: 'Type check',
    proves: 'Every TypeScript file compiles under strict mode.',
    command: 'npm',
    args: ['run', 'typecheck'],
    evidence: ({ code }) => (code === 0 ? 'tsc reported no type errors' : null),
  },
  {
    id: 'lint',
    title: 'Lint',
    proves: 'No ESLint errors. Warnings are allowed and counted.',
    command: 'npm',
    args: ['run', 'lint'],
    evidence: ({ stdout, stderr, code }) => {
      const summary = `${stdout}\n${stderr}`.match(
        /(\d+) problems? \((\d+) errors?, (\d+) warnings?\)/
      );
      if (summary) return `${summary[2]} error(s), ${summary[3]} warning(s)`;
      return code === 0 ? 'no problems reported' : null;
    },
  },
  {
    id: 'test',
    title: 'Tests',
    proves: 'The Vitest suite runs to completion and every test passes.',
    command: 'npm',
    args: ['test'],
    evidence: ({ stdout, stderr }) => {
      const combined = `${stdout}\n${stderr}`;

      // Vitest prints "Tests  107 passed (107)", or "Tests  1 failed | 106 passed (107)".
      const line = combined.match(/^\s*Tests\s+(.+?)\s*$/m);
      const fileTotal = combined.match(/^\s*Test Files\s+.*\((\d+)\)\s*$/m);

      // No counts means the suite did not run to completion. Reporting that as "passed" on the
      // strength of an exit code is the exact trap this tool exists to avoid.
      if (!line) return null;

      return fileTotal ? `${line[1]} in ${fileTotal[1]} files` : line[1];
    },
  },
  {
    id: 'contrast',
    title: 'Theme contrast',
    proves: 'Every theme colour pair meets WCAG 2.0 AA, as AODA requires.',
    command: 'npm',
    args: ['run', 'check:contrast'],
    evidence: ({ stdout, stderr }) => {
      const combined = `${stdout}\n${stderr}`;
      const failures = combined.match(/FAILURES:\s*(\d+)/);
      if (!failures) return null;

      // A contrast check that evaluated nothing would report zero failures and prove nothing, so
      // count the verdicts and require a plausible number of them.
      const verdicts = (combined.match(/\b(PASS|FAIL)\b/g) || []).length;
      if (verdicts === 0) return null;

      return failures[1] === '0'
        ? `${verdicts} colour pairs checked, 0 failures`
        : `${failures[1]} failing pair(s) of ${verdicts} checked`;
    },
  },
];

/**
 * Controls this pipeline cannot observe. Listed in every report so a clean run is never mistaken
 * for a statement about them: the pipeline reads the working tree, and none of these live there.
 */
const NOT_VERIFIABLE = [
  'Branch protection rules and required status checks (GitHub settings, not repository files)',
  'Whether CI actually ran these same commands on the last push',
  'Environment approval rules and deployment gates',
  'Secrets configured in GitHub Actions or the hosting platform, and who can read them',
  'Whether the deployed build matches this source tree',
  'That a full `next build` succeeds; this pipeline type-checks but does not build',
  'Runtime behavior against real Postgres; the seed tests run on in-process PGlite',
];

/**
 * Run one stage and classify the outcome.
 *
 * @param {object} stage A STAGES entry.
 * @returns {object} Result with status, evidence, and failure detail.
 */
function runStage(stage) {
  const started = Date.now();

  const result = spawnSync(stage.command, stage.args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });

  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const code = result.status;
  const durationMs = Date.now() - started;

  if (result.error) {
    return {
      ...describe(stage),
      status: 'failed',
      durationMs,
      evidence: null,
      detail: `Could not run ${stage.command}: ${result.error.message}`,
    };
  }

  const evidence = stage.evidence({ stdout, stderr, code });

  // Passing requires both a zero exit code and recognizable evidence. A stage that exits zero
  // without producing its expected output has not demonstrated anything.
  if (code === 0 && evidence) {
    return { ...describe(stage), status: 'passed', durationMs, evidence, detail: null };
  }

  if (code === 0 && !evidence) {
    return {
      ...describe(stage),
      status: 'inconclusive',
      durationMs,
      evidence: null,
      detail: 'Exited zero but produced no recognizable evidence, so nothing was demonstrated.',
    };
  }

  return {
    ...describe(stage),
    status: 'failed',
    durationMs,
    evidence,
    detail: failureDetail(stdout, stderr),
  };
}

/**
 * Static description of a stage, shared by every result shape.
 *
 * @param {object} stage A STAGES entry.
 * @returns {object} Identifying fields.
 */
function describe(stage) {
  return {
    id: stage.id,
    title: stage.title,
    proves: stage.proves,
    command: [stage.command, ...stage.args].join(' '),
  };
}

/**
 * The last lines of output, where the actual error almost always is.
 *
 * @param {string} stdout Standard output.
 * @param {string} stderr Standard error.
 * @returns {string} Trimmed tail.
 */
function failureDetail(stdout, stderr) {
  const combined = `${stdout}\n${stderr}`
    .split('\n')
    .map(line => line.trimEnd())
    .filter(Boolean);

  return combined.slice(-15).join('\n') || 'No output.';
}

function main() {
  const args = process.argv.slice(2);
  const runAll = args.includes('--all');
  const asJson = args.includes('--json');

  const results = [];
  let stopped = false;

  for (const stage of STAGES) {
    if (stopped && !runAll) {
      results.push({
        ...describe(stage),
        status: 'not run',
        durationMs: 0,
        evidence: null,
        detail: 'Skipped because an earlier stage failed. This is not a pass.',
      });
      continue;
    }

    if (!asJson) process.stdout.write(`  ${stage.title}... `);

    const result = runStage(stage);
    results.push(result);

    if (!asJson) {
      const seconds = (result.durationMs / 1000).toFixed(1);
      console.log(
        result.status === 'passed'
          ? `passed  (${result.evidence}, ${seconds}s)`
          : `${result.status.toUpperCase()}  (${seconds}s)`
      );
    }

    if (result.status !== 'passed') stopped = true;
  }

  const failed = results.filter(r => r.status === 'failed' || r.status === 'inconclusive');
  const notRun = results.filter(r => r.status === 'not run');
  const passed = results.filter(r => r.status === 'passed');

  const report = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    platform: process.platform,
    verified: failed.length === 0 && notRun.length === 0,
    summary: {
      passed: passed.length,
      failed: failed.length,
      notRun: notRun.length,
      total: results.length,
    },
    stages: results,
    notVerifiedFromRepositoryContents: NOT_VERIFIABLE,
  };

  try {
    fs.mkdirSync(path.dirname(EVIDENCE_PATH), { recursive: true });
    fs.writeFileSync(EVIDENCE_PATH, JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`Warning: could not write evidence to ${EVIDENCE_PATH}: ${error.message}`);
  }

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.verified ? 0 : 1;
    return;
  }

  console.log('');

  for (const result of failed) {
    console.log(`${result.title} ${result.status}:`);
    console.log(`  command: ${result.command}`);
    if (result.detail) {
      console.log(
        result.detail
          .split('\n')
          .map(line => `  ${line}`)
          .join('\n')
      );
    }
    console.log('');
  }

  if (notRun.length > 0) {
    console.log(
      `Not run (an earlier stage failed): ${notRun.map(r => r.title).join(', ')}.\n` +
        'These stages proved nothing. Do not read their silence as success.\n'
    );
  }

  console.log('Not verified from repository contents:');
  for (const item of NOT_VERIFIABLE) console.log(`  - ${item}`);
  console.log('');

  if (report.verified) {
    console.log(`Verified: ${passed.length} of ${results.length} stages passed with evidence.`);
  } else {
    console.log(
      `Not verified: ${passed.length} of ${results.length} stages passed. ` +
        `Evidence in ${path.relative(REPO_ROOT, EVIDENCE_PATH)}.`
    );
  }

  process.exitCode = report.verified ? 0 : 1;
}

main();
