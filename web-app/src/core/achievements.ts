/**
 * Achievements System Evaluation.
 * 
 * Pure functions to evaluate achievements against player profile & game outcome.
 */

import type { GameResult, PlayerProfile } from '@/types';
import { ACHIEVEMENTS, type AchievementConfig } from '@/config/achievements.config';

/**
 * Checks which achievements are newly unlocked after a completed game.
 */
export function checkGameAchievements(
  result: GameResult,
  profile: PlayerProfile
): AchievementConfig[] {
  const newlyUnlocked: AchievementConfig[] = [];
  const existingUnlocked = new Set(profile.unlockedAchievements);

  function tryUnlock(id: string) {
    if (!existingUnlocked.has(id)) {
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) {
        newlyUnlocked.push(ach);
        existingUnlocked.add(id);
      }
    }
  }

  // 1. First victory
  tryUnlock('first_win');

  // 2. No hints hero
  if (result.hintsUsed === 0) {
    tryUnlock('no_hints_hero');
  }

  // 3. Perfect score (no hints, no conflicts)
  if (result.isPerfect) {
    tryUnlock('perfect_score');
  }

  // 4. Speed Demon (8x8 under 60 seconds)
  if (result.n === 8 && result.timeMs <= 60000) {
    tryUnlock('speed_demon');
  }

  // 5. Lightning solver (4x4 under 10 seconds)
  if (result.n === 4 && result.timeMs <= 10000) {
    tryUnlock('speed_4');
  }

  // 6. No regrets (0 undos used)
  if (result.undosUsed === 0) {
    tryUnlock('undo_free');
  }

  // 7. 3-star level
  if (result.stars === 3) {
    tryUnlock('three_star_level');
  }

  // 8. Time attack win
  if (result.mode === 'time-attack') {
    tryUnlock('time_attack_win');
  }

  // 9. Daily debut
  if (result.mode === 'daily') {
    tryUnlock('daily_first');
  }

  // 10. Big thinker (16x16 board)
  if (result.n === 16) {
    tryUnlock('big_board');
  }

  // 11. Streaks
  if (profile.currentDailyStreak >= 7) {
    tryUnlock('streak_7');
  }
  if (profile.currentDailyStreak >= 30) {
    tryUnlock('daily_streak_30');
  }

  // 12. Level & Coins
  if (profile.coins >= 1000) {
    tryUnlock('coins_1000');
  }
  if (profile.level >= 10) {
    tryUnlock('level_10');
  }

  return newlyUnlocked;
}
