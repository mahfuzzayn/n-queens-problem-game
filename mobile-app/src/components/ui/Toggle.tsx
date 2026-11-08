/**
 * Physical Game Switch / Toggle.
 */

import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { hapticsService } from '@/services/haptics';

export interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
}) => {
  const offset = useSharedValue(value ? 22 : 2);

  React.useEffect(() => {
    offset.value = withSpring(value ? 22 : 2, { damping: 15, stiffness: 350 });
  }, [value, offset]);

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    hapticsService.tap();
    onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && { opacity: 0.5 }]}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.track, { backgroundColor: value ? '#16a34a' : '#374151' }]}>
        <Animated.View style={[styles.knob, animatedKnobStyle]}>
          <View style={styles.knobShine} />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1f2937',
    justifyContent: 'center',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  knobShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});
