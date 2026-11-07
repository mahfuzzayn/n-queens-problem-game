/**
 * Board representation helpers and converters.
 * 
 * We use two models:
 * 1. UI Model: Set<string> of "row,col" coordinates, allows free placement anywhere
 * 2. Solver Model: number[] where array[row] = col, or -1 if empty (one queen per row)
 * 
 * This module provides lossless bidirectional conversion and helper utilities.
 */

import type { Position, SolverBoard } from '@/types';

/**
 * Converts a Position object to a "row,col" string key.
 */
export function positionToKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

/**
 * Parses a "row,col" string key back into a Position object.
 */
export function keyToPosition(key: string): Position {
  const [rowStr, colStr] = key.split(',');
  const row = parseInt(rowStr, 10);
  const col = parseInt(colStr, 10);
  if (isNaN(row) || isNaN(col)) {
    throw new Error(`Invalid position key: "${key}"`);
  }
  return { row, col };
}

/**
 * Checks if a position is within the bounds of an N×N board.
 */
export function isInBounds(pos: Position, n: number): boolean {
  return pos.row >= 0 && pos.row < n && pos.col >= 0 && pos.col < n;
}

/**
 * Converts a set of "row,col" strings into an array of Position objects.
 */
export function keysToPositions(keys: Set<string> | string[]): Position[] {
  const result: Position[] = [];
  for (const key of keys) {
    result.push(keyToPosition(key));
  }
  return result;
}

/**
 * Converts an array of Positions into a Set of "row,col" keys.
 */
export function positionsToKeys(positions: Position[]): Set<string> {
  const set = new Set<string>();
  for (const pos of positions) {
    set.add(positionToKey(pos));
  }
  return set;
}

/**
 * Converts a general set of queen positions into solver format (number[]).
 * If a row has multiple queens, only the first encountered column is recorded
 * (multiple queens per row is an invalid state that validator detects).
 * Rows with no queens are set to -1.
 */
export function boardToSolver(queens: Set<string> | Position[], n: number): SolverBoard {
  const solver: SolverBoard = new Array(n).fill(-1);
  const posArray = queens instanceof Set ? keysToPositions(queens) : queens;

  for (const pos of posArray) {
    if (pos.row >= 0 && pos.row < n && pos.col >= 0 && pos.col < n) {
      if (solver[pos.row] === -1) {
        solver[pos.row] = pos.col;
      }
    }
  }

  return solver;
}

/**
 * Converts a solver board (number[]) back into a Position array.
 */
export function solverToBoard(solver: SolverBoard): Position[] {
  const positions: Position[] = [];
  for (let row = 0; row < solver.length; row++) {
    const col = solver[row];
    if (col !== -1 && col >= 0) {
      positions.push({ row, col });
    }
  }
  return positions;
}

/**
 * Creates an empty N×N solver board (all -1).
 */
export function createEmptySolverBoard(n: number): SolverBoard {
  return new Array(n).fill(-1);
}
