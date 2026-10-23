import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'blue';
  progressPercent?: number;
  progressBarColor?: string;
  badge?: React.ReactNode;
  borderStyle?: 'solid' | 'dashed';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  accentColor = 'cyan',
  progressPercent,
  progressBarColor,
  badge,
  borderStyle = 'dashed',
}) => {
  const accentBorderMap = {
    cyan: 'border-cyan-500/25 hover:border-cyan-500/40',
    purple: 'border-purple-500/25 hover:border-purple-500/40',
    emerald: 'border-emerald-500/25 hover:border-emerald-500/40',
    amber: 'border-amber-500/25 hover:border-amber-500/40',
    rose: 'border-rose-500/25 hover:border-rose-500/40',
    blue: 'border-blue-500/25 hover:border-blue-500/40',
  };

  const iconColorMap = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div
      className={`relative p-5 rounded-xl bg-[#0d1424]/90 backdrop-blur-md transition-all duration-200 ${
        borderStyle === 'dashed' ? 'border border-dashed' : 'border'
      } ${accentBorderMap[accentColor]} group`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 group-hover:text-slate-300">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge}
          {icon && (
            <div
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 ${iconColorMap[accentColor]}`}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-1 mt-1 mb-2">
        <span className="text-3xl font-bold tracking-tight text-white font-mono">{value}</span>
        {unit && <span className="text-sm font-semibold text-slate-400 font-mono">{unit}</span>}
      </div>

      {progressPercent !== undefined && (
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 my-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressBarColor || (accentColor === 'purple' ? 'bg-purple-500' : 'bg-cyan-500')
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}

      {subtitle && <p className="text-xs text-slate-400 font-mono truncate">{subtitle}</p>}
    </div>
  );
};
