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
      solid: 'bg-white shadow-[0_20px_60px_-40px_rgba(31,26,23,0.45)] rounded-3xl border border-ink/5',
      minimal: 'bg-transparent border border-ink/10 rounded-3xl',
    };

    return (
      <motion.div
        ref={ref}
        className={`${variantClasses[variant]} ${className}`}
        whileHover={hover ? { y: -8 } : {}}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';