# Algorithms

> [!NOTE]
> This document provides an in-depth explanation of the algorithms used in the N-Queens Puzzle Game, including conflict detection, solvers, hint generation, and daily puzzle seeding.

---

## Table of Contents

- [The N-Queens Problem](#the-n-queens-problem)
- [Board Representation](#board-representation)
- [Conflict Detection](#conflict-detection)
- [Backtracking Solver](#backtracking-solver)
- [Bitmask Optimization](#bitmask-optimization)
- [Solution Counting](#solution-counting)
- [Partial Board Solving](#partial-board-solving)
- [Hint Engine Decision Tree](#hint-engine-decision-tree)
- [Daily Puzzle Seeded Generation](#daily-puzzle-seeded-generation)
- [Complexity Analysis](#complexity-analysis)
- [How to Extend the Solver](#how-to-extend-the-solver)

---

## The N-Queens Problem

The N-Queens problem asks: **How can N queens be placed on an N×N chessboard so that no two queens threaten each other?**

A queen in chess can attack along its **row**, **column**, and both **diagonals**. Therefore, a valid solution requires that no two queens share the same row, column, or diagonal.

**Mathematical properties:**

- For N = 1, there is exactly 1 solution.
- For N = 2 and N = 3, there are **0** solutions (impossible).
- For N ≥ 4, there is always at least one solution.
- The number of solutions grows super-exponentially with N.
- The problem is in NP — solutions can be verified in O(N²) but finding them requires search.

The decision version of N-Queens (does a solution exist for given N?) is trivial for standard boards (yes for N ≥ 4), but the **completion problem** (given some pre-placed queens, can a full solution be found?) is NP-complete. Our game leverages this for campaign levels with pre-placed queens.

---

## Board Representation

The board is represented as a **one-dimensional array of column indices**, where the array index is the row and the value is the column where a queen is placed (or `-1` for an empty row).

```typescript
// Type: number[] where board[row] = col (or -1 if empty)
// Example: 4×4 board with queens at (0,1), (1,3), (2,0), (3,2)
const board = [1, 3, 0, 2];
```

**Why this representation:**

- **Row uniqueness is implicit:** Each row has at most one entry, so row conflicts are impossible by construction.
- **Column check:** O(N) scan for duplicate values.
- **Space efficient:** O(N) instead of O(N²) for a 2D grid.
- **Solver-friendly:** Backtracking naturally fills one row at a time.

For the UI, a separate 2D grid representation is derived from this array for rendering purposes.

---

## Conflict Detection

### Counter-Based Approach

Instead of checking every pair of queens (O(N²)), we use **counter arrays** that track how many queens occupy each column and each diagonal. A conflict exists whenever any counter exceeds 1.

```typescript
// Three counter arrays:
const colCount = new Array(N).fill(0);      // colCount[col]
const diagCount = new Array(2 * N - 1).fill(0);  // diagCount[r + c]
const antiDiagCount = new Array(2 * N - 1).fill(0); // antiDiagCount[r - c + N - 1]
```

### Diagonal Math

Queens on the **same diagonal** (top-left to bottom-right) share the same value of `row - col`. Since this can be negative, we normalize it:

```
Anti-diagonal index = row - col + (N - 1)
```

This maps the range `[-(N-1), +(N-1)]` to `[0, 2N-2]`.

Queens on the **same anti-diagonal** (top-right to bottom-left) share the same value of `row + col`:

```
Diagonal index = row + col
```

This naturally falls in the range `[0, 2N-2]`.

### Example (4×4 board)

```
     col 0   col 1   col 2   col 3
row 0:  r+c=0  r+c=1  r+c=2  r+c=3
row 1:  r+c=1  r+c=2  r+c=3  r+c=4
row 2:  r+c=2  r+c=3  r+c=4  r+c=5
row 3:  r+c=3  r+c=4  r+c=5  r+c=6

     col 0   col 1   col 2   col 3
row 0: r-c+3=3 r-c+3=2 r-c+3=1 r-c+3=0
row 1: r-c+3=4 r-c+3=3 r-c+3=2 r-c+3=1
row 2: r-c+3=5 r-c+3=4 r-c+3=3 r-c+3=2
row 3: r-c+3=6 r-c+3=5 r-c+3=4 r-c+3=3
```

**Placing a queen at (r, c):**
1. Increment `colCount[c]`
2. Increment `diagCount[r + c]`
3. Increment `antiDiagCount[r - c + N - 1]`

**Conflict check:** If any counter > 1 after placement, there is a conflict.

**Time complexity:** O(1) per placement/removal, O(N) to rebuild all counters from scratch.

---

## Backtracking Solver

The backtracking solver places queens one row at a time, trying each column in the current row and recursing to the next row if no conflict is detected. If no valid column exists, it backtracks.

### Step-by-Step 4×4 Example

```
Step 1: Try row 0, col 0 → Place queen at (0,0)
  . Q . .    ← Actually (0,0):
  Q . . .
  Board: [0, -, -, -]

Step 1: Row 0, try col 0 → Place Q at (0,0)
  Board: [0, -, -, -]
  Q . . .
  . . . .
  . . . .
  . . . .

Step 2: Row 1, try col 0 → Conflict (same col). Try col 1 → Conflict (diagonal).
  Try col 2 → OK! Place Q at (1,2)
  Board: [0, 2, -, -]
  Q . . .
  . . Q .
  . . . .
  . . . .

Step 3: Row 2, try col 0 → Conflict (col 0 taken). Try col 1 → Conflict (diagonal with (0,0)).
  Try col 2 → Conflict (col 2 taken). Try col 3 → Conflict (diagonal with (1,2)).
  DEAD END → Backtrack to row 1.

Step 4: Back in row 1, try col 3 → OK! Place Q at (1,3)
  Board: [0, 3, -, -]
  Q . . .
  . . . Q
  . . . .
  . . . .

Step 5: Row 2, try col 1 → OK! Place Q at (2,1)
  Board: [0, 3, 1, -]
  Q . . .
  . . . Q
  . Q . .
  . . . .

Step 6: Row 3, try col 0 → Conflict. Try col 1 → Conflict. Try col 2 → OK! Place Q at (3,2)
  Board: [0, 3, 1, 2]  ← but wait, check diagonals...
  Actually col 2: check diagonal (3+2=5) — no conflict. Check anti-diagonal (3-2+3=4) — conflict with (1,3): 1-3+3=1? No...
  Let's recheck. (2,1) has r-c+3 = 4. (3,2) has r-c+3 = 4. CONFLICT! Backtrack.

Step 7: Row 3, try col 2 → Conflict. Try col 3 → Conflict.
  DEAD END → Backtrack to row 2.

  ... (continues until solution [1, 3, 0, 2] is found)

Final solution: [1, 3, 0, 2]
  . Q . .
  . . . Q
  Q . . .
  . . Q .
```

### Algorithm Pseudocode

```
function solve(row):
  if row == N:
    → Found a solution! Record it.
    return

  for col in 0..N-1:
    if not conflicting(row, col):
      placeQueen(row, col)
      solve(row + 1)
      removeQueen(row, col)    ← backtrack
```

---

## Bitmask Optimization

For larger boards (N > 12), the counter-based conflict detection becomes a bottleneck. The **bitmask solver** represents occupied columns and diagonals as bitmasks, enabling **O(1) conflict checking** using bitwise operations.

### Line-by-Line Explanation

```typescript
function solveBitmask(
  row: number,         // Current row being processed
  cols: number,        // Bitmask: bit i set ↔ column i is occupied
  diag: number,        // Bitmask: bit i set ↔ diagonal (r+c)=i is occupied
  antiDiag: number,    // Bitmask: bit i set ↔ anti-diagonal (r-c+N-1)=i is occupied
  n: number,           // Board size
): number {
  // BASE CASE: all rows filled → found one solution
  if (row === n) return 1;

  let count = 0;

  // availableCols: bits that are NOT blocked by any constraint
  // ~(cols | diag | antiDiag) gives us columns that are free
  // & ((1 << n) - 1) masks to only the N relevant bits
  let available = ~(cols | diag | antiDiag) & ((1 << n) - 1);

  // Iterate over each set bit in 'available'
  while (available) {
    // Isolate the lowest set bit → this is our chosen column
    const bit = available & (-available);

    // Recurse to next row:
    //   cols | bit         → mark this column as occupied
    //   (diag | bit) << 1  → shift diagonal mask left (diagonal moves down-right)
    //   (antiDiag | bit) >> 1 → shift anti-diagonal mask right (anti-diagonal moves down-left)
    count += solveBitmask(
      row + 1,
      cols | bit,
      (diag | bit) << 1,
      (antiDiag | bit) >> 1,
      n,
    );

    // Remove this bit from available to try the next column
    available &= available - 1;
  }

  return count;
}
```

**Key insight:** The diagonal masks are **shifted** at each row because, as you move one row down, a diagonal that passed through column `c` in the current row now passes through column `c+1` (or `c-1` for anti-diagonals) in the next row.

---

## Solution Counting

The solver can operate in two modes:

1. **Find one solution:** Returns the first valid solution found (used for hint generation and validation).
2. **Count all solutions:** Returns the total number of valid solutions (used for displaying solution counts in the UI).

For boards N ≤ 12, the counter-based backtracking solver is fast enough. For N > 12, the bitmask solver is used. Solution counts for all supported board sizes (1–16) are pre-computed and stored in `config/game.config.ts` so the solver doesn't need to run at startup.

---

## Partial Board Solving

When the player has already placed some queens, the solver can determine whether the current partial placement can lead to a valid solution. This is used for:

1. **Hint generation:** Determining which cells are still viable.
2. **Early feedback:** Warning the player when no solution is possible from the current state.

The partial solver works by:
1. Initializing the constraint counters/bitmasks with the pre-placed queens.
2. Running backtracking only on the remaining empty rows.
3. Returning `true` (solvable) or `false` (dead end) as soon as determined.

---

## Hint Engine Decision Tree

The hint engine provides tiered assistance based on the player's current board state:

```
Player requests a hint
        │
        ▼
  Is the current board solvable?
    │             │
   YES            NO
    │             │
    ▼             ▼
  Tier 1:      "Your current placement
  Highlight    has no solution.
  a safe row   Remove a queen to
  (cheapest)   continue."
    │
    ▼
  Player requests another hint
    │
    ▼
  Tier 2:
  Highlight a safe row AND column
  (medium cost)
    │
    ▼
  Player requests another hint
    │
    ▼
  Tier 3:
  Reveal the exact cell for the
  next queen placement
  (most expensive)
```

**Hint selection strategy:**
1. Run the partial solver to find a valid completion.
2. Choose the row with the **fewest** valid columns (most constrained) — this gives the most useful hint.
3. For Tier 1, highlight just the row. For Tier 2, highlight the row and column. For Tier 3, show the exact cell.

See [GAME_LOGIC.md](./GAME_LOGIC.md) for hint costs and scoring penalties.

---

## Daily Puzzle Seeded Generation

Each day's puzzle is generated deterministically from a **seed** derived from the date:

```typescript
// Seed = YYYYMMDD as an integer
const seed = year * 10000 + month * 100 + day;
// e.g., 2026-11-07 → 20261107
```

The seeded random number generator (a simple **mulberry32** or **xoshiro128** PRNG) is used to:

1. **Select a board size:** Weighted random from 6×6 to 10×10 (biased toward 8×8 for the classic experience).
2. **Select a solution:** Generate all solutions for that board size (pre-computed), then use the PRNG to pick one as the "target" solution.
3. **Pre-place queens (optional):** For easier daily puzzles, 1–2 queens from the target solution may be pre-placed.

**Determinism guarantee:** Because the PRNG is seeded with the date, every player worldwide generates the exact same puzzle for a given day. This enables fair score comparison without a server.

---

## Complexity Analysis

| Operation | Counter-Based | Bitmask |
|-----------|--------------|---------|
| Place/remove queen | O(1) | O(1) |
| Conflict check (single cell) | O(1) | O(1) |
| Full board validation | O(N) | O(N) |
| Find one solution | O(N!) worst case | O(N!) worst case |
| Count all solutions (N=8) | ~8ms | ~1ms |
| Count all solutions (N=12) | ~15s | ~0.5s |
| Count all solutions (N=16) | Impractical | ~45s |

> [!TIP]
> For the game, we never need to count all solutions at runtime. Solution counts are pre-computed in config. The solver is only used to find **one** solution (for hint generation) or to check **solvability** of a partial board, both of which are fast even for N=16.

**Space complexity:** O(N) for the board representation and counter arrays. O(N) call stack depth for the recursive solver.

---

## How to Extend the Solver

To add a new solver variant or optimization:

1. **Create a new file** in `core/` (e.g., `core/solver-dancing-links.ts`).
2. **Implement the `Solver` interface** defined in `core/types.ts`:
   ```typescript
   interface Solver {
     findOneSolution(n: number, preplaced?: PartialBoard): Solution | null;
     countSolutions(n: number): number;
     isSolvable(n: number, preplaced: PartialBoard): boolean;
   }
   ```
3. **Keep it pure:** No React, browser, or Node.js-specific imports.
4. **Add tests** in `__tests__/core/` — verify against known solution counts for N=1 through N=12.
5. **Register the solver** in `config/game.config.ts` if it should be selectable.
6. **Benchmark** against the existing bitmask solver using the test suite.

> [!NOTE]
> A **Dancing Links (DLX)** solver based on Knuth's Algorithm X is a potential future optimization for very large boards or for variant puzzles with additional constraints. It models N-Queens as an exact cover problem.
