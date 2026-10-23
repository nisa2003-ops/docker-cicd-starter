import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'running' | 'neutral' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    success: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      dotColor: 'bg-emerald-400',
    },
    warning: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      dotColor: 'bg-amber-400',
    },
    error: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      dotColor: 'bg-rose-400',
    },
    info: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/20',
      dotColor: 'bg-cyan-400',
    },
    running: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      dotColor: 'bg-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      dotColor: 'bg-purple-400',
    },
    neutral: {
      bg: 'bg-slate-800/60',
      text: 'text-slate-300',
      border: 'border-slate-700/50',
      dotColor: 'bg-slate-400',
    },
  };

  const current = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dotColor}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`} />
        </span>
      )}
      {children}
    </span>
  );
};
