import React from 'react';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  showValue = true,
  disabled = false,
  className = '',
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={`flex flex-col gap-1.5 w-full select-none ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-bold text-purple-200">
          {label && <span>{label}</span>}
          {showValue && <span className="text-amber-400 font-extrabold">{value}</span>}
        </div>
      )}

      <div className="relative flex items-center w-full h-8">
        {/* Track Background */}
        <div className="absolute w-full h-2.5 bg-[#140a26] border-2 border-[#43257a] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          {/* Active Fill Track */}
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native Range Input with custom appearance */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-8 opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
        />

        {/* Visual Custom 3D Thumb */}
        <div
          className="absolute -translate-x-1/2 pointer-events-none transition-transform duration-75 flex items-center justify-center z-10"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 border-2 border-yellow-100 shadow-[0_3px_6px_rgba(0,0,0,0.6),0_2px_0_0_#78350f] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-800/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
