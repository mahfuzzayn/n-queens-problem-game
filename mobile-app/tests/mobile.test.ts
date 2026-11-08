import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock native expo modules and async-storage
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: 0, Medium: 1, Heavy: 2 },
  NotificationFeedbackType: { Success: 0, Warning: 1, Error: 2 },
}));

vi.mock('expo-audio', () => ({
  setAudioModeAsync: vi.fn().mockResolvedValue(undefined),
  createAudioPlayer: vi.fn().mockReturnValue({
    volume: 1,
    seekTo: vi.fn().mockResolvedValue(undefined),
    play: vi.fn(),
  }),
}));

const mockStorage = new Map<string, string>();
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async (key: string) => mockStorage.get(key) ?? null),
    setItem: vi.fn(async (key: string, val: string) => {
      mockStorage.set(key, val);
    }),
    removeItem: vi.fn(async (key: string) => {
      mockStorage.delete(key);
    }),
    clear: vi.fn(async () => {
      mockStorage.clear();
    }),
  },
}));

import { useGameStore } from '@/store';
import { generateDailyPuzzle, solve } from '@/core';

describe('Mobile App Zustand Store & Shared Core Integration', () => {
  beforeEach(() => {
    mockStorage.clear();
    useGameStore.getState().initGame({ n: 4, mode: 'classic' });
  });

  it('initializes game state correctly for N=4', () => {
    const state = useGameStore.getState();
    expect(state.n).toBe(4);
    expect(state.mode).toBe('classic');
    expect(state.status).toBe('playing');
    expect(state.queens.length).toBe(0);
    expect(state.moves).toBe(0);
    expect(state.conflictResult.conflicts.length).toBe(0);
  });

  it('places and removes queens with conflict tracking and move count', () => {
    const { toggleQueen } = useGameStore.getState();

    // Place first queen at (0, 0)
    toggleQueen({ row: 0, col: 0 });
    let state = useGameStore.getState();
    expect(state.queens.length).toBe(1);
    expect(state.moves).toBe(1);
    expect(state.conflictResult.conflicts.length).toBe(0);

    // Place second queen at (0, 1) -> row conflict
    toggleQueen({ row: 0, col: 1 });
    state = useGameStore.getState();
    expect(state.queens.length).toBe(2);
    expect(state.moves).toBe(2);
    expect(state.conflictResult.conflicts.length).toBeGreaterThan(0);
    expect(state.conflictsMade).toBeGreaterThanOrEqual(1);

    // Remove queen at (0, 1) by tapping it again
    toggleQueen({ row: 0, col: 1 });
    state = useGameStore.getState();
    expect(state.queens.length).toBe(1);
    expect(state.moves).toBe(3);
    expect(state.conflictResult.conflicts.length).toBe(0);
  });

  it('supports undo and redo cleanly', () => {
    const { toggleQueen, undo, redo } = useGameStore.getState();

    toggleQueen({ row: 1, col: 2 });
    expect(useGameStore.getState().queens.length).toBe(1);

    undo();
    expect(useGameStore.getState().queens.length).toBe(0);
    expect(useGameStore.getState().undosUsed).toBe(1);

    redo();
    expect(useGameStore.getState().queens.length).toBe(1);
    expect(useGameStore.getState().queens[0]).toEqual({ row: 1, col: 2 });
  });

  it('triggers victory and awards stars on complete valid solution', () => {
    const { toggleQueen } = useGameStore.getState();

    // Valid 4-Queens solution: (0, 1), (1, 3), (2, 0), (3, 2)
    toggleQueen({ row: 0, col: 1 });
    toggleQueen({ row: 1, col: 3 });
    toggleQueen({ row: 2, col: 0 });
    toggleQueen({ row: 3, col: 2 });

    const state = useGameStore.getState();
    expect(state.status).toBe('won');
    expect(state.lastResult).not.toBeNull();
    expect(state.lastResult?.stars).toBeGreaterThanOrEqual(1);
    expect(state.lastResult?.isPerfect).toBe(true);
    expect(state.profile.totalGamesWon).toBeGreaterThanOrEqual(1);
  });

  it('requests hints using core backtracking hint engine', () => {
    const { toggleQueen, requestHint } = useGameStore.getState();

    toggleQueen({ row: 0, col: 1 });
    requestHint(2);

    let state = useGameStore.getState();
    expect(state.hintsUsed).toBe(1);
    expect(state.currentHint).not.toBeNull();
    expect(state.currentHint?.type).toBe('safe-cell');
    expect(state.currentHint?.position).toBeDefined();

    // Repeated hint request before making a move MUST be blocked
    requestHint(2);
    state = useGameStore.getState();
    expect(state.hintsUsed).toBe(1); // Still 1!

    // Making a move clears hint and allows next hint request
    toggleQueen({ row: 1, col: 3 });
    state = useGameStore.getState();
    expect(state.currentHint).toBeNull();
  });

  it('handles rewarded ad hints properly when free hints run out', () => {
    const { requestHint, toggleQueen, claimRewardedHint } = useGameStore.getState();

    // Use 3 free hints with a move between each
    requestHint(2);
    toggleQueen({ row: 0, col: 1 });
    requestHint(2);
    toggleQueen({ row: 1, col: 3 });
    requestHint(2);
    toggleQueen({ row: 2, col: 0 });

    let state = useGameStore.getState();
    expect(state.hintsUsed).toBe(3);
    expect(state.isAdModalOpen).toBe(false);

    // 4th hint request triggers rewarded ad modal
    requestHint(2);
    state = useGameStore.getState();
    expect(state.hintsUsed).toBe(3);
    expect(state.isAdModalOpen).toBe(true);

    // Claim rewarded hint
    claimRewardedHint();
    state = useGameStore.getState();
    expect(state.adHintsClaimed).toBe(1);
    expect(state.isAdModalOpen).toBe(false);
    expect(state.hintsUsed).toBe(4);
    expect(state.currentHint).not.toBeNull();
  });

  it('has showAttackLines disabled by default', () => {
    const state = useGameStore.getState();
    expect(state.settings.showAttackLines).toBe(false);
  });

  it('generates and launches daily puzzle with locked queens', () => {
    const daily = generateDailyPuzzle('2026-11-08');
    expect(daily.n).toBeGreaterThanOrEqual(4);
    expect(daily.lockedQueens.length).toBeGreaterThan(0);

    useGameStore.getState().initGame({
      n: daily.n,
      mode: 'daily',
      lockedQueens: daily.lockedQueens,
      seed: daily.seed,
    });

    const state = useGameStore.getState();
    expect(state.mode).toBe('daily');
    expect(state.lockedQueens.length).toBe(daily.lockedQueens.length);
    expect(state.queens.length).toBe(daily.lockedQueens.length);

    // Tapping a locked queen should NOT remove it
    const lockedPos = daily.lockedQueens[0];
    state.toggleQueen(lockedPos);
    expect(useGameStore.getState().queens.length).toBe(daily.lockedQueens.length);
  });

  it('updates, persists, and reloads settings changes across app sessions', async () => {
    const { updateSettings, loadPersistedData } = useGameStore.getState();

    // Toggle attack lines ON and verify persistence across reload
    await updateSettings({ showAttackLines: true, soundEnabled: false });
    expect(useGameStore.getState().settings.showAttackLines).toBe(true);

    // Simulate app reload
    await loadPersistedData();
    expect(useGameStore.getState().settings.showAttackLines).toBe(true);
    expect(useGameStore.getState().settings.soundEnabled).toBe(false);

    // Toggle attack lines OFF and verify persistence across reload
    await updateSettings({ showAttackLines: false });
    expect(useGameStore.getState().settings.showAttackLines).toBe(false);

    await loadPersistedData();
    expect(useGameStore.getState().settings.showAttackLines).toBe(false);
  });
});
