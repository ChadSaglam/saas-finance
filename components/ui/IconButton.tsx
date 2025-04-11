import React, { ButtonHTMLAttributes, forwardRef } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}, ref) => {
  // Base styles that apply to all variants
  const baseStyles = 'inline-flex items-center justify-center rounded-md focus:outline-none transition-colors duration-200';
  
  // Size classes
  const sizeClasses = {
    sm: 'p-1 w-6 h-6',
    md: 'p-1.5 w-8 h-8',
    lg: 'p-2 w-10 h-10',
  };
  
  // Variant specific styles
  const variantClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500',
  };
  
  return (
    <button
      ref={ref}
      type={type}
      className={`${baseStyles} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;