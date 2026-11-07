# Contributing

> [!NOTE]
> This document outlines coding standards, naming conventions, and step-by-step guides for common tasks like adding levels, game modes, achievements, themes, and board variants.

---

## Table of Contents

- [Coding Standards](#coding-standards)
- [File Naming](#file-naming)
- [How to Add a New Level](#how-to-add-a-new-level)
- [How to Add a New Game Mode](#how-to-add-a-new-game-mode)
- [How to Add an Achievement](#how-to-add-an-achievement)
- [How to Add a Board Theme](#how-to-add-a-board-theme)
- [How to Add a Board Variant](#how-to-add-a-board-variant)
- [PR Checklist](#pr-checklist)

---

## Coding Standards

### TypeScript

- **Strict mode:** All code uses `strict: true` in `tsconfig.json`.
- **No `any`:** The `any` type is forbidden unless explicitly justified with a comment explaining why. Use `unknown` and narrow with type guards instead.
- **`readonly` by default:** All interface properties and function parameters should be `readonly` unless mutation is intentionally needed.
- **`as const` for literals:** Use `as const` assertions on configuration arrays and objects for maximum type narrowing.
- **`satisfies` for config:** Use the `satisfies` operator on configuration objects to get both type checking and literal type preservation.

### React

- **Functional components only:** No class components.
- **Named exports:** All components use named exports (no default exports).
- **Props interfaces:** Define a `Props` interface for every component, even if it has few props.
- **No inline styles:** Use Tailwind CSS classes via CVA. Inline `style` is only acceptable for dynamic values (e.g., grid template columns based on board size).

### Core

- **Pure functions:** All functions in `core/` must be pure — no side effects, no I/O, no globals.
- **Zero framework imports:** Files in `core/` must not import from React, Next.js, Zustand, or any browser API.
- **JSDoc comments:** All exported functions in `core/` must have JSDoc comments with `@param` and `@returns` documentation.

### General

- **No magic numbers:** Extract constants to `config/` or define them as named constants with a comment.
- **Early returns:** Prefer guard clauses and early returns over deeply nested conditionals.
- **Immutability:** Prefer immutable operations (spread, `map`, `filter`) over mutation (`push`, `splice`).

---

## File Naming

| Item | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `GameButton.tsx` |
| Hooks | camelCase with `use` prefix | `useGame.ts` |
| Core modules | camelCase | `solver.ts`, `board.ts` |
| Config files | camelCase with `.config` suffix | `scoring.config.ts` |
| Test files | Same name + `.test` suffix | `solver.test.ts` |
| Type definition files | camelCase | `types.ts`, `index.ts` |
| CSS modules (if used) | Same name + `.module.css` | `Board.module.css` |
| Directories | kebab-case (for multi-word) or camelCase | `components/`, `game-board/` |

---

## How to Add a New Level

1. **Open** `src/config/levels.config.ts`.

2. **Add a new `LevelConfig` entry** in the `CAMPAIGN_LEVELS` array at the appropriate position:
   ```typescript
   {
     id: 'c2-05',
     name: 'The Guided Path',
     boardSize: 6,
     chapter: 2,
     preplaced: [[0, 2], [3, 5]],   // Optional pre-placed queens
     starsToUnlock: 8,
     description: 'Two queens are already placed. Find the rest!',
   },
   ```

3. **Verify solvability:** Run the solver test to confirm the pre-placed queens allow at least one valid solution:
   ```bash
   npm test -- --grep "levels"
   ```

4. **Update chapter unlocks** if this is the first level of a new chapter (update `CHAPTER_UNLOCKS` in the same file).

5. **Add a test** in `src/config/__tests__/levels.test.ts` if the level has pre-placed queens.

---

## How to Add a New Game Mode

Adding a new game mode touches multiple layers. Follow this checklist:

1. **Define the mode** in `config/game.config.ts`:
   ```typescript
   export const GAME_MODES = ['classic', 'timeAttack', 'campaign', 'daily', 'practice', 'newMode'] as const;
   ```

2. **Add mode-specific logic** in `core/`:
   - Create `core/newMode.ts` if the mode needs unique logic (e.g., special win conditions).
   - Add any mode-specific scoring adjustments in `core/scoring.ts`.

3. **Update the store** in `store/gameSlice.ts`:
   - Add mode-specific state fields if needed.
   - Handle the new mode in `startGame()`, `tick()`, and win/lose condition checks.

4. **Create the UI** in `components/screens/`:
   - Create a new screen component (e.g., `NewModeScreen.tsx`).
   - Add the mode to the mode selection screen.

5. **Add tests:**
   - Core logic tests in `core/__tests__/`.
   - Store tests in `store/__tests__/gameSlice.test.ts`.
   - Component smoke tests.

6. **Update documentation:**
   - Add the mode to [overview.md](./overview.md).
   - Document any new scoring rules in [game_logic.md](./game_logic.md).

---

## How to Add an Achievement

1. **Open** `src/config/achievements.config.ts`.

2. **Add a new `AchievementConfig` entry**:
   ```typescript
   {
     id: 'speed-demon',
     title: 'Speed Demon',
     description: 'Solve an 8×8 puzzle in under 60 seconds',
     icon: 'lightning',
     coinReward: 30,
     xpReward: 150,
     condition: { type: 'underParTime', boardSize: 8 },
   },
   ```

3. **If the condition is a new type**, add it to the `AchievementCondition` union type and implement the check in the achievement evaluation logic.

4. **Add a test** in `src/config/__tests__/achievements.test.ts` to validate the achievement configuration.

5. **Add an icon** for the achievement (SVG or icon identifier) and ensure it's available in the UI.

---

## How to Add a Board Theme

1. **Define the color tokens** in `src/config/theme.tokens.ts`:
   ```typescript
   export const oceanTheme: ThemeTokens = {
     colors: {
       primary: { /* blue/teal palette */ },
       bg: { /* deep ocean backgrounds */ },
       // ... override color tokens as needed
     },
     // Typography, spacing, etc. inherited from default
   };
   ```

2. **Register the theme** in `config/game.config.ts`:
   ```typescript
   export const THEMES = ['default', 'forest', 'ocean'] as const;
   ```

3. **Create a preview image** in `public/themes/ocean-preview.png` for the theme selector.

4. **Test** the theme across all screens for contrast and readability.

5. **Update** [design_system.md](./design_system.md) with the new theme's color values.

---

## How to Add a Board Variant

Board variants change the visual style of the board (e.g., wooden texture, marble, pixel art) without changing game logic.

1. **Define board style tokens** in `config/theme.tokens.ts`:
   ```typescript
   export const BOARD_STYLES = {
     classic: {
       lightCell: '#DDD6FE',
       darkCell: '#7C3AED',
       border: '#4C1D95',
     },
     wooden: {
       lightCell: '#DEB887',
       darkCell: '#8B4513',
       border: '#5C3317',
     },
   } as const;
   ```

2. **Register the style** in `config/game.config.ts`:
   ```typescript
   export const BOARD_STYLES = ['classic', 'wooden', 'marble', 'pixel'] as const;
   ```

3. **Update the Board component** to consume the active board style from the settings slice.

4. **Add a preview** in the settings panel.

---

## PR Checklist

Before submitting a pull request, verify the following:

- [ ] **TypeScript compiles** with no errors: `npm run build`
- [ ] **All tests pass:** `npm test`
- [ ] **No `any` types** added without justification
- [ ] **`core/` purity maintained:** No React/Next.js/browser imports in `core/`
- [ ] **`core/` coverage ≥ 90%:** Check with `npm run test:coverage`
- [ ] **New functions have JSDoc comments** (especially in `core/`)
- [ ] **New config entries have tests** (levels are solvable, achievements are valid)
- [ ] **No magic numbers:** Constants extracted to config or named variables
- [ ] **Accessibility:** Interactive elements have ARIA labels and keyboard support
- [ ] **Documentation updated:** Relevant docs files updated if behavior changes
- [ ] **No console.log** left in production code (use proper logging if needed)
- [ ] **Commit messages** follow conventional commits format (`feat:`, `fix:`, `docs:`, etc.)
