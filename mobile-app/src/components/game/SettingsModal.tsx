/**
 * Settings Modal for sound, haptics, attack lines, and conflict indicators.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '@/store';
import { GameModal } from '../ui/GameModal';
import { Toggle } from '../ui/Toggle';
import { GameButton } from '../ui/GameButton';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useGameStore();

  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="Settings">
      <View style={styles.container}>
        <View style={styles.settingItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Sound Effects</Text>
            <Text style={styles.desc}>Tones on tap, placement, hints, and victory</Text>
          </View>
          <Toggle
            value={settings.soundEnabled}
            onValueChange={(val) => updateSettings({ soundEnabled: val })}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Haptic Feedback</Text>
            <Text style={styles.desc}>Tactile vibrations on tap, error, and victory</Text>
          </View>
          <Toggle
            value={settings.hapticsEnabled}
            onValueChange={(val) => updateSettings({ hapticsEnabled: val })}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Show Attack Lines</Text>
            <Text style={styles.desc}>Visual dots on attacked squares</Text>
          </View>
          <Toggle
            value={settings.showAttackLines}
            onValueChange={(val) => updateSettings({ showAttackLines: val })}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Highlight Conflicts</Text>
            <Text style={styles.desc}>Flashes queens and cells in red when conflicting</Text>
          </View>
          <Toggle
            value={settings.showConflicts}
            onValueChange={(val) => updateSettings({ showConflicts: val })}
          />
        </View>

        <View style={styles.footer}>
          <GameButton variant="primary" size="sm" onPress={onClose}>
            Done
          </GameButton>
        </View>
      </View>
    </GameModal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#3c1d73',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  desc: {
    color: '#a78bfa',
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
});
