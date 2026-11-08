/**
 * Chunky Progress Bar with Glossy Fill and Shine.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  variant?: 'green' | 'gold' | 'purple';
  height?: number;
  style?: ViewStyle;
}

const COLORS = {
  green: {
    fill: '#22c55e',
    shine: 'rgba(255, 255, 255, 0.3)',
  },
  gold: {
    fill: '#eab308',
    shine: 'rgba(255, 255, 255, 0.4)',
  },
  purple: {
    fill: '#a855f7',
    shine: 'rgba(255, 255, 255, 0.3)',
  },
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  variant = 'gold',
  height = 18,
  style,
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const scheme = COLORS[variant];

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        {/* Fill bar */}
        <View
          style={[
            styles.fill,
            {
              width: `${clamped * 100}%`,
              backgroundColor: scheme.fill,
              borderRadius: height / 2,
            },
          ]}
        >
          {/* Top half shine */}
          <View
            style={[
              styles.shine,
              {
                backgroundColor: scheme.shine,
                borderTopLeftRadius: height / 2,
                borderTopRightRadius: height / 2,
              },
            ]}
          />
        </View>

        {/* Optional Label */}
        {label && (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  track: {
    backgroundColor: '#120722',
    borderWidth: 2,
    borderColor: '#391c6d',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  labelContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
