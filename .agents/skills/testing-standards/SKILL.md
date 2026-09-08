---
name: testing-standards
description: Use when adding or updating tests, setting up a test framework, or reviewing coverage - covers the test pyramid, AAA structure, isolation, per-tier time budgets, and this repo's Vitest layout.
---

# Testing standards

Tests document expected behavior. Write many small, fast, isolated tests instead of a few
large ones, and test behavior rather than implementation. Aim for high coverage of critical
paths; 100% is not the goal.

**Scope.** These standards describe how to test a **settled** area. Where `AGENTS.md` marks an
area as **shaping**, its design is still being decided, tests are optional, and logging is the
evidence instead; the obligations below are owed when that area is promoted. `src/engine/` and
`src/db/` are settled, so nothing here is optional for them.

## Test pyramid

- **Unit (~70%):** individual functions and classes, fully isolated.
- **Integration (~20%):** interactions between components.
- **End-to-end (~10%):** complete user workflows.

## How tests run in this repo

- Runner: **Vitest**. `npm test` runs `vitest run` once and exits.
- Location: tests sit next to the code they cover, as `*.test.ts` beside the module.
- Tests import TypeScript source directly. There is no build step before testing.

| Command | Runs |
| --- | --- |
| `npm test` | The whole suite, once |
| `npm run typecheck` | `tsc --noEmit`, no tests |
| `npm run check:contrast` | The theme contrast gate |
| `npm run verify` | Typecheck, lint, tests, and contrast, with evidence per stage |

Pass extra flags through the `--` separator, or npm swallows them:

```bash
npm test -- -t "validates input"   # correct
npm test -t "validates input"      # wrong: npm eats the flag
```

## Structure: arrange, act, assert

```ts
import { expect, test } from 'vitest';

test('calculates total with tax', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  const taxRate = 0.1;

  // Act
  const total = calculateTotal(items, taxRate);

  // Assert
  expect(total).toBe(33);
});
```

## Naming

Describe the behavior and the scenario: `returns an error when the email is invalid`, not
`test email`. Say what should happen and under which condition.

## Coverage

Cover the happy path, the error cases, and the edge cases: empty inputs, null values,
boundary conditions, and concurrent access where it applies.

## Isolation

- Each test runs independently and in any order.
- No shared mutable state between tests.
- Clean up in an `afterEach` hook — real temp directories, created files, open handles.
- Use fixtures for test data and mock external dependencies.
- Use real temp directories rather than an in-memory filesystem mock.

## Time budgets

| Tier | Budget (total) |
| --- | --- |
| Unit | < 5 s |
| Integration | < 60 s |
| End-to-end | < 5 min |

Give every test a timeout and cancel anything that exceeds it, so a hung test fails loudly
instead of stalling CI.

## Adding a test framework to a new project

When a project has no test setup yet (this repo already uses Vitest, so this section does not
apply here):

1. **Dependencies first.** Add the runner, test utilities, type definitions, and any
   environment package (such as `jsdom`) to `devDependencies` before writing tests.
2. **Configuration.** Add the runner's config file and a shared setup/helpers module.
3. **Scripts.** Add `test`, and `test:watch` and `test:coverage` where the runner supports
   them.
4. **Verify.** Install, write one trivial test, and run the suite to confirm the wiring works
   before writing real tests.

## Checklist

- [ ] New behavior has tests
- [ ] Tests are fast and isolated
- [ ] Error cases tested
- [ ] Edge cases covered
- [ ] Tests are readable and maintainable
