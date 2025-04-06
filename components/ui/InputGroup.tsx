import React, { ReactNode } from "react";

interface InputGroupProps {
  label: string;
  error?: string;
  helpText?: string;
  children: ReactNode;
  className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  error,
  helpText,
  children,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputGroup;