# Testing

> [!NOTE]
> This document describes the testing strategy, how to run tests, what is tested, test structure, how to add new tests, and coverage targets.

---

## Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [What Is Tested](#what-is-tested)
- [Test Structure](#test-structure)
- [How to Add Tests](#how-to-add-tests)
- [Coverage Targets](#coverage-targets)

---

## Overview

The N-Queens Puzzle Game uses **Vitest** as its test runner. Vitest was chosen for its Vite-native integration, fast execution, ESM support, and TypeScript compatibility out of the box. See [DECISIONS.md](./DECISIONS.md) for the full comparison with Jest.

**Testing philosophy:**
- **Core logic gets the most coverage.** The `core/` directory contains pure functions that are easy to test and critical to correctness. Target: **>90% coverage**.
- **Config is validated.** Configuration files are tested to ensure consistency (e.g., all campaign levels are solvable, all achievement conditions reference valid types).
- **Store logic is tested.** Zustand slices are tested by invoking actions and asserting state changes.
- **Components get smoke tests.** Key UI components have rendering tests to catch regressions, but exhaustive visual testing is deferred to manual QA and future Storybook integration.

---

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

This generates a coverage report in `coverage/` and prints a summary to the terminal. Coverage is reported per directory to make it easy to verify the `core/` target.

### Run a specific test file

```bash
npx vitest run src/core/__tests__/solver.test.ts
```

### Run tests matching a pattern

```bash
npx vitest run --grep "backtracking"
```

### Run only core tests

```bash
npx vitest run src/core/
```

---

## What Is Tested

### Core Logic (`src/core/`)

| Module | What Is Tested |
|--------|---------------|
| `board.ts` | Board creation, queen placement/removal, board cloning, query functions |
| `solver.ts` | Backtracking solver correctness for N=1–12, bitmask solver correctness, solution counting, partial board solving, edge cases (N=2, N=3 returning 0 solutions) |
| `scoring.ts` | Score calculation formula, boundary conditions (0 time, max hints, optimal moves), star threshold calculation |
| `hints.ts` | Hint generation for each tier, hint selection (most constrained row), behavior when board is unsolvable |
| `validation.ts` | Conflict detection (row, column, diagonal, anti-diagonal), full board validation, partial board validation |
| `daily.ts` | Seeded puzzle generation determinism (same date → same puzzle), board size distribution, date edge cases |
| `types.ts` | Type guards and assertion functions |

### Configuration (`src/config/`)

| Module | What Is Tested |
|--------|---------------|
| `levels.config.ts` | All campaign levels are solvable (pre-placed queens allow valid completion), level IDs are unique, chapter unlocks are monotonically increasing |
| `scoring.config.ts` | Par times exist for all board sizes, star thresholds are in ascending order |
| `achievements.config.ts` | Achievement IDs are unique, conditions reference valid types |
| `game.config.ts` | Solution counts match computed values for N=1–8, time limits exist for all board sizes |

### Store (`src/store/`)

| Module | What Is Tested |
|--------|---------------|
| `gameSlice.ts` | State machine transitions (idle → playing → paused → won/lost), move actions, undo/redo behavior, timer tick, scoring on win |
| `progressSlice.ts` | Coin earning/spending, XP accumulation, level completion, daily streak logic |
| `settingsSlice.ts` | Settings update, reset to defaults |

### Components (`src/components/`)

| Priority | What Is Tested |
|----------|---------------|
| High | Board renders correct number of cells, Cell click handlers fire, Queen renders in correct cells |
| Medium | GameButton variants render correctly, GameModal open/close behavior, Timer displays formatted time |
| Low | Visual snapshot tests (deferred to Storybook/Chromatic in V2) |

---

## Test Structure

Tests are co-located with source code using the `__tests__/` directory convention:

```
src/
├── core/
│   ├── board.ts
│   ├── solver.ts
│   ├── __tests__/
│   │   ├── board.test.ts
│   │   ├── solver.test.ts
│   │   ├── scoring.test.ts
│   │   ├── hints.test.ts
│   │   ├── validation.test.ts
│   │   └── daily.test.ts
│   └── ...
├── config/
│   ├── __tests__/
│   │   ├── levels.test.ts
│   │   └── achievements.test.ts
│   └── ...
├── store/
│   ├── __tests__/
│   │   ├── gameSlice.test.ts
│   │   ├── progressSlice.test.ts
│   │   └── settingsSlice.test.ts
│   └── ...
└── components/
    ├── __tests__/
    │   ├── Board.test.tsx
    │   ├── GameButton.test.tsx
    │   └── ...
    └── ...
```

### Test file conventions

- **File name:** `<module>.test.ts` (or `.test.tsx` for components)
- **Describe blocks:** Mirror the module's function names
- **Test names:** Use `it('should ...')` format for readability
- **Arrange-Act-Assert:** Each test follows the AAA pattern

```typescript
// Example test structure
import { describe, it, expect } from 'vitest';
import { detectConflicts } from '../validation';

describe('detectConflicts', () => {
  it('should return empty set for valid placement', () => {
    // Arrange
    const queens = [1, 3, 0, 2]; // Valid 4×4 solution

    // Act
    const conflicts = detectConflicts(queens, 4);

    // Assert
    expect(conflicts.size).toBe(0);
  });

  it('should detect column conflicts', () => {
    // Arrange
    const queens = [0, 0, -1, -1]; // Two queens in column 0

    // Act
    const conflicts = detectConflicts(queens, 4);

    // Assert
    expect(conflicts.has('0,0')).toBe(true);
    expect(conflicts.has('1,0')).toBe(true);
  });
});
```

---

## How to Add Tests

### Adding a test for a core function

1. Open (or create) the `__tests__/<module>.test.ts` file in the same directory as the source.
2. Import the function under test.
3. Add a `describe` block for the function.
4. Write `it` blocks covering:
   - **Happy path:** Normal expected behavior
   - **Edge cases:** Empty input, boundary values, maximum values
   - **Error cases:** Invalid input, impossible configurations
5. Run `npm test` to verify.

### Adding a test for a store action

1. Open `src/store/__tests__/<slice>.test.ts`.
2. Create a fresh store instance in a `beforeEach` block (or use Zustand's `createStore` for isolation).
3. Call the action.
4. Assert the resulting state.

### Adding a test for a component

1. Open `src/components/__tests__/<Component>.test.tsx`.
2. Use `@testing-library/react` to render the component.
3. Assert that expected elements are in the document.
4. Simulate user interactions and assert results.

> [!TIP]
> When testing `core/` functions, you **do not** need any React testing utilities. Import the function directly and test with plain `expect()` assertions. This is one of the key benefits of the pure `core/` architecture.

---

## Coverage Targets

| Directory | Target | Rationale |
|-----------|--------|-----------|
| `src/core/` | **>90%** | Pure business logic — critical correctness, easy to test |
| `src/config/` | **>80%** | Validate consistency and correctness of game data |
| `src/store/` | **>80%** | State transitions must be correct |
| `src/components/` | **>50%** | Smoke tests for rendering; visual testing deferred |
| `src/hooks/` | **>60%** | Hook logic tested via store and integration tests |
| `src/services/` | **>60%** | I/O wrappers tested with mocked adapters |
| **Overall** | **>75%** | Balanced target for V1 |

> [!IMPORTANT]
> The `>90%` target for `core/` is a **hard requirement**. PRs that reduce `core/` coverage below 90% must not be merged. Other targets are soft guidelines for V1.

Coverage is tracked in CI (when configured) and can be checked locally with:

```bash
npm run test:coverage
```
