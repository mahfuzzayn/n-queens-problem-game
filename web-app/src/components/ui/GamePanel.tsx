import React from 'react';

export interface GamePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'wood' | 'royal' | 'gold';
  title?: string;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  variant = 'royal',
  title,
  children,
  className = '',
  ...props
}) => {
  const borderAndBg =
    variant === 'wood'
      ? 'bg-[#3b2414] border-4 border-[#6d4624] shadow-[0_8px_0_0_#211309]'
      : variant === 'gold'
      ? 'bg-[#4a3108] border-4 border-[#c79124] shadow-[0_8px_0_0_#261903]'
      : 'bg-[#25184a] border-4 border-[#4a318f] shadow-[0_8px_0_0_#140b2e]';

  return (
    <div
      className={`relative rounded-3xl p-6 text-white ${borderAndBg} ${className}`}
      {...props}
    >
      {title && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#ffd747] to-[#df9911] text-[#3d2303] font-extrabold px-6 py-1.5 rounded-2xl border-2 border-[#7a4e06] shadow-md uppercase tracking-wider text-sm sm:text-base whitespace-nowrap">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};
