"use client";

import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  loadingText,
  fullWidth = false,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 text-gray-800',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus:ring-blue-500 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700',
  };

  const sizeStyles = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Disabled or loading styles override the variant styles
  const disabledStyles = (disabled || isLoading) 
    ? 'opacity-50 cursor-not-allowed pointer-events-none bg-gray-300 text-gray-500 border-gray-300 shadow-none' 
    : '';

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        // Using the custom loader class from globals.css
        <div className="loader mr-2" />
      )}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;