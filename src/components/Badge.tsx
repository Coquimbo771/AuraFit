import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', icon }) => {
  const variantClasses = {
    primary: 'bg-ink/10 text-ink border border-ink/20',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border border-rose-200',
    info: 'bg-sun/30 text-ink border border-sun/50',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {icon}
      {label}
    </div>
  );
};