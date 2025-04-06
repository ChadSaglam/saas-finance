import React, { useState, useRef } from 'react';
import Button from '@/components/ui/Button';

interface LogoUploaderProps {
  currentLogo?: string;
  onLogoChange: (logoUrl: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ currentLogo, onLogoChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // For demo purposes, we're creating an object URL
    // In production, you would upload to your server or cloud storage
    const newLogoUrl = URL.createObjectURL(file);
    setPreviewUrl(newLogoUrl);
    onLogoChange(newLogoUrl);
    
    // In a real app with MongoDB:
    // 1. Convert file to base64 or FormData
    // 2. Upload to your API endpoint
    // 3. Store the returned URL
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    onLogoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Company Logo</label>
      
      {previewUrl ? (
        // Logo preview with hover controls
        <div 
          className="relative w-full max-w-xs h-40 border border-gray-300 rounded-md overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src={previewUrl} 
            alt="Company logo" 
            className="w-full h-full object-contain p-2"
          />
          
          {/* Overlay controls on hover */}
          {isHovering && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
              <Button size="sm" onClick={handleUploadClick}>
                Change
              </Button>
              <Button size="sm" variant="danger" onClick={handleRemoveLogo}>
                Remove
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Upload button when no logo
        <div 
          onClick={handleUploadClick}
          className="w-full max-w-xs h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Click to upload logo</p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <p className="text-xs text-gray-500 italic">
        Recommended size: 400x100 pixels. Your logo will appear on invoices and offers.
      </p>
    </div>
  );
};

export default LogoUploader;