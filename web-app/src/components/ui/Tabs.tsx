import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 p-1 bg-[#140a2b] border-2 border-[#2f1559] rounded-2xl ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all select-none ${
              isActive
                ? 'bg-gradient-to-b from-[#ffdf58] to-[#df9d15] text-[#4a2e05] border-2 border-[#825505] shadow-[0_2px_0_0_#825505]'
                : 'text-purple-300 hover:text-white hover:bg-white/5 border-2 border-transparent'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
