import React from 'react';
import { useGameStore } from '@/store';

export const HUD: React.FC = () => {
  const { n, queens, elapsedSeconds, moves, hintsUsed, mode } = useGameStore();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[min(90vw,540px)] mx-auto flex items-center justify-between gap-2 p-3 bg-[#24154a] border-2 border-[#452c80] rounded-2xl shadow-md text-white font-bold select-none text-xs sm:text-sm">
      {/* Queens Count */}
      <div className="flex flex-col items-center">
        <span className="text-purple-300 uppercase text-[10px] tracking-wide">Queens</span>
        <span className="text-yellow-400 font-extrabold text-base sm:text-lg">
          {queens.length}/{n}
        </span>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center">
        <span className="text-purple-300 uppercase text-[10px] tracking-wide">Time</span>
        <span className="text-cyan-300 font-extrabold text-base sm:text-lg">
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      {/* Moves */}
      <div className="flex flex-col items-center">
        <span className="text-purple-300 uppercase text-[10px] tracking-wide">Moves</span>
        <span className="text-emerald-400 font-extrabold text-base sm:text-lg">{moves}</span>
      </div>

      {/* Hints */}
      <div className="flex flex-col items-center">
        <span className="text-purple-300 uppercase text-[10px] tracking-wide">Hints</span>
        <span className="text-amber-400 font-extrabold text-base sm:text-lg">{hintsUsed}/3</span>
      </div>
    </div>
  );
};
