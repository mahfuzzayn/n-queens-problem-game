/**
 * Scoring system configuration.
 *
 * Formula:
 *   baseScore      = N * 100
 *   timeBonus      = max(0, parTime(N) - elapsedSeconds) * timeMultiplier
 *   efficiencyBonus= max(0, (parMoves(N) - moves)) * efficiencyBonusPerMove
 *   hintPenalty    = hintsUsed * hintPenalty
 *   undoPenalty    = max(0, undos - freeUndos) * undoPenalty
 *   perfectBonus   = (no hints && no conflicts made) ? N * perfectBonusMultiplier : 0
 *   finalScore     = max(0, baseScore + timeBonus + efficiencyBonus + perfectBonus - hintPenalty - undoPenalty)
 */
export const SCORING_CONFIG = {
  /** Multiplier for remaining time bonus */
  timeMultiplier: 2,
  /** Points per move saved under par */
  efficiencyBonusPerMove: 5,
  /** Points deducted per hint used */
  hintPenalty: 75,
  /** Points deducted per undo beyond free undos */
  undoPenalty: 10,
  /** Multiplier for perfect game bonus (N * this value) */
  perfectBonusMultiplier: 50,
  /** Par times in seconds per board size */
  parTime: {
    1: 5, 2: 10, 3: 10, 4: 30, 5: 60, 6: 90, 7: 120,
    8: 180, 9: 240, 10: 300, 11: 360, 12: 420,
    13: 480, 14: 540, 15: 600, 16: 660,
  } as Record<number, number>,
  /** Par moves (placements) per board size */
  parMoves: {
    1: 1, 2: 2, 3: 3, 4: 6, 5: 8, 6: 10, 7: 12,
    8: 14, 9: 16, 10: 18, 11: 20, 12: 22,
    13: 24, 14: 26, 15: 28, 16: 30,
  } as Record<number, number>,
} as const;
