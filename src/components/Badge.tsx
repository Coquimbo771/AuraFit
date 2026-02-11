import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', icon }) => {
  const variantClasses = {
    primary: 'bg-sage/20 text-sage border border-sage/30',
    success: 'bg-green-100 text-green-700 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    danger: 'bg-red-100 text-red-700 border border-red-300',
    info: 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {icon}
      {label}
    </div>
  );
};