import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'neon';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', variant = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    primary: 'border-sage',
    neon: 'border-neon-blue',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 ${colors[variant]} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};