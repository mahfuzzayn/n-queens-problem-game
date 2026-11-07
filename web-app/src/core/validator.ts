/**
 * Game validation and conflict detection.
 * 
 * Provides O(Q) conflict detection using counter arrays:
 * - rowCount[r]
 * - colCount[c]
 * - diag1Count[r + c] (anti-diagonal / top-right to bottom-left)
 * - diag2Count[r - c + N - 1] (main diagonal / top-left to bottom-right)
 */

import type { Position, Conflict, ConflictResult } from '@/types';
import { positionToKey, keysToPositions, isInBounds } from './board';

/**
 * Checks if a position is valid on an N×N board.
 */
export function isValidPosition(pos: Position, n: number): boolean {
  return isInBounds(pos, n);
}

/**
 * Detects all conflicts among placed queens on an N×N board.
 * 
 * Returns:
 * - conflicts: detailed list of conflicting queen pairs with conflict type
 * - conflictingPositions: set of "row,col" keys that are involved in ANY conflict
 * - attackedCells: set of all "row,col" cells that are threatened by at least one queen
 * 
 * Runs in O(N^2 + Q^2) where Q is the number of queens (Q <= N^2, typically Q <= N).
 */
export function findConflicts(
  queens: Set<string> | Position[],
  n: number
): ConflictResult {
  const positions = queens instanceof Set ? keysToPositions(queens) : queens;
  const conflicts: Conflict[] = [];
  const conflictingPositions = new Set<string>();

  // Check each pair of queens for conflicts
  for (let i = 0; i < positions.length; i++) {
    const q1 = positions[i];
    for (let j = i + 1; j < positions.length; j++) {
      const q2 = positions[j];

      let conflictType: Conflict['type'] | null = null;

      if (q1.row === q2.row) {
        conflictType = 'row';
      } else if (q1.col === q2.col) {
        conflictType = 'column';
      } else if (q1.row + q1.col === q2.row + q2.col) {
        // Diagonal: top-right to bottom-left (sum of row+col is constant)
        conflictType = 'diagonal-up';
      } else if (q1.row - q1.col === q2.row - q2.col) {
        // Diagonal: top-left to bottom-right (diff row-col is constant)
        conflictType = 'diagonal-down';
      }

      if (conflictType) {
        conflicts.push({ queenA: q1, queenB: q2, type: conflictType });
        conflictingPositions.add(positionToKey(q1));
        conflictingPositions.add(positionToKey(q2));
      }
    }
  }

  // Calculate all cells under attack
  const attackedCells = getAttackedCells(positions, n);

  return {
    conflicts,
    conflictingPositions,
    attackedCells,
  };
}

/**
 * Computes all cells on the board that are under attack by the current queens.
 * 
 * A cell is under attack if any queen shares its row, column, or diagonal.
 * Cells containing the queens themselves are included in the attacked set.
 */
export function getAttackedCells(
  queens: Set<string> | Position[],
  n: number
): Set<string> {
  const attacked = new Set<string>();
  const positions = queens instanceof Set ? keysToPositions(queens) : queens;

  for (const q of positions) {
    if (!isInBounds(q, n)) continue;

    // Attacked row & column
    for (let i = 0; i < n; i++) {
      attacked.add(`${q.row},${i}`); // entire row
      attacked.add(`${i},${q.col}`); // entire col
    }

    // Attacked diagonals
    for (let r = 0; r < n; r++) {
      // Diagonal 1 (q.row + q.col === r + c) => c = q.row + q.col - r
      const c1 = q.row + q.col - r;
      if (c1 >= 0 && c1 < n) {
        attacked.add(`${r},${c1}`);
      }

      // Diagonal 2 (q.row - q.col === r - c) => c = r - (q.row - q.col)
      const c2 = r - (q.row - q.col);
      if (c2 >= 0 && c2 < n) {
        attacked.add(`${r},${c2}`);
      }
    }
  }

  return attacked;
}

/**
 * Checks if the board represents a valid solved state:
 * Exactly N queens placed, zero conflicts, and no blocked cells occupied.
 */
export function isSolved(
  queens: Set<string> | Position[],
  n: number,
  blockedCells?: Set<string> | Position[]
): boolean {
  const positions = queens instanceof Set ? keysToPositions(queens) : queens;

  // Must have exactly N queens
  if (positions.length !== n) {
    return false;
  }

  // No queens on blocked cells
  if (blockedCells) {
    const blockedSet =
      blockedCells instanceof Set
        ? blockedCells
        : new Set(blockedCells.map(positionToKey));
    for (const q of positions) {
      if (blockedSet.has(positionToKey(q))) {
        return false;
      }
    }
  }

  // All positions must be in bounds
  for (const q of positions) {
    if (!isInBounds(q, n)) return false;
  }

  // Fast O(N) conflict check using bitmasks/counters
  const rows = new Set<number>();
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // r + c
  const diag2 = new Set<number>(); // r - c

  for (const q of positions) {
    if (rows.has(q.row)) return false;
    if (cols.has(q.col)) return false;
    if (diag1.has(q.row + q.col)) return false;
    if (diag2.has(q.row - q.col)) return false;

    rows.add(q.row);
    cols.add(q.col);
    diag1.add(q.row + q.col);
    diag2.add(q.row - q.col);
  }

  return true;
}
