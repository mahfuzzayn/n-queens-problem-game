import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to max
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'green' | 'gold' | 'blue' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'gold',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    gold: 'from-amber-300 via-yellow-400 to-amber-500 border-amber-600',
    green: 'from-emerald-400 via-green-500 to-emerald-600 border-emerald-800',
    blue: 'from-sky-400 via-blue-500 to-sky-600 border-sky-800',
    purple: 'from-purple-400 via-violet-500 to-purple-600 border-purple-800',
  }[color];

  const sizeStyles = {
    sm: 'h-3 text-[10px]',
    md: 'h-5 text-xs',
    lg: 'h-7 text-sm',
  }[size];

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-bold text-purple-200">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#150a2b] border-2 border-[#361a6b] rounded-full p-0.5 overflow-hidden shadow-inner ${sizeStyles}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorStyles} transition-all duration-300 relative shadow-sm`}
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle top shine */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full" />
        </div>
      </div>
    </div>
  );
};
