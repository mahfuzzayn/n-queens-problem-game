import React from 'react';
import { Queen } from './Queen';
import { GameIcon } from '../ui/GameIcon';

export interface CellProps {
  row: number;
  col: number;
  hasQueen: boolean;
  hasConflict: boolean;
  isAttacked: boolean;
  isLocked: boolean;
  isBlocked: boolean;
  isHintTarget: boolean;
  onClick: () => void;
  showAttackLines?: boolean;
}

export const Cell: React.FC<CellProps> = React.memo(
  ({
    row,
    col,
    hasQueen,
    hasConflict,
    isAttacked,
    isLocked,
    isBlocked,
    isHintTarget,
    onClick,
    showAttackLines = false,
  }) => {
    const isDark = (row + col) % 2 === 1;

    // Base background for checkerboard
    let bgClasses = isDark
      ? 'bg-[#825b38] hover:bg-[#966b44]'
      : 'bg-[#ddc5a2] hover:bg-[#ebd5b5]';

    if (isBlocked) {
      bgClasses = 'bg-[#2b2b2b] opacity-80 cursor-not-allowed';
    } else if (hasConflict) {
      bgClasses = 'bg-red-900/80 hover:bg-red-800/80 ring-2 ring-red-500';
    } else if (isHintTarget) {
      bgClasses = 'bg-amber-400/80 animate-pulse ring-4 ring-yellow-300';
    } else if (isAttacked && showAttackLines && !hasQueen) {
      bgClasses = isDark ? 'bg-[#704d30]/75' : 'bg-[#c9b18f]/75';
    }

    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Row ${row + 1}, Column ${col + 1}${
          hasQueen ? ', queen placed' : isAttacked ? ', attacked' : ', empty'
        }`}
        className={`relative flex items-center justify-center aspect-square select-none transition-colors duration-100 p-1 sm:p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 ${bgClasses}`}
      >
        {/* Attacked Dot Indicator (accessible & subtle) */}
        {isAttacked && showAttackLines && !hasQueen && !isBlocked && (
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500/40" />
        )}

        {/* Blocked Icon */}
        {isBlocked && (
          <GameIcon name="rock" size={20} color="#a8a29e" />
        )}

        {/* Queen Graphic */}
        {hasQueen && (
          <div className="w-full h-full p-0.5">
            <Queen hasConflict={hasConflict} />
          </div>
        )}

        {/* Locked Badge */}
        {isLocked && hasQueen && (
          <div className="absolute top-1 right-1 drop-shadow">
            <GameIcon name="lock" size={13} color="#facc15" />
          </div>
        )}
      </button>
    );
  }
);

Cell.displayName = 'Cell';
