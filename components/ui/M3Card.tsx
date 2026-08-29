import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface M3CardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'filled' | 'outlined';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const M3Card: React.FC<M3CardProps> = ({
  variant = 'filled',
  elevation = 0,
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  // M3 Surface elevations & variants
  let baseStyles = 'rounded-3xl transition-all duration-200 overflow-hidden ';

  if (variant === 'elevated') {
    baseStyles += 'bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] ';
    if (elevation === 1) baseStyles += 'shadow-sm ';
    if (elevation === 2) baseStyles += 'shadow-md ';
    if (elevation === 3) baseStyles += 'shadow-lg ';
    if (elevation >= 4) baseStyles += 'shadow-xl ';
  } else if (variant === 'outlined') {
    baseStyles += 'bg-[var(--m3-surface)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] ';
  } else {
    // filled
    baseStyles += 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] ';
  }

  const interactiveMotion = interactive
    ? {
        whileHover: { y: -2, scale: 1.005 },
        whileTap: { scale: 0.99 },
      }
    : {};

  return (
    <motion.div
      className={`${baseStyles} ${interactive ? 'cursor-pointer hover:border-[var(--m3-outline)]' : ''} ${className}`}
      {...interactiveMotion}
      {...props}
    >
      {children}
    </motion.div>
  );
};
