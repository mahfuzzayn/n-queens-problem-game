/**
 * Illustrated Queen SVG with Gold Glossy Gradient, Jewels, and Reanimated Conflict Bounce.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export interface QueenProps {
  hasConflict?: boolean;
  size?: number;
}

export const Queen: React.FC<QueenProps> = ({ hasConflict = false, size = 36 }) => {
  const bounceY = useSharedValue(0);
  const scale = useSharedValue(0.7);

  // Entrance pop
  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 350 });
  }, [scale]);

  // Conflict bounce loop
  useEffect(() => {
    if (hasConflict) {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 120 }),
          withTiming(0, { duration: 120 })
        ),
        -1,
        true
      );
    } else {
      bounceY.value = withTiming(0, { duration: 100 });
    }
  }, [hasConflict, bounceY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: bounceY.value },
    ],
  }));

  const goldId = `goldCrown_${hasConflict ? 'c' : 'g'}`;
  const baseId = `crownBase_${hasConflict ? 'c' : 'g'}`;

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <Svg viewBox="0 0 100 100" width="100%" height="100%">
        <Defs>
          {/* Gold Glossy Gradient */}
          <LinearGradient id={goldId} x1="0%" y1="0%" x2="0%" y2="100%">
            {hasConflict ? (
              [
                <Stop key="c0" offset="0%" stopColor="#ff9994" />,
                <Stop key="c1" offset="40%" stopColor="#e53935" />,
                <Stop key="c2" offset="100%" stopColor="#7f0000" />,
              ]
            ) : (
              [
                <Stop key="g0" offset="0%" stopColor="#fff275" />,
                <Stop key="g1" offset="35%" stopColor="#ffd21f" />,
                <Stop key="g2" offset="85%" stopColor="#d48b06" />,
                <Stop key="g3" offset="100%" stopColor="#875300" />,
              ]
            )}
          </LinearGradient>

          {/* Crown Rim Base Gradient */}
          <LinearGradient id={baseId} x1="0%" y1="0%" x2="100%" y2="0%">
            {hasConflict ? (
              [
                <Stop key="bc0" offset="0%" stopColor="#7f0000" />,
                <Stop key="bc1" offset="50%" stopColor="#ff9994" />,
                <Stop key="bc2" offset="100%" stopColor="#7f0000" />,
              ]
            ) : (
              [
                <Stop key="bg0" offset="0%" stopColor="#875300" />,
                <Stop key="bg1" offset="50%" stopColor="#ffe57f" />,
                <Stop key="bg2" offset="100%" stopColor="#875300" />,
              ]
            )}
          </LinearGradient>
        </Defs>

        {/* Main Crown Body */}
        <Path
          d="M20 78 L12 32 L36 50 L50 20 L64 50 L88 32 L80 78 Z"
          fill={`url(#${goldId})`}
          stroke={hasConflict ? '#450a0a' : '#573703'}
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Jewels on Crown Points */}
        <Circle cx="12" cy="30" r="5" fill="#ffffff" stroke={hasConflict ? '#7f0000' : '#a16207'} strokeWidth="2" />
        <Circle cx="50" cy="18" r="6" fill="#ffffff" stroke={hasConflict ? '#7f0000' : '#a16207'} strokeWidth="2" />
        <Circle cx="88" cy="30" r="5" fill="#ffffff" stroke={hasConflict ? '#7f0000' : '#a16207'} strokeWidth="2" />

        {/* Crown Base Rim */}
        <Rect
          x="18"
          y="76"
          width="64"
          height="12"
          rx="4"
          fill={`url(#${baseId})`}
          stroke={hasConflict ? '#450a0a' : '#573703'}
          strokeWidth="3"
        />

        {/* Center Gems on Rim */}
        <Ellipse cx="50" cy="82" rx="6" ry="4" fill="#e11d48" stroke="#4c0519" strokeWidth="1.5" />
        <Ellipse cx="32" cy="82" rx="4" ry="3" fill="#0284c7" stroke="#082f49" strokeWidth="1.5" />
        <Ellipse cx="68" cy="82" rx="4" ry="3" fill="#0284c7" stroke="#082f49" strokeWidth="1.5" />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
