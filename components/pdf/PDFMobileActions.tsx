import React from 'react';
import Button from '@/components/ui/Button';
import { DownloadIcon, PrinterIcon } from '@/components/ui/Icons';

interface PDFMobileActionsProps {
  onPrint: () => void;
  onDownload: () => Promise<void>;
  isGenerating: boolean;
}

export const PDFMobileActions: React.FC<PDFMobileActionsProps> = ({
  onPrint,
  onDownload,
  isGenerating
}) => {
  return (
    <div className="sm:hidden p-3 flex space-x-2 border-t border-gray-200 bg-gray-50">
      <Button 
        onClick={onPrint}
        variant="outline"
        size="sm"
        className="flex-1 flex items-center justify-center"
      >
        <PrinterIcon className="h-4 w-4 mr-1" />
        Print
      </Button>
      <Button 
        onClick={onDownload} 
        disabled={isGenerating} 
        isLoading={isGenerating}
        loadingText="Generating..."
        variant="primary"
        size="sm"
        className="flex-1 flex items-center justify-center"
      >
        <DownloadIcon className="h-4 w-4 mr-1" />
        Download
      </Button>
    </div>
  );
};