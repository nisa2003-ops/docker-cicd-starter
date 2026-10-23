import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'glow';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'text-xs px-2.5 py-1 gap-1.5',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 border border-cyan-400/40',
    glow: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 border border-cyan-400/30',
    secondary:
      'bg-slate-800/90 text-slate-100 hover:bg-slate-750 hover:text-white border border-slate-700/80 hover:border-slate-600',
    outline:
      'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/80 hover:border-slate-500',
    danger:
      'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/40 hover:border-rose-500/60',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
