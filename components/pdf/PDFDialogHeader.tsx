import React from 'react';
import Button from '@/components/ui/Button';
import { 
  DownloadIcon, 
  XIcon, 
  ExpandIcon, 
  PrinterIcon
} from '@/components/ui/Icons';

interface PDFDialogHeaderProps {
  title: string;
  isFullscreen: boolean;
  isGenerating: boolean;
  onPrint: () => void;
  onDownload: () => Promise<void>;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export const PDFDialogHeader: React.FC<PDFDialogHeaderProps> = ({
  title,
  isFullscreen,
  isGenerating,
  onPrint,
  onDownload,
  onToggleFullscreen,
  onClose
}) => {
  return (
    <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
      <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onPrint}
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center"
          title="Print document"
        >
          <PrinterIcon className="h-4 w-4 mr-1" />
          <span>Print</span>
        </Button>
        <Button
          onClick={onDownload}
          disabled={isGenerating}
          isLoading={isGenerating}
          loadingText="Generating..."
          variant="primary"
          size="sm"
          className="hidden sm:flex items-center"
        >
          <DownloadIcon className="h-4 w-4 mr-1" />
          <span>Download</span>
        </Button>
        <Button
          onClick={onToggleFullscreen}
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <ExpandIcon className="h-4 w-4 mr-1" />
          <span>Fullscreen</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={onClose}
          size="sm"
          className="flex items-center"
        >
          <XIcon className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Close</span>
        </Button>
      </div>
    </div>
  );
};