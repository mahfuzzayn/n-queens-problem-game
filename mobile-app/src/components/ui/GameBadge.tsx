/**
 * Chunky Game Badge component.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export type BadgeVariant = 'gold' | 'purple' | 'green' | 'red' | 'gray';
export type BadgeSize = 'sm' | 'md';

export interface GameBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const BADGE_COLORS = {
  gold: {
    bg: '#78350f',
    border: '#d97706',
    text: '#fde047',
  },
  purple: {
    bg: '#3b0764',
    border: '#7e22ce',
    text: '#d8b4fe',
  },
  green: {
    bg: '#14532d',
    border: '#16a34a',
    text: '#86efac',
  },
  red: {
    bg: '#7f1d1d',
    border: '#dc2626',
    text: '#fca5a5',
  },
  gray: {
    bg: '#1f2937',
    border: '#4b5563',
    text: '#d1d5db',
  },
};

export const GameBadge: React.FC<GameBadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  style,
  textStyle,
}) => {
  const scheme = BADGE_COLORS[variant];
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 8 : 12,
          borderRadius: isSm ? 10 : 14,
        },
        style,
      ]}
    >
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: scheme.text,
              fontSize: isSm ? 11 : 13,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
