/**
 * Mobile Splash / Load Screen with 60fps Reanimated Spring & Shimmer.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { GameLogo } from '../ui/GameLogo';

export interface SplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDurationMs = 1200,
}) => {
  const opacity = useSharedValue(1);
  const logoScale = useSharedValue(0.6);
  const logoY = useSharedValue(20);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Logo entrance spring
    logoScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    logoY.value = withSpring(0, { damping: 12, stiffness: 200 }, () => {
      // Gentle floating loop
      logoY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    });

    // Progress bar fill
    progressWidth.value = withTiming(
      100,
      { duration: minDurationMs, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished) {
          // Fade out splash screen
          opacity.value = withTiming(0, { duration: 350 }, () => {
            if (onFinish) {
              runOnJS(onFinish)();
            }
          });
        }
      }
    );
  }, [minDurationMs, onFinish, logoScale, logoY, progressWidth, opacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 1 + (1 - opacity.value) * 0.05 }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View style={[styles.overlay, containerAnimatedStyle]} pointerEvents="none">
      {/* Crown Logo */}
      <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
        <GameLogo size={108} />
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>N-QUEENS</Text>
      <Text style={styles.subtitle}>TACTICAL CHESS PUZZLE</Text>

      {/* Progress Bar Container */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, progressAnimatedStyle]}>
            {/* Top Shine */}
            <View style={styles.progressBarShine} />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>SUMMONING QUEENS...</Text>
      </View>
    </Animated.View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#160c2b',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#facc15',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#c4b5fd',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 36,
    textTransform: 'uppercase',
  },
  progressContainer: {
    width: Math.min(width - 80, 240),
    alignItems: 'center',
    gap: 8,
  },
  progressBarTrack: {
    width: '100%',
    height: 14,
    backgroundColor: '#100720',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#45237e',
    overflow: 'hidden',
    padding: 1.5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 1.2,
  },
});
