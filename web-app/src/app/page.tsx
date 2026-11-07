'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store';
import { Board } from '@/components/game/Board';
import { HUD } from '@/components/game/HUD';
import { ActionBar } from '@/components/game/ActionBar';
import { ResultModal } from '@/components/game/ResultModal';
import { GameButton } from '@/components/ui/GameButton';
import { GamePanel } from '@/components/ui/GamePanel';
import { GAME_CONFIG } from '@/config/game.config';

export default function Home() {
  const {
    n,
    mode,
    status,
    currentHint,
    initGame,
    tickTimer,
    loadPersistedData,
  } = useGameStore();

  const [selectedN, setSelectedN] = useState<number>(8);
  const [selectedMode, setSelectedMode] = useState<'classic' | 'time-attack' | 'practice'>('classic');

  // Load storage once
  useEffect(() => {
    loadPersistedData();
    initGame({ n: 8, mode: 'classic' });
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
    setSelectedN(boardSize);
    initGame({ n: boardSize, mode: selectedMode });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#160c2b] text-white select-none">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-[#301c5c] bg-[#1d1038]">
        <div className="flex items-center gap-2">
          <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(255,215,0,0.4)]">👑</span>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 tracking-wider">
            N-QUEENS
          </h1>
        </div>

        {/* Board Presets Quick Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {GAME_CONFIG.presetSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleStartGame(size)}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition-all ${
                n === size
                  ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_2px_0_0_#926405]'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 gap-4">
        {/* HUD */}
        <HUD />

        {/* Hint banner if active */}
        {currentHint && (
          <div className="w-full max-w-[min(90vw,540px)] p-2.5 bg-amber-500/20 border-2 border-amber-400/50 rounded-xl text-center text-amber-200 text-xs sm:text-sm font-semibold animate-pulse">
            💡 {currentHint.message}
          </div>
        )}

        {/* Chessboard */}
        <Board />

        {/* Controls */}
        <ActionBar />
      </main>

      {/* Victory / Defeat Modal */}
      <ResultModal />
    </div>
  );
}
