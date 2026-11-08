/**
 * Chunky Number Stepper component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameButton } from './GameButton';

export interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  min = 1,
  max = 16,
  step = 1,
  onChange,
  label,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.stepperRow}>
        <GameButton
          variant="secondary"
          size="sm"
          onPress={handleDecrement}
          disabled={value <= min}
        >
          -
        </GameButton>

        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{value}</Text>
        </View>

        <GameButton
          variant="secondary"
          size="sm"
          onPress={handleIncrement}
          disabled={value >= max}
        >
          +
        </GameButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueDisplay: {
    minWidth: 44,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1b0d36',
    borderWidth: 2,
    borderColor: '#4c1d95',
    borderRadius: 12,
    alignItems: 'center',
  },
  valueText: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: '900',
  },
});
