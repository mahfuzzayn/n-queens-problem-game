/**
 * Ornate Game Panel Container.
 * Cartoon fantasy strategy game style.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export interface GamePanelProps {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
}

export const GamePanel: React.FC<GamePanelProps> = ({ children, title, style }) => {
  return (
    <View style={[styles.outerFrame, style]}>
      {/* Wooden / Gold outer border container */}
      <View style={styles.innerContainer}>
        {title && (
          <View style={styles.titleBanner}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    backgroundColor: '#180a30',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#4d2b7d',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  innerContainer: {
    backgroundColor: '#231245',
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#6b3ea8',
    overflow: 'hidden',
  },
  titleBanner: {
    backgroundColor: '#351c68',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#532c9e',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#facc15',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  content: {
    padding: 16,
  },
});
