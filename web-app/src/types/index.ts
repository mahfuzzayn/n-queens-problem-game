// ============================================================
// Board & Game Types
// ============================================================

/** Position on the board */
export interface Position {
  row: number;
  col: number;
}

/** Variant types for puzzle levels */
export type LevelVariant = 'standard' | 'locked-queens' | 'blocked-cells';

/** Game modes */
export type GameMode = 'classic' | 'time-attack' | 'campaign' | 'daily' | 'practice';

/** Game status state machine */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost';

/** A conflict between two queens */
export interface Conflict {
  queenA: Position;
  queenB: Position;
  type: 'row' | 'column' | 'diagonal-up' | 'diagonal-down';
}

/** Result of conflict detection */
export interface ConflictResult {
  conflicts: Conflict[];
  conflictingPositions: Set<string>; // "row,col" format
  attackedCells: Set<string>; // "row,col" format
}

/** Board state representation */
export interface BoardState {
  n: number;
  queens: Set<string>; // "row,col" format for UI (allows multiple per row)
  lockedQueens: Set<string>; // "row,col" format (cannot be removed)
  blockedCells: Set<string>; // "row,col" format (cannot place)
}

/** Solver board representation (compact, one queen per row) */
export type SolverBoard = number[]; // queens[row] = col, or -1 if empty

// ============================================================
// Hint Types
// ============================================================

export type HintTier = 1 | 2 | 3;

export interface HintResult {
  tier: HintTier;
  type: 'nudge' | 'safe-cell' | 'reveal' | 'dead-end';
  /** Position relevant to the hint (conflicting queen, safe cell, or reveal position) */
  position?: Position;
  /** Human-readable message */
  message: string;
}

// ============================================================
// Scoring Types
// ============================================================

export interface ScoreBreakdown {
  baseScore: number;
  timeBonus: number;
  efficiencyBonus: number;
  perfectBonus: number;
  hintPenalty: number;
  undoPenalty: number;
  finalScore: number;
}

export interface GameResult {
  n: number;
  mode: GameMode;
  queens: Position[];
  timeMs: number;
  moves: number;
  hintsUsed: number;
  score: number;
  stars: 0 | 1 | 2 | 3;
  date: string; // ISO 8601
  levelId?: string;
  seed?: number;
  conflictsMade: number;
  undosUsed: number;
  isPerfect: boolean;
}

// ============================================================
// Move History Types (for undo/redo)
// ============================================================

export type MoveAction = 'place' | 'remove';

export interface Move {
  action: MoveAction;
  position: Position;
  timestamp: number;
}

// ============================================================
// Campaign & Level Types
// ============================================================

export interface StarThresholds {
  one: { description: string };
  two: { maxTimeSeconds?: number; maxHints?: number; description: string };
  three: { maxTimeSeconds: number; maxHints: 0; description: string };
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  bestScore: number;
  bestTimeMs: number;
  attempts: number;
}

// ============================================================
// Player Profile Types
// ============================================================

export interface PlayerProfile {
  xp: number;
  level: number;
  coins: number;
  gems: number;
  totalGamesPlayed: number;
  totalGamesWon: number;
  currentDailyStreak: number;
  longestDailyStreak: number;
  currentWinStreak: number;
  longestWinStreak: number;
  lastPlayDate: string | null; // ISO date string
  unlockedAchievements: string[]; // achievement IDs
  personalBests: Record<string, PersonalBest>; // key: "mode-N"
}

export interface PersonalBest {
  score: number;
  timeMs: number;
  moves: number;
  date: string;
}

// ============================================================
// Settings Types
// ============================================================

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  showAttackLines: boolean;
  showConflicts: boolean;
  reduceMotion: boolean;
  theme: string; // theme ID
  volume: number; // 0-1
}

// ============================================================
// Storage Types
// ============================================================

export interface StoredData {
  schemaVersion: number;
  profile: PlayerProfile;
  settings: GameSettings;
  levelProgress: Record<string, LevelProgress>;
  savedGame: SavedGameState | null;
}

export interface SavedGameState {
  boardState: {
    n: number;
    queens: string[]; // "row,col" serialized from Set
    lockedQueens: string[];
    blockedCells: string[];
  };
  mode: GameMode;
  levelId?: string;
  seed?: number;
  elapsedMs: number;
  moves: number;
  hintsUsed: number;
  undosUsed: number;
  conflictsMade: number;
  moveHistory: Move[];
  redoStack: Move[];
  savedAt: string; // ISO timestamp
}

// ============================================================
// Worker Message Types
// ============================================================

export type SolverWorkerRequest =
  | { type: 'solve'; n: number; initialQueens: Position[]; lockedQueens?: Position[]; blockedCells?: Position[] }
  | { type: 'count'; n: number }
  | { type: 'hint'; n: number; currentQueens: Position[]; tier: HintTier; lockedQueens?: Position[]; blockedCells?: Position[] }
  | { type: 'cancel' };

export type SolverWorkerResponse =
  | { type: 'solution'; queens: Position[] | null }
  | { type: 'count'; count: number }
  | { type: 'hint'; result: HintResult }
  | { type: 'progress'; percentage: number }
  | { type: 'error'; message: string }
  | { type: 'cancelled' };

// ============================================================
// Daily Puzzle Types
// ============================================================

export interface DailyPuzzle {
  date: string; // YYYY-MM-DD
  seed: number;
  n: number;
  lockedQueens: Position[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// ============================================================
// Level Config Type (used in campaign config)
// ============================================================

export interface LevelConfig {
  id: string;
  name: string;
  n: number;
  parTimeSeconds: number;
  parMoves: number;
  starThresholds: StarThresholds;
  variant: LevelVariant;
  lockedQueens?: Position[];
  blockedCells?: Position[];
  unlockRequirement: number;
}
