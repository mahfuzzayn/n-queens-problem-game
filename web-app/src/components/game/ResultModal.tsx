import React from 'react';
import { useGameStore } from '@/store';
import { GameModal } from '../ui/GameModal';
import { GameButton } from '../ui/GameButton';
import { StarRating } from '../ui/StarRating';
import { GameIcon } from '../ui/GameIcon';

export const ResultModal: React.FC = () => {
  const { status, lastResult, resetGame, initGame, n, mode } = useGameStore();

  const isWon = status === 'won';
  const isLost = status === 'lost';
  const isOpen = isWon || isLost;

  if (!isOpen) return null;

  return (
    <GameModal
      isOpen={isOpen}
      title={isWon ? 'VICTORY!' : 'TIME OVER!'}
    >
      <div className="flex flex-col items-center gap-4 text-center mt-2">
        {isWon && lastResult && (
          <>
            <StarRating stars={lastResult.stars} size="lg" />

            <div className="bg-[#180e33] p-4 rounded-2xl w-full flex flex-col gap-2 border border-[#3b2278]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-300">Final Score:</span>
                <span className="text-yellow-400 font-extrabold text-lg">
                  {lastResult.score} pts
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-300">Time Taken:</span>
                <span className="text-cyan-300 font-bold">
                  {Math.floor(lastResult.timeMs / 1000)}s
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-300">Total Moves:</span>
                <span className="text-emerald-400 font-bold">{lastResult.moves}</span>
              </div>
              {lastResult.isPerfect && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-900/40 py-1.5 rounded-lg border border-amber-500/30">
                  <GameIcon name="sparkles" size={14} color="#fcd34d" />
                  <span>Perfect Run: No Hints & No Conflicts!</span>
                </div>
              )}
            </div>
          </>
        )}

        {isLost && (
          <p className="text-purple-200 text-sm">
            You ran out of time! Don&apos;t give up, try again to beat the clock!
          </p>
        )}

        <div className="flex items-center gap-3 w-full mt-2">
          <GameButton
            variant="primary"
            size="md"
            onClick={resetGame}
            className="flex-1"
          >
            Play Again
          </GameButton>

          {isWon && (
            <GameButton
              variant="gold"
              size="md"
              onClick={() => {
                initGame({ n: Math.min(16, n + 1), mode });
              }}
              className="flex-1"
            >
              Next (N={Math.min(16, n + 1)})
            </GameButton>
          )}
        </div>
      </div>
    </GameModal>
  );
};
