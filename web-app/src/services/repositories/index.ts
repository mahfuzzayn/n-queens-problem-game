/**
 * Repositories for Decoupled Persistence.
 * 
 * Provides domain-specific interfaces to load/save profile, settings, level progress, and active game.
 */

import type { PlayerProfile, GameSettings, LevelProgress, SavedGameState } from '@/types';
import { defaultStorage, type StorageAdapter } from '../storage';

const STORAGE_KEYS = {
  SCHEMA_VERSION: 'nq_schema_version',
  PROFILE: 'nq_player_profile',
  SETTINGS: 'nq_game_settings',
  LEVEL_PROGRESS: 'nq_level_progress',
  SAVED_GAME: 'nq_saved_game',
} as const;

export const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  showAttackLines: true,
  showConflicts: true,
  reduceMotion: false,
  theme: 'classic-royal',
  volume: 0.8,
};

export const DEFAULT_PROFILE: PlayerProfile = {
  xp: 0,
  level: 1,
  coins: 50,
  gems: 5,
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  currentDailyStreak: 0,
  longestDailyStreak: 0,
  currentWinStreak: 0,
  longestWinStreak: 0,
  lastPlayDate: null,
  unlockedAchievements: [],
  personalBests: {},
};

export class ProgressRepository {
  constructor(private storage: StorageAdapter = defaultStorage) {}

  async getProfile(): Promise<PlayerProfile> {
    const data = await this.storage.get<PlayerProfile>(STORAGE_KEYS.PROFILE);
    return data ? { ...DEFAULT_PROFILE, ...data } : { ...DEFAULT_PROFILE };
  }

  async saveProfile(profile: PlayerProfile): Promise<void> {
    await this.storage.set(STORAGE_KEYS.PROFILE, profile);
  }

  async getLevelProgress(): Promise<Record<string, LevelProgress>> {
    const data = await this.storage.get<Record<string, LevelProgress>>(STORAGE_KEYS.LEVEL_PROGRESS);
    return data ?? {};
  }

  async saveLevelProgress(levelId: string, progress: LevelProgress): Promise<void> {
    const all = await this.getLevelProgress();
    all[levelId] = progress;
    await this.storage.set(STORAGE_KEYS.LEVEL_PROGRESS, all);
  }
}

export class SettingsRepository {
  constructor(private storage: StorageAdapter = defaultStorage) {}

  async getSettings(): Promise<GameSettings> {
    const data = await this.storage.get<GameSettings>(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...data } : { ...DEFAULT_SETTINGS };
  }

  async saveSettings(settings: GameSettings): Promise<void> {
    await this.storage.set(STORAGE_KEYS.SETTINGS, settings);
  }
}

export class GameSaveRepository {
  constructor(private storage: StorageAdapter = defaultStorage) {}

  async getSavedGame(): Promise<SavedGameState | null> {
    return this.storage.get<SavedGameState>(STORAGE_KEYS.SAVED_GAME);
  }

  async saveGame(state: SavedGameState): Promise<void> {
    await this.storage.set(STORAGE_KEYS.SAVED_GAME, state);
  }

  async clearSavedGame(): Promise<void> {
    await this.storage.remove(STORAGE_KEYS.SAVED_GAME);
  }
}

export const progressRepo = new ProgressRepository();
export const settingsRepo = new SettingsRepository();
export const gameSaveRepo = new GameSaveRepository();
