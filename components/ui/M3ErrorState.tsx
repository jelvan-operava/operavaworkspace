import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, RefreshCw, ChevronDown, ChevronUp, ShieldAlert, LifeBuoy } from 'lucide-react';
import { M3Card } from './M3Card';
import { M3Button } from './M3Button';
import { M3Badge } from './M3Badge';

export interface M3ErrorStateProps {
  title?: string;
  description?: string;
  errorCode?: string;
  errorDetails?: string;
  onRetry?: () => void;
  onSecondaryAction?: () => void;
  secondaryActionText?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

export const M3ErrorState: React.FC<M3ErrorStateProps> = ({
  title = 'Failed to load data',
  description = 'An unexpected error occurred while fetching content from Google Workspace Cloud services. Please check your connection and try again.',
  errorCode = 'ERR_FETCH_TIMEOUT',
  errorDetails,
  onRetry,
  onSecondaryAction,
  secondaryActionText = 'Contact Support',
  icon,
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`w-full ${compact ? 'p-4' : 'py-8 px-4 sm:px-6'}`}
    >
      <M3Card
        variant="outlined"
        className={`max-w-2xl mx-auto border-[var(--m3-error)]/30 bg-[var(--m3-surface-container-low)] ${
          compact ? 'p-6' : 'p-8 sm:p-10'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          {/* M3 Error Icon Container */}
          <div className="w-16 h-16 rounded-3xl bg-[var(--m3-error-container)] text-[var(--m3-on-error-container)] flex items-center justify-center mb-5 shadow-sm">
            {icon || <AlertOctagon className="w-8 h-8 text-[var(--m3-error)]" />}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <M3Badge variant="error" size="sm" icon={<ShieldAlert className="w-3 h-3" />}>
              {errorCode}
            </M3Badge>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[var(--m3-on-surface)] tracking-tight mb-2">
            {title}
          </h3>

          <p className="text-sm sm:text-base text-[var(--m3-on-surface-variant)] leading-relaxed max-w-lg mb-6">
            {description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            {onRetry && (
              <M3Button
                variant="filled"
                size="md"
                onClick={onRetry}
                icon={<RefreshCw className="w-4 h-4" />}
                className="bg-[var(--m3-error)] text-[var(--m3-on-error)] hover:bg-[var(--m3-error)]/90"
              >
                Retry Fetching
              </M3Button>
            )}

            {onSecondaryAction && (
              <M3Button
                variant="outlined"
                size="md"
                onClick={onSecondaryAction}
                icon={<LifeBuoy className="w-4 h-4" />}
              >
                {secondaryActionText}
              </M3Button>
            )}
          </div>

          {/* Technical details accordion */}
          {errorDetails && (
            <div className="mt-6 w-full pt-4 border-t border-[var(--m3-outline-variant)]/60 text-left">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full text-xs font-semibold text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)] transition-colors py-1"
              >
                <span>View Diagnostic Details</span>
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-3 rounded-xl bg-[var(--m3-surface-container-highest)] text-xs font-mono text-[var(--m3-on-surface-variant)] overflow-x-auto whitespace-pre-wrap border border-[var(--m3-outline-variant)]"
                >
                  {errorDetails}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </M3Card>
    </motion.div>
  );
};
