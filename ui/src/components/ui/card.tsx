import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800 bg-[#0f172a]/90 backdrop-blur-md p-5 shadow-lg shadow-black/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'purple' | 'cyan' | 'red' | 'emerald' | 'amber';
  className?: string;
}) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    warning: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
    purple: 'bg-purple-950/70 text-purple-400 border-purple-800/60',
    cyan: 'bg-sky-950/70 text-sky-400 border-sky-800/60',
    red: 'bg-rose-950/70 text-rose-400 border-rose-800/60',
    emerald: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    amber: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

