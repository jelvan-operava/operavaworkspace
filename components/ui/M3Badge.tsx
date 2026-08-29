import React from 'react';

export interface M3BadgeProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'outline';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const M3Badge: React.FC<M3BadgeProps> = ({
  variant = 'primary',
  children,
  icon,
  className = '',
  size = 'md',
}) => {
  let styles = 'inline-flex items-center rounded-lg font-medium text-xs tracking-wide transition-colors ';

  if (size === 'sm') {
    styles += 'px-2 py-0.5 gap-1 text-[11px] ';
  } else {
    styles += 'px-3 py-1 gap-1.5 ';
  }

  switch (variant) {
    case 'primary':
      styles += 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]';
      break;
    case 'secondary':
      styles += 'bg-[var(--m3-secondary-container)] text-[var(--m3-on-secondary-container)]';
      break;
    case 'tertiary':
      styles += 'bg-[var(--m3-tertiary-container)] text-[var(--m3-on-tertiary-container)]';
      break;
    case 'success':
      styles += 'bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)]';
      break;
    case 'warning':
      styles += 'bg-[var(--m3-warning-container)] text-[var(--m3-on-warning-container)]';
      break;
    case 'error':
      styles += 'bg-[var(--m3-error-container)] text-[var(--m3-on-error-container)]';
      break;
    case 'outline':
      styles += 'border border-[var(--m3-outline)] text-[var(--m3-on-surface-variant)] bg-transparent';
      break;
  }

  return (
    <span className={`${styles} ${className}`}>
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  );
};
