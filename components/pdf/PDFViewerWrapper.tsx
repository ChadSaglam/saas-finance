import React, { RefObject, useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { PDFDocumentElement } from '@/lib/types/pdf';

interface PDFViewerWrapperProps {
  children: PDFDocumentElement;
  pdfWrapperRef: RefObject<HTMLDivElement>;
  onDocumentLoadSuccess: (document: any) => void;
}

export const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({
  children,
  pdfWrapperRef,
  onDocumentLoadSuccess
}) => {
  const [checkAttempts, setCheckAttempts] = useState(0);
  
  // Use effect to monitor when the PDF is loaded through iframe
  useEffect(() => {
    const maxAttempts = 10;
    const attemptDelay = 300;
    
    const checkPDFPageCount = () => {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow && iframe.contentDocument) {
        try {
          // Method 1: Try to find the page containers in the rendered PDF
          const pageContainers = iframe.contentDocument.querySelectorAll('.react-pdf__Page');
          if (pageContainers && pageContainers.length > 0) {
            console.log('Found PDF pages:', pageContainers.length);
            onDocumentLoadSuccess({ numPages: pageContainers.length });
            return true;
          }
          
          // Method 2: Look for page labels or other indicators
          const pageLabels = iframe.contentDocument.querySelectorAll('[data-page-number]');
          if (pageLabels && pageLabels.length > 0) {
            console.log('Found PDF page labels:', pageLabels.length);
            onDocumentLoadSuccess({ numPages: pageLabels.length });
            return true;
          }
          
          // Method 3: Check if there's a PDF.js instance with page info
          if ((iframe.contentWindow as any).PDFViewerApplication) {
            const pages = (iframe.contentWindow as any).PDFViewerApplication.pagesCount;
            if (pages) {
              console.log('Found PDF.js page count:', pages);
              onDocumentLoadSuccess({ numPages: pages });
              return true;
            }
          }
        } catch (err) {
          console.warn('Error checking PDF pages:', err);
        }
      }
      return false;
    };
    
    // First immediate check
    if (!checkPDFPageCount() && checkAttempts < maxAttempts) {
      // If not successful, set up an interval to retry
      const interval = setInterval(() => {
        setCheckAttempts(prev => {
          const newAttempt = prev + 1;
          if (checkPDFPageCount() || newAttempt >= maxAttempts) {
            clearInterval(interval);
            if (newAttempt >= maxAttempts) {
              console.log('Reached max attempts, defaulting to 1 page');
              onDocumentLoadSuccess({ numPages: 1 });
            }
          }
          return newAttempt;
        });
      }, attemptDelay);
      
      return () => clearInterval(interval);
    }
  }, [checkAttempts, onDocumentLoadSuccess, children]);

  return (
    <div 
      id="pdf-viewer-container" 
      className="flex-grow bg-gray-200 overflow-auto"
    >
      <div 
        ref={pdfWrapperRef}
        className="transform-gpu origin-top-center transition-transform duration-200 ease-out h-full"
        style={{ width: '100%' }}
      >
        <PDFViewer 
          width="100%" 
          height="100%" 
          style={{ border: 'none' }}
          showToolbar={false}
        >
          {children}
        </PDFViewer>
      </div>
    </div>
  );
};