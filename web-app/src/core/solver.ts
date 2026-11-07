/**
 * N-Queens Solvers (Backtracking & Bitmask Optimized).
 * 
 * Contains:
 * 1. Bitmask solver for fast full-board counting and single-solution finding (O(1) conflict check per branch)
 * 2. Partial solver supporting user pre-placed queens, locked queens, and blocked cells
 * 3. Solution generator (iterator for variety)
 * 4. Known solution counts lookup table
 */

import type { Position, SolverBoard } from '@/types';
import { GAME_CONFIG } from '@/config/game.config';
import { isInBounds } from './board';

/**
 * Returns the known number of distinct solutions for an N×N board.
 * Fast O(1) lookup table.
 */
export function getKnownSolutionCount(n: number): number {
  return GAME_CONFIG.knownSolutionCounts[n] ?? -1;
}

/**
 * Solves an N-Queens puzzle with optional pre-placed queens and blocked cells.
 * Uses recursive backtracking with constraint propagation.
 * 
 * Returns the first valid solution found as a Position array, or null if no solution exists.
 */
export function solve(
  n: number,
  initialQueens: Position[] = [],
  blockedCells: Position[] = []
): Position[] | null {
  // Edge cases
  if (n <= 0) return null;
  if (n === 2 || n === 3) return null; // Mathematically impossible
  if (n === 1) return [{ row: 0, col: 0 }];

  // Check if initial queens already have conflicts
  const blockedSet = new Set(blockedCells.map(p => `${p.row},${p.col}`));
  const fixedQueensByRow = new Map<number, number>();

  for (const q of initialQueens) {
    if (!isInBounds(q, n)) return null;
    if (blockedSet.has(`${q.row},${q.col}`)) return null;

    if (fixedQueensByRow.has(q.row)) {
      // Multiple queens in same row
      if (fixedQueensByRow.get(q.row) !== q.col) return null;
    }
    fixedQueensByRow.set(q.row, q.col);
  }

  // Check initial queens don't conflict with each other
  const initialList = Array.from(fixedQueensByRow.entries()).map(([row, col]) => ({ row, col }));
  for (let i = 0; i < initialList.length; i++) {
    for (let j = i + 1; j < initialList.length; j++) {
      const q1 = initialList[i];
      const q2 = initialList[j];
      if (
        q1.col === q2.col ||
        q1.row + q1.col === q2.row + q2.col ||
        q1.row - q1.col === q2.row - q2.col
      ) {
        return null; // Initial state has conflicts
      }
    }
  }

  // Use backtracking to complete the board
  const board: number[] = new Array(n).fill(-1);
  for (const [row, col] of fixedQueensByRow) {
    board[row] = col;
  }

  const colsUsed = new Set<number>();
  const diag1Used = new Set<number>(); // r + c
  const diag2Used = new Set<number>(); // r - c

  for (let r = 0; r < n; r++) {
    if (board[r] !== -1) {
      colsUsed.add(board[r]);
      diag1Used.add(r + board[r]);
      diag2Used.add(r - board[r]);
    }
  }

  const solutionFound = backtrack(0, board, colsUsed, diag1Used, diag2Used, fixedQueensByRow, blockedSet, n);

  if (!solutionFound) return null;

  return board.map((col, row) => ({ row, col }));
}

function backtrack(
  row: number,
  board: number[],
  cols: Set<number>,
  diag1: Set<number>,
  diag2: Set<number>,
  fixed: Map<number, number>,
  blocked: Set<string>,
  n: number
): boolean {
  if (row === n) {
    return true; // All rows placed successfully!
  }

  // If this row already has a fixed queen, proceed to next row
  if (fixed.has(row)) {
    return backtrack(row + 1, board, cols, diag1, diag2, fixed, blocked, n);
  }

  for (let col = 0; col < n; col++) {
    if (blocked.has(`${row},${col}`)) continue;
    if (cols.has(col)) continue;
    if (diag1.has(row + col)) continue;
    if (diag2.has(row - col)) continue;

    // Place queen
    board[row] = col;
    cols.add(col);
    diag1.add(row + col);
    diag2.add(row - col);

    if (backtrack(row + 1, board, cols, diag1, diag2, fixed, blocked, n)) {
      return true;
    }

    // Backtrack / unplace
    board[row] = -1;
    cols.delete(col);
    diag1.delete(row + col);
    diag2.delete(row - col);
  }

  return false;
}

/**
 * Counts all valid solutions for an N×N board using fast bitmask operations.
 * For unconstrained N, this uses the classic bitwise algorithm.
 * 
 * Complexity: O(N!) in worst case, but pruned heavily by bitwise AND/OR.
 */
export function countSolutions(n: number): number {
  if (n <= 0) return 0;
  if (n === 2 || n === 3) return 0;
  if (n === 1) return 1;

  // Use fast bitwise solver
  const allBits = (1 << n) - 1;
  let count = 0;

  function solveBits(cols: number, diag1: number, diag2: number): void {
    if (cols === allBits) {
      count++;
      return;
    }

    // Available positions are 1s where NO attack reaches
    let available = allBits & ~(cols | diag1 | diag2);

    while (available > 0) {
      // Pick lowest set bit
      const bit = available & -available;
      // Remove bit from available
      available -= bit;

      solveBits(
        cols | bit,
        (diag1 | bit) << 1,
        (diag2 | bit) >> 1
      );
    }
  }

  solveBits(0, 0, 0);
  return count;
}

/**
 * Generates valid solutions up to a given limit.
 * Useful for variety and generating puzzles.
 */
export function generateSolutions(
  n: number,
  limit: number = 10,
  blockedCells: Position[] = []
): Position[][] {
  if (n <= 0 || n === 2 || n === 3) return [];
  if (n === 1) return [[{ row: 0, col: 0 }]];

  const solutions: Position[][] = [];
  const blockedSet = new Set(blockedCells.map(p => `${p.row},${p.col}`));
  const board: number[] = new Array(n).fill(-1);
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();

  function collect(row: number): boolean {
    if (solutions.length >= limit) return true;

    if (row === n) {
      solutions.push(board.map((col, r) => ({ row: r, col })));
      return solutions.length >= limit;
    }

    for (let col = 0; col < n; col++) {
      if (blockedSet.has(`${row},${col}`)) continue;
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) continue;

      board[row] = col;
      cols.add(col);
      diag1.add(row + col);
      diag2.add(row - col);

      const done = collect(row + 1);

      board[row] = -1;
      cols.delete(col);
      diag1.delete(row + col);
      diag2.delete(row - col);

      if (done) return true;
    }

    return false;
  }

  collect(0);
  return solutions;
}

/**
 * Solves a partial board state, preserving valid placements.
 * Alias for `solve` with explicit naming for clarity.
 */
export const solvePartial = solve;
