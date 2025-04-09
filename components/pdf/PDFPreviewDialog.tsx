import React, { useRef } from 'react';
import { PDFDocumentElement } from '@/lib/types/pdf';
import { usePDFViewer } from '@/lib/hooks/UsePDFViewer';
import { PDFDialogHeader } from './PDFDialogHeader';
import { PDFControls } from './PDFControls';
import { PDFViewerWrapper } from './PDFViewerWrapper';
import { PDFMobileActions } from './PDFMobileActions';

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
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  
  const { 
    isFullscreen,
    currentPage,
    totalPages,
    scale,
    toggleFullscreen,
    zoomIn,
    zoomOut,
    resetZoom,
    goToPrevPage,
    goToNextPage,
    handleDocumentLoadSuccess,
    handlePrint,
    setCurrentPage
  } = usePDFViewer({ 
    onClose, 
    pdfWrapperRef: pdfWrapperRef as React.RefObject<HTMLDivElement>
  });

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-gray-900 bg-opacity-90 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full h-full max-w-[95vw] max-h-[90vh] flex flex-col bg-white rounded-lg shadow-xl">
        {/* Header */}
        <PDFDialogHeader
          title={title}
          isFullscreen={isFullscreen}
          isGenerating={isGenerating}
          onPrint={handlePrint}
          onDownload={onDownload}
          onToggleFullscreen={toggleFullscreen}
          onClose={onClose}
        />
        
        {/* PDF Viewer */}
        <div className="flex-grow flex flex-col">
          {/* PDF Controls */}
          <PDFControls
            currentPage={currentPage}
            totalPages={totalPages}
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            onPageChange={setCurrentPage}
          />
          
          {/* The actual PDF viewer */}
          <PDFViewerWrapper
            children={children}
            pdfWrapperRef={pdfWrapperRef as React.RefObject<HTMLDivElement>}
            onDocumentLoadSuccess={handleDocumentLoadSuccess}
          />
        </div>
        
        {/* Mobile actions */}
        <PDFMobileActions
          onPrint={handlePrint}
          onDownload={onDownload}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default PDFPreviewDialog;