/**
 * Pure scoring and star calculation functions.
 * 
 * Config-driven, completely isolated from UI, easily testable.
 */

import type { ScoreBreakdown, GameResult, GameMode, Position } from '@/types';
import { SCORING_CONFIG } from '@/config/scoring.config';
import { CAMPAIGN_LEVELS } from '@/config/levels.config';

export interface ScoreCalculationParams {
  n: number;
  elapsedSeconds: number;
  moves: number;
  hintsUsed: number;
  undosUsed: number;
  conflictsMade: number;
}

/**
 * Calculates the score breakdown and final score.
 * 
 * Formula:
 *   baseScore       = N * 100
 *   timeBonus       = max(0, parTime(N) - elapsedSeconds) * timeMultiplier
 *   efficiencyBonus = max(0, parMoves(N) - moves) * efficiencyBonusPerMove
 *   hintPenalty     = hintsUsed * hintPenalty
 *   undoPenalty     = max(0, undos - freeUndos) * undoPenalty
 *   perfectBonus    = (no hints && no conflicts) ? N * perfectBonusMultiplier : 0
 *   finalScore      = max(0, base + time + efficiency + perfect - hint - undo)
 */
export function calculateScore(params: ScoreCalculationParams): ScoreBreakdown {
  const { n, elapsedSeconds, moves, hintsUsed, undosUsed, conflictsMade } = params;

  const baseScore = n * 100;

  const parTime = SCORING_CONFIG.parTime[n] ?? (n * 30);
  const timeBonus = Math.max(0, parTime - elapsedSeconds) * SCORING_CONFIG.timeMultiplier;

  const parMoves = SCORING_CONFIG.parMoves[n] ?? (n * 2);
  const efficiencyBonus = Math.max(0, parMoves - moves) * SCORING_CONFIG.efficiencyBonusPerMove;

  const hintPenalty = hintsUsed * SCORING_CONFIG.hintPenalty;

  const freeUndos = 3;
  const undoPenalty = Math.max(0, undosUsed - freeUndos) * SCORING_CONFIG.undoPenalty;

  const isPerfect = hintsUsed === 0 && conflictsMade === 0;
  const perfectBonus = isPerfect ? n * SCORING_CONFIG.perfectBonusMultiplier : 0;

  const subtotal = baseScore + timeBonus + efficiencyBonus + perfectBonus - hintPenalty - undoPenalty;
  const finalScore = Math.max(0, Math.round(subtotal));

  return {
    baseScore,
    timeBonus,
    efficiencyBonus,
    perfectBonus,
    hintPenalty,
    undoPenalty,
    finalScore,
  };
}

/**
 * Calculates stars earned (0 to 3) for completing a game or level.
 * 
 * Rules:
 * - 0 stars: puzzle not solved
 * - 1 star: solved
 * - 2 stars: solved under par time OR with <= 1 hint
 * - 3 stars: solved under par time AND with 0 hints
 */
export function calculateStars(
  n: number,
  elapsedSeconds: number,
  hintsUsed: number,
  levelId?: string
): 0 | 1 | 2 | 3 {
  // If campaign level, use level-specific thresholds if available
  if (levelId) {
    const level = CAMPAIGN_LEVELS.find(l => l.id === levelId);
    if (level) {
      const parTime = level.parTimeSeconds;
      const t3 = level.starThresholds.three;
      const t2 = level.starThresholds.two;

      // 3 stars check
      if (hintsUsed === 0 && elapsedSeconds <= (t3.maxTimeSeconds || parTime)) {
        return 3;
      }

      // 2 stars check
      const meetsTime = t2.maxTimeSeconds ? elapsedSeconds <= t2.maxTimeSeconds : elapsedSeconds <= parTime;
      const meetsHints = t2.maxHints !== undefined ? hintsUsed <= t2.maxHints : hintsUsed <= 1;
      if (meetsTime || meetsHints) {
        return 2;
      }

      return 1;
    }
  }

  // Default stars calculation based on board size par
  const parTime = SCORING_CONFIG.parTime[n] ?? (n * 30);

  if (hintsUsed === 0 && elapsedSeconds <= parTime) {
    return 3;
  }

  if (elapsedSeconds <= parTime || hintsUsed <= 1) {
    return 2;
  }

  return 1;
}

/**
 * Pure function to verify and build a complete GameResult object.
 * Can be run on server in Phase 3 for anti-cheat verification.
 */
export function buildGameResult(
  n: number,
  mode: GameMode,
  queens: Position[],
  timeMs: number,
  moves: number,
  hintsUsed: number,
  undosUsed: number,
  conflictsMade: number,
  levelId?: string,
  seed?: number
): GameResult {
  const elapsedSeconds = Math.floor(timeMs / 1000);
  const scoreBreakdown = calculateScore({
    n,
    elapsedSeconds,
    moves,
    hintsUsed,
    undosUsed,
    conflictsMade,
  });

  const stars = calculateStars(n, elapsedSeconds, hintsUsed, levelId);
  const isPerfect = hintsUsed === 0 && conflictsMade === 0;

  return {
    n,
    mode,
    queens,
    timeMs,
    moves,
    hintsUsed,
    undosUsed,
    conflictsMade,
    score: scoreBreakdown.finalScore,
    stars,
    date: new Date().toISOString(),
    levelId,
    seed,
    isPerfect,
  };
}
