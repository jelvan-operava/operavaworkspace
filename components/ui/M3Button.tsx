import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface M3ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'fab';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  icon,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  let baseClass = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ';

  if (size === 'sm') {
    baseClass += 'text-xs h-8 px-4 gap-1.5 ';
  } else if (size === 'lg') {
    baseClass += 'text-base h-12 px-6 gap-2.5 rounded-2xl ';
  } else {
    // md
    baseClass += 'text-sm h-10 px-5 gap-2 ';
  }

  if (variant === 'filled') {
    baseClass += 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] hover:opacity-90 shadow-sm hover:shadow-md ';
  } else if (variant === 'tonal') {
    baseClass += 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] hover:brightness-95 ';
  } else if (variant === 'outlined') {
    baseClass += 'bg-transparent text-[var(--m3-primary)] border border-[var(--m3-outline)] hover:bg-[var(--m3-surface-container-high)] ';
  } else if (variant === 'text') {
    baseClass += 'bg-transparent text-[var(--m3-primary)] hover:bg-[var(--m3-surface-container-low)] px-3 ';
  } else if (variant === 'fab') {
    baseClass = 'inline-flex items-center justify-center font-semibold rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] shadow-md hover:shadow-lg h-14 px-5 gap-3 text-sm hover:scale-105 transition-transform duration-200 ';
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      disabled={disabled}
      className={`${baseClass} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </motion.button>
  );
};
