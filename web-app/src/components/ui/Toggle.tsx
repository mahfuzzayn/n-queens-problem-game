import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center justify-between gap-4 p-2.5 rounded-2xl cursor-pointer transition-colors ${
        disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-white/5'
      }`}
    >
      {(label || description) && (
        <div className="flex flex-col select-none">
          {label && <span className="font-bold text-sm text-white">{label}</span>}
          {description && <span className="text-xs text-purple-300/80">{description}</span>}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-13 shrink-0 rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
          checked
            ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-emerald-800 shadow-[0_2px_0_0_#064e3b]'
            : 'bg-zinc-700 border-zinc-900 shadow-[0_2px_0_0_#18181b]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out my-auto ml-0.5 ${
            checked ? 'translate-x-6 bg-amber-100' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};
