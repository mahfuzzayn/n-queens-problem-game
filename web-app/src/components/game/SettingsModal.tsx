import React from 'react';
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
      <div className="flex flex-col gap-2 mt-2">
        <Toggle
          label="Sound Effects"
          description="Plays tones on tap, placement, hints, and victory"
          checked={settings.soundEnabled}
          onChange={(val) => updateSettings({ soundEnabled: val })}
        />

        <Toggle
          label="Haptic Feedback"
          description="Vibrates on supported mobile devices"
          checked={settings.hapticsEnabled}
          onChange={(val) => updateSettings({ hapticsEnabled: val })}
        />

        <Toggle
          label="Show Attack Lines"
          description="Highlights attacked squares with indicator marks"
          checked={settings.showAttackLines}
          onChange={(val) => updateSettings({ showAttackLines: val })}
        />

        <Toggle
          label="Highlight Conflicts"
          description="Flashes queens in red when in collision"
          checked={settings.showConflicts}
          onChange={(val) => updateSettings({ showConflicts: val })}
        />

        <div className="mt-4 pt-4 border-t border-purple-800/40 flex justify-end">
          <GameButton variant="primary" size="sm" onClick={onClose}>
            Done
          </GameButton>
        </div>
      </div>
    </GameModal>
  );
};
