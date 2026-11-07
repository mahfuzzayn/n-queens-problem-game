import React from 'react';

export interface GameBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'purple' | 'green' | 'red' | 'blue';
  size?: 'sm' | 'md';
}

export const GameBadge: React.FC<GameBadgeProps> = ({
  variant = 'gold',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    gold: 'bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 border-amber-600 shadow-[0_2px_0_0_#92400e]',
    purple: 'bg-gradient-to-b from-purple-500 to-purple-700 text-white border-purple-900 shadow-[0_2px_0_0_#3b0764]',
    green: 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-emerald-950 border-emerald-800 shadow-[0_2px_0_0_#064e3b]',
    red: 'bg-gradient-to-b from-rose-400 to-rose-600 text-white border-rose-900 shadow-[0_2px_0_0_#4c0519]',
    blue: 'bg-gradient-to-b from-sky-400 to-sky-600 text-sky-950 border-sky-800 shadow-[0_2px_0_0_#082f49]',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-lg border',
    md: 'text-xs px-2.5 py-1 rounded-xl border-2 font-black tracking-wider uppercase',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 select-none font-bold ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
