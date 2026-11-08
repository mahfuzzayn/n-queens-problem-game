import React from 'react';
import { useGameStore } from '@/store';
import { GameButton } from '../ui/GameButton';
import { GameIcon } from '../ui/GameIcon';
import { SHOETIC_AD_CONFIG } from '@/config/ads.config';

export const ActionBar: React.FC = () => {
  const {
    moveHistory,
    redoStack,
    hintsUsed,
    adHintsClaimed,
    currentHint,
    undo,
    redo,
    requestHint,
    openAdModal,
    resetGame,
    status,
  } = useGameStore();

  const isPlaying = status === 'playing';
  const totalAllowed = 3 + adHintsClaimed;
  const freeHintsRemaining = Math.max(0, totalAllowed - hintsUsed);
  const canWatchAd = freeHintsRemaining === 0 && adHintsClaimed < SHOETIC_AD_CONFIG.maxRewardedHintsPerMatch;
  const isHintActive = currentHint !== null;

  return (
    <div className="w-full max-w-[min(90vw,540px)] mx-auto flex items-center justify-center gap-2 sm:gap-3 p-2 select-none">
      <GameButton
        variant="secondary"
        size="sm"
        disabled={!isPlaying || moveHistory.length === 0}
        onClick={undo}
        className="flex-1 flex items-center justify-center gap-1.5"
      >
        <GameIcon name="undo" size={16} color="currentColor" />
        <span>Undo</span>
      </GameButton>

      <GameButton
        variant="secondary"
        size="sm"
        disabled={!isPlaying || redoStack.length === 0}
        onClick={redo}
        className="flex-1 flex items-center justify-center gap-1.5"
      >
        <GameIcon name="redo" size={16} color="currentColor" />
        <span>Redo</span>
      </GameButton>

      {canWatchAd ? (
        <GameButton
          variant="gold"
          size="sm"
          disabled={!isPlaying}
          onClick={openAdModal}
          className="flex-1 flex items-center justify-center gap-1.5 animate-pulse"
        >
          <GameIcon name="adGift" size={16} color="#78350f" />
          <span>+1 Hint</span>
        </GameButton>
      ) : (
        <GameButton
          variant="gold"
          size="sm"
          disabled={!isPlaying || (freeHintsRemaining === 0) || isHintActive}
          onClick={() => requestHint(2)}
          className="flex-1 flex items-center justify-center gap-1.5"
        >
          <GameIcon name="hint" size={16} color="#78350f" />
          <span>{isHintActive ? 'Active' : `Hint (${freeHintsRemaining})`}</span>
        </GameButton>
      )}

      <GameButton
        variant="danger"
        size="sm"
        disabled={!isPlaying}
        onClick={resetGame}
        className="flex-1 flex items-center justify-center gap-1.5"
      >
        <GameIcon name="reset" size={16} color="currentColor" />
        <span>Reset</span>
      </GameButton>
    </div>
  );
};
