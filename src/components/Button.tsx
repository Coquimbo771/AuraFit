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
    const baseClasses = 'font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 border border-transparent';

    const variantClasses = {
      primary: 'bg-ember text-ink hover:bg-ember-600 active:scale-95 shadow-[0_14px_30px_-16px_rgba(255,107,53,0.7)]',
      neon: 'bg-sun text-ink hover:bg-sun-600 active:scale-95 shadow-[0_14px_30px_-16px_rgba(255,200,87,0.7)]',
      secondary: 'border-2 border-ink/30 text-ink hover:bg-ink/5 active:scale-95',
      ghost: 'text-ink hover:bg-ink/5 active:scale-95',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs sm:text-sm',
      md: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
      lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg',
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