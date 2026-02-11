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
          <label className="block text-sm font-medium text-sage mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/50">{icon}</div>}
          <input
            ref={ref}
            className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} rounded-xl border-2 border-sage/20 focus:border-sage focus:outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm ${className} ${
              error ? 'border-red-500' : ''
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-sage pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';