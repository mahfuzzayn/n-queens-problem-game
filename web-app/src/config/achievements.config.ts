/**
 * Achievement definitions for the game's achievement system.
 * Each achievement has a unique ID, display info, and category.
 */
export interface AchievementConfig {
  /** Unique identifier for the achievement */
  id: string;
  /** Display name shown to the player */
  name: string;
  /** Description of how to earn the achievement */
  description: string;
  /** Emoji icon for the achievement */
  icon: string;
  /** Category used for grouping in the achievements UI */
  category: 'skill' | 'progression' | 'challenge' | 'social' | 'special';
}

export const ACHIEVEMENTS: AchievementConfig[] = [
  { id: 'first_win', name: 'First Victory', description: 'Solve your first puzzle', icon: '🏆', category: 'progression' },
  { id: 'no_hints_hero', name: 'No Hints Hero', description: 'Solve any puzzle without using hints', icon: '🧠', category: 'skill' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Solve an 8×8 board in under 60 seconds', icon: '⚡', category: 'challenge' },
  { id: 'size_master', name: 'Size Master', description: 'Solve every board size from 4 to 12', icon: '👑', category: 'challenge' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day play streak', icon: '🔥', category: 'progression' },
  { id: 'impossible_learner', name: 'Impossible Learner', description: 'View the proof that N=2 or N=3 has no solution', icon: '📚', category: 'special' },
  { id: 'perfect_score', name: 'Perfectionist', description: 'Achieve a perfect score (no hints, no conflicts made)', icon: '💎', category: 'skill' },
  { id: 'hint_master', name: 'Hint Master', description: 'Use all 3 tiers of hints in a single game', icon: '💡', category: 'special' },
  { id: 'campaign_beginner', name: 'Campaign Beginner', description: 'Complete 5 campaign levels', icon: '🌟', category: 'progression' },
  { id: 'campaign_champion', name: 'Campaign Champion', description: 'Complete all campaign levels', icon: '🏅', category: 'progression' },
  { id: 'three_star_level', name: 'Star Collector', description: 'Earn 3 stars on any level', icon: '⭐', category: 'skill' },
  { id: 'all_stars_world1', name: 'World 1 Master', description: 'Earn 3 stars on all World 1 levels', icon: '🌍', category: 'challenge' },
  { id: 'speed_4', name: 'Lightning Solver', description: 'Solve a 4×4 in under 10 seconds', icon: '⚡', category: 'challenge' },
  { id: 'undo_free', name: 'No Regrets', description: 'Solve a puzzle without using undo', icon: '✊', category: 'skill' },
  { id: 'daily_first', name: 'Daily Debut', description: 'Complete your first daily puzzle', icon: '📅', category: 'progression' },
  { id: 'daily_streak_30', name: 'Monthly Dedication', description: 'Complete 30 daily puzzles in a row', icon: '📆', category: 'challenge' },
  { id: 'coins_1000', name: 'Coin Collector', description: 'Earn 1,000 total coins', icon: '💰', category: 'progression' },
  { id: 'level_10', name: 'Seasoned Player', description: 'Reach player level 10', icon: '🎮', category: 'progression' },
  { id: 'time_attack_win', name: 'Under Pressure', description: 'Win a Time Attack game', icon: '⏱️', category: 'skill' },
  { id: 'big_board', name: 'Big Thinker', description: 'Solve a 16×16 board', icon: '🧩', category: 'challenge' },
] as const;
