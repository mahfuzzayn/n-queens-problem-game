/**
 * Victory & Defeat Result Modal with Star Ratings and Score Breakdown.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <View style={styles.content}>
        {isWon && lastResult && (
          <>
            <View style={styles.starRow}>
              <StarRating stars={lastResult.stars} size="lg" />
            </View>

            <View style={styles.scoreCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricLabelGroup}>
                  <GameIcon name="trophy" size={14} color="#facc15" />
                  <Text style={styles.metricLabel}>Final Score:</Text>
                </View>
                <Text style={styles.scoreValue}>{lastResult.score} pts</Text>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metricLabelGroup}>
                  <GameIcon name="clock" size={14} color="#67e8f9" />
                  <Text style={styles.metricLabel}>Time Taken:</Text>
                </View>
                <Text style={styles.metricValue}>
                  {Math.floor(lastResult.timeMs / 1000)}s
                </Text>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metricLabelGroup}>
                  <GameIcon name="target" size={14} color="#4ade80" />
                  <Text style={styles.metricLabel}>Total Moves:</Text>
                </View>
                <Text style={styles.movesValue}>{lastResult.moves}</Text>
              </View>

              {lastResult.isPerfect && (
                <View style={styles.perfectBanner}>
                  <GameIcon name="sparkles" size={14} color="#fcd34d" />
                  <Text style={styles.perfectText}>
                    Perfect Run: No Hints & No Conflicts!
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {isLost && (
          <View style={styles.lostContainer}>
            <GameIcon name="skull" size={32} color="#f43f5e" />
            <Text style={styles.lostText}>
              You ran out of time! Don't give up, try again to beat the clock!
            </Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <View style={styles.btnWrapper}>
            <GameButton variant="primary" size="md" onPress={resetGame}>
              Play Again
            </GameButton>
          </View>

          {isWon && (
            <View style={styles.btnWrapper}>
              <GameButton
                variant="gold"
                size="md"
                onPress={() => {
                  initGame({ n: Math.min(16, n + 1), mode });
                }}
              >
                Next (N={Math.min(16, n + 1)})
              </GameButton>
            </View>
          )}
        </View>
      </View>
    </GameModal>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 12,
  },
  starRow: {
    marginVertical: 4,
  },
  scoreCard: {
    backgroundColor: '#190d33',
    borderWidth: 1.5,
    borderColor: '#3c1d73',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    color: '#c4b5fd',
    fontSize: 13,
    fontWeight: '700',
  },
  scoreValue: {
    color: '#facc15',
    fontSize: 16,
    fontWeight: '900',
  },
  metricValue: {
    color: '#67e8f9',
    fontSize: 14,
    fontWeight: '800',
  },
  movesValue: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '800',
  },
  perfectBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.4)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  perfectText: {
    color: '#fde047',
    fontSize: 11,
    fontWeight: '800',
  },
  lostContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  lostText: {
    color: '#e9d5ff',
    fontSize: 13,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  btnWrapper: {
    flex: 1,
  },
});
