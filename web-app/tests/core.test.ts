import { describe, it, expect } from 'vitest';
import {
  findConflicts,
  isSolved,
  getAttackedCells,
  solve,
  countSolutions,
  generateSolutions,
  calculateScore,
  calculateStars,
  getHint,
  generateDailyPuzzle,
  createSeededRng,
  boardToSolver,
  solverToBoard,
  positionToKey,
  keyToPosition,
} from '../src/core';
import type { Position } from '../src/types';

describe('Board conversions', () => {
  it('converts position to key and back', () => {
    const pos = { row: 3, col: 5 };
    const key = positionToKey(pos);
    expect(key).toBe('3,5');
    expect(keyToPosition(key)).toEqual(pos);
  });

  it('converts between board representation and solver representation', () => {
    const queens: Position[] = [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 0 },
      { row: 3, col: 2 },
    ];
    const solver = boardToSolver(queens, 4);
    expect(solver).toEqual([1, 3, 0, 2]);
    const restored = solverToBoard(solver);
    expect(restored).toEqual(queens);
  });
});

describe('Conflict Detection and Validation', () => {
  it('detects row conflicts', () => {
    const queens: Position[] = [
      { row: 0, col: 0 },
      { row: 0, col: 3 },
    ];
    const { conflicts, conflictingPositions } = findConflicts(queens, 4);
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].type).toBe('row');
    expect(conflictingPositions.has('0,0')).toBe(true);
    expect(conflictingPositions.has('0,3')).toBe(true);
  });

  it('detects column conflicts', () => {
    const queens: Position[] = [
      { row: 1, col: 2 },
      { row: 3, col: 2 },
    ];
    const { conflicts } = findConflicts(queens, 4);
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].type).toBe('column');
  });

  it('detects diagonal conflicts (both directions)', () => {
    // Diagonal down: (0,0) and (2,2)
    const downResult = findConflicts(
      [
        { row: 0, col: 0 },
        { row: 2, col: 2 },
      ],
      4
    );
    expect(downResult.conflicts[0].type).toBe('diagonal-down');

    // Diagonal up: (0,3) and (2,1) -> 0+3 == 2+1 == 3
    const upResult = findConflicts(
      [
        { row: 0, col: 3 },
        { row: 2, col: 1 },
      ],
      4
    );
    expect(upResult.conflicts[0].type).toBe('diagonal-up');
  });

  it('calculates attacked cells', () => {
    const attacked = getAttackedCells([{ row: 1, col: 1 }], 3);
    // On 3x3 with queen at (1,1), all 9 cells are attacked
    expect(attacked.size).toBe(9);
  });

  it('correctly checks isSolved', () => {
    // Valid 4x4 solution: [1, 3, 0, 2]
    const valid4x4: Position[] = [
      { row: 0, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 0 },
      { row: 3, col: 2 },
    ];
    expect(isSolved(valid4x4, 4)).toBe(true);

    // Incomplete
    expect(isSolved(valid4x4.slice(0, 3), 4)).toBe(false);

    // Conflicting
    const conflicting: Position[] = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
    ];
    expect(isSolved(conflicting, 4)).toBe(false);
  });
});

describe('Solver and Bitmask Counting', () => {
  it('correctly handles N=1', () => {
    expect(countSolutions(1)).toBe(1);
    const sol = solve(1);
    expect(sol).toEqual([{ row: 0, col: 0 }]);
  });

  it('proves N=2 and N=3 have no solutions', () => {
    expect(countSolutions(2)).toBe(0);
    expect(solve(2)).toBeNull();

    expect(countSolutions(3)).toBe(0);
    expect(solve(3)).toBeNull();
  });

  it('matches known solution counts for N=4..8', () => {
    expect(countSolutions(4)).toBe(2);
    expect(countSolutions(5)).toBe(10);
    expect(countSolutions(6)).toBe(4);
    expect(countSolutions(7)).toBe(40);
    expect(countSolutions(8)).toBe(92);
  });

  it('solves partial boards respecting constraints', () => {
    // 4x4 partial starting with queen at (0, 1)
    const sol = solve(4, [{ row: 0, col: 1 }]);
    expect(sol).not.toBeNull();
    expect(sol).toHaveLength(4);
    expect(isSolved(sol!, 4)).toBe(true);
    expect(sol![0]).toEqual({ row: 0, col: 1 });
  });

  it('returns null when partial board is a dead end', () => {
    // On 4x4, queen at (0,0) and (1,2) cannot lead to a valid 4-queens solution
    const deadEnd = solve(4, [
      { row: 0, col: 0 },
      { row: 1, col: 2 },
    ]);
    expect(deadEnd).toBeNull();
  });

  it('generates multiple solutions', () => {
    const sols = generateSolutions(4, 5);
    expect(sols.length).toBe(2); // Only 2 exist for N=4
    expect(isSolved(sols[0], 4)).toBe(true);
    expect(isSolved(sols[1], 4)).toBe(true);
  });
});

