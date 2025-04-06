import React, { useEffect } from 'react';
import { BlobProvider, DocumentProps } from '@react-pdf/renderer';
import { PDFDocumentElement } from '@/lib/types/pdf';

interface PDFGeneratorProps {
  document: PDFDocumentElement;
  onComplete: (blob: Blob) => void;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ document, onComplete }) => {
  return (
    <BlobProvider document={document}>
      {({ blob, url, loading, error }) => {
        useEffect(() => {
          if (blob && !loading && !error) {
            onComplete(blob);
          }
        }, [blob, loading, error]);
        
        // Hidden component - no visible UI
        return null;
      }}
    </BlobProvider>
  );
};

export default PDFGenerator;