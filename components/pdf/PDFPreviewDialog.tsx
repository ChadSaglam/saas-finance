import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import Button from '@/components/ui/Button';
import { PDFDocumentElement } from '@/lib/types/pdf';
import { DownloadIcon, XIcon, ExpandIcon } from '@/components/ui/Icons';


interface PDFPreviewDialogProps {
  title: string;
  children: PDFDocumentElement;
  onDownload: () => Promise<void>;
  onClose: () => void;
  isGenerating: boolean;
}

const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({ 
  title, 
  children, 
  onDownload, 
  onClose, 
  isGenerating 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const pdfViewer = document.getElementById('pdf-viewer-container');
      if (pdfViewer) {
        pdfViewer.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Use portal to attach at the root level
  useEffect(() => {
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-gray-900 bg-opacity-90 flex items-center justify-center p-0 mt-10 sm:p-2">
      <div className="w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col bg-white rounded-none sm:rounded-lg shadow-xl">
        <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={onDownload} 
              disabled={isGenerating}
              isLoading={isGenerating}
              loadingText="Generating..."
              variant="primary"
              className="hidden sm:flex"
              size="sm"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <ExpandIcon className="h-4 w-4" />
              <span className="ml-1">Fullscreen</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              size="sm"
            >
              <XIcon className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          </div>
        </div>
        
        <div 
          id="pdf-viewer-container" 
          className="flex-grow bg-gray-200 overflow-hidden"
        >
          <PDFViewer 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            showToolbar={true}
          >
            {children}
          </PDFViewer>
        </div>
        
        {/* Mobile download button */}
        <div className="sm:hidden p-3 border-t border-gray-200 bg-gray-50">
          <Button 
            onClick={onDownload} 
            disabled={isGenerating} 
            isLoading={isGenerating}
            loadingText="Generating..."
            variant="primary"
            fullWidth
          >
            <DownloadIcon className="h-5 w-5 mr-1" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewDialog;