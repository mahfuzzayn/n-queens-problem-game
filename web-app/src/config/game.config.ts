/**
 * Core game configuration.
 * Adjust these values to rebalance the game without touching logic.
 */
export const GAME_CONFIG = {
  /** Minimum board size */
  minN: 1,
  /** Maximum board size */
  maxN: 16,
  /** Default board size for new games */
  defaultN: 8,
  /** Number of hints available per level */
  hintCount: 3,
  /** Number of free undos before score penalty applies */
  freeUndos: 3,
  /** Time Attack mode timing formula: totalSeconds = baseTimeSeconds + N * perQueenSeconds */
  timeAttack: {
    baseTimeSeconds: 30,
    perQueenSeconds: 15,
  },
  /** Board sizes with no valid solutions */
  impossibleSizes: [2, 3] as const,
  /** Board size used for tutorial */
  tutorialSize: 1,
  /** Preset board sizes shown in the size selector */
  presetSizes: [4, 5, 6, 7, 8, 9, 10, 12] as const,
  /** Board sizes that require Web Worker for solver */
  workerThreshold: 12,
  /** Solver timeout in milliseconds */
  solverTimeoutMs: 30000,
  /** Known solution counts for N=1..16 (for instant display) */
  knownSolutionCounts: {
    1: 1,
    2: 0,
    3: 0,
    4: 2,
    5: 10,
    6: 4,
    7: 40,
    8: 92,
    9: 352,
    10: 724,
    11: 2680,
    12: 14200,
    13: 73712,
    14: 365596,
    15: 2279184,
    16: 14772512,
  } as Record<number, number>,
} as const;
