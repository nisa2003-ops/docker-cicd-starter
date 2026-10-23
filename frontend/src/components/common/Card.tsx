import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  accentBorder?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  accentBorder = 'none',
  onClick,
}) => {
  const accentStyles: Record<string, string> = {
    none: 'border-slate-800/80',
    cyan: 'border-cyan-500/30 hover:border-cyan-500/50',
    purple: 'border-purple-500/30 hover:border-purple-500/50',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/50',
    amber: 'border-amber-500/30 hover:border-amber-500/50',
  };

  const glowStyle = glow ? 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.12)]' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-[#0d1424]/90 backdrop-blur-md rounded-xl border ${accentStyles[accentBorder]} ${glowStyle} transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-[#111a2e]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
