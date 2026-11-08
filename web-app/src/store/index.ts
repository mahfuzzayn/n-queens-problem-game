/**
 * Zustand Global Store.
 * 
 * Separated into:
 * - gameSlice: board, moves, undos, timer, hints, win/lose status
 * - progressSlice: stars, campaign levels, achievements, coins, streaks
 * - settingsSlice: audio, haptics, theme, visual assist toggles
 */

import { create } from 'zustand';
import type {
  Position,
  GameMode,
  GameStatus,
  Move,
  ConflictResult,
  HintResult,
  GameResult,
  GameSettings,
  PlayerProfile,
} from '@/types';
import {
  findConflicts,
  isSolved,
  getAttackedCells,
  calculateScore,
  calculateStars,
  getHint,
  buildGameResult,
} from '@/core';
import { checkGameAchievements } from '@/core/achievements';
import { SHOETIC_AD_CONFIG } from '@/config/ads.config';
import { progressRepo, settingsRepo, gameSaveRepo, DEFAULT_SETTINGS, DEFAULT_PROFILE } from '@/services/repositories';
import { audioService, hapticsService } from '@/services/audio';

interface GameState {
  // Game Slice
  n: number;
  mode: GameMode;
  status: GameStatus;
  queens: Position[];
  lockedQueens: Position[];
  blockedCells: Position[];
  conflictResult: ConflictResult;
  attackedCells: Set<string>;
  elapsedSeconds: number;
  moves: number;
  hintsUsed: number;
  undosUsed: number;
  conflictsMade: number;
  moveHistory: Move[];
  redoStack: Move[];
  currentHint: HintResult | null;
  adHintsClaimed: number;
  isAdModalOpen: boolean;
  activeLevelId?: string;
  seed?: number;
  lastResult: GameResult | null;

  // Settings Slice
  settings: GameSettings;

  // Progress Slice
  profile: PlayerProfile;
  levelProgress: Record<string, { stars: number; bestScore: number; completed: boolean }>;

  // Actions - Game
  initGame: (params: {
    n: number;
    mode: GameMode;
    lockedQueens?: Position[];
    blockedCells?: Position[];
    levelId?: string;
    seed?: number;
  }) => void;
  toggleQueen: (pos: Position) => void;
  requestHint: (tier?: 1 | 2 | 3) => void;
  clearHint: () => void;
  openAdModal: () => void;
  closeAdModal: () => void;
  claimRewardedHint: () => void;
  undo: () => void;
  redo: () => void;
  resetGame: () => void;
  tickTimer: () => void;
  pauseGame: () => void;
  resumeGame: () => void;

  // Actions - Settings & Progress
  updateSettings: (newSettings: Partial<GameSettings>) => Promise<void>;
  loadPersistedData: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Defaults
  n: 8,
  mode: 'classic',
  status: 'idle',
  queens: [],
  lockedQueens: [],
  blockedCells: [],
  conflictResult: { conflicts: [], conflictingPositions: new Set(), attackedCells: new Set() },
  attackedCells: new Set(),
  elapsedSeconds: 0,
  moves: 0,
  hintsUsed: 0,
  undosUsed: 0,
  conflictsMade: 0,
  moveHistory: [],
  redoStack: [],
  currentHint: null,
  adHintsClaimed: 0,
  isAdModalOpen: false,
  activeLevelId: undefined,
  seed: undefined,
  lastResult: null,

  settings: DEFAULT_SETTINGS,
  profile: DEFAULT_PROFILE,
  levelProgress: {},

  initGame: ({ n, mode, lockedQueens = [], blockedCells = [], levelId, seed }) => {
    const initialQueens = [...lockedQueens];
    const conflicts = findConflicts(initialQueens, n);
    const attacked = getAttackedCells(initialQueens, n);

    set({
      n,
      mode,
      status: 'playing',
      queens: initialQueens,
      lockedQueens,
      blockedCells,
      conflictResult: conflicts,
      attackedCells: attacked,
      elapsedSeconds: 0,
      moves: 0,
      hintsUsed: 0,
      undosUsed: 0,
      conflictsMade: 0,
      moveHistory: [],
      redoStack: [],
      currentHint: null,
  adHintsClaimed: 0,
  isAdModalOpen: false,
      activeLevelId: levelId,
      seed,
      lastResult: null,
    });
  },

