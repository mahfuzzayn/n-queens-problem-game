import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold select-none cursor-pointer transition-all duration-150 active:translate-y-1 focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-b from-[#5cbf60] to-[#3d8b40] text-white border-2 border-[#225725] shadow-[0_4px_0_0_#225725] active:shadow-[0_1px_0_0_#225725] hover:brightness-105',
        secondary:
          'bg-gradient-to-b from-[#3ea5f7] to-[#1a6ebd] text-white border-2 border-[#0d457a] shadow-[0_4px_0_0_#0d457a] active:shadow-[0_1px_0_0_#0d457a] hover:brightness-105',
        gold:
          'bg-gradient-to-b from-[#ffdf58] to-[#df9d15] text-[#4a2e05] border-2 border-[#825505] shadow-[0_4px_0_0_#825505] active:shadow-[0_1px_0_0_#825505] hover:brightness-105',
        danger:
          'bg-gradient-to-b from-[#ff6058] to-[#c92820] text-white border-2 border-[#73120c] shadow-[0_4px_0_0_#73120c] active:shadow-[0_1px_0_0_#73120c] hover:brightness-105',
        ghost:
          'bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 shadow-none active:translate-y-0.5',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs rounded-xl',
        md: 'px-5 py-2.5 text-sm rounded-2xl',
        lg: 'px-7 py-3.5 text-base rounded-2xl',
        xl: 'px-9 py-4 text-lg rounded-3xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className = '', variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${buttonVariants({ variant, size })} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

GameButton.displayName = 'GameButton';
