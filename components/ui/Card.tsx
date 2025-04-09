import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
  hoverable?: boolean;
  gradient?: 'none' | 'blue' | 'gray';
}

/**
 * Card - A versatile container component with consistent styling
 * Supports the project's design system with gradient and shadow options
 */
const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title,
  noPadding = false,
  hoverable = false,
  gradient = 'none'
}) => {
  // Apply appropriate gradient based on prop
  const gradientClass = gradient === 'none' 
    ? '' 
    : gradient === 'blue' 
      ? 'bg-gradient-blue' 
      : 'bg-gradient-gray';
      
  // Apply card shadow with hover effect if requested
  const shadowClass = hoverable 
    ? 'card-shadow' 
    : 'shadow-card';
    
  return (
    <div className={`bg-white rounded-lg ${shadowClass} ${gradientClass} ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
};

export default Card;