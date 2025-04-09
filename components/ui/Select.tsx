import React, { SelectHTMLAttributes, forwardRef, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  iconColor?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helpText, className = "", iconColor = "#4f46e5", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <div className={`mb-4 ${className}`}>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`appearance-none block w-full px-3 py-2.5 pr-10 border rounded-md shadow-sm bg-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all duration-200 ease-in-out
              ${error ? "border-red-500" : isFocused ? "border-blue-500" : "border-gray-300"}
              ${props.disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "hover:border-gray-400"}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom Dropdown Arrow */}
          <div 
            className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none
              transition-transform duration-200 ease-in-out ${isFocused ? "transform rotate-180" : ""}`}
            style={{ color: error ? "#ef4444" : isFocused ? "#4f46e5" : "#6b7280" }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path 
                fillRule="evenodd" 
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        
        {helpText && (
          <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;