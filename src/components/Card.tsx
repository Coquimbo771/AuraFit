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
      solid: 'bg-white shadow-lg rounded-2xl',
      minimal: 'bg-transparent border border-sage/20 rounded-2xl',
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