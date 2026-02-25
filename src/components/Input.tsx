import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-ink/60 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-ink/50">{icon}</div>}
          <input
            ref={ref}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${icon ? 'pl-10 sm:pl-12' : ''} rounded-xl sm:rounded-2xl border-2 border-ink/10 focus:border-ember focus:outline-none transition-colors duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base ${className} ${
              error ? 'border-rose-500' : ''
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-ember pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>
        {error && <p className="text-red-500 text-xs sm:text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';