import React from 'react';

export interface QueenProps {
  hasConflict?: boolean;
  className?: string;
}

export const Queen: React.FC<QueenProps> = ({ hasConflict = false, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transition-transform duration-200 select-none pointer-events-none ${
        hasConflict ? 'animate-bounce drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]' : ''
      } ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gold Glossy Gradient */}
        <linearGradient id="goldCrown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff275" />
          <stop offset="35%" stopColor="#ffd21f" />
          <stop offset="85%" stopColor="#d48b06" />
          <stop offset="100%" stopColor="#875300" />
        </linearGradient>

        {/* Conflict Red Gradient */}
        <linearGradient id="conflictCrown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9994" />
          <stop offset="40%" stopColor="#e53935" />
          <stop offset="100%" stopColor="#7f0000" />
        </linearGradient>

        {/* Base Bevel */}
        <linearGradient id="crownBase" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#875300" />
          <stop offset="50%" stopColor="#ffe57f" />
          <stop offset="100%" stopColor="#875300" />
        </linearGradient>
      </defs>

      {/* Main Crown Body */}
      <path
        d="M20 78 L12 32 L36 50 L50 20 L64 50 L88 32 L80 78 Z"
        fill={hasConflict ? 'url(#conflictCrown)' : 'url(#goldCrown)'}
        stroke={hasConflict ? '#450a0a' : '#573703'}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Jewels on Crown Points */}
      <circle cx="12" cy="30" r="5" fill="#ffffff" stroke="#a16207" strokeWidth="2" />
      <circle cx="50" cy="18" r="6" fill="#ffffff" stroke="#a16207" strokeWidth="2" />
      <circle cx="88" cy="30" r="5" fill="#ffffff" stroke="#a16207" strokeWidth="2" />

      {/* Crown Base Rim */}
      <rect
        x="18"
        y="76"
        width="64"
        height="12"
        rx="4"
        fill="url(#crownBase)"
        stroke={hasConflict ? '#450a0a' : '#573703'}
        strokeWidth="3"
      />

      {/* Center Gem on Rim */}
      <ellipse cx="50" cy="82" rx="6" ry="4" fill="#e11d48" stroke="#4c0519" strokeWidth="1.5" />
      <ellipse cx="32" cy="82" rx="4" ry="3" fill="#0284c7" stroke="#082f49" strokeWidth="1.5" />
      <ellipse cx="68" cy="82" rx="4" ry="3" fill="#0284c7" stroke="#082f49" strokeWidth="1.5" />
    </svg>
  );
};
