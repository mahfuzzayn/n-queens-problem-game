import React from 'react';

export interface StepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  disabled?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  disabled = false,
}) => {
  const handleDec = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleInc = () => {
    if (value + step <= max) onChange(value + step);
  };

  return (
    <div className="flex items-center justify-between gap-3 p-2 bg-[#1b0f38] border-2 border-[#381c70] rounded-2xl">
      {label && <span className="font-bold text-sm text-purple-200">{label}</span>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={handleDec}
          className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:translate-y-0.5 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-black text-lg text-white"
        >
          -
        </button>
        <span className="w-10 text-center font-black text-amber-300 text-lg">{value}</span>
        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={handleInc}
          className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:translate-y-0.5 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-black text-lg text-white"
        >
          +
        </button>
      </div>
    </div>
  );
};
