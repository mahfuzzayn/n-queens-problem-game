/**
 * Responsive Chessboard Component with Ornate Wooden Frame.
 * Dynamically computes cell dimensions using useWindowDimensions.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Cell } from './Cell';
import { useGameStore } from '@/store';
import type { Position } from '@/types';

export const Board: React.FC = () => {
  const { width } = useWindowDimensions();
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

  const queenMap = useMemo(() => {
    const map = new Map<string, boolean>();
    queens.forEach((q) => map.set(`${q.row},${q.col}`, true));
    return map;
  }, [queens]);

  const lockedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    lockedQueens.forEach((q) => map.set(`${q.row},${q.col}`, true));
    return map;
  }, [lockedQueens]);

  const blockedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    blockedCells.forEach((b) => map.set(`${b.row},${b.col}`, true));
    return map;
  }, [blockedCells]);

  // Calculate responsive cell size
  const maxBoardWidth = Math.min(width - 24, 460);
  const framePadding = 12; // 6px padding on each side
  const availableGridWidth = maxBoardWidth - framePadding;

  // Enforce comfortable tap target (min 28dp), allowing horizontal scroll if board is large (N > 8)
  const idealCellSize = Math.floor(availableGridWidth / n);
  const cellSize = Math.max(28, idealCellSize);
  const totalGridWidth = cellSize * n;
  const needsHorizontalScroll = totalGridWidth > availableGridWidth;

  const boardContent = (
    <View
      style={[
        styles.woodenFrame,
        {
          width: totalGridWidth + framePadding,
        },
      ]}
    >
      <View
        style={[
          styles.gridContainer,
          {
            width: totalGridWidth,
            height: totalGridWidth,
          },
        ]}
      >
        {Array.from({ length: n }).map((_, r) => (
          <View key={`row_${r}`} style={styles.row}>
            {Array.from({ length: n }).map((_, c) => {
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
                  size={cellSize}
                  hasQueen={hasQueen}
                  hasConflict={hasConflict}
                  isAttacked={isAttacked}
                  isLocked={isLocked}
                  isBlocked={isBlocked}
                  isHintTarget={isHintTarget}
                  showAttackLines={settings.showAttackLines}
                  onPress={() => toggleQueen({ row: r, col: c })}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );

  if (needsHorizontalScroll) {
    return (
      <View style={styles.scrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {boardContent}
        </ScrollView>
      </View>
    );
  }

  return <View style={styles.boardWrapper}>{boardContent}</View>;
};

const styles = StyleSheet.create({
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  scrollWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  woodenFrame: {
    backgroundColor: '#4a2c16',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#7a4a23',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    backgroundColor: '#231206',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#231206',
  },
  row: {
    flexDirection: 'row',
  },
});
