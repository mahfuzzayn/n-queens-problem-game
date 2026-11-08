'use client';

import React, { useState, useEffect } from 'react';
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

  const handleVisitStore = () => {
    setHasVisited(true);
    window.open(SHOETIC_AD_CONFIG.targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <GameModal
      isOpen={isOpen}
      onClose={onClose}
      title="🎁 Rewarded Hint — Sponsor"
    >
      <div className="flex flex-col items-center gap-4 text-center mt-1">
        {/* Ad Badge */}
        <div className="flex items-center justify-between w-full px-2 text-[11px] font-bold text-amber-400">
          <span className="bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40 uppercase">
            Sponsored Offer
          </span>
          <span className="text-purple-300">
            {claimsCount}/{SHOETIC_AD_CONFIG.maxRewardedHintsPerMatch} claimed
          </span>
        </div>

        {/* Shoetic Product Hero Card */}
        <div className="w-full bg-gradient-to-b from-[#241245] to-[#170a30] p-4 rounded-2xl border-2 border-amber-500/40 shadow-lg flex flex-col items-center gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2">
            <GameIcon name="shoetic" size={28} />
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 tracking-wider">
              {SHOETIC_AD_CONFIG.brandName}
            </span>
          </div>

          <p className="text-xs font-semibold text-purple-200 italic -mt-1">
            &ldquo;{SHOETIC_AD_CONFIG.tagline}&rdquo;
          </p>

          <h3 className="text-sm font-extrabold text-amber-300 px-2">
            {SHOETIC_AD_CONFIG.headline}
          </h3>

          <p className="text-xs text-purple-200/90 leading-relaxed px-1">
            {SHOETIC_AD_CONFIG.description}
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 w-full text-left mt-1">
            {SHOETIC_AD_CONFIG.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <GameIcon name="check" size={12} color="#34d399" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Visit Store Button */}
          <div className="w-full mt-2">
            <GameButton
              variant="secondary"
              size="sm"
              onClick={handleVisitStore}
              className="w-full"
            >
              🌐 {SHOETIC_AD_CONFIG.ctaText} {hasVisited && '✓'}
            </GameButton>
          </div>
        </div>

        {/* Reward Verification Box */}
        <div className="w-full bg-[#110620] p-3 rounded-xl border border-purple-800/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <GameIcon name="hint" size={22} color="#facc15" />
            <div>
              <p className="text-xs font-bold text-white">Unlock +1 Smart Hint</p>
              <p className="text-[10px] text-purple-300">
                {canClaim ? 'Verification complete!' : `Reward unlocks in ${secondsRemaining}s...`}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {canClaim ? (
              <GameButton
                variant="gold"
                size="sm"
                onClick={onClaimReward}
                disabled={remainingClaims <= 0}
              >
                Claim Hint
              </GameButton>
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-amber-500/50 flex items-center justify-center font-black text-amber-300 text-sm animate-pulse">
                {secondsRemaining}s
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-xs text-purple-400 hover:text-purple-200 transition-colors uppercase font-bold tracking-wider py-1 cursor-pointer"
        >
          No Thanks, Close
        </button>
      </div>
    </GameModal>
  );
};
