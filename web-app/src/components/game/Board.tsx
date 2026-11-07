import React from 'react';
import { Cell } from './Cell';
import { useGameStore } from '@/store';
import type { Position } from '@/types';

export const Board: React.FC = () => {
  const {
    n,
    queens,
    lockedQueens,
    blockedCells,
    conflictResult,
    attackedCells,
    currentHint,
    settings,
    toggleQueen,
  } = useGameStore();

  const queenMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    queens.forEach((q) => map.set(`${q.row},${q.col}`, true));
    return map;
  }, [queens]);

  const lockedMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    lockedQueens.forEach((q) => map.set(`${q.row},${q.col}`, true));
    return map;
  }, [lockedQueens]);

  const blockedMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    blockedCells.forEach((b) => map.set(`${b.row},${b.col}`, true));
    return map;
  }, [blockedCells]);

  // For large boards (N > 10) on small mobile screens, ensure horizontal scrollability
  return (
    <div className="w-full flex justify-center items-center overflow-x-auto py-2 px-1">
      <div
        className="w-full max-w-[min(94vw,540px)] min-w-[280px] p-2 sm:p-4 bg-gradient-to-b from-[#5c3a1e] to-[#3a220e] rounded-3xl border-4 border-[#8c5a30] shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        style={{
          minWidth: n > 10 ? `${n * 32}px` : undefined,
        }}
      >
        <div
          className="grid gap-[1px] bg-[#2a1708] p-1 sm:p-1.5 rounded-2xl overflow-hidden border-2 border-[#2a1708]"
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: n }).map((_, r) =>
            Array.from({ length: n }).map((_, c) => {
              const key = `${r},${c}`;
              const hasQueen = queenMap.has(key);
              const hasConflict = conflictResult.conflictingPositions.has(key);
              const isAttacked = attackedCells.has(key);
              const isLocked = lockedMap.has(key);
              const isBlocked = blockedMap.has(key);
              const isHintTarget =
                currentHint?.position?.row === r && currentHint?.position?.col === c;

              return (
                <Cell
                  key={key}
                  row={r}
                  col={c}
                  hasQueen={hasQueen}
                  hasConflict={hasConflict}
                  isAttacked={isAttacked}
                  isLocked={isLocked}
                  isBlocked={isBlocked}
                  isHintTarget={isHintTarget}
                  showAttackLines={settings.showAttackLines}
                  onClick={() => toggleQueen({ row: r, col: c })}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
