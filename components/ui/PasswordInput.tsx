'use client';

import React, { useState, forwardRef, InputHTMLAttributes } from 'react';
import Input from './Input';
import IconButton from './IconButton';
import { EyeIcon, XIcon } from './Icons';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helpText?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helpText, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };
    
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          label={label}
          error={error}
          helpText={helpText}
          className={className}
          {...props}
        />
        <div className="absolute right-2 top-[30px] flex items-center">
          <IconButton
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-gray-500 hover:text-blue-600 transition-colors duration-150"
            type="button"
          >
            {showPassword ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </IconButton>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;