/**
 * Stat Chip for displaying game metrics in HUD.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface StatChipProps {
  icon: string;
  label: string;
  value: string | number;
  highlight?: boolean;
}

export const StatChip: React.FC<StatChipProps> = ({
  icon,
  label,
  value,
  highlight = false,
}) => {
  return (
    <View style={[styles.container, highlight && styles.highlightContainer]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textColumn}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, highlight && styles.highlightValue]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b0d36',
    borderWidth: 1.5,
    borderColor: '#3c1d73',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightContainer: {
    borderColor: '#eab308',
    backgroundColor: '#2b1b0d',
  },
  icon: {
    fontSize: 16,
  },
  textColumn: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: '#a78bfa',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },
  highlightValue: {
    color: '#facc15',
  },
});
