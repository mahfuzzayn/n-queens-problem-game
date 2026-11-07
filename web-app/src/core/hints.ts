/**
 * Tiered Hint Engine.
 * 
 * Rules:
 * Tier 1 - "Nudge": Highlights a conflicting queen or detects if current layout is a dead end.
 * Tier 2 - "Safe Cell": Finds an unplaced row/cell that leads to a valid completion.
 * Tier 3 - "Reveal": Places a correct queen from a valid solution.
 */

import type { Position, HintTier, HintResult } from '@/types';
import { STRINGS } from './strings';
import { findConflicts } from './validator';
import { solve } from './solver';
import { isInBounds } from './board';

/**
 * Generates a tiered hint based on the current board state.
 * 
 * @param n Board dimension (N×N)
 * @param currentQueens Current user queen placements
 * @param tier Hint tier requested (1, 2, or 3)
 * @param blockedCells Optional blocked/obstacle cells
 */
export function getHint(
  n: number,
  currentQueens: Position[],
  tier: HintTier,
  blockedCells: Position[] = []
): HintResult {
  // Edge cases
  if (n <= 0 || n === 2 || n === 3) {
    return {
      tier,
      type: 'dead-end',
      message: STRINGS.hints.deadEnd,
    };
  }

  // Check for existing direct conflicts first
  const conflictResult = findConflicts(currentQueens, n);
  if (conflictResult.conflicts.length > 0) {
    // Pick the first conflicting queen
    const badQueen = conflictResult.conflicts[0].queenA;
    return {
      tier: 1,
      type: 'nudge',
      position: badQueen,
      message: STRINGS.hints.nudge,
    };
  }

  // Check if current configuration can be completed to a full solution
  const solution = solve(n, currentQueens, blockedCells);

  if (!solution) {
    // Current layout is a dead end (no possible completion without removing something)
    return {
      tier,
      type: 'dead-end',
      message: STRINGS.hints.deadEnd,
    };
  }

  // Already solved?
  if (currentQueens.length === n) {
    return {
      tier,
      type: 'safe-cell',
      message: 'Board is already solved!',
    };
  }

  // Find placed rows
  const placedRows = new Set(currentQueens.map((q) => q.row));

  // Find a queen in the solution that is not yet placed
  const candidate = solution.find((sq) => !placedRows.has(sq.row));

  if (!candidate) {
    return {
      tier,
      type: 'dead-end',
      message: STRINGS.hints.deadEnd,
    };
  }

  if (tier === 1) {
    // For tier 1 without conflicts, reassure or point towards safe area
    return {
      tier: 1,
      type: 'nudge',
      position: candidate,
      message: 'Current layout is valid! Try placing in row ' + (candidate.row + 1) + '.',
    };
  }

  if (tier === 2) {
    // Tier 2: Safe Cell highlight
    return {
      tier: 2,
      type: 'safe-cell',
      position: candidate,
      message: STRINGS.hints.safeCell,
    };
  }

  // Tier 3: Reveal
  return {
    tier: 3,
    type: 'reveal',
    position: candidate,
    message: STRINGS.hints.reveal,
  };
}