  toggleQueen: (pos: Position) => {
    const state = get();
    if (state.status !== 'playing') return;

    // Is it locked?
    const isLocked = state.lockedQueens.some((q) => q.row === pos.row && q.col === pos.col);
    if (isLocked) return;

    // Is it blocked?
    const isBlocked = state.blockedCells.some((b) => b.row === pos.row && b.col === pos.col);
    if (isBlocked) return;

    const existingIndex = state.queens.findIndex((q) => q.row === pos.row && q.col === pos.col);
    let newQueens: Position[];
    let action: Move['action'];

    if (existingIndex >= 0) {
      newQueens = state.queens.filter((_, idx) => idx !== existingIndex);
      action = 'remove';
      audioService.playRemove();
      hapticsService.tap();
    } else {
      newQueens = [...state.queens, pos];
      action = 'place';
      audioService.playPlace();
      hapticsService.tap();
    }

    const newConflicts = findConflicts(newQueens, state.n);
    const attacked = getAttackedCells(newQueens, state.n);
    const hasNewConflicts = newConflicts.conflicts.length > state.conflictResult.conflicts.length;

    if (hasNewConflicts) {
      audioService.playConflict();
      hapticsService.error();
    }

    const move: Move = { action, position: pos, timestamp: Date.now() };
    const solved = isSolved(newQueens, state.n, state.blockedCells);

    let status: GameStatus = state.status;
    let lastResult: GameResult | null = null;

    if (solved) {
      status = 'won';
      audioService.playWin();
      hapticsService.victory();

      const result = buildGameResult(
        state.n,
        state.mode,
        newQueens,
        state.elapsedSeconds * 1000,
        state.moves + 1,
        state.hintsUsed,
        state.undosUsed,
        state.conflictsMade + (hasNewConflicts ? 1 : 0),
        state.activeLevelId,
        state.seed
      );
      lastResult = result;

      // Check achievements and award profile updates
      const newlyUnlocked = checkGameAchievements(result, state.profile);
      const coinsEarned = 15 + result.stars * 10;
      const xpEarned = 50 + result.stars * 25;

      const updatedProfile: PlayerProfile = {
        ...state.profile,
        xp: state.profile.xp + xpEarned,
        level: Math.floor((state.profile.xp + xpEarned) / 200) + 1,
        coins: state.profile.coins + coinsEarned,
        totalGamesPlayed: state.profile.totalGamesPlayed + 1,
        totalGamesWon: state.profile.totalGamesWon + 1,
        currentWinStreak: state.profile.currentWinStreak + 1,
        longestWinStreak: Math.max(state.profile.longestWinStreak, state.profile.currentWinStreak + 1),
        unlockedAchievements: [
          ...state.profile.unlockedAchievements,
          ...newlyUnlocked.map((a) => a.id),
        ],
      };

      progressRepo.saveProfile(updatedProfile);

      if (state.activeLevelId) {
        progressRepo.saveLevelProgress(state.activeLevelId, {
          levelId: state.activeLevelId,
          completed: true,
          stars: result.stars,
          bestScore: result.score,
          bestTimeMs: result.timeMs,
          attempts: 1,
        });
      }

      set({ profile: updatedProfile });
    }

    set({
      queens: newQueens,
      conflictResult: newConflicts,
      attackedCells: attacked,
      moves: state.moves + 1,
      conflictsMade: state.conflictsMade + (hasNewConflicts ? 1 : 0),
      moveHistory: [...state.moveHistory, move],
      redoStack: [], // clear redo stack on new move
      currentHint: null, // clear hint once a move is made
      status,
      lastResult,
    });
  },

  requestHint: (tier = 2) => {
    const state = get();
    if (state.status !== 'playing') return;

    // Hint blocking: user must make a move first before asking for another hint!
    // Repeated clicks must not decrease hint count or show the same hint again.
    if (state.currentHint !== null) return;

    // Hints budget: 3 free hints + rewarded ad hints
    const maxFreeHints = 3;
    const totalAllowed = maxFreeHints + state.adHintsClaimed;
    if (state.hintsUsed >= totalAllowed) {
      if (state.adHintsClaimed < SHOETIC_AD_CONFIG.maxRewardedHintsPerMatch) {
        set({ isAdModalOpen: true });
      }
      return;
    }

    audioService.playHint();
    const hint = getHint(state.n, state.queens, tier, state.blockedCells);

    // If tier 3 reveal, place it automatically
    if (hint.type === 'reveal' && hint.position) {
      get().toggleQueen(hint.position);
    }

    set({
      currentHint: hint,
      hintsUsed: state.hintsUsed + 1,
    });
  },

