/**
 * Memoized Board Cell Component.
 * Responsive touch target with cartoon fantasy wood/stone aesthetic.
 */

import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Queen } from './Queen';
import { GameIcon } from '../ui/GameIcon';

export interface CellProps {
  row: number;
  col: number;
  size: number;
  hasQueen: boolean;
  hasConflict: boolean;
  isAttacked: boolean;
  isLocked: boolean;
  isBlocked: boolean;
  isHintTarget: boolean;
  onPress: () => void;
  showAttackLines?: boolean;
}

export const Cell: React.FC<CellProps> = React.memo(
  ({
    row,
    col,
    size,
    hasQueen,
    hasConflict,
    isAttacked,
    isLocked,
    isBlocked,
    isHintTarget,
    onPress,
    showAttackLines = false,
  }) => {
    const isDark = (row + col) % 2 === 1;

    let bgColor = isDark ? '#7a522e' : '#d8bf9a';

    if (isBlocked) {
      bgColor = '#262626';
    } else if (hasConflict) {
      bgColor = '#7f1d1d';
    } else if (isHintTarget) {
      bgColor = '#f59e0b';
    } else if (isAttacked && showAttackLines && !hasQueen) {
      bgColor = isDark ? '#664323' : '#c4aa85';
    }

    const queenSize = Math.max(16, size * 0.76);

    return (
      <Pressable
        onPress={isLocked || isBlocked ? undefined : onPress}
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            backgroundColor: bgColor,
            borderColor: hasConflict
              ? '#ef4444'
              : isHintTarget
              ? '#fde047'
              : 'rgba(0,0,0,0.06)',
            borderWidth: hasConflict || isHintTarget ? 2 : 0.5,
          },
        ]}
      >
        {/* Attacked Dot Indicator */}
        {isAttacked && showAttackLines && !hasQueen && !isBlocked && (
          <View style={[styles.attackDot, { width: Math.max(4, size * 0.15), height: Math.max(4, size * 0.15) }]} />
        )}

        {/* Blocked Obstacle */}
        {isBlocked && (
          <GameIcon name="rock" size={Math.max(16, size * 0.55)} color="#a8a29e" />
        )}

        {/* Queen Graphic */}
        {hasQueen && (
          <Queen hasConflict={hasConflict} size={queenSize} />
        )}

        {/* Locked Queen Indicator */}
        {isLocked && hasQueen && (
          <View style={styles.lockedBadge}>
            <GameIcon name="lock" size={Math.max(10, size * 0.28)} color="#facc15" />
          </View>
        )}
      </Pressable>
    );
  }
);

Cell.displayName = 'Cell';

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  attackDot: {
    borderRadius: 999,
    backgroundColor: 'rgba(239, 68, 68, 0.55)',
  },
  lockedBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
});
