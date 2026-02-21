import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'minimal';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', hover = true, className = '', children, ...props }, ref) => {
    const variantClasses = {
      glass: 'glass',
      solid: 'bg-white dark:bg-dark-800/50 shadow-[0_20px_60px_-40px_rgba(31,26,23,0.45)] dark:shadow-[0_20px_60px_-20px_rgba(0,240,255,0.15)] rounded-2xl sm:rounded-3xl border border-ink/5 dark:border-neon-blue/20 backdrop-blur-xl transition-all duration-300',
      minimal: 'bg-transparent border border-ink/10 dark:border-sand-50/10 rounded-2xl sm:rounded-3xl transition-colors duration-300',
    };

    return (
      <motion.div
        ref={ref}
        className={`${variantClasses[variant]} ${className}`}
        whileHover={hover ? { y: -8, scale: 1.02 } : {}}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';