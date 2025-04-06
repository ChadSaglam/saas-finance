import React, { useState } from "react";
import Label from "./Label";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  maxSizeInMB?: number;
  onChange: (file: File | null) => void;
  helpText?: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept,
  maxSizeInMB = 5,
  onChange,
  helpText,
  error,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrorMessage(null);

    if (file) {
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        setErrorMessage(`File size exceeds ${maxSizeInMB}MB limit`);
        return;
      }

      onChange(file);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      <Label text={label} htmlFor={id} />
      <label className="block mt-1">
        <span className="sr-only">Choose file</span>
        <input
          id={id}
          type="file"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          accept={accept}
          onChange={handleFileChange}
        />
      </label>
      {helpText && !errorMessage && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {(errorMessage || error) && (
        <p className="mt-1 text-sm text-red-600">{errorMessage || error}</p>
      )}
    </div>
  );
};

export default FileUpload;