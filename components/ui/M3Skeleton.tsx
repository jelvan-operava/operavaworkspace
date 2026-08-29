import React from 'react';

export interface M3SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'rounded';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export const M3Skeleton: React.FC<M3SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  width,
  height,
  animate = true,
}) => {
  let shapeClass = 'rounded-xl';

  if (variant === 'circular') {
    shapeClass = 'rounded-full';
  } else if (variant === 'text') {
    shapeClass = 'rounded-md';
  } else if (variant === 'rectangular') {
    shapeClass = 'rounded-none';
  } else if (variant === 'rounded') {
    shapeClass = 'rounded-2xl';
  }

  const animationClass = animate ? 'animate-pulse' : '';

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={style}
      className={`bg-[var(--m3-surface-container-high)] relative overflow-hidden ${shapeClass} ${animationClass} ${className}`}
      aria-hidden="true"
    >
      {/* Shimmer gradient overlay */}
      {animate && (
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[var(--m3-surface-container-lowest)]/20 to-transparent animate-[shimmer_1.8s_infinite]"
          style={{
            animation: 'shimmer 2s infinite linear',
          }}
        />
      )}
    </div>
  );
};
