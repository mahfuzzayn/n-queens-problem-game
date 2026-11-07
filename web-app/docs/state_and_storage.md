# State & Storage

> [!NOTE]
> This document describes the Zustand store architecture, individual slices, the storage adapter abstraction, repositories, schema versioning, and auto-save behavior.

---

## Table of Contents

- [Zustand Store Architecture](#zustand-store-architecture)
- [Game Slice](#game-slice)
- [Progress Slice](#progress-slice)
- [Settings Slice](#settings-slice)
- [StorageAdapter Interface](#storageadapter-interface)
- [LocalStorageAdapter](#localstorageadapter)
- [Repositories](#repositories)
  - [ProgressRepository](#progressrepository)
  - [SettingsRepository](#settingsrepository)
  - [ScoreRepository](#scorerepository)
- [Schema Versioning](#schema-versioning)
- [Migration Functions](#migration-functions)
- [Auto-Save](#auto-save)

---

## Zustand Store Architecture

The application state is managed by a single Zustand store composed of multiple **slices**. Each slice owns a specific domain of state and exposes actions for that domain.

```
┌──────────────────────────────────────────────────────┐
│                    useStore (combined)                │
│  ┌────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │ Game Slice │  │ Progress Slice│  │Settings Slice│ │
│  │            │  │               │  │              │ │
│  │ board      │  │ completedLvls │  │ soundEnabled │ │
│  │ queens     │  │ stars         │  │ vibration    │ │
│  │ conflicts  │  │ coins         │  │ theme        │ │
│  │ moveHistory│  │ xp            │  │ boardStyle   │ │
│  │ timer      │  │ level         │  │              │ │
│  │ status     │  │ streaks       │  │              │ │
│  │ score      │  │ achievements  │  │              │ │
│  └────────────┘  └───────────────┘  └─────────────┘ │
│                                                      │
│  Middleware: persist (partial), devtools, immer       │
└──────────────────────────────────────────────────────┘
```

**Why Zustand:**
- Minimal boilerplate compared to Redux
- Built-in `persist` middleware for auto-save
- Easy slice composition with TypeScript
- Compatible with React 19 concurrent features
- No context providers needed (reduces React tree depth)

See [decisions.md](./decisions.md) for the full comparison with alternatives.

---

## Game Slice

The game slice manages the state of the currently active game session.

```typescript
/** Placeholder — actual implementation in store/gameSlice.ts */
interface GameSlice {
  // --- State ---
  /** Current board size N */
  readonly boardSize: number;
  /** Queen positions: queens[row] = col, -1 if empty */
  readonly queens: ReadonlyArray<number>;
  /** Set of conflicting cell keys ("row,col") */
  readonly conflicts: ReadonlySet<string>;
  /** Current game status */
  readonly status: 'idle' | 'playing' | 'paused' | 'won' | 'lost';
  /** Current game mode */
  readonly gameMode: GameMode;
  /** Elapsed time in seconds */
  readonly elapsedSeconds: number;
  /** Remaining time in seconds (Time Attack only) */
  readonly remainingSeconds: number;
  /** Number of moves made (place + remove) */
  readonly moveCount: number;
  /** Number of hints used */
  readonly hintsUsed: number;
  /** Undo/redo state */
  readonly undoRedo: UndoRedoState;
  /** Final score (set on win) */
  readonly score: number | null;
  /** Stars earned (set on win) */
  readonly stars: number | null;

  // --- Actions ---
  startGame: (boardSize: number, mode: GameMode) => void;
  placeQueen: (row: number, col: number) => void;
  removeQueen: (row: number, col: number) => void;
  undo: () => void;
  redo: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  useHint: () => void;
  tick: () => void;  // Called every second by the timer
}
```

> [!IMPORTANT]
> The game slice does **not** persist to storage. It represents the transient state of a single game session. If the user refreshes mid-game, the game is lost. This is intentional to keep the storage layer simple in V1. Auto-save of in-progress games is a V2 feature.

---

## Progress Slice

The progress slice tracks the player's long-term progression across sessions.

```typescript
/** Placeholder — actual implementation in store/progressSlice.ts */
interface ProgressSlice {
  // --- State ---
  /** Coins balance */
  readonly coins: number;
  /** Total XP earned */
  readonly xp: number;
  /** Current player level (derived from XP) */
  readonly playerLevel: number;
  /** Map of completed levels: levelId → best star rating */
  readonly completedLevels: ReadonlyMap<string, number>;
  /** Total stars earned */
  readonly totalStars: number;
  /** Daily challenge streak */
  readonly dailyStreak: number;
  /** Last daily challenge completion date (ISO string) */
  readonly lastDailyDate: string | null;
  /** Unlocked achievements */
  readonly achievements: ReadonlySet<string>;

  // --- Actions ---
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;  // Returns false if insufficient
  addXp: (amount: number) => void;
  completeLevel: (levelId: string, stars: number) => void;
  completeDailyChallenge: (date: string) => void;
  unlockAchievement: (achievementId: string) => void;
}
```

**Persistence:** The progress slice is **fully persisted** to local storage via the `persist` middleware. See [Auto-Save](#auto-save).

---

## Settings Slice

The settings slice manages user preferences.

```typescript
/** Placeholder — actual implementation in store/settingsSlice.ts */
interface SettingsSlice {
  // --- State ---
  /** Whether sound effects are enabled */
  readonly soundEnabled: boolean;
  /** Whether vibration/haptics are enabled */
  readonly vibrationEnabled: boolean;
  /** Selected visual theme */
  readonly theme: ThemeId;
  /** Selected board style */
  readonly boardStyle: BoardStyleId;
  /** Whether to show move confirmation */
  readonly confirmMoves: boolean;
  /** Whether to show the tutorial on first play */
  readonly showTutorial: boolean;

  // --- Actions ---
  updateSettings: (patch: Partial<SettingsState>) => void;
  resetSettings: () => void;
}
```

**Persistence:** The settings slice is **fully persisted** to local storage.

---

## StorageAdapter Interface

The `StorageAdapter` interface abstracts storage I/O so that the same repository code works with different backends (localStorage in web, AsyncStorage in mobile, API in V2 online).

```typescript
/** Defined in services/storage/StorageAdapter.ts */
interface StorageAdapter {
  /** Read a value by key. Returns null if not found. */
  getItem(key: string): string | null;
  /** Write a value by key. */
  setItem(key: string, value: string): void;
  /** Delete a value by key. */
  removeItem(key: string): void;
  /** List all keys with a given prefix. */
  keys(prefix?: string): string[];
}
```

---

## LocalStorageAdapter

The default `StorageAdapter` implementation for the web app. Wraps `window.localStorage` with error handling and quota management.

```typescript
/** Defined in services/storage/LocalStorageAdapter.ts */
class LocalStorageAdapter implements StorageAdapter {
  // Wraps localStorage calls in try/catch for:
  // - Private browsing mode (Safari throws on setItem)
  // - Storage quota exceeded
  // - SSR safety (window may not exist)
}
```

**Key prefix:** All keys are prefixed with `nqueens_` to avoid collisions with other applications on the same domain.

---

## Repositories

Repositories provide typed, domain-specific access to persisted data via the `StorageAdapter`.

### ProgressRepository

Manages reading/writing player progress data:

```typescript
class ProgressRepository {
  constructor(private adapter: StorageAdapter) {}

  loadProgress(): ProgressData | null;
  saveProgress(data: ProgressData): void;
  clearProgress(): void;
}
```

**Storage key:** `nqueens_progress`

### SettingsRepository

Manages reading/writing user settings:

```typescript
class SettingsRepository {
  constructor(private adapter: StorageAdapter) {}

  loadSettings(): SettingsData | null;
  saveSettings(data: SettingsData): void;
  resetSettings(): void;
}
```

**Storage key:** `nqueens_settings`

### ScoreRepository

Manages reading/writing high scores and leaderboard data:

```typescript
class ScoreRepository {
  constructor(private adapter: StorageAdapter) {}

  loadScores(): ScoreEntry[];
  saveScore(entry: ScoreEntry): void;
  getHighScore(boardSize: number, mode: GameMode): ScoreEntry | null;
  clearScores(): void;
}
```

**Storage key:** `nqueens_scores`

---

## Schema Versioning

Each persisted data structure includes a **schema version number** to enable safe migrations when the data format changes:

```typescript
interface PersistedData<T> {
  /** Schema version for migration support */
  readonly version: number;
  /** The actual data payload */
  readonly data: T;
}
```

**Current versions:**

| Data Type | Current Version | Storage Key |
|-----------|----------------|-------------|
| Progress | 1 | `nqueens_progress` |
| Settings | 1 | `nqueens_settings` |
| Scores | 1 | `nqueens_scores` |

---

## Migration Functions

When a schema version changes, migration functions transform old data to the new format:

```typescript
/** Placeholder — actual implementation in services/storage/migrations.ts */
type Migration<TFrom, TTo> = (data: TFrom) => TTo;

const progressMigrations: Record<number, Migration<unknown, unknown>> = {
  // Example: version 1 → 2 migration
  // 2: (v1Data: ProgressV1) => ({
  //   ...v1Data,
  //   newField: defaultValue,
  // }),
};

function migrateData<T>(
  raw: PersistedData<unknown>,
  currentVersion: number,
  migrations: Record<number, Migration<unknown, unknown>>,
): T {
  let data = raw.data;
  for (let v = raw.version + 1; v <= currentVersion; v++) {
    data = migrations[v](data);
  }
  return data as T;
}
```

> [!WARNING]
> **Never delete a migration function.** Players who haven't opened the app in a long time may need to run multiple sequential migrations to catch up to the current version.

---

## Auto-Save

The store uses Zustand's `persist` middleware to automatically save progress and settings whenever they change:

```typescript
// Conceptual (placeholder for store/useStore.ts)
const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createGameSlice(set, get),
      ...createProgressSlice(set, get),
      ...createSettingsSlice(set, get),
    }),
    {
      name: 'nqueens-store',
      // Only persist progress and settings slices
      partialize: (state) => ({
        coins: state.coins,
        xp: state.xp,
        completedLevels: state.completedLevels,
        // ... other progress fields
        soundEnabled: state.soundEnabled,
        theme: state.theme,
        // ... other settings fields
      }),
      // Storage adapter
      storage: createJSONStorage(() => localStorage),
      // Schema version
      version: 1,
      // Migration
      migrate: (persisted, version) => {
        // Run migrations if needed
      },
    },
  ),
);
```

**Auto-save triggers:**
- Any change to the progress slice (coins, XP, completed levels, etc.)
- Any change to the settings slice (sound, theme, etc.)
- **Not** triggered by game slice changes (board, timer, etc.) — these are transient

**Debouncing:** Zustand's persist middleware handles deduplication internally. Rapid successive state changes result in a single write.
