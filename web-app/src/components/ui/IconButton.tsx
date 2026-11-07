import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center font-bold select-none cursor-pointer transition-all duration-150 active:translate-y-1 focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none rounded-2xl border-2',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-b from-[#5cbf60] to-[#3d8b40] text-white border-[#225725] shadow-[0_4px_0_0_#225725] active:shadow-[0_1px_0_0_#225725] hover:brightness-105',
        secondary:
          'bg-gradient-to-b from-[#3ea5f7] to-[#1a6ebd] text-white border-[#0d457a] shadow-[0_4px_0_0_#0d457a] active:shadow-[0_1px_0_0_#0d457a] hover:brightness-105',
        gold:
          'bg-gradient-to-b from-[#ffdf58] to-[#df9d15] text-[#4a2e05] border-[#825505] shadow-[0_4px_0_0_#825505] active:shadow-[0_1px_0_0_#825505] hover:brightness-105',
        danger:
          'bg-gradient-to-b from-[#ff6058] to-[#c92820] text-white border-[#73120c] shadow-[0_4px_0_0_#73120c] active:shadow-[0_1px_0_0_#73120c] hover:brightness-105',
        ghost:
          'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-none active:translate-y-0.5',
      },
      size: {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-xl',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = '', variant, size, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${iconButtonVariants({ variant, size })} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
