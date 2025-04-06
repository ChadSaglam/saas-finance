import React from "react";

interface RadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  id: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  layout?: 'vertical' | 'horizontal';
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  id,
  name,
  options,
  value,
  onChange,
  layout = 'vertical',
  error
}) => {
  return (
    <div>
      <div className={`mt-2 ${layout === 'horizontal' ? 'grid grid-cols-3 gap-3' : 'space-y-2'}`}>
        {options.map((option) => (
          <div key={option.value} className="flex">
            <button
              type="button"
              className={`border rounded-md px-3 py-2 flex items-center justify-center text-sm font-medium ${
                value === option.value 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label}
            </button>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default RadioGroup;