describe('Hint Engine', () => {
  it('returns dead-end hint when board cannot be completed', () => {
    const hint = getHint(
      4,
      [
        { row: 0, col: 0 },
        { row: 1, col: 2 },
      ],
      1
    );
    expect(hint.type).toBe('dead-end');
  });

  it('returns nudge hint on conflicting queens', () => {
    const hint = getHint(
      4,
      [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
      ],
      1
    );
    expect(hint.type).toBe('nudge');
    expect(hint.position).toBeDefined();
  });

  it('returns safe cell hint for tier 2 on a valid partial state', () => {
    const hint = getHint(4, [{ row: 0, col: 1 }], 2);
    expect(hint.type).toBe('safe-cell');
    expect(hint.position).toBeDefined();
    // Valid solution with (0,1) is (0,1), (1,3), (2,0), (3,2)
    // Candidate should be in row 1, 2, or 3
    expect(hint.position!.row).toBeGreaterThan(0);
  });

  it('returns reveal hint for tier 3', () => {
    const hint = getHint(4, [{ row: 0, col: 1 }], 3);
    expect(hint.type).toBe('reveal');
    expect(hint.position).toBeDefined();
  });
});

describe('Scoring and Stars Calculation', () => {
  it('calculates score with time and efficiency bonus', () => {
    const score = calculateScore({
      n: 8,
      elapsedSeconds: 60,
      moves: 8,
      hintsUsed: 0,
      undosUsed: 0,
      conflictsMade: 0,
    });

    expect(score.baseScore).toBe(800);
    expect(score.timeBonus).toBeGreaterThan(0);
    expect(score.perfectBonus).toBe(8 * 50);
    expect(score.finalScore).toBeGreaterThan(800);
  });

  it('applies penalties for hints and undos', () => {
    const cleanScore = calculateScore({
      n: 8,
      elapsedSeconds: 60,
      moves: 8,
      hintsUsed: 0,
      undosUsed: 0,
      conflictsMade: 0,
    });

    const penalScore = calculateScore({
      n: 8,
      elapsedSeconds: 60,
      moves: 8,
      hintsUsed: 2,
      undosUsed: 5,
      conflictsMade: 1,
    });

    expect(penalScore.hintPenalty).toBe(150);
    expect(penalScore.undoPenalty).toBe(20); // (5 - 3 free) * 10
    expect(penalScore.perfectBonus).toBe(0);
    expect(penalScore.finalScore).toBeLessThan(cleanScore.finalScore);
  });

  it('clamps score at zero for terrible runs', () => {
    const zeroScore = calculateScore({
      n: 4,
      elapsedSeconds: 9999,
      moves: 500,
      hintsUsed: 10,
      undosUsed: 100,
      conflictsMade: 50,
    });
    expect(zeroScore.finalScore).toBe(0);
  });

  it('calculates stars accurately', () => {
    // Under par, 0 hints -> 3 stars
    expect(calculateStars(8, 60, 0)).toBe(3);
    // Under par, 1 hint -> 2 stars
    expect(calculateStars(8, 60, 1)).toBe(2);
    // Over par, 2 hints -> 1 star
    expect(calculateStars(8, 500, 2)).toBe(1);
  });
});

describe('Deterministic Daily Puzzle Generator', () => {
  it('generates deterministic puzzle for the same date', () => {
    const puzzle1 = generateDailyPuzzle('2026-11-07');
    const puzzle2 = generateDailyPuzzle('2026-11-07');
    expect(puzzle1).toEqual(puzzle2);
  });

  it('produces valid locked queens without conflicts', () => {
    const puzzle = generateDailyPuzzle('2026-11-08');
    expect(puzzle.n).toBeGreaterThanOrEqual(6);
    expect(puzzle.lockedQueens.length).toBeGreaterThanOrEqual(1);

    const { conflicts } = findConflicts(puzzle.lockedQueens, puzzle.n);
    expect(conflicts.length).toBe(0);

    // Verify it is still solvable
    const solution = solve(puzzle.n, puzzle.lockedQueens);
    expect(solution).not.toBeNull();
  });
});
