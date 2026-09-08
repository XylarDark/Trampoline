# Cursor Rules

These rules come from [DevEnvTemplate](https://github.com/XylarDark/DevEnvTemplate),
embedded in this repo at `.devenv/`. The doctor selected the subset matching
Trampoline's stack, so the Python and game-engine rules are deliberately absent.

## Always applied

- **00-core-principles.mdc** — reasoning transparency, pre-flight checklist
- **01-code-quality.mdc** — organization, design principles, performance
- **02-security.mdc** — OWASP Top 10, secrets management
- **03-testing.mdc** — testing philosophy and structure
- **04-git-workflow.mdc** — commit messages, branch naming
- **05-error-handling.mdc** — defensive programming, edge cases
- **06-documentation.mdc** — comments and documentation standards
- **07-ai-agent-behavior.mdc** — agent tool usage, session cleanup
- **08-project-context.mdc** — **Trampoline-specific.** Written for this repo,
  not copied from the template. Holds the load-bearing evidence rules, the
  legal constraints, and the SR&ED commit discipline.
- **16-feature-debug-instrumentation.mdc** — debug instrumentation policy
- **17-plan-first.mdc** — plan before multi-file work
- **18-content-and-data-pipelines.mdc** — non-destructive pipelines
- **19-docs-directory-structure.mdc** — follow [docs/DOCS_LAYOUT.md](../../docs/DOCS_LAYOUT.md)
- **automation-standards.mdc** — API → script → UI; log gaps in
  [docs/operational/automation-gaps.md](../../docs/operational/automation-gaps.md)

## Conditional (loaded by file type)

- **10-typescript.mdc** — `**/*.ts`, `**/*.tsx`
- **13-markdown.mdc** — `**/*.md`
- **14-json-yaml.mdc** — `**/*.json`, `**/*.yaml`, `**/*.yml`
- **15-shell-scripts.mdc** — `**/*.sh`, `**/*.ps1`, `**/*.mjs` tooling
- **20-frontend-frameworks.mdc** — `app/**`, `components/**`

## Updating

Rules other than `08-project-context.mdc` are template-owned. To pull template
improvements, sync `.devenv/` (see `.devenv/docs/SYNC.md`) and re-run
`npm run doctor --prefix .devenv`. Edit `08-project-context.mdc` freely — it
belongs to this repo and the template will not overwrite it.
