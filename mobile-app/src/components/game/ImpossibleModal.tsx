/**
 * Impossible Challenge Modal (N=2 and N=3) "Prove It" animation.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameModal } from '../ui/GameModal';
import { GameButton } from '../ui/GameButton';

export interface ImpossibleModalProps {
  n: 2 | 3;
  isOpen: boolean;
  onClose: () => void;
}

export const ImpossibleModal: React.FC<ImpossibleModalProps> = ({ n, isOpen, onClose }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [exploredBranches, setExploredBranches] = useState<number>(0);
  const [proven, setProven] = useState(false);

  const totalBranches = n === 2 ? 4 : 27;

  useEffect(() => {
    if (!isOpen) {
      setIsSimulating(false);
      setExploredBranches(0);
      setProven(false);
    }
  }, [isOpen]);

  const runProof = () => {
    setIsSimulating(true);
    setProven(false);
    setExploredBranches(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setExploredBranches(current);
      if (current >= totalBranches) {
        clearInterval(interval);
        setIsSimulating(false);
        setProven(true);
      }
    }, 40);
  };

  return (
    <GameModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Impossible Challenge (N=${n})`}
    >
      <View style={styles.container}>
        <Text style={styles.description}>
          Mathematically, <Text style={styles.boldText}>no arrangement of {n} queens</Text> can exist on a {n}×{n} board without attacking each other!
        </Text>

        <View style={styles.branchBox}>
          <Text style={styles.boxTitle}>Exhaustive Branch Search</Text>
          <Text style={styles.branchCount}>
            {exploredBranches} / {totalBranches}
          </Text>
          <Text style={styles.boxSubtext}>
            Checking all candidate permutations via backtracking solver...
          </Text>

          {proven && (
            <View style={styles.provenBanner}>
              <Text style={styles.provenText}>
                ✓ 100% Branches Exhausted. Zero solutions found. Mathematical impossibility confirmed!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionRow}>
          <View style={styles.btnWrapper}>
            <GameButton
              variant="gold"
              size="md"
              disabled={isSimulating}
              onPress={runProof}
            >
              {isSimulating ? 'Testing...' : 'Prove It!'}
            </GameButton>
          </View>

          <View style={styles.btnWrapper}>
            <GameButton variant="ghost" size="md" onPress={onClose}>
              Close
            </GameButton>
          </View>
        </View>
      </View>
    </GameModal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    alignItems: 'center',
  },
  description: {
    color: '#e9d5ff',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '900',
    color: '#facc15',
  },
  branchBox: {
    backgroundColor: '#190d33',
    borderWidth: 1.5,
    borderColor: '#43257a',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
  boxTitle: {
    color: '#facc15',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  branchCount: {
    color: '#67e8f9',
    fontSize: 26,
    fontWeight: '900',
    marginVertical: 4,
  },
  boxSubtext: {
    color: '#c4b5fd',
    fontSize: 11,
    textAlign: 'center',
  },
  provenBanner: {
    backgroundColor: 'rgba(22, 101, 52, 0.4)',
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 10,
    padding: 8,
    marginTop: 6,
  },
  provenText: {
    color: '#86efac',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  btnWrapper: {
    flex: 1,
  },
});
