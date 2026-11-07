import React from 'react';

export interface RibbonProps {
  text: string;
  variant?: 'gold' | 'red' | 'purple' | 'green';
  className?: string;
}

export const Ribbon: React.FC<RibbonProps> = ({
  text,
  variant = 'gold',
  className = '',
}) => {
  const variantStyles = {
    gold: 'from-[#ffdf58] via-[#f5ab16] to-[#d48806] text-[#3d2303] border-[#7a4e06] shadow-[0_4px_0_0_#5e3800]',
    red: 'from-[#ff6b6b] via-[#ee3f3f] to-[#b81d1d] text-white border-[#590d0d] shadow-[0_4px_0_0_#380505]',
    purple: 'from-[#a770ef] via-[#cf8bf3] to-[#fdb99b] text-[#200538] border-[#3f1266] shadow-[0_4px_0_0_#1f0536]',
    green: 'from-[#69db7c] via-[#37b24d] to-[#2b8a3e] text-white border-[#1c5c29] shadow-[0_4px_0_0_#0f3817]',
  }[variant];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`px-8 py-2 font-black uppercase tracking-widest text-base sm:text-xl rounded-xl border-2 bg-gradient-to-r ${variantStyles} drop-shadow-md select-none transform -rotate-1`}
        style={{
          textShadow: '0 1px 2px rgba(255,255,255,0.4)',
        }}
      >
        {text}
      </div>
    </div>
  );
};
