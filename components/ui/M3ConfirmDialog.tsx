import React from 'react';
import { M3Dialog } from './M3Dialog';
import { M3Button } from './M3Button';
import { AlertTriangle, HelpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface M3ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const M3ConfirmDialog: React.FC<M3ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes, Proceed',
  cancelText = 'No, Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <ShieldAlert className="w-5 h-5 text-[var(--m3-error)]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[var(--m3-tertiary)]" />;
      default:
        return <HelpCircle className="w-5 h-5 text-[var(--m3-primary)]" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'filled'; // will be styled with error
      case 'warning':
        return 'filled';
      default:
        return 'filled';
    }
  };

  return (
    <M3Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={getIcon()}
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-[var(--m3-on-surface-variant)] leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--m3-outline-variant)]">
          <M3Button variant="text" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </M3Button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              variant === 'danger'
                ? 'bg-[var(--m3-error)] text-[var(--m3-on-error)] hover:opacity-90'
                : variant === 'warning'
                ? 'bg-[var(--m3-tertiary)] text-[var(--m3-on-tertiary)] hover:opacity-90'
                : 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] hover:opacity-90'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </M3Dialog>
  );
};
