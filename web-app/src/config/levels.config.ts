/**
 * Campaign level definitions.
 * 30 levels across 6 worlds with progressive difficulty.
 */

/** Level variant type (defined inline until types file is created) */
type LevelVariant = 'standard' | 'locked-queens' | 'blocked-cells';

export interface CampaignLevel {
  /** Unique level identifier */
  id: string;
  /** Display name for the level */
  name: string;
  /** Board size (N×N) */
  n: number;
  /** Par time in seconds */
  parTimeSeconds: number;
  /** Par number of queen placements */
  parMoves: number;
  /** Star thresholds for 1-3 star ratings */
  starThresholds: {
    one: { description: string };
    two: { maxTimeSeconds?: number; maxHints?: number; description: string };
    three: { maxTimeSeconds: number; maxHints: 0; description: string };
  };
  /** Game variant for this level */
  variant: LevelVariant;
  /** Pre-placed queens that cannot be moved (locked-queens variant) */
  lockedQueens?: Array<{ row: number; col: number }>;
  /** Cells that cannot have queens placed on them (blocked-cells variant) */
  blockedCells?: Array<{ row: number; col: number }>;
  /** Total stars needed across all previous levels to unlock */
  unlockRequirement: number;
}

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  // ──────────────────────────────────────────────────────────
  // World 1: Learning (Levels 1-5) — N = 1, 4, 4, 5, 5
  // ──────────────────────────────────────────────────────────
  {
    id: 'L01',
    name: 'First Steps',
    n: 1,
    parTimeSeconds: 5,
    parMoves: 1,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 3, maxHints: 1, description: 'Solve in under 3s or ≤1 hint' },
      three: { maxTimeSeconds: 3, maxHints: 0, description: 'Solve in under 3s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 0,
  },
  {
    id: 'L02',
    name: 'Four Corners',
    n: 4,
    parTimeSeconds: 30,
    parMoves: 6,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 20, maxHints: 1, description: 'Solve in under 20s or ≤1 hint' },
      three: { maxTimeSeconds: 15, maxHints: 0, description: 'Solve in under 15s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 1,
  },
  {
    id: 'L03',
    name: 'Diagonal Dance',
    n: 4,
    parTimeSeconds: 30,
    parMoves: 6,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 25, maxHints: 1, description: 'Solve in under 25s or ≤1 hint' },
      three: { maxTimeSeconds: 18, maxHints: 0, description: 'Solve in under 18s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 2,
  },
  {
    id: 'L04',
    name: 'The Fifth Queen',
    n: 5,
    parTimeSeconds: 60,
    parMoves: 8,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 45, maxHints: 2, description: 'Solve in under 45s or ≤2 hints' },
      three: { maxTimeSeconds: 30, maxHints: 0, description: 'Solve in under 30s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 4,
  },
  {
    id: 'L05',
    name: 'Royal Garden',
    n: 5,
    parTimeSeconds: 60,
    parMoves: 8,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 40, maxHints: 1, description: 'Solve in under 40s or ≤1 hint' },
      three: { maxTimeSeconds: 25, maxHints: 0, description: 'Solve in under 25s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 6,
  },

  // ──────────────────────────────────────────────────────────
  // World 2: Beginner (Levels 6-10) — N = 5, 6, 6, 6, 7
  // ──────────────────────────────────────────────────────────
  {
    id: 'L06',
    name: 'Crown Jewels',
    n: 5,
    parTimeSeconds: 55,
    parMoves: 8,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 35, maxHints: 1, description: 'Solve in under 35s or ≤1 hint' },
      three: { maxTimeSeconds: 22, maxHints: 0, description: 'Solve in under 22s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 8,
  },
  {
    id: 'L07',
    name: 'Hex Appeal',
    n: 6,
    parTimeSeconds: 90,
    parMoves: 10,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 60, maxHints: 2, description: 'Solve in under 60s or ≤2 hints' },
      three: { maxTimeSeconds: 45, maxHints: 0, description: 'Solve in under 45s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 10,
  },
  {
    id: 'L08',
    name: 'Castle Walls',
    n: 6,
    parTimeSeconds: 90,
    parMoves: 10,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 55, maxHints: 1, description: 'Solve in under 55s or ≤1 hint' },
      three: { maxTimeSeconds: 40, maxHints: 0, description: 'Solve in under 40s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 13,
  },
  {
    id: 'L09',
    name: 'Throne Room',
    n: 6,
    parTimeSeconds: 85,
    parMoves: 10,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 50, maxHints: 1, description: 'Solve in under 50s or ≤1 hint' },
      three: { maxTimeSeconds: 35, maxHints: 0, description: 'Solve in under 35s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 16,
  },
  {
    id: 'L10',
    name: 'Lucky Seven',
    n: 7,
    parTimeSeconds: 120,
    parMoves: 12,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 80, maxHints: 2, description: 'Solve in under 80s or ≤2 hints' },
      three: { maxTimeSeconds: 60, maxHints: 0, description: 'Solve in under 60s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 19,
  },

  // ──────────────────────────────────────────────────────────
  // World 3: Intermediate (Levels 11-15) — N = 7, 7, 8, 8, 8
  // Introduces 'locked-queens' at Level 13
  // ──────────────────────────────────────────────────────────
  {
    id: 'L11',
    name: 'Mystic Maze',
    n: 7,
    parTimeSeconds: 115,
    parMoves: 12,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 75, maxHints: 2, description: 'Solve in under 75s or ≤2 hints' },
      three: { maxTimeSeconds: 55, maxHints: 0, description: 'Solve in under 55s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 22,
  },
  {
    id: 'L12',
    name: 'Seven Seas',
    n: 7,
    parTimeSeconds: 110,
    parMoves: 12,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 70, maxHints: 1, description: 'Solve in under 70s or ≤1 hint' },
      three: { maxTimeSeconds: 50, maxHints: 0, description: 'Solve in under 50s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 25,
  },
  {
    id: 'L13',
    name: 'Royal Decree',
    n: 8,
    parTimeSeconds: 180,
    parMoves: 14,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 120, maxHints: 2, description: 'Solve in under 120s or ≤2 hints' },
      three: { maxTimeSeconds: 90, maxHints: 0, description: 'Solve in under 90s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 0, col: 3 }],
    unlockRequirement: 28,
  },
  {
    id: 'L14',
    name: 'Knight\'s Shadow',
    n: 8,
    parTimeSeconds: 180,
    parMoves: 14,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 110, maxHints: 2, description: 'Solve in under 110s or ≤2 hints' },
      three: { maxTimeSeconds: 80, maxHints: 0, description: 'Solve in under 80s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 31,
  },
  {
    id: 'L15',
    name: 'The Classic',
    n: 8,
    parTimeSeconds: 170,
    parMoves: 14,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 100, maxHints: 1, description: 'Solve in under 100s or ≤1 hint' },
      three: { maxTimeSeconds: 70, maxHints: 0, description: 'Solve in under 70s, no hints' },
    },
    variant: 'standard',
    unlockRequirement: 34,
  },

  // ──────────────────────────────────────────────────────────
  // World 4: Advanced (Levels 16-20) — N = 8, 9, 9, 10, 10
  // Mix of 'locked-queens' and 'blocked-cells'
  // ──────────────────────────────────────────────────────────
  {
    id: 'L16',
    name: 'Frozen Throne',
    n: 8,
    parTimeSeconds: 175,
    parMoves: 14,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 100, maxHints: 2, description: 'Solve in under 100s or ≤2 hints' },
      three: { maxTimeSeconds: 70, maxHints: 0, description: 'Solve in under 70s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 0, col: 0 }, { row: 4, col: 7 }],
    unlockRequirement: 37,
  },
  {
    id: 'L17',
    name: 'Nine Lives',
    n: 9,
    parTimeSeconds: 240,
    parMoves: 16,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 160, maxHints: 2, description: 'Solve in under 160s or ≤2 hints' },
      three: { maxTimeSeconds: 110, maxHints: 0, description: 'Solve in under 110s, no hints' },
    },
    variant: 'blocked-cells',
    blockedCells: [{ row: 4, col: 4 }, { row: 3, col: 3 }, { row: 5, col: 5 }],
    unlockRequirement: 40,
  },
  {
    id: 'L18',
    name: 'Dragon\'s Lair',
    n: 9,
    parTimeSeconds: 235,
    parMoves: 16,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 150, maxHints: 2, description: 'Solve in under 150s or ≤2 hints' },
      three: { maxTimeSeconds: 100, maxHints: 0, description: 'Solve in under 100s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 2, col: 5 }],
    unlockRequirement: 43,
  },
  {
    id: 'L19',
    name: 'Forbidden Forest',
    n: 10,
    parTimeSeconds: 300,
    parMoves: 18,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 200, maxHints: 3, description: 'Solve in under 200s or ≤3 hints' },
      three: { maxTimeSeconds: 140, maxHints: 0, description: 'Solve in under 140s, no hints' },
    },
    variant: 'blocked-cells',
    blockedCells: [
      { row: 0, col: 0 }, { row: 0, col: 9 },
      { row: 9, col: 0 }, { row: 9, col: 9 },
    ],
    unlockRequirement: 46,
  },
  {
    id: 'L20',
    name: 'Emerald Crown',
    n: 10,
    parTimeSeconds: 290,
    parMoves: 18,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 190, maxHints: 2, description: 'Solve in under 190s or ≤2 hints' },
      three: { maxTimeSeconds: 130, maxHints: 0, description: 'Solve in under 130s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 0, col: 4 }, { row: 9, col: 6 }],
    unlockRequirement: 49,
  },

  // ──────────────────────────────────────────────────────────
  // World 5: Expert (Levels 21-25) — N = 10, 10, 11, 11, 12
  // Heavy variant usage
  // ──────────────────────────────────────────────────────────
  {
    id: 'L21',
    name: 'Storm Citadel',
    n: 10,
    parTimeSeconds: 280,
    parMoves: 18,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 180, maxHints: 2, description: 'Solve in under 180s or ≤2 hints' },
      three: { maxTimeSeconds: 120, maxHints: 0, description: 'Solve in under 120s, no hints' },
    },
    variant: 'blocked-cells',
    blockedCells: [
      { row: 2, col: 2 }, { row: 2, col: 7 },
      { row: 7, col: 2 }, { row: 7, col: 7 },
      { row: 4, col: 5 },
    ],
    unlockRequirement: 52,
  },
  {
    id: 'L22',
    name: 'Phantom Queen',
    n: 10,
    parTimeSeconds: 275,
    parMoves: 18,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 170, maxHints: 2, description: 'Solve in under 170s or ≤2 hints' },
      three: { maxTimeSeconds: 115, maxHints: 0, description: 'Solve in under 115s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 1, col: 3 }, { row: 6, col: 8 }],
    unlockRequirement: 55,
  },
  {
    id: 'L23',
    name: 'Enchanted Grid',
    n: 11,
    parTimeSeconds: 360,
    parMoves: 20,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 240, maxHints: 3, description: 'Solve in under 240s or ≤3 hints' },
      three: { maxTimeSeconds: 170, maxHints: 0, description: 'Solve in under 170s, no hints' },
    },
    variant: 'blocked-cells',
    blockedCells: [
      { row: 5, col: 5 }, { row: 0, col: 5 }, { row: 10, col: 5 },
    ],
    unlockRequirement: 58,
  },
  {
    id: 'L24',
    name: 'Shadow Gambit',
    n: 11,
    parTimeSeconds: 350,
    parMoves: 20,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 230, maxHints: 2, description: 'Solve in under 230s or ≤2 hints' },
      three: { maxTimeSeconds: 160, maxHints: 0, description: 'Solve in under 160s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 0, col: 2 }, { row: 5, col: 8 }],
    unlockRequirement: 61,
  },
  {
    id: 'L25',
    name: 'Midnight Siege',
    n: 12,
    parTimeSeconds: 420,
    parMoves: 22,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 280, maxHints: 3, description: 'Solve in under 280s or ≤3 hints' },
      three: { maxTimeSeconds: 200, maxHints: 0, description: 'Solve in under 200s, no hints' },
    },
    variant: 'blocked-cells',
    blockedCells: [
      { row: 0, col: 0 }, { row: 0, col: 11 },
      { row: 11, col: 0 }, { row: 11, col: 11 },
      { row: 5, col: 6 }, { row: 6, col: 5 },
    ],
    unlockRequirement: 64,
  },

  // ──────────────────────────────────────────────────────────
  // World 6: Master (Levels 26-30) — N = 12, 12, 14, 15, 16
  // The hardest levels
  // ──────────────────────────────────────────────────────────
  {
    id: 'L26',
    name: 'Iron Fortress',
    n: 12,
    parTimeSeconds: 410,
    parMoves: 22,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 270, maxHints: 2, description: 'Solve in under 270s or ≤2 hints' },
      three: { maxTimeSeconds: 190, maxHints: 0, description: 'Solve in under 190s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 0, col: 1 }, { row: 5, col: 10 }, { row: 11, col: 4 }],
    unlockRequirement: 67,
  },
  {
    id: 'L27',
    name: 'Obsidian Keep',
    n: 12,
    parTimeSeconds: 400,
    parMoves: 22,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 260, maxHints: 2, description: 'Solve in under 260s or ≤2 hints' },
      three: { maxTimeSeconds: 180, maxHints: 0, description: 'Solve in under 180s, no hints' },
    },
    variant: 'blocked-cells',
    blockedCells: [
      { row: 3, col: 3 }, { row: 3, col: 8 },
      { row: 8, col: 3 }, { row: 8, col: 8 },
      { row: 5, col: 5 }, { row: 6, col: 6 },
      { row: 5, col: 6 }, { row: 6, col: 5 },
    ],
    unlockRequirement: 70,
  },
  {
    id: 'L28',
    name: 'Titan\'s Gameboard',
    n: 14,
    parTimeSeconds: 540,
    parMoves: 26,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 360, maxHints: 3, description: 'Solve in under 360s or ≤3 hints' },
      three: { maxTimeSeconds: 250, maxHints: 0, description: 'Solve in under 250s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 0, col: 7 }, { row: 7, col: 0 }],
    unlockRequirement: 73,
  },
  {
    id: 'L29',
    name: 'Celestial Throne',
    n: 15,
    parTimeSeconds: 600,
    parMoves: 28,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 400, maxHints: 3, description: 'Solve in under 400s or ≤3 hints' },
      three: { maxTimeSeconds: 280, maxHints: 0, description: 'Solve in under 280s, no hints' },
    },
    variant: 'blocked-cells',
    blockedCells: [
      { row: 0, col: 0 }, { row: 0, col: 14 },
      { row: 14, col: 0 }, { row: 14, col: 14 },
      { row: 7, col: 7 },
    ],
    unlockRequirement: 76,
  },
  {
    id: 'L30',
    name: 'Grandmaster\'s Crucible',
    n: 16,
    parTimeSeconds: 660,
    parMoves: 30,
    starThresholds: {
      one: { description: 'Solve the puzzle' },
      two: { maxTimeSeconds: 440, maxHints: 3, description: 'Solve in under 440s or ≤3 hints' },
      three: { maxTimeSeconds: 300, maxHints: 0, description: 'Solve in under 300s, no hints' },
    },
    variant: 'locked-queens',
    lockedQueens: [{ row: 0, col: 3 }, { row: 7, col: 12 }, { row: 15, col: 8 }],
    unlockRequirement: 79,
  },
] as const;
