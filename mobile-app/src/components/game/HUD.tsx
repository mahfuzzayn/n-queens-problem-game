/**
 * Mobile HUD Component (Queens, Timer, Moves, Hints).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      {/* Queens Count */}
      <View style={styles.statColumn}>
        <View style={styles.headerRow}>
          <GameIcon name="crown" size={11} color="#fbbf24" />
          <Text style={styles.label}>Queens</Text>
        </View>
        <Text style={[styles.value, styles.queensValue]}>
          {queens.length}/{n}
        </Text>
      </View>

      {/* Timer */}
      <View style={styles.statColumn}>
        <View style={styles.headerRow}>
          <GameIcon name="clock" size={11} color="#67e8f9" />
          <Text style={styles.label}>Time</Text>
        </View>
        <Text style={[styles.value, styles.timeValue]}>
          {formatTime(elapsedSeconds)}
        </Text>
      </View>

      {/* Moves */}
      <View style={styles.statColumn}>
        <View style={styles.headerRow}>
          <GameIcon name="target" size={11} color="#34d399" />
          <Text style={styles.label}>Moves</Text>
        </View>
        <Text style={[styles.value, styles.movesValue]}>{moves}</Text>
      </View>

      {/* Hints */}
      <View style={styles.statColumn}>
        <View style={styles.headerRow}>
          <GameIcon name="hint" size={11} color="#fbbf24" />
          <Text style={styles.label}>Hints</Text>
        </View>
        <Text style={[styles.value, styles.hintsValue]}>
          {hintsUsed}/{totalHints}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#201140',
    borderWidth: 2,
    borderColor: '#43257a',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  statColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a78bfa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '900',
  },
  queensValue: {
    color: '#facc15',
  },
  timeValue: {
    color: '#67e8f9',
  },
  movesValue: {
    color: '#4ade80',
  },
  hintsValue: {
    color: '#fbbf24',
  },
});
