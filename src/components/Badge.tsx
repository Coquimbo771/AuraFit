import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', icon }) => {
  const variantClasses = {
    primary: 'bg-ink/10 dark:bg-sand-50/10 text-ink dark:text-sand-50 border border-ink/20 dark:border-sand-50/20',
    success: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30',
    warning: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30',
    danger: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30',
    info: 'bg-sun/30 dark:bg-neon-blue/20 text-ink dark:text-neon-blue border border-sun/50 dark:border-neon-blue/40 dark:shadow-[0_0_10px_rgba(0,240,255,0.2)]',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${variantClasses[variant]}`}>
      {icon}
      {label}
    </div>
  );
};