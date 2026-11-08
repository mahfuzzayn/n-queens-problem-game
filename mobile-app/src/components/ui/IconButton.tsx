/**
 * Chunky Icon Button primitive.
 */

import React from 'react';
import { GameButton, ButtonVariant, ButtonSize } from './GameButton';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export interface IconButtonProps {
  icon: string | React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  style,
}) => {
  return (
    <GameButton
      onPress={onPress}
      variant={variant}
      size={size}
      disabled={disabled}
      style={style}
    >
      {typeof icon === 'string' ? (
        <Text style={styles.iconText}>{icon}</Text>
      ) : (
        icon
      )}
    </GameButton>
  );
};

const styles = StyleSheet.create({
  iconText: {
    fontSize: 18,
  },
});
