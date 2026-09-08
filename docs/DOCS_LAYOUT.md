# Documentation directory layout (canonical)

**Purpose:** the single place that defines where documentation belongs in this
repo. Place new docs under the right subdirectory and keep the root tidy.

**Policy:** do not add a new bucket at `docs/` root without updating this file
first. The Cursor rule
[19-docs-directory-structure.mdc](../.cursor/rules/19-docs-directory-structure.mdc)
points here.

Note that Trampoline's documentation is unusual: most of it is **business and
funding evidence**, not engineering reference. The layout reflects that.

---

## Repo root

Three documents live at the repo root on purpose, because they are entry points
rather than reference material.

| File | Purpose |
|------|---------|
| [README.md](../README.md) | What the project is, how to run it, what is and is not real yet |
| [STRATEGY.md](../STRATEGY.md) | Audience, wedge, key metrics, honest risks |
| [AGENTS.md](../AGENTS.md) | Always-true facts for coding agents |

Do not add further documents to the repo root.

---

## `docs/` root — entry points

| File | Purpose |
|------|---------|
| **DOCS_LAYOUT.md** | This file |
| [business-design.md](business-design.md) | The full business design, including the funded-outcome definition. Mirrored to a Google Doc; **this file is the source of truth** |
| [execution-strategy.md](execution-strategy.md) | Beachhead, MVP order, outreach motion, capital strategy, risks |
| [KNOWN_ERRORS.md](KNOWN_ERRORS.md) | Recurring errors and their fixes, append-only |

---

## Topic subdirectories

| Directory | Purpose | Contents |
|-----------|---------|----------|
| **funding/** | Evidence and playbooks for specific funders | SR&ED log, verified facts, IRAP/TPON, SWIF, WSIB |
| **outreach/** | Interview guides, target frameworks, contacts | retention interviews, gate falsification, Ontario outcome framework, contacts, demo screen briefing |
| **research/** | Background research that informs the design | competitive landscape, evidence and economics, funding landscape, legal and privacy |
| **operational/** | Automation limits and recurring chores | [automation-gaps.md](operational/automation-gaps.md) |

Create a subdirectory only when you have a document to put in it, then add a row
here in the same change.

### Folders we deliberately do not have

`adr/`, `runbooks/`, `deployment/`, `api/`, and `architecture/` are absent
because the codebase is small enough that `README.md` plus the engine's own
docstrings cover it. Add them when that stops being true — and add the row here
first.

---

## Special rules for this repo

- **`funding/sred-log.md` is contemporaneous evidence.** Append entries; never
  rewrite history in it. Commit it **separately from the code it describes**,
  and before or alongside that code. Its value to a CRA reviewer depends on
  provable dates.
- **`business-design.md` is mirrored to a Google Doc.** When you change one,
  change the other, and keep the provenance line in the Doc pointing back here.
- **Outreach guides encode a no-demo rule** in specific sections. Read the
  surrounding text before adding demo material to an interview script.
