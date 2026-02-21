import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-dark-800/95 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-[90vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto z-50 border border-ink/10 dark:border-neon-blue/20 shadow-[0_30px_80px_-40px_rgba(31,26,23,0.6)] dark:shadow-[0_30px_80px_-20px_rgba(0,240,255,0.3)] backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {title && <h2 className="text-xl sm:text-2xl font-bold text-ink dark:text-sand-50 mb-3 sm:mb-4">{title}</h2>}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};