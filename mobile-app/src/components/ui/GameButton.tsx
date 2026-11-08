/**
 * Physical 3D Game Button with Reanimated Press-Sink Animation.
 * Cartoon fantasy strategy game aesthetic.
 */

import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { hapticsService } from '@/services/haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'danger' | 'purple' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GameButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const COLOR_SCHEMES = {
  primary: {
    face: '#48a84b',
    bevel: '#235926',
    border: '#1a431c',
    text: '#ffffff',
    shine: 'rgba(255, 255, 255, 0.28)',
  },
  secondary: {
    face: '#339af0',
    bevel: '#1864ab',
    border: '#114677',
    text: '#ffffff',
    shine: 'rgba(255, 255, 255, 0.28)',
  },
  gold: {
    face: '#f59f00',
    bevel: '#b46b00',
    border: '#7a4800',
    text: '#442b03',
    shine: 'rgba(255, 255, 255, 0.38)',
  },
  danger: {
    face: '#e03131',
    bevel: '#9b1c1c',
    border: '#6f1414',
    text: '#ffffff',
    shine: 'rgba(255, 255, 255, 0.25)',
  },
  purple: {
    face: '#9c36b5',
    bevel: '#661b78',
    border: '#451052',
    text: '#ffffff',
    shine: 'rgba(255, 255, 255, 0.25)',
  },
  ghost: {
    face: 'rgba(255, 255, 255, 0.12)',
    bevel: 'rgba(0, 0, 0, 0.4)',
    border: 'rgba(255, 255, 255, 0.25)',
    text: '#ffffff',
    shine: 'rgba(255, 255, 255, 0.1)',
  },
};

const SIZES = {
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 12,
    bevelHeight: 3,
    borderRadius: 12,
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: 14,
    bevelHeight: 4,
    borderRadius: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    fontSize: 16,
    bevelHeight: 5,
    borderRadius: 20,
  },
  xl: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    fontSize: 18,
    bevelHeight: 6,
    borderRadius: 24,
  },
};

export const GameButton: React.FC<GameButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  style,
  textStyle,
  icon,
}) => {
  const scheme = COLOR_SCHEMES[variant];
  const sizeConfig = SIZES[size];
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    translateY.value = withSpring(sizeConfig.bevelHeight, { damping: 15, stiffness: 450 });
    hapticsService.tap();
  };

  const handlePressOut = () => {
    if (disabled || isLoading) return;
    translateY.value = withSpring(0, { damping: 15, stiffness: 450 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Pressable
      onPress={disabled || isLoading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
    >
      <View
        style={[
          styles.outerContainer,
          {
            backgroundColor: scheme.bevel,
            borderRadius: sizeConfig.borderRadius,
            paddingBottom: sizeConfig.bevelHeight,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.face,
            {
              backgroundColor: scheme.face,
              borderColor: scheme.border,
              borderRadius: sizeConfig.borderRadius,
              paddingVertical: sizeConfig.paddingVertical,
              paddingHorizontal: sizeConfig.paddingHorizontal,
            },
            animatedStyle,
          ]}
        >
          {/* Top highlight shine strip */}
          <View
            style={[
              styles.shineStrip,
              {
                backgroundColor: scheme.shine,
                borderTopLeftRadius: sizeConfig.borderRadius - 2,
                borderTopRightRadius: sizeConfig.borderRadius - 2,
              },
            ]}
          />

          <View style={styles.contentRow}>
            {isLoading ? (
              <ActivityIndicator color={scheme.text} size="small" />
            ) : (
              <>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                {React.isValidElement(children) ? (
                  children
                ) : (
                  <Text
                    style={[
                      styles.text,
                      {
                        color: scheme.text,
                        fontSize: sizeConfig.fontSize,
                      },
                      textStyle,
                    ]}
                  >
                    {children}
                  </Text>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    overflow: 'hidden',
  },
  face: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shineStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    marginRight: 6,
  },
  text: {
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
