/**
 * Bottom Action Bar (Undo, Redo, Hint, Reset).
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <GameButton
          variant="secondary"
          size="sm"
          disabled={!isPlaying || moveHistory.length === 0}
          onPress={undo}
        >
          <View style={styles.btnContent}>
            <GameIcon name="undo" size={14} color="#f8fafc" />
            <Text style={styles.btnText}>Undo</Text>
          </View>
        </GameButton>
      </View>

      <View style={styles.buttonWrapper}>
        <GameButton
          variant="secondary"
          size="sm"
          disabled={!isPlaying || redoStack.length === 0}
          onPress={redo}
        >
          <View style={styles.btnContent}>
            <GameIcon name="redo" size={14} color="#f8fafc" />
            <Text style={styles.btnText}>Redo</Text>
          </View>
        </GameButton>
      </View>

      <View style={styles.buttonWrapper}>
        {canWatchAd ? (
          <GameButton
            variant="gold"
            size="sm"
            disabled={!isPlaying}
            onPress={openAdModal}
          >
            <View style={styles.btnContent}>
              <GameIcon name="adGift" size={14} color="#78350f" />
              <Text style={[styles.btnText, styles.goldText]}>+1 Hint</Text>
            </View>
          </GameButton>
        ) : (
          <GameButton
            variant="gold"
            size="sm"
            disabled={!isPlaying || freeHintsRemaining === 0 || isHintActive}
            onPress={() => requestHint(2)}
          >
            <View style={styles.btnContent}>
              <GameIcon name="hint" size={14} color="#78350f" />
              <Text style={[styles.btnText, styles.goldText]}>
                {isHintActive ? 'Active' : `Hint (${freeHintsRemaining})`}
              </Text>
            </View>
          </GameButton>
        )}
      </View>

      <View style={styles.buttonWrapper}>
        <GameButton
          variant="danger"
          size="sm"
          disabled={!isPlaying}
          onPress={resetGame}
        >
          <View style={styles.btnContent}>
            <GameIcon name="reset" size={14} color="#ffffff" />
            <Text style={styles.btnText}>Reset</Text>
          </View>
        </GameButton>
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
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  buttonWrapper: {
    flex: 1,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  goldText: {
    color: '#78350f',
  },
});