  clearHint: () => set({ currentHint: null }),

  openAdModal: () => set({ isAdModalOpen: true }),
  closeAdModal: () => set({ isAdModalOpen: false }),

  claimRewardedHint: () => {
    const state = get();
    if (state.adHintsClaimed >= SHOETIC_AD_CONFIG.maxRewardedHintsPerMatch) return;
    set({
      adHintsClaimed: state.adHintsClaimed + 1,
      isAdModalOpen: false,
      currentHint: null,
    });
    // Now request the newly unlocked hint
    get().requestHint(2);
  },

  undo: () => {
    const state = get();
    if (state.moveHistory.length === 0 || state.status !== 'playing') return;

    const lastMove = state.moveHistory[state.moveHistory.length - 1];
    let newQueens: Position[];

    if (lastMove.action === 'place') {
      newQueens = state.queens.filter(
        (q) => !(q.row === lastMove.position.row && q.col === lastMove.position.col)
      );
    } else {
      newQueens = [...state.queens, lastMove.position];
    }

    const newConflicts = findConflicts(newQueens, state.n);
    const attacked = getAttackedCells(newQueens, state.n);

    set({
      queens: newQueens,
      conflictResult: newConflicts,
      attackedCells: attacked,
      moveHistory: state.moveHistory.slice(0, -1),
      redoStack: [...state.redoStack, lastMove],
      undosUsed: state.undosUsed + 1,
      currentHint: null,
    });
    audioService.playTap();
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0 || state.status !== 'playing') return;

    const move = state.redoStack[state.redoStack.length - 1];
    let newQueens: Position[];

    if (move.action === 'place') {
      newQueens = [...state.queens, move.position];
    } else {
      newQueens = state.queens.filter(
        (q) => !(q.row === move.position.row && q.col === move.position.col)
      );
    }

    const newConflicts = findConflicts(newQueens, state.n);
    const attacked = getAttackedCells(newQueens, state.n);

    set({
      queens: newQueens,
      conflictResult: newConflicts,
      attackedCells: attacked,
      moveHistory: [...state.moveHistory, move],
      redoStack: state.redoStack.slice(0, -1),
      currentHint: null,
    });
    audioService.playTap();
  },

  resetGame: () => {
    const state = get();
    state.initGame({
      n: state.n,
      mode: state.mode,
      lockedQueens: state.lockedQueens,
      blockedCells: state.blockedCells,
      levelId: state.activeLevelId,
      seed: state.seed,
    });
  },

  tickTimer: () => {
    const state = get();
    if (state.status !== 'playing') return;

    if (state.mode === 'time-attack') {
      // Countdown
      const remaining = state.elapsedSeconds - 1;
      if (remaining <= 0) {
        audioService.playLose();
        set({ status: 'lost', elapsedSeconds: 0 });
      } else {
        set({ elapsedSeconds: remaining });
      }
    } else {
      // Countup
      set({ elapsedSeconds: state.elapsedSeconds + 1 });
    }
  },

  pauseGame: () => {
    if (get().status === 'playing') {
      set({ status: 'paused' });
    }
  },

  resumeGame: () => {
    if (get().status === 'paused') {
      set({ status: 'playing' });
    }
  },

  updateSettings: async (newSettings) => {
    const merged = { ...get().settings, ...newSettings };
    set({ settings: merged });
    audioService.setEnabled(merged.soundEnabled);
    audioService.setVolume(merged.volume);
    hapticsService.setEnabled(merged.hapticsEnabled);
    await settingsRepo.saveSettings(merged);
  },

  loadPersistedData: async () => {
    const [settings, profile, levelProgress] = await Promise.all([
      settingsRepo.getSettings(),
      progressRepo.getProfile(),
      progressRepo.getLevelProgress(),
    ]);

    audioService.setEnabled(settings.soundEnabled);
    audioService.setVolume(settings.volume);
    hapticsService.setEnabled(settings.hapticsEnabled);

    set({ settings, profile, levelProgress });
  },
}));
