import React from 'react';
import { useGameStore } from '@/store';
import { GameButton } from '../ui/GameButton';

export const ActionBar: React.FC = () => {
  const {
    moveHistory,
    redoStack,
    hintsUsed,
    undo,
    redo,
    requestHint,
    resetGame,
    status,
  } = useGameStore();

  const isPlaying = status === 'playing';

  return (
    <div className="w-full max-w-[min(90vw,540px)] mx-auto flex items-center justify-center gap-2 sm:gap-3 p-2 select-none">
      <GameButton
        variant="secondary"
        size="sm"
        disabled={!isPlaying || moveHistory.length === 0}
        onClick={undo}
        className="flex-1"
      >
        ↩ Undo
      </GameButton>

      <GameButton
        variant="secondary"
        size="sm"
        disabled={!isPlaying || redoStack.length === 0}
        onClick={redo}
        className="flex-1"
      >
        ↪ Redo
      </GameButton>

      <GameButton
        variant="gold"
        size="sm"
        disabled={!isPlaying || hintsUsed >= 3}
        onClick={() => requestHint(2)}
        className="flex-1"
      >
        💡 Hint
      </GameButton>

      <GameButton
        variant="danger"
        size="sm"
        disabled={!isPlaying}
        onClick={resetGame}
        className="flex-1"
      >
        🔄 Reset
      </GameButton>
    </div>
  );
};
