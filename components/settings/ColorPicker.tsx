import React, { useState } from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  color, 
  onChange,
  description
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTempColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Validate hex code
    const newValue = e.target.value;
    if (newValue.match(/^#([0-9A-F]{0,6})$/i)) {
      setTempColor(newValue);
      if (newValue.length === 7) { // Complete hex code
        onChange(newValue);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-3">
        <div 
          className="relative cursor-pointer w-10 h-10 rounded-md shadow-inner border border-gray-300 overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: tempColor }}
          ></div>
          <input 
            type="color" 
            value={tempColor} 
            onChange={handleColorChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
        
        <input
          type="text"
          value={tempColor}
          onChange={handleInputChange}
          className="flex-1 max-w-[150px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="#000000"
        />
        
        <div 
          className="w-10 h-10 rounded-md shadow-inner border border-gray-300 flex items-center justify-center"
          style={{ backgroundColor: tempColor }}
        >
          <span className="text-xs font-mono" style={{ 
            color: isLightColor(tempColor) ? '#000' : '#fff' 
          }}>
            Aa
          </span>
        </div>
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

// Helper function to determine if a color is light
function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness according to YIQ formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

export default ColorPicker;