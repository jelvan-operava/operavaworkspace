import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface M3DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const M3Dialog: React.FC<M3DialogProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  actions,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWClass} bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)] rounded-3xl p-6 shadow-2xl border border-[var(--m3-outline-variant)] z-10 my-auto overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2.5 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center">
                    {icon}
                  </div>
                )}
                {title && (
                  <h3 className="text-xl font-semibold text-[var(--m3-on-surface)] tracking-tight">
                    {title}
                  </h3>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--m3-surface-container-highest)] text-[var(--m3-on-surface-variant)] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="text-sm text-[var(--m3-on-surface-variant)] space-y-4 mb-6">
              {children}
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--m3-outline-variant)]">
                {actions}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
