import { useState, useEffect, RefObject } from 'react';

interface PDFViewerOptions {
  onClose: () => void;
  initialScale?: number;
  pdfWrapperRef: RefObject<HTMLDivElement>;
}

export function usePDFViewer({ onClose, initialScale = 1, pdfWrapperRef }: PDFViewerOptions) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(initialScale);
  
  // Toggle fullscreen mode
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

  // Zoom controls
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setScale(1);

  // Page navigation
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const handleDocumentLoadSuccess = (document: any) => {
    // Check if the document is valid and has page information
    if (document && document._pdfInfo) {
      const pageCount = document._pdfInfo.numPages;
      console.log('PDF loaded with', pageCount, 'pages');
      setTotalPages(pageCount);
    } else if (document && document.numPages) {
      // Alternative way to access page count
      console.log('PDF loaded with', document.numPages, 'pages');
      setTotalPages(document.numPages);
    } else {
      console.warn('Could not determine PDF page count', document);
      // Default to at least 1 page
      setTotalPages(1);
    }
  };
  
  // Handle print functionality
  const handlePrint = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  // Update wrapper element's transform with animation
  useEffect(() => {
    if (pdfWrapperRef.current) {
      pdfWrapperRef.current.style.transform = `scale(${scale})`;
    }
  }, [scale, pdfWrapperRef]);

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Prevent scrolling on body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullscreen) {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === '+' && e.ctrlKey) {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' && e.ctrlKey) {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0' && e.ctrlKey) {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, totalPages, onClose]);

  return {
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
  };
}