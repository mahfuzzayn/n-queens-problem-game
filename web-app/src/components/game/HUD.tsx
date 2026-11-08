import React from 'react';
import { useGameStore } from '@/store';
import { GameIcon } from '../ui/GameIcon';

export const HUD: React.FC = () => {
  const { n, queens, elapsedSeconds, moves, hintsUsed, adHintsClaimed } = useGameStore();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalHints = 3 + adHintsClaimed;

  return (
    <div className="w-full max-w-[min(90vw,540px)] mx-auto flex items-center justify-between gap-2 p-3 bg-[#24154a] border-2 border-[#452c80] rounded-2xl shadow-md text-white font-bold select-none text-xs sm:text-sm">
      {/* Queens Count */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-purple-300 uppercase text-[10px] tracking-wide">
          <GameIcon name="crown" size={12} color="#fbbf24" />
          <span>Queens</span>
        </div>
        <span className="text-yellow-400 font-extrabold text-base sm:text-lg">
          {queens.length}/{n}
        </span>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-purple-300 uppercase text-[10px] tracking-wide">
          <GameIcon name="clock" size={12} color="#67e8f9" />
          <span>Time</span>
        </div>
        <span className="text-cyan-300 font-extrabold text-base sm:text-lg">
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      {/* Moves */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-purple-300 uppercase text-[10px] tracking-wide">
          <GameIcon name="target" size={12} color="#34d399" />
          <span>Moves</span>
        </div>
        <span className="text-emerald-400 font-extrabold text-base sm:text-lg">{moves}</span>
      </div>

      {/* Hints */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-purple-300 uppercase text-[10px] tracking-wide">
          <GameIcon name="hint" size={12} color="#fbbf24" />
          <span>Hints</span>
        </div>
        <span className="text-amber-400 font-extrabold text-base sm:text-lg">
          {hintsUsed}/{totalHints}
        </span>
      </div>
    </div>
  );
};
