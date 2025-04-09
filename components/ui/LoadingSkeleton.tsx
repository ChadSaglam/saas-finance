import React from 'react';

interface LoadingSkeletonProps {
  height?: string;
  width?: string;
  className?: string;
  rounded?: boolean;
  animate?: boolean;
}

/**
 * LoadingSkeleton - A component for displaying loading states
 * 
 * @param height - Height of the skeleton (default: "100px")
 * @param width - Width of the skeleton (default: "100%")
 * @param className - Additional CSS classes
 * @param rounded - Whether to show rounded corners (default: true)
 * @param animate - Whether to show animation (default: true)
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  height = "100px",
  width = "100%",
  className = "",
  rounded = true,
  animate = true
}) => {
  return (
    <div 
      className={`${animate ? 'animate-pulse' : ''} bg-gray-200 ${rounded ? 'rounded-lg' : ''} ${className}`}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
};

export default LoadingSkeleton;