# Configuration

> [!NOTE]
> This document describes all configuration files in the N-Queens Puzzle Game, what each one controls, and how to modify game balance without changing code.

---

## Table of Contents

- [Overview](#overview)
- [game.config.ts](#gameconfigts)
- [scoring.config.ts](#scoringconfigts)
- [levels.config.ts](#levelsconfigts)
- [achievements.config.ts](#achievementsconfigts)
- [theme.tokens.ts](#themetokensts)
- [How to Rebalance the Game](#how-to-rebalance-the-game)
- [How to Add a New Level](#how-to-add-a-new-level)

---

## Overview

All game configuration lives in `src/config/`. These files export **static, typed constants** that control game behavior without requiring code changes. Configuration files:

- Are imported by `core/` (pure logic), `store/` (state management), and `components/` (UI).
- Must **not** import from React, Next.js, or browser APIs (same purity constraint as `core/`).
- Use `as const` assertions and `satisfies` operators for maximum type safety.
- Are the single source of truth for all tunable game parameters.

```
src/config/
├── game.config.ts          # General game settings, board sizes, modes
├── scoring.config.ts       # Scoring formula constants, star thresholds
├── levels.config.ts        # Campaign level definitions
├── achievements.config.ts  # Achievement definitions and conditions
└── theme.tokens.ts         # Design tokens (colors, typography, spacing)
```

---

## game.config.ts

Controls general game behavior, supported board sizes, game modes, solution counts, and economy settings.

```typescript
/** Placeholder — actual implementation in src/config/game.config.ts */

/** Supported board sizes */
export const BOARD_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const;

/** Pre-computed solution counts for each board size */
export const SOLUTION_COUNTS: Record<number, number> = {
  1: 1, 2: 0, 3: 0, 4: 2, 5: 10, 6: 4, 7: 40, 8: 92,
  9: 352, 10: 724, 11: 2680, 12: 14200, 13: 73712,
  14: 365596, 15: 2279184, 16: 14772512,
};

/** Board sizes with no valid solution */
export const IMPOSSIBLE_SIZES = [2, 3] as const;

/** Available game modes */
export const GAME_MODES = ['classic', 'timeAttack', 'campaign', 'daily', 'practice'] as const;

/** Time limits for Time Attack mode (in seconds) */
export const TIME_ATTACK_LIMITS: Record<number, number> = {
  4: 60, 5: 90, 6: 120, 7: 180, 8: 240,
  9: 300, 10: 300, 11: 420, 12: 420,
  13: 600, 14: 600, 15: 600, 16: 600,
};

/** Hint costs (in coins) per tier */
export const HINT_COSTS = { tier1: 5, tier2: 10, tier3: 20 } as const;

/** Coin rewards */
export const COIN_REWARDS = {
  puzzleComplete: (boardSize: number) => boardSize * 2,
  threeStarBonus: (boardSize: number) => boardSize * 3,
  dailyComplete: 20,
  dailyStreakBonus: 10,      // At 7+ day streak
  campaignFirstClear: (boardSize: number) => boardSize * 5,
} as const;

/** Daily puzzle settings */
export const DAILY_CONFIG = {
  minBoardSize: 6,
  maxBoardSize: 10,
  defaultBoardSize: 8,
  streakBonusThreshold: 7,   // Days needed for streak bonus
} as const;
```

---

## scoring.config.ts

Controls the scoring formula constants, par times, star thresholds, and XP calculation.

```typescript
/** Placeholder — actual implementation in src/config/scoring.config.ts */

/** Base score multiplier per cell (boardSize² × this value) */
export const BASE_SCORE_MULTIPLIER = 100;

/** Par times in seconds for each board size (used in time multiplier) */
export const PAR_TIMES: Record<number, number> = {
  4: 30, 5: 60, 6: 90, 7: 120, 8: 180,
  9: 240, 10: 300, 11: 360, 12: 420,
  13: 480, 14: 540, 15: 600, 16: 660,
};

/** Minimum time multiplier (floor) */
export const MIN_TIME_MULTIPLIER = 0.1;

/** Hint penalty per hint used (multiplicative) */
export const HINT_PENALTY_PER_HINT = 0.15;

/** Minimum hint multiplier (floor) */
export const MIN_HINT_MULTIPLIER = 0.1;

/** Time Attack bonus points per remaining second */
export const TIME_ATTACK_BONUS_PER_SECOND = 10;

/** Star thresholds (percentage of max possible score) */
export const STAR_THRESHOLDS = {
  oneStar: 0.25,
  twoStars: 0.50,
  threeStars: 0.80,
} as const;

/** XP divisor (finalScore / this = XP earned) */
export const XP_DIVISOR = 10;

/** XP required for each player level: 100 × level² */
export const XP_PER_LEVEL_MULTIPLIER = 100;
```

---

## levels.config.ts

Defines all campaign levels, their board sizes, pre-placed queens, unlock requirements, and chapter groupings.

```typescript
/** Placeholder — actual implementation in src/config/levels.config.ts */

export interface LevelConfig {
  /** Unique level identifier */
  readonly id: string;
  /** Display name */
  readonly name: string;
  /** Board size for this level */
  readonly boardSize: number;
  /** Chapter this level belongs to */
  readonly chapter: number;
  /** Pre-placed queens that cannot be moved (row → col) */
  readonly preplaced: ReadonlyArray<readonly [number, number]>;
  /** Cumulative stars required to unlock this level */
  readonly starsToUnlock: number;
  /** Optional flavor text / description */
  readonly description?: string;
}

export const CAMPAIGN_LEVELS: readonly LevelConfig[] = [
  // Chapter 1: Tutorial (stars to unlock: 0)
  { id: 'c1-01', name: 'First Steps',      boardSize: 1,  chapter: 1, preplaced: [],          starsToUnlock: 0 },
  { id: 'c1-02', name: 'Impossible?',       boardSize: 2,  chapter: 1, preplaced: [],          starsToUnlock: 0 },
  { id: 'c1-03', name: 'Still Impossible',  boardSize: 3,  chapter: 1, preplaced: [],          starsToUnlock: 0 },
  { id: 'c1-04', name: 'The Real Start',    boardSize: 4,  chapter: 1, preplaced: [],          starsToUnlock: 0 },

  // Chapter 2: Beginner (stars to unlock: 5)
  // ... additional levels to be defined

  // Chapter 3: Intermediate (stars to unlock: 15)
  // ... additional levels to be defined

  // Chapter 4+: Advanced, Expert, Master
  // ... additional levels to be defined
];

/** Chapter unlock thresholds (cumulative stars required) */
export const CHAPTER_UNLOCKS: Record<number, number> = {
  1: 0,
  2: 5,
  3: 15,
  4: 30,
  5: 50,
};
```

---

## achievements.config.ts

Defines all achievements, their conditions, and rewards.

```typescript
/** Placeholder — actual implementation in src/config/achievements.config.ts */

export interface AchievementConfig {
  /** Unique achievement identifier */
  readonly id: string;
  /** Display title */
  readonly title: string;
  /** Description of how to earn this achievement */
  readonly description: string;
  /** Icon identifier */
  readonly icon: string;
  /** Coin reward for unlocking */
  readonly coinReward: number;
  /** XP reward for unlocking */
  readonly xpReward: number;
  /** Condition type for automated checking */
  readonly condition: AchievementCondition;
}

export type AchievementCondition =
  | { type: 'boardSizeCompleted'; boardSize: number }
  | { type: 'totalStars'; count: number }
  | { type: 'dailyStreak'; days: number }
  | { type: 'totalPuzzlesCompleted'; count: number }
  | { type: 'noHintsUsed'; boardSize: number }
  | { type: 'underParTime'; boardSize: number }
  | { type: 'custom'; checkFn: string };  // Function name in achievement checker

export const ACHIEVEMENTS: readonly AchievementConfig[] = [
  // Placeholder achievement definitions
  {
    id: 'first-solve',
    title: 'First Crown',
    description: 'Complete your first puzzle',
    icon: 'crown',
    coinReward: 10,
    xpReward: 50,
    condition: { type: 'totalPuzzlesCompleted', count: 1 },
  },
  {
    id: 'classic-8',
    title: 'The Classic',
    description: 'Solve the 8-Queens problem',
    icon: 'chess-queen',
    coinReward: 20,
    xpReward: 100,
    condition: { type: 'boardSizeCompleted', boardSize: 8 },
  },
  // ... additional achievements to be defined
];
```

---

## theme.tokens.ts

Defines design tokens consumed by Tailwind CSS and component styling. See [design_system.md](./design_system.md) for full documentation of the color palette, typography, and button anatomy.

```typescript
/** Placeholder — actual implementation in src/config/theme.tokens.ts */

export interface ThemeTokens {
  readonly colors: {
    readonly primary: Record<string, string>;
    readonly bg: Record<string, string>;
    readonly gold: Record<string, string>;
    readonly green: Record<string, string>;
    readonly red: Record<string, string>;
    readonly cyan: Record<string, string>;
    readonly neutral: Record<string, string>;
  };
  readonly typography: {
    readonly fontFamily: {
      readonly display: string;
      readonly body: string;
    };
    // ... size, weight, lineHeight tokens
  };
  readonly borderRadius: Record<string, string>;
  readonly shadows: Record<string, string>;
  readonly animation: {
    readonly duration: Record<string, string>;
    readonly easing: Record<string, string>;
  };
}

export const defaultTheme: ThemeTokens = {
  // See design_system.md for full token values
  // Placeholder — will be implemented with actual values
} as unknown as ThemeTokens;
```

---

## How to Rebalance the Game

To adjust game balance without changing any logic code:

1. **Scoring feel too harsh?**
   - Increase `PAR_TIMES` in `scoring.config.ts` to give more time before the time multiplier drops.
   - Decrease `HINT_PENALTY_PER_HINT` to reduce the hint penalty.
   - Lower `STAR_THRESHOLDS` to make stars easier to earn.

2. **Time Attack too easy/hard?**
   - Adjust `TIME_ATTACK_LIMITS` in `game.config.ts`.
   - Adjust `TIME_ATTACK_BONUS_PER_SECOND` in `scoring.config.ts`.

3. **Economy too generous/stingy?**
   - Adjust `COIN_REWARDS` in `game.config.ts`.
   - Adjust `HINT_COSTS` in `game.config.ts`.

4. **Campaign progression too fast/slow?**
   - Adjust `CHAPTER_UNLOCKS` in `levels.config.ts`.
   - Adjust `starsToUnlock` on individual levels.

> [!TIP]
> All config values are consumed by pure functions in `core/`. After changing config, run `npm test` to verify no tests break — tests use the same config values.

---

## How to Add a New Level

1. **Open** `src/config/levels.config.ts`.

2. **Add a new entry** to the `CAMPAIGN_LEVELS` array:
   ```typescript
   {
     id: 'c2-05',                           // Unique ID: chapter-number
     name: 'The Guided Path',               // Display name
     boardSize: 6,                           // N×N board
     chapter: 2,                             // Chapter number
     preplaced: [[0, 2], [3, 5]],           // Pre-placed queens (optional)
     starsToUnlock: 8,                       // Cumulative stars needed
     description: 'Two queens are already placed. Find the rest!',
   },
   ```

3. **Verify** the pre-placed queens allow at least one valid solution by running the solver test:
   ```bash
   npm test -- --grep "level c2-05"
   ```

4. **Update** the chapter unlock threshold in `CHAPTER_UNLOCKS` if this is the first level of a new chapter.

5. **Add a test** in `__tests__/config/levels.test.ts` to verify the level is solvable.
