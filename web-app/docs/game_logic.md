# Game Logic

> [!NOTE]
> This document describes the game's state machine, move model, undo/redo system, timer behavior, scoring formula, star calculation, hint tiers, and coins/XP economy.

---

## Table of Contents

- [State Machine](#state-machine)
- [Move Model](#move-model)
- [Undo/Redo Stack](#undoredo-stack)
- [Timer Behavior](#timer-behavior)
- [Scoring Formula](#scoring-formula)
- [Star Calculation](#star-calculation)
- [Hint Tiers and Rules](#hint-tiers-and-rules)
- [Coins/XP Economy](#coinsxp-economy)

---

## State Machine

The game follows a finite state machine with the following states and transitions:

```
                    ┌──────────────┐
                    │     IDLE     │
                    │  (menu/home) │
                    └──────┬───────┘
                           │ startGame()
                           ▼
                    ┌──────────────┐
            ┌──────│   PLAYING    │──────┐
            │      │  (active)    │      │
            │      └──────┬───────┘      │
            │             │              │
     pauseGame()   allQueensPlaced()  timeExpired()
            │      && noConflicts()  (Time Attack only)
            │             │              │
            ▼             ▼              ▼
     ┌──────────┐  ┌──────────┐   ┌──────────┐
     │  PAUSED  │  │   WON    │   │   LOST   │
     │          │  │          │   │          │
     └────┬─────┘  └──────────┘   └──────────┘
          │               │              │
   resumeGame()     restart() /    restart() /
          │         goHome()       goHome()
          ▼               │              │
     ┌──────────┐         └──────┬───────┘
     │ PLAYING  │                │
     └──────────┘                ▼
                          ┌──────────┐
                          │   IDLE   │
                          └──────────┘
```

**State descriptions:**

| State | Description |
|-------|-------------|
| `IDLE` | The player is on the home screen or mode selection. No active game. |
| `PLAYING` | An active game is in progress. Timer is running. Input is accepted. |
| `PAUSED` | The game is paused. Timer is frozen. Board is hidden (to prevent "pause-and-think" exploits). |
| `WON` | The player has successfully placed all N queens with no conflicts. Score is calculated and displayed. |
| `LOST` | Time Attack only — the timer has expired. No score is awarded. |

---

## Move Model

Every player action on the board is represented as a **Move**:

```typescript
interface Move {
  /** Type of move */
  readonly type: 'place' | 'remove';
  /** Row index (0-based) */
  readonly row: number;
  /** Column index (0-based) */
  readonly col: number;
  /** Timestamp of when the move was made (ms since game start) */
  readonly timestamp: number;
}
```

**Place:** The player taps an empty cell to place a queen. If a queen already exists in that row (since each row can have at most one queen), the existing queen is first removed (counted as a separate `remove` move), then the new queen is placed.

**Remove:** The player taps an occupied cell to remove the queen.

All moves are appended to the **move history** array. The total number of moves (both place and remove) is tracked for scoring purposes.

---

## Undo/Redo Stack

The game supports unlimited undo/redo using a **stack-based approach**:

```typescript
interface UndoRedoState {
  /** Stack of past board states (for undo) */
  readonly past: ReadonlyArray<BoardSnapshot>;
  /** The current board state */
  readonly present: BoardSnapshot;
  /** Stack of future board states (for redo) */
  readonly future: ReadonlyArray<BoardSnapshot>;
}
```

**Behavior:**

| Action | Effect |
|--------|--------|
| **Place/Remove queen** | Push current `present` onto `past`, set new state as `present`, clear `future` |
| **Undo** | Pop from `past` → becomes `present`. Push old `present` onto `future`. |
| **Redo** | Pop from `future` → becomes `present`. Push old `present` onto `past`. |
| **Reset board** | Clear all stacks, set `present` to empty board. |

> [!IMPORTANT]
> Undo/redo moves **do not** count toward the move counter for scoring purposes. Only direct place/remove actions increment the move count.

---

## Timer Behavior

### Count-Up Timer (Classic, Campaign, Practice, Daily)

- Starts at `00:00` when the game begins.
- Counts upward in 1-second increments.
- Pauses when the game state is `PAUSED`.
- Stops when the game state is `WON` or `LOST`.
- Final time is used in the scoring formula.

### Countdown Timer (Time Attack)

- Starts at a duration that scales with board size:

| Board Size | Time Limit |
|------------|------------|
| 4×4 | 60 seconds |
| 5×5 | 90 seconds |
| 6×6 | 120 seconds |
| 7×7 | 180 seconds |
| 8×8 | 240 seconds |
| 9×9–10×10 | 300 seconds |
| 11×11–12×12 | 420 seconds |
| 13×13–16×16 | 600 seconds |

- Counts downward in 1-second increments.
- Pauses when the game state is `PAUSED`.
- When the timer reaches `00:00`, the game transitions to `LOST`.
- Remaining time is added as bonus points in the scoring formula.

### Pause Behavior

- When paused, the timer freezes.
- The board is **hidden** during pause to prevent "pause-and-think" exploits in scored modes.
- In Practice mode, the board remains visible during pause (no scoring impact).

---

## Scoring Formula

The score is calculated when the player wins:

```
baseScore = boardSize × boardSize × 100

timeMultiplier = max(0.1, 1.0 - (elapsedSeconds / parTimeSeconds))

moveEfficiency = optimalMoves / actualMoves   (capped at 1.0)

hintPenalty = 1.0 - (hintsUsed × 0.15)       (floored at 0.1)

finalScore = round(baseScore × timeMultiplier × moveEfficiency × hintPenalty)

// Time Attack bonus
if (gameMode === 'timeAttack') {
  timeBonus = remainingSeconds × 10
  finalScore += timeBonus
}
```

### Worked Example

> **Board:** 8×8, **Time:** 95 seconds, **Par time:** 180 seconds, **Moves:** 12, **Optimal moves:** 8, **Hints:** 1

```
baseScore     = 8 × 8 × 100 = 6400
timeMultiplier = max(0.1, 1.0 - (95 / 180)) = max(0.1, 0.472) = 0.472
moveEfficiency = 8 / 12 = 0.667
hintPenalty    = 1.0 - (1 × 0.15) = 0.85
finalScore     = round(6400 × 0.472 × 0.667 × 0.85)
               = round(6400 × 0.2676)
               = round(1713)
               = 1713 points
```

**Configuration:** All constants (100, par times, 0.15, 0.1 floor, 10 per second) are defined in `config/scoring.config.ts` and can be rebalanced without code changes.

---

## Star Calculation

Stars (1–3) are awarded based on the final score as a percentage of the **maximum possible score** (perfect time, optimal moves, no hints):

```
maxScore = boardSize × boardSize × 100   (perfect play)
percentage = finalScore / maxScore

★☆☆  →  percentage ≥ 0.25   (completed the puzzle)
★★☆  →  percentage ≥ 0.50   (good performance)
★★★  →  percentage ≥ 0.80   (excellent performance)
```

**Campaign unlock thresholds** are based on cumulative stars earned across levels. For example:
- Chapter 2 unlocks at 5 total stars
- Chapter 3 unlocks at 15 total stars
- etc.

Star thresholds are defined in `config/scoring.config.ts`.

---

## Hint Tiers and Rules

Hints are available during gameplay at increasing cost and specificity:

| Tier | Name | What It Reveals | Coin Cost | Score Penalty |
|------|------|----------------|-----------|---------------|
| 1 | Row Hint | Highlights a row that should contain a queen | 5 coins | −15% multiplier |
| 2 | Zone Hint | Highlights a row AND column intersection area | 10 coins | −15% multiplier (stacks) |
| 3 | Cell Hint | Reveals the exact cell where a queen should go | 20 coins | −15% multiplier (stacks) |

**Rules:**

- Hints are always based on a valid solution reachable from the current board state.
- If the current board has no valid completion, the hint system informs the player ("No solution possible — try removing a queen") instead of spending coins.
- Hint penalty is **per hint used**, stacking multiplicatively: 2 hints = `0.85 × 0.85 = 0.7225` multiplier.
- In Practice mode, hints are **free** and do not affect scoring (there is no scoring in Practice mode).
- The hint engine selects the **most constrained row** (fewest valid columns) to maximize usefulness.

---

## Coins/XP Economy

### Earning Coins

| Source | Coins Earned |
|--------|-------------|
| Complete a puzzle (any mode) | `boardSize × 2` |
| Earn 3 stars | Bonus `boardSize × 3` |
| Daily challenge (complete) | 20 coins |
| Daily challenge (streak bonus, 7+ days) | +10 coins |
| Campaign level (first completion) | `boardSize × 5` |

### Spending Coins

| Action | Coin Cost |
|--------|-----------|
| Tier 1 hint (Row) | 5 coins |
| Tier 2 hint (Zone) | 10 coins |
| Tier 3 hint (Cell) | 20 coins |

### XP and Leveling

XP is earned from completing puzzles and is used for player level progression:

```
xpEarned = finalScore / 10   (rounded down)
```

Player level thresholds follow a quadratic curve:

```
xpForLevel(n) = 100 × n × n
```

| Level | Cumulative XP Required |
|-------|----------------------|
| 1 | 0 |
| 2 | 400 |
| 3 | 900 |
| 4 | 1,600 |
| 5 | 2,500 |
| 10 | 10,000 |
| 20 | 40,000 |

Leveling up is purely cosmetic in V1 (displayed on profile). In V2, levels may unlock board themes or avatar frames.

**Configuration:** All economy values are defined in `config/scoring.config.ts` and `config/game.config.ts`.
