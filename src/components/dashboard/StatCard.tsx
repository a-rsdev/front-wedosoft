import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  subtitle: string;
  icon: ReactNode;
  accentColor: 'purple' | 'orange' | 'cyan' | 'lime';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  subtitle,
  icon,
  accentColor
}) => {
  const colorMap = {
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      hover: 'hover:border-purple-500/40'
    },
    orange: {
      text: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      hover: 'hover:border-orange-500/40'
    },
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      hover: 'hover:border-cyan-500/40'
    },
    lime: {
      text: 'text-[#5e8700]',
      bg: 'bg-[#f1f9d8] border-[#d7eca5]',
      hover: 'hover:border-[#c7e47e]'
    }
  };

  const current = colorMap[accentColor];

  return (
    <div className={`glass-panel rounded-2xl p-6 relative overflow-hidden group transition-all ${current.hover}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${current.text}`}>{title}</span>
        <div className={`p-2.5 rounded-xl border ${current.bg} ${current.text}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-extrabold text-[#172018]">
        {value} {suffix && <span className={`text-sm font-semibold ${current.text}`}>{suffix}</span>}
      </div>
      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
};
