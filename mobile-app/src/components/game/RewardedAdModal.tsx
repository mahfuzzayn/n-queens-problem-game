/**
 * Rewarded Ad Modal for Shoetic Brand (Mobile React Native).
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { useGameStore } from '@/store';
import { GameModal } from '../ui/GameModal';
import { GameButton } from '../ui/GameButton';
import { GameIcon } from '../ui/GameIcon';
import { SHOETIC_AD_CONFIG } from '@/config/ads.config';

export interface RewardedAdModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onClaimReward?: () => void;
  claimsCount?: number;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = (props) => {
  const store = useGameStore();
  const isOpen = props.isOpen ?? store.isAdModalOpen;
  const onClose = props.onClose ?? store.closeAdModal;
  const onClaimReward = props.onClaimReward ?? store.claimRewardedHint;
  const claimsCount = props.claimsCount ?? store.adHintsClaimed;

  const [secondsRemaining, setSecondsRemaining] = useState(SHOETIC_AD_CONFIG.requiredViewTimeSeconds);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(SHOETIC_AD_CONFIG.requiredViewTimeSeconds);
      setHasVisited(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const canClaim = secondsRemaining === 0;
  const remainingClaims = Math.max(0, SHOETIC_AD_CONFIG.maxRewardedHintsPerMatch - claimsCount);

  const handleVisitStore = async () => {
    setHasVisited(true);
    try {
      await Linking.openURL(SHOETIC_AD_CONFIG.targetUrl);
    } catch {
      // Ignore URL open error
    }
  };

  return (
    <GameModal
      isOpen={isOpen}
      onClose={onClose}
      title="🎁 Rewarded Hint — Sponsor"
    >
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>SPONSORED OFFER</Text>
          </View>
          <Text style={styles.claimsText}>
            {claimsCount}/{SHOETIC_AD_CONFIG.maxRewardedHintsPerMatch} claimed
          </Text>
        </View>

        {/* Brand Card */}
        <View style={styles.card}>
          <View style={styles.logoRow}>
            <GameIcon name="shoetic" size={24} />
            <Text style={styles.brandTitle}>{SHOETIC_AD_CONFIG.brandName}</Text>
          </View>

          <Text style={styles.tagline}>&ldquo;{SHOETIC_AD_CONFIG.tagline}&rdquo;</Text>
          <Text style={styles.headline}>{SHOETIC_AD_CONFIG.headline}</Text>
          <Text style={styles.description}>{SHOETIC_AD_CONFIG.description}</Text>

          {/* Features */}
          <View style={styles.featuresList}>
            {SHOETIC_AD_CONFIG.features.map((feat, i) => (
              <View key={i} style={styles.featureItem}>
                <GameIcon name="check" size={12} color="#34d399" />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* Visit Button */}
          <View style={styles.visitButtonWrapper}>
            <GameButton
              variant="secondary"
              size="sm"
              onPress={handleVisitStore}
            >
              {`🌐 ${SHOETIC_AD_CONFIG.ctaText} ${hasVisited ? '✓' : ''}`}
            </GameButton>
          </View>
        </View>

        {/* Verification & Claim Box */}
        <View style={styles.rewardBox}>
          <View style={styles.rewardInfo}>
            <GameIcon name="hint" size={22} color="#facc15" />
            <View>
              <Text style={styles.rewardTitle}>Unlock +1 Smart Hint</Text>
              <Text style={styles.rewardSubtext}>
                {canClaim ? 'Verification complete!' : `Reward unlocks in ${secondsRemaining}s...`}
              </Text>
            </View>
          </View>

          <View>
            {canClaim ? (
              <GameButton
                variant="gold"
                size="sm"
                onPress={onClaimReward}
                disabled={remainingClaims <= 0}
              >
                Claim Hint
              </GameButton>
            ) : (
              <View style={styles.countdownBadge}>
                <Text style={styles.countdownText}>{secondsRemaining}s</Text>
              </View>
            )}
          </View>
        </View>

        {/* Close */}
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>NO THANKS, CLOSE</Text>
        </Pressable>
      </View>
    </GameModal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  adBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adBadgeText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  claimsText: {
    color: '#c4b5fd',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    backgroundColor: '#1c0d38',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#facc15',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#ddd6fe',
    marginTop: -2,
  },
  headline: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fde047',
    textAlign: 'center',
    marginTop: 2,
  },
  description: {
    fontSize: 11,
    color: 'rgba(233, 213, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 15,
  },
  featuresList: {
    width: '100%',
    gap: 4,
    marginVertical: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20, 83, 45, 0.35)',
    borderColor: 'rgba(34, 197, 94, 0.25)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#86efac',
  },
  visitButtonWrapper: {
    width: '100%',
    marginTop: 4,
  },
  rewardBox: {
    width: '100%',
    backgroundColor: '#110521',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#43217d',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rewardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  rewardSubtext: {
    fontSize: 10,
    color: '#a78bfa',
    marginTop: 1,
  },
  countdownBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fbbf24',
  },
  closeBtn: {
    paddingVertical: 4,
  },
  closeBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 1,
  },
});
