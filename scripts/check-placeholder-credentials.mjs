#!/usr/bin/env node

/**
 * Fails when a local environment file still carries a placeholder value from `.env.example`.
 *
 * `.env.example` exists to be copied, and a copied file keeps its fake values until somebody
 * replaces them. `AUTH_SECRET=replace-me` is the worst case here: nothing validates it at startup,
 * so a deployment that never replaced it would authenticate sessions with a value published in
 * this repository, and every check this project has would still pass.
 *
 * Only names are printed, never values. A value in an environment file may be a real secret by the
 * time this runs, which is the outcome it is checking for.
 *
 * Usage:
 *   node scripts/check-placeholder-credentials.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TEMPLATE = ".env.example";

/** Files a developer or a deployment might have copied the template into. */
const CANDIDATES = [".env", ".env.local", ".env.production", ".env.production.local"];

/** Values that are obviously stand-ins. Matched against the template, not against user data. */
const PLACEHOLDER = /^(replace[-_]?me|change[-_]?me|your[-_].*|todo|tbd|xxx+|placeholder.*)$/i;

/** Keys whose value is a credential, where reusing the template's value is a finding by itself. */
const CREDENTIAL_KEY = /(SECRET|TOKEN|PASSWORD|PRIVATE_KEY|_KEY|CREDENTIAL)/i;

/**
 * Parse a dotenv file into key/value pairs, ignoring comments and blank lines.
 *
 * @param {string} file Absolute path.
 * @returns {Map<string, string>} Keys to unquoted values.
 */
function parseEnv(file) {
  const entries = new Map();

  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }
    entries.set(match[1], match[2].trim().replace(/^["']|["']$/g, ""));
  }

  return entries;
}

function main() {
  const templatePath = path.join(REPO_ROOT, TEMPLATE);

  if (!fs.existsSync(templatePath)) {
    console.error(`No ${TEMPLATE} to compare against, so nothing was checked.`);
    process.exitCode = 1;
    return;
  }

  const template = parseEnv(templatePath);
  const present = CANDIDATES.filter((name) => fs.existsSync(path.join(REPO_ROOT, name)));

  if (present.length === 0) {
    // Not a pass. There is no environment file here to inspect, which says nothing about the one
    // the deployment uses. The caller must treat a missing count as "not checked".
    console.error(
      `NOT CHECKED: none of ${CANDIDATES.join(", ")} exists in this tree. ` +
        "Run this against the environment the deployment actually uses.",
    );
    process.exitCode = 1;
    return;
  }

  const findings = [];

  for (const name of present) {
    const actual = parseEnv(path.join(REPO_ROOT, name));

    for (const [key, templateValue] of template) {
      if (!templateValue || !actual.has(key)) {
        continue;
      }

      const value = actual.get(key);
      if (value !== templateValue) {
        continue;
      }

      if (PLACEHOLDER.test(value)) {
        findings.push(`${name}: ${key} is still the placeholder from ${TEMPLATE}`);
      } else if (CREDENTIAL_KEY.test(key)) {
        findings.push(`${name}: ${key} is a credential and matches the value in ${TEMPLATE}`);
      }
    }
  }

  console.log(
    `Checked ${template.size} variables from ${TEMPLATE} against ${present.length} ` +
      `environment file(s): ${present.join(", ")}.`,
  );

  if (findings.length > 0) {
    console.error(`\nPLACEHOLDER CREDENTIALS: ${findings.length}`);
    for (const finding of findings) {
      console.error(`  - ${finding}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("PLACEHOLDER CREDENTIALS: 0");
}

main();
