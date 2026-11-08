'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store';
import { Board } from '@/components/game/Board';
import { HUD } from '@/components/game/HUD';
import { ActionBar } from '@/components/game/ActionBar';
import { ResultModal } from '@/components/game/ResultModal';
import { SettingsModal } from '@/components/game/SettingsModal';
import { ImpossibleModal } from '@/components/game/ImpossibleModal';
import { RewardedAdModal } from '@/components/game/RewardedAdModal';
import { SplashScreen } from '@/components/game/SplashScreen';
import { GameButton } from '@/components/ui/GameButton';
import { GameBadge } from '@/components/ui/GameBadge';
import { GameLogo } from '@/components/ui/GameLogo';
import { GameIcon } from '@/components/ui/GameIcon';
import { GAME_CONFIG } from '@/config/game.config';
import { generateDailyPuzzle } from '@/core';

export default function Home() {
  const {
    n,
    mode,
    status,
    currentHint,
    profile,
    initGame,
    tickTimer,
    loadPersistedData,
  } = useGameStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [impossibleN, setImpossibleN] = useState<2 | 3 | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Initialize once
  useEffect(() => {
    loadPersistedData();
    initGame({ n: 8, mode: 'classic' });
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, [initGame, loadPersistedData]);

  // Game clock interval
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  const handleStartGame = (boardSize: number) => {
    if (boardSize === 2 || boardSize === 3) {
      setImpossibleN(boardSize as 2 | 3);
      return;
    }
    initGame({ n: boardSize, mode: 'classic' });
  };

  const handleStartDaily = () => {
    const today = new Date().toISOString().split('T')[0];
    const daily = generateDailyPuzzle(today);
    initGame({
      n: daily.n,
      mode: 'daily',
      lockedQueens: daily.lockedQueens,
      seed: daily.seed,
    });
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="min-h-screen flex flex-col bg-[#160c2b] text-white select-none">
      {/* Top Header */}
      <header className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#301c5c] bg-[#1d1038]">
        <div className="flex items-center gap-3">
          <GameLogo size={42} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 tracking-wider">
              N-QUEENS
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <GameBadge variant="gold" size="sm" className="flex items-center gap-1">
                <GameIcon name="coin" size={13} color="#f59e0b" />
                <span>{profile.coins}</span>
              </GameBadge>
              <GameBadge variant="purple" size="sm" className="flex items-center gap-1">
                <GameIcon name="shield" size={13} color="#c084fc" />
                <span>LVL {profile.level}</span>
              </GameBadge>
            </div>
          </div>
        </div>

        {/* Quick Mode & Settings Controls */}
        <div className="flex items-center gap-2">
          <GameButton
            variant="gold"
            size="sm"
            onClick={handleStartDaily}
            className="flex items-center gap-1.5"
          >
            <GameIcon name="calendar" size={14} color="#78350f" />
            <span>Daily</span>
          </GameButton>

          <GameButton
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
            className="p-2"
          >
            <GameIcon name="settings" size={18} color="#e2e8f0" />
          </GameButton>
        </div>
      </header>

      {/* Preset Board Sizes Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 bg-[#140a26] border-b border-[#281547] justify-start sm:justify-center">
        {/* Impossible edge-case buttons */}
        <button
          onClick={() => handleStartGame(2)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition-colors"
        >
          <span>2×2</span>
          <GameIcon name="skull" size={11} color="#f43f5e" />
        </button>
        <button
          onClick={() => handleStartGame(3)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition-colors"
        >
          <span>3×3</span>
          <GameIcon name="skull" size={11} color="#f43f5e" />
        </button>

        {GAME_CONFIG.presetSizes.map((size) => (
          <button
            key={size}
            onClick={() => handleStartGame(size)}
            className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all ${
              n === size
                ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_2px_0_0_#926405]'
                : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
            }`}
          >
            {size}×{size}
          </button>
        ))}
      </div>

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 gap-4">
        {/* HUD */}
        <HUD />

        {/* Hint banner if active */}
        {currentHint && (
          <div className="flex items-center justify-center gap-2 w-full max-w-[min(90vw,540px)] p-2.5 bg-amber-500/20 border-2 border-amber-400/50 rounded-xl text-center text-amber-200 text-xs sm:text-sm font-semibold animate-pulse">
            <GameIcon name="hint" size={16} color="#fbbf24" />
            <span>{currentHint.message}</span>
          </div>
        )}

        {/* Chessboard */}
        <Board />

        {/* Action Controls */}
        <ActionBar />
      </main>

      {/* Modals */}
      <ResultModal />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      {impossibleN && (
        <ImpossibleModal
          n={impossibleN}
          isOpen={true}
          onClose={() => setImpossibleN(null)}
        />
      )}
      <RewardedAdModal />
    </div>
    </>
  );
}
