/**
 * N-Queens Mobile Application (Expo / React Native)
 * 
 * Deep royal purple theme (#160c2b, #1d1038) with cartoon fantasy strategy aesthetic.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store';
import {
  Board,
  HUD,
  ActionBar,
  ResultModal,
  SettingsModal,
  ImpossibleModal,
  RewardedAdModal,
  SplashScreen,
} from '@/components/game';
import { GameButton, GameBadge, GameLogo, GameIcon } from '@/components/ui';
import { GAME_CONFIG } from '@/config/game.config';
import { generateDailyPuzzle } from '@/core';

function GameScreen() {
  const {
    n,
    mode,
    status,
    currentHint,
    profile,
    initGame,
    tickTimer,
    loadPersistedData,
  } = useGameStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [impossibleN, setImpossibleN] = useState<2 | 3 | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Initialize on mount
  useEffect(() => {
    loadPersistedData();
    initGame({ n: 8, mode: 'classic' });
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, [initGame, loadPersistedData]);

  // Live timer interval
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  const handleStartGame = (boardSize: number) => {
    if (boardSize === 2 || boardSize === 3) {
      setImpossibleN(boardSize as 2 | 3);
      return;
    }
    initGame({ n: boardSize, mode: 'classic' });
  };

  const handleStartDaily = () => {
    const today = new Date().toISOString().split('T')[0];
    const daily = generateDailyPuzzle(today);
    initGame({
      n: daily.n,
      mode: 'daily',
      lockedQueens: daily.lockedQueens,
      seed: daily.seed,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="light" />

      {/* Animated Load Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <GameLogo size={38} />
          <View>
            <Text style={styles.gameTitle}>N-QUEENS</Text>
            <View style={styles.badgesRow}>
              <GameBadge variant="gold" size="sm">
                <View style={styles.badgeContent}>
                  <GameIcon name="coin" size={13} color="#facc15" />
                  <Text style={[styles.badgeText, styles.goldBadgeText]}>{profile.coins}</Text>
                </View>
              </GameBadge>
              <GameBadge variant="purple" size="sm">
                <View style={styles.badgeContent}>
                  <GameIcon name="shield" size={11} color="#c084fc" />
                  <Text style={[styles.badgeText, styles.purpleBadgeText]}>LVL {profile.level}</Text>
                </View>
              </GameBadge>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.headerActions}>
          <GameButton
            variant="gold"
            size="sm"
            onPress={handleStartDaily}
          >
            <View style={styles.btnRow}>
              <GameIcon name="calendar" size={13} color="#78350f" />
              <Text style={styles.dailyBtnText}>Daily</Text>
            </View>
          </GameButton>

          <GameButton
            variant="ghost"
            size="sm"
            onPress={() => setIsSettingsOpen(true)}
          >
            <GameIcon name="settings" size={18} color="#e2e8f0" />
          </GameButton>
        </View>
      </View>

      {/* Preset Board Sizes Navigation */}
      <View style={styles.sizeSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sizeSelectorContent}
        >
          {/* Impossible challenge buttons */}
          <Pressable
            onPress={() => handleStartGame(2)}
            style={[styles.sizeChip, styles.impossibleChip]}
          >
            <Text style={styles.impossibleChipText}>2×2</Text>
            <GameIcon name="skull" size={10} color="#f43f5e" />
          </Pressable>

          <Pressable
            onPress={() => handleStartGame(3)}
            style={[styles.sizeChip, styles.impossibleChip]}
          >
            <Text style={styles.impossibleChipText}>3×3</Text>
            <GameIcon name="skull" size={10} color="#f43f5e" />
          </Pressable>

          {/* Standard playable sizes */}
          {GAME_CONFIG.presetSizes.map((size) => {
            const isSelected = n === size && mode === 'classic';
            return (
              <Pressable
                key={size}
                onPress={() => handleStartGame(size)}
                style={[
                  styles.sizeChip,
                  isSelected ? styles.sizeChipActive : styles.sizeChipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.sizeChipText,
                    isSelected && styles.sizeChipTextActive,
                  ]}
                >
                  {size}×{size}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Play Area */}
      <View style={styles.playArea}>
        {/* Top HUD */}
        <HUD />

        {/* Hint banner if active */}
        {currentHint && (
          <View style={styles.hintBanner}>
            <GameIcon name="hint" size={14} color="#fbbf24" />
            <Text style={styles.hintText}>{currentHint.message}</Text>
          </View>
        )}

        {/* Chessboard */}
        <View style={styles.boardContainer}>
          <Board />
        </View>

        {/* Bottom Action Controls */}
        <ActionBar />
      </View>

      {/* Modals */}
      <ResultModal />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {impossibleN && (
        <ImpossibleModal
          n={impossibleN}
          isOpen={impossibleN !== null}
          onClose={() => setImpossibleN(null)}
        />
      )}

      <RewardedAdModal />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#160c2b',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1d1038',
    borderBottomWidth: 1.5,
    borderBottomColor: '#301c5c',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crownEmoji: {
    fontSize: 26,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#facc15',
    letterSpacing: 1.2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizeSelectorContainer: {
    backgroundColor: '#140a26',
    borderBottomWidth: 1,
    borderBottomColor: '#281547',
    paddingVertical: 8,
  },
  sizeSelectorContent: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  sizeChipInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sizeChipActive: {
    backgroundColor: '#facc15',
    borderColor: '#fde047',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  sizeChipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '800',
  },
  sizeChipTextActive: {
    color: '#361b03',
  },
  impossibleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(159, 18, 57, 0.35)',
    borderColor: 'rgba(244, 63, 94, 0.45)',
  },
  impossibleChipText: {
    color: '#fda4af',
    fontSize: 12,
    fontWeight: '800',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  goldBadgeText: {
    color: '#fef08a',
  },
  purpleBadgeText: {
    color: '#f3e8ff',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dailyBtnText: {
    color: '#78350f',
    fontSize: 12,
    fontWeight: '800',
  },
  playArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hintBanner: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.6)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
  },
  hintText: {
    color: '#fde047',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
