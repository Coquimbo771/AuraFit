import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'neon' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', children, ...props }, ref) => {
    const baseClasses = 'font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2';

    const variantClasses = {
      primary: 'bg-sage text-white hover:bg-sage-700 active:scale-95',
      neon: 'bg-neon-blue text-black hover:shadow-lg hover:shadow-neon-blue/50 active:scale-95',
      secondary: 'border-2 border-sage text-sage hover:bg-sage/10 active:scale-95',
      ghost: 'text-sage hover:bg-sage/5 active:scale-95',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        whileHover={{ scale: variant === 'ghost' ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';