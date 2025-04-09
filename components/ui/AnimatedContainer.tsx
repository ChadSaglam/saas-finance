import { ReactNode } from 'react';

type AnimationType = 'fade-in' | 'slide-in-right' | 'slide-in-up' | 'none';

interface AnimatedContainerProps {
  children: ReactNode;
  animation: AnimationType;
  delay?: number; // delay in ms
  duration?: number; // duration in ms
  className?: string;
}

/**
 * AnimatedContainer - Applies consistent animations to child elements
 * Follows project's modular and responsive design principles
 */
const AnimatedContainer = ({ 
  children, 
  animation = 'fade-in', 
  delay = 0,
  duration = 300,
  className = ''
}: AnimatedContainerProps) => {
  // Map animation type to CSS classes from globals.css
  const animationClass = animation === 'none' 
    ? '' 
    : `animate-${animation}`;
    
  const style = {
    animationDelay: delay > 0 ? `${delay}ms` : undefined,
    animationDuration: `${duration}ms`
  };

  return (
    <div className={`${animationClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default AnimatedContainer;