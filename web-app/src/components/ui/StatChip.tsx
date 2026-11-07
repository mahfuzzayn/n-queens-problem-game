import React from 'react';

export interface StatChipProps {
  icon: string | React.ReactNode;
  label?: string;
  value: string | number;
  variant?: 'gold' | 'purple' | 'green' | 'blue' | 'dark';
  className?: string;
}

export const StatChip: React.FC<StatChipProps> = ({
  icon,
  label,
  value,
  variant = 'dark',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-gradient-to-b from-[#ffd747] to-[#df9911] text-[#3d2303] border-[#7a4e06]',
    purple: 'bg-gradient-to-b from-[#5c3a9e] to-[#3a1d70] text-white border-[#271052]',
    green: 'bg-gradient-to-b from-[#4caf50] to-[#2e7d32] text-white border-[#1b5e20]',
    blue: 'bg-gradient-to-b from-[#2196f3] to-[#1565c0] text-white border-[#0d47a1]',
    dark: 'bg-[#1b0f38] text-white border-[#381c70]',
  }[variant];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl border-2 font-bold select-none shadow-[0_2px_0_0_rgba(0,0,0,0.3)] text-xs sm:text-sm ${variantStyles} ${className}`}
    >
      <span className="text-base leading-none">{icon}</span>
      {label && <span className="opacity-75 font-normal text-[11px] uppercase tracking-wider">{label}</span>}
      <span className="font-extrabold">{value}</span>
    </div>
  );
};
