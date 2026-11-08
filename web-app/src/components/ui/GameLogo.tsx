import React from 'react';

export interface GameLogoProps {
  size?: number;
  className?: string;
}

export const GameLogo: React.FC<GameLogoProps> = ({ size = 36, className = '' }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`select-none filter drop-shadow-[0_4px_8px_rgba(245,158,11,0.4)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="webLogoGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="25%" stopColor="#ffd54f" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="85%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        <linearGradient id="webLogoRim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="30%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        <linearGradient id="webLogoVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="60%" stopColor="#6b21a8" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>

        <radialGradient id="webLogoRuby" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="35%" stopColor="#ef4444" />
          <stop offset="75%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>

        <radialGradient id="webLogoSapphire" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="40%" stopColor="#0ea5e9" />
          <stop offset="80%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>

        <radialGradient id="webLogoEmerald" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="80%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#052e16" />
        </radialGradient>
      </defs>

      {/* Royal Velvet Cushion Inside Crown */}
      <path
        d="M 45 130 C 45 75, 155 75, 155 130 Z"
        fill="url(#webLogoVelvet)"
        stroke="#2e1065"
        strokeWidth="5"
      />

      {/* Velvet Folds */}
      <path d="M 70 128 C 80 92, 90 92, 100 128" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M 100 128 C 110 92, 120 92, 130 128" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

      {/* Crown Main Body */}
      <path
        d="M 32 142 L 20 62 L 64 96 L 100 36 L 136 96 L 180 62 L 168 142 Z"
        fill="url(#webLogoGold)"
        stroke="#451a03"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Crown Inner Shading */}
      <path
        d="M 36 138 L 26 70 L 64 99 L 100 44 L 136 99 L 174 70 L 164 138 Z"
        stroke="#fef08a"
        strokeWidth="2.5"
        opacity="0.75"
      />

      {/* Base Band */}
      <rect
        x="24"
        y="136"
        width="152"
        height="26"
        rx="8"
        fill="url(#webLogoRim)"
        stroke="#451a03"
        strokeWidth="6"
      />

      {/* Pearls & Jewels on Peaks */}
      <circle cx="20" cy="60" r="10" fill="#ffffff" stroke="#78350f" strokeWidth="3.5" />
      <circle cx="17" cy="57" r="3" fill="#ffffff" />
      <circle cx="64" cy="94" r="8" fill="url(#webLogoSapphire)" stroke="#0c4a6e" strokeWidth="3" />
      <circle cx="100" cy="34" r="12" fill="#ffffff" stroke="#78350f" strokeWidth="4" />
      <circle cx="96" cy="30" r="4" fill="#ffffff" />
      <circle cx="136" cy="94" r="8" fill="url(#webLogoEmerald)" stroke="#064e3b" strokeWidth="3" />
      <circle cx="180" cy="60" r="10" fill="#ffffff" stroke="#78350f" strokeWidth="3.5" />
      <circle cx="177" cy="57" r="3" fill="#ffffff" />

      {/* Rim Gemstones */}
      <ellipse cx="100" cy="149" rx="14" ry="9" fill="url(#webLogoRuby)" stroke="#450a0a" strokeWidth="3" />
      <ellipse cx="98" cy="147" rx="5" ry="3" fill="#fecaca" opacity="0.6" />
      <ellipse cx="60" cy="149" rx="10" ry="7" fill="url(#webLogoSapphire)" stroke="#082f49" strokeWidth="2.5" />
      <ellipse cx="140" cy="149" rx="10" ry="7" fill="url(#webLogoSapphire)" stroke="#082f49" strokeWidth="2.5" />
    </svg>
  );
};
